import sys,importlib.util,json,struct,io,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[2];sys.path.insert(0,str(root/'tools/asset-pipeline'))
spec=importlib.util.spec_from_file_location('reduction',root/'tools/asset-pipeline/polish-derivatives.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
results=[]
for label in ['family','lod1']:
 source=root/f'ASSET_WORK/iteration2/ashscale-{label}.glb';raw,doc,binary=mod.unpack(source)
 views=[binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']] for v in doc['bufferViews']]
 changes=[]
 for animation in doc['animations']:
  for channel in animation['channels']:
   sampler=animation['samplers'][channel['sampler']];kind=channel['target']['path']
   def array(i):
    a=doc['accessors'][i];assert a['componentType']==5126 and 'sparse' not in a
    width={'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']];v=doc['bufferViews'][a['bufferView']];assert 'byteStride' not in v
    return np.frombuffer(views[a['bufferView']],dtype='<f4',count=a['count']*width,offset=a.get('byteOffset',0)).reshape(-1,width).astype(float)
   times=array(sampler['input']).ravel();values=array(sampler['output'])
   tolerance=.0008 if kind=='rotation' else .00002
   indices,worst=mod.reduce_keys(times,values,tolerance,kind=='rotation')
   # Accessors may share time views, so replace sampler references with new accessors.
   for key,arr in [('input',times[indices,None]),('output',values[indices])]:
    original=doc['accessors'][sampler[key]];a=dict(original);a.pop('byteOffset',None)
    a['bufferView']=len(views);a['count']=len(arr)
    if 'min' in a:a['min']=arr.min(axis=0).tolist()
    if 'max' in a:a['max']=arr.max(axis=0).tolist()
    views.append(np.asarray(arr,dtype='<f4').tobytes());doc['bufferViews'].append({'buffer':0,'byteLength':len(views[-1])})
    sampler[key]=len(doc['accessors']);doc['accessors'].append(a)
   changes.append({'clip':animation['name'],'joint':doc['nodes'][channel['target']['node']].get('name'),'kind':kind,'before':len(times),'after':len(indices),'maxSampleError':worst,'tolerance':tolerance})
 # Rebuild only referenced accessors and buffer views, eliminating old animation bytes.
 used=set()
 for mesh in doc['meshes']:
  for primitive in mesh['primitives']:used.update(primitive['attributes'].values());used.add(primitive['indices'])
 for skin in doc.get('skins',[]):used.add(skin['inverseBindMatrices'])
 for animation in doc['animations']:
  for sampler in animation['samplers']:used.update([sampler['input'],sampler['output']])
 amap={old:new for new,old in enumerate(sorted(used))};doc['accessors']=[doc['accessors'][i] for i in sorted(used)]
 for mesh in doc['meshes']:
  for p in mesh['primitives']:p['attributes']={k:amap[v] for k,v in p['attributes'].items()};p['indices']=amap[p['indices']]
 for skin in doc.get('skins',[]):skin['inverseBindMatrices']=amap[skin['inverseBindMatrices']]
 for animation in doc['animations']:
  for s in animation['samplers']:s['input']=amap[s['input']];s['output']=amap[s['output']]
 usedViews=sorted({a['bufferView'] for a in doc['accessors']}|{im['bufferView'] for im in doc.get('images',[])})
 vmap={old:new for new,old in enumerate(usedViews)};views=[views[i] for i in usedViews];doc['bufferViews']=[doc['bufferViews'][i] for i in usedViews]
 for a in doc['accessors']:a['bufferView']=vmap[a['bufferView']]
 for im in doc['images']:
  im['bufferView']=vmap[im['bufferView']];index=im['bufferView'];image=Image.open(io.BytesIO(views[index])).convert('RGB');image.thumbnail((1024,1024));out=io.BytesIO();image.save(out,format='JPEG',quality=90);views[index]=out.getvalue();im['mimeType']='image/jpeg'
 dest=root/f'public/assets/models/dragons/ashscale-{label}.glb';mod.pack(doc,views,dest)
 results.append({'file':str(dest.relative_to(root)),'bytes':dest.stat().st_size,'hash':hashlib.sha256(dest.read_bytes()).hexdigest(),'clips':[a['name'] for a in doc['animations']],'joints':len(doc['skins'][0]['joints']),'triangles':sum(doc['accessors'][p['indices']]['count']//3 for m in doc['meshes'] for p in m['primitives']),'keyReduction':changes})
(root/'ASSET_WORK/iteration2/ashscale-final.json').write_text(json.dumps(results,indent=2))
print(json.dumps([{k:v for k,v in r.items() if k!='keyReduction'} for r in results],indent=2))
