import { MathUtils, Vector3 } from 'three';
import type { DragonVisual } from '../creatures/RideableDragon';
import { createDragonVisual } from '../creatures/DragonVariants';
import type { RuntimeAssets } from '../systems/RuntimeAssets';
import { variantForNest } from '../config/dragonVariants';
import { groundHeight } from '../world/Traversal';
import { mvpConfig } from '../config/mvpConfig';
export type GuardianState = 'IDLE'|'ALERT'|'ROAR'|'CHASE'|'SAFE_ZONE_STOP'|'RETURN';
type NestConfig = (typeof mvpConfig.nests)[number];
export class Guardian {
  readonly model: DragonVisual;
  readonly home = new Vector3();
  state: GuardianState = 'IDLE';
  private elapsed = 0;
  private strikeRecovery=0;
  private readonly strikeOffset=new Vector3();
  constructor(readonly config: NestConfig, assets: RuntimeAssets) {
    this.model = createDragonVisual(assets,variantForNest(config.id),message => console.warn('[Monster World] Guardian visual', message), 'Guardian');
    const [x,,z] = config.position; this.home.set(x - 35, groundHeight(x - 35, z - 55), z - 55);
    this.model.root.position.copy(this.home); this.model.root.rotation.y = -Math.PI * 0.35;
  }
  private setState(state: GuardianState): void { this.state = state; this.elapsed = 0;if(state!=='CHASE')this.strikeRecovery=0; }
  update(dt: number, target: Vector3, active: boolean): boolean {
    this.elapsed += dt;
    this.strikeRecovery=Math.max(0,this.strikeRecovery-dt);
    let contact=false;
    if (active && (this.state === 'IDLE' || this.state === 'RETURN' || this.state === 'SAFE_ZONE_STOP')) this.setState('ALERT');
    if (!active && ['ALERT','ROAR','CHASE'].includes(this.state)) this.setState('SAFE_ZONE_STOP');
    if (this.state === 'ALERT' && this.elapsed > 0.8) this.setState('ROAR');
    if (this.state === 'ROAR' && this.elapsed > this.config.guardianGraceSeconds) this.setState('CHASE');
    if (this.state === 'SAFE_ZONE_STOP' && this.elapsed > 0.7) this.setState('RETURN');
    let bank = 0;
    if (this.state === 'CHASE' || this.state === 'RETURN') {
      const destination = this.state === 'CHASE' ? target.clone().add(new Vector3(0,2,0)) : this.home.clone();
      if(this.state==='CHASE'&&this.strikeRecovery>0)destination.copy(target).add(this.strikeOffset);
      const delta = destination.sub(this.model.root.position), distance = delta.length();
      const speed = this.state === 'CHASE' ? this.config.guardianSpeed : Math.max(75, this.config.guardianSpeed);
      if (distance > 0.1) this.model.root.position.addScaledVector(delta.normalize(), Math.min(speed * dt, distance));
      const floor = groundHeight(this.model.root.position.x, this.model.root.position.z);
      this.model.root.position.y = Math.max(this.model.root.position.y, floor + (this.state === 'CHASE' ? 2 : 0));
      const angle = Math.atan2(-delta.x, -delta.z);
      const turn = MathUtils.euclideanModulo(angle - this.model.root.rotation.y + Math.PI, Math.PI*2)-Math.PI;
      this.model.root.rotation.y += turn * Math.min(1,dt*3); bank = MathUtils.clamp(-turn*0.3,-0.5,0.5);
      if (this.state === 'RETURN' && this.model.root.position.distanceTo(this.home) < 3) { this.model.root.position.copy(this.home); this.setState('IDLE'); }
      if (this.state === 'CHASE' && this.elapsed > 1 && this.strikeRecovery===0 && this.model.root.position.distanceTo(target) < this.config.catchRadius){
        contact=true;this.strikeRecovery=mvpConfig.dragonCare.hitInterval;
        // A fly-by breakaway leaves both rigs visible between strikes. Pursuit
        // remains active; this never clears carried loot or moves the rider.
        this.strikeOffset.copy(this.home).sub(target);this.strikeOffset.y=0;
        if(this.strikeOffset.lengthSq()<.001)this.strikeOffset.set(Math.sin(this.model.root.rotation.y),0,Math.cos(this.model.root.rotation.y));
        this.strikeOffset.normalize();const x=this.strikeOffset.x,z=this.strikeOffset.z;
        this.strikeOffset.set(x*30-z*12,18,z*30+x*12);
      }
    }
    this.model.update(dt, {state:this.state === 'IDLE' ? 'idle' : this.state === 'ALERT' ? 'alert' : this.state === 'ROAR' ? 'roar' : this.state === 'RETURN' ? 'return' : this.state === 'CHASE' ? (this.elapsed < 0.6 ? 'takeoff' : 'flight') : 'land',bank,speed:this.state === 'CHASE' ? 1 : 0});
    return contact;
  }
}
