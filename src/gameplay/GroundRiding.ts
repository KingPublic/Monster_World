import { MathUtils,Vector3 } from 'three';
import type { Group } from 'three';
import { mvpConfig } from '../config/mvpConfig';
import { SprintStamina } from './SprintStamina';
type RidingInput={movement:{x:number;y:number};held:(key:string)=>boolean;pressed:(key:string)=>boolean;};
/** The measured riding model is about 2.2 wide and 6.2 long. The padded
 * footprint samples at .7-unit intervals also cover the smallest city solids. */
export function horseFootprintBlocked(x:number,z:number,heading:number,blocked:(x:number,z:number)=>boolean):boolean{
 const c=Math.cos(heading),s=Math.sin(heading);
 for(let ix=-2;ix<=2;ix++)for(let iz=-5;iz<=5;iz++){const a=ix*.7,b=iz*.7;if(blocked(x+a*c+b*s,z-a*s+b*c))return true;}return false;
}
export class GroundRiding {
  readonly velocity=new Vector3();speed=0;airborne=false;sprinting=false;bank=0;vertical=0;
  readonly stamina=new SprintStamina(mvpConfig.sprint.horse);
  constructor(private readonly floor:(x:number,z:number)=>number,private readonly blocked:(x:number,z:number,heading:number)=>boolean){}
  update(dt:number,root:Group,input:RidingInput,yaw:number):void{
    if(dt<=0||!Number.isFinite(dt))return;const delta=Math.min(.1,dt),count=Math.ceil(delta*60),step=delta/count,move=input.movement,length=Math.max(1,Math.hypot(move.x,move.y));
    const sprintAllowed=this.stamina.allows(input.held('ShiftLeft'));
    const requested=sprintAllowed?mvpConfig.horse.sprintSpeed:mvpConfig.horse.walkSpeed,dx=(move.x*Math.cos(yaw)+move.y*Math.sin(yaw))/length,dz=(move.x*Math.sin(yaw)-move.y*Math.cos(yaw))/length;
    if(!this.airborne&&input.pressed('Space')){this.vertical=18;this.airborne=true;}
    const before=root.position.clone();
    const canMove=(x:number,z:number)=>!this.blocked(x,z,root.rotation.y)&&this.floor(x,z)<=root.position.y+1.35;
    for(let i=0;i<count;i++){
      this.velocity.x=MathUtils.damp(this.velocity.x,dx*requested,8,step);this.velocity.z=MathUtils.damp(this.velocity.z,dz*requested,8,step);
      const x=MathUtils.clamp(root.position.x+this.velocity.x*step,-5600,5600),z=MathUtils.clamp(root.position.z+this.velocity.z*step,-5600,5600);
      if(canMove(x,z)){root.position.x=x;root.position.z=z;}else{if(canMove(x,root.position.z))root.position.x=x;else this.velocity.x=0;if(canMove(root.position.x,z))root.position.z=z;else this.velocity.z=0;}
      const ground=this.floor(root.position.x,root.position.z);
      if(!this.airborne&&ground>=root.position.y-1.35){root.position.y=ground;this.vertical=0;}else{this.airborne=true;this.vertical-=40*step;root.position.y+=this.vertical*step;if(root.position.y<=ground&&this.vertical<=0){root.position.y=ground;this.airborne=false;this.vertical=0;}}
    }
    this.speed=Math.hypot(root.position.x-before.x,root.position.z-before.z)/delta;this.sprinting=sprintAllowed&&Math.hypot(move.x,move.y)>.1&&this.speed>mvpConfig.horse.walkSpeed+2;
    this.stamina.update(delta,this.sprinting);
    if(this.speed>.1){const angle=Math.atan2(-this.velocity.x,-this.velocity.z),turn=MathUtils.euclideanModulo(angle-root.rotation.y+Math.PI,Math.PI*2)-Math.PI,next=root.rotation.y+turn*(1-Math.exp(-7*delta));if(!this.blocked(root.position.x,root.position.z,next))root.rotation.y=next;this.bank=MathUtils.damp(this.bank,MathUtils.clamp(-turn*.15,-.2,.2),6,delta);}else this.bank=MathUtils.damp(this.bank,0,6,delta);
  }
  reset():void{this.velocity.set(0,0,0);this.speed=0;this.vertical=0;this.airborne=false;this.sprinting=false;this.bank=0;}
}
