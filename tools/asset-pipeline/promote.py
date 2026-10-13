"""Explicit curated Phase 2 promotion. Never modifies protected source assets."""
from pathlib import Path
import hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[2]
jobs=[('characters/cartoon-boy-runtime.glb','models/characters/player/cartoon-boy.glb'),('dragons/mountain.glb','models/dragons/mountain-young.glb'),('environment/market-stall.glb','models/environment/sanctuary/market-stall.glb')]
jobs += [(f'environment/village-{name}-runtime.glb',f'models/environment/sanctuary/village-{name}.glb') for name in ['body','body2','tower','flag','cart']]
jobs += [(f'materials/stone-pathway-{name}.jpg',f'textures/materials/roads/stone-pathway-{name}.jpg') for name in ['albedo','normal','roughness','ao']]
report=[]
for src,dst in jobs:
 source=ROOT/'ASSET_WORK'/src;target=ROOT/'public/assets'/dst
 assert source.is_file() and source.stat().st_size>0
 target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,target)
 report.append(dict(working_file=source.relative_to(ROOT).as_posix(),production_file=target.relative_to(ROOT).as_posix(),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
(ROOT/'ASSET_WORK/reports/promoted-assets.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('Promoted',len(report),'curated files;',sum(x['bytes'] for x in report),'bytes. Historical Nature GLB untouched.')
