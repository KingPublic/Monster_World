import { Group, MathUtils, Vector3 } from 'three';
import type { InputSystem } from '../systems/InputSystem';
import { mvpConfig, upgradeMultiplier } from '../config/mvpConfig';
import type { SaveData } from './Progression';
import { groundHeight, isBlocked } from '../world/Traversal';
export class Flight {
  readonly velocity = new Vector3();
  stamina = mvpConfig.flight.stamina as number;
  airborne = false; boosting = false; bank = 0; vertical = 0;
  private exhausted = false;
  private regenDelay = 0;
  update(dt: number, root: Group, input: Pick<InputSystem,'movement'|'held'>, yaw: number, state: SaveData): void {
    const cfg = mvpConfig.flight, max = cfg.stamina * upgradeMultiplier(state.upgrades.stamina);
    const move = input.movement, held = input.held('ShiftLeft');
    if (!held) this.exhausted = false;
    this.boosting = held && !this.exhausted && this.stamina > 1 && this.airborne && Math.hypot(move.x, move.y) > 0.1;
    if (this.boosting) { this.stamina = Math.max(0, this.stamina - cfg.boostDrain * dt); this.regenDelay = 0.8; if (this.stamina <= 1) this.exhausted = true; }
    else { this.regenDelay -= dt; if (this.regenDelay <= 0) this.stamina = Math.min(max, this.stamina + cfg.staminaRegen * dt); }
    const speed = this.boosting ? cfg.boostSpeed * upgradeMultiplier(state.upgrades.boost) : cfg.speed * upgradeMultiplier(state.upgrades.speed);
    const length = Math.max(1, Math.hypot(move.x, move.y));
    const dx = (move.x * Math.cos(yaw) + move.y * Math.sin(yaw)) / length;
    const dz = (move.x * Math.sin(yaw) - move.y * Math.cos(yaw)) / length;
    const targetSpeed = this.airborne ? speed : 22;
    this.velocity.x = MathUtils.damp(this.velocity.x, dx * targetSpeed, 3.5, dt);
    this.velocity.z = MathUtils.damp(this.velocity.z, dz * targetSpeed, 3.5, dt);
    const up = input.held('Space') ? 1 : input.held('ControlLeft') ? -1 : 0;
    if (up > 0) this.airborne = true;
    this.vertical = MathUtils.damp(this.vertical, this.airborne ? up * cfg.verticalSpeed : 0, 4, dt);
    const nextX = MathUtils.clamp(root.position.x + this.velocity.x * dt, -5600, 5600);
    const nextZ = MathUtils.clamp(root.position.z + this.velocity.z * dt, -5600, 5600);
    if (!isBlocked(nextX, nextZ) || root.position.y > groundHeight(nextX, nextZ) + 45) { root.position.x = nextX; root.position.z = nextZ; }
    root.position.y = Math.min(1800, root.position.y + this.vertical * dt);
    const floor = groundHeight(root.position.x, root.position.z);
    if (!this.airborne || (this.vertical <= 0 && root.position.y <= floor + 0.15)) { root.position.y = floor; this.airborne = false; this.vertical = 0; }
    // Terrain rises may intersect the flight path: gently clear it instead of tunnelling.
    if (root.position.y < floor) root.position.y = floor;
    if (this.velocity.lengthSq() > 2) {
      const targetAngle = Math.atan2(-this.velocity.x, -this.velocity.z);
      const turn = MathUtils.euclideanModulo(targetAngle - root.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      root.rotation.y += turn * Math.min(1, dt * 5);
      this.bank = MathUtils.damp(this.bank, MathUtils.clamp(-turn * 0.45, -0.5, 0.5), 5, dt);
    } else this.bank = MathUtils.damp(this.bank, 0, 5, dt);
  }
  reset(): void { this.velocity.set(0,0,0); this.airborne = false; this.boosting = false; this.vertical = 0; this.bank = 0; }
}
