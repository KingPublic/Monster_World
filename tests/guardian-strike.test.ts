import {Vector3} from 'three';
import {Guardian} from '../src/gameplay/Guardian';
import {RuntimeAssets} from '../src/systems/RuntimeAssets';
import {mvpConfig} from '../src/config/mvpConfig';
import {groundHeight} from '../src/world/Traversal';
export function runCoreTests(){const name='Guardian strike breaks away instead of overlapping the rider or hitting every frame';const assets=new RuntimeAssets(()=>new Promise(()=>{})),g=new Guardian(mvpConfig.nests[0],assets),target=new Vector3(340,groundHeight(340,-280),-280);try{g.state='CHASE';g.model.root.position.copy(target).add(new Vector3(0,2,0));if(!g.update(1.1,target,true))throw new Error('approach does not strike');if(g.update(1/60,target,true))throw new Error('contact repeats on next frame');for(let i=0;i<45;i++)if(g.update(1/60,target,true))throw new Error('strike recovery repeats damage');if(g.model.root.position.distanceTo(target)<15)throw new Error('Guardian stays inside mount');g.update(1/60,target,false);if(g.state!=='SAFE_ZONE_STOP')throw new Error('recovery cancels Sanctuary stop');return[{name,pass:true}];}catch(e){return[{name,pass:false,error:String(e)}];}finally{g.model.dispose();assets.dispose();}}
