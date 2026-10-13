import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { BufferGeometry as Geometry } from 'three';

export function seededRandom(seed: number): () => number {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

/** Decorative routes use the existing coordinates, never transport the player. */
export const valleyTrails = [
  { width: 18, curve: new CatmullRomCurve3([[120,-90],[168,-125],[206,-172],[254,-225],[307,-265],[323,-286]].map(([x,z]) => new Vector3(x,0,z)), false, 'centripetal') },
  { width: 13, curve: new CatmullRomCurve3([[202,-171],[60,-245],[-160,-331],[-381,-527],[-604,-753],[-758,-880]].map(([x,z]) => new Vector3(x,0,z)), false, 'centripetal') },
];
const samples = valleyTrails.flatMap(trail => trail.curve.getPoints(140).map(point => ({ point, width: trail.width })));
export function trailClearance(x: number, z: number): number {
  let closest = Infinity;
  for (const { point, width } of samples) closest = Math.min(closest, Math.hypot(x-point.x,z-point.z)-width/2);
  return closest;
}

export function addTrail(parent: Group, height: (x: number,z: number)=>number): void {
  const material = new MeshStandardMaterial({ vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  for (const [index, trail] of valleyTrails.entries()) {
    const positions: number[] = [], colors: number[] = [], indices: number[] = [];
    const length = trail.curve.getLength(), steps = Math.ceil(length/3), across = 6;
    const color = new Color(), earth = new Color(0xb59f76), edge = new Color(0x879260);
    for (let i=0;i<=steps;i++) {
      const t=i/steps, point=trail.curve.getPointAt(t), tangent=trail.curve.getTangentAt(t);
      const width=trail.width*(1+.08*Math.sin(t*31));
      for (let j=0;j<=across;j++) {
        const side=(j/across-.5)*width, x=point.x-tangent.z*side,z=point.z+tangent.x*side;
        positions.push(x,height(x,z)+.04,z);
        const feather=Math.pow(Math.max(0,Math.min(1,1+trailClearance(x,z)/4)),4);
        color.copy(earth).lerp(edge,feather).multiplyScalar(.96+.035*Math.sin(x*1.3+z*.8));
        colors.push(color.r,color.g,color.b);
        if(i<steps&&j<across){const a=i*(across+1)+j,b=a+across+1;indices.push(a,a+1,b,b,a+1,b+1);}
      }
    }
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=new Mesh(geometry,material);mesh.name='ContinuousValleyTrail_'+index;mesh.receiveShadow=true;parent.add(mesh);
  }
}

export interface ScatterItem { x:number;y:number;z:number;sx:number;sy:number;sz:number;yaw?:number;lean?:number;color?:number; }
/** Each batch owns its geometry/material. No borrowed runtime cache resources. */
export function addBatch(parent: Group, name: string, geometry: Geometry, color: number, items: ScatterItem[]): InstancedMesh {
  const material=new MeshStandardMaterial({color,roughness:1,flatShading:true});
  const mesh=new InstancedMesh(geometry,material,items.length),matrix=new Matrix4(),rotation=new Quaternion(),position=new Vector3(),scale=new Vector3(),tint=new Color();
  mesh.name=name;
  // Existing disposeScene owns geometries; connect that lifetime to the mesh's
  // instance buffers as well. Every batch has its own geometry, never a cache one.
  geometry.addEventListener('dispose',()=>mesh.dispose());
  for(const [i,item] of items.entries()){
    rotation.setFromAxisAngle(new Vector3(0,1,0),item.yaw??0);
    if(item.lean)rotation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0,0,1),item.lean));
    matrix.compose(position.set(item.x,item.y,item.z),rotation,scale.set(item.sx,item.sy,item.sz));mesh.setMatrixAt(i,matrix);
    if(item.color!==undefined)mesh.setColorAt(i,tint.set(item.color));
  }
  mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  mesh.receiveShadow=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();parent.add(mesh);return mesh;
}
