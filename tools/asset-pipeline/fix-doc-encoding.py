"""Repair only Unicode tokens damaged by the Phase 2 Windows default encoding."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
for name in ['README.md','ASSET_MANIFEST.md','TASKS/README.md']:
 p=ROOT/name;text=p.read_text(encoding='utf8');before=text
 for char in '—–→←…·’‘“”é':
  try:broken=char.encode('utf8').decode('cp1252')
  except UnicodeDecodeError:continue
  text=text.replace(broken,char)
 if name=='TASKS/README.md':text=text.replace('\n\n| [06 —','\n| [06 —')
 p.write_text(text,encoding='utf8');print(name,'repaired' if text!=before else 'unchanged')
for name in ['update-docs.py','reports.py','integration-report.py']:
 p=ROOT/'tools/asset-pipeline'/name;text=p.read_text(encoding='utf8');text=text.replace('.read_text()',".read_text(encoding='utf8')");p.write_text(text,encoding='utf8')
