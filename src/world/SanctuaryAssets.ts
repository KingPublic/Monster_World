import { Box3, CircleGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, RingGeometry, SRGBColorSpace, TextureLoader, Vector2, Vector3 } from 'three';
import type { Object3D, Texture } from 'three';
import type { AssetInstance, RuntimeAssets } from '../systems/RuntimeAssets';
import type { Sanctuary } from './Sanctuary';
import { cityPaving, updateCitySolid } from './SanctuaryLayout';
import { disposeScene } from '../utils/scene';
import { selectEnvironmentLOD,registerEnvironmentTrunks } from './EnvironmentModels';
import type { WorldCollision } from './WorldCollision';
import {releaseCityFallbacks}from './CityFallbackResources';
const base=import.meta.env.BASE_URL+'assets/';
/** Normalize at the measured ground center, preserving the source proportions. */
function fit(object:Object3D,parent:Group,width:number):void {
 selectEnvironmentLOD(object);
 const bounds=new Box3().setFromObject(object),size=bounds.getSize(new Vector3()),center=bounds.getCenter(new Vector3());
 if(size.x<=0||size.y<=0||size.z<=0)throw new Error('Empty city model bounds');
 object.position.sub(new Vector3(center.x,bounds.min.y,center.z));
 const frame=new Group();frame.scale.setScalar(width/size.x);frame.add(object);parent.add(frame);
 object.traverse(n=>{if(n instanceof Mesh){n.castShadow=true;n.receiveShadow=true;}});
 parent.updateWorldMatrix(true,true);
 if(parent.userData.cityId){const world=new Box3().setFromObject(parent);updateCitySolid(parent.userData.cityId,world.min.toArray(),world.max.toArray());}
}
export class SanctuaryAssets {
 readonly status={buildings:0,market:0,props:0,vegetation:0,roads:false,errors:[] as string[]};
 private disposed=false;private readonly roads=new Group();private readonly instances:AssetInstance[]=[];
 constructor(sanctuary:Sanctuary,assets:RuntimeAssets,collision?:WorldCollision){
  sanctuary.group.add(this.roads);this.roads.name='StonePathway_SelectedStreets';
  const load=(file:string,parent:Group,width:number,kind:'buildings'|'market'|'props'|'vegetation')=>{
   void assets.acquire(base+'models/environment/sanctuary/'+file+'.glb').then(asset=>{
    if(this.disposed){asset.release();return;}
    const fallback=[...parent.children];try{fit(asset.root,parent,width);parent.remove(...fallback);releaseCityFallbacks(sanctuary.group,fallback);if(kind==='vegetation'&&collision)registerEnvironmentTrunks(asset.root,collision);if(parent.userData.cityId){parent.updateWorldMatrix(true,true);const actual=new Box3().setFromObject(parent);updateCitySolid(parent.userData.cityId,actual.min.toArray(),actual.max.toArray());}this.instances.push(asset);this.status[kind]++;}catch(error){asset.release();this.failure(file,error);}
   }).catch(error=>this.failure(file,error));
  };
  for(const b of sanctuary.buildings)load(b.asset,b.group,b.width,b.name==='Food Shop'?'market':'buildings');
  for(const tower of sanctuary.arrivalTowers)load('village-tower',tower,7,'props');
  for(const flag of sanctuary.flags)load('village-flag',flag,3.4,'props');
  for(const tree of sanctuary.trees)load('village-tree',tree.group,tree.width,'vegetation');
  const cart=new Group();cart.position.set(-78,1,36);cart.rotation.y=.3;sanctuary.group.add(cart);load('village-cart',cart,3.5,'props');
  void this.loadRoads();
 }
 private failure(asset:string,error:unknown){if(!this.disposed){this.status.errors.push(asset+': '+String(error));console.warn('[Monster World] Sanctuary asset fallback',asset,error);}}
 private async loadRoads(){const textures:Texture[]=[];try{
  const results=await Promise.allSettled(['albedo','normal','roughness','ao'].map(n=>new TextureLoader().loadAsync(base+'textures/materials/roads/stone-pathway-'+n+'.jpg')));
  for(const result of results)if(result.status==='fulfilled')textures.push(result.value);
  const failure=results.find(r=>r.status==='rejected');if(failure?.status==='rejected')throw failure.reason;
  if(this.disposed){textures.forEach(t=>t.dispose());return;}textures[0]!.colorSpace=SRGBColorSpace;
  // Shared world-space UVs make overlapping street junctions identical, avoiding
  // texture seams and transparent coplanar layering. Insets leave a stone curb.
  const maps=textures.map(t=>{const clone=t.clone();clone.wrapS=clone.wrapT=RepeatWrapping;clone.anisotropy=8;return clone;});
  const material=new MeshStandardMaterial({color:0xd5dccf,map:maps[0],normalMap:maps[1],normalScale:new Vector2(.22,.22),roughnessMap:maps[2],aoMap:maps[3],aoMapIntensity:.35,roughness:1,metalness:0});
  const pave=(geometry:PlaneGeometry|CircleGeometry|RingGeometry,x:number,z:number,y:number)=>{const positions=geometry.getAttribute('position'),uv=geometry.getAttribute('uv');for(let i=0;i<positions.count;i++)uv.setXY(i,(positions.getX(i)+x)/11,(z-positions.getY(i))/11);geometry.setAttribute('uv1',uv.clone());const mesh=new Mesh(geometry,material);mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y+.055,z);mesh.receiveShadow=true;this.roads.add(mesh);};
  for(const r of cityPaving){
   const width=r.width-1.4,depth=r.depth-1.4;
   pave(new PlaneGeometry(width,depth),r.x,r.z,r.y);
  }
  for(const [x,z,radius] of [[0,22,31],[68,20,24],[-62,46,22]]){
   pave(new CircleGeometry(radius!,64),x!,z!,1);
  }
  pave(new RingGeometry(164,180,128),0,0,1);
  this.status.roads=true;textures.forEach(t=>t.dispose());
 }catch(error){textures.forEach(t=>t.dispose());this.failure('road textures',error);}}
 dispose(){this.disposed=true;for(const asset of this.instances)asset.release();this.instances.length=0;disposeScene(this.roads);this.roads.removeFromParent();}
}
