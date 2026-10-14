import { AnimationClip, AnimationMixer, Bone, MathUtils } from 'three';
import type { AnimationAction, Object3D, Quaternion, Vector3 } from 'three';
import type { DragonPose } from './ProceduralDragon';
import { RigPose } from './RigPose';

export class DemonMotion {
 readonly rig:RigPose; airborne=0;bank=0;vertical=0;
 private readonly mixer:AnimationMixer;private readonly actions:AnimationAction[]=[];
 private time=0;private ground=0;private reaction=0;
 private readonly scales=new Map<Bone,Vector3>();
 constructor(private readonly model:Object3D,clips:AnimationClip[]){
  const idle=clips.find(c=>/idle/i.test(c.name)),run=clips.find(c=>/running/i.test(c.name)),fly=clips.find(c=>/flying/i.test(c.name));
  if(!idle||!run||!fly)throw new Error('Ashscale requires its supplied idle, running and flying actions');
  const sample=new AnimationMixer(model);sample.clipAction(idle).play();sample.setTime(1);
  const rest:{node:Object3D;p:Vector3;q:Quaternion;s:Vector3}[]=[];
  model.traverse(node=>rest.push({node,p:node.position.clone(),q:node.quaternion.clone(),s:node.scale.clone()}));sample.stopAllAction();sample.uncacheRoot(model);
  for(const r of rest){r.node.position.copy(r.p);r.node.quaternion.copy(r.q);r.node.scale.copy(r.s);}
  this.rig=new RigPose(model);this.mixer=new AnimationMixer(model);
  for(const [i,source] of [idle,run,fly].entries()){
   const clip=source.clone();
   // Physics owns root/facing and source pelvis travel, including model wrappers.
   clip.tracks=clip.tracks.filter(t=>!(/^(root|GLTF_created|Sketchfab|Armature)/i.test(t.name)));
   for(const track of clip.tracks)if(/^pelvis.*\.position$/i.test(track.name)){
    const restTrack=idle.tracks.find(t=>t.name===track.name),value=restTrack?.InterpolantFactoryMethodLinear().evaluate(1);
    if(value)for(let k=0;k<track.values.length;k+=3){track.values[k]=value[0]!;track.values[k+2]=value[2]!;}
   }
   if(i===0){for(const t of clip.tracks){const value=Array.from(t.InterpolantFactoryMethodLinear().evaluate(1));t.times=new Float32Array([0,1]);t.values=new Float32Array([...value,...value]);}clip.duration=1;}
   this.actions.push(this.mixer.clipAction(clip).setEffectiveWeight(i===0?1:0).play());
  }
  model.traverse(node=>{if(node instanceof Bone)this.scales.set(node,node.scale.clone());});
 }
 update(dt:number,pose:DragonPose,baby:number){
  this.rig.clearLayers();
  const delta=Math.max(0,Math.min(.1,dt));this.time+=delta;
  const inAir=['flight','glide','boost','takeoff','return'].includes(pose.state??'idle');
  this.airborne=MathUtils.damp(this.airborne,inAir?1:0,5,delta);this.ground=MathUtils.damp(this.ground,pose.state==='walk'?Math.min(1,(pose.speed??0)*2):0,7,delta);
  this.bank=MathUtils.damp(this.bank,pose.bank??0,6,delta);this.vertical=MathUtils.damp(this.vertical,pose.vertical??0,4,delta);
  this.reaction=MathUtils.damp(this.reaction,pose.state==='alert'||pose.state==='roar'?1:pose.state==='eat'?-.4:0,4,delta);
  const walk=this.ground*(1-this.airborne);this.actions[0]!.setEffectiveWeight(1-this.airborne-walk);
  this.actions[1]!.setEffectiveWeight(walk).setEffectiveTimeScale(.55+(pose.speed??0)*.65);
  this.actions[2]!.setEffectiveWeight(this.airborne).setEffectiveTimeScale(pose.state==='boost'?1.25:pose.state==='glide'?.35:.8);this.mixer.update(delta);
  this.rig.add('spine_038_150',Math.sin(this.time*1.5)*.008-this.vertical*.03);
  this.rig.add('head25_21',-this.reaction*.12,Math.sin(this.time*.6)*.009-this.bank*.03);
  this.rig.add('tail_01183_213',.10*(1-this.airborne));
  for(const [bone,rest] of this.scales){const factor=/^head25/.test(bone.name)?1+baby*.38:/^(l|r)_upperArm/i.test(bone.name)?1-baby*.22:/^tail_01183/.test(bone.name)?1-baby*.2:1;bone.scale.copy(rest).multiplyScalar(factor);}
 }
 dispose(){this.mixer.stopAllAction();this.mixer.uncacheRoot(this.model);}
}
