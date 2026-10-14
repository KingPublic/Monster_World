import { readFile } from 'node:fs/promises';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SkinnedMesh, Vector3 } from 'three';
import type { Object3D } from 'three';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { AmbientResidents } from '../src/world/AmbientResidents';
import { isBlocked } from '../src/world/Traversal';
import { residentCatalog,residentLimits } from '../src/world/ResidentCatalog';
function check(value:unknown,message:string):asserts value {if(!value)throw new Error(message);}
async function source(name:string) {
 // The actual rig, weights and animation buffers are parsed unchanged; textures
 // are omitted only because these CPU motion tests have no DOM/image decoder.
 const file=await readFile('public/assets/models/characters/npc/'+name+'.glb'),length=file.readUInt32LE(12),json=JSON.parse(file.subarray(20,20+length).toString());
 delete json.materials;delete json.textures;delete json.images;
 for(const mesh of json.meshes)for(const primitive of mesh.primitives)delete primitive.material;
 const text=Buffer.from(JSON.stringify(json)),padding=(4-text.length%4)%4,out=Buffer.alloc(20+text.length+padding+file.length-20-length);
 out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(text.length+padding,12);out.writeUInt32LE(0x4e4f534a,16);text.copy(out,20);out.fill(32,20+text.length,20+text.length+padding);file.copy(out,20+text.length+padding,20+length);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
async function setup(){const [traveler,knight]=await Promise.all([source('traveler'),source('knight')]);const assets=new RuntimeAssets(async url=>url.includes('knight')?knight:traveler),residents=new AmbientResidents(assets),focus=new Vector3(-30,1,35);residents.update(0,focus);for(let i=0;i<12;i++)await Promise.resolve();check(residents.status.errors.length===0,'NPC load error');check(residents.root.getObjectByName('garden-traveler')?.children.length,'actual Traveler did not load');residents.update(0,focus);return{assets,residents,focus};}
// Independent fixed-vertex probe: keep both foot selections and indices stable
// across frames; exclude airborne toe-off points rather than comparing minima.
function soleVertices(actor:Object3D){actor.updateWorldMatrix(true,true);const samples:{mesh:SkinnedMesh;index:number}[]=[];actor.traverse(node=>{if(!(node instanceof SkinnedMesh))return;const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight'),sides:{index:number;y:number}[][]=[[],[]];for(let i=0;i<indices.count;i++){let r=0,l=0;for(let k=0;k<4;k++){const name=node.skeleton.bones[indices.getComponent(i,k)]?.name??'',w=weights.getComponent(i,k);if(/^(footR|toeR)/.test(name))r+=w;if(/^(footL|toeL)/.test(name))l+=w;}if(r+l>=.5)sides[r>=l?0:1]!.push({index:i,y:node.getVertexPosition(i,new Vector3()).applyMatrix4(node.matrixWorld).y});}for(const side of sides){side.sort((a,b)=>a.y-b.y);for(const point of side.slice(0,32))samples.push({mesh:node,index:point.index});}});return ()=>samples.map(({mesh,index})=>mesh.getVertexPosition(index,new Vector3()).applyMatrix4(mesh.matrixWorld));}
export const soleDriftEvidence:{fps:number;direction:number;count:number;median:number;p95:number}[]=[];
const cases:[string,()=>Promise<void>][]=[
 ['remote source-rig residents walk stop to talk resume and release distant instances within budget',async()=>{
  const {assets,residents,focus}=await setup();try{
   const definition=residentCatalog.find(r=>r.id==='frost-traveler-1')!,actor=residents.root.getObjectByName(definition.id)!;focus.copy(actor.position).add(new Vector3(10,0,0));residents.update(0,focus);for(let i=0;i<20;i++)await Promise.resolve();residents.update(0,focus);
   check(actor.getObjectByName('footR_32'),'remote Traveler uses a placeholder instead of source rig');const start=actor.position.clone();for(let i=0;i<600;i++)residents.update(1/60,focus);check(actor.position.distanceTo(start)>4,'remote Traveler walks in place');
   const talkPosition=actor.position.clone().add(new Vector3(4,0,0));check(residents.beginTalk(definition.id,talkPosition),'talk did not start');const held=actor.position.clone();for(let i=0;i<180;i++)residents.update(1/60,talkPosition);check(actor.position.distanceTo(held)<1e-7,'Traveler leaves conversation');residents.endTalk();for(let i=0;i<300;i++)residents.update(1/60,talkPosition.clone().add(new Vector3(20,0,0)));check(actor.position.distanceTo(held)>2,'Traveler never resumes');
   for(const r of residentCatalog.filter(r=>r.role==='guide')){const other=residents.root.getObjectByName(r.id)!;focus.copy(other.position).add(new Vector3(10,0,0));residents.update(0,focus);for(let i=0;i<20;i++)await Promise.resolve();residents.update(0,focus);check(residents.status.active<=residentLimits.maxActive,'resident rig cap exceeded');check(assets.stats().instances<=residentLimits.maxActive,'old remote skeletons leaked');}
  }finally{residents.dispose();check(assets.stats().instances===0,'disposed residents keep cache instances');assets.dispose();}
 }],
 ['actual Traveler Walk translates a useful distance while facing its visible toe-forward axis',async()=>{
  const {assets,residents,focus}=await setup();try{const actor=residents.root.getObjectByName('garden-traveler')!,before=actor.position.clone();let traveled=0,aligned=0,moving=0;
  for(let i=0;i<360;i++){const last=actor.position.clone();residents.update(1/60,focus);residents.root.updateMatrixWorld(true);const delta=actor.position.clone().sub(last);delta.y=0;traveled+=delta.length();if(delta.length()>.005){const foot=actor.getObjectByName('footR_32')!.getWorldPosition(new Vector3()),toe=actor.getObjectByName('toeR_31')!.getWorldPosition(new Vector3());const forward=toe.sub(foot);forward.y=0;if(forward.normalize().dot(delta.normalize())>.8)aligned++;moving++;}}
  check(traveled>6,'Walk travels only '+traveled.toFixed(3)+' units in six seconds');check(actor.position.distanceTo(before)>3,'Traveler did not traverse the route');check(aligned/moving>.9,'visible foot-forward direction differs from travel');
  }finally{residents.dispose();assets.dispose();}
 }],
 ['actual Travelers pause with stationary planted feet and never cross city solids',async()=>{
  const {assets,residents,focus}=await setup();try{const actor=residents.root.getObjectByName('garden-traveler')!;let held=0,maxHeld=0,quietFeet=0,lastToe=new Vector3();
  for(let i=0;i<2700;i++){const before=actor.position.clone();residents.update(1/60,focus);residents.root.updateMatrixWorld(true);const toe=actor.getObjectByName('toeR_31')!.getWorldPosition(new Vector3());for(const id of ['garden-traveler','market-traveler']){const resident=residents.root.getObjectByName(id)!;check(!isBlocked(resident.position.x,resident.position.z),id+' route intersects a city solid');}if(before.distanceTo(actor.position)<1e-7){held++;maxHeld=Math.max(maxHeld,held);if(held>35&&toe.distanceTo(lastToe)<1e-5)quietFeet++;}else held=0;lastToe.copy(toe);}
  check(maxHeld>=60,'Traveler has no deliberate one-second rest');check(quietFeet>=30,'feet keep walking during the pause');
  }finally{residents.dispose();assets.dispose();}
 }],
 ['Traveler turns gradually at a stationary route endpoint rather than snapping its heading',async()=>{
  const {assets,residents,focus}=await setup();try{const actor=residents.root.getObjectByName('garden-traveler')!;let turns=0;for(let i=0;i<1500;i++){const position=actor.position.clone(),heading=actor.rotation.y;residents.update(1/60,focus);const difference=Math.abs(Math.atan2(Math.sin(actor.rotation.y-heading),Math.cos(actor.rotation.y-heading)));check(difference<.2,'NPC heading snapped by '+difference+' radians');if(position.distanceTo(actor.position)<1e-7&&difference>.001)turns++;}check(turns>=20,'endpoint pause has no deliberate gradual turn');
  }finally{residents.dispose();assets.dispose();}
 }],
 ['actual planted soles resist skating on both route directions at30 60 and120fps',async()=>{
  for(const fps of [30,60,120]){const {assets,residents,focus}=await setup();try{const actor=residents.root.getObjectByName('garden-traveler')!,read=soleVertices(actor);let previous=read(),straight=0;const samples:number[][]=[[],[]];for(let i=0;i<fps*30;i++){const heading=actor.rotation.y;residents.update(1/fps,focus);residents.root.updateMatrixWorld(true);const current=read(),turn=Math.abs(Math.atan2(Math.sin(actor.rotation.y-heading),Math.cos(actor.rotation.y-heading)));if(actor.userData.locomotion.state==='walk'&&turn<1e-6){straight++;if(straight>fps*2){const side=Math.cos(actor.rotation.y)<0?0:1;for(let k=0;k<current.length;k++){const a=previous[k]!,b=current[k]!;if(Math.max(a.y,b.y)<1.015)samples[side]!.push(Math.hypot(b.x-a.x,b.z-a.z)*fps);}}}else straight=0;previous=current;}
  for(const [direction,values]of samples.entries()){values.sort((a,b)=>a-b);check(values.length>300,'missing continuous stance samples fps'+fps+' direction'+direction);const median=values[Math.floor(values.length*.5)]!,p95=values[Math.floor(values.length*.95)]!;soleDriftEvidence.push({fps,direction,count:values.length,median,p95});check(median<.25&&p95<1.8,'sole skating fps'+fps+' direction'+direction+' n'+values.length+' median '+median.toFixed(6)+' p95 '+p95.toFixed(6));}
  }finally{residents.dispose();assets.dispose();}}
 }],
 ['Knight holds its reviewed planted pose and residents do not duplicate the mountable Horse',async()=>{
  const {assets,residents,focus}=await setup();try{const knight=residents.root.getObjectByName('arrival-knight')!,before=knight.position.clone(),rotation=knight.quaternion.clone();for(let i=0;i<600;i++)residents.update(1/60,focus);check(knight.position.distanceTo(before)<1e-7&&knight.quaternion.angleTo(rotation)<1e-7,'stationary Knight foot/root pose keeps drifting');check(!residents.root.getObjectByName('garden-horse'),'old ambient Horse duplicates playable mount');
  }finally{residents.dispose();assets.dispose();}
 }],
];
export async function runCoreTests(){const results=[];for(const [name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}

