"""Repeatable work-library preparation; never promotes or edits source files."""
from pathlib import Path
import json,subprocess,sys,struct,io,hashlib
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
BLENDER=Path('C:/Program Files/Blender Foundation/Blender 4.5/blender.exe')
def convert(source,dest,prepare=False):
    output=ROOT/dest
    command=[str(BLENDER),'--background','--factory-startup','--python-exit-code','1','--python',str(ROOT/'tools/asset-pipeline/convert.py'),'--',source,dest]+(['--prepare'] if prepare else [])
    with (ROOT/'ASSET_WORK/reports'/f'{output.stem}-blender.log').open('w',encoding='utf8') as log:
        r=subprocess.run(command,cwd=ROOT,stdout=log,stderr=subprocess.STDOUT)
    print(output.stem,'PASS' if r.returncode==0 and output.exists() else 'FAILED',flush=True)
def optimize_glb(source,dest,maxsize=2048):
    raw=(ROOT/source).read_bytes();length,kind=struct.unpack_from('<II',raw,12);doc=json.loads(raw[20:20+length]);binary=raw[28+length:];out=bytearray();changes=[]
    images={im['bufferView']:im for im in doc.get('images',[]) if 'bufferView' in im}
    for i,view in enumerate(doc.get('bufferViews',[])):
        offset=view.get('byteOffset',0);payload=binary[offset:offset+view['byteLength']]
        if i in images:
            im=Image.open(io.BytesIO(payload));old=list(im.size)
            if max(im.size)>maxsize:im.thumbnail((maxsize,maxsize),Image.Resampling.LANCZOS)
            buf=io.BytesIO();fmt='PNG' if im.mode=='RGBA' else 'JPEG'
            if fmt=='JPEG':im=im.convert('RGB');im.save(buf,format=fmt,quality=90)
            else:im.save(buf,format=fmt,optimize=True)
            payload=buf.getvalue();images[i]['mimeType']='image/png' if fmt=='PNG' else 'image/jpeg';changes.append(dict(image=images[i].get('name',i),before=old,after=list(im.size),format=fmt))
        out.extend(b'\0'*((-len(out))%4));view['byteOffset']=len(out);view['byteLength']=len(payload);out.extend(payload)
    out.extend(b'\0'*((-len(out))%4));doc['buffers'][0]['byteLength']=len(out)
    data=json.dumps(doc,separators=(',',':')).encode();data+=b' '*((-len(data))%4)
    glb=struct.pack('<4sII',b'glTF',2,12+8+len(data)+8+len(out))+struct.pack('<II',len(data),0x4e4f534a)+data+struct.pack('<II',len(out),0x004e4942)+out
    target=ROOT/dest;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(glb)
    target.with_suffix('.conversion.json').write_text(json.dumps(dict(source=source,source_hash=hashlib.sha256(raw).hexdigest(),output=dest,output_hash=hashlib.sha256(glb).hexdigest(),source_bytes=len(raw),output_bytes=len(glb),resizing=changes,geometry_changes=False,animations_preserved=len(doc.get('animations',[]))),indent=2),encoding='utf8')
    print(target.stem,len(raw),'->',len(glb),'bytes',flush=True)
if __name__=='__main__':
    task=sys.argv[1]
    if task=='fbx':
        jobs=[('dragons/tarisland-dragon/M_B_44_Qishilong_skin_Skeleton.FBX','dragons/tarisland.glb'),('dragons/bernardo-dragon/source/Dragon_Animated.fbx','dragons/bernardo.glb'),('dragons/chinese-dragon/source/Chinese dragon.fbx','dragons/chinese.glb'),('creatures/ambient/horse/source/HORSE_DEMO.fbx','creatures/horse.glb'),('environment/sanctuary/medieval-village-scene/source/Scene.fbx','environment/medieval-scene.glb'),('environment/sanctuary/fantasy-castle/Castle.fbx','environment/castle.glb')]
        for src,dst in jobs:convert('SOURCE_ASSETS/'+src,'ASSET_WORK/'+dst)
    elif task=='village':
        jobs=[('buildings/SM_BLD_body_v01_01.fbx','body'),('buildings/SM_BLD_base_v01_01.fbx','base'),('buildings/SM_BLD_body_v02_01.fbx','body2'),('props/SM_PROP_watchtower_wood_01.fbx','tower'),('props/SM_PROP_flag_01.fbx','flag'),('props/SM_PROP_bridge_stone_01.fbx','bridge'),('props/SM_PROP_cart_01.fbx','cart')]
        for src,dst in jobs:convert('SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/'+src,'ASSET_WORK/environment/village-'+dst+'.glb',True)
    elif task=='glb':
        optimize_glb('SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb','ASSET_WORK/dragons/mountain.glb')
        optimize_glb('SOURCE_ASSETS/dragons/wyvern-animated/wyvern_animated.glb','ASSET_WORK/dragons/wyvern.glb')
        optimize_glb('SOURCE_ASSETS/environment/sanctuary/fantasy-market/Fantasy_Vendor_Market_Free_8_Stall_Kit_V01.glb','ASSET_WORK/environment/market-stall.glb',1024)
    elif task=='road':
        folder=ROOT/'SOURCE_ASSETS/materials/roads/stone-pathway/textures';output=ROOT/'ASSET_WORK/materials';output.mkdir(exist_ok=True)
        for name,src in [('albedo','diff_4k.jpg'),('normal','nor_gl_4k.jpg'),('ao','ao_4k.png')]:
            p=folder/('stone_pathway_'+src);im=Image.open(p)
            # PIL's direct I;16 -> RGB conversion clips samples above 255.
            if im.mode=='I;16':im=Image.fromarray(np.round(np.asarray(im,dtype=np.float32)/257).astype(np.uint8),'L')
            im=im.convert('RGB');im.thumbnail((1024,1024),Image.Resampling.LANCZOS);im.save(output/f'stone-pathway-{name}.jpg',quality=93)
        # ARM contains AO(R), roughness(G), metallic(B). Extract supplied roughness.
        im=Image.open(folder/'stone_pathway_arm_4k.jpg').getchannel('G');im.thumbnail((1024,1024),Image.Resampling.LANCZOS);im.convert('RGB').save(output/'stone-pathway-roughness.jpg',quality=93)
        print('Four 1K runtime road maps, unchanged 4K originals',flush=True)
