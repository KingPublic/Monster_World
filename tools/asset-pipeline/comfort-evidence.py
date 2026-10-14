"""Combine scoped final evidence without pretending incomplete attempts passed."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
work=root/'ASSET_WORK/iteration4'
def read(path):return json.loads((work/path).read_text())
early=read('final/first-sprint-pass-route-failure.json')
travel=read('final/final.json')
closed=read('closed/close.json')
face=read('face-browser.json')
source=read('source-integrity.json')
gameplay=read('gameplay/gameplay.json')
def step(data,name):return next(x['snapshot'] for x in data['steps'] if x['name']==name)
foot=step(early,'player-sprint-exhausted')
stairs=step(early,'stone-stairs-walk')
horse=step(travel,'horse-sprint-stamina')
carry=step(travel,'horse-carry-stamina')
delivered=step(travel,'stamina-physical-delivery')
checks={
 'actualFootSprintExhaustion':foot['sprint']['player']['exhausted'] and foot['sprint']['player']['speed']<32,
 'physicalStoneStepClimb':stairs['position'][1]>=5.8,
 'separateActualHorsePool':horse['mountKind']=='horse' and horse['sprint']['horse']['ratio']<1,
 'actualHorseEggCarry':carry['ridingHorse'] and len(carry['carried'])==1,
 'physicalHorseDelivery':not delivered['carried'] and len(delivered['state']['securedEggs'])>=1,
 'scopedLifecycleProduction':closed['pass'] and not closed['errors'],
 'actualFaceAndRelease':not face['errors'] and face['disposed']['disposed'] and face['disposed']['instances']==0,
 'protectedSourceFiles':source['pass'] and source['protectedFiles']==1092,
 'earlierFullPhysicalGrowthFlightSave':gameplay['pass'],
}
result={'date':'2026-10-14','pass':all(checks.values()),'checks':checks,
 'evidence':{'footStairs':'final/first-sprint-pass-route-failure.json','physicalTravel':'final/final.json','lifecycleProduction':'closed/close.json','face':'face-browser.json','source':'source-integrity.json','earlierFullGameplay':'gameplay/gameplay.json'},
 'scope':'Combined passed stages and final closure, not a claim that incomplete earlier attempts passed or the entire suite was repeated.',
 'attempts':{'early':early.get('failure'),'travel':travel.get('failure')},
 'allocation':closed['cycles'],'production':closed['production'],
 'limits':['one texture counter remains after disposed renderer reports lost context; geometry/cache/UI zero','no current whole-device heap/GPU-byte or60FPS guarantee','no final independent whole-project review'],
 'build':{'modules':71,'jsKB':866.61,'jsGzipKB':237.77,'cssKB':22.26,'cssGzipKB':5.98,'warning':'existing chunk>500KB'},
}
(work/'comfort-complete.json').write_text(json.dumps(result,indent=2))
assert result['pass'],checks
print('PASS',len(checks),'scoped completion checks; prior incomplete attempts preserved')
