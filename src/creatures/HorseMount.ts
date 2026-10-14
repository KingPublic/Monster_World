import { AnimationMixer,Box3,Group,LoopRepeat,MathUtils,Mesh,SkinnedMesh,Vector3 } from 'three';
import type { AnimationAction,Object3D } from 'three';
import type { AssetInstance,RuntimeAssets } from '../systems/RuntimeAssets';
import { RigBounds } from './RigBounds';
import { HorseGait } from './HorseGait';
import { disposeScene,Parts } from '../utils/scene';

export const horseHome = [-98,1,76] as const;
export const horseAssetURL=(import.meta.env.BASE_URL??'/')+'assets/models/creatures/ambient/horse.glb';
type HorsePose={speed:number;airborne:boolean;vertical:number;};
/** One user-requested grounded mount; no Dragon flight/upgrades or paid service. */
export class HorseMount {
  readonly root=new Group();readonly mountAnchor=new Group();readonly carryAnchors=[new Group(),new Group()] as const;
  readonly status={state:'loading',source:horseAssetURL,error:'',clips:[] as string[]};
  private readonly frame=new Group();private readonly fallback=new Group();private readonly point=new Vector3();
  private asset:AssetInstance|undefined;private mixer:AnimationMixer|undefined;private idle:AnimationAction|undefined;private walk:AnimationAction|undefined;
  private bounds:RigBounds|undefined;private saddle:Object3D|undefined;private contact:HorseSoles|undefined;private pending:Promise<void>|undefined;
  private gait:HorseGait|undefined;
  private move=0;private gallop=0;private disposed=false;
  constructor(private readonly assets:RuntimeAssets,private readonly onFailure:(message:string)=>void,private readonly floor:(x:number,z:number)=>number=()=>0){
    this.root.name='SanctuaryRidingHorse';this.root.position.set(...horseHome);this.root.rotation.y=.45;this.root.add(this.frame,this.mountAnchor,...this.carryAnchors,this.fallback);
    this.mountAnchor.position.set(0,3.6,0);this.carryAnchors[0].position.set(1.1,2.2,.4);this.carryAnchors[1].position.set(-1.1,2.2,.4);
    const p=new Parts();p.add(this.fallback,'sphere',0x8b7865,[0,2.6,.3],[1.1,1.1,2.4]);p.add(this.fallback,'sphere',0x8b7865,[0,3.9,-2],[.7,.7,1]);
    for(const x of [-.65,.65])for(const z of [-1.2,1.6])p.add(this.fallback,'cylinder',0x665449,[x,1,z],[.18,2,.18]);p.add(this.fallback,'sphere',0x554034,[0,3.55,.2],[1,.13,1.3]);
  }
  load():Promise<void>{
    if(this.pending)return this.pending;
    this.pending=this.assets.acquire(horseAssetURL).then(asset=>{
      if(this.disposed){asset.release();return;}this.asset=asset;
      this.mixer=new AnimationMixer(asset.root);
      const clips=asset.clips.map(original=>{const clip=original.clone(),start=Math.min(...clip.tracks.map(t=>t.times[0]??0));
        for(const track of clip.tracks)for(let i=0;i<track.times.length;i++)track.times[i]!-=start;clip.resetDuration();
        // Keep the actual canonical bind/root; only local anatomy animates.
        clip.tracks=clip.tracks.filter(t=>!/^(Horse|root)\.(position|quaternion|scale)$/.test(t.name));return clip;
      });
      const idle=clips.find(c=>/Idle/i.test(c.name)),walk=clips.find(c=>/Walk/i.test(c.name));if(!idle||!walk)throw new Error('Horse demo requires its actual Idle and Walk clips');
      this.idle=this.mixer.clipAction(idle).setLoop(LoopRepeat,Infinity).play();this.walk=this.mixer.clipAction(walk).setLoop(LoopRepeat,Infinity).setEffectiveWeight(0).play();this.mixer.setTime(.5);
      asset.root.updateMatrixWorld(true);const box=new Box3().setFromObject(asset.root,true),size=box.getSize(new Vector3()),center=box.getCenter(new Vector3());if(size.y<.001)throw new Error('Empty horse bounds');
      const centered=new Group();centered.position.set(-center.x,-box.min.y,-center.z);centered.add(asset.root);this.frame.add(centered);this.frame.scale.setScalar(5.2/size.y);this.frame.rotation.y=Math.PI;
      this.saddle=asset.root.getObjectByName('saddle');if(!this.saddle)throw new Error('Missing verified Horse saddle joint');
      asset.root.traverse(node=>{if(node instanceof Mesh){node.castShadow=true;node.receiveShadow=true;}});this.root.updateMatrixWorld(true);this.contact=new HorseSoles(asset.root);this.bounds=new RigBounds(asset.root);
      this.update(0,this.root.position,{speed:0,airborne:false,vertical:0});this.gait=new HorseGait(asset.root,this.root,this.frame,this.floor);
      disposeScene(this.fallback);this.fallback.removeFromParent();this.status.state='ready';this.status.clips=clips.map(c=>c.name);this.root.userData.assetStatus='ready';
    }).catch(error=>{this.mixer?.stopAllAction();if(this.asset)this.mixer?.uncacheRoot(this.asset.root);this.asset?.release();this.asset=undefined;this.frame.clear();this.bounds?.clear();this.contact?.clear();if(!this.disposed){this.status.state='fallback';this.status.error=String(error);this.onFailure('Horse model could not load. Temporary riding visual active.');}});
    return this.pending;
  }
  update(dt:number,focus:Vector3,pose:HorsePose):void{
    if(this.disposed)return;if(!this.pending&&this.root.position.distanceTo(focus)<90)void this.load();if(!this.asset||!this.mixer)return;
    this.gait?.restore();this.gallop=MathUtils.damp(this.gallop,MathUtils.smoothstep(pose.speed,5,10),10,dt);const gallop=this.gallop;
    this.move=MathUtils.damp(this.move,pose.speed>.1?1:0,9,dt);this.idle!.paused=pose.speed<.1||gallop>.01;if(this.idle!.paused)this.idle!.time=.5;
    this.idle!.setEffectiveWeight(1-this.move*(1-gallop));this.walk!.setEffectiveWeight(this.move*(1-gallop));
    // Low-speed Walk uses measured ~3 units/s. Higher speed uses authored
    // world-planted gallop on this rig, not an invented supplied Run clip.
    this.walk!.setEffectiveTimeScale(MathUtils.clamp(pose.speed/3,.15,3.4));this.mixer.update(Math.max(0,dt));
    this.frame.rotation.x=pose.airborne?MathUtils.clamp(-pose.vertical*.009,-.14,.14):0;this.frame.position.y=0;this.root.updateMatrixWorld(true);
    if(!pose.airborne){const minimum=this.contact?.minimum(this.root);if(minimum!==undefined)this.frame.position.y+=.06-minimum;this.root.updateMatrixWorld(true);}
    this.gait?.update(dt,pose.speed,pose.airborne,gallop);
    if(this.saddle){this.mountAnchor.position.copy(this.root.worldToLocal(this.saddle.getWorldPosition(this.point))).add(this.point.set(0,.08,0));this.mountAnchor.rotation.x=this.frame.rotation.x;for(const [i,anchor]of this.carryAnchors.entries())anchor.position.copy(this.mountAnchor.position).add(this.point.set(i===0?1.1:-1.1,-1.6,.4));}
    this.bounds?.update();
  }
  dispose():void{if(this.disposed)return;this.disposed=true;this.gait?.dispose();this.mixer?.stopAllAction();if(this.asset)this.mixer?.uncacheRoot(this.asset.root);this.bounds?.clear();this.contact?.clear();this.asset?.release();disposeScene(this.fallback);this.root.removeFromParent();this.root.clear();}
}

