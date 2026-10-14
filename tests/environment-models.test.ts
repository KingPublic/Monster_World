import { Group,Mesh,BoxGeometry,MeshStandardMaterial } from 'three';
import { RuntimeAssets } from '../src/systems/RuntimeAssets';
import { WorldCollision } from '../src/world/WorldCollision';
import { selectEnvironmentLOD,registerEnvironmentTrunks } from '../src/world/EnvironmentModels';
import { disposeScene } from '../src/utils/scene';
function check(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
export async function runCoreTests(){const results=[];
 const template=new Group();for(let i=0;i<3;i++){const g=new Group();g.name='Tree_LOD'+i;const trunk=new Mesh(new BoxGeometry(1,8,1),new MeshStandardMaterial());trunk.material.name='M_wood_03';trunk.position.y=4;g.add(trunk);const leaves=new Mesh(new BoxGeometry(8,4,8),new MeshStandardMaterial());leaves.material.name='M_ENV_plants';leaves.position.y=10;g.add(leaves);template.add(g);}
 const assets=new RuntimeAssets(async()=>({scene:template,animations:[]})),asset=await assets.acquire('/tree'),collision=new WorldCollision();
 try{selectEnvironmentLOD(asset.root);check(asset.root.children.filter(n=>n.visible).length===1,'three supplied LODs render on top of each other');check(template.children.every(n=>n.visible),'instance LOD selection mutates cached template');results.push({name:'environment displays one supplied LOD without mutating the cached source',pass:true});
  asset.root.updateMatrixWorld(true);registerEnvironmentTrunks(asset.root,collision);check(collision.size===1,'hidden LODs or soft canopy registered as hard geometry');check(collision.isBlocked(0,0,{minY:1,maxY:4}),'actual city trunk passes through');check(!collision.isBlocked(3,0,{minY:9,maxY:12}),'soft leaf crown creates an invisible wall');collision.clear();check(collision.size===0,'city tree registry survives release');results.push({name:'actual visible wooden tree geometry blocks while canopy and hidden LODs stay soft',pass:true});
 }catch(e){results.push({name:'environment LOD/trunk lifetime',pass:false,error:String(e)});}finally{collision.clear();asset.release();assets.dispose();disposeScene(template);}
 return results;
}
