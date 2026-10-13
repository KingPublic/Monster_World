import { Bone, Euler, Quaternion } from 'three';
import type { Object3D } from 'three';
/** Authored offsets in the model's rest axes; never move the physics root. */
export class RigPose {
 private readonly bones=new Map<string,{bone:Bone;rest:Quaternion;parent:Quaternion}>();
 private readonly delta=new Quaternion();private readonly euler=new Euler();
 constructor(model:Object3D){model.updateMatrixWorld(true);const modelQ=model.getWorldQuaternion(new Quaternion());model.traverse(node=>{if(node instanceof Bone){const parent=node.parent!.getWorldQuaternion(new Quaternion()).premultiply(modelQ.clone().invert());this.bones.set(node.name,{bone:node,rest:node.quaternion.clone(),parent});}});}
 reset(){for(const {bone,rest} of this.bones.values())bone.quaternion.copy(rest);}
 rotate(name:string,x=0,y=0,z=0){const record=this.bones.get(name);if(!record)return;this.delta.setFromEuler(this.euler.set(x,y,z));record.bone.quaternion.copy(record.parent).invert().multiply(this.delta).multiply(record.parent).multiply(record.rest);}
 /** Layer an authored offset over the current imported animation pose. */
 add(name:string,x=0,y=0,z=0){const record=this.bones.get(name);if(!record)return;this.delta.setFromEuler(this.euler.set(x,y,z));const offset=record.parent.clone().invert().multiply(this.delta).multiply(record.parent);record.bone.quaternion.premultiply(offset);}
 get(name:string){return this.bones.get(name)?.bone;}
}
