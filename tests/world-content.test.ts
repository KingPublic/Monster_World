import { gameConfig } from '../src/config/gameConfig';
import { mvpConfig } from '../src/config/mvpConfig';
import { valleyTrails, trailClearance } from '../src/world/Landscape';
import { Environment, valleySurfaceHeight } from '../src/world/Environment';
import { groundHeight } from '../src/world/Traversal';
import { createNestLandscape } from '../src/world/NestLandscape';
import { SafeZoneShield } from '../src/world/SafeZoneShield';
import { disposeScene } from '../src/utils/scene';
import { Matrix4, Mesh, InstancedMesh, Vector3 } from 'three';
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
const cases:[string,()=>Promise<void>][]=[
 ['eight separated nests retain legacy locations and explicit complete balance presets',async()=>{
  check(gameConfig.nestMarkers.length===8,'expected eight nests');check(new Set(gameConfig.nestMarkers.map(n=>n.id)).size===8,'duplicate ids');
  const legacy=[[340,25,-310],[-780,145,-900],[1720,330,-1840],[-1920,620,-3400]];
  legacy.forEach((p,i)=>check(JSON.stringify(p)===JSON.stringify(gameConfig.nestMarkers[i]!.position),'legacy nest moved'));
  for(const n of mvpConfig.nests){check(n.slotCount>=3&&n.pool.reduce((sum,p)=>sum+p.weight,0)===100&&n.guardianSpeed>0,'incomplete preset '+n.id);for(const other of mvpConfig.nests)if(n.id!==other.id)check(Math.hypot(n.position[0]-other.position[0],n.position[2]-other.position[2])>600,'clustered nests');}
  check(gameConfig.world.extent===12000&&mvpConfig.safeZoneRadius===220&&mvpConfig.maxSafeAltitude===100,'authorized larger city/safe bounds changed');
 }],
 ['every nest has a clear trail that reaches its physical landing apron',async()=>{
  for(const n of gameConfig.nestMarkers){check(valleyTrails.some(t=>t.nestId===n.id),'missing route '+n.id);check(trailClearance(n.position[0],n.position[2])<=0,'route misses nest '+n.id);}
 }],
 ['nest aprons and all route samples follow the authoritative walking floor',async()=>{
  for(const n of gameConfig.nestMarkers){for(const r of [0,13,29,45,60,81,83,110])for(let i=0;i<12;i++){const a=i*Math.PI/6,x=n.position[0]+Math.cos(a)*r,z=n.position[2]+Math.sin(a)*r;check(Math.abs(valleySurfaceHeight(x,z)-groundHeight(x,z))<.0001,'render/walk mismatch '+n.id);}}
  for(const t of valleyTrails)for(const p of t.curve.getSpacedPoints(100)){if(Math.hypot(p.x,p.z)>181)check(Math.abs(valleySurfaceHeight(p.x,p.z)-groundHeight(p.x,p.z))<.0001,'buried route '+t.nestId);}
 }],
 ['regional compositions differ and foliage keeps the approach and egg floor open',async()=>{
  const silhouettes=new Set<string>();
  for(const [i,n]of gameConfig.nestMarkers.entries()){
   const nest=createNestLandscape(n,i);const regional=nest.children.filter(c=>c.name.startsWith('Regional'));check(regional.length>0,'missing regional landmarks '+n.id);
   silhouettes.add(regional.map(c=>{const mesh=c as InstancedMesh,box=mesh.boundingBox!,size=box.getSize(new Vector3());return [mesh.geometry.type,mesh.count,Math.round(size.x/10),Math.round(size.y/10),Math.round(size.z/10)].join(':');}).sort().join(','));
   for(const c of nest.children)if(c instanceof InstancedMesh&&(c.name==='NestApronVegetation'||c.name.startsWith('RegionalStems'))){const matrix=new Matrix4();for(let j=0;j<c.count;j++){c.getMatrixAt(j,matrix);const p=new Vector3().setFromMatrixPosition(matrix);check(Math.hypot(p.x,p.z)>38,'foliage hides eggs');check(trailClearance(p.x+n.position[0],p.z+n.position[2])>4,'foliage blocks route '+n.id);}}
   for(const c of nest.children)if(c instanceof Mesh&&c.name==='ReedwaterShallowPool'){
    const p=c.geometry.attributes.position!,normal=c.geometry.attributes.normal!;
    for(let j=0;j<p.count;j++)check(Math.abs(p.getY(j)+n.position[1]-groundHeight(p.getX(j)+n.position[0],p.getZ(j)+n.position[2])-.12)<.001,'water buried in ground');
    check(normal.getY(40)>.5,'water face culled from above');
   }
   disposeScene(nest);
  }
  check(silhouettes.size>=6,'regions repeat one prop composition');
 }],
 ['terrain uses bounded ribbon meshes and releases all owned resources',async()=>{
  const environment=new Environment(),geometries=new Set<import('three').BufferGeometry>();let disposed=0,largest=0;
  environment.group.traverse(o=>{if(o instanceof Mesh){geometries.add(o.geometry);largest=Math.max(largest,o.geometry.attributes.position!.count);}});
  check(largest<50000,'new huge terrain mesh');check(environment.group.children.filter(c=>c.name.startsWith('DetailedTrailGround_')).length===8,'missing fine corridor ground');
  for(const g of geometries)g.addEventListener('dispose',()=>disposed++);disposeScene(environment.group);check(disposed===geometries.size&&environment.group.children.length===0,'terrain resource leak');
 }],
 ['shield matches cylinder radius and ceiling and disposes shared details once',async()=>{
  const shield=new SafeZoneShield();const wall=shield.root.getObjectByName('ShieldCylinderWall') as Mesh,ceiling=shield.root.getObjectByName('ShieldAltitudeCeiling') as Mesh;
  wall.geometry.computeBoundingBox();check(Math.abs(wall.geometry.boundingBox!.max.x-145)<.001&&wall.position.y===50&&ceiling.position.y===100,'shield misrepresents safe volume');
  check(shield.rootGroup===shield.root&&shield.root.children.every(c=>!(c instanceof Mesh)||c.geometry.type!=='ConeGeometry'),'opaque cone perimeter');
  const geometries=new Set<import('three').BufferGeometry>();let disposed=0;shield.root.traverse(o=>{if(o instanceof Mesh){check(!o.material||!Array.isArray(o.material)&&o.material.depthWrite===false,'shield hides city depth');geometries.add(o.geometry);}});for(const g of geometries)g.addEventListener('dispose',()=>disposed++);
  const before=(wall.material as import('three').ShaderMaterial).uniforms.time!.value;shield.update(1/60);check((wall.material as import('three').ShaderMaterial).uniforms.time!.value>before,'shield energy never updates');shield.dispose();shield.dispose();shield.update(1);check(disposed===geometries.size&&shield.root.children.length===0,'shield resource lifetime');
 }],
];
export async function runCoreTests(){const results=[];for(const [name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}
