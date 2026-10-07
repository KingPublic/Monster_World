import {
  BufferGeometry, CylinderGeometry, DoubleSide, Float32BufferAttribute, Group,
  Mesh, MeshStandardMaterial, Quaternion, SphereGeometry, TorusGeometry, Vector3,
} from 'three';
import type { Material } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export type DragonForm = 'Baby' | 'Young' | 'Guardian';
export interface DragonPose {
  state?: 'idle' | 'walk' | 'eat' | 'alert' | 'roar' | 'takeoff' | 'flight' | 'glide' | 'boost' | 'land' | 'return';
  /** Ground speed in world units/second, or a normalized gait amount. */
  speed?: number;
  /** Signed turn amount, clamped to -1..1. */
  bank?: number;
  /** Signed ascent/descent amount, clamped to -1..1. */
  vertical?: number;
}

type Point = readonly [number, number, number];
interface Proportions {
  scale: number; width: number; length: number; leg: number;
  head: number; wing: number; horn: number; tail: number;
}
interface LegRig { hip: Group; knee: Group; foot: Group; rear: boolean; phase: number }
interface WingRig { joint: Group; side: number }
const FORMS: Record<DragonForm, Proportions> = {
  Baby: { scale: 0.48, width: 0.95, length: 0.83, leg: 0.83, head: 1.32, wing: 0.57, horn: 0.48, tail: 0.75 },
  Young: { scale: 1, width: 1, length: 1, leg: 1, head: 1, wing: 1, horn: 1, tail: 1 },
  Guardian: { scale: 3, width: 1.27, length: 1.15, leg: 1.12, head: 1.12, wing: 1.15, horn: 1.8, tail: 1.14 },
};
const UP = new Vector3(0, 1, 0);
const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));
const ease = (from: number, to: number, rate: number): number => from + (to - from) * rate;

/** A closed faceted leaf, shared by the foliage of one dragon. Its tip points along +Y. */
function leafGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([
    0, 1, 0, 0.43, 0.27, 0, 0.26, -0.2, 0, 0, -0.48, 0,
    -0.26, -0.2, 0, -0.43, 0.27, 0, 0, 0.22, 0.14, 0, 0.22, -0.07,
  ], 3));
  geometry.setIndex([
    6, 1, 0, 6, 2, 1, 6, 3, 2, 6, 4, 3, 6, 5, 4, 6, 0, 5,
    7, 0, 1, 7, 1, 2, 7, 2, 3, 7, 3, 4, 7, 4, 5, 7, 5, 0,
  ]);
  geometry.computeVertexNormals();
  return geometry;
}

/** Foot-level world root, facing -Z. All breathing and pose transforms live below root. */
export class ProceduralDragon {
  readonly root = new Group();
  readonly mountAnchor = new Group();
  private readonly rig = new Group();
  private readonly head = new Group();
  private readonly jaw = new Group();
  private readonly legs: LegRig[] = [];
  private readonly wings: WingRig[] = [];
  private readonly tail: Group[] = [];
  private readonly eyes: Group[] = [];
  private readonly geometries = new Set<BufferGeometry>();
  private readonly materials = new Set<Material>();
  private readonly sphere: SphereGeometry;
  private readonly cylinder: CylinderGeometry;
  private readonly taperedCylinders = new Map<number, CylinderGeometry>();
  private readonly leaf: BufferGeometry;
  private readonly skin: MeshStandardMaterial;
  private readonly dark: MeshStandardMaterial;
  private readonly foliage: MeshStandardMaterial;
  private readonly lime: MeshStandardMaterial;
  private readonly cream: MeshStandardMaterial;
  private readonly gold: MeshStandardMaterial;
  private readonly chest: Mesh;
  private readonly p: Proportions;
  private time = 0;
  private airborne = 0;
  private gait = 0;
  private gaitTime = 0;
  private bank = 0;
  private vertical = 0;
  private mouth = 0;
  private disposed = false;

