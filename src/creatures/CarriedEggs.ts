import { Quaternion, Vector3 } from 'three';
import type { Group, Object3D } from 'three';
const position=new Vector3(),rotation=new Quaternion(),inverse=new Quaternion();
/** All eggs keep one resource owner while following rider/talon world transforms. */
export function poseCarriedEggs(root:Group,talons:readonly Object3D[],mounted:boolean):void{
 root.position.set(0,0,0);root.updateWorldMatrix(true,false);inverse.copy(root.getWorldQuaternion(rotation)).invert();
 root.children.forEach((egg,index)=>{
  const talon=mounted&&index>0?talons[index-1]:undefined;
  if(talon){egg.position.copy(root.worldToLocal(talon.getWorldPosition(position)));egg.quaternion.copy(inverse).multiply(talon.getWorldQuaternion(rotation));egg.userData.attachment=index===1?'right-talon':'left-talon';}
  else{egg.position.set(mounted?0:(index-1)*.75,mounted?.5:2.2,-1.2);egg.rotation.set(0,0,0);egg.userData.attachment='rider';}
 });
}
