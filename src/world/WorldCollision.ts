import { InstancedMesh, Matrix4, Mesh, Vector3 } from 'three';

export interface CollisionPoint { x: number; y: number; z: number; }
/** Query heights are absolute world coordinates. */
export interface CollisionQuery { radius?: number; minY: number; maxY: number; }
/** Movement heights are offsets from the moving root; segments bounds slide contacts. */
export interface CollisionBody { radius?: number; minY?: number; maxY?: number; segments?: number; }
export interface CollisionResult extends CollisionPoint { blocked: boolean; normal: CollisionPoint; }
export interface CollisionBox { x: number; z: number; halfX: number; halfZ: number; minY: number; maxY: number; }
interface Plane extends CollisionPoint { d: number; }
interface Solid { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number; planes: Plane[]; cells: string[]; }
interface Hit { t: number; normal: CollisionPoint; depth: number; }
const cellSize = 128, epsilon = 1e-5;
const dot = (a: CollisionPoint, b: CollisionPoint): number => a.x * b.x + a.y * b.y + a.z * b.z;
const tetraFaces = [0, 2, 1, 0, 1, 3, 0, 3, 2, 1, 2, 3];

function solidFromVertices(vertices: Vector3[], faces: number[]): Solid | undefined {
  if (vertices.length < 4) return undefined;
  const solid: Solid = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity, planes: [], cells: [] };
  const center = new Vector3(), seen = new Set<string>();
  for (const p of vertices) {
    center.add(p); solid.minX = Math.min(solid.minX, p.x); solid.maxX = Math.max(solid.maxX, p.x);
    solid.minY = Math.min(solid.minY, p.y); solid.maxY = Math.max(solid.maxY, p.y);
    solid.minZ = Math.min(solid.minZ, p.z); solid.maxZ = Math.max(solid.maxZ, p.z);
  }
  center.divideScalar(vertices.length);
  const normal = new Vector3(), edge = new Vector3();
  for (let i = 0; i < faces.length; i += 3) {
    const a = vertices[faces[i]!]!, b = vertices[faces[i + 1]!]!, c = vertices[faces[i + 2]!]!;
    normal.subVectors(b, a).cross(edge.subVectors(c, a));
    if (normal.lengthSq() < 1e-14) continue;
    normal.normalize(); if (normal.dot(edge.subVectors(center, a)) > 0) normal.negate();
    // Supporting planes contain every transformed vertex, including chipped props.
    let d = -Infinity; for (const p of vertices) d = Math.max(d, normal.dot(p));
    const key = [normal.x, normal.y, normal.z, d].map(v => Math.round(v * 1e5)).join(',');
    if (!seen.has(key)) { seen.add(key); solid.planes.push({ x: normal.x, y: normal.y, z: normal.z, d }); }
  }
  return solid.planes.length >= 4 ? solid : undefined;
}

function boxSolid(box: CollisionBox): Solid {
  return { minX: box.x - box.halfX, maxX: box.x + box.halfX, minY: box.minY, maxY: box.maxY, minZ: box.z - box.halfZ, maxZ: box.z + box.halfZ, cells: [], planes: [
    { x: 1, y: 0, z: 0, d: box.x + box.halfX }, { x: -1, y: 0, z: 0, d: -box.x + box.halfX },
    { x: 0, y: 1, z: 0, d: box.maxY }, { x: 0, y: -1, z: 0, d: -box.minY },
    { x: 0, y: 0, z: 1, d: box.z + box.halfZ }, { x: 0, y: 0, z: -1, d: -box.z + box.halfZ },
  ] };
}
function expandedDistance(plane: Plane, p: CollisionPoint, body: Required<CollisionBody>): number {
  return dot(plane, p) - plane.d - body.radius * Math.hypot(plane.x, plane.z) + Math.min(plane.y * body.minY, plane.y * body.maxY);
}
function bodyOptions(options: CollisionBody): Required<CollisionBody> {
  const minY = options.minY ?? .05, maxY = options.maxY ?? 3;
  return { radius: Math.max(0, options.radius ?? .75), minY: Math.min(minY, maxY), maxY: Math.max(minY, maxY), segments: Math.max(1, Math.min(12, Math.floor(options.segments ?? 4))) };
}
function intersects(solid: Solid, from: CollisionPoint, delta: CollisionPoint, body: Required<CollisionBody>): Hit | undefined {
  let enter = 0, exit = 1, inside = true, depth = Infinity;
  let normal: CollisionPoint = { x: 0, y: 0, z: 0 }, escape = normal;
  for (const plane of solid.planes) {
    const distance = expandedDistance(plane, from, body), speed = dot(plane, delta);
    if (distance > epsilon) inside = false;
    if (-distance < depth) { depth = -distance; escape = plane; }
    if (Math.abs(speed) < epsilon) { if (distance >= -epsilon) return undefined; continue; }
    const t = -distance / speed;
    if (speed < 0) { if (t > enter) { enter = t; normal = plane; } }
    else exit = Math.min(exit, t);
    if (enter > exit || exit < 0 || enter > 1) return undefined;
  }
  if (inside) {
    // Permit a body already touching/overlapping scenery to move out of it.
    if (dot(escape, delta) >= -epsilon) return undefined;
    return { t: 0, normal: escape, depth: Math.max(0, depth) };
  }
  return enter >= 0 && enter <= 1 ? { t: enter, normal, depth: 0 } : undefined;
}

