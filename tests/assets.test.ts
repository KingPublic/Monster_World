import { AnimationClip, Bone, BufferGeometry, Float32BufferAttribute, Group, InstancedMesh, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, QuaternionKeyframeTrack, Skeleton, SkinnedMesh, Uint16BufferAttribute, Vector3 } from 'three';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { poseCarriedEggs } from '../src/creatures/CarriedEggs';
import { RideableDragon } from '../src/creatures/RideableDragon';
import { FollowCamera } from '../src/systems/FollowCamera';
import { citySolids } from '../src/world/SanctuaryLayout';
import type { InputSystem } from '../src/systems/InputSystem';
import { CartoonBoy } from '../src/creatures/CartoonBoy';
import { sampleMontageWindow } from '../src/creatures/MountainMotion';
import { RigContact } from '../src/creatures/RigContact';
import { isBlocked } from '../src/world/Traversal';
import { batchStaticScene } from '../src/utils/batchStaticScene';
import { disposeScene } from '../src/utils/scene';
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
function fixture(){const scene=new Group(),bone=new Bone(),geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3));geometry.setAttribute('skinIndex',new Uint16BufferAttribute(new Array(12).fill(0),4));geometry.setAttribute('skinWeight',new Float32BufferAttribute([1,0,0,0,1,0,0,0,1,0,0,0],4));const mesh=new SkinnedMesh(geometry,new MeshBasicMaterial());scene.add(bone,mesh);mesh.bind(new Skeleton([bone]));return {scene,animations:[]};}
const cases:[string,()=>Promise<void>][]=[
 ['Dragon culling bounds follow skin motion rather than disabling all offscreen culling',async()=>{
  const source=fixture();for(const name of ['MountainDragon__Pelvis_03','MountainDragon__R_Foot_062','MountainDragon__L_Foot_074']){const bone=new Bone();bone.name=name;source.scene.add(bone);}
  const assets=new RuntimeAssets(async()=>source),dragon=new RideableDragon(assets,'family.glb',()=>{});
  for(let i=0;i<8;i++)await Promise.resolve();let mesh:SkinnedMesh|undefined;dragon.root.traverse(n=>{if(n instanceof SkinnedMesh)mesh=n;});check(mesh,'missing skin');
  check(mesh.frustumCulled,'offscreen Dragon is forced into every render pass');
  mesh.skeleton.bones[0]!.position.set(2500,1800,-1200);dragon.update(1/60,{state:'flight',bank:.5});
  check(mesh.boundingSphere,'missing posed culling envelope');for(let i=0;i<3;i++)check(mesh.boundingSphere.containsPoint(mesh.getVertexPosition(i,new Vector3())),'culling envelope misses moving skin');
  dragon.dispose();assets.dispose();
 }],
 ['static city batching keeps world positions, replacement groups and instance disposal',async()=>{
  const root=new Group(),geometry=fixture().scene.children[1] as SkinnedMesh,material=new MeshBasicMaterial(),bench=new Group(),replacement=new Group();root.add(bench,replacement);bench.position.set(10,2,5);
  for(let i=0;i<6;i++){const mesh=new Mesh(geometry.geometry,material);mesh.position.set(i,1,0);bench.add(mesh);}for(let i=0;i<2;i++)replacement.add(new Mesh(geometry.geometry,material));
  batchStaticScene(root,new Set([replacement]));root.updateMatrixWorld(true);const batches:InstancedMesh[]=[];root.traverse(n=>{if(n instanceof InstancedMesh)batches.push(n);});
  check(batches.length===1&&batches[0]!.count===6,'static decorations still require a draw per object');check(replacement.children.length===2,'batching consumed replaceable fallback');
  const batch=batches[0]!;for(let i=0;i<6;i++){batch.getMatrixAt(i,bench.matrix);check(new Vector3().setFromMatrixPosition(bench.matrix).distanceTo(new Vector3(i+10,3,5))<.001,'batch moved scenery');}
  let disposed=0;batch.addEventListener('dispose',()=>disposed++);disposeScene(root);check(disposed===1,'instance attribute buffers were not released');geometry.skeleton.dispose();
 }],
 ['camera keeps its distance when looking away from a legal wall-adjacent position',async()=>{
  const camera=new PerspectiveCamera(),input={consumeLook:()=>({x:0,y:0})} as unknown as InputSystem;
  const follow=new FollowCamera(camera,input),hall=citySolids.find(s=>s.id==='collection')!;
  const target=new Vector3(hall.x+hall.halfX+.8,hall.minY,hall.z);
  check(!isBlocked(target.x,target.z),'wall-adjacent fixture is not a legal position');
  follow.yaw=-Math.PI/2;follow.update(1/60,target,false,false);
  check(camera.position.distanceTo(target.clone().add(new Vector3(0,3.1,0)))>14,'camera collapses into avatar beside a facade');
 }],
 ['foot contact samples both feet when the initially lower foot lifts',async()=>{
  const root=new Group(),right=new Bone(),left=new Bone(),geometry=new BufferGeometry();right.name='MountainDragon__R_Foot_062';left.name='MountainDragon__L_Foot_074';left.position.y=.5;
  const p:number[]=[],indices:number[]=[],weights:number[]=[];for(let i=0;i<128;i++){p.push(i<64?1:-1,i<64?0:.5,(i%64)*.01);indices.push(i<64?0:1,0,0,0);weights.push(1,0,0,0);}
  geometry.setAttribute('position',new Float32BufferAttribute(p,3));geometry.setAttribute('skinIndex',new Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new Float32BufferAttribute(weights,4));const mesh=new SkinnedMesh(geometry,new MeshBasicMaterial());root.add(right,left,mesh);root.updateMatrixWorld(true);mesh.bind(new Skeleton([right,left]));
  const contact=new RigContact(root);right.position.y=2;left.position.y=0;root.updateMatrixWorld(true);check(Math.abs(contact.minimum(root)??99)<.001,'lower stance foot absent from contact samples');contact.clear();geometry.dispose();(mesh.material as MeshBasicMaterial).dispose();mesh.skeleton.dispose();
 }],
 ['mounted rider hands reach the saddle grip instead of remaining in a T-pose',async()=>{
  const source=fixture(),upper=new Bone(),elbow=new Bone(),hand=new Bone();upper.name='CC_Base_L_Upperarm';elbow.name='CC_Base_L_Forearm';hand.name='CC_Base_L_Hand';upper.position.set(.12,.62,0);elbow.position.x=.2;hand.position.x=.2;source.scene.add(upper);upper.add(elbow);elbow.add(hand);
  const rider=new CartoonBoy({root:source.scene,clips:[],release:()=>{}}),parent=new Group();parent.add(rider.root);
  for(let i=0;i<150;i++)rider.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false});
  parent.updateMatrixWorld(true);check(hand.getWorldPosition(new Vector3()).distanceTo(new Vector3(-.52,.35,-.6))<.1,'rider hands hover away from saddle');rider.dispose();
 }],
 ['montage windows sample sparse boundary keys and close the loop without changing source',async()=>{
  const finish=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),Math.PI/2),source=new AnimationClip('sparse',10,[new QuaternionKeyframeTrack('head.quaternion',[0,10],[0,0,0,1,...finish.toArray()])]);
  const clip=sampleMontageWindow(source,'window',2,4),track=clip.tracks[0];
  check(track,'sparse track disappeared at window boundary');const first=new Quaternion().fromArray(track.values),last=new Quaternion().fromArray(track.values,track.values.length-4);
  const expected=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),Math.PI*.1);
  check(first.angleTo(expected)<.0001,'window fails to interpolate first pose');check(first.angleTo(last)<.0001,'window loop snaps');check(Math.abs(clip.duration-2)<.0001&&source.tracks[0]!.times[1]===10,'duration/source mutated');
 }],
 ['rider blends into mounted pose instead of snapping limbs in one frame',async()=>{
  const source=fixture(),arm=new Bone();arm.name='CC_Base_L_Upperarm';source.scene.add(arm);
  const rider=new CartoonBoy({root:source.scene,clips:[],release:()=>{}}),before=arm.quaternion.clone();
  rider.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false});
  check(before.angleTo(arm.quaternion)<.35,'mounted arm snaps instantly');
  for(let i=0;i<90;i++)rider.update(1/60,{speed:0,airborne:false,vertical:0,carry:false,mounted:true,interact:false});
  check(before.angleTo(arm.quaternion)>.45,'mounted pose never arrives');rider.dispose();
 }],
 ['camera retracts before a building rear facade instead of entering the model',async()=>{
  const camera=new PerspectiveCamera(),input={consumeLook:()=>({x:0,y:0})} as unknown as InputSystem;
  const follow=new FollowCamera(camera,input),hall=citySolids.find(s=>s.id==='collection')!;
  const target=new Vector3(hall.x,hall.minY,hall.z-hall.halfZ-4);
  follow.update(1/60,target,false,false);
  check(camera.position.z<hall.z-hall.halfZ-1,'camera entered a downloaded facade');
 }],
 ['Baby growth keeps the same downloaded family, instance, rider anchors and physics root',async()=>{
  const source=fixture(), names=['MountainDragon__Pelvis_03','MountainDragon__R_Foot_062','MountainDragon__L_Foot_074','MountainDragon__Head_010'];
  for(const [i,name] of names.entries()){const bone=new Bone();bone.name=name;bone.position.set(i===1?-100:i===2?100:0,i===0?400:i===3?700:0,0);source.scene.add(bone);}
  const assets=new RuntimeAssets(async()=>source),dragon=new RideableDragon(assets,'family.glb',()=>{},'Baby');
  dragon.root.position.set(20,5,30);const root=dragon.root,anchor=dragon.mountAnchor;
  for(let i=0;i<8;i++)await Promise.resolve();
  check(root.userData.assetStatus==='ready','family did not load');check(root.userData.form==='Baby','Baby still uses unrelated visual');
  const before=assets.stats().instances;dragon.setForm('Young');
  for(let i=0;i<120;i++)dragon.update(1/60,{state:'idle'});
  check(dragon.root===root&&dragon.mountAnchor===anchor,'growth recreated physics or rider anchors');
  check(root.position.x===20&&root.position.y===5&&root.position.z===30,'growth displaced the Dragon');
  check(root.userData.form==='Young'&&root.userData.runtimeAsset==='family.glb','growth changed family');
  check(assets.stats().instances===before,'growth redownloaded or cloned model');dragon.dispose();assets.dispose();
 }],
 ['mounted carry keeps one rider egg and independent eggs at both moving talons',async()=>{
  const world=new Group(),dragon=new Group(),rider=new Group(),carried=new Group(),right=new Group(),left=new Group();world.add(dragon);dragon.add(rider,right,left);rider.add(carried);rider.position.set(0,4,0);right.position.set(-2,1,1);left.position.set(2,1,1);for(let i=0;i<3;i++)carried.add(new Group());
  dragon.position.set(100,30,-80);dragon.rotation.y=.7;poseCarriedEggs(carried,[right,left],true);world.updateMatrixWorld(true);
  check(carried.children[0]!.userData.attachment==='rider','first egg leaves rider');
  check(carried.children[1]!.getWorldPosition(right.position.clone()).distanceTo(right.getWorldPosition(left.position.clone()))<.001,'second egg misses right talon');
  check(carried.children[2]!.userData.attachment==='left-talon','third egg misses left talon');
  right.position.y=3;poseCarriedEggs(carried,[right,left],true);world.updateMatrixWorld(true);check(Math.abs(carried.children[1]!.getWorldPosition(left.position.clone()).y-33)<.001,'egg does not follow moving claw');
  poseCarriedEggs(carried,[right,left],false);check(carried.children.every(egg=>egg.userData.attachment==='rider'),'dismount leaves eggs at dragon');
 }],
 ['cached clones isolate skeletons and release shared GPU resources only once',async()=>{
  const source=fixture();let loads=0,disposals=0;source.scene.children[1]!.addEventListener('removed',()=>{});(source.scene.children[1] as SkinnedMesh).geometry.addEventListener('dispose',()=>disposals++);
  const assets=new RuntimeAssets(async()=>{loads++;return source;});
  const [a,b]=await Promise.all([assets.acquire('same.glb'),assets.acquire('same.glb')]);check(loads===1,'concurrent requests duplicate download');
  const ma=a.root.children[1] as SkinnedMesh,mb=b.root.children[1] as SkinnedMesh;
  check(ma.skeleton!==mb.skeleton && ma.skeleton.bones[0]!==mb.skeleton.bones[0],'clone shares live bones');ma.skeleton.bones[0]!.rotation.x=1;check(mb.skeleton.bones[0]!.rotation.x===0,'pose leaks between instances');
  a.release();a.release();check(disposals===0,'release disposes a shared geometry');check(b.root.children.length===2,'release destroys another clone');
  assets.dispose();assets.dispose();check(disposals===1,'template must dispose exactly once');check(assets.stats().instances===0,'active instances retained on shutdown');
 }],
 ['failed load can retry and an in-flight load is disposed on shutdown',async()=>{
  let attempt=0;const retry=new RuntimeAssets(async()=>{if(++attempt===1)throw new Error('missing');return fixture();});
  await retry.acquire('missing.glb').then(()=>{throw new Error('failure swallowed');},()=>{});const instance=await retry.acquire('missing.glb');check(attempt===2,'failed cache prevents retry');instance.release();retry.dispose();
  const source=fixture();let finish!:(value:ReturnType<typeof fixture>)=>void,disposed=0;(source.scene.children[1] as SkinnedMesh).geometry.addEventListener('dispose',()=>disposed++);
  const pending=new RuntimeAssets(()=>new Promise(resolve=>{finish=resolve;}));const load=pending.acquire('slow.glb');pending.dispose();finish(source);await load.then(()=>{throw new Error('late instance escaped disposal');},()=>{});check(disposed===1,'late template leaked');
 }],
];
export async function runCoreTests(){const results=[];for(const [name,run] of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}
