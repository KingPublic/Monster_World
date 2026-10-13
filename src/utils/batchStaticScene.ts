import { InstancedMesh, Matrix4, Mesh } from 'three';
import type { Object3D } from 'three';
/** Batch only self-owned stationary scenery, preserving replaceable groups. */
export function batchStaticScene(root:Object3D,excluded:ReadonlySet<Object3D>):void {
  root.updateWorldMatrix(true,true);const groups=new Map<string,Mesh[]>(),inverse=root.matrixWorld.clone().invert(),matrix=new Matrix4();
  root.traverse(node=>{
    if(!(node instanceof Mesh)||node instanceof InstancedMesh||node.type==='SkinnedMesh'||Array.isArray(node.material))return;
    for(let parent:Object3D|null=node;parent&&parent!==root;parent=parent.parent)if(excluded.has(parent))return;
    const key=[node.geometry.id,node.material.id,node.castShadow,node.receiveShadow].join(':');
    const group=groups.get(key)??[];group.push(node);groups.set(key,group);
  });
  for(const meshes of groups.values()){
    if(meshes.length<2)continue;const first=meshes[0]!,geometry=first.geometry.clone(),batch=new InstancedMesh(geometry,first.material,meshes.length);
    batch.name='Static city details';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
    meshes.forEach((mesh,index)=>{batch.setMatrixAt(index,matrix.multiplyMatrices(inverse,mesh.matrixWorld));mesh.removeFromParent();});
    batch.computeBoundingBox();batch.computeBoundingSphere();
    // disposeScene owns geometry; explicit instance disposal releases its buffers.
    geometry.addEventListener('dispose',()=>batch.dispose());root.add(batch);
  }
}
