import { Matrix4, Quaternion, SkinnedMesh, Vector3 } from 'three';
import type { Bone, Object3D } from 'three';
/** Calibrate against actual weighted upper torso; then follow that joint. */
export class RigSaddle {
 private readonly offset=new Vector3();private readonly restRotation=new Quaternion();
 private readonly point=new Vector3();private readonly inverse=new Matrix4();private readonly rotation=new Quaternion();
 constructor(model:Object3D,private readonly joint:Bone,space:Object3D,scale:number){
  space.updateWorldMatrix(true,true);this.inverse.copy(space.matrixWorld).invert();const center=joint.getWorldPosition(new Vector3()).applyMatrix4(this.inverse);const candidates:{point:Vector3;side:number}[]=[];
  model.traverse(node=>{if(!(node instanceof SkinnedMesh))return;const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight');if(!indices||!weights)return;
   for(let i=0;i<indices.count;i++){let body=0,wing=0;for(let j=0;j<4;j++){const name=node.skeleton.bones[indices.getComponent(i,j)]?.name??'';if(/spine|pelvis/i.test(name))body+=weights.getComponent(i,j);if(/Wing[RL]|^([rl])_(upperArm|forearm|wing)/i.test(name))wing+=weights.getComponent(i,j);}if(body<.45||wing>.15)continue;
    node.getVertexPosition(i,this.point).applyMatrix4(node.matrixWorld).applyMatrix4(this.inverse);const x=this.point.x-center.x,z=this.point.z-center.z;
    if(Math.abs(x)>.75*scale||Math.abs(z-.15*scale)>.45*scale)continue;candidates.push({point:this.point.clone(),side:Math.sign(x)});
   }
  });
  const top:Vector3[]=[];for(const side of [-1,1]){const half=candidates.filter(c=>c.side===side).sort((a,b)=>b.point.y-a.point.y);for(const p of half.slice(0,8))top.push(p.point);}
  this.point.copy(center).add(new Vector3(0,1.6*scale,.15*scale));
  if(top.length>=4){this.point.copy(center);this.point.z+=.15*scale;this.point.y=Math.max(...top.map(p=>p.y))+.29*scale;}
  this.point.applyMatrix4(space.matrixWorld);joint.worldToLocal(this.offset.copy(this.point));joint.getWorldQuaternion(this.restRotation).invert();
 }
 apply(anchor:Object3D,space:Object3D):void {
  this.point.copy(this.offset).applyMatrix4(this.joint.matrixWorld);space.worldToLocal(this.point);anchor.position.copy(this.point);
  this.joint.getWorldQuaternion(this.rotation).multiply(this.restRotation);anchor.quaternion.copy(space.getWorldQuaternion(new Quaternion()).invert().multiply(this.rotation));
 }
}
