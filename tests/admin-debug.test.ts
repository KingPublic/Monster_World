import {localAdminDebug} from '../src/systems/LocalAdminDebug';
export function runCoreTests(){const cases:[string,()=>void][]=[
 ['Local admin debug requires explicit opt-in on a loopback development host',()=>{for(const host of ['127.0.0.1','localhost','[::1]']){if(!localAdminDebug(host,'?debug=1'))throw new Error('local owner denied');if(localAdminDebug(host,'')||localAdminDebug(host,'?debug=0'))throw new Error('debug enabled without opt-in');}}],
 ['Remote LAN, public and lookalike hosts cannot opt in with a debug URL',()=>{for(const host of ['192.168.1.5','0.0.0.0','monsterworld.example','127.0.0.1.example','localhost.example'])if(localAdminDebug(host,'?debug=1'))throw new Error('remote host accepted '+host);}],
 ];return cases.map(([name,fn])=>{try{fn();return{name,pass:true};}catch(e){return{name,pass:false,error:String(e)};}});}
