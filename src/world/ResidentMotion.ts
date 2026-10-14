import { AnimationClip, AnimationMixer, Matrix4, SkinnedMesh, Vector3 } from 'three';
import type { Object3D } from 'three';
/** Analyze a cloned runtime take; source timeline and buffers remain untouched. */
export function prepareTravelerMotion(model:Object3D,source:AnimationClip,scale:number) {
 const walk=source.clone(),start=Math.min(...walk.tracks.map(t=>t.times[0]!));
 for(const track of walk.tracks)for(let i=0;i<track.times.length;i++)track.times[i]!-=start;
 walk.resetDuration();
 // In-place takes may still contain a drifting rig control. Extract only its
 // linear horizontal displacement, retaining authored hip sway and bounce.
 let rootDisplacement=0;
 for(const track of walk.tracks){if(!/^(ALL|root|HIPS)/i.test(track.name)||!track.name.endsWith('.position'))continue;const n=track.values.length,dx=track.values[n-3]!-track.values[0]!,dz=track.values[n-1]!-track.values[2]!;rootDisplacement+=Math.hypot(dx,dz)*scale;for(let i=0;i<track.times.length;i++){const f=track.times[i]!/walk.duration;track.values[i*3]!-=dx*f;track.values[i*3+2]!-=dz*f;}}
 const toes=['toeR_31','toeL_34'].map(name=>model.getObjectByName(name)),sampler=new AnimationMixer(model);sampler.clipAction(walk).play();
 const samples:{time:number;feet:Vector3[]}[]=[];
 for(let i=0;i<64;i++){const time=i*walk.duration/64;sampler.setTime(time);model.updateMatrixWorld(true);samples.push({time,feet:toes.filter((n):n is Object3D=>!!n).map(n=>n.getWorldPosition(new Vector3()))});}
 const low=Math.min(...samples.flatMap(s=>s.feet.map(p=>p.y))),velocities:number[]=[];
 let restTime=0,best=Infinity;
 for(let i=0;i<samples.length;i++){const sample=samples[i]!;const score=Math.max(...sample.feet.map(p=>p.y));if(score<best){best=score;restTime=sample.time;}if(!i)continue;const previous=samples[i-1]!;
 for(let f=0;f<sample.feet.length;f++){const a=previous.feet[f]!,b=sample.feet[f]!,v=-(b.z-a.z)*scale/(sample.time-previous.time);if(Math.max(a.y,b.y)<low+.04/scale&&v>.3)velocities.push(v);}}
 velocities.sort((a,b)=>a-b);
 const naturalSpeed=velocities[Math.floor(velocities.length/2)]??1.8;
 const restTracks=walk.tracks.map(track=>{const copy=track.clone(),values=Array.from(track.InterpolantFactoryMethodLinear().evaluate(restTime));copy.times=new Float32Array([0,1]);copy.values=new Float32Array([...values,...values]);return copy;});
 sampler.stopAllAction();sampler.uncacheRoot(model);
 return {walk,rest:new AnimationClip('Traveler planted double support',1,restTracks),naturalSpeed,rootDisplacement,sourceStart:start,restTime};
}
/** Actual foot-weighted sole samples stay on the surface as the rig changes pose. */
export class ResidentContact {
 private readonly samples:{mesh:SkinnedMesh;index:number}[]=[];
 private readonly inverse=new Matrix4();private readonly point=new Vector3();private readonly distances:number[]=[];
 constructor(model:Object3D){model.updateMatrixWorld(true);model.traverse(node=>{if(!(node instanceof SkinnedMesh))return;const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight');if(!indices||!weights)return;const candidates:{index:number;y:number}[][]=[[],[]];
 for(let i=0;i<indices.count;i++){let right=0,left=0;for(let k=0;k<4;k++){const name=node.skeleton.bones[indices.getComponent(i,k)]?.name??'',weight=weights.getComponent(i,k);if(/^(footR|toeR)/.test(name))right+=weight;if(/^(footL|toeL)/.test(name))left+=weight;}if(right+left<.5)continue;node.getVertexPosition(i,this.point).applyMatrix4(node.matrixWorld);candidates[right>=left?0:1]!.push({index:i,y:this.point.y});}
 for(const side of candidates){side.sort((a,b)=>a.y-b.y);for(const sample of side.slice(0,32))this.samples.push({mesh:node,index:sample.index});}});}
 /** Fixed sole indices in actor coordinates; heading and world travel are
  * removed before comparing consecutive gait poses. */
 positions(root:Object3D,target:Vector3[]=[]):Vector3[]{this.inverse.copy(root.matrixWorld).invert();for(let i=0;i<this.samples.length;i++){const {mesh,index}=this.samples[i]!;target[i]??=new Vector3();mesh.getVertexPosition(index,target[i]!).applyMatrix4(mesh.matrixWorld).applyMatrix4(this.inverse);}target.length=this.samples.length;return target;}
 /** The low support sole, not a single cycle median, owns forward travel.
  * Median over fixed contact vertices rejects toe-off outliers; dual support
  * hands over naturally as the newly planted foot approaches the floor. */
 advance(previous:Vector3[],current:Vector3[]):number|undefined{if(!previous.length||previous.length!==current.length)return;let before=Infinity,after=Infinity;for(let i=0;i<current.length;i++){before=Math.min(before,previous[i]!.y);after=Math.min(after,current[i]!.y);}const distances=this.distances;distances.length=0;for(let i=0;i<current.length;i++){const a=previous[i]!,b=current[i]!;if(a.y-before<.015&&b.y-after<.015)distances.push(b.z-a.z);}if(!distances.length)return;distances.sort((a,b)=>a-b);return Math.max(0,distances[Math.floor(distances.length/2)]!);}
 minimum(root:Object3D):number|undefined{if(!this.samples.length)return;this.inverse.copy(root.matrixWorld).invert();let min=Infinity;for(const {mesh,index} of this.samples){mesh.getVertexPosition(index,this.point).applyMatrix4(mesh.matrixWorld).applyMatrix4(this.inverse);min=Math.min(min,this.point.y);}return min;}
}

