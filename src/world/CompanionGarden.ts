import { CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { companionGardenSlots } from '../gameplay/MountParking';
import { Parts,disposeScene } from '../utils/scene';
import { groundHeight } from './Traversal';
import { batchStaticScene } from '../utils/batchStaticScene';
/** Flush resting places connect the Dragon collection to the garden-city. */
export class CompanionGarden {
 readonly root=new Group();
 constructor(){this.root.name='CompanionGarden_RestingRows';const p=new Parts();
  for(const [index,bay]of companionGardenSlots.entries()){
   const y=groundHeight(bay.x,bay.z),pad=new Mesh(new CylinderGeometry(9.6,9.6,.045,32),new MeshStandardMaterial({color:index?0xadb99a:0xd4c4a0,roughness:1}));pad.name=index?'CompanionRestingBay_'+index:'SelectedMountBerth';pad.position.set(bay.x,y+.025,bay.z);pad.receiveShadow=true;this.root.add(pad);
   // Small inlaid markers define each place without curbs or high pedestals.
   for(const dx of [-8,8])for(const dz of [-7.5,7.5])p.add(this.root,'box',index?0xc9c6a7:0xc6a66b,[bay.x+dx,y+.065,bay.z+dz],[.45,.035,1.8]);
  }
  // Low planted borders outside the four resting places and their walk lanes.
  for(const [x,z]of [[34,48],[91,48],[34,-8],[91,-8]]){const y=groundHeight(x!,z!);for(let i=0;i<4;i++){p.add(this.root,'sphere',i%2?0x77945d:0x557753,[x!,y+.35,z!-3+i*2],[1.2,.45,1.1]);if(i%2===0)p.add(this.root,'sphere',0xd2c798,[x!,y+.78,z!-3+i*2],[.35,.24,.35]);}}
  batchStaticScene(this.root,new Set());
 }
 dispose():void{disposeScene(this.root);this.root.removeFromParent();}
}
