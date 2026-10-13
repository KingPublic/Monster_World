import { Box3, SkinnedMesh, Sphere, Vector3 } from 'three';
import type { BufferGeometry, Matrix4, Object3D } from 'three';

const cache = new WeakMap<BufferGeometry, WeakMap<Matrix4[], readonly Box3[]>>();
/** Conservative skin envelopes: positive skin blends lie inside the union of
 * their contributing bone bounds. Update ~95 boxes, rather than 20k vertices.
 * This family has no morph targets; authored juvenile bone scales are covered. */
export class RigBounds {
  private readonly skins: { mesh:SkinnedMesh; joints:readonly Box3[] }[] = [];
  private readonly box = new Box3(); private readonly transformed = new Box3();
  constructor(root:Object3D) {
    root.traverse(node=>{
      if (!(node instanceof SkinnedMesh)) return;
      let byBind=cache.get(node.geometry);if(!byBind){byBind=new WeakMap();cache.set(node.geometry,byBind);}
      let joints=byBind.get(node.skeleton.boneInverses);
      if(!joints){
        const indices=node.geometry.getAttribute('skinIndex'),weights=node.geometry.getAttribute('skinWeight'),positions=node.geometry.getAttribute('position');
        if(!indices||!weights||!positions)return;
        const boxes=node.skeleton.bones.map(()=>new Box3()),point=new Vector3(),local=new Vector3();
        for(let i=0;i<positions.count;i++){
          point.fromBufferAttribute(positions,i).applyMatrix4(node.bindMatrix);
          for(let j=0;j<4;j++){
            if(weights.getComponent(i,j)<=0)continue;
            const joint=indices.getComponent(i,j),inverse=node.skeleton.boneInverses[joint];
            if(inverse)boxes[joint]!.expandByPoint(local.copy(point).applyMatrix4(inverse));
          }
        }
        joints=boxes;byBind.set(node.skeleton.boneInverses,joints);
      }
      node.boundingSphere=new Sphere();node.frustumCulled=true;this.skins.push({mesh:node,joints});
    });
    this.update();
  }
  update():void {
    for(const {mesh,joints} of this.skins){
      this.box.makeEmpty();
      for(let i=0;i<joints.length;i++)if(!joints[i]!.isEmpty())this.box.union(this.transformed.copy(joints[i]!).applyMatrix4(mesh.skeleton.bones[i]!.matrixWorld));
      if(this.box.isEmpty())continue;
      this.box.applyMatrix4(mesh.bindMatrixInverse).getBoundingSphere(mesh.boundingSphere!);
      mesh.boundingSphere!.radius+=.01; // floating-point allowance in source units
    }
  }
  clear():void {this.skins.length=0;}
}
