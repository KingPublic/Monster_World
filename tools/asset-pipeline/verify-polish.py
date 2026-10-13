"""Verify final promoted files, non-image fidelity and bounded montage keys."""
from pathlib import Path
import json,hashlib
import numpy as np
from polish_derivative_support import compare_texture_only,verify_family

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'ASSET_WORK/polish'
jobs=[('traveler','SOURCE_ASSETS/characters/npc/traveler/traveler.glb','models/characters/npc/traveler.glb','traveler.glb'),('knight','SOURCE_ASSETS/characters/npc/knight-of-tomorrow/source/Knight_Done.glb','models/characters/npc/knight.glb','knight.glb'),('horse','ASSET_WORK/creatures/horse.glb','models/creatures/ambient/horse.glb','horse.glb'),('village-tree','ASSET_WORK/polish/village-tree.glb','models/environment/sanctuary/village-tree.glb','village-tree-runtime.glb')]
records=[]
for name,source,target,work in jobs:
    target=ROOT/'public/assets'/target
    record=compare_texture_only(ROOT/source,target)
    if name=='village-tree':
        from polish_derivative_support import unpack
        promotion=json.loads((OUT/'village-tree-promotion.json').read_text())
        assert hashlib.sha256(target.read_bytes()).hexdigest()==promotion['output_sha256']
        doc,_=unpack(target)
        assert doc['scenes'][doc.get('scene',0)]['nodes']==promotion['selected_nodes']
        assert all(doc['nodes'][i]['name'].endswith('LOD0') for i in promotion['selected_nodes'])
        record['selectedSceneNodes']=promotion['selected_nodes'];record['unreachableAlternativeLodBuffersRetained']=True
    else:assert target.read_bytes()==(OUT/work).read_bytes(),'Published derivative differs: '+name
    records.append(dict(asset=name,**record))
records.append(dict(asset='mountain-family',**verify_family(ROOT/'public/assets/models/dragons/mountain-young.glb',ROOT/'public/assets/models/dragons/mountain-family.glb')))
assert (ROOT/'public/assets/models/dragons/mountain-family.glb').read_bytes()==(OUT/'mountain-family.glb').read_bytes()
for record in records:
    path=ROOT/record['output'];record['bytes']=path.stat().st_size;record['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
(OUT/'derived-verification.json').write_text(json.dumps({'pass':True,'records':records},indent=2),encoding='utf8')
print('PASS five promoted derivatives; unchanged geometry/skins; ambient clips exact;264 family channels checked against every original key')
