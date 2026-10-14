"""Verify protected inputs and manifest the current outputs, without re-auditing."""
import json,hashlib,sys
from pathlib import Path
root=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(Path(__file__).parent))
from audit import inventory
work=(root/'ASSET_WORK'/(sys.argv[1] if len(sys.argv)>1 else 'iteration2')).resolve()
assert work.is_relative_to((root/'ASSET_WORK').resolve()),'Evidence output must stay inside ASSET_WORK'
work.mkdir(parents=True,exist_ok=True)
before=json.loads((root/'ASSET_WORK/reports/source-hashes-before.json').read_text())
after=inventory();differences=[p for p in before.keys()|after.keys() if before.get(p)!=after.get(p)]
(work/'source-integrity.json').write_text(json.dumps({'pass':not differences,'protectedFiles':len(after),'differences':differences},indent=2))
assert not differences,differences
previous=json.loads((root/'ASSET_WORK/polish/runtime-manifest.json').read_text())
files=previous['currentGameplayFiles'];unchanged=[]
for item in files:
 p=root/item['path'];sha=hashlib.sha256(p.read_bytes()).hexdigest();assert sha==item['sha256'],item['path'];unchanged.append(item['path'])
for name in ['ashscale-family.glb','ashscale-lod1.glb']:
 p=root/'public/assets/models/dragons'/name;files.append({'path':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(work/'runtime-manifest.json').write_text(json.dumps({'date':'2026-10-13','currentGameplayFiles':files,'priorGameplayOutputsUnchanged':unchanged,'sourceGroupsUsed':9,'downloadedDragonSilhouettes':2,'appearanceLineages':4,'scope':'Local authorized iteration; no release clearance'},indent=2))
print('PASS',len(after),'protected input files and',len(unchanged),'prior runtime outputs unchanged; two new Ashscale derivatives added')
