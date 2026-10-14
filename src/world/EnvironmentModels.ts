import { Mesh } from 'three';
import type { Object3D } from 'three';
import type { WorldCollision } from './WorldCollision';
/** Supplied LOD nodes share one placement; display one detail level per family. */
export function selectEnvironmentLOD(root:Object3D):void{
 const families=new Map<string,{node:Object3D;level:number}[]>();
 root.traverse(node=>{const match=node.name.match(/^(.*)_LOD(\d+)$/i);if(!match)return;const key=node.parent?.uuid+':'+match[1],list=families.get(key)??[];list.push({node,level:Number(match[2])});families.set(key,list);});
 for(const list of families.values()){const best=Math.min(...list.map(n=>n.level));for(const {node,level}of list)node.visible=level===best;}
}
/** Only visible actual wooden tree meshes are hard; leaf crowns remain soft. */
export function registerEnvironmentTrunks(root:Object3D,collision:WorldCollision):void{
 root.traverse(node=>{if(!(node instanceof Mesh))return;for(let p:Object3D|null=node;p&&p!==root;p=p.parent)if(!p.visible)return;
  const materials=Array.isArray(node.material)?node.material:[node.material];if(materials.some(m=>/wood|trunk|bark/i.test(m.name)))collision.registerMesh(node);
 });
}
