import { Group,Vector3 } from 'three';
import { Game } from '../src/core/Game';
import { Progression } from '../src/gameplay/Progression';
import type { DragonRecord } from '../src/gameplay/Progression';
function check(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
function record(i:number):DragonRecord{return {id:'baby-'+i,name:'Baby '+i,rarity:'Common',element:'Nature',stage:'Baby',growth:0};}
// Exercise the actual Game methods without a DOM/WebGL constructor. The pending
// loader leaves actual procedural loading visuals, not a substitute algorithm.
function fixture(){const game:any=Object.create(Game.prototype),progression=new Progression();progression.state.tutorialStep=4;Object.assign(game,{progression,owned:new Map(),assets:{acquire:()=>new Promise(()=>{})},scene:new Group(),ui:{notify:()=>{},update:()=>{}},mountedId:null,ridingHorse:false,gardenDragonId:null,player:{position:new Vector3(0,1,48),stamina:{ratio:1,exhausted:false},sprinting:false},horse:{root:new Group()},hatch:null,residents:{nearest:()=>undefined},guardians:[],flight:{stamina:100},follow:{yaw:0},saves:{message:'Saved'},hold:0});return game;}
const cases:[string,()=>void][]=[
 ['a full egg bag does not hide the available Dragon mount behind an unavailable theft prompt',()=>{
  const g=fixture();try{const d={...record(0),stage:'Young',growth:100};g.progression.state.dragons.push(d);g.syncDragons();g.owned.get(d.id).model.root.position.set(1735,335,-1838);g.player.position.set(1732.36,335,-1835.98);check(g.progression.steal('volcano',0),'raid fixture did not carry egg');check(g.context()?.kind==='mount','full capacity prompt hides escape mount');}finally{for(const o of g.owned.values())o.model.dispose();}
 }],
 ['a growing companion cannot trap a rider already inside its enlarged body',()=>{
  const g=fixture();try{g.progression.state.dragons.push(record(0));g.syncDragons();const o=g.owned.get('baby-0');o.stage='Young';o.model.root.position.set(0,0,0);const inside={x:2.5,z:-.8};check(!g.dragonBodyBlocked(2.6,-.8,inside),'rider cannot step out of enlarged body');check(g.dragonBodyBlocked(2.4,-.8,inside),'rider can move deeper into enlarged body');check(g.dragonBodyBlocked(2.6,-.8,{x:4,z:-.8}),'outside rider can walk into Dragon');}finally{for(const o of g.owned.values())o.model.dispose();}
 }],
 ['actual hatch window reconciles old and new Baby bay positions instead of stacking',()=>{
  const g=fixture();try{g.progression.state.dragons.push(record(0));g.syncDragons();g.progression.state.dragons.push(record(1));g.syncDragons();const a=g.owned.get('baby-0').model.root.position,b=g.owned.get('baby-1').model.root.position;check(a.distanceTo(b)>=25,'successive hatches occupy the same bay');}finally{for(const o of g.owned.values())o.model.dispose();}
 }],
 ['actual HUD boot with256Babies and no equipped Dragon targets a displayed companion',()=>{
  const g=fixture();try{g.progression.state.dragons=Array.from({length:256},(_,i)=>record(i));g.progression.state.equippedDragonId=null;g.syncDragons();check(g.owned.size===5,'saved Babies eagerly allocate all rigs');g.drawHUD();check(g.owned.has(g.selected.id),'HUD targets a hidden companion');}finally{for(const o of g.owned.values())o.model.dispose();}
 }],
];
export async function runCoreTests(){return cases.map(([name,run])=>{try{run();return {name,pass:true};}catch(e){return {name,pass:false,error:String(e)};}});}
