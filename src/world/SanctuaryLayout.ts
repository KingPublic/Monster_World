import type { Position } from '../config/gameConfig';
/** Shared by scenery, services, collision and camera obstruction. */
export const sanctuaryServices = {
 hatchery:[0,6,-67] as Position, shop:[-62,1,48] as Position,
 collection:[-62,1,-27] as Position, rider:[74,1,-26] as Position, mount:[68,1,20] as Position,
};
export const cityFoundation={radius:210,apronRadius:235,height:1};
export const upperCourt={height:6,outline:[[-34,-118],[34,-118],[40,-108],[40,-65],[28,-53],[14,-53],[14,-62],[-14,-62],[-14,-53],[-28,-53],[-40,-65],[-40,-108]] as readonly (readonly [number,number])[]};
export const hatcheryStair={x:0,halfWidth:14,startZ:-36,endZ:-62,low:1,high:6,count:14};
export interface CityBuilding {id:string;name:string;asset:string;x:number;y:number;z:number;width:number;height:number;depth:number;rotation:number;}
const home=(id:string,x:number,z:number,width:number,rotation=0,asset='village-body2'):CityBuilding=>({id,name:'Sanctuary Home',asset,x,y:1,z,width,height:width*(asset==='village-body'?1.74:1.071),depth:width*(asset==='village-body'?.866:.997),rotation});
export const cityBuildings:readonly CityBuilding[]=[
 {id:'hatchery',name:'Hatchery',asset:'village-body',x:0,y:6,z:-96,width:23,height:40.02,depth:19.92,rotation:0},
 {...home('collection',-62,-48,23),name:'Collection Hall'},
 {...home('rider',74,-47,21,0,'village-body'),name:'Rider Hall'},
 {id:'shop',name:'Food Shop',asset:'market-stall',x:-62,y:1,z:30,width:11,height:13.18,depth:9.24,rotation:0},
 home('home-west',-100,-15,17,Math.PI/2),home('home-west-north',-89,-65,18,.15),
 home('home-east',105,-5,16,-Math.PI/2),home('home-east-north',62,-91,16,-.15),
 home('home-south-west',-66,82,18,.12),home('home-south-east',63,82,17,-.12),
 home('home-west-garden',-101,46,16,Math.PI/2),
 // Outer garden districts leave the original services and adventure routes intact.
 home('north-garden-west',-100,-165,17,.18),home('north-garden-east',60,-175,18,-.2),
 home('west-grove-house',-170,-75,16,Math.PI/2),home('west-park-house',-185,35,15,Math.PI/2),
 home('south-garden-west',-120,145,17,.12),home('south-garden-east',80,175,18,-.12),
 home('east-park-house',180,65,17,-Math.PI/2),home('east-grove-house',160,-30,16,-Math.PI/2),
];
export interface CitySolid {id:string;x:number;z:number;halfX:number;halfZ:number;minY:number;maxY:number;}
export const citySolids:CitySolid[]=cityBuildings.map(b=>({id:b.id,x:b.x,z:b.z,halfX:(Math.abs(Math.cos(b.rotation))*b.width+Math.abs(Math.sin(b.rotation))*b.depth)/2,halfZ:(Math.abs(Math.sin(b.rotation))*b.width+Math.abs(Math.cos(b.rotation))*b.depth)/2,minY:b.y,maxY:b.y+b.height}));
citySolids.push({id:'fountain',x:0,z:22,halfX:7.2,halfZ:7.2,minY:1,maxY:10});
for(const x of [-24,24])citySolids.push({id:'arrival-'+x,x,z:99,halfX:3.5,halfZ:3.5,minY:1,maxY:17});
/** Replace provisional bounds with the actual transformed GLB geometry bounds. */
export function updateCitySolid(id:string,min:readonly number[],max:readonly number[]):void {
 const s=citySolids.find(s=>s.id===id);if(!s)return;
 s.x=(min[0]!+max[0]!)/2;s.z=(min[2]!+max[2]!)/2;s.halfX=(max[0]!-min[0]!)/2;s.halfZ=(max[2]!-min[2]!)/2;s.minY=min[1]!;s.maxY=max[1]!;
}
export interface CityPaving{x:number;z:number;width:number;depth:number;y:number;}
export const cityPaving:readonly CityPaving[]=[
 {x:0,z:79,width:25,depth:94,y:1},{x:0,z:-12,width:26,depth:48,y:1},
 {x:0,z:-27,width:174,depth:21,y:1},{x:-60,z:44,width:52,depth:26,y:1},
 {x:-29,z:31,width:26,depth:22,y:1},{x:40,z:20,width:24,depth:22,y:1},
 {x:70,z:-2,width:22,depth:50,y:1},{x:0,z:-73,width:53,depth:22,y:6},
 {x:0,z:143,width:25,depth:36,y:1},{x:-138,z:-27,width:60,depth:18,y:1},
 {x:138,z:20,width:56,depth:18,y:1},{x:-62,z:-112,width:18,depth:58,y:1},
];
export function insideUpperCourt(x:number,z:number):boolean {
 let inside=false;const p=upperCourt.outline;
 for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i]!,b=p[j]!;if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;
}
export function cityGroundHeight(x:number,z:number):number {
 const d=Math.hypot(x,z),f=cityFoundation;
 let h=d<=f.radius?f.height:Math.max(0,(f.apronRadius-d)/(f.apronRadius-f.radius))*f.height;
 if(insideUpperCourt(x,z))h=upperCourt.height;
 const s=hatcheryStair;
 if(Math.abs(x-s.x)<=s.halfWidth&&z<=s.startZ&&z>=s.endZ){const step=Math.min(s.count-1,Math.floor((s.startZ-z)/(s.startZ-s.endZ)*s.count));h=z===s.endZ?s.high:s.low+(step+.5)/s.count*(s.high-s.low);}
 return h;
}