/** Static placed geometry uses a bounded X/Z hash and convex narrow-phase solids. */
export class WorldCollision {
  private readonly solids = new Map<number, Solid>();
  private readonly cells = new Map<string, Set<number>>();
  private readonly registrations = new Set<() => void>();
  private nextId = 0;
  get size(): number { return this.solids.size; }
  get cellCount(): number { return this.cells.size; }

  /** Register a convex mesh or every instance using its actual world transform. */
  registerMesh(mesh: Mesh): void {
    mesh.updateWorldMatrix(true, false);
    const positions = mesh.geometry.attributes.position!, index = mesh.geometry.index;
    const faces = index ? Array.from(index.array) : Array.from({ length: positions.count }, (_, i) => i);
    const ids: number[] = [], local = new Matrix4(), matrix = new Matrix4();
    const count = mesh instanceof InstancedMesh ? mesh.count : 1;
    for (let instance = 0; instance < count; instance++) {
      if (mesh instanceof InstancedMesh) { mesh.getMatrixAt(instance, local); matrix.multiplyMatrices(mesh.matrixWorld, local); }
      else matrix.copy(mesh.matrixWorld);
      const vertices = Array.from({ length: positions.count }, (_, i) => new Vector3().fromBufferAttribute(positions, i).applyMatrix4(matrix));
      const solid = solidFromVertices(vertices, faces); if (solid) ids.push(this.add(solid));
    }
    this.ownRegistration(mesh, ids);
  }

