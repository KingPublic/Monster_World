import {residentCatalog,dialoguePage,residentLimits} from '../src/world/ResidentCatalog';
import {World} from '../src/world/World';
import {groundHeight,isBlocked} from '../src/world/Traversal';
import {disposeScene} from '../src/utils/scene';
import {AmbientResidents} from '../src/world/AmbientResidents';
import {RuntimeAssets} from '../src/systems/RuntimeAssets';
import {Vector3} from 'three';
function check(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
export async function runCoreTests(){const results=[];
try{
 const city=residentCatalog.filter(r=>!r.nestId);check(city.length>=24,'The expanded city still has only a handful of residents');
 check(city.filter(r=>r.route.length>1).length>=17,'City crowds are static');
 for(const nest of ['forest','highland','volcano','frost','meadow','canyon','marsh','ruins'])check(residentCatalog.filter(r=>r.nestId===nest&&r.role==='traveler').length>=5,'Sparse road '+nest);
 check(residentLimits.maxActive>12&&residentLimits.maxActive<=20,'Crowd budget is unchanged or unbounded');
 check(new Set(residentCatalog.map(r=>r.id)).size===residentCatalog.length,'Duplicate crowd identities');
 for(const r of city)check(dialoguePage(r.id)?.text.length!>40,'New resident cannot converse '+r.id);
 results.push({name:'expanded city and all eight roads have moving conversational residents with a bounded rig budget',pass:true});
}catch(e){results.push({name:'expanded city and all eight roads have moving conversational residents with a bounded rig budget',pass:false,error:String(e)});}
 const assets=new RuntimeAssets(()=>new Promise(()=>{})),crowd=new AmbientResidents(assets);try{
  crowd.update(0,new Vector3(0,1,48));check(crowd.status.active<=20,'pending crowds exceed budget');
  const r=residentCatalog.find(r=>r.id==='garden-traveler')!;check(!crowd.bodyBlocked(...r.route[0]!), 'unrendered resident creates an invisible obstacle');
  results.push({name:'unloaded crowd definitions do not create invisible body collisions',pass:true});
 }catch(e){results.push({name:'unloaded crowd definitions do not create invisible body collisions',pass:false,error:String(e)});}finally{crowd.dispose();assets.dispose();}
 const world=new World();try{
 for(const r of residentCatalog.filter(r=>!r.nestId))for(let i=0;i<r.route.length;i++){
  const a=r.route[i]!,b=r.route[(i+1)%r.route.length]!,count=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.5));
  for(let n=0;n<=count;n++){const t=n/count,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,y=groundHeight(x,z);check(!isBlocked(x,z,{radius:.75,minY:y+.05,maxY:y+4.9}),'Crowd walks into scenery '+r.id+' '+x+','+z);}
 }
 results.push({name:'city resident routes remain physically clear of buildings and scenery',pass:true});
}catch(e){results.push({name:'city resident routes remain physically clear of buildings and scenery',pass:false,error:String(e)});}finally{world.disposeCollision();disposeScene(world.group);}return results;}
