"""Read-only validation helpers; does not regenerate or mutate any model."""
import json,struct
import numpy as np
from pathlib import Path
import importlib.util
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('polish',Path(__file__).with_name('polish-derivatives.py'))
polish=importlib.util.module_from_spec(spec);spec.loader.exec_module(polish)

def unpack(path):
    raw=path.read_bytes();n=struct.unpack_from('<I',raw,12)[0];return json.loads(raw[20:20+n]),raw[28+n:]
def view(doc,binary,index):
    v=doc['bufferViews'][index];return binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]
def compare_texture_only(source,target):
    a,ab=unpack(source);b,bb=unpack(target)
    for k in ['nodes','meshes','skins','animations','accessors']:assert a.get(k)==b.get(k),(target,k)
    images={i['bufferView'] for i in a.get('images',[]) if 'bufferView' in i}
    checked=0
    for i in range(len(a['bufferViews'])):
        if i not in images:assert view(a,ab,i)==view(b,bb,i),(target,i);checked+=1
    return {'source':source.relative_to(ROOT).as_posix(),'output':target.relative_to(ROOT).as_posix(),'exactNonImageViews':checked,'geometrySkinsClipsMorphsIdentical':True}
def array(doc,binary,index):
    a=doc['accessors'][index];v=doc['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']]
    assert a['componentType']==5126 and 'byteStride' not in v
    return np.frombuffer(binary,dtype='<f4',offset=v.get('byteOffset',0)+a.get('byteOffset',0),count=a['count']*width).reshape(-1,width).astype(np.float64)
def verify_family(source,target):
    a,ab=unpack(source);b,bb=unpack(target)
    for k in ['nodes','meshes','skins']:assert a[k]==b[k],k
    animationViews={a['accessors'][s[p]]['bufferView'] for clip in a['animations'] for s in clip['samplers'] for p in ['input','output']}
    imageViews={i['bufferView'] for i in a['images']}
    for i in range(len(a['bufferViews'])):
        if i not in animationViews|imageViews:assert view(a,ab,i)==view(b,bb,i),i
    old,new=a['animations'][0],b['animations'][0];assert old['name']==new['name'] and old['channels']==new['channels'] and old['samplers']==new['samplers']
    worst={'rotation':0.,'translation':0.,'scale':0.};limits={'rotation':.0007,'translation':.025,'scale':.000015};keysBefore=keysAfter=0
    for channel in old['channels']:
        s=old['samplers'][channel['sampler']];times=array(a,ab,s['input']).ravel();values=array(a,ab,s['output']);rt=array(b,bb,s['input']).ravel();rv=array(b,bb,s['output'])
        assert times[0]==rt[0] and times[-1]==rt[-1]
        kind=channel['target']['path']
        if len(rt)==1:predicted=np.repeat(rv,len(times),axis=0)
        else:
            indices=np.clip(np.searchsorted(rt,times,side='right')-1,0,len(rt)-2);alpha=(times-rt[indices])/(rt[indices+1]-rt[indices])
            if kind=='rotation':predicted=np.array([polish.interpolation(rv[i],rv[i+1],np.array([f]),True)[0] for i,f in zip(indices,alpha)])
            else:predicted=rv[indices]+(rv[indices+1]-rv[indices])*alpha[:,None]
        error=float(polish.errors(values,predicted,kind=='rotation').max());assert error<=limits[kind]*1.02+1e-7,(kind,error)
        worst[kind]=max(worst[kind],error);keysBefore+=len(times);keysAfter+=len(rt)
    # Materials must point through the actual texture->image mapping.
    gloss=next(i for i,v in enumerate(b['images']) if 'roughness-from-gloss' in v['name']);illum=next(i for i,v in enumerate(b['images']) if 'ILLUM' in v.get('name',''))
    for material in b['materials']:
        assert b['textures'][material['pbrMetallicRoughness']['metallicRoughnessTexture']['index']]['source']==gloss
        assert b['textures'][material['emissiveTexture']['index']]['source']==illum
    return {'source':source.relative_to(ROOT).as_posix(),'output':target.relative_to(ROOT).as_posix(),'geometrySkinsNodesIdentical':True,'channels':len(old['channels']),'keysBefore':keysBefore,'keysAfter':keysAfter,'maximumErrorAtEveryOriginalKey':worst,'tolerances':limits,'durationPreserved':True,'materialMapIndicesVerified':True}
