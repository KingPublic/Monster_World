import { MathUtils, Vector3 } from 'three';
import { ProceduralDragon } from '../creatures/ProceduralDragon';
import { groundHeight } from '../world/Traversal';
import { mvpConfig } from '../config/mvpConfig';
export type GuardianState = 'IDLE'|'ALERT'|'ROAR'|'CHASE'|'SAFE_ZONE_STOP'|'RETURN';
type NestConfig = (typeof mvpConfig.nests)[number];
export class Guardian {
  readonly model = new ProceduralDragon('Guardian');
  readonly home = new Vector3();
  state: GuardianState = 'IDLE';
  private elapsed = 0;
  constructor(readonly config: NestConfig) {
    const [x,,z] = config.position; this.home.set(x - 35, groundHeight(x - 35, z - 55), z - 55);
    this.model.root.position.copy(this.home); this.model.root.rotation.y = -Math.PI * 0.35;
  }
  private setState(state: GuardianState): void { this.state = state; this.elapsed = 0; }
  update(dt: number, target: Vector3, active: boolean): boolean {
    this.elapsed += dt;
    if (active && (this.state === 'IDLE' || this.state === 'RETURN' || this.state === 'SAFE_ZONE_STOP')) this.setState('ALERT');
    if (!active && ['ALERT','ROAR','CHASE'].includes(this.state)) this.setState('SAFE_ZONE_STOP');
    if (this.state === 'ALERT' && this.elapsed > 0.8) this.setState('ROAR');
    if (this.state === 'ROAR' && this.elapsed > this.config.guardianGraceSeconds) this.setState('CHASE');
    if (this.state === 'SAFE_ZONE_STOP' && this.elapsed > 0.7) this.setState('RETURN');
    let bank = 0;
    if (this.state === 'CHASE' || this.state === 'RETURN') {
      const destination = this.state === 'CHASE' ? target.clone().add(new Vector3(0,2,0)) : this.home.clone();
      const delta = destination.sub(this.model.root.position), distance = delta.length();
      const speed = this.state === 'CHASE' ? this.config.guardianSpeed : Math.max(75, this.config.guardianSpeed);
      if (distance > 0.1) this.model.root.position.addScaledVector(delta.normalize(), Math.min(speed * dt, distance));
      const floor = groundHeight(this.model.root.position.x, this.model.root.position.z);
      this.model.root.position.y = Math.max(this.model.root.position.y, floor + (this.state === 'CHASE' ? 2 : 0));
      const angle = Math.atan2(-delta.x, -delta.z);
      const turn = MathUtils.euclideanModulo(angle - this.model.root.rotation.y + Math.PI, Math.PI*2)-Math.PI;
      this.model.root.rotation.y += turn * Math.min(1,dt*3); bank = MathUtils.clamp(-turn*0.3,-0.5,0.5);
      if (this.state === 'RETURN' && this.model.root.position.distanceTo(this.home) < 3) { this.model.root.position.copy(this.home); this.setState('IDLE'); }
      if (this.state === 'CHASE' && this.elapsed > 1 && this.model.root.position.distanceTo(target) < this.config.catchRadius) return true;
    }
    this.model.update(dt, {state:this.state === 'IDLE' ? 'idle' : this.state === 'ALERT' ? 'alert' : this.state === 'ROAR' ? 'roar' : this.state === 'RETURN' ? 'return' : this.state === 'CHASE' ? (this.elapsed < 0.6 ? 'takeoff' : 'flight') : 'land',bank,speed:this.state === 'CHASE' ? 1 : 0});
    return false;
  }
}