  constructor(readonly form: DragonForm) {
    this.p = FORMS[form];
    this.root.name = 'Nature-' + form + '-Dragon';
    this.root.userData.form = form;
    this.root.userData.element = 'Nature';
    this.root.userData.rideable = form === 'Young';
    this.rig.name = 'animated-dragon-rig';
    this.rig.scale.setScalar(this.p.scale);
    this.root.add(this.rig);
    this.sphere = this.trackGeometry(new SphereGeometry(1, 14, 10));
    this.cylinder = this.trackGeometry(new CylinderGeometry(1, 1, 1, 8, 1));
    this.leaf = this.trackGeometry(leafGeometry());
    this.skin = this.material(form === 'Guardian' ? 0x397247 : 0x65a748);
    this.dark = this.material(0x24553b);
    this.foliage = this.material(0x408744, { flatShading: true });
    this.lime = this.material(0xa6cc5b, { flatShading: true });
    this.cream = this.material(0xf5e5b4);
    this.gold = this.material(0xd8b86b, { metalness: 0.2, roughness: 0.38 });
    const bodyY = 2.03 * this.p.leg;
    this.ball(this.rig, this.skin, [0, bodyY, 0.45], [1.25 * this.p.width, 1.08, 2.16 * this.p.length]);
    this.chest = this.ball(this.rig, this.skin, [0, bodyY + 0.38, -1.04 * this.p.length], [1.04 * this.p.width, 1.12, 1.08]);
    this.ball(this.rig, this.cream, [0, bodyY - 0.25, -0.07], [0.94 * this.p.width, 0.83, 1.7 * this.p.length]);
    // Overlapping neck volumes give a continuous shoulder-to-face silhouette.
    this.ball(this.rig, this.skin, [0, bodyY + 0.99, -1.74 * this.p.length], [0.72 * this.p.width, 1.12, 0.74]);
    this.ball(this.rig, this.cream, [0, bodyY + 0.94, -2.19 * this.p.length], [0.6 * this.p.width, 0.9, 0.3]);
    for (let i = 0; i < 5; i++) {
      this.ball(this.rig, i % 2 === 0 ? this.cream : this.gold,
        [0, bodyY + 0.15 + i * 0.32, -2.17 * this.p.length - i * 0.025],
        [0.59 * this.p.width - i * 0.018, 0.17, 0.25]);
    }
    this.buildHead(bodyY);
    this.buildLegs();
    this.buildTail(bodyY);
    this.buildWings(bodyY);
    this.buildFoliage(bodyY);
    if (form === 'Young') this.buildSaddle(bodyY);
    this.mountAnchor.name = 'mount-anchor';
    this.mountAnchor.position.set(0, bodyY + 1.52, 0.28);
    this.mountAnchor.userData.rideable = form === 'Young';
    this.rig.add(this.mountAnchor);
    this.mergeStaticParts();
    this.update(0, { state: 'idle' });
  }

