import { MathUtils, Quaternion, Vector3 } from 'three';
import type { Bone, Object3D } from 'three';
import { RigContact } from './RigContact';
import { reachHand } from './RigIK';
type Leg={side:'L'|'R';thigh:Bone;knee:Bone;foot:Bone;rest:Vector3;offset:Vector3;rotation:Quaternion;target:Vector3;start:Vector3;end:Vector3;worldRotation:Quaternion;stance:boolean;};
/** Short real-sole stances on the visual rig. Travel still belongs to physics. */
export class RigFootSupport {
 private readonly legs:Leg[]=[];
 private readonly contact:RigContact;
 private parent:Object3D|null=null;private initialized=false;private phase=0;
 private readonly previous=new Vector3();private readonly position=new Vector3();private readonly target=new Vector3();private readonly pole=new Vector3();
 private readonly rotation=new Quaternion();private readonly normal=new Vector3();private readonly slope=new Quaternion();private readonly up=new Vector3(0,1,0);
 private readonly offsetRotation=new Quaternion();
 constructor(private readonly root:Object3D,find:(name:string)=>Bone|undefined){
  root.updateWorldMatrix(true,true);root.updateMatrixWorld(true);this.contact=new RigContact(root,/^CC_Base_([LR])_(Foot|ToeBase)$/, .5);
  for(const side of ['L','R']as const){const thigh=find(`CC_Base_${side}_Thigh`),knee=find(`CC_Base_${side}_Calf`),foot=find(`CC_Base_${side}_Foot`),sole=new Vector3();if(!thigh||!knee||!foot||!this.contact.sole(side,sole))continue;
   const rest=root.worldToLocal(sole.clone()),offset=foot.getWorldPosition(new Vector3()).sub(sole),rotation=foot.getWorldQuaternion(new Quaternion());
   this.legs.push({side,thigh,knee,foot,rest,offset,rotation,target:new Vector3(),start:new Vector3(),end:new Vector3(),worldRotation:new Quaternion(),stance:false});
  }
 }
 reset():void {this.initialized=false;this.parent=null;for(const leg of this.legs)leg.stance=false;}
 update(dt:number,moving:number,speed:number,height?:((x:number,z:number)=>number)):void {
  const parent=this.root.parent;if(!parent||!this.legs.length){this.reset();return;}
  parent.updateWorldMatrix(true,false);parent.updateMatrixWorld(true);parent.getWorldPosition(this.position);parent.getWorldQuaternion(this.rotation);
  const floor=height??(()=>this.position.y),distance=this.position.distanceTo(this.previous);
  const restarted=!this.initialized||this.parent!==parent||distance>3;
  if(restarted){this.phase=0;this.parent=parent;this.initialized=true;for(const leg of this.legs){parent.localToWorld(leg.target.copy(leg.rest));leg.target.y=floor(leg.target.x,leg.target.z);leg.start.copy(leg.target);leg.end.copy(leg.target);leg.stance=false;}}
  else this.phase=(this.phase+Math.hypot(this.position.x-this.previous.x,this.position.z-this.previous.z)/4.2)%1;
  this.previous.copy(this.position);
  const walking=moving>.15&&speed>.2;
  for(const leg of this.legs){
   const cycle=(this.phase+(leg.side==='L'?0:.5))%1,stance=!walking||cycle<.5;
   if(!walking){parent.localToWorld(this.target.copy(leg.rest));this.target.y=floor(this.target.x,this.target.z);leg.target.lerp(this.target,1-Math.exp(-14*dt));leg.stance=false;}
   else if(stance){if(!leg.stance){if(!restarted){parent.localToWorld(leg.target.copy(leg.rest).add(new Vector3(0,0,-1.05+cycle*4.2)));leg.target.y=floor(leg.target.x,leg.target.z);}leg.stance=true;}}
   else {
    if(leg.stance||restarted){leg.start.copy(leg.target);leg.stance=false;}
    parent.localToWorld(leg.end.copy(leg.rest).add(new Vector3(0,0,-1.05)));leg.end.y=floor(leg.end.x,leg.end.z);
    const progress=(cycle-.5)*2,smooth=progress*progress*(3-2*progress);
    leg.target.lerpVectors(leg.start,leg.end,smooth);leg.target.y+=Math.sin(progress*Math.PI)*MathUtils.lerp(.4,.62,Math.min(1,speed/50));
   }
   if(!leg.stance||restarted){const x=leg.target.x,z=leg.target.z,step=.15;this.normal.set((floor(x-step,z)-floor(x+step,z))/(step*2),1,(floor(x,z-step)-floor(x,z+step))/(step*2)).normalize();this.slope.setFromUnitVectors(this.up,this.normal);leg.worldRotation.copy(this.slope).multiply(this.rotation).multiply(leg.rotation);}
   this.offsetRotation.copy(leg.rotation).invert().premultiply(leg.worldRotation);
   this.target.copy(leg.offset).applyQuaternion(this.offsetRotation).add(leg.target);
   parent.localToWorld(this.pole.set(leg.rest.x*2.3,1.2,-2.8));
   reachHand(this.root,leg.thigh,leg.knee,leg.foot,this.target,this.pole,1);
   leg.foot.quaternion.copy(leg.foot.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(leg.worldRotation));this.root.updateMatrixWorld(true);
   const gap=this.contact.supportGap(leg.side,floor),lift=leg.target.y-floor(leg.target.x,leg.target.z);
   if(gap!==undefined&&Math.abs(lift-gap)<.25){this.target.y+=lift-gap;reachHand(this.root,leg.thigh,leg.knee,leg.foot,this.target,this.pole,1);leg.foot.quaternion.copy(leg.foot.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(leg.worldRotation));this.root.updateMatrixWorld(true);}
  }
 }
 clear():void {this.reset();this.contact.clear();this.legs.length=0;}
}
