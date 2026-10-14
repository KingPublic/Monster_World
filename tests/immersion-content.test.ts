import { companionGardenSlots, displayedCompanions, canRecallCompanion } from '../src/gameplay/MountParking';
import { residentCatalog, dialoguePage, mayTalk } from '../src/world/ResidentCatalog';
import { mvpConfig } from '../src/config/mvpConfig';
import { Group,Vector3 } from 'three';
import { Flight } from '../src/gameplay/Flight';
import { Progression } from '../src/gameplay/Progression';
import { citySolids } from '../src/world/SanctuaryLayout';
function check(v:unknown,m:string):asserts v {if(!v)throw new Error(m);}
const cases:[string,()=>void][]=[
 ['Dragon flight stops its body at a facade while higher flight clears the actual roof',()=>{
  const solid=citySolids.find(s=>s.id==='shop')!,state=new Progression().state;
  const run=(y:number)=>{const root=new Group();root.position.set(solid.x,y,solid.z+solid.halfZ+20);const f=new Flight();f.airborne=true;for(let i=0;i<100;i++)f.update(1/60,root,{movement:{x:0,y:1},held:()=>false},0,state);return root.position.clone();};
  const low=run(4);check(low.z>=solid.z+solid.halfZ+2.49,'Dragon front enters facade');
  const high=run(solid.maxY+10);check(high.z<solid.z-solid.halfZ,'raised Dragon cannot clear roof');
 }],
 ['garden is ordered and a256-companion save retains selection with bounded display',()=>{
  const records=Array.from({length:256},(_,i)=>({id:'dragon-'+i,stage:i%3?'Young':'Baby'}));
  const ids=displayedCompanions(records,'dragon-250','dragon-252','dragon-4');
  check(ids.length<=companionGardenSlots.length,'unbounded rig allocation');check(new Set(ids).size===ids.length,'duplicate garden companion');
  for(const id of ['dragon-250','dragon-252','dragon-4'])check(ids.includes(id),'active/selected/care Dragon disappeared');
  check(records.length===256,'save records were removed');
  for(const a of companionGardenSlots)for(const b of companionGardenSlots)if(a!==b)check(Math.hypot(a.x-b.x,a.z-b.z)>=25,'garden body/wing bays overlap');
  check(!canRecallCompanion(true,0)&&!canRecallCompanion(false,1),'recall skips mount or stolen-egg journey');
 }],
 ['adventure residents inhabit every existing route without adding nests or rewards',()=>{
  check(residentCatalog.filter(r=>r.role==='traveler').length>=18,'too few roaming adventurers');
  for(const nest of mvpConfig.nests){check(residentCatalog.some(r=>r.nestId===nest.id&&r.role==='guide'),'remote region has no conversational guide '+nest.id);}
  check(new Set(residentCatalog.map(r=>r.id)).size===residentCatalog.length,'duplicate resident IDs');
  for(const r of residentCatalog){check(r.route.length>0&&r.route.every(p=>p.every(Number.isFinite)),'invalid resident route');const page=dialoguePage(r.id);check(page&&page.text.length>40&&page.options.length>0,'empty conversation');}
 }],
 ['dialogue is finite and cannot freeze a stolen-egg chase or inject unknown routes',()=>{
  check(!mayTalk(1,true)&&!mayTalk(0,true)&&!mayTalk(1,false)&&mayTalk(0,false),'unsafe talk state');
  check(dialoguePage('unknown')===undefined,'unknown NPC accepted');
  for(const r of residentCatalog){const page=dialoguePage(r.id)!;for(const option of page.options){if(option.topic)check(dialoguePage(r.id,option.topic),'dangling topic');if(option.nestId)check(mvpConfig.nests.some(n=>n.id===option.nestId),'unknown compass destination');}}
 }],
];
export async function runCoreTests(){return cases.map(([name,run])=>{try{run();return {name,pass:true};}catch(e){return {name,pass:false,error:String(e)};}});}
