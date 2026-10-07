import { Group, MathUtils, Vector3 } from 'three';
import { mvpConfig } from '../config/mvpConfig';
import type { InputSystem } from '../systems/InputSystem';
import { Parts, disposeScene } from '../utils/scene';

/** Provisional physical tuning; walk/sprint speeds are in shared MVP config. */
export const playerMotionTuning = { gravity: 55, jumpSpeed: 22, acceleration: 12, stepHeight: 1.35, maxSubstep: 1 / 60 } as const;

/** Foot-origin character with simple terrain/step support and sliding collision. */
export class PlayerController {
  readonly root = new Group();
  speed = 0;
  private readonly body = new Group();
  private readonly leftArm = new Group();
  private readonly rightArm = new Group();
  private readonly leftLeg = new Group();
  private readonly rightLeg = new Group();
  private readonly velocity = new Vector3();
  private verticalSpeed = 0;
  private grounded = false;
  private phase = 0;
  private disposed = false;

  constructor(private readonly groundHeight: (x: number, z: number) => number, private readonly blocked: (x: number, z: number) => boolean = () => false) {
    this.root.name = 'DragonRider'; this.root.add(this.body);
    const p = new Parts(), skin = 0xe3b98b, cloth = 0x2e5962, leather = 0x79543c, gold = 0xd8b46b;
    p.add(this.body, 'box', cloth, [0, 2.6, 0], [1.3, 1.6, 0.8]);
    p.add(this.body, 'box', leather, [0, 2.02, 0], [1.35, 0.18, 0.85]);
    p.add(this.body, 'box', gold, [0, 2.03, -0.46], [0.25, 0.25, 0.08]);
    p.add(this.body, 'sphere', skin, [0, 3.75, 0], [0.55, 0.6, 0.5]);
    p.add(this.body, 'sphere', 0x433d34, [0, 4.06, 0.04], [0.59, 0.34, 0.55]);
    for (const x of [-0.19, 0.19]) p.add(this.body, 'sphere', 0x223739, [x, 3.79, -0.46], [0.065, 0.08, 0.065]);
    p.add(this.body, 'box', gold, [0, 3.1, -0.44], [0.15, 0.4, 0.05]);
    const cape = p.add(this.body, 'box', 0x37504a, [0, 2.58, 0.55], [1.45, 1.65, 0.14]); cape.rotation.x = -0.14;
    for (const [limb, x] of [[this.leftArm, -0.88], [this.rightArm, 0.88]] as const) {
      limb.position.set(x, 3.05, 0); this.body.add(limb);
      p.add(limb, 'box', cloth, [0, -0.5, 0], [0.46, 1.1, 0.5]);
      p.add(limb, 'sphere', skin, [0, -1.17, 0], [0.25, 0.28, 0.23]);
      p.add(limb, 'box', leather, [0, -0.98, 0], [0.49, 0.24, 0.52]);
    }
    for (const [limb, x] of [[this.leftLeg, -0.36], [this.rightLeg, 0.36]] as const) {
      limb.position.set(x, 1.8, 0); this.body.add(limb);
      p.add(limb, 'box', 0x454e48, [0, -0.73, 0], [0.52, 1.45, 0.6]);
      p.add(limb, 'box', leather, [0, -1.54, -0.14], [0.58, 0.5, 0.9]);
    }
  }

  get position(): Vector3 { return this.root.position; }

  teleport(position: Vector3): void {
    this.root.position.copy(position);
    this.root.position.y = Math.max(position.y, this.groundHeight(position.x, position.z));
    this.velocity.set(0, 0, 0); this.verticalSpeed = 0; this.speed = 0;
    this.grounded = this.root.position.y <= this.groundHeight(position.x, position.z) + 0.05;
  }

  update(dt: number, input: InputSystem, cameraYaw: number): void {
    if (this.disposed || dt <= 0) return;
    const delta = Math.min(dt, 0.1), move = input.movement;
    const desiredSpeed = input.held('ShiftLeft') ? mvpConfig.player.sprintSpeed : mvpConfig.player.walkSpeed;
    const desiredX = (move.x * Math.cos(cameraYaw) + move.y * Math.sin(cameraYaw)) * desiredSpeed;
    const desiredZ = (move.x * Math.sin(cameraYaw) - move.y * Math.cos(cameraYaw)) * desiredSpeed;
    if (input.pressed('Space') && this.grounded) { this.verticalSpeed = playerMotionTuning.jumpSpeed; this.grounded = false; }
    const count = Math.max(1, Math.ceil(delta / playerMotionTuning.maxSubstep)), step = delta / count;
    const startX = this.position.x, startZ = this.position.z;
    for (let i = 0; i < count; i++) {
      const blend = 1 - Math.exp(-playerMotionTuning.acceleration * step);
      this.velocity.x = MathUtils.lerp(this.velocity.x, desiredX, blend); this.velocity.z = MathUtils.lerp(this.velocity.z, desiredZ, blend);
      const x = this.position.x + this.velocity.x * step, z = this.position.z + this.velocity.z * step;
      if (this.canMove(x, z)) { this.position.x = x; this.position.z = z; }
      else {
        // Independent axes allow walking along a facade instead of sticking.
        if (this.canMove(x, this.position.z)) this.position.x = x; else this.velocity.x = 0;
        if (this.canMove(this.position.x, z)) this.position.z = z; else this.velocity.z = 0;
      }
      const floor = this.groundHeight(this.position.x, this.position.z);
      if (this.grounded && floor >= this.position.y - playerMotionTuning.stepHeight && floor <= this.position.y + playerMotionTuning.stepHeight) {
        this.position.y = floor; this.verticalSpeed = 0;
      } else {
        this.grounded = false; this.verticalSpeed -= playerMotionTuning.gravity * step; this.position.y += this.verticalSpeed * step;
        if (this.position.y <= floor && this.verticalSpeed <= 0) { this.position.y = floor; this.verticalSpeed = 0; this.grounded = true; }
      }
    }
    this.speed = Math.hypot(this.position.x - startX, this.position.z - startZ) / delta;
    if (Math.hypot(desiredX, desiredZ) > 0.5) {
      const desiredYaw = Math.atan2(-desiredX, -desiredZ);
      const difference = MathUtils.euclideanModulo(desiredYaw - this.root.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      this.root.rotation.y += difference * (1 - Math.exp(-14 * delta));
    }
    this.updatePose(delta, this.speed);
  }

  updatePose(dt: number, speed: number): void {
    this.phase += dt * (speed > mvpConfig.player.walkSpeed + 2 ? 13 : 9);
    const amount = Math.min(1, speed / mvpConfig.player.walkSpeed), stride = Math.sin(this.phase) * amount * 0.6;
    const airborne = !this.grounded && this.verticalSpeed !== 0;
    this.leftLeg.rotation.x = airborne ? -0.3 : stride; this.rightLeg.rotation.x = airborne ? 0.3 : -stride;
    this.leftArm.rotation.x = airborne ? -0.5 : -stride * 0.8; this.rightArm.rotation.x = airborne ? -0.5 : stride * 0.8;
    this.body.position.y = Math.abs(Math.sin(this.phase * 2)) * amount * 0.065;
  }

  dispose(): void { if (this.disposed) return; this.disposed = true; this.root.removeFromParent(); disposeScene(this.root); }

  private canMove(x: number, z: number): boolean {
    if (this.blocked(x, z)) return false;
    return this.groundHeight(x, z) <= this.position.y + playerMotionTuning.stepHeight;
  }
}
