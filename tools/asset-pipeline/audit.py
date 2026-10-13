"""Read-only source audit. python tools/asset-pipeline/audit.py snapshot|audit|verify."""
import argparse, hashlib, io, json, struct
from pathlib import Path
import numpy as np
from PIL import Image
from fbx import read_fbx

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'ASSET_WORK/reports'
def sha(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024), b''): h.update(b)
    return h.hexdigest()
def save(name, data):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT/name).write_text(json.dumps(data,indent=2),encoding='utf8')
def inventory():
    files = list((ROOT/'SOURCE_ASSETS').rglob('*')) + list((ROOT/'REFERENCES').rglob('*')) + [ROOT/'public/assets/models/dragons/3d-young-dragon-nature.glb']
    return {p.relative_to(ROOT).as_posix():{'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(files) if p.is_file()}
def image_info(payload):
    with Image.open(io.BytesIO(payload)) as im:
        bits=payload[24] if payload.startswith(b'\x89PNG\r\n\x1a\n') else 16 if '16' in im.mode else 32 if im.mode in ['F','I'] else 8
        return dict(dimensions=list(im.size),mode=im.mode,bit_depth=bits,format=im.format)

def exr_info(payload):
    assert payload[:4]==b'\x76\x2f\x31\x01','Invalid EXR header'
    cursor=8;attrs={}
    def string():
        nonlocal cursor
        end=payload.index(0,cursor);value=payload[cursor:end].decode('ascii');cursor=end+1;return value
    while payload[cursor]:
        name=string();kind=string();size=struct.unpack_from('<I',payload,cursor)[0];cursor+=4;attrs[name]=(kind,payload[cursor:cursor+size]);cursor+=size
    data=attrs['dataWindow'][1];xmin,ymin,xmax,ymax=struct.unpack('<iiii',data)
    channels={};data=attrs['channels'][1];offset=0
    while data[offset]:
        end=data.index(0,offset);name=data[offset:end].decode('ascii');offset=end+1;pixel=struct.unpack_from('<I',data,offset)[0];offset+=16;channels[name]={'type':{0:'UINT',1:'HALF',2:'FLOAT'}[pixel],'bits':16 if pixel==1 else 32}
    return dict(format='EXR',dimensions=[xmax-xmin+1,ymax-ymin+1],bit_depth=max(v['bits'] for v in channels.values()),channels=channels)
def gltf(path):
    raw=path.read_bytes(); binary=None
    if path.suffix.lower()=='.glb':
        magic,version,length=struct.unpack_from('<4sII',raw); assert magic==b'glTF' and version==2 and length==len(raw)
        n,kind=struct.unpack_from('<II',raw,12); assert kind==0x4e4f534a
        doc=json.loads(raw[20:20+n]); offset=20+n
        if offset<len(raw):
            n,kind=struct.unpack_from('<II',raw,offset); assert kind==0x004e4942
            binary=raw[offset+8:offset+8+n]
    else: doc=json.loads(raw)
    buffers=[]; dependencies=[]
    for b in doc.get('buffers',[]):
        if 'uri' in b:
            p=(path.parent/b['uri']).resolve(); assert p.is_relative_to(path.parent.resolve()); dependencies.append(str(p)); buffers.append(p.read_bytes())
        else: buffers.append(binary)
    def accessor(i):
        a=doc['accessors'][i]
        if 'bufferView' not in a: return None
        v=doc['bufferViews'][a['bufferView']]; width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']]
        dt=np.dtype({5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}[a['componentType']])
        return np.ndarray((a['count'],width),dtype=dt,buffer=buffers[v['buffer']],offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dt.itemsize*width),dt.itemsize))
    meshes=doc.get('meshes',[]); nodes=doc.get('nodes',[]); skins=doc.get('skins',[])
    triangles=[]; weighted=set(); weights=0; morphs=0
    for m in meshes:
        count=0
        for p in m['primitives']:
            a=doc['accessors'][p.get('indices',p['attributes']['POSITION'])]
            count+=a['count']//3 if p.get('mode',4)==4 else 0
            morphs+=len(p.get('targets',[]))
            if 'WEIGHTS_0' in p['attributes']:
                w=accessor(p['attributes']['WEIGHTS_0']);j=accessor(p['attributes']['JOINTS_0'])
                if w is not None and j is not None:
                    weights+=int((w>0).sum());weighted.update(int(x) for x in j[w>0])
        triangles.append(count)
    reachable=set()
    def visit(i):
        if i in reachable:return
        reachable.add(i)
        for c in nodes[i].get('children',[]):visit(c)
    scene=doc.get('scenes',[{}])[doc.get('scene',0)]
    for i in scene.get('nodes',[]):visit(i)
    clips=[];jointset={j for s in skins for j in s['joints']}
    for a in doc.get('animations',[]):
        inputs=[accessor(s['input']) for s in a['samplers']]
        times=[v for v in inputs if v is not None and len(v)]
        targets=[dict(node=c['target'].get('node'),name=nodes[c['target']['node']].get('name','') if 'node' in c['target'] else '',path=c['target']['path'],joint=c['target'].get('node') in jointset) for c in a['channels']]
        clips.append(dict(name=a.get('name','UNNAMED'),duration=float(max(v.max() for v in times)-min(v.min() for v in times)) if times else 'UNKNOWN',targets=targets,skeletal=any(t['joint'] for t in targets)))
    images=[]
    for im in doc.get('images',[]):
        if 'bufferView' in im:
            v=doc['bufferViews'][im['bufferView']];start=v.get('byteOffset',0);payload=buffers[v['buffer']][start:start+v['byteLength']]
        elif 'uri' in im:
            p=(path.parent/im['uri']).resolve(); assert p.is_relative_to(path.parent.resolve()); dependencies.append(str(p));payload=p.read_bytes()
        else:continue
        images.append(dict(name=im.get('name',im.get('uri','')),embedded='bufferView' in im,bytes=len(payload),**image_info(payload)))
    return dict(format=path.suffix[1:].upper(),mesh_definitions=len(meshes),primitives=sum(len(m['primitives']) for m in meshes),unique_triangles=sum(triangles),scene_instance_triangles=sum(triangles[nodes[i]['mesh']] for i in reachable if 'mesh' in nodes[i]),scene_mesh_instances=sum('mesh' in nodes[i] for i in reachable),materials=len(doc.get('materials',[])),images=images,joints=len(jointset),joint_names=[nodes[j].get('name',str(j)) for j in sorted(jointset)],skins=len(skins),weight_entries=weights,weighted_joint_indices=len(weighted),clips=clips,morph_targets=morphs,dependencies=dependencies,bounds='UNKNOWN; Asset Lab samples actual posed bounds',axis='glTF +Y up; forward must be visually verified')
