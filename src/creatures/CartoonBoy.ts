import { Box3, Group, MathUtils, Mesh, Vector3 } from 'three';
import type { Material } from 'three';
import type { AssetInstance } from '../systems/RuntimeAssets';
import { RigPose } from './RigPose';
import { reachHand } from './RigIK';
import { RigFootSupport } from './RigFootSupport';
import { CartoonFace } from './CartoonFace';
export interface RiderPose {speed:number;airborne:boolean;vertical:number;carry:boolean;mounted:boolean;interact:boolean;bank?:number;boost?:boolean;mountKind?:'horse'|'dragon';supportHeight?:(worldX:number,worldZ:number)=>number;}
/** Source has zero clips. These are explicitly authored poses of its actual rig. */
export class CartoonBoy {
 readonly root=new Group();private readonly rig:RigPose;private time=0;private phase=0;private land=0;private wasAirborne=false;
 private move=0;private seated=0;private holding=0;private interaction=0;private air=0;private bank=0;private rush=0;
 private readonly point=new Vector3();
 private hipHeight=2.3;
 private support:RigFootSupport|undefined;private disposed=false;
 private readonly materials=new Set<Material>();
 private readonly face:CartoonFace;
 constructor(private readonly asset:AssetInstance){
  this.root.name='CartoonBoy-AuthoredMotion';this.root.add(asset.root);this.rig=new RigPose(asset.root);
  const bounds=new Box3().setFromObject(asset.root),height=bounds.getSize(new Vector3()).y;asset.root.scale.setScalar(5/height);asset.root.position.y=-bounds.min.y*asset.root.scale.x;asset.root.rotation.y=Math.PI;
  asset.root.traverse(node=>{if(node instanceof Mesh){node.castShadow=true;node.receiveShadow=true;node.frustumCulled=false;
   const polish=(source:Material)=>{const local=source.clone();this.materials.add(local);if('roughness'in local)local.roughness=Math.max(Number(local.roughness),.82);if('envMapIntensity'in local)local.envMapIntensity=.35;if('specularIntensity'in local)local.specularIntensity=.3;return local;};node.material=Array.isArray(node.material)?node.material.map(polish):polish(node.material);
  }});
  this.face=new CartoonFace(asset.root);
  this.update(0,{speed:0,airborne:false,vertical:0,carry:false,mounted:false,interact:false});
  const hip=this.rig.get('CC_Base_Hip');if(hip){this.root.updateMatrixWorld(true);this.hipHeight=this.root.worldToLocal(hip.getWorldPosition(this.point)).y-.1;}
  this.support=new RigFootSupport(this.root,name=>this.rig.get(name));
 }
 update(dt:number,pose:RiderPose){
  if(this.disposed)return;dt=MathUtils.clamp(dt,0,.1);
  this.time+=dt;if(this.wasAirborne&&!pose.airborne&&!pose.mounted)this.land=.28;this.wasAirborne=pose.airborne;this.land=Math.max(0,this.land-dt);
  this.move=MathUtils.damp(this.move,Math.min(1,pose.speed/30),9,dt);this.seated=MathUtils.damp(this.seated,pose.mounted?1:0,8,dt);
  this.holding=MathUtils.damp(this.holding,pose.carry?1:0,9,dt);this.interaction=MathUtils.damp(this.interaction,pose.interact?1:0,7,dt);
  this.air=MathUtils.damp(this.air,pose.airborne&&!pose.mounted?1:0,9,dt);this.bank=MathUtils.damp(this.bank,pose.bank??0,6,dt);this.rush=MathUtils.damp(this.rush,pose.boost||pose.speed>32?1:0,6,dt);
  this.phase+=dt*pose.speed/9.5*Math.PI*2;const stride=Math.sin(this.phase)*this.move*.9,seat=this.seated,ground=(1-seat)*(1-this.air),hands=Math.max(seat,this.holding,this.interaction*.8),horse=pose.mountKind==='horse';
  this.rig.reset();this.root.position.y=-this.hipHeight*seat+Math.abs(Math.sin(this.phase*2))*this.move*.065*ground-this.land*.7;
  for(const [side,sign] of [['L',1],['R',-1]] as const){
   const cycle=Math.sin(this.phase+(side==='L'?0:Math.PI)),swing=Math.max(0,-cycle);
   this.rig.rotate(`CC_Base_${side}_Thigh`,stride*sign*ground-(horse?.5:1.2)*seat+(pose.vertical>0?-.55:.12)*this.air,0,sign*seat*(horse?.58:.62));
   this.rig.rotate(`CC_Base_${side}_Calf`,swing*this.move*.95*ground+(horse?.55:1.3)*seat+.62*this.air+this.land*.9*ground);
   this.rig.rotate(`CC_Base_${side}_Foot`,-swing*this.move*.2*ground-.2*seat);
   this.rig.rotate(`CC_Base_${side}_Upperarm`,-stride*sign*.65*(1-hands)-.65*hands-.25*this.air,0,-sign*MathUtils.lerp(.68,1.05,hands));
   this.rig.rotate(`CC_Base_${side}_Forearm`,-.13, -sign*hands*.65);
   this.rig.rotate(`CC_Base_${side}_Hand`,-.05,0,sign*hands*.09);
  }
  this.rig.rotate('CC_Base_Hip',-.04*this.move*ground,Math.sin(this.phase)*this.move*.045*ground,-this.bank*seat*.04);
  this.rig.rotate('CC_Base_Spine02',seat*(.15+this.rush*.17)+this.rush*.12*ground+Math.sin(this.time*1.8)*.012,Math.sin(this.phase)*this.move*-.035*ground,-this.bank*seat*.12);
  this.rig.rotate('CC_Base_Head',-.04*this.rush+Math.sin(this.time*1.1)*.01,Math.sin(this.time*.65)*.014-this.bank*seat*.1);
  this.rig.rotate('CC_Base_JawRoot',-.035);
  if(ground>.98&&!pose.mounted&&!pose.airborne){this.root.position.y-=.12+.35*this.move;this.support?.update(dt,this.move,pose.speed,pose.supportHeight);}else this.support?.reset();
  if(this.root.parent&&hands>.001){
   for(const [side,sign] of [['L',1],['R',-1]] as const){
    const upper=this.rig.get(`CC_Base_${side}_Upperarm`),elbow=this.rig.get(`CC_Base_${side}_Forearm`),hand=this.rig.get(`CC_Base_${side}_Hand`);if(!upper||!elbow||!hand)continue;
    const y=MathUtils.lerp(2.7,pose.carry?.7:.35,seat),z=MathUtils.lerp(-.85,pose.carry?-1.3:-.6,seat);
    const target=this.root.parent.localToWorld(new Vector3(-sign*.52,y,z)),pole=this.root.parent.localToWorld(new Vector3(-sign*1.8,MathUtils.lerp(2.5,.7,seat),.15));
    reachHand(this.root,upper,elbow,hand,target,pole,hands);
   }
  }
  this.face.update(this.time);
 }
 dispose(){if(this.disposed)return;this.disposed=true;this.support?.clear();this.face.clear();for(const material of this.materials)material.dispose();this.materials.clear();this.asset.release();this.root.removeFromParent();this.root.clear();}
}
