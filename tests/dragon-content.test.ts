import { AnimationClip, AnimationMixer, Bone, Box3,Group, Mesh, MeshStandardMaterial, Quaternion, QuaternionKeyframeTrack, SkinnedMesh, Texture, Vector3 } from 'three';
import { readFile, writeFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MountainMotion } from '../src/creatures/MountainMotion';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { createDragonVisual } from '../src/creatures/DragonVariants';
import { RigContact } from '../src/creatures/RigContact';
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
async function actual(file:string){
 const bytes=await readFile(file),n=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+n).toString());delete doc.images;delete doc.textures;delete doc.materials;
 for(const mesh of doc.meshes)for(const p of mesh.primitives)delete p.material;
 const json=Buffer.from(JSON.stringify(doc)),pad=(4-json.length%4)%4,out=Buffer.alloc(20+json.length+pad+bytes.length-20-n);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length+pad,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);out.fill(32,20+json.length,20+json.length+pad);bytes.copy(out,20+json.length+pad,20+n);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
const settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const cases:[string,()=>void|Promise<void>][]=[
 ['actual optimized Demon LODs retain joint anatomy and source action deformation',async()=>{
  const source=await actual('SOURCE_ASSETS/dragons/demon-dragon/demon_dragon_full_texture.glb'),report=[];
  for(const file of ['ashscale-family','ashscale-lod1']){
   const derivative=await actual('public/assets/models/dragons/'+file+'.glb');let triangles=0,joints=0;
   derivative.scene.traverse(n=>{if(n instanceof Bone)joints++;if(n instanceof SkinnedMesh){triangles+=(n.geometry.index?.count??n.geometry.attributes.position.count)/3;const weights=n.geometry.attributes.skinWeight;for(let i=0;i<weights.count;i++)check(Math.abs(weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i)-1)<.0001,'simplification leaves unnormalized weights');}});
   check(joints===220&&triangles<(file.endsWith('lod1')?25000:60000),'source rig missing or LOD not optimized');check(derivative.animations.length===3,'source actions removed');
   for(const clip of source.animations){const other=derivative.animations.find(c=>c.name===clip.name);check(other&&Math.abs(other.duration-clip.duration)<.0001,'source action name/duration changed');
    let positionError=0,rotationError=0;for(const time of [0,.4,1,3,clip.duration*.7,clip.duration-.04]){
     const a=new AnimationMixer(source.scene),b=new AnimationMixer(derivative.scene);a.clipAction(clip).play();b.clipAction(other).play();a.setTime(time);b.setTime(time);source.scene.updateMatrixWorld(true);derivative.scene.updateMatrixWorld(true);
     source.scene.traverse(n=>{if(n instanceof Bone){const target=derivative.scene.getObjectByName(n.name);check(target,'optimized joint lost: '+n.name);positionError=Math.max(positionError,n.getWorldPosition(new Vector3()).distanceTo(target.getWorldPosition(new Vector3())));rotationError=Math.max(rotationError,n.getWorldQuaternion(new Quaternion()).normalize().angleTo(target.getWorldQuaternion(new Quaternion()).normalize()));}});a.stopAllAction();b.stopAllAction();a.uncacheRoot(source.scene);b.uncacheRoot(derivative.scene);
    }
    report.push({file,clip:clip.name,triangles,joints,positionError,rotationError});check(positionError<.006&&rotationError<.03,'source deformation changed: '+JSON.stringify(report.at(-1)));
   }
  }
  await writeFile('ASSET_WORK/iteration2/ashscale-deformation.json',JSON.stringify(report,null,2));
 }],
 ['parked Mountain wings and feet hold the canonical rest instead of looping a gait',()=>{
   const root=new Group(),wing=new Bone(),foot=new Bone();wing.name='MountainDragon_WingR_Arm_012';foot.name='MountainDragon__R_Foot_062';root.add(wing,foot);
   const q=new Quaternion().setFromAxisAngle(new Vector3(1,0,0),1),clip=new AnimationClip('montage',60,[new QuaternionKeyframeTrack(wing.name+'.quaternion',[0,4,6,28,30,48,50,60],[0,0,0,1,...q.toArray(),0,0,0,1,...q.toArray(),0,0,0,1,...q.toArray(),0,0,0,1,...q.toArray()])]);
   const motion=new MountainMotion(root,clip);motion.update(0,{state:'idle'},0);const rest=wing.quaternion.clone().normalize(),sole=foot.position.clone();
   for(let i=0;i<600;i++){motion.update(1/60,{state:'idle'},0);check(wing.quaternion.clone().normalize().angleTo(rest)<1e-5,'parked wings actively flap');check(foot.position.distanceTo(sole)<1e-6,'parked foot moves');}
   for(let i=0;i<120;i++)motion.update(1/60,{state:'flight'},0);check(wing.quaternion.angleTo(rest)>.05,'flight no longer animates');motion.dispose();
 }],
 ['secondary rest offsets do not accumulate on joints absent from source animation tracks',()=>{
  const root=new Group(),tail=new Bone(),head=new Bone();tail.name='MountainDragon__Tail_083';head.name='MountainDragon__Head_010';root.add(tail,head);
  const clip=new AnimationClip('source-with-untracked-tail',60,[new QuaternionKeyframeTrack(head.name+'.quaternion',[0,60],[0,0,0,1,0,0,0,1])]),motion=new MountainMotion(root,clip);motion.update(0,{state:'idle'},0);const q=tail.quaternion.clone().normalize();
  for(let i=0;i<600;i++){motion.update(1/60,{state:'idle'},0);check(tail.quaternion.clone().normalize().angleTo(q)<1e-5,'untracked resting tail keeps accumulating offsets');}motion.dispose();
 }],
 ['actual Ashscale preserves source actions and keeps planted stopped feet while flight deforms its wings',async()=>{
  const source=await actual('public/assets/models/dragons/ashscale-family.glb');check(source.animations.length===3&&source.animations.some(c=>/running/.test(c.name)),'three supplied actions missing');
  const assets=new RuntimeAssets(async()=>source),failures:string[]=[],dragon=createDragonVisual(assets,'ashscale',m=>failures.push(m),'Young');await settle();
  try{check(dragon.root.userData.assetStatus==='ready',failures.join(';')||'source not ready');const foot=dragon.root.getObjectByName('r_ankle174_173')!,wing=dragon.root.getObjectByName('r_forearm115_137')!,physics=dragon.root.position.clone();check(foot&&wing,'anatomical joints missing');
   for(let i=0;i<120;i++)dragon.update(1/60,{state:'idle'});dragon.root.updateMatrixWorld(true);check(new Box3().setFromObject(dragon.root,true).getSize(new Vector3()).y>5,'rideable Ashscale remains smaller than its five-unit rider');const f=foot.getWorldPosition(new Vector3()),q=wing.quaternion.clone().normalize();
   const contact=new RigContact(dragon.root,/^([rl])_(ankle|toe)/i);
   for(let i=0;i<600;i++){dragon.update(1/60,{state:'idle'});dragon.root.updateMatrixWorld(true);check(foot.getWorldPosition(new Vector3()).distanceTo(f)<.001,'parked foot drifted');check(wing.quaternion.clone().normalize().angleTo(q)<.001,'parked wings flap');check(Math.abs((contact.minimum(dragon.root)??99)-.12)<.01,'actual soles not planted');}
   for(let i=0;i<180;i++)dragon.update(1/60,{state:'flight',bank:.4});check(wing.quaternion.clone().normalize().angleTo(q)>.1,'source flying action never deforms wing');check(dragon.root.position.distanceTo(physics)<1e-6,'source action moves physics root');contact.clear();
   const root=dragon.root,seat=dragon.mountAnchor,count=assets.stats().instances;dragon.setForm?.('Baby');for(let i=0;i<120;i++)dragon.update(1/60,{state:'idle'});dragon.setForm?.('Young');for(let i=0;i<180;i++)dragon.update(1/60,{state:'idle'});check(dragon.root===root&&dragon.mountAnchor===seat&&assets.stats().instances===count,'Ashscale growth replaced source or anchors');
   let culled=0;dragon.root.traverse(n=>{if(n instanceof SkinnedMesh){culled++;check(n.frustumCulled&&n.boundingSphere,'missing posed culling envelope');for(let i=0;i<32;i++)check(n.boundingSphere!.containsPoint(n.getVertexPosition(Math.floor(i*(n.geometry.attributes.position.count-1)/31),new Vector3())),'posed envelope misses actual geometry');}});check(culled===3,'overlapping LOD skins');
  }finally{dragon.dispose();assets.dispose();}
 }],
 ['regional palettes own materials and do not recolor templates or another clone',async()=>{
  const source=await actual('public/assets/models/dragons/mountain-family.glb'),map=new Texture();let textureDisposals=0;map.addEventListener('dispose',()=>textureDisposals++);source.scene.traverse(n=>{if(n instanceof Mesh)n.material=new MeshStandardMaterial({color:0xffffff,map});});let loads=0;const assets=new RuntimeAssets(async()=>{loads++;return source;}),a=createDragonVisual(assets,'meadow',()=>{},'Young'),b=createDragonVisual(assets,'frost',()=>{},'Young');await settle();
  try{const mats:(MeshStandardMaterial[])[]=[];for(const root of [source.scene,a.root,b.root]){const materials:MeshStandardMaterial[]=[];root.traverse(n=>{if(n instanceof SkinnedMesh)materials.push(...(Array.isArray(n.material)?n.material:[n.material]) as MeshStandardMaterial[]);});mats.push(materials);}
   check(loads===1&&mats[0]![0]!.color.getHex()===0xffffff,'template palette leaked');check(mats[1]![0]!==mats[2]![0]&&mats[1]![0]!==mats[0]![0],'palette material shared');check(mats[1]![0]!.color.getHex()===0x9dc492&&mats[2]![0]!.color.getHex()===0xb6dcec,'regional body colors absent');
   check(mats[1]!.some(m=>m.color.getHex()===0xd7cc8b)&&mats[2]!.some(m=>m.color.getHex()===0xbacfe7),'distinct weighted wing membrane palettes absent');
   check(mats[1]!.every(m=>m.map===map)&&mats[2]!.every(m=>m.map===map),'palette rewrites shared atlas maps');let disposed=0;mats[1]![0]!.addEventListener('dispose',()=>disposed++);a.dispose();a.dispose();check(disposed===1&&textureDisposals===0,'owned palette release touches shared maps or runs twice');check(b.root.userData.assetStatus==='ready'&&assets.stats().instances===1,'dispose destroys another palette clone');
  }finally{a.dispose();b.dispose();assets.dispose();}
 }],
 ['Ashscale failure and dispose-during-load keep a fallback and release every instance',async()=>{
  const failures:string[]=[],failedAssets=new RuntimeAssets(async()=>{throw new Error('offline derivative');}),failed=createDragonVisual(failedAssets,'ashscale',m=>failures.push(m),'Baby');await settle();check(failed.root.userData.assetStatus==='fallback'&&failed.root.children.length>0&&failures.length===1,'silent model failure');failed.dispose();failedAssets.dispose();
  const source=await actual('public/assets/models/dragons/ashscale-lod1.glb');let finish!:(v:typeof source)=>void;const cache=new RuntimeAssets(()=>new Promise(resolve=>{finish=resolve;})),late=createDragonVisual(cache,'ashscale',()=>{},'Guardian');late.dispose();finish(source);await settle();check(cache.stats().instances===0,'late Dragon instance leaked');cache.dispose();
 }],
];
export async function runCoreTests(){const results=[];for(const [name,run] of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}
