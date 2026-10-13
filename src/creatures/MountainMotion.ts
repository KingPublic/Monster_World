import { AnimationClip, AnimationMixer, Bone, MathUtils, Quaternion } from 'three';
import type { AnimationAction, Object3D, Vector3 } from 'three';
import type { DragonPose } from './ProceduralDragon';
import { RigPose } from './RigPose';

const segments = new WeakMap<AnimationClip, AnimationClip[]>();
/** Reviewed montage windows, not separately supplied source actions. */
const windows = [['rest', 2.8, 6.8], ['ground', 48, 50.6], ['air', 28, 30.2]] as const;
export function sampleMontageWindow(source:AnimationClip,name:string,start:number,end:number):AnimationClip {
  const seam=Math.min(.24,(end-start)*.2),qa=new Quaternion(),qb=new Quaternion();
  const tracks=source.tracks.map(original=>{
    const track=original.clone(),evaluate=original.InterpolantFactoryMethodLinear();
    const samples=[start,...Array.from(original.times).filter(t=>t>start&&t<end-seam),end-seam,end-seam*.75,end-seam*.5,end-seam*.25,end];
    const times=Array.from(new Set(samples)).sort((a,b)=>a-b),values:number[]=[],first=Array.from(evaluate.evaluate(start));
    for(const time of times){
      const value=Array.from(evaluate.evaluate(time)),raw=Math.max(0,(time-(end-seam))/seam),blend=raw*raw*(3-2*raw);
      if(track.ValueTypeName==='quaternion'){qa.fromArray(value);qb.fromArray(first);qa.slerp(qb,blend);values.push(...qa.toArray());}
      else values.push(...value.map((v,i)=>MathUtils.lerp(v,first[i]!,blend)));
    }
    track.times=new Float32Array(times.map(t=>t-start));track.values=new Float32Array(values);return track;
  });
  return new AnimationClip(name,end-start,tracks);
}
function gameplayClips(source: AnimationClip): AnimationClip[] {
  let clips = segments.get(source);
  if (!clips) {
    clips = windows.map(([name, start, end]) => {
      const clip = sampleMontageWindow(source, 'Montage-window-' + name, start, end);
      // Physics owns travel and facing; source montage retains original tracks.
      clip.tracks = clip.tracks.filter(track => !/^(root_01|MountainDragon__02|MountainDragon__Pelvis_03)\./.test(track.name));
      return clip;
    });
    segments.set(source, clips);
  }
  return clips;
}

export class MountainMotion {
  readonly rig: RigPose;
  airborne = 0; bank = 0; vertical = 0;
  private time = 0; private ground = 0; private reaction = 0;
  private readonly mixer: AnimationMixer | undefined;
  private readonly actions: AnimationAction[] = [];
  private readonly restScales = new Map<Bone, Vector3>();
  constructor(private readonly model: Object3D, source: AnimationClip | undefined) {
    if (source) {
      const sampler = new AnimationMixer(model);
      sampler.clipAction(source).play(); sampler.setTime(4);
      const rest: { node: Object3D; position: Vector3; rotation: Quaternion; scale: Vector3 }[] = [];
      model.traverse(node => rest.push({ node, position: node.position.clone(), rotation: node.quaternion.clone(), scale: node.scale.clone() }));
      sampler.stopAllAction(); sampler.uncacheRoot(model);
      for (const entry of rest) { entry.node.position.copy(entry.position); entry.node.quaternion.copy(entry.rotation); entry.node.scale.copy(entry.scale); }
      this.mixer = new AnimationMixer(model);
      for (const [i, clip] of gameplayClips(source).entries()) this.actions.push(this.mixer.clipAction(clip).setEffectiveWeight(i === 0 ? 1 : 0).play());
    }
    this.rig = new RigPose(model);
    model.traverse(node => { if (node instanceof Bone) this.restScales.set(node, node.scale.clone()); });
  }
  update(dt: number, pose: DragonPose, baby: number): void {
    const delta = Math.max(0, Math.min(.1, dt)); this.time += delta;
    const inAir = ['flight', 'glide', 'boost', 'takeoff', 'return'].includes(pose.state ?? 'idle');
    this.airborne = MathUtils.damp(this.airborne, inAir ? 1 : 0, 5, delta);
    this.ground = MathUtils.damp(this.ground, pose.state === 'walk' ? Math.min(1, (pose.speed ?? 0) * 2) : 0, 7, delta);
    this.reaction = MathUtils.damp(this.reaction, pose.state === 'alert' || pose.state === 'roar' ? 1 : pose.state === 'eat' ? -.5 : 0, 4, delta);
    this.bank = MathUtils.damp(this.bank, pose.bank ?? 0, 6, delta);
    this.vertical = MathUtils.damp(this.vertical, pose.vertical ?? 0, 4, delta);
    if (this.mixer) {
      const air = this.airborne, walk = this.ground * (1 - air);
      this.actions[0]!.setEffectiveWeight(1 - air - walk);
      this.actions[1]!.setEffectiveWeight(walk).setEffectiveTimeScale(.75 + (pose.speed ?? 0) * .7);
      this.actions[2]!.setEffectiveWeight(air).setEffectiveTimeScale(pose.state === 'boost' ? 1.35 : pose.state === 'glide' ? .4 : .85);
      this.mixer.update(delta);
    } else this.rig.reset();
    const breathe = Math.sin(this.time * 1.8), sway = Math.sin(this.time * .65);
    this.rig.add('MountainDragon__Spine1_05', breathe * .012 - this.vertical * .045, this.bank * -.06);
    for (let i = 0; i < 4; i++) this.rig.add(`MountainDragon__Neck${i === 0 ? '' : i}_0${6 + i}`, -this.reaction * .07 + breathe * .004, sway * .01 - this.bank * .02);
    this.rig.add('MountainDragon__Head_010', -this.reaction * .12 + Math.sin(this.time * 1.1) * .025, sway * (.035 + baby * .04));
    for (let i = 0; i < 9; i++) this.rig.add(`MountainDragon__Tail${i === 0 ? '' : i}_0${83 + i}`, .012*(1-this.airborne)+.01*Math.sin(this.time * 1.5 - i * .35), Math.sin(this.time * 1.25 - i * .4) * (.018 + i * .002) - this.bank * .025);
    for (const [side, sign] of [['R', 1], ['L', -1]] as const) {
      this.rig.add(`MountainDragon_Wing${side}_Arm_0${side === 'R' ? '12' : '24'}`, 0, sign * this.bank * .04, sign * Math.sin(this.time * 2.8) * .035 * (1 - this.airborne));
      this.rig.add(`MountainDragon_Wing${side}_ForeArm_0${side === 'R' ? '13' : '25'}`, 0, 0, sign * this.vertical * .05);
    }
    // Juvenile proportions differ anatomically and blend during growth.
    for (const [bone, scale] of this.restScales) {
      const name = bone.name; let factor = 1;
      if (name === 'MountainDragon__Head_010') factor = 1 + baby * .52;
      else if (/Wing[RL]_Arm_/.test(name)) factor = 1 - baby * .33;
      else if (name === 'MountainDragon__Tail_083') factor = 1 - baby * .24;
      bone.scale.copy(scale).multiplyScalar(factor);
    }
  }
  dispose(): void { this.mixer?.stopAllAction(); this.mixer?.uncacheRoot(this.model); }
}
