import type { Vector3 } from 'three';
import { citySolids } from '../world/SanctuaryLayout';
/** Nearest obstruction along the focus-to-camera segment, including lens clearance. */
export function cameraClearance(focus: Vector3, desired: Vector3): number {
  let fraction = 1;
  const distance = focus.distanceTo(desired);
  if (distance < .001) return fraction;
  for (const solid of citySolids) {
    // A legal player position can lie within lens padding. A ray travelling
    // out of that volume must not interpret its negative entry as a wall hit.
    if ((focus.x < solid.x-solid.halfX && desired.x <= focus.x) ||
        (focus.x > solid.x+solid.halfX && desired.x >= focus.x) ||
        (focus.z < solid.z-solid.halfZ && desired.z <= focus.z) ||
        (focus.z > solid.z+solid.halfZ && desired.z >= focus.z) ||
        (focus.y > solid.maxY && desired.y >= focus.y)) continue;
    let entry = 0, exit = 1;
    const bounds = {
      x: [solid.x - solid.halfX - .85, solid.x + solid.halfX + .85],
      y: [solid.minY - .2, solid.maxY + .5],
      z: [solid.z - solid.halfZ - .85, solid.z + solid.halfZ + .85],
    };
    for (const axis of ['x', 'y', 'z'] as const) {
      const delta = desired[axis] - focus[axis], min = bounds[axis][0]!, max = bounds[axis][1]!;
      if (Math.abs(delta) < .00001) { if (focus[axis] < min || focus[axis] > max) { entry = 2; break; } }
      else { const a = (min - focus[axis]) / delta, b = (max - focus[axis]) / delta; entry = Math.max(entry, Math.min(a, b)); exit = Math.min(exit, Math.max(a, b)); }
      if (entry > exit) break;
    }
    if (entry <= exit && exit >= 0 && entry <= 1) fraction = Math.min(fraction, Math.max(.015, entry - 1.2 / distance));
  }
  return fraction;
}
