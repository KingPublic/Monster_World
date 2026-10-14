import { readFile,writeFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SkinnedMesh,Vector3 } from 'three';
import type { Object3D } from 'three';
import { HorseMount } from '../src/creatures/HorseMount';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { CartoonBoy } from '../src/creatures/CartoonBoy';
function check(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
async function source(path='public/assets/models/creatures/ambient/horse.glb'){
 const file=await readFile(path),n=file.readUInt32LE(12),json=JSON.parse(file.subarray(20,20+n).toString());
 delete json.materials;delete json.textures;delete json.images;for(const m of json.meshes)for(const p of m.primitives)delete p.material;
 const text=Buffer.from(JSON.stringify(json)),pad=(4-text.length%4)%4,out=Buffer.alloc(20+text.length+pad+file.length-20-n);
 out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(text.length+pad,12);out.writeUInt32LE(0x4e4f534a,16);text.copy(out,20);out.fill(32,20+text.length,20+text.length+pad);file.copy(out,20+text.length+pad,20+n);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
function soleProbe(root:Object3D){
 const samples:{mesh:SkinnedMesh;index:number}[]=[];root.updateWorldMatrix(true,true);
 root.traverse(node=>{if(!(node instanceof SkinnedMesh))return;const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight'),bins=new Map<string,{index:number;y:number}[]>();
 for(let i=0;i<indices.count;i++){const sums=new Map<string,number>();for(let k=0;k<4;k++){const name=node.skeleton.bones[indices.getComponent(i,k)]?.name??'',side=name.match(/_(l|r)(?:_|$)/)?.[1];if(side&&/^(hand|fingers|foot|toes)_/.test(name)){const id=(/^(hand|fingers)_/.test(name)?'front':'back')+side;sums.set(id,(sums.get(id)??0)+weights.getComponent(i,k));}}
 const best=[...sums].sort((a,b)=>b[1]-a[1])[0];if(!best||best[1]<.45)continue;const b=bins.get(best[0])??[];b.push({index:i,y:node.getVertexPosition(i,new Vector3()).applyMatrix4(node.matrixWorld).y});bins.set(best[0],b);}
 for(const b of bins.values()){b.sort((a,b)=>a.y-b.y);for(const s of b.slice(0,24))samples.push({mesh:node,index:s.index});}});
 check(samples.length>=96,'four actual hoof selections missing');return()=>samples.map(({mesh,index})=>mesh.getVertexPosition(index,new Vector3()).applyMatrix4(mesh.matrixWorld));
}
export const horseDriftEvidence:{fps:number;speed:number;count:number;median:number;p95:number}[]=[];
const cases:[string,()=>Promise<void>][]=[
 ['actual Horse rider boots hang outside the saddle instead of folding inside its cloth',async()=>{
  const [horseSource,boySource]=await Promise.all([source(),source('public/assets/models/characters/player/cartoon-boy.glb')]),cache=new RuntimeAssets(async url=>url.includes('boy')?boySource:horseSource),horse=new HorseMount(cache,m=>{throw new Error(m);});horse.root.position.set(0,0,0);await horse.load();const boy=new CartoonBoy(await cache.acquire('/boy.glb'));horse.mountAnchor.add(boy.root);
  try{for(let i=0;i<180;i++)boy.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false,mountKind:'horse'});horse.root.updateMatrixWorld(true);
   for(const side of ['L','R']){const foot=horse.mountAnchor.worldToLocal(boy.root.getObjectByName('CC_Base_'+side+'_Foot')!.getWorldPosition(new Vector3()));check(Math.abs(foot.x)>.85&&foot.y< -1.2&&foot.y> -2.7,'boot folds into saddle '+side+' '+foot.toArray());}
   for(let i=0;i<180;i++)boy.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false,mountKind:'dragon'});
   for(const side of ['L','R'])check(Math.abs(horse.mountAnchor.worldToLocal(boy.root.getObjectByName('CC_Base_'+side+'_Foot')!.getWorldPosition(new Vector3())).x)>.95,'Dragon rider crosses both boots into the saddle');
  }finally{boy.dispose();horse.dispose();cache.dispose();}
 }],
 ['actual mounted Horse keeps contacting hoof vertices stable at ride and sprint speeds',async()=>{
 for(const fps of [30,60,120])for(const speed of [34,50]){const template=await source(),originalTimes=template.animations.map(c=>c.tracks[0]!.times.slice()),assets=new RuntimeAssets(async()=>template),horse=new HorseMount(assets,m=>{throw new Error(m);});horse.root.position.set(0,0,0);
 try{await horse.load();check(horse.status.state==='ready','actual Horse failed to load');const read=soleProbe(horse.root);let previous=read();const values:number[]=[];
 for(let i=0;i<fps*5;i++){horse.root.position.z-=speed/fps;horse.update(1/fps,horse.root.position,{speed,airborne:false,vertical:0});horse.root.updateMatrixWorld(true);const current=read();if(i>fps*2)for(let j=0;j<current.length;j++){const a=previous[j]!,b=current[j]!;if(Math.max(a.y,b.y)<.075&&Math.min(a.y,b.y)>-.03)values.push(Math.hypot(b.x-a.x,b.z-a.z)*fps);}previous=current;}
 values.sort((a,b)=>a-b);check(values.length>60,'insufficient repeated ground contact '+fps+'/'+speed);const median=values[Math.floor(values.length*.5)]!,p95=values[Math.floor(values.length*.95)]!;horseDriftEvidence.push({fps,speed,count:values.length,median,p95});check(median<.15&&p95<1.5,'Horse hoof skating '+fps+'/'+speed+' median '+median.toFixed(3)+' P95 '+p95.toFixed(3));
 check(template.animations.every((c,i)=>c.tracks[0]!.times.every((v,j)=>v===originalTimes[i]![j])),'runtime changed source clip times');
 }finally{horse.dispose();check(assets.stats().instances===0,'Horse leaves a live cache instance');assets.dispose();}}
 }],
 ['Horse saddle follows the supplied joint and failed loads retain a disposable visible mount',async()=>{
 const assets=new RuntimeAssets(async()=>{throw new Error('controlled fixture failure');}),horse=new HorseMount(assets,()=>{});await horse.load();check(horse.status.state==='fallback'&&horse.root.children.some(c=>c.children.length>0),'Horse failure removes its visual');horse.dispose();horse.dispose();assets.dispose();
 const template=await source(),cache=new RuntimeAssets(async()=>template),loaded=new HorseMount(cache,m=>{throw new Error(m);});try{await loaded.load();loaded.root.updateMatrixWorld(true);const saddle=loaded.root.getObjectByName('saddle')!;check(saddle,'source saddle missing');check(loaded.mountAnchor.getWorldPosition(new Vector3()).distanceTo(saddle.getWorldPosition(new Vector3()))<.09,'rider detached from actual saddle');}finally{loaded.dispose();cache.dispose();}
 }],
];
export async function runCoreTests(){const results=[];for(const[name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}await writeFile('ASSET_WORK/iteration2/horse-sole-drift.json',JSON.stringify({measure:'actual fixed weighted hoof vertices; both pair heights<.075 after2s steady motion',limits:{median:.15,p95:1.5},samples:horseDriftEvidence},null,2));console.log('HORSE_DRIFT',JSON.stringify(horseDriftEvidence));return results;}