  /** Authored ridge rings form small tetrahedra, preserving the tapered silhouette. */
  registerRidge(mesh: Mesh, rings: number, sides: number): void {
    mesh.updateWorldMatrix(true, false);
    const positions = mesh.geometry.attributes.position!, ids: number[] = [];
    const rows = Array.from({ length: rings }, (_, r) => Array.from({ length: sides }, (_, s) =>
      new Vector3().fromBufferAttribute(positions, r * (sides + 1) + s).applyMatrix4(mesh.matrixWorld)));
    const centers = rows.map(row => row.reduce((sum, p) => sum.add(p), new Vector3()).divideScalar(sides));
    for (let r = 0; r < rings - 1; r++) for (let s = 0; s < sides; s++) {
      const next = (s + 1) % sides;
      const prism = [centers[r]!, rows[r]![s]!, rows[r]![next]!, centers[r + 1]!, rows[r + 1]![s]!, rows[r + 1]![next]!];
      // Same outer diagonal as the rendered ring triangles; no whole-ridge box.
      for (const indices of [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5]]) {
        const solid = solidFromVertices(indices.map(i => prism[i]!), tetraFaces); if (solid) ids.push(this.add(solid));
      }
    }
    this.ownRegistration(mesh, ids);
  }

  /** Each short tube section owns a convex proxy; the entrance gap stays empty. */
  registerTube(mesh: Mesh, segments: number, radialSegments: number): void {
    mesh.updateWorldMatrix(true, false);
    const positions = mesh.geometry.attributes.position!, ids: number[] = [], faces: number[] = [];
    for (let s = 0; s < radialSegments; s++) {
      const next = (s + 1) % radialSegments;
      faces.push(s, next, s + radialSegments, next, next + radialSegments, s + radialSegments);
      if (s > 0 && s < radialSegments - 1) faces.push(0, s + 1, s, radialSegments, s + radialSegments, s + 1 + radialSegments);
    }
    for (let r = 0; r < segments; r++) {
      const vertices: Vector3[] = [];
      for (const row of [r, r + 1]) for (let s = 0; s < radialSegments; s++)
        vertices.push(new Vector3().fromBufferAttribute(positions, row * (radialSegments + 1) + s).applyMatrix4(mesh.matrixWorld));
      const solid = solidFromVertices(vertices, faces); if (solid) ids.push(this.add(solid));
    }
    this.ownRegistration(mesh, ids);
  }

  private ownRegistration(mesh: Mesh, ids: number[]): void {
    const release = () => {
      for (const id of ids) this.remove(id);
      mesh.geometry.removeEventListener('dispose', release); this.registrations.delete(release);
    };
    this.registrations.add(release); mesh.geometry.addEventListener('dispose', release);
  }
  private add(solid: Solid): number {
    const id = this.nextId++; this.solids.set(id, solid);
    for (let x = Math.floor(solid.minX / cellSize); x <= Math.floor(solid.maxX / cellSize); x++)
      for (let z = Math.floor(solid.minZ / cellSize); z <= Math.floor(solid.maxZ / cellSize); z++) {
        const key = x + ':' + z; let bucket = this.cells.get(key);
        if (!bucket) { bucket = new Set(); this.cells.set(key, bucket); }
        bucket.add(id); solid.cells.push(key);
      }
    return id;
  }
  private remove(id: number): void {
    const solid = this.solids.get(id); if (!solid) return;
    for (const key of solid.cells) { const bucket = this.cells.get(key)!; bucket.delete(id); if (!bucket.size) this.cells.delete(key); }
    this.solids.delete(id);
  }
  private candidates(from: CollisionPoint, to: CollisionPoint, body: Required<CollisionBody>, boxes: readonly CollisionBox[]): Solid[] {
    const minX = Math.min(from.x, to.x) - body.radius, maxX = Math.max(from.x, to.x) + body.radius;
    const minZ = Math.min(from.z, to.z) - body.radius, maxZ = Math.max(from.z, to.z) + body.radius;
    const minY = Math.min(from.y, to.y) + body.minY, maxY = Math.max(from.y, to.y) + body.maxY;
    const ids = new Set<number>(), results: Solid[] = [];
    const overlaps = (s: Solid | CollisionBox): boolean => 'planes' in s
      ? s.maxX >= minX && s.minX <= maxX && s.maxZ >= minZ && s.minZ <= maxZ && s.maxY >= minY && s.minY <= maxY
      : s.x + s.halfX >= minX && s.x - s.halfX <= maxX && s.z + s.halfZ >= minZ && s.z - s.halfZ <= maxZ && s.maxY >= minY && s.minY <= maxY;
    for (let x = Math.floor(minX / cellSize); x <= Math.floor(maxX / cellSize); x++)
      for (let z = Math.floor(minZ / cellSize); z <= Math.floor(maxZ / cellSize); z++)
        for (const id of this.cells.get(x + ':' + z) ?? []) ids.add(id);
    for (const id of ids) { const solid = this.solids.get(id)!; if (overlaps(solid)) results.push(solid); }
    // City boxes update after asynchronous GLB loading; query the live bounds.
    for (const box of boxes) if (overlaps(box)) results.push(boxSolid(box));
    return results;
  }
  isBlocked(x: number, z: number, query: CollisionQuery, boxes: readonly CollisionBox[] = []): boolean {
    const body = bodyOptions({ radius: query.radius, minY: 0, maxY: query.maxY - query.minY });
    const point = { x, y: query.minY, z };
    return this.candidates(point, point, body, boxes).some(s => s.planes.every(p => expandedDistance(p, point, body) < -epsilon));
  }
  resolveMovement(from: CollisionPoint, to: CollisionPoint, options: CollisionBody = {}, boxes: readonly CollisionBox[] = []): CollisionResult {
    const body = bodyOptions(options), position = { ...from }, delta = { x: to.x - from.x, y: to.y - from.y, z: to.z - from.z };
    const result: CollisionResult = { ...from, blocked: false, normal: { x: 0, y: 0, z: 0 } };
    for (let iteration = 0; iteration < body.segments; iteration++) {
      const end = { x: position.x + delta.x, y: position.y + delta.y, z: position.z + delta.z };
      let earliest: Hit | undefined;
      for (const solid of this.candidates(position, end, body, boxes)) {
        const hit = intersects(solid, position, delta, body); if (hit && (!earliest || hit.t < earliest.t)) earliest = hit;
      }
      if (!earliest) { Object.assign(position, end); break; }
      result.blocked = true; result.normal = { x: earliest.normal.x, y: earliest.normal.y, z: earliest.normal.z };
      const length = Math.hypot(delta.x, delta.y, delta.z), t = Math.max(0, earliest.t - epsilon / Math.max(length, epsilon));
      position.x += delta.x * t; position.y += delta.y * t; position.z += delta.z * t;
      const push = earliest.depth + epsilon * 2;
      position.x += earliest.normal.x * push; position.y += earliest.normal.y * push; position.z += earliest.normal.z * push;
      delta.x *= 1 - t; delta.y *= 1 - t; delta.z *= 1 - t;
      const into = Math.min(0, dot(delta, earliest.normal));
      delta.x -= into * earliest.normal.x; delta.y -= into * earliest.normal.y; delta.z -= into * earliest.normal.z;
      if (Math.hypot(delta.x, delta.y, delta.z) < epsilon) break;
    }
    return Object.assign(result, position);
  }
  clear(): void { for (const release of [...this.registrations]) release(); this.solids.clear(); this.cells.clear(); this.nextId = 0; }
}

/** Default registry for standalone landscape construction; World owns its own. */
export const worldCollision = new WorldCollision();