def audit():
    roots=sorted((ROOT/'SOURCE_ASSETS').rglob('ASSET_INFO.md'));result=[]
    assert len(roots)==19
    for info in roots:
        root=info.parent
        # Read every required historical record; preserve as acquisition evidence only.
        def legacy_text(p):
            try:return p.read_text(encoding='utf-8-sig')
            except UnicodeDecodeError:return p.read_text(encoding='cp1252')
        history={'info':legacy_text(info),'inspection':json.loads(legacy_text(root/'INSPECTION.json')),'verification':json.loads(legacy_text(root/'SOURCE_FILE_VERIFICATION.json'))}
        records=[];textures=[];errors=[]
        for p in sorted(root.rglob('*')):
            if not p.is_file():continue
            ext=p.suffix.lower()
            try:
                if ext in ['.glb','.gltf']: data=gltf(p)
                elif ext=='.fbx': data=read_fbx(p)
                elif ext in ['.blend','.dae','.obj']: data={'format':ext[1:].upper(),'inspection':'UNKNOWN; GLB/FBX preferred for detailed metrics'}
                elif ext in ['.png','.jpg','.jpeg','.tga','.webp','.tif','.tiff','.bmp']:textures.append(dict(file=p.relative_to(root).as_posix(),**image_info(p.read_bytes())));continue
                elif ext=='.exr':textures.append(dict(file=p.relative_to(root).as_posix(),**exr_info(p.read_bytes())));continue
                else:continue
                records.append(dict(file=p.relative_to(root).as_posix(),bytes=p.stat().st_size,sha256=sha(p),**data))
            except Exception as e:errors.append(dict(file=p.relative_to(root).as_posix(),error=str(e)))
        result.append(dict(asset=root.name,root=root.relative_to(ROOT).as_posix(),acquisition_evidence=history,models=records,textures=textures,errors=errors))
        print(root.name,len(records),'models',len(textures),'textures',len(errors),'errors',flush=True)
    save('source-audit.json',result)
    # Catalog is exhaustive, and separates supplied collision/LOD/engine variants.
    village=next(a for a in result if a['asset']=='fantastic-village')
    lines=['# FANTASTIC Village actual file catalog','', 'Counts below cover individual files, never a concurrently placed scene.','', '| File | Triangles | Variant |','| --- | ---: | --- |']
    for m in village['models']:
        f=m['file'];variant='Collision' if 'collision' in f.lower() else 'UE vertex paint' if 'vertexpaint' in f.lower() else 'LOD' if 'lod' in f.lower() else 'Render'
        lines.append(f"| {f} | {m.get('triangles','UNKNOWN')} | {variant} |")
    (OUT/'fantastic-village-catalog.md').write_text('\n'.join(lines),encoding='utf8')
if __name__=='__main__':
    cmd=argparse.ArgumentParser();cmd.add_argument('action',choices=['snapshot','audit','verify']);args=cmd.parse_args()
    for folder in ['characters','dragons','creatures','environment','materials','reports','previews']:(ROOT/'ASSET_WORK'/folder).mkdir(parents=True,exist_ok=True)
    if args.action=='snapshot':
        assert not (OUT/'source-hashes-before.json').exists(),'Baseline already exists; never overwrite it'
        data=inventory();save('source-hashes-before.json',data);print(len(data),'protected files hashed')
    elif args.action=='verify':
        before=json.loads((OUT/'source-hashes-before.json').read_text());after=inventory();different=[k for k in before.keys()|after.keys() if before.get(k)!=after.get(k)];save('source-hashes-after.json',after);save('source-integrity.json',dict(pass_=not different,files=len(after),differences=different));assert not different,different;print('PASS',len(after),'protected files unchanged')
    else:audit()
