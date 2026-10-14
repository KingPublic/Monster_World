import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { InputSystem } from './InputSystem';
import { groundHeight } from '../world/Traversal';
import { cameraClearance } from './CameraClearance';

/** Provisional framing values, kept together for desktop/mobile playtesting. */
export const followCameraTuning = {
  mouseSensitivity: 0.004, pitchSensitivity: 0.003, minPitch: -0.06, maxPitch: 0.9,
  footDistance: 16, mountedDistance: 27, footFocusHeight: 3.1, mountedFocusHeight: 4.5,
  footFov: 56, mountedFov: 62, boostFov: 67, tracking: 12,
} as const;

/** Third-person gameplay camera. Yaw zero looks forward along world -Z. */
export class FollowCamera {
  yaw = 0;
  private pitch = 0.3;
  private readonly focus = new Vector3();
  private readonly desiredFocus = new Vector3();
  private readonly desiredPosition = new Vector3();
  private initialized = false;
  private distance: number = followCameraTuning.footDistance;
  private roll = 0;
  private clearance = 1;

  constructor(private readonly camera: PerspectiveCamera, private readonly input: InputSystem) {}

  update(dt: number, target: Vector3, mounted: boolean, boosting: boolean, bank = 0,horse=false): void {
    const delta = Math.max(0, Math.min(dt, 0.1));
    const look = this.input.consumeLook();
    this.yaw += Math.max(-350, Math.min(350, look.x)) * followCameraTuning.mouseSensitivity;
    this.yaw = MathUtils.euclideanModulo(this.yaw + Math.PI, Math.PI * 2) - Math.PI;
    this.pitch = MathUtils.clamp(this.pitch + Math.max(-350, Math.min(350, look.y)) * followCameraTuning.pitchSensitivity, followCameraTuning.minPitch, followCameraTuning.maxPitch);
    const tracking = 1 - Math.exp(-followCameraTuning.tracking * delta);
    this.desiredFocus.copy(target); this.desiredFocus.y += horse?3.7:mounted ? followCameraTuning.mountedFocusHeight : followCameraTuning.footFocusHeight;
    const portrait = Math.sqrt(Math.max(.6, Math.min(1, this.camera.aspect)));
    const targetDistance = (horse?20:mounted ? followCameraTuning.mountedDistance : followCameraTuning.footDistance) / portrait;
    if (!this.initialized) { this.focus.copy(this.desiredFocus); this.distance = targetDistance; }
    else { this.focus.lerp(this.desiredFocus, tracking); this.distance = MathUtils.lerp(this.distance, targetDistance, tracking); }
    const horizontal = Math.cos(this.pitch) * this.distance;
    this.desiredPosition.set(this.focus.x - Math.sin(this.yaw) * horizontal, this.focus.y + Math.sin(this.pitch) * this.distance, this.focus.z + Math.cos(this.yaw) * horizontal);
    this.desiredPosition.y = Math.max(this.desiredPosition.y, groundHeight(this.desiredPosition.x, this.desiredPosition.z) + 2);
    const allowed = cameraClearance(this.focus, this.desiredPosition);
    this.clearance = !this.initialized || allowed < this.clearance ? allowed : MathUtils.lerp(this.clearance, allowed, tracking);
    this.desiredPosition.lerp(this.focus, 1 - this.clearance);
    // Retract once, immediately; recover outward smoothly. Focus already damps
    // movement, so a second position lag/retraction would shrink a fast rider.
    this.camera.position.copy(this.desiredPosition);
    this.camera.up.set(0, 1, 0); this.camera.lookAt(this.focus);
    this.roll = MathUtils.lerp(this.roll, mounted ? MathUtils.clamp(bank, -0.7, 0.7) * 0.08 : 0, tracking);
    this.camera.rotateZ(this.roll);
    const baseFov = boosting ? followCameraTuning.boostFov : mounted ? followCameraTuning.mountedFov : followCameraTuning.footFov;
    const desiredFov = Math.min(90, 2 * Math.atan(Math.tan(baseFov * Math.PI / 360) / Math.min(1, this.camera.aspect)) * 180 / Math.PI);
    const fov = !this.initialized ? desiredFov : MathUtils.lerp(this.camera.fov, desiredFov, 1 - Math.exp(-5 * delta));
    if (Math.abs(this.camera.fov - fov) > 0.005) { this.camera.fov = fov; this.camera.updateProjectionMatrix(); }
    this.initialized = true;
  }

  reset(target: Vector3): void { this.focus.copy(target); this.initialized = false; this.roll = 0; this.clearance = 1; this.input.consumeLook(); }
}
