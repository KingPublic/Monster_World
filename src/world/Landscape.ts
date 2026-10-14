import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import type { BufferGeometry as Geometry } from 'three';
import { gameConfig } from '../config/gameConfig';

export function seededRandom(seed: number): () => number {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}

/** Decorative routes use the existing coordinates, never transport the player. */
export const valleyTrails = [
  { nestId:'forest', width: 18, curve: route([[120,-90],[168,-125],[206,-172],[254,-225],[307,-265],[340,-310]]) },
  { nestId:'highland', width: 13, curve: route([[202,-171],[60,-245],[-160,-331],[-381,-527],[-604,-753],[-780,-900]]) },
  { nestId:'volcano', width: 18, curve: route([[340,-310],[590,-560],[960,-820],[1300,-1180],[1530,-1510],[1720,-1840]]) },
  { nestId:'frost', width: 16, curve: route([[-780,-900],[-1200,-1270],[-1530,-1840],[-1740,-2330],[-2040,-2840],[-1920,-3400]]) },
  { nestId:'meadow', width: 16, curve: route([[-110,100],[-320,220],[-620,330],[-850,520],[-1080,650],[-1250,760]]) },
  { nestId:'canyon', width: 18, curve: route([[1720,-1840],[2030,-1880],[2360,-1750],[2630,-1890],[2800,-2020],[3000,-2080]]) },
  { nestId:'marsh', width: 18, curve: route([[115,100],[390,320],[710,610],[1040,830],[1290,1210],[1650,1560]]) },
  { nestId:'ruins', width: 16, curve: route([[-780,-900],[-1130,-1080],[-1640,-1160],[-2070,-1430],[-2460,-1750],[-2850,-1900]]) },
];
function route(points:number[][]):CatmullRomCurve3{return new CatmullRomCurve3(points.map(([x,z])=>new Vector3(x,0,z)),false,'centripetal');}
const samples = valleyTrails.flatMap(trail => {
  const points=trail.curve.getSpacedPoints(Math.ceil(trail.curve.getLength()/20));
  return points.slice(1).map((point,i)=>{
    const start=points[i]!,dx=point.x-start.x,dz=point.z-start.z;
    return {start,dx,dz,inverseLength:1/(dx*dx+dz*dz),width:trail.width,minX:Math.min(point.x,start.x),maxX:Math.max(point.x,start.x),minZ:Math.min(point.z,start.z),maxZ:Math.max(point.z,start.z)};
  });
});
export function trailClearance(x: number, z: number): number {
  let closest = Infinity;
  for (const {start,dx,dz,inverseLength,width,minX,maxX,minZ,maxZ} of samples){
    const reach=closest+width/2;
    if(reach<=0)continue;
    if(x<minX-reach||x>maxX+reach||z<minZ-reach||z>maxZ+reach)continue;
    const t=Math.max(0,Math.min(1,((x-start.x)*dx+(z-start.z)*dz)*inverseLength)),px=x-start.x-t*dx,pz=z-start.z-t*dz,distanceSquared=px*px+pz*pz;
    if(distanceSquared<reach*reach)closest=Math.sqrt(distanceSquared)-width/2;
  }
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
        if(i<steps&&j<across&& !gameConfig.nestMarkers.some(n=>Math.hypot(point.x-n.position[0],point.z-n.position[2])<29)){
          const a=i*(across+1)+j,b=a+across+1;indices.push(a,a+1,b,b,a+1,b+1);
        }
      }
    }
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=new Mesh(geometry,material);mesh.name='ContinuousValleyTrail_'+index;mesh.receiveShadow=true;parent.add(mesh);
  }
}

export interface ScatterItem { x:number;y:number;z:number;sx:number;sy:number;sz:number;yaw?:number;lean?:number;color?:number; }
/** Each batch owns its geometry/material. No borrowed runtime cache resources. */
export function addBatch(parent: Group, name: string, geometry: Geometry, color: number, items: ScatterItem[]): InstancedMesh {
  const material=new MeshStandardMaterial({color,roughness:1,flatShading:!/Canop|Understory|Shrub/i.test(name)});
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
