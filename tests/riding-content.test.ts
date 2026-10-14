import { Group,Vector3 } from 'three';
import { GroundRiding,horseFootprintBlocked } from '../src/gameplay/GroundRiding';
import { Progression } from '../src/gameplay/Progression';
import { validateSave } from '../src/systems/SaveSystem';
import { variantForNest } from '../src/config/dragonVariants';
import { findMountParking } from '../src/gameplay/MountParking';
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
const cases:[string,()=>void][]=[
 ['recalled Dragons use separate open bays and a full court cannot stack companions',()=>{
  const occupied:{x:number;z:number}[]=[];for(let i=0;i<5;i++){const point=findMountParking(occupied,()=>false,{x:68,z:20});check(point,'court bay missing');check(occupied.every(o=>Math.hypot(o.x-point.x,o.z-point.z)>=13.9),'recalled Dragons overlap');occupied.push(point);}
  check(findMountParking(occupied,()=>true,{x:68,z:20})===undefined,'full court teleports through building');
 }],
 ['new nest lineage survives secure hatch growth and save while old records remain unchanged',()=>{
  const p=new Progression();p.steal('volcano',0);p.secure();const dragon=p.hatch();check(dragon,'hatch missing');p.state.food=2;p.feed(dragon.id);p.feed(dragon.id);
  const state=validateSave(JSON.parse(JSON.stringify(p.state)));check(state,'new lineage save rejected');
  check((state.dragons[0] as {variant?:string}).variant===variantForNest('volcano'),'new species lineage lost through progression/save');
  const legacy=structuredClone(state);delete (legacy.dragons[0] as {variant?:string}).variant;const restored=validateSave(legacy);check(restored&&!(restored.dragons[0] as {variant?:string}).variant,'old Dragon was silently rerolled');
 }],
 ['save validation rejects unknown visual lineage instead of storing arbitrary asset paths',()=>{
  const p=new Progression();p.steal('forest',0);p.secure();p.hatch();const raw=structuredClone(p.state);Object.assign(raw.dragons[0]!,{variant:'../../source'});check(!validateSave(raw),'untrusted variant path accepted');
 }],
 ['ground Horse moves and sprints without flying at30 60 and120fps',()=>{
  for(const fps of [30,60,120]){const root=new Group(),ride=new GroundRiding(()=>0,()=>false);for(let i=0;i<fps*2;i++)ride.update(1/fps,root,{movement:{x:0,y:1},held:()=>false,pressed:()=>false},0);check(root.position.z< -50&&root.position.y===0,'Horse did not travel on ground');
   const before=root.position.z;for(let i=0;i<fps;i++)ride.update(1/fps,root,{movement:{x:0,y:1},held:k=>k==='ShiftLeft',pressed:()=>false},0);check(before-root.position.z>42,'Horse sprint did not advance');check(!ride.airborne,'Horse flew from normal movement');}
 }],
 ['Horse jump has a finite arc and held ascend cannot become Dragon flight',()=>{
  const root=new Group(),ride=new GroundRiding(()=>0,()=>false);let peak=0;for(let i=0;i<240;i++){ride.update(1/60,root,{movement:{x:0,y:0},held:k=>k==='Space',pressed:k=>k==='Space'&&i===0},0);peak=Math.max(peak,root.position.y);}check(peak>1&&peak<5,'Horse jump is missing or unbounded');check(root.position.y===0&&!ride.airborne,'Horse never landed while Space held');
 }],
 ['Horse collision prevents tunnelling and stops its gait when blocked',()=>{
  const root=new Group(),ride=new GroundRiding(()=>0,(_x,z)=>z< -8);for(let i=0;i<120;i++)ride.update(1/60,root,{movement:{x:0,y:1},held:()=>true,pressed:()=>false},0);check(root.position.z>=-8,'Horse walked through facade');check(ride.speed<.01,'Horse walks in place against a wall');
 }],
 ['Horse front and flank stop before a facade instead of only stopping its physics origin',()=>{
  for(const yaw of [0,Math.PI/2]){const root=new Group();root.rotation.y=yaw;const wall=(x:number,z:number)=>yaw===0?z< -9:x< -9;
   const ride=new GroundRiding(()=>0,(x,z,heading)=>horseFootprintBlocked(x,z,heading,wall));
   for(let i=0;i<240;i++)ride.update(1/60,root,{movement:{x:0,y:1},held:()=>false,pressed:()=>false},yaw===0?0:-Math.PI/2);
   const front=yaw===0?root.position.z-3.5:root.position.x-3.5;check(front>=-9,'Horse body enters facade by '+(-9-front));check(ride.speed<.01,'blocked Horse keeps its gait moving');
  }
 }],
];
export async function runCoreTests(){return cases.map(([name,run])=>{try{run();return {name,pass:true};}catch(error){return {name,pass:false,error:String(error)};}});}
