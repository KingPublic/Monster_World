import { Group, MathUtils, Mesh, Vector3 } from 'three';
import type { AssetInstance, RuntimeAssets } from '../systems/RuntimeAssets';
import { disposeScene, Parts } from '../utils/scene';
import { ProceduralDragon } from './ProceduralDragon';
import type { DragonForm, DragonPose } from './ProceduralDragon';
import { MountainMotion } from './MountainMotion';
import { RigContact } from './RigContact';
import { RigBounds } from './RigBounds';

export interface DragonVisual {
  root: Group; mountAnchor: Group; carryAnchors?: readonly Group[];
  update: (dt: number, pose: DragonPose) => void; dispose: () => void;
  setForm?: (form: DragonForm) => void;
}
const proportions = { Baby: { scale: .0042, baby: 1 }, Young: { scale: .012, baby: 0 }, Guardian: { scale: .021, baby: 0 } } as const;

/** One family across growth and parent roles; physics/rider roots stay stable. */
export class RideableDragon implements DragonVisual {
  readonly root = new Group(); readonly mountAnchor = new Group();
  readonly carryAnchors = [new Group(), new Group()] as const;
  private fallback: ProceduralDragon | undefined;
  private asset: AssetInstance | undefined; private motion: MountainMotion | undefined;
  private contact:RigContact|undefined;
  private bounds:RigBounds|undefined;
  private readonly frame = new Group(); private readonly saddle = new Group();
  private readonly point = new Vector3(); private readonly offset = new Vector3();
  private time = 0; private baby = 0; private size = .009; private disposed = false;
  constructor(assets: RuntimeAssets, url: string, private readonly onFailure: (message: string) => void, private form: DragonForm = 'Young') {
    this.size = proportions[form].scale; this.baby = proportions[form].baby;
    this.root.name = 'MountainFamily-' + form;
    this.root.userData.assetStatus = 'loading'; this.root.userData.form = form; this.root.userData.family = 'Mountain';
    this.fallback = new ProceduralDragon(form);
    this.root.add(this.fallback.root, this.frame, this.mountAnchor, ...this.carryAnchors);
    this.mountAnchor.name = 'rider-anchor'; this.carryAnchors[0].name = 'right-talon-carry-anchor'; this.carryAnchors[1].name = 'left-talon-carry-anchor';
    const p = new Parts();
    p.add(this.saddle, 'sphere', 0x4e3831, [0, -.1, .1], [1.1, .18, 1.5]);
    p.add(this.saddle, 'sphere', 0x9c6843, [0, .08, .95], [.95, .28, .24]);
    p.add(this.saddle, 'sphere', 0x9c6843, [0, .08, -.8], [.8, .25, .16]);
    for (const side of [-1, 1]) { const strap = p.add(this.saddle, 'ring', 0xd9b576, [side * .95, -.3, .15], [.12, .45, .18]); strap.rotation.y = Math.PI / 2; }
    p.add(this.saddle, 'cylinder', 0xd9b576, [0, .4, -.55], [.045, 1.2, .045]).rotation.z = Math.PI / 2;
    this.mountAnchor.add(this.saddle); this.saddle.visible = form === 'Young';
    this.update(0, { state: 'idle' });
    void assets.acquire(url).then(asset => {
      if (this.disposed) { asset.release(); return; }
      this.asset = asset; this.motion = new MountainMotion(asset.root, asset.clips[0]);
      asset.root.updateMatrixWorld(true);
      const pelvis = this.bone('MountainDragon__Pelvis_03').getWorldPosition(new Vector3());
      const feet = ['MountainDragon__R_Foot_062', 'MountainDragon__L_Foot_074'].map(name => this.bone(name).getWorldPosition(new Vector3()));
      asset.root.position.add(new Vector3(-pelvis.x, -Math.min(...feet.map(point => point.y)) + 18, -pelvis.z));
      this.frame.scale.setScalar(this.size); this.frame.rotation.y = Math.PI; this.frame.add(asset.root);
      this.root.updateMatrixWorld(true);this.contact=new RigContact(asset.root);
      this.bounds=new RigBounds(asset.root);
      asset.root.traverse(node => { if (node instanceof Mesh) { node.castShadow = true; node.receiveShadow = true; node.frustumCulled = true; } });
      this.fallback?.dispose(); this.fallback = undefined;
      this.root.userData.assetStatus = 'ready'; this.root.userData.runtimeAsset = url;
      this.root.userData.motion = 'blended montage windows + authored secondary motion';
      this.update(0, { state: 'idle' });
    }).catch(error => {
      if (this.disposed) return;
      this.motion?.dispose(); this.asset?.release(); this.asset = undefined; this.motion = undefined;
      this.root.userData.assetStatus = 'fallback'; this.onFailure('Dragon model could not load. Temporary visual active. ' + String(error));
    });
  }
  setForm(form: DragonForm): void {
    if (form === this.form) return;
    this.form = form; this.root.userData.form = form; this.root.name = 'MountainFamily-' + form;
    this.saddle.visible = form === 'Young';
    if (this.fallback) { this.fallback.dispose(); this.fallback = new ProceduralDragon(form); this.root.add(this.fallback.root); }
  }
  private bone(name: string) { const bone = this.motion?.rig.get(name); if (!bone) throw new Error('Missing family joint: ' + name); return bone; }
  update(dt: number, pose: DragonPose): void {
    if (this.disposed) return;
    this.time += dt;
    this.size = MathUtils.damp(this.size, proportions[this.form].scale, 2.8, dt);
    this.baby = MathUtils.damp(this.baby, proportions[this.form].baby, 2.8, dt);
    if (this.fallback) {
      this.fallback.update(dt, pose); this.root.updateMatrixWorld(true);
      this.mountAnchor.position.copy(this.root.worldToLocal(this.fallback.mountAnchor.getWorldPosition(this.point)));
      this.carryAnchors[0].position.set(-1, 1, 1); this.carryAnchors[1].position.set(1, 1, 1); return;
    }
    if (!this.motion) return;
    this.motion.update(dt, pose, this.baby);
    const air = this.motion.airborne;
    this.frame.scale.setScalar(this.size); this.frame.rotation.z = -this.motion.bank * .42; this.frame.rotation.x = -this.motion.vertical * .12;
    this.frame.position.y = Math.sin(this.time * 1.8) * .06 + air * (.3 + Math.sin(this.time * 2.6) * .12);
    this.root.updateMatrixWorld(true);
    if (air < .95) {
      let minFoot = this.contact?.minimum(this.root)??Infinity;
      if(!Number.isFinite(minFoot))for (const name of ['MountainDragon__R_Foot_062', 'MountainDragon__L_Foot_074']) minFoot = Math.min(minFoot, this.root.worldToLocal(this.bone(name).getWorldPosition(this.point)).y);
      this.frame.position.y += (.12 - minFoot) * (1 - air); this.root.updateMatrixWorld(true);
    }
    const seat = this.motion.rig.get('MountainDragon__Spine_04') ?? this.bone('MountainDragon__Pelvis_03');
    this.mountAnchor.position.copy(this.root.worldToLocal(seat.getWorldPosition(this.point))).add(this.offset.set(0, 1.35 * this.size / .009, .15));
    this.mountAnchor.rotation.set(this.frame.rotation.x, 0, this.frame.rotation.z);
    for (const [index, name] of ['MountainDragon__R_Foot_062', 'MountainDragon__L_Foot_074'].entries()) {
      const anchor = this.carryAnchors[index]!;
      anchor.position.copy(this.root.worldToLocal(this.bone(name).getWorldPosition(this.point)));
      anchor.position.y = air > .3 ? anchor.position.y - .7 : .1; anchor.rotation.z = this.frame.rotation.z;
    }
    this.bounds?.update();
  }
  dispose(): void {
    if (this.disposed) return; this.disposed = true;
    this.motion?.dispose(); this.contact?.clear();this.bounds?.clear();this.asset?.release(); this.fallback?.dispose();
    this.mountAnchor.removeFromParent(); disposeScene(this.saddle); this.root.removeFromParent(); this.root.clear();
  }
}
