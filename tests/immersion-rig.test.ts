import { readFile, writeFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box3, Group, SkinnedMesh, Vector3 } from 'three';
import type { Object3D } from 'three';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { CartoonBoy } from '../src/creatures/CartoonBoy';
import { createDragonVisual } from '../src/creatures/DragonVariants';
function check(v:unknown,m:string):asserts v {if(!v)throw new Error(m);}
async function actual(file:string){
 const bytes=await readFile(file),n=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+n).toString());delete doc.images;delete doc.textures;delete doc.materials;
 for(const mesh of doc.meshes)for(const p of mesh.primitives)delete p.material;
 const json=Buffer.from(JSON.stringify(doc)),pad=(4-json.length%4)%4,out=Buffer.alloc(20+json.length+pad+bytes.length-20-n);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length+pad,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);out.fill(32,20+json.length,20+json.length+pad);bytes.copy(out,20+json.length+pad,20+n);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
function soles(root:Object3D){
 const selected:{mesh:SkinnedMesh;index:number;side:string}[]=[];root.updateWorldMatrix(true,true);
 root.traverse(n=>{if(!(n instanceof SkinnedMesh))return;const indices=n.geometry.attributes.skinIndex,weights=n.geometry.attributes.skinWeight,bins:{L:{index:number;y:number}[];R:{index:number;y:number}[]}={L:[],R:[]};
  for(let i=0;i<indices.count;i++){let l=0,r=0;for(let j=0;j<4;j++){const match=n.skeleton.bones[indices.getComponent(i,j)]?.name.match(/^CC_Base_([LR])_(Foot|ToeBase)$/);if(match?.[1]==='L')l+=weights.getComponent(i,j);if(match?.[1]==='R')r+=weights.getComponent(i,j);}if(Math.max(l,r)<.5)continue;bins[l>r?'L':'R'].push({index:i,y:n.getVertexPosition(i,new Vector3()).applyMatrix4(n.matrixWorld).y});}
  for(const side of ['L','R']as const){bins[side].sort((a,b)=>a.y-b.y);for(const p of bins[side].slice(0,32))selected.push({mesh:n,index:p.index,side});}
 });check(selected.length>=64,'source boot sole samples missing');return()=>selected.map(s=>({side:s.side,point:s.mesh.getVertexPosition(s.index,new Vector3()).applyMatrix4(s.mesh.matrixWorld)}));
}
const evidence:unknown[]=[];
const cases:[string,()=>Promise<void>][]=[
 ['actual player boots hold grounded stance at unchanged walk and sprint speeds',async()=>{
  for(const fps of [30,60,120])for(const speed of [30,50]){
   const template=await actual('public/assets/models/characters/player/cartoon-boy.glb'),assets=new RuntimeAssets(async()=>template),boy=new CartoonBoy(await assets.acquire('/boy')),player=new Group();player.add(boy.root);const read=soles(boy.root);let previous=read();const drift:number[]=[],heights:number[]=[];
   try{for(let i=0;i<fps*4;i++){player.position.z-=speed/fps;boy.update(1/fps,{speed,airborne:false,vertical:0,carry:false,mounted:false,interact:false});player.updateMatrixWorld(true);const current=read();if(i>fps){heights.push(Math.min(...current.map(s=>s.point.y)));for(let j=0;j<current.length;j++){const a=previous[j]!.point,b=current[j]!.point;if(Math.max(a.y,b.y)<.025&&Math.min(a.y,b.y)>-.015)drift.push(Math.hypot(a.x-b.x,a.z-b.z)*fps);}}previous=current;}
    drift.sort((a,b)=>a-b);const median=drift[Math.floor(drift.length*.5)]??Infinity,p95=drift[Math.floor(drift.length*.95)]??Infinity;const stats={fps,speed,samples:drift.length,median,p95,minSole:Math.min(...heights),maxSole:Math.max(...heights)};evidence.push(stats);
    check(drift.length>fps*12,'not enough actual support pairs '+JSON.stringify(stats));check(median<.3&&p95<2,'visible planted boot skating '+JSON.stringify(stats));check(stats.minSole>-.015,'boot penetrates ground '+JSON.stringify(stats));
   }finally{boy.dispose();check(assets.stats().instances===0,'player stance retains cloned source');assets.dispose();}
  }
 }],
 ['each actual boot uses its terrain support and releases contact when jumping or reparented',async()=>{
  const template=await actual('public/assets/models/characters/player/cartoon-boy.glb'),assets=new RuntimeAssets(async()=>template),boy=new CartoonBoy(await assets.acquire('/boy')),player=new Group();player.add(boy.root);const read=soles(boy.root),supportHeight=(x:number,z:number)=>.18*x+.025*z;
  try{player.position.set(3,supportHeight(3,0),0);for(let i=0;i<120;i++)boy.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:false,interact:false,supportHeight});player.updateMatrixWorld(true);
   for(const side of ['L','R']){const samples=read().filter(s=>s.side===side),gap=Math.min(...samples.map(s=>s.point.y-supportHeight(s.point.x,s.point.z)));check(gap>=-.015&&gap<.025,'boot misses its own slope '+side+' '+gap);}
   const grounded=new Box3().setFromObject(boy.root,true).min.y;player.position.y+=2;for(let i=0;i<12;i++)boy.update(1/60,{speed:0,airborne:true,vertical:12,carry:false,mounted:false,interact:false,supportHeight});player.updateMatrixWorld(true);check(new Box3().setFromObject(boy.root,true).min.y>grounded+1.5,'jump keeps a foot pinned to floor');
   const seat=new Group();seat.position.set(80,9,-40);seat.add(player);player.position.set(0,0,0);for(let i=0;i<120;i++)boy.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false,mountKind:'dragon',supportHeight});seat.updateMatrixWorld(true);for(const side of ['L','R'])check(seat.worldToLocal(boy.root.getObjectByName('CC_Base_'+side+'_Foot')!.getWorldPosition(new Vector3())).y<0,'stale stance survives mount');
  }finally{boy.dispose();assets.dispose();}
 }],
 ['actual Dragon saddle follows the weighted back and a comfortable rider avoids folding into it',async()=>{
  for(const variant of ['mountain','ashscale']){
   const [dragonSource,boySource]=await Promise.all([actual('public/assets/models/dragons/'+(variant==='mountain'?'mountain':'ashscale')+'-family.glb'),actual('public/assets/models/characters/player/cartoon-boy.glb')]),assets=new RuntimeAssets(async url=>url.includes('boy')?boySource:dragonSource),dragon=createDragonVisual(assets,variant,()=>{},'Young');for(let i=0;i<12;i++)await Promise.resolve();check(dragon.root.userData.sourceReady,'actual Dragon not ready');const boy=new CartoonBoy(await assets.acquire('/boy'));dragon.mountAnchor.add(boy.root);
   try{for(const state of ['idle','walk','takeoff','flight','boost','land'] as const){for(let i=0;i<180;i++){dragon.update(1/60,{state,speed:.8,bank:state==='flight'?.4:0,vertical:state==='flight'?.3:0});boy.update(1/60,{speed:0,airborne:state==='flight',vertical:0,carry:false,mounted:true,interact:false,mountKind:'dragon'});}dragon.root.updateMatrixWorld(true);
     const seat=dragon.mountAnchor.getWorldPosition(new Vector3()),torso=new Box3();dragon.root.traverse(n=>{if(!(n instanceof SkinnedMesh)||n.skeleton.bones.some(b=>b.name==='CC_Base_Hip'))return;const index=n.geometry.attributes.skinIndex,weight=n.geometry.attributes.skinWeight;for(let i=0;i<index.count;i++){let body=0,wing=0;for(let j=0;j<4;j++){const name=n.skeleton.bones[index.getComponent(i,j)]?.name??'';if(/spine|pelvis/i.test(name))body+=weight.getComponent(i,j);if(/Wing[RL]|^([rl])_(upperArm|forearm|wing)/i.test(name))wing+=weight.getComponent(i,j);}const p=n.getVertexPosition(i,new Vector3()).applyMatrix4(n.matrixWorld);if(body>.35&&wing<.2&&Math.abs(p.x-seat.x)<.75&&Math.abs(p.z-seat.z)<.45)torso.expandByPoint(p);}});
     const backGap=seat.y-torso.max.y;evidence.push({variant,state,seat:seat.toArray(),backGap});check(backGap>-.08&&backGap<.55,'saddle sinks into/floats above actual torso '+variant+'/'+state+' '+backGap);
     for(const side of ['L','R']){const foot=dragon.mountAnchor.worldToLocal(boy.root.getObjectByName('CC_Base_'+side+'_Foot')!.getWorldPosition(new Vector3()));check(Math.abs(foot.x)>1&&foot.y<-.9,'boot folded into saddle '+variant+'/'+state);}
    }
   }finally{boy.dispose();dragon.dispose();check(assets.stats().instances===0,'Dragon/rider retain asset instances');assets.dispose();}
  }
 }],
];
export async function runCoreTests(){const results=[];for(const[name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}await writeFile('ASSET_WORK/iteration3/rig-measurements.json',JSON.stringify(evidence,null,2));return results;}
