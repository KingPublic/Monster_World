"""Explicit reviewed five-file polish promotion, never a directory-wide scan."""
from pathlib import Path
import json,struct,hashlib
ROOT=Path(__file__).resolve().parents[2]
work=ROOT/'ASSET_WORK/polish'
jobs=[('mountain-family.glb','models/dragons/mountain-family.glb','mountain-family.conversion.json','outputSha256'),('traveler.glb','models/characters/npc/traveler.glb','traveler.conversion.json','output_hash'),('knight.glb','models/characters/npc/knight.glb','knight.conversion.json','output_hash'),('horse.glb','models/creatures/ambient/horse.glb','horse.conversion.json','output_hash')]
prepared=[]
for source,target,sidecar,key in jobs:
    payload=(work/source).read_bytes();record=json.loads((work/sidecar).read_text());assert hashlib.sha256(payload).hexdigest()==record[key],source
    prepared.append((ROOT/'public/assets'/target,payload))
raw=(work/'village-tree-runtime.glb').read_bytes();record=json.loads((work/'village-tree-runtime.conversion.json').read_text());assert hashlib.sha256(raw).hexdigest()==record['output_hash']
size=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+size]);selected=[i for i,n in enumerate(doc['nodes']) if n.get('name','').endswith('LOD0')];assert selected,'No verified tree LOD0'
doc['scenes'][doc.get('scene',0)]['nodes']=selected;meta=json.dumps(doc,separators=(',',':')).encode();meta+=b' '*(-len(meta)%4);binary=raw[20+size:];payload=struct.pack('<4sII',b'glTF',2,20+len(meta)+len(binary))+struct.pack('<II',len(meta),0x4e4f534a)+meta+binary
prepared.append((ROOT/'public/assets/models/environment/sanctuary/village-tree.glb',payload))
for target,payload in prepared:
    target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(payload)
report=[{'file':str(p.relative_to(ROOT).as_posix()),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()} for p,data in prepared]
(work/'promotion.json').write_text(json.dumps({'files':report,'treeSelectedNodes':selected,'sourcesModified':False},indent=2),encoding='utf8')
print('Promoted only the five explicitly reviewed polish files; run verify-polish.py next.')
