"""Remove only Phase 2's obsolete duplicate destinations after hash checks."""
from pathlib import Path
from PIL import Image
import io,hashlib,json
ROOT=Path(__file__).resolve().parents[2];ASSETS=ROOT/'public/assets'
sha=lambda data:hashlib.sha256(data).hexdigest()
white=io.BytesIO();Image.new('RGB',(1024,1024),'white').save(white,format='JPEG',quality=93)
old_ao=sha(white.getvalue());removed=[]
for item in json.loads((ROOT/'ASSET_WORK/reports/promoted-assets.json').read_text()):
 target=ROOT/item['production_file'];rel=target.relative_to(ASSETS).as_posix()
 old=rel.replace('models/characters/player/','models/characters/').replace('models/environment/sanctuary/','models/sanctuary/').replace('textures/materials/roads/','textures/roads/')
 if old==rel:continue
 duplicate=ASSETS/old
 if not duplicate.exists():continue
 assert duplicate.resolve().is_relative_to(ASSETS.resolve())
 assert sha(target.read_bytes())==item['sha256']
 expected=old_ao if old.endswith('stone-pathway-ao.jpg') else item['sha256']
 assert sha(duplicate.read_bytes())==expected, f'Unknown content: {duplicate}'
 duplicate.unlink();removed.append(old)
(ROOT/'ASSET_WORK/reports/removed-duplicate-derivatives.json').write_text(json.dumps(removed,indent=2))
print('Removed',len(removed),'verified obsolete derivative copies; source and historical GLB untouched.')
