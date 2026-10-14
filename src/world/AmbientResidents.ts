import { AnimationMixer, Box3, Group, LoopRepeat, Mesh, SkinnedMesh, Vector3 } from 'three';
import type { AnimationAction, Material } from 'three';
import type { AssetInstance, RuntimeAssets } from '../systems/RuntimeAssets';
import { groundHeight, isBlocked } from './Traversal';
import { Parts, disposeScene } from '../utils/scene';
import { prepareTravelerMotion, ResidentContact } from './ResidentMotion';
import { residentCatalog, residentLimits } from './ResidentCatalog';
import type { ResidentDefinition } from './ResidentCatalog';
import { RigBounds } from '../creatures/RigBounds';
import { batchStaticScene } from '../utils/batchStaticScene';
type Actor={id:string;definition:ResidentDefinition;url:string;root:Group;height:number;mode:'traveler'|'guard';asset?:AssetInstance;mixer?:AnimationMixer;walk?:AnimationAction;rest?:AnimationAction;frame?:Group;contact?:ResidentContact;bounds?:RigBounds;fallback?:Group;materials:Set<Material>;soleBefore:Vector3[];soleAfter:Vector3[];speed:number;naturalSpeed:number;route:readonly (readonly [number,number])[];target:number;pause:number;resting:boolean;pending:boolean;failed:boolean;talking:boolean};
const base=import.meta.env.BASE_URL+'assets/';
/** Existing source rigs inhabit routes; conversations grant no progression. */
export class AmbientResidents {
 readonly root=new Group();readonly status={ready:0,total:residentCatalog.length,active:0,errors:[] as string[]};
 private readonly actors:Actor[]=[];private disposed=false;
 constructor(private readonly assets:RuntimeAssets,private readonly maxActive:number=residentLimits.maxActive){
 this.root.name='Sanctuary_Residents';
 // Separate garden/market footpaths, clear of the fountain, facades and the
 // central arrival/collection paths. Endpoints leave room to stop and turn.
 for(const definition of residentCatalog){this.add(definition);if(definition.camp)this.camp(definition);}
 // Horse is owned by the grounded mount controller; the pen remains scenery.
 const p=new Parts();for(const [x,z]of [[-108,68],[-108,84],[-87,68],[-87,84]])p.add(this.root,'cylinder',0x8b6c49,[x!,2.3,z!],[.2,2.6,.2]);
 for(const z of [68,84])for(const y of [2,3])p.add(this.root,'box',0x9e7c52,[-97.5,y,z],[21,.18,.18]);p.add(this.root,'box',0x796145,[-106,1.4,77],[2.4,.8,3.5]);
 }
 private add(definition:ResidentDefinition):void{const {id,height,route,pause}=definition,root=new Group(),mode=definition.model==='knight'?'guard':'traveler';root.name=id;root.position.set(route[0]![0],groundHeight(...route[0]!),route[0]![1]);root.rotation.y=definition.heading??Math.atan2(-((route[1]?.[0]??route[0]![0])-route[0]![0]),-((route[1]?.[1]??route[0]![1])-route[0]![1]));this.root.add(root);this.actors.push({id,definition,url:base+'models/characters/npc/'+definition.model+'.glb',root,height,mode,route,target:route.length>1?1:0,pause,resting:pause>0||route.length===1,soleBefore:[],soleAfter:[],materials:new Set(),speed:0,naturalSpeed:0,pending:false,failed:false,talking:false});}
 private camp(definition:ResidentDefinition):void{
  const [x,z]=definition.route[0]!,p=new Parts(),group=p.group(this.root,'WayfarerCamp_'+definition.nestId,x,groundHeight(x,z),z);
  // Equipment sits behind the guide, outside the trail and conversational apron.
  p.add(group,'box',0x8d7754,[0,.07,4.5],[7,.14,5]);
  for(const dx of [-2.5,2.5])p.add(group,'cylinder',0x705744,[dx,2.8,5.5],[.12,5.6,.12]);
  const cover=p.add(group,'box',0x65817b,[0,5.35,5.5],[6,.1,4]);cover.rotation.x=.1;
  p.add(group,'box',0x816347,[-2,.7,5.5],[1.8,1.4,1.6]);p.add(group,'box',0xbeb18b,[1.6,.3,5.3],[2.2,.6,1.2]);
  p.add(group,'cylinder',0x836b49,[3.8,2.5,0],[.13,5,.13]);p.add(group,'box',0xe1b967,[3.8,3.9,0],[1.2,1.3,1.2]);p.add(group,'cone',0x506461,[3.8,4.8,0],[.85,.6,.85]);
  batchStaticScene(group,new Set());
 }
 private fallback(actor:Actor):void{if(actor.fallback)return;const p=new Parts(),g=new Group(),h=actor.height;g.name='TemporaryResident';p.add(g,'sphere',0xd3b496,[0,h*.84,0],[.46,.53,.42]);p.add(g,'box',actor.definition.role==='guard'?0x78858a:0x697b69,[0,h*.51,0],[1.35,h*.37,.8]);for(const side of [-1,1]){p.add(g,'box',0x716858,[side*.32,h*.18,0],[.48,h*.35,.65]);p.add(g,'box',0x9c8765,[side*.88,h*.48,0],[.3,h*.30,.4]);}actor.root.add(g);actor.fallback=g;}
 private clearActor(actor:Actor):void{actor.mixer?.stopAllAction();if(actor.asset)actor.mixer?.uncacheRoot(actor.asset.root);actor.contact=undefined;actor.bounds?.clear();actor.bounds=undefined;actor.asset?.release();actor.asset=undefined;actor.frame?.removeFromParent();actor.frame=undefined;actor.mixer=undefined;actor.walk=undefined;actor.rest=undefined;for(const material of actor.materials)material.dispose();actor.materials.clear();if(actor.fallback){disposeScene(actor.fallback);actor.fallback.removeFromParent();actor.fallback=undefined;}actor.pending=false;}
 private async load(actor:Actor):Promise<void>{actor.pending=true;try{const asset=await this.assets.acquire(actor.url);if(this.disposed){asset.release();return;}actor.asset=asset;
 asset.root.updateMatrixWorld(true);asset.root.traverse(n=>{if(n instanceof SkinnedMesh)n.computeBoundingBox();});const bounds=new Box3().setFromObject(asset.root),size=bounds.getSize(new Vector3()),center=bounds.getCenter(new Vector3());if(size.y<=.001)throw new Error('Empty actor bounds');const scale=actor.height/size.y;
 const motion=actor.mode==='traveler'&&asset.clips.find(c=>/^Walk$/i.test(c.name));const prepared=motion?prepareTravelerMotion(asset.root,motion,scale):undefined;
 const frame=new Group();frame.scale.setScalar(scale);frame.rotation.y=Math.PI;asset.root.position.sub(new Vector3(center.x,bounds.min.y,center.z));frame.add(asset.root);actor.root.add(frame);actor.frame=frame;
 asset.root.traverse(n=>{if(n instanceof Mesh){n.castShadow=true;n.receiveShadow=true;n.frustumCulled=false;}});
 if(actor.definition.tint!==0xffffff){const cloned=new Map<Material,Material>();asset.root.traverse(n=>{if(!(n instanceof Mesh))return;const tint=(m:Material)=>{let local=cloned.get(m);if(!local){local=m.clone();cloned.set(m,local);actor.materials.add(local);if('color' in local)(local.color as import('three').Color).setHex(actor.definition.tint);}return local;};n.material=Array.isArray(n.material)?n.material.map(tint):tint(n.material);});}
 actor.bounds=new RigBounds(asset.root);if(actor.fallback){disposeScene(actor.fallback);actor.fallback.removeFromParent();actor.fallback=undefined;}
 if(prepared){actor.mixer=new AnimationMixer(asset.root);actor.walk=actor.mixer.clipAction(prepared.walk).setLoop(LoopRepeat,Infinity);actor.rest=actor.mixer.clipAction(prepared.rest).play();actor.rest.setEffectiveWeight(actor.resting?1:0);actor.walk.setEffectiveWeight(actor.resting?0:1).play();actor.naturalSpeed=prepared.naturalSpeed;actor.speed=prepared.naturalSpeed*.75;
 actor.speed=prepared.naturalSpeed*(actor.definition.pace??.75);actor.root.userData.motion={sourceStart:prepared.sourceStart,cycle:prepared.walk.duration,naturalSpeed:prepared.naturalSpeed,rootDisplacement:prepared.rootDisplacement,restTime:prepared.restTime,travelDriver:'phase support sole'};actor.mixer.update(0);actor.contact=new ResidentContact(asset.root);
 }else if(actor.mode==='traveler')throw new Error('Traveler has no verified Walk clip');else if(asset.clips[0]){actor.mixer=new AnimationMixer(asset.root);actor.mixer.clipAction(asset.clips[0].clone()).play();actor.mixer.setTime(.5);actor.mixer.timeScale=0;}
 }catch(error){this.clearActor(actor);if(!this.disposed){actor.failed=true;this.fallback(actor);this.status.errors.push(actor.id+': '+String(error));console.warn('[Monster World] Ambient actor',actor.id,error);}}}
 nearest(focus:Vector3){return this.actors.filter(a=>(a.asset||a.fallback)&&a.root.visible&&focus.distanceTo(a.root.position)<residentLimits.talk).sort((a,b)=>focus.distanceTo(a.root.position)-focus.distanceTo(b.root.position))[0]?.definition;}
 beginTalk(id:string,focus:Vector3):boolean{const actor=this.actors.find(a=>a.id===id);if(!actor||actor.root.position.distanceTo(focus)>residentLimits.talk)return false;this.endTalk();actor.talking=true;actor.root.rotation.y=Math.atan2(-(focus.x-actor.root.position.x),-(focus.z-actor.root.position.z));return true;}
 endTalk():void{for(const a of this.actors)if(a.talking){a.talking=false;if(a.route.length>1)a.pause=.6;}}
 bodyBlocked(x:number,z:number):boolean{return this.actors.some(a=>(a.asset||a.fallback)&&a.root.visible&&Math.hypot(x-a.root.position.x,z-a.root.position.z)<1.15);}
 update(dt:number,focus:Vector3):void{if(this.disposed||!Number.isFinite(dt)||dt<0)return;
 for(const actor of this.actors)if(actor.asset&&actor.root.position.distanceTo(focus)>residentLimits.unload&&!actor.talking)this.clearActor(actor);
 const candidates=this.actors.filter(a=>!a.pending&&!a.failed&&a.root.position.distanceTo(focus)<residentLimits.load).sort((a,b)=>a.root.position.distanceTo(focus)-b.root.position.distanceTo(focus));
 let active=this.actors.filter(a=>a.pending).length;for(const actor of candidates){if(active>=this.maxActive)break;void this.load(actor);active++;}
 for(const actor of this.actors){const distance=actor.root.position.distanceTo(focus);actor.root.visible=distance<residentLimits.draw;if(!actor.asset||distance>residentLimits.draw)continue;
 let moved=0;if(actor.mode==='traveler'){
 const roaming=actor.route.length>1&&!actor.talking,walking=roaming&&actor.pause<=0&&dt>0,oldPhase=actor.walk!.time;
 if(roaming&&!walking&&actor.pause>0){actor.pause=Math.max(0,actor.pause-dt);if(actor.pause<=.6){const point=actor.route[actor.target]!,heading=Math.atan2(-(point[0]-actor.root.position.x),-(point[1]-actor.root.position.z)),difference=Math.atan2(Math.sin(heading-actor.root.rotation.y),Math.cos(heading-actor.root.rotation.y));actor.root.rotation.y+=Math.sign(difference)*Math.min(Math.abs(difference),Math.PI*dt/.6);}}
 const resting=!walking;if(resting!==actor.resting){actor.resting=resting;const active=resting?actor.rest!:actor.walk!,previous=resting?actor.walk!:actor.rest!;active.reset().setEffectiveWeight(1).play();previous.crossFadeTo(active,.2,false);}
 // Sample both actual gait poses. Root distance cancels the horizontal change
 // of the grounded sole points, which varies substantially through Walk.
 actor.root.updateWorldMatrix(true,true);const before=actor.contact!.positions(actor.root,actor.soleBefore);
 actor.walk!.setEffectiveTimeScale(walking?(actor.definition.pace??.75):0);actor.mixer?.update(dt);actor.root.updateWorldMatrix(true,true);
 if(walking){const after=actor.contact!.positions(actor.root,actor.soleAfter),point=actor.route[actor.target]!,dx=point[0]-actor.root.position.x,dz=point[1]-actor.root.position.z,length=Math.hypot(dx,dz);
 moved=Math.min(actor.contact!.advance(before,after)??actor.speed*dt,length);const fraction=length>1e-7?moved/length:0,x=actor.root.position.x+dx*fraction,z=actor.root.position.z+dz*fraction;
 if(length>1e-7&&!isBlocked(x,z)&&Math.hypot(x-focus.x,z-focus.z)>1.8){actor.root.position.x=x;actor.root.position.z=z;const heading=Math.atan2(-dx,-dz),difference=Math.atan2(Math.sin(heading-actor.root.rotation.y),Math.cos(heading-actor.root.rotation.y));actor.root.rotation.y+=difference*Math.min(1,dt*8);}else {moved=0;actor.walk!.time=oldPhase;actor.mixer?.update(0);}
 if(length-moved<1e-6){actor.target=(actor.target+1)%actor.route.length;actor.pause=actor.definition.pace===undefined?1.8:1.2+actor.definition.pause%2.4;}}
 actor.root.userData.locomotion={state:resting?(actor.pause>0&&actor.pause<=.6?'turn':'rest'):'walk',speed:dt>0?moved/dt:0,phase:actor.walk!.time,pause:actor.pause,target:actor.target};
 }

 actor.root.position.y=groundHeight(actor.root.position.x,actor.root.position.z);
 if(actor.contact&&actor.frame){this.root.updateMatrixWorld(true);const min=actor.contact.minimum(actor.root);if(min!==undefined)actor.frame.position.y-=min;}
 actor.bounds?.update();}this.status.ready=this.actors.filter(a=>!!a.asset).length;this.status.active=this.actors.filter(a=>a.pending).length;}
 /** Read-only diagnostics for the existing development snapshot. */
 snapshot(){return this.actors.map(a=>({id:a.id,name:a.definition.name,role:a.definition.role,position:a.root.position.toArray(),heading:a.root.rotation.y,loaded:!!a.asset,failed:a.failed,talking:a.talking,...a.root.userData.motion,...a.root.userData.locomotion}));}
 dispose():void{if(this.disposed)return;this.disposed=true;for(const actor of this.actors)this.clearActor(actor);disposeScene(this.root);this.root.removeFromParent();}
}
