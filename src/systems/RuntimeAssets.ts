import type { AnimationClip, Object3D } from 'three';
import { SkinnedMesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import { disposeScene } from '../utils/scene';
export type AssetTemplate={scene:Object3D;animations:AnimationClip[]};
export interface AssetInstance {root:Object3D;clips:AnimationClip[];release:()=>void;}
/** Templates own shared geometry/materials; instances own cloned bones/skeletons. */
export class RuntimeAssets {
 private readonly templates=new Map<string,Promise<AssetTemplate>>();
 private readonly ready=new Map<string,AssetTemplate>();
 private readonly instances=new Set<AssetInstance>();
 private disposed=false;
 constructor(private readonly load:(url:string)=>Promise<AssetTemplate>=url=>new GLTFLoader().loadAsync(url)){}
 async acquire(url:string):Promise<AssetInstance>{
  if(this.disposed)throw new Error('Asset cache is closed');
  let pending=this.templates.get(url);
  if(!pending){pending=this.load(url).then(template=>{if(this.disposed){disposeScene(template.scene);throw new Error('Asset cache closed during load');}this.ready.set(url,template);return template;}).catch(error=>{this.templates.delete(url);throw error;});this.templates.set(url,pending);}
  const template=await pending;if(this.disposed)throw new Error('Asset cache is closed');
  const root=clone(template.scene);let released=false;
  const instance:AssetInstance={root,clips:template.animations,release:()=>{if(released)return;released=true;root.removeFromParent();root.traverse(node=>{if(node instanceof SkinnedMesh)node.skeleton.dispose();});root.clear();this.instances.delete(instance);}};
  this.instances.add(instance);return instance;
 }
 stats(){return {templates:this.templates.size,instances:this.instances.size,disposed:this.disposed};}
 dispose():void{if(this.disposed)return;this.disposed=true;for(const instance of this.instances)instance.release();for(const template of this.ready.values())disposeScene(template.scene);this.ready.clear();this.templates.clear();}
}
