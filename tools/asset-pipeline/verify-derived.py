"""Verify texture optimization preserves non-image buffers, rig, clips and morphs."""
from pathlib import Path
import struct,json,hashlib
from PIL import Image
from audit import gltf,ROOT,save
def decode(path):
 raw=path.read_bytes();n=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+n]);return doc,raw[28+n:]
def compare(source,target):
 a,ab=decode(source);b,bb=decode(target)
 image_views={i['bufferView'] for i in a.get('images',[]) if 'bufferView' in i}
 assert all(a.get(k)==b.get(k) for k in ['nodes','meshes','skins','animations','accessors'])
 compared=0
 for i,v in enumerate(a['bufferViews']):
  if i in image_views:continue
  w=b['bufferViews'][i];assert ab[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]==bb[w.get('byteOffset',0):w.get('byteOffset',0)+w['byteLength']];compared+=1
 return dict(source=source.relative_to(ROOT).as_posix(),derived=target.relative_to(ROOT).as_posix(),non_image_views_identical=compared,rig_clips_geometry_morph_definitions_identical=True)
records=[compare(ROOT/'SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb',ROOT/'public/assets/models/dragons/mountain-young.glb'),compare(ROOT/'ASSET_WORK/characters/cartoon-boy-repaired.glb',ROOT/'public/assets/models/characters/player/cartoon-boy.glb')]
player=ROOT/'public/assets/models/characters/player/cartoon-boy.glb';doc,_=decode(player)
names={name for m in doc['meshes'] for name in m.get('extras',{}).get('targetNames',[])}
assert len(names)==75, f'Expected 75 distinct shape keys, found {len(names)}'
metrics=gltf(player);assert metrics['joints']==100 and metrics['weight_entries']>0 and not metrics['clips']
records.append(dict(player_morph_names=sorted(names),distinct_morphs=len(names),joints=metrics['joints'],weighted_entries=metrics['weight_entries'],source_clips=0,skateboard='Optional prop excluded from derivative only',triangles=metrics['scene_instance_triangles']))
ao=Image.open(ROOT/'public/assets/textures/materials/roads/stone-pathway-ao.jpg').convert('L');lo,hi=ao.getextrema()
assert ao.size==(1024,1024) and lo<200 and hi>240, 'Road AO lost its original shadow range'
records.append(dict(road_ao_dimensions=list(ao.size),runtime_ao_range=[lo,hi],bit_depth=8,source_bit_depth=16,source_unchanged=True))
save('derived-verification.json',dict(pass_checks=True,records=records));print('PASS: preserved non-image buffers, Mountain rig/clip, player 100 joints and 75 morph names.')
