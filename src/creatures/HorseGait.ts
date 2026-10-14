import { Bone,MathUtils,Quaternion,Vector3 } from 'three';
import type { Group,Object3D } from 'three';
type Leg={end:Bone;chain:Bone[];rest:Vector3;orientation:Quaternion;phase:number;planted:boolean;target:Vector3;};
/** Authored gallop on the downloaded anatomy. The source only supplies Walk.
 * Short alternating support phases keep hooves fixed in world space; swing
 * phases recover the legs without speeding a Walk clip up eleven times. */
export class HorseGait {
 private readonly legs:Leg[]=[];private readonly previous=new Map<Bone,Quaternion>();
 private readonly a=new Vector3();private readonly b=new Vector3();private readonly pivot=new Vector3();private readonly goal=new Vector3();
 private readonly rotation=new Quaternion();private readonly parentQ=new Quaternion();private readonly worldQ=new Quaternion();
 private phase=0;
 constructor(private readonly model:Object3D,private readonly actor:Group,private readonly frame:Group,private readonly floor:(x:number,z:number)=>number){
  actor.updateMatrixWorld(true);const actorQ=actor.getWorldQuaternion(new Quaternion()).invert();
  for(const [front,side,phase]of [[true,'l',.5],[true,'r',.56],[false,'l',0],[false,'r',.06]] as const){
   const names=front?['upperarm','lowerarm','hand','fingers_01']:['upperleg','lowerleg','foot','toes_01'];
   const joints=names.map(name=>model.getObjectByName(name+'_'+side));if(joints.some(j=>!(j instanceof Bone)))throw new Error('Horse gallop requires its actual '+side+' limb chain');
   const bones=joints as Bone[],end=bones[3]!,rest=actor.worldToLocal(end.getWorldPosition(new Vector3()));
   this.legs.push({end,chain:bones.slice(0,3).reverse(),rest,orientation:end.getWorldQuaternion(new Quaternion()).premultiply(actorQ),phase,planted:false,target:new Vector3()});
  }
 }
 restore():void{for(const[bone,q]of this.previous)bone.quaternion.copy(q);this.previous.clear();}
 private remember(bone:Bone){if(!this.previous.has(bone))this.previous.set(bone,bone.quaternion.clone());}
 update(dt:number,speed:number,airborne:boolean,weight:number):void{
  if(weight<.001){for(const leg of this.legs)leg.planted=false;return;}
  const period=.54,reach=3.2,stance=MathUtils.clamp(reach/(Math.max(10,speed)*period),.09,.28);
  this.phase=(this.phase+Math.max(0,dt)/period)%1;
  const lift=Math.max(0,Math.sin((this.phase-.2)*Math.PI*4));
  this.frame.position.y+=weight*(airborne?.05:-.5+.32*lift);this.actor.updateMatrixWorld(true);
  for(const leg of this.legs){
   const p=(this.phase+leg.phase)%1,support=!airborne&&p<stance;
   if(support){
    if(!leg.planted){this.goal.copy(leg.rest);this.goal.z+=-reach/2+p/stance*reach;this.actor.localToWorld(this.goal);this.goal.y=this.floor(this.goal.x,this.goal.z)+leg.rest.y;leg.target.copy(this.goal);}
    leg.planted=true;this.goal.copy(leg.target);
   }else{
    leg.planted=false;const t=airborne?.5:(p-stance)/(1-stance),smooth=t*t*(3-2*t);
    this.goal.copy(leg.rest);this.goal.z+=reach/2-smooth*reach;this.goal.y+=(airborne?1.1:Math.sin(Math.PI*t)*1.4);this.actor.localToWorld(this.goal);
    if(!airborne)this.goal.y=this.floor(this.goal.x,this.goal.z)+leg.rest.y+Math.sin(Math.PI*t)*1.4;
   }
   // Blend the target, not the skeleton after solving: support constraints then
   // remain explicit and the supplied pose returns smoothly at lower speeds.
   if(weight<.999)this.goal.lerp(leg.end.getWorldPosition(this.a),1-weight);
   for(let iteration=0;iteration<12;iteration++){
    if(leg.end.getWorldPosition(this.a).distanceToSquared(this.goal)<1e-8)break;
    for(const bone of leg.chain){
     bone.getWorldPosition(this.pivot);leg.end.getWorldPosition(this.a).sub(this.pivot);this.b.copy(this.goal).sub(this.pivot);
     if(this.a.lengthSq()<1e-12||this.b.lengthSq()<1e-12)continue;
     this.rotation.setFromUnitVectors(this.a.normalize(),this.b.normalize());this.remember(bone);
     bone.getWorldQuaternion(this.worldQ);bone.parent!.getWorldQuaternion(this.parentQ).invert();
     bone.quaternion.copy(this.parentQ).multiply(this.rotation).multiply(this.worldQ);bone.updateWorldMatrix(false,true);
    }
   }
   this.remember(leg.end);this.actor.getWorldQuaternion(this.worldQ).multiply(leg.orientation);leg.end.parent!.getWorldQuaternion(this.parentQ).invert();leg.end.quaternion.copy(this.parentQ).multiply(this.worldQ);leg.end.updateWorldMatrix(false,true);
  }
  this.model.updateWorldMatrix(true,true);
 }
 dispose():void{this.restore();this.legs.length=0;}
}
