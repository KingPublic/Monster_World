import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Box3,Group,Mesh,Raycaster,SkinnedMesh,Vector3} from 'three';
import {RuntimeAssets} from '../src/systems/RuntimeAssets';
import {CartoonBoy} from '../src/creatures/CartoonBoy';
function check(v:unknown,m:string):asserts v {if(!v)throw new Error(m);}
async function actual(){
 const bytes=await readFile('public/assets/models/characters/player/cartoon-boy.glb'),n=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+n).toString());delete doc.images;delete doc.textures;
 doc.materials=doc.materials.map((m:{name:string})=>({name:m.name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[1,1,1,1]}}));
 const json=Buffer.from(JSON.stringify(doc)),pad=(4-json.length%4)%4,out=Buffer.alloc(20+json.length+pad+bytes.length-20-n);out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(json.length+pad,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);out.fill(32,20+json.length,20+json.length+pad);bytes.copy(out,20+json.length+pad,20+n);
 return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
const rest={speed:0,airborne:false,vertical:0,carry:false,mounted:false,interact:false};
const cases:[string,()=>Promise<void>][]=[
 ['actual player has an owned closed cartoon face with a small mouth behind its nose',async()=>{
  const source=await actual(),assets=new RuntimeAssets(async()=>source),boy=new CartoonBoy(await assets.acquire('/boy'));
  try{boy.update(0,rest);boy.root.updateMatrixWorld(true);const head=boy.root.getObjectByName('CartoonFace-AuthoredHead'),mouth=boy.root.getObjectByName('CartoonFace-NeutralMouth'),nose=boy.root.getObjectByName('CartoonFace-Nose');check(head&&mouth&&nose,'clean authored face missing');check(head.parent?.name==='CC_Base_Head','face does not follow source head bone');
   const mouthBox=new Box3().setFromObject(mouth,true),noseBox=new Box3().setFromObject(nose,true),size=mouthBox.getSize(new Vector3());check(size.x<.22&&size.y<.025,'neutral mouth is oversized or permanently open');check(mouthBox.min.z>noseBox.min.z+.045,'mouth still protrudes beyond its nose');
   const skin=boy.root.getObjectByName('CartoonFace-Skin') as Mesh,ray=new Raycaster(),direction=new Vector3(0,0,1).transformDirection(head.matrixWorld);
   for(const[x,y,z]of[[0,-.021,-.344],[.04,-.019,-.341],[.078,-.014,-.327]]){ray.set(head.localToWorld(new Vector3(x,y,z-.1)),direction);const seam=ray.intersectObject(mouth,false)[0],surface=ray.intersectObject(skin,false)[0];check(seam&&surface&&surface.distance-seam.distance>=-.002&&surface.distance-seam.distance<.013,'mouth seam floats off the cheek surface');}
   for(const name of ['Mesh001','Mesh001_6','CC_Base_Eye','Mesh002','Mesh002_1','CC_Base_Tongue'])check(boy.root.getObjectByName(name)?.visible===false,'old facial surface/teeth remain visible: '+name);
   const local=head.matrix.clone();for(let i=0;i<300;i++){boy.update(1/60,{...rest,speed:i<100?30:0,carry:i>100&&i<180,mounted:i>180,mountKind:'dragon'});boy.root.updateMatrixWorld(true);check(head.matrix.elements.every((v,j)=>Math.abs(v-local.elements[j]!)<1e-8),'face attachment accumulates while walking/mounted');}
  }finally{boy.dispose();assets.dispose();}
 }],
 ['authored face keeps source skin, morphs, hair, clothing, hands and original head bytes intact',async()=>{
  const source=await actual(),template=source.scene.getObjectByName('Mesh001') as SkinnedMesh,positions=template.geometry.getAttribute('position').array.slice(),index=template.geometry.index!.array.slice(),assets=new RuntimeAssets(async()=>source),a=new CartoonBoy(await assets.acquire('/boy')),b=new CartoonBoy(await assets.acquire('/boy'));
  try{const face=a.root.getObjectByName('Mesh001') as SkinnedMesh;check(face.geometry===template.geometry,'replacement edits or clones original head geometry');check(face.morphTargetDictionary?.Mouth_Plosive!==undefined&&face.geometry.getAttribute('skinWeight')&&face.geometry.getAttribute('uv'),'source facial channels/weights/UV lost');check(template.visible&&template.geometry.getAttribute('position').array.every((v,i)=>v===positions[i])&&template.geometry.index!.array.every((v,i)=>v===index[i]),'source head changed');
   for(const name of ['Hair','CC_Hair','shoes_L','shoes_R','Hoodie','Shorts','Mesh001_2']){const sourceMesh=source.scene.getObjectByName(name) as Mesh,actualMesh=a.root.getObjectByName(name) as Mesh;check(actualMesh.geometry===sourceMesh.geometry&&actualMesh.visible===sourceMesh.visible,'presentation replaces source hair/clothing/hands: '+name);}
   const owned=a.root.getObjectByName('CartoonFace-Skin') as Mesh,other=b.root.getObjectByName('CartoonFace-Skin') as Mesh;check(owned&&other&&owned.geometry!==other.geometry&&owned.material!==other.material,'authored face shares disposable instance resources');let disposed=0;owned.geometry.addEventListener('dispose',()=>disposed++);a.dispose();a.dispose();check(disposed===1&&assets.stats().instances===1,'face disposal double releases or harms another rider');b.update(1/60,rest);check(other.geometry.getAttribute('position').count>0,'other authored head lost geometry');
  }finally{a.dispose();b.dispose();assets.dispose();}
 }],
 ['alert cartoon eyes blink and return fully open while source jaw stays stable across poses',async()=>{
  const source=await actual(),assets=new RuntimeAssets(async()=>source),boy=new CartoonBoy(await assets.acquire('/boy'));
  try{boy.update(0,rest);const eye=boy.root.getObjectByName('CartoonFace-Eye-L');check(eye instanceof Group,'owned eyes missing');check(eye.scale.y===1,'resting face has sleepy half-closed eyes');const jaw=boy.root.getObjectByName('CC_Base_JawRoot')!,position=jaw.position.clone(),quaternion=jaw.quaternion.clone().normalize();let minimum=1;for(let i=0;i<300;i++){boy.update(1/60,{...rest,carry:i>100&&i<180,mounted:i>180,mountKind:'dragon'});minimum=Math.min(minimum,eye.scale.y);check(eye.scale.y>=.06&&eye.scale.y<=1,'blink leaves valid range');check(jaw.position.distanceTo(position)<1e-8&&jaw.quaternion.clone().normalize().angleTo(quaternion)<1e-6,'source jaw accumulates across poses');}check(minimum<.15,'authored eyes never close');check(eye.scale.y===1,'eyes do not return to awake rest');
  }finally{boy.dispose();check(assets.stats().instances===0,'face retains source instance');assets.dispose();}
 }],
];
export async function runCoreTests(){const results=[];for(const[name,run]of cases){try{await run();results.push({name,pass:true});}catch(error){results.push({name,pass:false,error:String(error)});}}return results;}
