import { gameConfig } from '../config/gameConfig';
import { terrainHeight } from './Environment';
import { cityGroundHeight, citySolids } from './SanctuaryLayout';
const collisionRadius=.75;
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
export function isBlocked(x:number,z:number):boolean {
 return citySolids.some(s=>Math.abs(x-s.x)<s.halfX+collisionRadius&&Math.abs(z-s.z)<s.halfZ+collisionRadius);
}