/** Actual hoof vertices, balanced across all four stance limbs. */
class HorseSoles {
  private readonly samples:{mesh:SkinnedMesh;index:number}[]=[];private readonly point=new Vector3();
  constructor(model:Object3D){model.traverse(node=>{if(!(node instanceof SkinnedMesh))return;const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight');if(!indices||!weights)return;
    const bins=new Map<string,{index:number;y:number}[]>();for(let i=0;i<indices.count;i++){const amounts=new Map<string,number>();for(let j=0;j<4;j++){const name=node.skeleton.bones[indices.getComponent(i,j)]?.name??'',side=name.match(/_(l|r)(?:_|$)/)?.[1];if(side&&/^(hand|fingers|foot|toes)_/.test(name)){const group=(/^(hand|fingers)_/.test(name)?'front':'back')+side;amounts.set(group,(amounts.get(group)??0)+weights.getComponent(i,j));}}
      const winner=[...amounts].sort((a,b)=>b[1]-a[1])[0];if(!winner||winner[1]<.45)continue;node.getVertexPosition(i,this.point).applyMatrix4(node.matrixWorld);const bin=bins.get(winner[0])??[];bin.push({index:i,y:this.point.y});bins.set(winner[0],bin);
    }for(const bin of bins.values()){bin.sort((a,b)=>a.y-b.y);for(const sample of bin.slice(0,24))this.samples.push({mesh:node,index:sample.index});}
  });}
  minimum(root:Group):number|undefined{if(!this.samples.length)return undefined;let min=Infinity;for(const {mesh,index}of this.samples){mesh.getVertexPosition(index,this.point).applyMatrix4(mesh.matrixWorld);root.worldToLocal(this.point);min=Math.min(min,this.point.y);}return min;}
  clear():void{this.samples.length=0;}
}
