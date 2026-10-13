import { AnimationClip, AnimationMixer, Box3, Group, LoopRepeat, Mesh, SkinnedMesh, Vector3 } from 'three';
import type { AssetInstance, RuntimeAssets } from '../systems/RuntimeAssets';
import { groundHeight } from './Traversal';
import { Parts, disposeScene } from '../utils/scene';

type Actor = { id: string; url: string; root: Group; height: number; phase: number; mode: 'traveler' | 'guard' | 'horse'; asset?: AssetInstance; mixer?: AnimationMixer; pending: boolean; failed: boolean; };
const base = import.meta.env.BASE_URL + 'assets/';
/** Ambient residents have no services, rewards or interaction rules. */
export class AmbientResidents {
  readonly root = new Group(); readonly status = { ready: 0, errors: [] as string[] };
  private readonly actors: Actor[] = []; private disposed = false; private time = 0;
  constructor(private readonly assets: RuntimeAssets) {
    this.root.name = 'Sanctuary_Residents';
    this.add('garden-traveler', 'models/characters/npc/traveler.glb', 'traveler', 4.9, [-24, 1, 38], .3);
    this.add('market-traveler', 'models/characters/npc/traveler.glb', 'traveler', 4.6, [-55, 1, 58], 2.7);
    this.add('arrival-knight', 'models/characters/npc/knight.glb', 'guard', 5.5, [28, 1, 94], 0);
    this.add('garden-horse', 'models/creatures/ambient/horse.glb', 'horse', 5.2, [-98, 1, 76], 0);
    const p = new Parts();
    for (const [x, z] of [[-108, 68], [-108, 84], [-87, 68], [-87, 84]]) p.add(this.root, 'cylinder', 0x8b6c49, [x!, 2.3, z!], [.2, 2.6, .2]);
    for (const z of [68, 84]) for (const y of [2, 3]) p.add(this.root, 'box', 0x9e7c52, [-97.5, y, z], [21, .18, .18]);
    p.add(this.root, 'box', 0x796145, [-106, 1.4, 77], [2.4, .8, 3.5]);
  }
  private add(id: string, path: string, mode: Actor['mode'], height: number, position: number[], phase: number): void {
    const root = new Group(); root.name = id; root.position.set(position[0]!, position[1]!, position[2]!); this.root.add(root);
    this.actors.push({ id, url: base + path, root, height, phase, mode, pending: false, failed: false });
  }
  private async load(actor: Actor): Promise<void> {
    actor.pending = true;
    try {
      const asset = await this.assets.acquire(actor.url);
      if (this.disposed) { asset.release(); return; }
      asset.root.updateMatrixWorld(true);asset.root.traverse(node=>{if(node instanceof SkinnedMesh)node.computeBoundingBox();});
      const bounds = new Box3().setFromObject(asset.root), size = bounds.getSize(new Vector3()), center = bounds.getCenter(new Vector3());
      if (size.y <= .001) { asset.release(); throw new Error('Empty actor bounds'); }
      const scale = actor.height / size.y;
      const frame=new Group();frame.scale.setScalar(scale);frame.rotation.y=Math.PI;
      asset.root.position.sub(new Vector3(center.x,bounds.min.y,center.z));frame.add(asset.root);actor.root.add(frame);actor.asset=asset;
      asset.root.traverse(node => { if (node instanceof Mesh) { node.castShadow = true; node.receiveShadow = true; node.frustumCulled = false; } });
      const source = actor.mode === 'horse' ? asset.clips.find(clip => /idle/i.test(clip.name)) : asset.clips[0];
      if (source) {
        // Only cloned runtime clips are adjusted. Keep the source montage intact.
        const clip: AnimationClip = source.clone();
        if (actor.mode !== 'guard') {
          actor.mixer = new AnimationMixer(asset.root); actor.mixer.clipAction(clip).setLoop(LoopRepeat, Infinity).setEffectiveTimeScale(actor.mode === 'horse' ? .8 : .75).play();
        } else {
          const sampler = new AnimationMixer(asset.root); sampler.clipAction(clip).play(); sampler.setTime(.5);
          // Keep the reviewed pose; this generic source action is not labelled Idle.
          actor.mixer = sampler; sampler.timeScale = 0;
        }
      }
      this.status.ready++;
    } catch (error) { if (!this.disposed) { actor.failed = true; this.status.errors.push(actor.id + ': ' + String(error)); console.warn('[Monster World] Ambient actor', actor.id, error); } }
  }
  update(dt: number, focus: Vector3): void {
    if (this.disposed) return; this.time += dt;
    for (const actor of this.actors) {
      const distance = actor.root.position.distanceTo(focus);
      if (!actor.pending && !actor.failed && distance < (actor.mode === 'horse' ? 65 : 160)) void this.load(actor);
      if (!actor.asset) continue;
      if (actor.mode === 'traveler') {
        const phase = this.time * .075 + actor.phase;
        const center = actor.id === 'garden-traveler' ? [-24, 31] : [-57, 58];
        actor.root.position.set(center[0]! + Math.sin(phase) * 6, 1, center[1]! + Math.sin(phase * 2) * 4);
        actor.root.rotation.y = Math.atan2(-Math.cos(phase), -Math.cos(phase * 2) * 1.33);
      } else if (actor.mode === 'horse') actor.root.rotation.y = .45;
      else actor.root.rotation.y = -.25 + Math.sin(this.time * .4) * .035;
      actor.root.position.y = groundHeight(actor.root.position.x, actor.root.position.z) + (actor.mode === 'guard' ? Math.sin(this.time * 1.5) * .025 : 0);
      if (distance < 220) actor.mixer?.update(dt);
    }
  }
  dispose(): void {
    if (this.disposed) return; this.disposed = true;
    for (const actor of this.actors) { actor.mixer?.stopAllAction(); if (actor.asset) actor.mixer?.uncacheRoot(actor.asset.root); actor.asset?.release(); }
    disposeScene(this.root); this.root.removeFromParent();
  }
}
