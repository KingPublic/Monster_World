import {Group,MathUtils,Vector3} from 'three';
import {Parts,disposeScene} from '../utils/scene';
import {groundHeight,isBlocked} from './Traversal';
import {trailClearance,seededRandom} from './Landscape';

export const wildlifeCatalog=[
 {id:'fern-mossling',kind:'mossling',x:282,z:-68},{id:'willow-pebbleback',kind:'pebbleback',x:240,z:310},
 {id:'meadow-mossling',kind:'mossling',x:-300,z:240},{id:'forest-pebbleback',kind:'pebbleback',x:465,z:-200},
 {id:'highland-pebbleback',kind:'pebbleback',x:-470,z:-690},{id:'meadow-pebbleback',kind:'pebbleback',x:-1040,z:745},
 {id:'reed-mossling',kind:'mossling',x:1290,z:1380},{id:'ruins-mossling',kind:'mossling',x:-2620,z:-1750},
]as const;
export const wildlifeLimits={load:290,unload:420,maxActive:4,roam:32}as const;
type Kind=(typeof wildlifeCatalog)[number]['kind'];

/** Original ambient creatures, no downloaded rig or progression interaction. */
class ForestCreature {
 readonly root=new Group();private readonly body=new Group();private readonly head=new Group();private readonly eyes=new Group();private readonly tail=new Group();private readonly feet:Group[]=[];private time=0;private phase=0;private disposed=false;
 constructor(kind:Kind){
  this.root.name=kind==='mossling'?'Mossling — original forest creature':'Pebbleback — original forest creature';const p=new Parts(),moss=kind==='mossling',fur=moss?0x81925e:0x9e8d72,belly=moss?0xd6c9a0:0xd2c3a6;
  this.root.add(this.body,this.head,this.tail,this.eyes);this.head.add(this.eyes);this.head.position.set(0,moss?1.6:.8,moss?-.95:-1.1);
  p.add(this.body,'sphere',fur,[0,moss?1.03:.65,0],[moss?.82:1.05,moss?.82:.64,1.16]);p.add(this.body,'sphere',belly,[0,moss?.9:.58,-.65],[.63,.56,.64]);
  if(!moss){p.add(this.body,'sphere',0x6c8490,[0,1.05,.18],[1.04,.65,1.03]);for(let i=0;i<3;i++)p.add(this.body,'sphere',0xa5b6b4,[(i-1)*.5,1.6,0],[.23,.11,.36]);}
  p.add(this.head,'sphere',fur,[0,0,0],[moss?.62:.48,moss?.56:.36,.54]);p.add(this.head,'sphere',belly,[0,-.15,-.4],[.38,.25,.24]);p.add(this.head,'sphere',0x4e5146,[0,-.08,-.62],[.08,.06,.06]);
  for(const side of [-1,1]){p.add(this.eyes,'sphere',0xfff4d9,[side*.25,.08,-.5],[.145,.17,.06]);p.add(this.eyes,'sphere',0x263741,[side*.25,.08,-.554],[.075,.1,.035]);p.add(this.eyes,'sphere',0xffffff,[side*.27,.12,-.58],[.025,.032,.018]);const ear=p.add(this.head,'cone',moss?0x57784e:fur,[side*.41,moss?.66:.43,.04],[moss?.19:.15,moss?.73:.3,.13]);ear.rotation.z=side*-.24;}
  this.tail.position.set(0,moss?1.05:.5,1.05);const leaf=p.add(this.tail,moss?'cone':'sphere',moss?0x64835a:fur,[0,0,.25],moss?[.3,.9,.25]:[.18,.2,.4]);leaf.rotation.x=Math.PI*.45;
  for(const side of [-1,1])for(const z of [-.65,.65]){const leg=new Group();leg.position.set(side*.58,.21,z);this.root.add(leg);this.feet.push(leg);p.add(leg,'sphere',fur,[0,0,0],[.21,.22,.29]);}
 }
 animate(dt:number,speed:number,curious:boolean):void{if(this.disposed)return;this.time+=dt;this.phase+=dt*speed*3;this.body.scale.y=1+Math.sin(this.time*1.4)*.012;this.body.position.y=speed>.1?Math.abs(Math.sin(this.phase))*.055:0;this.head.rotation.y=Math.sin(this.time*.55)*(curious?.22:.08);this.head.rotation.x=curious?-.08:Math.sin(this.time*1.2)*.025;this.tail.rotation.y=Math.sin(this.time*1.9)*.13;const blink=this.time%5.7;this.eyes.scale.y=blink>5.5?.22:1;this.feet.forEach((leg,i)=>{const s=speed>.1?Math.sin(this.phase+(i===0||i===3?0:Math.PI)):0;leg.position.y=.21+Math.max(0,s)*.17;leg.rotation.x=s*.2;});}
 dispose():void{if(this.disposed)return;this.disposed=true;disposeScene(this.root);this.root.removeFromParent();}
}
type Roamer={definition:(typeof wildlifeCatalog)[number];model:ForestCreature;goal:Vector3;rest:number;random:()=>number;distance:number;};
export class AmbientWildlife {
 readonly root=new Group();private readonly actors=new Map<string,Roamer>();private disposed=false;
 constructor(private readonly floor:(x:number,z:number)=>number=groundHeight,private readonly blocked:(x:number,z:number)=>boolean=(x,z)=>isBlocked(x,z,{radius:.65,minY:groundHeight(x,z)+.03,maxY:groundHeight(x,z)+2.6})){this.root.name='OriginalRoamingForestMonsters';}
 private goal(actor:Roamer):void{const d=actor.definition;for(let i=0;i<24;i++){const a=actor.random()*Math.PI*2,r=10+actor.random()*(wildlifeLimits.roam-10),x=d.x+Math.cos(a)*r,z=d.z+Math.sin(a)*r;if(trailClearance(x,z)>5&&!this.blocked(x,z)){actor.goal.set(x,this.floor(x,z),z);return;}}actor.rest=2;actor.goal.copy(actor.model.root.position);}
 update(dt:number,focus:Vector3,active=true):void{
  if(this.disposed)return;const delta=active?MathUtils.clamp(dt,0,.1):0;
  for(const[id,actor]of this.actors)if(actor.model.root.position.distanceTo(focus)>wildlifeLimits.unload){actor.model.dispose();this.actors.delete(id);}
  for(const d of [...wildlifeCatalog].sort((a,b)=>Math.hypot(a.x-focus.x,a.z-focus.z)-Math.hypot(b.x-focus.x,b.z-focus.z))){if(this.actors.size>=wildlifeLimits.maxActive)break;if(this.actors.has(d.id)||Math.hypot(d.x-focus.x,d.z-focus.z)>wildlifeLimits.load)continue;const model=new ForestCreature(d.kind),actor:Roamer={definition:d,model,goal:new Vector3(),rest:1.1,random:seededRandom(d.x*31+d.z*17),distance:0};model.root.position.set(d.x,this.floor(d.x,d.z),d.z);this.goal(actor);if(this.blocked(d.x,d.z))model.root.position.copy(actor.goal);this.root.add(model.root);this.actors.set(d.id,actor);}
  for(const actor of this.actors.values()){
   const pos=actor.model.root.position,near=pos.distanceTo(focus)<3.3;let speed=0;actor.rest=Math.max(0,actor.rest-delta);
   if(delta&&actor.rest===0&&!near){const dx=actor.goal.x-pos.x,dz=actor.goal.z-pos.z,distance=Math.hypot(dx,dz);if(distance<.35){actor.rest=1.7+actor.random()*3.3;this.goal(actor);}else{const length=Math.min(distance,delta*(actor.definition.kind==='mossling'?2.7:1.7)),x=pos.x+dx/distance*length,z=pos.z+dz/distance*length;if(!this.blocked(x,z)&&trailClearance(x,z)>4){pos.set(x,this.floor(x,z),z);speed=length/delta;actor.distance+=length;const yaw=Math.atan2(-dx,-dz),turn=MathUtils.euclideanModulo(yaw-actor.model.root.rotation.y+Math.PI,Math.PI*2)-Math.PI;actor.model.root.rotation.y+=turn*(1-Math.exp(-4*delta));}else{actor.rest=.5;this.goal(actor);}}}
   actor.model.animate(delta,speed,pos.distanceTo(focus)<14);
  }
 }
 snapshot(){return{original:true,ambientOnly:true,active:this.actors.size,total:wildlifeCatalog.length,actors:[...this.actors.values()].map(a=>({id:a.definition.id,kind:a.definition.kind,position:a.model.root.position.toArray(),distance:a.distance,rest:a.rest}))};}
 dispose():void{if(this.disposed)return;this.disposed=true;for(const actor of this.actors.values())actor.model.dispose();this.actors.clear();this.root.removeFromParent();this.root.clear();}
}
