import { Matrix4, SkinnedMesh, Vector3 } from 'three';
import type { Object3D } from 'three';
/** A small actual skinned-foot sample set, rather than treating an ankle as a sole. */
export class RigContact {
  private readonly samples: { mesh: SkinnedMesh; index: number }[] = [];
  private readonly point = new Vector3(); private readonly inverse = new Matrix4();
  constructor(model: Object3D) {
    model.updateWorldMatrix(true, true);
    model.traverse(node => {
      if (!(node instanceof SkinnedMesh)) return;
      const indices = node.geometry.getAttribute('skinIndex'), weights = node.geometry.getAttribute('skinWeight');
      if (!indices || !weights) return;
      const candidates: Record<'R'|'L',{index:number;y:number}[]> = {R:[],L:[]};
      for (let i = 0; i < indices.count; i++) {
        const joints = [indices.getX(i), indices.getY(i), indices.getZ(i), indices.getW(i)];
        const amounts = [weights.getX(i), weights.getY(i), weights.getZ(i), weights.getW(i)];
        let right=0,left=0;
        for(let j=0;j<4;j++){const name=node.skeleton.bones[joints[j]!]?.name??'';if(/_R_(Foot|Toe)/i.test(name))right+=amounts[j]!;if(/_L_(Foot|Toe)/i.test(name))left+=amounts[j]!;}
        if(right+left<.45)continue;
        node.getVertexPosition(i, this.point); this.point.applyMatrix4(node.matrixWorld);
        candidates[right>=left?'R':'L'].push({index:i,y:this.point.y});
      }
      for(const side of ['R','L'] as const){candidates[side].sort((a,b)=>a.y-b.y);for(const sample of candidates[side].slice(0,32))this.samples.push({mesh:node,index:sample.index});}
    });
  }
  minimum(root: Object3D): number | undefined {
    if (!this.samples.length) return undefined;
    this.inverse.copy(root.matrixWorld).invert(); let min = Infinity;
    for (const { mesh, index } of this.samples) { mesh.getVertexPosition(index, this.point); this.point.applyMatrix4(mesh.matrixWorld).applyMatrix4(this.inverse); min = Math.min(min, this.point.y); }
    return min;
  }
  clear(): void { this.samples.length = 0; }
}