  private trackGeometry<T extends BufferGeometry>(geometry: T): T {
    this.geometries.add(geometry); return geometry;
  }
  private material(color: number, options: Partial<ConstructorParameters<typeof MeshStandardMaterial>[0]> = {}): MeshStandardMaterial {
    const material = new MeshStandardMaterial({ color, roughness: 0.76, ...options });
    this.materials.add(material); return material;
  }
  private mesh(parent: Group, geometry: BufferGeometry, material: MeshStandardMaterial, position: Point, scale: Point): Mesh {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position); mesh.scale.set(...scale);
    mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  }
  private ball(parent: Group, material: MeshStandardMaterial, position: Point, scale: Point): Mesh {
    return this.mesh(parent, this.sphere, material, position, scale);
  }
  private frond(parent: Group, material: MeshStandardMaterial, position: Point, scale: Point, rotation: Point = [0, 0, 0]): Mesh {
    const leaf = this.mesh(parent, this.leaf, material, position, scale);
    leaf.rotation.set(...rotation); return leaf;
  }
  private rod(parent: Group, material: MeshStandardMaterial, start: Point, end: Point, radius: number, endRadius = radius): Mesh {
    const a = new Vector3(...start); const b = new Vector3(...end);
    const direction = b.clone().sub(a);
    // Taper is a geometry shared by equal ratios inside this instance.
    const ratio = endRadius / radius;
    let geometry = this.cylinder;
    if (ratio !== 1) {
      let tapered = this.taperedCylinders.get(ratio);
      if (!tapered) {
        tapered = this.trackGeometry(new CylinderGeometry(ratio, 1, 1, 8, 1));
        this.taperedCylinders.set(ratio, tapered);
      }
      geometry = tapered;
    }
    const mesh = this.mesh(parent, geometry, material, [0, 0, 0], [radius, direction.length(), radius]);
    mesh.position.copy(a.add(b).multiplyScalar(0.5));
    mesh.quaternion.copy(new Quaternion().setFromUnitVectors(UP, direction.normalize()));
    return mesh;
  }

  /** Combine fixed decorations by material while preserving every animated joint. */
  private mergeStaticParts(): void {
    const groups: Group[] = [];
    this.rig.traverse(object => { if (object instanceof Group) groups.push(object); });
    for (const group of groups) {
      const batches = new Map<MeshStandardMaterial, Mesh[]>();
      for (const child of group.children) {
        if (!(child instanceof Mesh) || child === this.chest || !(child.material instanceof MeshStandardMaterial)) continue;
        const batch = batches.get(child.material) ?? [];
        batch.push(child); batches.set(child.material, batch);
      }
      for (const [material, meshes] of batches) {
        if (meshes.length < 2) continue;
        const transformed = meshes.map(mesh => {
          mesh.updateMatrix();
          const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrix);
          // No texture maps are used; matching position/normal attributes allow mixed leaf and body geometry.
          geometry.deleteAttribute('uv');
          return geometry;
        });
        const merged = mergeGeometries(transformed);
        for (const geometry of transformed) geometry.dispose();
        if (!merged) continue;
        this.trackGeometry(merged);
        for (const mesh of meshes) group.remove(mesh);
        this.mesh(group, merged, material, [0, 0, 0], [1, 1, 1]);
      }
    }
  }

  private buildHead(bodyY: number): void {
    this.head.name = 'head';
    this.head.position.set(0, bodyY + 1.65, -2.42 * this.p.length);
    this.head.scale.setScalar(this.p.head);
    this.rig.add(this.head);
    this.ball(this.head, this.skin, [0, 0.23, -0.12], [1.01, 0.91, 1.02]);
    this.ball(this.head, this.skin, [0, -0.07, -1.0], [0.85, 0.45, this.form === 'Guardian' ? 0.91 : 0.76]);
    this.ball(this.head, this.lime, [0, 0.11, -1.33], [0.66, 0.23, 0.41]);
    this.jaw.name = 'jaw'; this.jaw.position.set(0, -0.39, -0.35); this.head.add(this.jaw);
    this.ball(this.jaw, this.cream, [0, -0.05, -0.7], [0.77, 0.2, 0.69]);
    const mouth = this.material(0x4c2830);
    this.ball(this.jaw, mouth, [0, 0.085, -0.76], [0.58, 0.035, 0.53]);
    const black = this.material(0x101e18, { roughness: 0.23 });
    const iris = this.material(this.form === 'Guardian' ? 0xe3bf51 : 0x83c936, { roughness: 0.25 });
    const highlight = this.material(0xfffce9, { roughness: 0.12 });
    for (const side of [-1, 1]) {
      const eye = new Group(); eye.name = side < 0 ? 'left-eye' : 'right-eye';
      eye.position.set(side * 0.78, 0.39, -0.76); eye.rotation.y = -side * 0.48;
      const eyeSize = this.form === 'Guardian' ? 0.77 : 1;
      eye.scale.setScalar(eyeSize); this.head.add(eye); this.eyes.push(eye);
      this.ball(eye, this.dark, [0, 0, 0], [0.43, 0.5, 0.2]);
      this.ball(eye, this.cream, [0, 0, -0.075], [0.34, 0.415, 0.18]);
      this.ball(eye, iris, [0, -0.014, -0.19], [0.235, 0.31, 0.12]);
      this.ball(eye, black, [0, -0.01, -0.282], [this.form === 'Guardian' ? 0.06 : 0.11, 0.235, 0.053]);
      this.ball(eye, highlight, [-0.07, 0.125, -0.335], [0.065, 0.075, 0.032]);
      this.ball(eye, highlight, [0.085, -0.075, -0.318], [0.028, 0.032, 0.015]);
      this.ball(this.head, this.dark, [side * 0.4, 0.14, -1.63], [0.095, 0.052, 0.025]);
      this.frond(this.head, this.foliage, [side * 0.92, 0.72, -0.36], [0.5, 0.73, 0.75], [0.1, side * 0.1, -side * 0.8]);
      for (let i = 0; i < 3; i++) {
        this.frond(this.head, i === 0 ? this.lime : this.foliage,
          [side * (0.91 + i * 0.04), 0.1 - i * 0.18, 0.1 + i * 0.15],
          [0.52, 0.7 - i * 0.06, 0.8], [0.35, side * 0.35, -side * 1.08]);
      }
      const horn = this.p.horn;
      this.rod(this.head, this.gold, [side * 0.66, 0.86, 0.13], [side * 0.87, 0.86 + horn * 0.57, 0.27], 0.265, 0.19);
      this.rod(this.head, this.cream, [side * 0.87, 0.86 + horn * 0.57, 0.27], [side * 1.04, 0.86 + horn * 1.07, 0.64], 0.19, 0.025);
      if (this.form === 'Guardian') {
        this.rod(this.head, this.gold, [side * 0.85, 1.56, 0.3], [side * 1.4, 2.02, 0.92], 0.13, 0.012);
        this.rod(this.head, this.cream, [side * 0.9, 1.8, 0.5], [side * 1.15, 2.58, 1.12], 0.11, 0.012);
        this.rod(this.jaw, this.cream, [side * 0.57, 0.1, -0.94], [side * 0.57, 0.36, -1.03], 0.09, 0.012);
      }
    }
    for (let i = 0; i < 5; i++) {
      this.frond(this.head, i % 2 === 0 ? this.lime : this.foliage,
        [0, 0.89 + i * 0.01, -0.45 + i * 0.31], [0.58, 0.81 + i * 0.03, 0.9], [0.42 + i * 0.12, 0, 0]);
    }
    this.frond(this.head, this.lime, [0, 0.68, -0.93], [0.39, 0.65, 0.7], [0.03, 0, 0]);
  }

  private buildLegs(): void {
    for (const rear of [false, true]) for (const side of [-1, 1]) {
      const hip = new Group(); const knee = new Group(); const foot = new Group();
      hip.name = (side < 0 ? 'left-' : 'right-') + (rear ? 'hind-leg' : 'fore-leg');
      hip.position.set(side * (rear ? 0.99 : 0.94) * this.p.width, 1.94 * this.p.leg, (rear ? 1.7 : -1.22) * this.p.length);
      hip.scale.y = this.p.leg;
      this.rig.add(hip);
      this.ball(hip, this.skin, [side * 0.08, -0.42, 0.08], [rear ? 0.64 : 0.44, 0.72, rear ? 0.66 : 0.47]);
      knee.position.set(side * 0.07, -0.96, 0.13); hip.add(knee);
      this.ball(knee, this.skin, [0, -0.39, 0], [0.29, 0.51, 0.31]);
      foot.position.set(0, -0.75, -0.2); knee.add(foot);
      this.ball(foot, this.dark, [0, 0.035, -0.13], [0.43, 0.22, 0.57]);
      for (let toe = -1; toe <= 1; toe++) {
        this.rod(foot, this.gold, [toe * 0.24, 0.015, -0.42], [toe * 0.25, -0.06, -0.72], 0.125, 0.015);
      }
      this.frond(hip, this.foliage, [side * 0.26, -0.28, -0.25], [0.65, 0.75, 0.75], [0, 0, -side * 0.3]);
      this.frond(knee, this.lime, [side * 0.13, -0.42, -0.3], [0.4, 0.52, 0.6], [-0.25, 0, -side * 0.12]);
      this.legs.push({ hip, knee, foot, rear, phase: (rear ? 1 : 0) === (side < 0 ? 1 : 0) ? 0 : Math.PI });
    }
  }

  private buildTail(bodyY: number): void {
    let parent = this.rig;
    const lengths = [0.95, 0.9, 0.85, 0.78, 0.72, 0.64, 0.55];
    const radii = [0.66, 0.55, 0.44, 0.35, 0.27, 0.19, 0.12];
    for (let i = 0; i < lengths.length; i++) {
      const segment = new Group(); segment.name = 'tail-joint-' + i;
      segment.position.set(0, i === 0 ? bodyY : 0, i === 0 ? 2.24 * this.p.length : lengths[i - 1] * this.p.tail);
      parent.add(segment); this.tail.push(segment);
      const length = lengths[i] * this.p.tail;
      this.rod(segment, this.skin, [0, 0, 0], [0, 0, length], radii[i], i < radii.length - 1 ? radii[i + 1] : 0.055);
      this.ball(segment, this.cream, [0, -radii[i] * 0.71, length * 0.46], [radii[i] * 0.64, radii[i] * 0.36, length * 0.51]);
      this.frond(segment, i % 2 === 0 ? this.foliage : this.lime,
        [0, radii[i] * 0.8, length * 0.4], [radii[i] * 1.25, 0.62 - i * 0.045, 0.9], [0.6, 0, 0]);
      parent = segment;
    }
    for (const side of [-1, 0, 1]) this.frond(parent, side === 0 ? this.lime : this.foliage,
      [side * 0.13, 0.04, 0.58 * this.p.tail], [0.65, 1.02, 0.95], [0.62, 0, -side * 0.48]);
  }

  private buildWings(bodyY: number): void {
    const membrane = this.material(0xe5e3a1, { side: DoubleSide, roughness: 0.9 });
    const points: Point[] = [
      [0, 0, 0], [2.12, 0.96, -0.32], [4.02, 1.28, -1.03],
      [8.08, 0.34, -0.15], [7.14, -0.08, 1.67], [5.12, -0.33, 3.12],
      [2.83, -0.41, 2.9], [0.6, -0.55, 1.63],
    ];
    // Each panel has a slightly full center and a concave trailing edge.
    // One membrane mesh per wing, with open space between the five fingers.
    const vertices: number[] = []; const indices: number[] = [];
    for (let i = 3; i < 7; i++) {
      const a = points[2]; const b = points[i]; const c = points[i + 1];
      const scallop: Point = [(b[0] + c[0]) * 0.45 + a[0] * 0.1, (b[1] + c[1]) * 0.5 + 0.16, (b[2] + c[2]) * 0.45 + a[2] * 0.1];
      const center: Point = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3 - 0.11, (a[2] + b[2] + c[2]) / 3];
      const offset = vertices.length / 3;
      vertices.push(...a, ...b, ...scallop, ...c, ...center);
      indices.push(offset, offset + 1, offset + 4, offset + 1, offset + 2, offset + 4, offset + 2, offset + 3, offset + 4, offset + 3, offset, offset + 4);
    }
    // The small inner panel connects the arm to the flank.
    const offset = vertices.length / 3;
    vertices.push(...points[0], ...points[1], ...points[2], ...points[7]);
    indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    const geometry = this.trackGeometry(new BufferGeometry());
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    for (const side of [-1, 1]) {
      const joint = new Group(); joint.name = side < 0 ? 'left-wing' : 'right-wing';
      joint.position.set(side * 0.93 * this.p.width, bodyY + 0.96, -0.45);
      joint.scale.set(side * this.p.wing, this.p.wing, this.p.wing); this.rig.add(joint);
      this.mesh(joint, geometry, membrane, [0, 0, 0], [1, 1, 1]);
      this.rod(joint, this.skin, points[0], points[1], 0.22, 0.18);
      this.rod(joint, this.dark, points[1], points[2], 0.18, 0.12);
      for (let i = 3; i < points.length; i++) this.rod(joint, this.dark, points[2], points[i], 0.085, 0.025);
      this.ball(joint, this.gold, points[2], [0.25, 0.19, 0.22]);
      this.rod(joint, this.cream, points[2], [4.29, 1.69, -1.24], 0.15, 0.012);
      this.frond(joint, this.foliage, [0.82, 0.38, -0.24], [0.72, 0.97, 0.9], [0.18, 0, -0.93]);
      this.wings.push({ joint, side });
    }
  }

  private buildFoliage(bodyY: number): void {
    for (let i = 0; i < 7; i++) {
      if (this.form === 'Young' && i > 1 && i < 5) continue;
      this.frond(this.rig, i % 2 === 0 ? this.foliage : this.lime,
        [0, bodyY + 0.97, -1.39 + i * 0.56 * this.p.length], [0.67, 0.82, 1], [0.5, 0, 0]);
    }
    for (const side of [-1, 1]) for (let i = 0; i < (this.form === 'Guardian' ? 5 : 3); i++) {
      this.frond(this.rig, i % 2 === 0 ? this.foliage : this.lime,
        [side * 1.12 * this.p.width, bodyY + 0.45, -0.93 + i * 0.54],
        [0.62, this.form === 'Guardian' ? 1.03 : 0.75, 0.9], [0.46, side * 0.25, -side * 0.98]);
    }
  }

  private buildSaddle(bodyY: number): void {
    const leather = this.material(0x654331); const seat = this.material(0x8d6040);
    this.ball(this.rig, this.gold, [0, bodyY + 1.09, 0.33], [0.82, 0.19, 0.94]);
    this.ball(this.rig, leather, [0, bodyY + 1.2, 0.33], [0.76, 0.17, 0.85]);
    this.ball(this.rig, seat, [0, bodyY + 1.29, 0.3], [0.58, 0.1, 0.61]);
    this.ball(this.rig, leather, [0, bodyY + 1.49, 0.93], [0.63, 0.35, 0.15]);
    this.ball(this.rig, this.gold, [0, bodyY + 1.39, -0.34], [0.4, 0.13, 0.15]);
    const beltGeometry = this.trackGeometry(new TorusGeometry(1, 0.07, 5, 18));
    this.mesh(this.rig, beltGeometry, leather, [0, bodyY, 0.34], [1.3, 1.17, 1]);
    for (const side of [-1, 1]) {
      this.ball(this.rig, this.gold, [side * 1.19, bodyY + 0.46, 0.34], [0.1, 0.2, 0.19]);
      this.rod(this.rig, leather, [side * 0.6, bodyY + 1.11, -0.2], [side * 0.85, bodyY + 0.18, -1.75], 0.085);
    }
    this.frond(this.rig, this.gold, [0, bodyY + 0.51, -2.03], [0.37, 0.48, 0.48]);
    this.frond(this.rig, this.lime, [0, bodyY + 0.51, -2.1], [0.22, 0.32, 0.45]);
  }

  update(dt: number, pose: DragonPose = {}): void {
    if (this.disposed) return;
    const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.1);
    this.time += delta;
    const state = pose.state ?? 'idle';
    const flight = state === 'flight' || state === 'glide' || state === 'boost' || state === 'takeoff' || state === 'return';
    const speed = Number.isFinite(pose.speed) ? Math.abs(pose.speed ?? 0) : 0;
    const gaitTarget = state === 'walk' ? clamp(speed > 1 ? speed / 9 : speed || 0.6, 0.15, 1) : 0;
    const blend = 1 - Math.exp(-delta * 8);
    const poseBlend = delta > 0 ? 1 - Math.exp(-delta * 10) : 1;
    this.airborne = ease(this.airborne, flight ? 1 : 0, blend);
    this.gait = ease(this.gait, gaitTarget, blend);
    this.bank = ease(this.bank, clamp(Number.isFinite(pose.bank) ? pose.bank ?? 0 : 0, -1, 1), blend);
    this.vertical = ease(this.vertical, clamp(Number.isFinite(pose.vertical) ? pose.vertical ?? 0 : 0, -1, 1), blend);
    this.mouth = ease(this.mouth, state === 'roar' ? 0.75 : state === 'eat' ? 0.16 + Math.sin(this.time * 8) * 0.12 : 0.02, blend);
    this.gaitTime += delta * (4.3 + this.gait * 5);
    const breath = Math.sin(this.time * (this.form === 'Baby' ? 2.6 : 1.7));
    this.chest.scale.y = 1.12 + breath * 0.025;
    this.rig.position.y = breath * 0.017 + this.gait * Math.abs(Math.sin(this.gaitTime)) * 0.08 + this.airborne * Math.sin(this.time * 3.1) * 0.08;
    if (state === 'takeoff') this.rig.position.y += 0.11 * Math.sin(this.time * 7);
    if (state === 'land') this.rig.position.y -= 0.11;
    this.rig.rotation.z = -this.bank * 0.4 * this.airborne;
    this.rig.rotation.x = ease(this.rig.rotation.x, this.vertical * 0.16 * this.airborne + (state === 'boost' ? -0.075 : state === 'takeoff' ? 0.19 : 0), poseBlend);
    this.head.rotation.y = Math.sin(this.time * 0.68) * (state === 'idle' ? 0.09 : 0.025) - this.bank * 0.07;
    this.head.rotation.x = ease(this.head.rotation.x, state === 'eat' ? -0.4 + Math.sin(this.time * 5) * 0.11 : state === 'roar' ? 0.27 : state === 'alert' ? 0.12 : this.vertical * 0.12 + breath * 0.016, poseBlend);
    this.jaw.rotation.x = -this.mouth;
    const blinkPhase = this.time % 5.6;
    const blink = blinkPhase > 5.39 ? Math.max(0.08, Math.abs(blinkPhase - 5.495) / 0.105) : 1;
    for (const eye of this.eyes) eye.scale.y = (this.form === 'Guardian' ? 0.77 : 1) * blink;
    const flapSpeed = state === 'boost' ? 10 : state === 'takeoff' ? 7.6 : 5.4;
    const flap = Math.sin(this.time * flapSpeed);
    for (const { joint, side } of this.wings) {
      const folded = this.form === 'Baby' ? 0.74 : 0.94;
      const open = state === 'glide' ? -0.06 : state === 'boost' ? -0.22 + flap * 0.19 : 0.05 + flap * (state === 'takeoff' ? 0.67 : 0.45);
      const alert = state === 'roar' || state === 'alert' ? 0.2 : folded;
      joint.rotation.z = ease(joint.rotation.z, side * ease(alert, open, this.airborne), poseBlend);
      joint.rotation.y = ease(joint.rotation.y, side * (this.airborne * (state === 'boost' ? 0.31 : 0.07) + (1 - this.airborne) * 0.27), poseBlend);
      joint.rotation.x = this.airborne * (0.08 - this.vertical * 0.08);
    }
    for (const leg of this.legs) {
      const wave = Math.sin(this.gaitTime + leg.phase);
      const ground = wave * 0.46 * this.gait;
      const tuck = leg.rear ? -0.44 : 0.67;
      leg.hip.rotation.x = ease(ground, tuck, this.airborne);
      leg.knee.rotation.x = ease(Math.max(0, -wave) * 0.58 * this.gait, 0.63, this.airborne);
      leg.foot.rotation.x = -leg.hip.rotation.x * 0.42 - leg.knee.rotation.x * 0.25;
      if (state === 'land') { leg.hip.rotation.x *= 0.3; leg.knee.rotation.x *= 0.3; }
    }
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].rotation.y = Math.sin(this.time * 1.65 - i * 0.47) * (0.045 + i * 0.007) - this.bank * 0.024;
      this.tail[i].rotation.x = -0.055 - i * 0.008 + Math.sin(this.time * 1.9 - i * 0.42) * 0.025 + this.airborne * 0.035;
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.root.removeFromParent();
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
    this.root.clear();
  }
}
