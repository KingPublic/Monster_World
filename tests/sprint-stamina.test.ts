import {Group,Vector3} from 'three';
import {PlayerController} from '../src/gameplay/PlayerController';
import {GroundRiding} from '../src/gameplay/GroundRiding';
import type {InputSystem} from '../src/systems/InputSystem';
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
function controls(shift=true,moving=true){return {movement:{x:0,y:moving?1:0},held:(key:string)=>shift&&key==='ShiftLeft',pressed:()=>false} as unknown as InputSystem;}
const cases:[string,()=>void][]=[
 ['foot and Horse sustained sprint exhausts and smoothly returns to ordinary travel at30 60 and120fps',()=>{
  for(const fps of [30,60,120]){const p=new PlayerController(()=>0),r=new GroundRiding(()=>0,()=>false),root=new Group();p.teleport(new Vector3());try{
   for(let i=0;i<fps*9;i++){p.update(1/fps,controls(),0);r.update(1/fps,root,controls(),0);}
   check(p.speed<31.5,'Player can sprint indefinitely');check(r.speed<35.5&&!r.sprinting,'Horse can sprint indefinitely');
   check(p.stamina.exhausted&&r.stamina.exhausted,'empty sprint must stay latched while Shift remains held');
   for(let i=0;i<fps*6;i++){p.update(1/fps,controls(false),0);r.update(1/fps,root,controls(false),0);}
   for(let i=0;i<fps;i++){p.update(1/fps,controls(),0);r.update(1/fps,root,controls(),0);}
   check(p.speed>48&&r.speed>48,'recovered stamina cannot sprint again');
  }finally{p.dispose();}}
 }],
 ['stopped or blocked sprint does not drain either pool and zero-delta pauses do not recover',()=>{
  const p=new PlayerController(()=>0,()=>true),r=new GroundRiding(()=>0,()=>true),root=new Group();try{
   for(let i=0;i<600;i++){p.update(1/60,controls(),0);r.update(1/60,root,controls(),0);}
   check(p.stamina.ratio===1&&r.stamina.ratio===1,'wall drains stamina');
   for(let i=0;i<60;i++){p.update(1/60,controls(true,false),0);r.update(1/60,root,controls(true,false),0);}
   check(p.stamina.ratio===1&&r.stamina.ratio===1,'standing drains stamina');
   const free=new GroundRiding(()=>0,()=>false);for(let i=0;i<60;i++)free.update(1/60,root,controls(),0);
   const ratio=free.stamina.ratio;free.update(0,root,controls(false),0);free.stamina.rest(0);check(free.stamina.ratio===ratio,'paused pool changes');
  }finally{p.dispose();}
 }],
 ['teleport and dismount kinematic resets do not refill sprint and unused pools recover independently',()=>{
  const p=new PlayerController(()=>0),r=new GroundRiding(()=>0,()=>false),root=new Group();try{
   for(let i=0;i<120;i++)p.update(1/60,controls(),0);const before=p.stamina.ratio;p.teleport(new Vector3(20,0,0));check(p.stamina.ratio===before,'teleport refills player');check(r.stamina.ratio===1,'player drains Horse');
   for(let i=0;i<120;i++)r.update(1/60,root,controls(),0);const horseBefore=r.stamina.ratio;r.reset();check(r.stamina.ratio===horseBefore,'remount refills Horse');
   for(let i=0;i<240;i++){p.stamina.rest(1/60);r.stamina.rest(1/60);}
   check(p.stamina.ratio===1&&r.stamina.ratio===1,'resting pools cannot recover');
  }finally{p.dispose();}
 }],
];
export async function runCoreTests(){return cases.map(([name,run])=>{try{run();return{name,pass:true};}catch(error){return{name,pass:false,error:String(error)};}});}

