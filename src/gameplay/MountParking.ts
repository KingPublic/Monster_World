type Point={x:number;z:number;};
/** Wide rest rows flank an open central lane; berth0 is the selected mount. */
export const companionGardenSlots:readonly Point[]=[{x:68,z:20},{x:45,z:48},{x:80,z:48},{x:45,z:-8},{x:80,z:-8}];
export function canRecallCompanion(mounted:boolean,carried:number):boolean{return !mounted&&carried===0;}
/** This is only a display window. Never remove any record from the save. */
export function displayedCompanions(records:readonly {id:string;stage:string}[],equipped?:string|null,focused?:string|null,mounted?:string|null):string[]{
 const valid=new Set(records.map(r=>r.id)),ids:string[]=[];
 const add=(id:string|null|undefined)=>{if(id&&valid.has(id)&&!ids.includes(id)&&ids.length<companionGardenSlots.length)ids.push(id);};
 add(mounted);add(focused);add(equipped);
 for(const r of [...records].reverse())if(r.stage==='Baby')add(r.id);
 for(const r of records)add(r.id);return ids;
}
/** Keep recalled companions in separate open bays. A full court leaves a
 * companion where it was parked rather than stacking it over another one. */
export function findMountParking(others:readonly Point[],blocked:(x:number,z:number)=>boolean,origin:Point):Point|undefined{
 for(let row=0;row<7;row++)for(const column of [0,1,2,-1,-2]){
  const p={x:origin.x+column*14,z:origin.z-row*16};
  if(Math.hypot(p.x,p.z)>125||others.some(o=>Math.hypot(p.x-o.x,p.z-o.z)<13.9))continue;
  if([-3,0,3].some(dx=>[-5,0,5].some(dz=>blocked(p.x+dx,p.z+dz))))continue;return p;
 }return undefined;
}
