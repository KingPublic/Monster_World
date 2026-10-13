from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[2]
REPORTS=ROOT/'ASSET_WORK/reports'
def long(p):return Path('\\\\?\\'+str(p.resolve()))
for index,p in enumerate(sorted(REPORTS.glob('browser-audit-*.json'))):
 if len(str(p))>245:
  target=REPORTS/f'browser-audit-batch-{index}.json'
  assert p.resolve().is_relative_to(REPORTS.resolve()) and not target.exists()
  long(p).rename(long(target))
for p in REPORTS.glob('browser-audit-*.json'):
 data=json.loads(p.read_text())
 print(p.name)
 for x in data['records']:
  a=x.get('initial',{})
  print(' ',x['id'],x['variant']['name'],a.get('sceneTriangles'),a.get('joints'),len(x.get('clips',[])),a.get('error',x.get('error','')))
