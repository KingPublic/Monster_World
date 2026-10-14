import {
  BufferGeometry, CatmullRomCurve3, CylinderGeometry, DoubleSide, Float32BufferAttribute,
  Group, MathUtils, Mesh, MeshStandardMaterial, Quaternion, SphereGeometry, TorusGeometry,
  TubeGeometry, Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { adventureDragonProfiles } from '../config/adventureDragonProfiles';
import type { AdventureDragonProfile, AdventureDragonProfileId } from '../config/adventureDragonProfiles';
import type { DragonForm, DragonPose } from './ProceduralDragon';
import type { DragonVisual } from './RideableDragon';

type Point = readonly [number, number, number];
interface Leg { hip: Group; knee: Group; foot: Group; upper: number; lower: number; rear: boolean; phase: number; }
interface Wing { shoulder: Group; wrist: Group; side: number; }
const UP = new Vector3(0, 1, 0);
const FORM_SIZE: Record<DragonForm, number> = { Baby: .4, Young: 1, Guardian: 1.85 };
const clamp = MathUtils.clamp;

/**
 * Six authored temporary species, facing -Z. Physics and rider roots are never scaled.
 * Articulation, form proportions and meal growth live exclusively under the visual frame.
 */
export class AdventureDragon implements DragonVisual {
  readonly root = new Group();
  readonly mountAnchor = new Group();
  readonly carryAnchors = [new Group(), new Group()] as const;
  private readonly frame = new Group();
  private readonly body = new Group();
  private readonly head = new Group();
  private readonly jaw = new Group();
  private readonly hornCrest = new Group();
  private readonly saddle = new Group();
  private readonly seat = new Group();
  private readonly tail: Group[] = [];
  private readonly legs: Leg[] = [];
  private readonly wings: Wing[] = [];
  private readonly eyes: Group[] = [];
  private readonly geometries = new Set<BufferGeometry>();
  private readonly materials = new Set<MeshStandardMaterial>();
  private readonly sphere = this.geometry(new SphereGeometry(1, 16, 12));
  private readonly cylinder = this.geometry(new CylinderGeometry(1, 1, 1, 9, 1));
  private readonly tapers = new Map<number, BufferGeometry>();
  private readonly leaf = this.geometry(this.leafGeometry());
  private readonly crystal = this.geometry(this.crystalGeometry());
  private readonly point = new Vector3();
  private readonly rotation = new Quaternion();
  private readonly p: AdventureDragonProfile;
  private readonly skin: MeshStandardMaterial;
  private readonly shade: MeshStandardMaterial;
  private readonly belly: MeshStandardMaterial;
  private readonly accent: MeshStandardMaterial;
  private readonly membrane: MeshStandardMaterial;
  private readonly dark: MeshStandardMaterial;
  private readonly iris: MeshStandardMaterial;
  private readonly white: MeshStandardMaterial;
  private readonly leather: MeshStandardMaterial;
  private readonly metal: MeshStandardMaterial;
  private readonly mouthMaterial: MeshStandardMaterial;
  private time = 0;
  private gaitTime = 0;
  private size: number;
  private baby: number;
  private growth = 1;
  private air = 0;
  private gait = 0;
  private bank = 0;
  private vertical = 0;
  private mouth = 0;
  private disposed = false;

  constructor(private form: DragonForm, readonly profile: AdventureDragonProfileId) {
    this.p = adventureDragonProfiles[profile]; this.size = FORM_SIZE[form]; this.baby = form === 'Baby' ? 1 : 0;
    this.skin = this.material(this.p.skin, this.p.roughness, this.p.metalness);
    this.shade = this.material(this.p.shade); this.belly = this.material(this.p.belly);
    this.accent = this.material(this.p.accent, this.p.crest === 'crystal' ? .29 : .55, .12);
    if (this.p.crest === 'ribbon') this.accent.side = DoubleSide;
    this.membrane = this.material(this.p.membrane, .77); this.membrane.side = DoubleSide;
    this.dark = this.material(0x23323a, .3); this.iris = this.material(this.p.iris, .24);
    this.white = this.material(0xfff9e8, .22); this.leather = this.material(0x62463b, .89);
    this.metal = this.material(0xdac28a, .4, .45); this.mouthMaterial = this.material(0x51333f);
    this.root.name = this.p.family + 'Family-' + form;
    Object.assign(this.root.userData, {
      assetStatus: 'ready', sourceReady: false, runtimeAsset: 'authored:' + profile,
      authoredTemporary: true, family: this.p.family, variant: profile, form,
      silhouette: this.p.silhouette, motion: 'articulated authored rest, gait, flight and care',
    });
    this.frame.name = 'authored-visual-frame'; this.body.name = 'breathing-torso';
    this.root.add(this.frame, this.mountAnchor, ...this.carryAnchors); this.frame.add(this.body);
    this.mountAnchor.name = 'rider-anchor'; this.mountAnchor.userData.rideable = form === 'Young';
    this.carryAnchors[0].name = 'right-talon-carry-anchor'; this.carryAnchors[1].name = 'left-talon-carry-anchor';
    this.buildBody(); this.buildHead(); this.buildLegs(); this.buildWings(); this.buildTail(); this.buildSaddle();
    this.mergeStaticParts(); this.saddle.visible = form === 'Young';
    this.update(0, { state: 'idle' });
    let meshes = 0; let triangles = 0;
    this.root.traverse(node => { if (node instanceof Mesh) { meshes++; triangles += (node.geometry.index?.count ?? node.geometry.getAttribute('position').count) / 3; } });
    this.root.userData.resourceBudget = { meshes, triangles, materials: this.materials.size, geometries: this.geometries.size };
  }

  private geometry<T extends BufferGeometry>(geometry: T): T { this.geometries.add(geometry); return geometry; }
  private material(color: number, roughness = .72, metalness = .03): MeshStandardMaterial {
    const material = new MeshStandardMaterial({ color, roughness, metalness }); this.materials.add(material); return material;
  }
  private mesh(parent: Group, geometry: BufferGeometry, material: MeshStandardMaterial, point: Point, scale: Point, name = ''): Mesh {
    const mesh = new Mesh(geometry, material); mesh.position.set(...point); mesh.scale.set(...scale);
    mesh.name = name; mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  private ball(parent: Group, material: MeshStandardMaterial, point: Point, scale: Point): Mesh { return this.mesh(parent, this.sphere, material, point, scale); }
  private frond(parent: Group, material: MeshStandardMaterial, point: Point, scale: Point, rotation: Point = [0, 0, 0], crystalline = false): Mesh {
    const mesh = this.mesh(parent, crystalline ? this.crystal : this.leaf, material, point, scale); mesh.rotation.set(...rotation); return mesh;
  }
  private rod(parent: Group, material: MeshStandardMaterial, a: Point, b: Point, radius: number, tipRadius = radius): Mesh {
    const start = new Vector3(...a); const end = new Vector3(...b); const direction = end.clone().sub(start);
    const ratio = Math.round(tipRadius / radius * 1000) / 1000;
    let geometry: BufferGeometry = this.cylinder;
    if (ratio !== 1) { let taper = this.tapers.get(ratio); if (!taper) { taper = this.geometry(new CylinderGeometry(ratio, 1, 1, 9, 1)); this.tapers.set(ratio, taper); } geometry = taper; }
    const mesh = this.mesh(parent, geometry, material, [0, 0, 0], [radius, direction.length(), radius]);
    mesh.position.copy(start.add(end).multiplyScalar(.5)); mesh.quaternion.setFromUnitVectors(UP, direction.normalize()); return mesh;
  }
  private curve(parent: Group, material: MeshStandardMaterial, points: Point[], radius: number, taper = true): void {
    // A tapering ring sweep keeps horns soft at the root and precise at the tip.
    const curve = new CatmullRomCurve3(points.map(point => new Vector3(...point)));
    const geometry = new TubeGeometry(curve, 16, radius, 7, false);
    if (taper) {
      const attribute = geometry.getAttribute('position');
      for (let ring = 0; ring <= 16; ring++) {
        const center = curve.getPointAt(ring / 16); const amount = 1 - ring / 16 * .94;
        for (let j = 0; j <= 7; j++) { const index = ring * 8 + j; this.point.fromBufferAttribute(attribute, index).sub(center).multiplyScalar(amount).add(center); attribute.setXYZ(index, this.point.x, this.point.y, this.point.z); }
      }
      geometry.computeVertexNormals();
    }
    this.mesh(parent, this.geometry(geometry), material, [0, 0, 0], [1, 1, 1]);
  }
  private leafGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([0, 1, 0, .33, .42, 0, .25, -.22, 0, 0, -.5, 0, -.25, -.22, 0, -.33, .42, 0, 0, .15, .11, 0, .15, -.05], 3));
    geometry.setIndex([6, 1, 0, 6, 2, 1, 6, 3, 2, 6, 4, 3, 6, 5, 4, 6, 0, 5, 7, 0, 1, 7, 1, 2, 7, 2, 3, 7, 3, 4, 7, 4, 5, 7, 5, 0]); geometry.computeVertexNormals(); return geometry;
  }
  private crystalGeometry(): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([0, 1.3, 0, .35, .1, .2, -.35, .1, .2, -.35, .1, -.2, .35, .1, -.2, 0, -.48, 0], 3));
    geometry.setIndex([0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 1, 4, 5, 1, 2, 5, 2, 3, 5, 3, 4, 5, 4, 1]); geometry.computeVertexNormals(); return geometry;
  }
  private ribbonGeometry(length: number, width: number, sweep: number): BufferGeometry {
    const vertices: number[] = []; const indices: number[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12; const x = Math.sin(t * Math.PI) * sweep + t * .16;
      const y = Math.sin(t * Math.PI * 2) * .12; const halfWidth = (.1 + Math.sin(t * Math.PI) * .9) * width * .5 * (1 - t * .75);
      vertices.push(x - halfWidth, y, t * length, x + halfWidth, y + Math.sin(t * Math.PI) * .05, t * length);
      if (i > 0) { const index = i * 2; indices.push(index - 2, index, index - 1, index - 1, index, index + 1); }
    }
    const geometry = this.geometry(new BufferGeometry()); geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }

  private buildBody(): void {
    const [width, height, length] = this.p.body;
    // Longitudinal contour creates a chest, narrower saddle waist and separate broad hips.
    const rings = this.p.anatomy === 'serpent' ? [0, .46, .78, 1, .97, .9, .78, .56, 0] : [0, .48, .87, 1, .91, .87, 1, .72, 0];
    const vertices: number[] = []; const indices: number[] = []; const radial = 16;
    for (let ring = 0; ring < rings.length; ring++) for (let side = 0; side <= radial; side++) {
      const angle = side / radial * Math.PI * 2; const t = ring / (rings.length - 1);
      vertices.push(Math.cos(angle) * width * rings[ring]! + (this.p.anatomy === 'serpent' ? Math.sin(t * Math.PI * 2) * .13 : 0), this.p.bodyY + Math.sin(angle) * height * rings[ring]! + Math.sin(t * Math.PI) * .1, (t * 2 - 1) * length);
      if (ring > 0 && side < radial) { const a = ring * (radial + 1) + side; const b = a - radial - 1; indices.push(a, b, a + 1, a + 1, b, b + 1); }
    }
    const geometry = this.geometry(new BufferGeometry()); geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    this.mesh(this.body, geometry, this.skin, [0, 0, 0], [1, 1, 1], this.profile + '-contoured-torso');
    this.ball(this.body, this.belly, [0, this.p.bodyY - .25, -.15], [width * .8, height * .75, length * .87]);
    const neckBase = -length * .67;
    const neckPoints: Point[] = this.p.anatomy === 'serpent'
      ? [[0, this.p.bodyY + .1, neckBase], [0, this.p.bodyY + .69, neckBase - .78], [0, this.p.bodyY + 1.69, neckBase - .94], [0, this.p.bodyY + this.p.neck + .2, neckBase - 1.34], [0, this.p.bodyY + this.p.neck + .35, neckBase - 1.69]]
      : [[0, this.p.bodyY + .3, neckBase], [0, this.p.bodyY + .85, neckBase - .45], [0, this.p.bodyY + this.p.neck + .2, neckBase - .45], [0, this.p.bodyY + this.p.neck + .35, neckBase - .9]];
    this.curve(this.body, this.skin, neckPoints, width * .55, false);
    for (let i = 0; i < 5; i++) this.ball(this.body, this.belly, [0, this.p.bodyY + .37 + i * this.p.neck / 4.8, neckBase - .87 - (this.p.anatomy === 'serpent' ? .56 + i * .073 : Math.sin(i / 4 * Math.PI) * .02)], [width * .45 - i * .025, .16, .16]);
    if (this.p.crest === 'armor') {
      for (let row = 0; row < 4; row++) for (const side of [-1, 1]) this.frond(this.body, row % 2 ? this.accent : this.shade, [side * .58, this.p.bodyY + .89, -1.2 + row * .78], [2.4, .74, 2.3], [.83, side * .3, -side * .8], true);
      for (const side of [-1, 1]) for (let i = 0; i < 4; i++) this.frond(this.body, this.shade, [side * 1.35, this.p.bodyY + .23, -1.15 + i * .78], [1.15, .78, 1.4], [.5, 0, -side * 1.05], true);
    } else {
      for (let i = 0; i < 6; i++) {
        if (i === 2 || i === 3) continue; // Clear spine beneath the rider and saddle.
        const crystalline = this.p.crest === 'crystal';
        this.frond(this.body, i % 2 ? this.accent : this.shade, [0, this.p.bodyY + height * .95, -length * .8 + i * length * .31], [.75, this.p.crest === 'ribbon' ? .62 : .92, .8], [.38, 0, 0], crystalline);
      }
      if (this.p.crest === 'ribbon') for (const side of [-1, 1]) for (let i = 0; i < 6; i++) this.frond(this.body, this.accent, [side * width * .8, this.p.bodyY + .15, -length * .75 + i * .8], [.7, .9, 1.2], [.75, side * .3, -side * 1.08]);
    }
  }

  private buildHead(): void {
    const [width, height, length] = this.p.head;
    this.head.name = 'expressive-head'; this.head.position.set(0, this.p.bodyY + this.p.neck + .47, -this.p.body[2] * .67 - (this.p.anatomy === 'serpent' ? 1.77 : .97)); this.body.add(this.head);
    this.ball(this.head, this.skin, [0, .17, -.08], [width, height, length]);
    this.ball(this.head, this.skin, [0, -.06, -.91], [width * .84, .43, this.p.anatomy === 'serpent' ? .98 : .83]);
    this.ball(this.head, this.belly, [0, -.16, -1.33], [width * .72, .25, .47]);
    this.jaw.name = 'articulated-jaw'; this.jaw.position.set(0, -.36, -.3); this.head.add(this.jaw);
    this.ball(this.jaw, this.belly, [0, -.09, -.69], [width * .76, .17, .77]);
    this.ball(this.jaw, this.mouthMaterial, [0, .025, -.75], [width * .59, .031, .62]);
    this.ball(this.jaw, this.accent, [0, .051, -.89], [.27, .025, .33]);
    for (const side of [-1, 1]) {
      const eye = new Group(); eye.name = side < 0 ? 'left-blinking-eye' : 'right-blinking-eye';
      eye.position.set(side * width * .77, .35, -.69); eye.rotation.y = -side * .58; this.head.add(eye); this.eyes.push(eye);
      this.ball(eye, this.shade, [0, 0, .03], [.4, .44, .2]);
      this.ball(eye, this.white, [0, 0, -.055], [.32, .36, .18]);
      this.ball(eye, this.iris, [0, -.018, -.176], [.215, .284, .09]);
      this.ball(eye, this.dark, [0, -.021, -.251], [.081, .227, .038]);
      this.ball(eye, this.white, [-.075, .11, -.285], [.062, .068, .025]);
      this.ball(eye, this.white, [.066, -.074, -.278], [.027, .03, .016]);
      this.ball(this.head, this.shade, [side * width * .77, .69, -.63], [.46, .14, .29]).rotation.z = side * .17;
      this.ball(this.head, this.shade, [side * width * .34, .068, -1.699], [.089, .049, .037]);
      this.frond(this.head, this.shade, [side * width * .83, -.2, -.01], [.95, .62, .82], [.7, side * .25, -side * 1.3], this.p.crest === 'crystal');
      this.rod(this.jaw, this.white, [side * width * .54, .02, -.87], [side * width * .56, .19, -.97], .075, .008);
    }
    this.hornCrest.name = this.p.horns + '-horns-and-' + this.p.crest + '-crest'; this.head.add(this.hornCrest);
    for (const side of [-1, 1]) {
      const x = side * width * .62;
      if (this.p.horns === 'crescent') {
        this.curve(this.hornCrest, this.accent, [[x, .78, .17], [x + side * .52, 1.2, .33], [x + side * .69, 1.98, .03], [x + side * .35, 2.24, -.43], [x, 1.95, -.69]], .24);
      } else if (this.p.horns === 'ram') {
        this.curve(this.hornCrest, this.accent, [[x, .69, .12], [x + side * .67, .6, .66], [x + side * .95, 1.25, 1.05], [x + side * .53, 1.74, .66], [x + side * .27, 1.32, .28]], .35);
        this.rod(this.hornCrest, this.accent, [0, .22, -1.46], [0, .87, -1.83], .22, .016);
      } else if (this.p.horns === 'antler') {
        this.curve(this.hornCrest, this.belly, [[x, .63, .17], [x + side * .31, 1.29, .6], [x + side * .41, 1.8, 1.29], [x + side * .64, 2.1, 1.75]], .19);
        this.curve(this.hornCrest, this.accent, [[x + side * .32, 1.32, .67], [x + side * .95, 1.69, .96], [x + side * 1.18, 1.99, 1.05]], .13);
        this.rod(this.hornCrest, this.belly, [x + side * .39, 1.71, 1.18], [x + side * .14, 2.36, 1.42], .12, .012);
        this.curve(this.head, this.accent, [[side * .54, -.12, -1.25], [side * 1.17, -.34, -1.3], [side * 1.62, -.27, -.92], [side * 1.72, .02, -.58]], .049);
      } else {
        const tall = this.p.horns === 'spear' ? 1.78 : this.p.horns === 'crown' ? 1.51 : .94;
        this.curve(this.hornCrest, this.accent, [[x, .66, .14], [x + side * .17, 1.07, .35], [x + side * .26, .66 + tall, .7]], .24);
      }
    }
    if (this.p.crest === 'feather') {
      for (let i = 0; i < 11; i++) {
        const angle = (i / 10 * 1.6 - .8) * Math.PI;
        this.frond(this.hornCrest, i % 2 ? this.accent : this.belly, [Math.sin(angle) * .78, .26 + Math.cos(angle) * .61, .67], [1.1, 1.19, .9], [.35, 0, -angle]);
      }
      this.frond(this.hornCrest, this.accent, [0, .86, -.63], [.66, 1.04, .85], [.15, 0, 0]);
    } else {
      const count = this.p.crest === 'armor' ? 3 : 5;
      for (let i = 0; i < count; i++) this.frond(this.hornCrest, i % 2 ? this.shade : this.accent, [0, .81 + i * .017, -.44 + i * .29], [this.p.crest === 'armor' ? 1.17 : .59, this.p.crest === 'flame' ? .7 + Math.sin(i / count * Math.PI) * .44 : this.p.crest === 'ribbon' ? .58 : this.p.crest === 'night' ? .67 : 1.01, .82], [.35 + i * .09, 0, 0], this.p.crest === 'crystal' || this.p.crest === 'armor');
    }
  }

  private buildLegs(): void {
    const pairs = this.p.anatomy === 'wyvern' ? [true] : [false, true];
    for (const rear of pairs) for (const side of [-1, 1]) {
      const hip = new Group(); const knee = new Group(); const foot = new Group();
      hip.name = (side < 0 ? 'left-' : 'right-') + (rear ? 'hind-leg' : 'fore-leg'); knee.name = 'knee'; foot.name = 'grounded-talon';
      const hipY = this.p.bodyY - .1; const total = hipY + .19;
      const upper = total * (rear ? .55 : .49); const lower = total - upper;
      hip.position.set(side * this.p.body[0] * (this.p.anatomy === 'serpent' ? .78 : .81), hipY, rear ? this.p.body[2] * .7 : -this.p.body[2] * .62);
      this.frame.add(hip); knee.position.y = -upper; hip.add(knee); foot.position.y = -lower; knee.add(foot);
      const muscle = this.p.anatomy === 'serpent' ? .58 : this.p.crest === 'armor' ? 1.3 : 1;
      this.ball(hip, this.skin, [0, -upper * .38, 0], [(rear ? .51 : .35) * muscle, upper * .63, (rear ? .55 : .39) * muscle]);
      this.ball(knee, this.skin, [0, -lower * .41, 0], [.25 * muscle, lower * .6, .27 * muscle]);
      this.ball(foot, this.shade, [0, .07, -.15], [.38 * muscle, .16, .48 * muscle]);
      for (let toe = -1; toe <= 1; toe++) this.rod(foot, this.belly, [toe * .2 * muscle, .08, -.36], [toe * .22 * muscle, .04, -.68 * muscle], .085 * muscle, .009);
      if (this.p.crest === 'armor' || this.p.crest === 'crystal') this.frond(hip, this.accent, [side * .28, -upper * .28, -.05], [.9, .72, .84], [0, 0, -side * .61], true);
      this.legs.push({ hip, knee, foot, upper, lower, rear, phase: (rear === (side < 0) ? 0 : Math.PI) });
    }
  }

  private buildWings(): void {
    const span = this.p.wing; const feathered = this.p.crest === 'feather';
    for (const side of [-1, 1]) {
      const shoulder = new Group(); const wrist = new Group();
      shoulder.name = (side < 0 ? 'left-' : 'right-') + 'folding-wing'; wrist.name = feathered ? 'feather-fan-wrist' : 'membrane-finger-wrist';
      shoulder.position.set(side * this.p.body[0] * .73, this.p.bodyY + .67, -.79); shoulder.scale.x = side; this.body.add(shoulder);
      const arm: Point = [span * .29, .51, -.49]; wrist.position.set(...arm); shoulder.add(wrist);
      this.rod(shoulder, this.skin, [0, 0, 0], arm, .22, .145); this.ball(shoulder, this.accent, arm, [.2, .18, .22]);
      if (feathered) {
        this.rod(wrist, this.shade, [0, 0, 0], [span * .65, .21, .13], .13, .022);
        for (let row = 0; row < 2; row++) for (let i = 0; i < 10; i++) {
          const x = span * (.01 + i * .065); const z = .12 + i * .09 + row * .34;
          this.frond(wrist, row ? this.membrane : i % 3 === 0 ? this.accent : this.belly, [x, .04 + row * .07, z], [1.76 - i * .047, 2.1 - row * .54 + Math.sin(i / 9 * Math.PI) * .47, 1.12], [Math.PI / 2, 0, -.12 - i * .032]);
        }
      } else if (this.p.crest === 'ribbon') {
        // Stormserpent has streaming fish-like fins, with no shared bat membrane.
        this.curve(wrist, this.shade, [[0, 0, 0], [span * .23, .09, -.11], [span * .47, .14, .03], [span * .68, .08, .48]], .09);
        for (let i = 0; i < 5; i++) {
          const length = 2.4 + Math.sin(i / 4 * Math.PI) * 1.05;
          const ribbon = this.mesh(wrist, this.ribbonGeometry(length, .73, .34 + i * .07), i % 2 ? this.membrane : this.accent, [span * (.015 + i * .135), .01, i * .058], [1, 1, 1], 'stormserpent-streaming-fin-' + i);
          ribbon.rotation.y = -.16 + i * .095;
          this.curve(wrist, this.belly, [[span * (.015 + i * .135), .03, i * .058], [span * (.015 + i * .135) + .27, .12, length * .36], [span * (.015 + i * .135) + .25, .02, length * .76]], .019);
        }
      } else {
        const broad = this.p.crest === 'night' ? 1.43 : 1;
        const tips: Point[] = [[span * .69, .06, -.28], [span * .62, -.16, broad * 1.28], [span * .4, -.29, broad * 2.29], [span * .14, -.35, broad * 2.51], [-span * .16, -.42, 1.56]];
        const vertices: number[] = []; const indices: number[] = [];
        for (let i = 0; i < tips.length - 1; i++) {
          const b = tips[i]!; const c = tips[i + 1]!;
          const scallop: Point = [(b[0] + c[0]) * (this.p.crest === 'crystal' ? .5 : .4), (b[1] + c[1]) * .5, (b[2] + c[2]) * .43];
          const center: Point = [(b[0] + c[0]) / 3, -.12, (b[2] + c[2]) / 3]; const index = vertices.length / 3;
          vertices.push(0, 0, 0, ...b, ...scallop, ...c, ...center); indices.push(index, index + 1, index + 4, index + 1, index + 2, index + 4, index + 2, index + 3, index + 4, index + 3, index, index + 4);
        }
        const geometry = this.geometry(new BufferGeometry()); geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
        this.mesh(wrist, geometry, this.membrane, [0, 0, 0], [1, 1, 1], this.profile + '-sail');
        for (const tip of tips) this.rod(wrist, this.shade, [0, 0, 0], tip, .071, .013);
        this.rod(wrist, this.accent, [0, 0, 0], [.31, .61, -.22], .11, .009);
        if (this.p.crest === 'crystal') for (let i = 0; i < 3; i++) this.frond(wrist, this.accent, [span * (.1 + i * .15), .04, -.19], [.55, .79 + i * .08, .6], [.14, .05, -.91], true);
      }
      for (let i = 0; i < 3; i++) this.frond(shoulder, i % 2 ? this.accent : this.shade, [.33 + i * .29, .13, .04], [.67, .8, .65], [.11, 0, -.95], this.p.crest === 'crystal' || this.p.crest === 'armor');
      this.wings.push({ shoulder, wrist, side });
    }
  }

  private buildTail(): void {
    const count = this.p.anatomy === 'serpent' ? 11 : 7; const length = this.p.tail / count;
    let parent = this.body;
    for (let i = 0; i < count; i++) {
      const segment = new Group(); segment.name = 'flowing-tail-' + i;
      segment.position.set(0, i === 0 ? this.p.bodyY : 0, i === 0 ? this.p.body[2] * .85 : length); parent.add(segment); this.tail.push(segment);
      const radius = (.58 * (1 - i / count) + .055) * this.p.body[0]; const next = Math.max(.05, radius - .58 * this.p.body[0] / count);
      this.rod(segment, this.skin, [0, 0, 0], [0, 0, length], radius, next);
      this.ball(segment, this.belly, [0, -radius * .65, length * .52], [radius * .72, radius * .33, length * .56]);
      this.frond(segment, i % 2 ? this.accent : this.shade, [0, radius * .84, length * .43], [.6 * (1 - i / count) + .18, this.p.crest === 'ribbon' ? .94 : .65, .7], [.67, 0, 0], this.p.crest === 'crystal' || this.p.crest === 'armor');
      if (this.p.crest === 'ribbon') for (const side of [-1, 1]) this.frond(segment, this.accent, [side * radius * .78, 0, length * .57], [.62, .87, .9], [1.06, side * .3, -side * 1.28]);
      parent = segment;
    }
    const finCount = this.p.crest === 'flame' || this.p.crest === 'feather' ? 5 : 3;
    for (let i = 0; i < finCount; i++) {
      const side = i - (finCount - 1) / 2;
      this.frond(parent, i % 2 ? this.belly : this.accent, [side * .13, .05, length * .8], [.87, this.p.crest === 'armor' ? .69 : 1.22, .88], [.79, side * .2, -side * .28], this.p.crest === 'crystal' || this.p.crest === 'armor');
    }
  }

  private buildSaddle(): void {
    this.saddle.name = 'fitted-leather-saddle'; this.seat.name = 'back-contact-point';
    const seatY = this.p.bodyY + this.p.body[1] * .94 + .26;
    this.saddle.position.set(0, seatY - .16, .16); this.body.add(this.saddle);
    this.ball(this.saddle, this.metal, [0, -.07, 0], [.73, .14, .86]);
    this.ball(this.saddle, this.leather, [0, .01, 0], [.68, .13, .81]);
    this.ball(this.saddle, this.shade, [0, .087, -.04], [.55, .075, .63]);
    this.ball(this.saddle, this.leather, [0, .19, .64], [.57, .27, .12]);
    this.ball(this.saddle, this.metal, [0, .18, -.57], [.32, .12, .12]);
    const belt = this.geometry(new TorusGeometry(1, .048, 5, 20));
    this.mesh(this.saddle, belt, this.leather, [0, -this.p.body[1] * .93, 0], [this.p.body[0] * 1.03, this.p.body[1] * 1.03, 1]);
    for (const side of [-1, 1]) {
      this.ball(this.saddle, this.metal, [side * this.p.body[0] * .91, -.57, 0], [.09, .17, .13]);
      this.rod(this.saddle, this.leather, [side * .56, .02, -.49], [side * this.p.body[0] * .75, -.44, -1.28], .05);
    }
    this.seat.position.set(0, seatY, .12); this.body.add(this.seat);
  }

  /** Decorations merge only inside one joint; nothing animated is baked into its parent. */
  private mergeStaticParts(): void {
    const groups: Group[] = []; this.frame.traverse(node => { if (node instanceof Group) groups.push(node); });
    for (const group of groups) {
      const batches = new Map<MeshStandardMaterial, Mesh[]>();
      for (const child of group.children) if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        const meshes = batches.get(child.material) ?? []; meshes.push(child); batches.set(child.material, meshes);
      }
      for (const [material, meshes] of batches) {
        if (meshes.length < 2) continue;
        const copies = meshes.map(mesh => { mesh.updateMatrix(); const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrix); geometry.deleteAttribute('uv'); return geometry; });
        const merged = mergeGeometries(copies); for (const geometry of copies) geometry.dispose();
        if (!merged) continue; for (const mesh of meshes) group.remove(mesh);
        this.mesh(group, this.geometry(merged), material, [0, 0, 0], [1, 1, 1], this.profile + '-joint-batch');
      }
    }
  }

  setForm(form: DragonForm): void {
    if (this.disposed || form === this.form) return;
    this.form = form; this.root.userData.form = form; this.root.name = this.p.family + 'Family-' + form;
    this.mountAnchor.userData.rideable = form === 'Young'; this.saddle.visible = form === 'Young';
  }
  setGrowth(scale: number): void {
    if (!this.disposed && Number.isFinite(scale)) { this.growth = clamp(scale, 1, 1.35); this.root.userData.growthScale = this.growth; }
  }

  update(dt: number, pose: DragonPose = {}): void {
    if (this.disposed) return;
    const delta = clamp(Number.isFinite(dt) ? dt : 0, 0, .1); this.time += delta;
    const state = pose.state ?? 'idle';
    const blend = delta > 0 ? 1 - Math.exp(-delta * 8) : 1;
    const airTarget = ['flight', 'glide', 'boost', 'takeoff', 'return'].includes(state) ? 1 : 0;
    const speed = Number.isFinite(pose.speed) ? Math.abs(pose.speed ?? 0) : 0;
    const gaitTarget = state === 'walk' && speed > 0 ? clamp(speed > 1 ? speed / 12 : speed, 0, 1) : 0;
    this.air = MathUtils.lerp(this.air, airTarget, blend); this.gait = MathUtils.lerp(this.gait, gaitTarget, blend);
    this.bank = MathUtils.lerp(this.bank, clamp(Number.isFinite(pose.bank) ? pose.bank ?? 0 : 0, -1, 1), blend);
    this.vertical = MathUtils.lerp(this.vertical, clamp(Number.isFinite(pose.vertical) ? pose.vertical ?? 0 : 0, -1, 1), blend);
    this.size = MathUtils.damp(this.size, FORM_SIZE[this.form] * (this.form === 'Guardian' ? 1 : this.growth), 3, delta);
    this.baby = MathUtils.damp(this.baby, this.form === 'Baby' ? 1 : 0, 3, delta);
    this.frame.scale.setScalar(this.size); this.head.scale.setScalar(1 + this.baby * .22); this.hornCrest.scale.setScalar(1 - this.baby * .25);
    this.gaitTime += delta * (4.2 + this.gait * 3.5) * this.gait;
    const breath = Math.sin(this.time * (this.form === 'Baby' ? 2.15 : 1.65));
    this.body.position.y = breath * .024 + this.gait * Math.abs(Math.sin(this.gaitTime * 2)) * .045;
    this.body.rotation.x = breath * .006 + this.gait * Math.sin(this.gaitTime * 2) * .018;
    this.frame.rotation.z = -this.bank * .36 * this.air;
    this.frame.rotation.x = this.vertical * .13 * this.air + (state === 'takeoff' ? .14 : state === 'boost' ? -.065 : 0) * this.air;
    this.frame.position.y = this.air * (.22 + Math.sin(this.time * 2.8) * .055);
    this.head.rotation.y = Math.sin(this.time * .63) * (state === 'idle' ? .075 : .022) - this.bank * .065;
    this.head.rotation.x = MathUtils.lerp(this.head.rotation.x, state === 'eat' ? -.37 + Math.sin(this.time * 6) * .075 : state === 'roar' ? .22 : state === 'alert' ? .12 : breath * .018 + this.vertical * .06, blend);
    this.mouth = MathUtils.lerp(this.mouth, state === 'roar' ? .64 : state === 'eat' ? .17 + Math.sin(this.time * 8) * .11 : .011, blend); this.jaw.rotation.x = -this.mouth;
    const blinkPhase = (this.time + ADVENTURE_PHASE[this.profile]) % 5.9;
    const blink = blinkPhase > 5.68 ? Math.max(.07, Math.abs(blinkPhase - 5.79) / .11) : 1;
    for (const eye of this.eyes) eye.scale.y = blink;
    const flapSpeed = state === 'boost' ? 8.5 : state === 'takeoff' ? 7.4 : 4.8;
    const flap = state === 'glide' ? Math.sin(this.time * 1.9) * .035 : Math.sin(this.time * flapSpeed) * (state === 'takeoff' ? .48 : state === 'boost' ? .22 : .34);
    for (const { shoulder, wrist, side } of this.wings) {
      // Two rotating wing joints produce a compact backward fold and a full open flight silhouette.
      shoulder.rotation.y = side * MathUtils.lerp(-1.08, state === 'boost' ? -.12 : -.025, this.air);
      shoulder.rotation.z = side * MathUtils.lerp(.32, -.025 + flap - this.bank * side * .045, this.air);
      shoulder.rotation.x = this.air * -.04;
      wrist.rotation.y = MathUtils.lerp(-1.04, state === 'boost' ? -.18 : .015, this.air);
      wrist.rotation.z = MathUtils.lerp(.11, -.045 + flap * .28, this.air);
      wrist.rotation.x = this.air * (.02 + this.vertical * -.055);
      wrist.scale.set(MathUtils.lerp(.55, 1, this.air), 1, MathUtils.lerp(.39, 1, this.air));
    }
    for (const leg of this.legs) {
      const wave = Math.sin(this.gaitTime + leg.phase); const step = this.gait * (1 - this.air);
      const lift = Math.max(0, wave) * .47 * step;
      const footY = .15 + lift + this.air * (leg.rear ? .86 : 1.03);
      const footZ = Math.cos(this.gaitTime + leg.phase) * .72 * step + this.air * (leg.rear ? .61 : -.35);
      const dy = footY - leg.hip.position.y; const dz = footZ;
      const distance = clamp(Math.hypot(dy, dz), .05, leg.upper + leg.lower - .001);
      const direction = Math.atan2(-dz, -dy);
      const upperAngle = Math.acos(clamp((leg.upper ** 2 + distance ** 2 - leg.lower ** 2) / (2 * leg.upper * distance), -1, 1));
      const lowerAngle = Math.acos(clamp((leg.lower ** 2 + distance ** 2 - leg.upper ** 2) / (2 * leg.lower * distance), -1, 1));
      const bend = leg.rear ? 1 : -1;
      leg.hip.rotation.x = direction + upperAngle * bend; leg.knee.rotation.x = -(upperAngle + lowerAngle) * bend;
      leg.foot.rotation.x = -leg.hip.rotation.x - leg.knee.rotation.x + this.air * .18;
    }
    for (let i = 0; i < this.tail.length; i++) {
      const serpent = this.p.anatomy === 'serpent'; const segment = this.tail[i]!;
      segment.rotation.y = Math.sin(this.time * (serpent ? 1.55 : 1.25) - i * .49) * (serpent ? .12 : .055) * (1 + this.air * .4) - this.bank * .029;
      const groundCurve = i === 0 ? .17 : i < 3 ? .022 : -.022;
      segment.rotation.x = MathUtils.lerp(groundCurve, i === 0 ? .06 : -.012, this.air) + Math.sin(this.time * 1.62 - i * .43) * (serpent ? .021 : .011);
    }
    this.root.updateMatrixWorld(true);
    this.mountAnchor.position.copy(this.root.worldToLocal(this.seat.getWorldPosition(this.point)));
    this.seat.getWorldQuaternion(this.rotation); this.rotation.premultiply(this.root.getWorldQuaternion(new Quaternion()).invert()); this.mountAnchor.quaternion.copy(this.rotation);
    this.mountAnchor.scale.setScalar(1);
    const carryingFeet = this.legs.filter(leg => leg.rear);
    for (let i = 0; i < this.carryAnchors.length; i++) {
      const foot = carryingFeet[i]?.foot ?? this.legs[i]!.foot; const anchor = this.carryAnchors[i]!;
      anchor.position.copy(this.root.worldToLocal(foot.getWorldPosition(this.point))); anchor.position.y -= this.air * .4 * this.size;
      anchor.rotation.set(this.frame.rotation.x, 0, this.frame.rotation.z); anchor.scale.setScalar(1);
    }
    Object.assign(this.root.userData, { gait: this.gait, airborne: this.air, visualScale: this.size, canonicalRest: this.gait < .001 && this.air < .001 });
  }

  dispose(): void {
    if (this.disposed) return; this.disposed = true;
    this.root.removeFromParent(); this.root.clear();
    for (const geometry of this.geometries) geometry.dispose(); for (const material of this.materials) material.dispose();
    this.geometries.clear(); this.materials.clear(); this.tapers.clear(); this.root.userData.disposed = true;
  }
}

const ADVENTURE_PHASE: Record<AdventureDragonProfileId, number> = { emberdrake: 0, crystalwyvern: .7, stormserpent: 1.4, suncrest: 2.1, moonveil: 2.8, duneback: 3.5 };
