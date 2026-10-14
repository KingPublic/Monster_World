import {Mesh,Raycaster,Vector3} from 'three';
import {Environment,valleySurfaceHeight} from '../src/world/Environment';
import {WorldCollision} from '../src/world/WorldCollision';
import {disposeScene} from '../src/utils/scene';
import {AmbientWildlife,wildlifeLimits} from '../src/world/AmbientWildlife';
import {trailClearance} from '../src/world/Landscape';
import{Sanctuary}from'../src/world/Sanctuary';
function check(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
export async function runCoreTests(){const results=[];const collision=new WorldCollision(),environment=new Environment(collision),sanctuary=new Sanctuary();try{
 sanctuary.group.updateMatrixWorld(true);const surfaces=[...environment.group.children.filter(n=>n instanceof Mesh&&/Ground|Apron/.test(n.name)),sanctuary.stairs,sanctuary.group.getObjectByName('SanctuaryGroundFoundation')!,sanctuary.group.getObjectByName('HatcheryCourtSurface')!],ray=new Raycaster();
 for(const[x,z]of [[0,-34],[0,-30],[8,-24],[-18,-32],[17,-42],[0,-45],[0,-60],[0,48],[100,120],[-160,140]]){
  ray.set(new Vector3(x,1000,z),new Vector3(0,-1,0));const rendered=ray.intersectObjects(surfaces,false)[0];check(rendered,'Missing city surface '+x+','+z);const actual=valleySurfaceHeight(x,z);check(Math.abs(rendered.point.y-actual)<.22,'Visible ground buries actor: '+JSON.stringify({x,z,rendered:rendered.point.y,floor:actual}));
 }
 results.push({name:'actual city ground stays below the player floor at stairs plazas and outer lawns',pass:true});
}catch(error){results.push({name:'actual city ground stays below the player floor at stairs plazas and outer lawns',pass:false,error:String(error)});}finally{disposeScene(environment.group);disposeScene(sanctuary.group);collision.clear();}
 const floor=(x:number,z:number)=>x*.03+z*.015,wildlife=new AmbientWildlife(floor,()=>false);
 try{const focus=new Vector3(250,floor(250,-30),-30);for(let i=0;i<600;i++)wildlife.update(1/60,focus);const alive=wildlife.snapshot();check(alive.active>0&&alive.active<=wildlifeLimits.maxActive,'unbounded/absent original creatures');check(alive.actors.some(a=>a.distance>5),'creatures walk in place');for(const a of alive.actors){check(Math.abs(a.position[1]!-floor(a.position[0]!,a.position[2]!))<.001,'roamer floats/sinks');check(trailClearance(a.position[0]!,a.position[2]!)>4,'roamer obstructs trail');}
  const resources=new Set<import('three').BufferGeometry>();let released=0;wildlife.root.traverse(n=>{if(n instanceof Mesh)resources.add(n.geometry);});for(const g of resources)g.addEventListener('dispose',()=>released++);wildlife.update(.1,new Vector3(6000,0,6000));check(wildlife.snapshot().active===0&&released===resources.size,'distant creatures retain resources');wildlife.dispose();wildlife.update(.1,focus);check(wildlife.root.children.length===0,'disposed wildlife reconstructs actors');results.push({name:'original forest creatures actually roam on ground keep trails free and release beyond their budget',pass:true});
 }catch(error){results.push({name:'original forest creatures actually roam on ground keep trails free and release beyond their budget',pass:false,error:String(error)});}finally{wildlife.dispose();}return results;}
