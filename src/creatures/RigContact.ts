import { Matrix4, SkinnedMesh, Vector3 } from 'three';
import type { Object3D } from 'three';
/** A small actual skinned-foot sample set, rather than treating an ankle as a sole. */
export class RigContact {
  private readonly samples: { mesh: SkinnedMesh; index: number; side:'R'|'L' }[] = [];
  private readonly point = new Vector3(); private readonly inverse = new Matrix4();
  constructor(model: Object3D, footPattern: RegExp = /_([RL])_(Foot|Toe)/i, weightThreshold=.45) {
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
        for(let j=0;j<4;j++){const name=node.skeleton.bones[joints[j]!]?.name??'',match=name.match(footPattern);if(match?.[1]?.toUpperCase()==='R')right+=amounts[j]!;if(match?.[1]?.toUpperCase()==='L')left+=amounts[j]!;}
        if(Math.max(right,left)<weightThreshold)continue;
        node.getVertexPosition(i, this.point); this.point.applyMatrix4(node.matrixWorld);
        candidates[right>=left?'R':'L'].push({index:i,y:this.point.y});
      }
      for(const side of ['R','L'] as const){candidates[side].sort((a,b)=>a.y-b.y);for(const sample of candidates[side].slice(0,32))this.samples.push({mesh:node,index:sample.index,side});}
    });
  }
  minimum(root: Object3D): number | undefined {
    if (!this.samples.length) return undefined;
    this.inverse.copy(root.matrixWorld).invert(); let min = Infinity;
    for (const { mesh, index } of this.samples) { mesh.getVertexPosition(index, this.point); this.point.applyMatrix4(mesh.matrixWorld).applyMatrix4(this.inverse); min = Math.min(min, this.point.y); }
    return min;
  }
  /** Fixed weighted sole patch: horizontal centroid and lowest support height. */
  sole(side:'L'|'R',target:Vector3,space?:Object3D):boolean {
    target.set(0,0,0);let count=0,min=Infinity;
    if(space)this.inverse.copy(space.matrixWorld).invert();
    for(const sample of this.samples){if(sample.side!==side)continue;sample.mesh.getVertexPosition(sample.index,this.point);this.point.applyMatrix4(sample.mesh.matrixWorld);if(space)this.point.applyMatrix4(this.inverse);target.add(this.point);min=Math.min(min,this.point.y);count++;}
    if(!count)return false;target.multiplyScalar(1/count);target.y=min;return true;
  }
  supportGap(side:'L'|'R',height:(x:number,z:number)=>number):number|undefined {
    let min=Infinity;for(const sample of this.samples){if(sample.side!==side)continue;sample.mesh.getVertexPosition(sample.index,this.point);this.point.applyMatrix4(sample.mesh.matrixWorld);min=Math.min(min,this.point.y-height(this.point.x,this.point.z));}return Number.isFinite(min)?min:undefined;
  }
  clear(): void { this.samples.length = 0; }
}
