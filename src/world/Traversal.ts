import { gameConfig } from '../config/gameConfig';
import { terrainHeight } from './Environment';

interface Terrace { x: number; z: number; halfX: number; halfZ: number; height: number; }
interface Stairway { x: number; halfWidth: number; startZ: number; endZ: number; low: number; high: number; }

/** These footprints mirror Sanctuary's foundation and service buildings. */
const terraces: readonly Terrace[] = [
  { x: -14, z: 12, halfX: 44.5, halfZ: 61, height: 8.3 },
  { x: 0, z: -58, halfX: 59.5, halfZ: 27, height: 17.3 },
  { x: -34, z: -22, halfX: 25.5, halfZ: 9, height: 17.3 },
  { x: 34, z: -22, halfX: 25.5, halfZ: 9, height: 17.3 },
  { x: 0, z: -87.5, halfX: 33.5, halfZ: 17.5, height: 28.3 },
  { x: -24, z: -65.5, halfX: 9.5, halfZ: 4.5, height: 28.3 },
  { x: 24, z: -65.5, halfX: 9.5, halfZ: 4.5, height: 28.3 },
  { x: 72, z: 14, halfX: 29.5, halfZ: 42, height: 17.3 },
];
const stairways: readonly Stairway[] = [
  { x: 0, halfWidth: 9, startZ: 87.15, endZ: 69.45, low: 0.6, high: 8.3 },
  { x: 0, halfWidth: 7.5, startZ: -8.85, endZ: -30.95, low: 8.3, high: 17.3 },
  { x: 0, halfWidth: 9, startZ: -46.85, endZ: -71.15, low: 17.3, high: 28.3 },
];
const buildings: readonly [number, number, number, number][] = [
  [0, -84, 27, 21.6], [-41, -47, 24, 19.2], [44, -48, 21, 16.8], [-42, 20, 19, 15.2],
  [-44, 55, 12, 9.6], [-21, 62, 12, 9.6], [18, 59, 12, 9.6], [-51, -12, 12, 9.6],
  [76, -11, 12, 9.6], [87, 43, 12, 9.6], [-73, -50, 12, 9.6], [71, -75, 12, 9.6],
];
const collisionRadius = 0.75;
const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

/** Foot origin / flight landing height, retaining the full Task 00 valley extent. */
export function groundHeight(x: number, z: number): number {
  let height = terrainHeight(x, z);
  if (Math.abs(x) <= 9 && z >= 87 && z <= 161) height = Math.max(height, 0.6);
  for (const terrace of terraces) {
    if (Math.abs(x - terrace.x) <= terrace.halfX && Math.abs(z - terrace.z) <= terrace.halfZ) height = Math.max(height, terrace.height);
  }
  // Stair corridors override the overlapping slabs; otherwise a nine-unit wall
  // would intersect the middle of the visible main staircase.
  for (const stair of stairways) {
    if (Math.abs(x - stair.x) <= stair.halfWidth && z <= stair.startZ && z >= stair.endZ) {
      const progress = clamp01((stair.startZ - z) / (stair.startZ - stair.endZ));
      height = stair.low + (stair.high - stair.low) * progress;
    }
  }
  if (x >= 22.5 && x <= 53.5 && z >= -17 && z <= -7) height = Math.max(height, 18.1);
  if (Math.hypot(x - 54, z - 22) <= 17) height = Math.max(height, 18.35);
  for (const marker of gameConfig.nestMarkers) {
    const dx = x - marker.position[0], dz = z - marker.position[2], distance = Math.hypot(dx, dz);
    if (distance >= 82) continue;
    if (distance <= 29) return marker.position[1] + 5;
    // An accessible apron blends from the existing terrain to the nest plinth;
    // the original marker's abrupt cylinder side cannot trap an on-foot thief.
    const outerX = marker.position[0] + dx / distance * 82;
    const outerZ = marker.position[2] + dz / distance * 82;
    const outerHeight = terrainHeight(outerX, outerZ);
    const progress = clamp01((82 - distance) / 53);
    const blend = progress * progress * (3 - 2 * progress);
    return outerHeight + (marker.position[1] + 5 - outerHeight) * blend;
  }
  return height;
}

/** Fixed solid footprints; services are interacted with outside their doors. */
export function isBlocked(x: number, z: number): boolean {
  for (const [bx, bz, width, depth] of buildings) {
    if (Math.abs(x - bx) < width / 2 + collisionRadius && Math.abs(z - bz) < depth / 2 + collisionRadius) return true;
  }
  if (Math.hypot(x, z - 24) < 9 + collisionRadius) return true;
  // Arrival arch pillars leave the central route open.
  for (const pillarX of [-13, 13]) if (Math.hypot(x - pillarX, z - 70) < 6 + collisionRadius) return true;
  // Bridge rails retain a safe walkable center without blocking either exit.
  if (x > 23 && x < 53 && Math.abs(z + 12) > 3.9 && Math.abs(z + 12) < 5.7) return true;
  return false;
}
