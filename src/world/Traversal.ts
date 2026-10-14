import { gameConfig } from '../config/gameConfig';
import { terrainHeight } from './Environment';
import { cityGroundHeight, citySolids } from './SanctuaryLayout';
import { WorldCollision, worldCollision } from './WorldCollision';
import type { CollisionBody, CollisionPoint, CollisionQuery, CollisionResult } from './WorldCollision';
let activeCollision=worldCollision;
export function useTraversalCollision(collision:WorldCollision):void{activeCollision=collision;}
export function releaseTraversalCollision(collision:WorldCollision):void{if(activeCollision===collision)activeCollision=worldCollision;}
const clamp01=(v:number):number=>Math.max(0,Math.min(1,v));
/** Foot/landing surface; the original distant nest aprons remain unchanged. */
export function groundHeight(x:number,z:number):number {
 const height=Math.max(terrainHeight(x,z),cityGroundHeight(x,z));
 for(const marker of gameConfig.nestMarkers){
  const dx=x-marker.position[0],dz=z-marker.position[2],distance=Math.hypot(dx,dz);
  if(distance>=82)continue;if(distance<=29)return marker.position[1]+5;
  const outerX=marker.position[0]+dx/distance*82,outerZ=marker.position[2]+dz/distance*82;
  const outerHeight=terrainHeight(outerX,outerZ),progress=clamp01((82-distance)/53),blend=progress*progress*(3-2*progress);
  return outerHeight+(marker.position[1]+5-outerHeight)*blend;
 }return height;
}
export function isBlocked(x:number,z:number,query?:Partial<CollisionQuery>):boolean {
 const floor=groundHeight(x,z);
 return activeCollision.isBlocked(x,z,{radius:query?.radius,minY:query?.minY??floor+.05,maxY:query?.maxY??floor+3},citySolids);
}
/** Continuous sweep; height offsets follow the actor root, so flight can clear roofs. */
export function resolveTraversalMovement(from:CollisionPoint,to:CollisionPoint,body:CollisionBody={}):CollisionResult {
 return activeCollision.resolveMovement(from,to,body,citySolids);
}
