"""Immutable-source polish derivatives. Error-bounded animation key reduction and PBR fixes."""
from pathlib import Path
from collections import Counter
import json, struct, io, hashlib
import numpy as np
from PIL import Image
from prepare import optimize_glb

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'ASSET_WORK' / 'polish'
OUT.mkdir(parents=True, exist_ok=True)

def unpack(path):
    raw = path.read_bytes()
    n = struct.unpack_from('<I', raw, 12)[0]
    return raw, json.loads(raw[20:20+n]), raw[28+n:]

def pack(doc, views, dest):
    data = bytearray()
    for view, payload in zip(doc['bufferViews'], views):
        data.extend(b'\0' * (-len(data) % 4))
        view['byteOffset'], view['byteLength'] = len(data), len(payload)
        data.extend(payload)
    data.extend(b'\0' * (-len(data) % 4))
    doc['buffers'][0]['byteLength'] = len(data)
    meta = json.dumps(doc, separators=(',', ':')).encode()
    meta += b' ' * (-len(meta) % 4)
    dest.write_bytes(struct.pack('<4sII', b'glTF', 2, 28+len(meta)+len(data)) + struct.pack('<II', len(meta), 0x4e4f534a) + meta + struct.pack('<II',len(data),0x004e4942) + data)

def interpolation(a, b, alpha, rotation):
    if not rotation:
        return a + (b - a) * alpha[:, None]
    a, b = a / np.linalg.norm(a), b / np.linalg.norm(b)
    dot = np.dot(a, b)
    if dot < 0:
        b, dot = -b, -dot
    angle = np.arccos(np.clip(dot, -1, 1))
    if angle < .00001:
        predicted = a + (b-a)*alpha[:,None]
    else:
        predicted = (np.sin((1-alpha)*angle)[:,None]*a + np.sin(alpha*angle)[:,None]*b) / np.sin(angle)
    return predicted / np.linalg.norm(predicted, axis=1)[:, None]

def errors(expected, predicted, rotation):
    if rotation:
        normalized = expected / np.linalg.norm(expected, axis=1)[:, None]
        return 2 * np.arccos(np.clip(np.abs(np.sum(normalized*predicted,axis=1)), 0, 1))
    return np.max(np.abs(expected-predicted), axis=1)

def reduce_keys(times, values, tolerance, rotation):
    keep = {0, len(times)-1}
    todo = [(0,len(times)-1)]
    while todo:
        first, last = todo.pop()
        if last-first < 2:
            continue
        alpha = (times[first+1:last]-times[first])/(times[last]-times[first])
        difference = errors(values[first+1:last],interpolation(values[first],values[last],alpha,rotation),rotation)
        pivot = int(np.argmax(difference)) + first + 1
        if difference[pivot-first-1] > tolerance:
            keep.add(pivot)
            todo.extend([(first,pivot),(pivot,last)])
    indices = np.array(sorted(keep),dtype=np.int32)
    worst = 0.
    for first,last in zip(indices[:-1],indices[1:]):
        alpha = (times[first:last+1]-times[first])/(times[last]-times[first])
        difference = errors(values[first:last+1],interpolation(values[first],values[last],alpha,rotation),rotation)
        worst = max(worst,float(difference.max()))
    assert worst <= tolerance * 1.01 + 1e-8, (worst,tolerance)
    return indices,worst

