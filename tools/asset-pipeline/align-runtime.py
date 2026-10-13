"""One-time relocation of our own verified Phase 2 outputs; preserve all originals."""
from pathlib import Path
import json,hashlib,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
records=json.loads((ROOT/'ASSET_WORK/reports/promoted-assets.json').read_text())
replacements={'models/characters/cartoon-boy.glb':'models/characters/player/cartoon-boy.glb','models/sanctuary/':'models/environment/sanctuary/','textures/roads/':'textures/materials/roads/'}
for base in ['src','tools/asset-pipeline']:
 for p in (ROOT/base).rglob('*'):
  if p.suffix not in ['.ts','.mjs']: continue
  text=p.read_text(encoding='utf8');changed=text
  for old,new in replacements.items(): changed=changed.replace(old,new)
  if changed!=text:p.write_text(changed,encoding='utf8')
subprocess.run([sys.executable,str(ROOT/'tools/asset-pipeline/promote.py')],check=True)
for record in records:
 old=ROOT/record['production_file'];new=old.as_posix()
 for a,b in replacements.items():new=new.replace(a,b)
 if old.as_posix()==new:continue
 target=Path(new)
 assert old.resolve().is_relative_to((ROOT/'public/assets').resolve())
 assert target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest()==record['sha256']
 assert hashlib.sha256(old.read_bytes()).hexdigest()==record['sha256']
 old.unlink() # Only our exact previously promoted derivative, after verified copy.
for name in ['models/characters/player','models/characters/npc','models/dragons','models/creatures/ambient','models/environment/sanctuary','models/environment/outskirts','models/environment/regions','textures/characters','textures/dragons','textures/environment','textures/materials/roads']:
 (ROOT/'public/assets'/name).mkdir(parents=True,exist_ok=True)
print('Aligned verified derivative destinations; preserved historical files.')
