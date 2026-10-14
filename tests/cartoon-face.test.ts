import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DoubleSide,Mesh,Raycaster,SkinnedMesh,Vector3} from 'three';
import {RuntimeAssets} from '../src/systems/RuntimeAssets';
import {CartoonBoy} from '../src/creatures/CartoonBoy';
function check(v:unknown,m:string):asserts v {if(!v)throw new Error(m);}
async function actual(){
 const bytes=await readFile('public/assets/models/characters/player/cartoon-boy.glb'),n=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+n).toString());delete doc.images;delete doc.textures;
 doc.materials=doc.materials.map((m:{name:string})=>({name:m.name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[1,1,1,1]}}));
 const json=Buffer.from(JSON.stringify(doc)),pad=(4-json.length%4)%4,out=Buffer.alloc(20+json.length+pad+bytes.length-20-n);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length+pad,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);out.fill(32,20+json.length,20+json.length+pad);bytes.copy(out,20+json.length+pad,20+n);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
function head(boy:CartoonBoy):SkinnedMesh{const mesh=boy.root.getObjectByName('Mesh001');check(mesh instanceof SkinnedMesh,'actual source face missing');return mesh;}
const rest={speed:0,airborne:false,vertical:0,carry:false,mounted:false,interact:false};
const cases:[string,()=>Promise<void>][]=[
 ['actual quiet lower lip stays near the nasal profile without accumulating a jaw translation',async()=>{
  const source=await actual(),original=source.scene.getObjectByName('CC_Base_JawRoot')!,position=original.position.clone(),assets=new RuntimeAssets(async()=>source),boy=new CartoonBoy(await assets.acquire('/boy'));
  try{boy.update(0,rest);boy.root.updateMatrixWorld(true);const face=head(boy),lip=face.getVertexPosition(2132,new Vector3()).applyMatrix4(face.matrixWorld),nose=face.getVertexPosition(3879,new Vector3()).applyMatrix4(face.matrixWorld);check(lip.z>=nose.z-.015,'lower lip still protrudes like a permanent pout: '+(nose.z-lip.z));
   const uv=face.geometry.getAttribute('uv');let projection=-Infinity;for(let i=0;i<uv.count;i++)if(uv.getX(i)>.35&&uv.getX(i)<.65&&uv.getY(i)>.50&&uv.getY(i)<.55){const point=face.getVertexPosition(i,new Vector3()).applyMatrix4(face.matrixWorld);projection=Math.max(projection,nose.z-point.z);}check(projection<.025,'upper or side lip still protrudes: '+projection);
   const jaw=boy.root.getObjectByName('CC_Base_JawRoot')!,offset=jaw.position.clone();for(let i=0;i<600;i++){boy.update(1/60,{...rest,carry:i%120>60,mounted:i>300,mountKind:'dragon'});check(jaw.position.distanceTo(offset)<1e-8,'jaw retreat accumulates each frame');}check(original.position.distanceTo(position)<1e-8,'profile correction moves template jaw');
  }finally{boy.dispose();assets.dispose();}
 }],
 ['actual cheek surfaces cover the exposed mouth lining and owned correction leaves source and clothing intact',async()=>{
  const source=await actual(),template=source.scene.getObjectByName('Mesh001') as SkinnedMesh,index=template.geometry.index!.array.slice(),positions=template.geometry.getAttribute('position').array.slice(),assets=new RuntimeAssets(async()=>source),a=new CartoonBoy(await assets.acquire('/boy')),b=new CartoonBoy(await assets.acquire('/boy'));
  try{a.update(0,rest);a.root.updateMatrixWorld(true);const face=head(a);(face.material as import('three').Material).side=DoubleSide;face.computeBoundingSphere();const ray=new Raycaster();
   for(const x of [-.14,.14]){ray.set(new Vector3(x,4.145,-2),new Vector3(0,0,1));const hit=ray.intersectObject(face,false)[0];check(hit?.uv,'head surface missing at cheek');check(hit.uv.y<.82,'dark internal mouth lining is visible on cheek '+x+' '+hit.uv.toArray());}
   check(face.geometry!==template.geometry&&face.geometry!==head(b).geometry,'face correction mutates shared source geometry');check(template.geometry.index!.array.every((v,i)=>v===index[i]),'original head triangle data changed');
   check(template.geometry.getAttribute('position').array.every((v,i)=>v===positions[i]),'rest mouth edits source positions');
   for(const name of ['shoes_L','shoes_R','Hoodie','Shorts']){const sourceMesh=source.scene.getObjectByName(name) as Mesh,actualMesh=a.root.getObjectByName(name) as Mesh;check(actualMesh.geometry===sourceMesh.geometry,'face polish clones or changes clothing '+name);}
   let disposed=0;face.geometry.addEventListener('dispose',()=>disposed++);a.dispose();a.dispose();check(disposed===1&&assets.stats().instances===1,'face ownership double disposes or releases another rider');b.update(1/60,rest);check(head(b).geometry.index!.count>0,'disposing a face damages another instance');
  }finally{a.dispose();b.dispose();assets.dispose();}
 }],
 ['actual eyelids soften between blinks and the quiet jaw remains stable across player poses',async()=>{
  const source=await actual(),assets=new RuntimeAssets(async()=>source),boy=new CartoonBoy(await assets.acquire('/boy'));
  try{boy.update(0,rest);const face=head(boy),blink=face.morphTargetDictionary!.Eye_Blink!,smile=face.morphTargetDictionary!.Mouth_Smile!,jaw=boy.root.getObjectByName('CC_Base_JawRoot')!,q=jaw.quaternion.clone().normalize();const initial=face.morphTargetInfluences![blink]!;check(initial>.08&&initial<.35,'idle face returns to a wide unsoftened stare');
   let max=0;for(let i=0;i<300;i++){boy.update(1/60,{...rest,carry:i>120&&i<180,mounted:i>180,mountKind:'dragon'});const lid=face.morphTargetInfluences![blink]!;check(Number.isFinite(lid)&&lid>=initial-1e-6&&lid<=.95,'blink leaves safe source range');max=Math.max(max,lid);check(face.morphTargetInfluences![smile]===0,'forced grin returned');check(jaw.quaternion.clone().normalize().angleTo(q)<1e-6,'quiet jaw closure accumulates or moves with carrying/riding');}check(max>.8,'source blink no longer closes');check(Math.abs(face.morphTargetInfluences![blink]!-initial)<1e-6,'eyelids do not return to soft resting state');
  }finally{boy.dispose();check(assets.stats().instances===0,'facial controls retain source instance');assets.dispose();}
 }],
];
export async function runCoreTests(){const results=[];for(const[name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}