def mountain():
    source = ROOT/'public/assets/models/dragons/mountain-young.glb'
    raw,doc,binary = unpack(source)
    views = [binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']] for v in doc['bufferViews']]
    animation = doc['animations'][0]
    # The supplied montage has independent float32 time/value accessors per channel.
    assert Counter(s['input'] for s in animation['samplers']).most_common(1)[0][1] == 1
    def array(index):
        a = doc['accessors'][index]
        width = {'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']]
        assert a['componentType']==5126 and 'sparse' not in a
        v = doc['bufferViews'][a['bufferView']]
        assert 'byteStride' not in v
        offset = v.get('byteOffset',0)+a.get('byteOffset',0)
        return np.frombuffer(binary,dtype='<f4',count=a['count']*width,offset=offset).reshape(-1,width).astype(np.float64)
    reductions, replacements = [], {}
    for channel in animation['channels']:
        sampler = animation['samplers'][channel['sampler']]
        assert sampler.get('interpolation','LINEAR')=='LINEAR'
        times,values = array(sampler['input']).ravel(),array(sampler['output'])
        kind = channel['target']['path']
        tolerance = .0007 if kind=='rotation' else .000015 if kind=='scale' else .025
        indices,worst = reduce_keys(times,values,tolerance,kind=='rotation')
        for index,arr in [(sampler['input'],times[indices,None]),(sampler['output'],values[indices])]:
            assert index not in replacements
            replacements[index] = np.asarray(arr,dtype='<f4')
        reductions.append({'node':doc['nodes'][channel['target']['node']].get('name'),'path':kind,'before':len(times),'after':len(indices),'tolerance':tolerance,'maxSampleError':worst})
    # Repack only animation views; geometry, skins, nodes, morphs remain identical.
    for index in sorted(set(doc['accessors'][a]['bufferView'] for a in replacements)):
        data = bytearray()
        for a_index,accessor in enumerate(doc['accessors']):
            if accessor.get('bufferView')!=index:
                continue
            assert a_index in replacements, 'unexpected non-animation data in shared view'
            arr = replacements[a_index]
            data.extend(b'\0' * (-len(data)%4))
            accessor['byteOffset'],accessor['count']=len(data),len(arr)
            if 'min' in accessor: accessor['min']=arr.min(axis=0).tolist()
            if 'max' in accessor: accessor['max']=arr.max(axis=0).tolist()
            data.extend(arr.tobytes())
        views[index]=bytes(data)
    # Correct named source maps: GLOSS is roughness inverse, ILLUM is emission.
    gloss_index = next(i for i,v in enumerate(doc['images']) if 'GLOSS' in v.get('name',''))
    illum_index = next(i for i,v in enumerate(doc['images']) if 'ILLUM' in v.get('name',''))
    gloss_texture = next(i for i,t in enumerate(doc['textures']) if t['source']==gloss_index)
    illum_texture = next(i for i,t in enumerate(doc['textures']) if t['source']==illum_index)
    gloss_view = doc['images'][gloss_index]['bufferView']
    gloss = np.asarray(Image.open(io.BytesIO(views[gloss_view])).convert('RGB'),dtype=np.uint8)
    packed = np.zeros_like(gloss);packed[:,:,0]=255;packed[:,:,1]=np.maximum(55,255-gloss[:,:,1])
    rough = Image.fromarray(packed);buffer=io.BytesIO();rough.save(buffer,format='JPEG',quality=93)
    views[gloss_view]=buffer.getvalue();doc['images'][gloss_index]['name']='Mountain-runtime-roughness-from-gloss.jpg'
    for material in doc['materials']:
        material['pbrMetallicRoughness']['metallicRoughnessTexture']={'index':gloss_texture}
        material['pbrMetallicRoughness']['roughnessFactor']=.92
        material['emissiveTexture']={'index':illum_texture};material['emissiveFactor']=[.22,.22,.22]
    target=OUT/'mountain-family.glb';pack(doc,views,target)
    report={'input':str(source.relative_to(ROOT)),'inputSha256':hashlib.sha256(raw).hexdigest(),'output':str(target.relative_to(ROOT)),'outputSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'beforeBytes':len(raw),'afterBytes':target.stat().st_size,'sourceFilesModified':False,'geometrySkinsNodesUnchanged':True,'clipName':animation['name'],'durationPreserved':True,'keyReduction':reductions,'materialFix':'GLOSS inverted to roughness; ILLUM used as emission, not roughness'}
    (OUT/'mountain-family.conversion.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps({k:v for k,v in report.items() if k!='keyReduction'},indent=2),flush=True)

if __name__=='__main__':
    import sys
    if sys.argv[1]=='mountain': mountain()
    elif sys.argv[1]=='ambient':
        jobs=[('SOURCE_ASSETS/characters/npc/traveler/traveler.glb','ASSET_WORK/polish/traveler.glb'),('SOURCE_ASSETS/characters/npc/knight-of-tomorrow/source/Knight_Done.glb','ASSET_WORK/polish/knight.glb'),('ASSET_WORK/creatures/horse.glb','ASSET_WORK/polish/horse.glb')]
        for source,dest in jobs:
            optimize_glb(source,dest,1024)
