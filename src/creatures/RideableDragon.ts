import { Group, MathUtils, Mesh, SkinnedMesh, Vector3 } from 'three';
import type { BufferGeometry, Material } from 'three';
import type { AssetInstance, RuntimeAssets } from '../systems/RuntimeAssets';
import { disposeScene, Parts } from '../utils/scene';
import { ProceduralDragon } from './ProceduralDragon';
import type { DragonForm, DragonPose } from './ProceduralDragon';
import { MountainMotion } from './MountainMotion';
import { RigContact } from './RigContact';
import { RigBounds } from './RigBounds';
import { DemonMotion } from './DemonMotion';
import { RigSaddle } from './RigSaddle';

export interface DragonVisual {
  root: Group; mountAnchor: Group; carryAnchors?: readonly Group[];
  update: (dt: number, pose: DragonPose) => void; dispose: () => void;
  setForm?: (form: DragonForm) => void;
  setGrowth?: (scale:number) => void;
}
const proportions = { Baby: { scale: .0042, baby: 1 }, Young: { scale: .012, baby: 0 }, Guardian: { scale: .021, baby: 0 } } as const;
export interface DragonFamilyOptions {family?:'Mountain'|'Ashscale';body?:number;wing?:number;variant?:string;}

/** One family across growth and parent roles; physics/rider roots stay stable. */
export class RideableDragon implements DragonVisual {
  readonly root = new Group(); readonly mountAnchor = new Group();
  readonly carryAnchors = [new Group(), new Group()] as const;
  private fallback: ProceduralDragon | undefined;
  private asset: AssetInstance | undefined; private motion: MountainMotion | DemonMotion | undefined;
  private readonly ownedMaterials=new Set<Material>();
  private readonly ownedGeometry=new Set<BufferGeometry>();
  private contact:RigContact|undefined;
  private bounds:RigBounds|undefined;
  private seatFit:RigSaddle|undefined;
  private readonly frame = new Group(); private readonly saddle = new Group();
  private readonly point = new Vector3();
  private time = 0; private baby = 0; private size = .009; private disposed = false;
  private growthScale=1;
  constructor(assets: RuntimeAssets, url: string, private readonly onFailure: (message: string) => void, private form: DragonForm = 'Young',private readonly options:DragonFamilyOptions={}) {
    this.size = this.formScale(form); this.baby = proportions[form].baby;
    this.root.name = this.family+'Family-' + form;
    this.root.userData.assetStatus = 'loading'; this.root.userData.sourceReady=false;this.root.userData.form = form; this.root.userData.family = this.family;this.root.userData.variant=options.variant??'mountain';
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
    if(this.family==='Ashscale')this.saddle.scale.set(.9,.85,.95);
    this.update(0, { state: 'idle' });
    void assets.acquire(url).then(asset => {
      if (this.disposed) { asset.release(); return; }
      this.asset = asset; this.motion = this.family==='Ashscale'?new DemonMotion(asset.root,asset.clips):new MountainMotion(asset.root, asset.clips[0]);
      this.motion.update(0,{state:'idle'},this.baby);
      const owned=new Map<Material,Material>();
      asset.root.traverse(node=>{if(node instanceof Mesh){const tint=(material:Material)=>{let local=owned.get(material);if(!local){local=material.clone();owned.set(material,local);this.ownedMaterials.add(local);if('color' in local)(local.color as import('three').Color).setHex(/wing/i.test(material.name)?options.wing??options.body??0xffffff:options.body??0xffffff);}return local;};node.material=Array.isArray(node.material)?node.material.map(tint):tint(node.material);}});
      // The supplied Mountain uses one atlas material for body and membranes.
      // Split instance triangle groups by actual wing skin weights, preserving UVs.
      if(options.body!==undefined&&options.wing!==undefined&&options.body!==options.wing)asset.root.traverse(node=>{
        if(!(node instanceof SkinnedMesh)||Array.isArray(node.material))return;
        const indices=node.geometry.index,skin=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight');if(!indices||!skin||!weights)return;
        const body:number[]=[],wing:number[]=[],amount=(vertex:number)=>{let sum=0;for(let i=0;i<4;i++)if(/Wing[RL]/i.test(node.skeleton.bones[skin.getComponent(vertex,i)]?.name??''))sum+=weights.getComponent(vertex,i);return sum;};
        for(let i=0;i<indices.count;i+=3){const a=indices.getX(i),b=indices.getX(i+1),c=indices.getX(i+2);((amount(a)+amount(b)+amount(c))/3>.35?wing:body).push(a,b,c);}
        if(!wing.length)return;const geometry=node.geometry.clone();geometry.setIndex([...body,...wing]);geometry.clearGroups();geometry.addGroup(0,body.length,0);geometry.addGroup(body.length,wing.length,1);node.geometry=geometry;this.ownedGeometry.add(geometry);
        const membrane=node.material.clone();if('color' in membrane)(membrane.color as import('three').Color).setHex(options.wing!);this.ownedMaterials.add(membrane);node.material=[node.material,membrane];
      });
      asset.root.updateMatrixWorld(true);
      const pelvis = this.bone(this.pelvis).getWorldPosition(new Vector3());
      const feet = this.feet.map(name => this.bone(name).getWorldPosition(new Vector3()));
      asset.root.position.add(new Vector3(-pelvis.x, -Math.min(...feet.map(point => point.y)), -pelvis.z));
      this.frame.scale.setScalar(this.size); this.frame.rotation.y = Math.PI; this.frame.add(asset.root);
      this.root.updateMatrixWorld(true);this.contact=new RigContact(asset.root,this.family==='Ashscale'?/^([rl])_(ankle|toe)/i:undefined);
      this.bounds=new RigBounds(asset.root);
      const seat=this.motion.rig.get(this.family==='Ashscale'?'spine_038_150':'MountainDragon__Spine_04')??this.bone(this.pelvis);
      this.seatFit=new RigSaddle(asset.root,seat,this.root,this.size/this.formScale('Young'));
      asset.root.traverse(node => { if (node instanceof Mesh) { node.castShadow = true; node.receiveShadow = true; node.frustumCulled = true; } });
      this.fallback?.dispose(); this.fallback = undefined;
      this.root.userData.assetStatus = 'ready'; this.root.userData.sourceReady=true;this.root.userData.runtimeAsset = url;
      this.root.userData.motion = 'canonical stopped rest + breath; blended supplied locomotion';
      this.update(0, { state: 'idle' });
    }).catch(error => {
      if (this.disposed) return;
      this.motion?.dispose();this.clearMaterials();this.contact?.clear();this.bounds?.clear(); this.asset?.release(); this.asset = undefined; this.motion = undefined;
      this.seatFit=undefined;
      this.root.userData.assetStatus = 'fallback'; this.onFailure('Dragon model could not load. Temporary visual active. ' + String(error));
    });
  }
  setForm(form: DragonForm): void {
    if (form === this.form) return;
    this.form = form; this.root.userData.form = form; this.root.name = this.family+'Family-' + form;
    this.saddle.visible = form === 'Young';
    if (this.fallback) { this.fallback.dispose(); this.fallback = new ProceduralDragon(form); this.root.add(this.fallback.root); }
  }
  setGrowth(scale:number):void{if(Number.isFinite(scale)){this.growthScale=MathUtils.clamp(scale,1,1.35);this.root.userData.growthScale=this.growthScale;}}
  private bone(name: string) { const bone = this.motion?.rig.get(name); if (!bone) throw new Error('Missing family joint: ' + name); return bone; }
  private get family(){return this.options.family??'Mountain';}
  private get pelvis(){return this.family==='Ashscale'?'pelvis5_218':'MountainDragon__Pelvis_03';}
  private get feet(){return this.family==='Ashscale'?['r_ankle174_173','l_ankle162_161']:['MountainDragon__R_Foot_062','MountainDragon__L_Foot_074'];}
  private formScale(form:DragonForm){return proportions[form].scale*(this.family==='Ashscale'?800:1);}
  private clearMaterials(){for(const material of this.ownedMaterials)material.dispose();this.ownedMaterials.clear();for(const geometry of this.ownedGeometry)geometry.dispose();this.ownedGeometry.clear();}
  update(dt: number, pose: DragonPose): void {
    if (this.disposed) return;
    this.time += dt;
    this.size = MathUtils.damp(this.size, this.formScale(this.form)*(this.form==='Young'?this.growthScale:1), 2.8, dt);
    this.baby = MathUtils.damp(this.baby, proportions[this.form].baby, 2.8, dt);
    if (this.fallback) {
      this.fallback.root.scale.setScalar(this.form==='Young'?this.growthScale:1);this.fallback.update(dt, pose); this.root.updateMatrixWorld(true);
      this.mountAnchor.position.copy(this.root.worldToLocal(this.fallback.mountAnchor.getWorldPosition(this.point)));
      this.carryAnchors[0].position.set(-1, 1, 1); this.carryAnchors[1].position.set(1, 1, 1); return;
    }
    if (!this.motion) return;
    this.motion.update(dt, pose, this.baby);
    const air = this.motion.airborne;
    this.frame.scale.setScalar(this.size); this.frame.rotation.z = -this.motion.bank * .42; this.frame.rotation.x = -this.motion.vertical * .12;
    this.frame.position.y = air * (.3 + Math.sin(this.time * 2.6) * .12);
    this.root.updateMatrixWorld(true);
    if (air < .95) {
      let minFoot = this.contact?.minimum(this.root)??Infinity;
      if(!Number.isFinite(minFoot))for (const name of this.feet) minFoot = Math.min(minFoot, this.root.worldToLocal(this.bone(name).getWorldPosition(this.point)).y);
      this.frame.position.y += (.12 - minFoot) * (1 - air); this.root.updateMatrixWorld(true);
    }
    this.seatFit?.apply(this.mountAnchor,this.root);
    for (const [index, name] of this.feet.entries()) {
      const anchor = this.carryAnchors[index]!;
      anchor.position.copy(this.root.worldToLocal(this.bone(name).getWorldPosition(this.point)));
      anchor.position.y = air > .3 ? anchor.position.y - .7 : .1; anchor.rotation.z = this.frame.rotation.z;
    }
    this.bounds?.update();
  }
  dispose(): void {
    if (this.disposed) return; this.disposed = true;
    this.motion?.dispose(); this.contact?.clear();this.bounds?.clear();this.clearMaterials();this.asset?.release(); this.fallback?.dispose();
    this.seatFit=undefined;
    this.mountAnchor.removeFromParent(); disposeScene(this.saddle); this.root.removeFromParent(); this.root.clear();
  }
}
