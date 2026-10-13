import { CatmullRomCurve3, CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, TubeGeometry, Vector3 } from 'three';
import type { NestMarkerConfig } from '../config/gameConfig';
import { addBatch, seededRandom, trailClearance } from './Landscape';
import type { ScatterItem } from './Landscape';
import { valleySurfaceHeight } from './Environment';

/** Rock roots, twig braid and living apron, aligned to the existing +5 nest floor. */
export function createNestLandscape(marker:NestMarkerConfig,index:number):Group {
  const nest=new Group();nest.name='WildNest_'+marker.id;nest.position.set(...marker.position);
  const random=seededRandom(500+index),stones:ScatterItem[]=[],roots:ScatterItem[]=[],twigs:ScatterItem[]=[],moss:ScatterItem[]=[],plants:ScatterItem[]=[],flowers:ScatterItem[]=[];
  const cold=index===3,dry=index===2;
  const stone=cold?0xa1b8b8:dry?0x8b7566:0x939786;
  const rockMaterial=new MeshStandardMaterial({color:stone,roughness:1,flatShading:true});
  const foundation=new Mesh(new CylinderGeometry(29,36,8,19),rockMaterial);foundation.position.y=.9;nest.add(foundation);
  const bed=new Mesh(new CylinderGeometry(27,29,2.2,36),new MeshStandardMaterial({color:cold?0xa4a8a0:0xa9946d,roughness:1}));bed.position.y=3.91;bed.receiveShadow=true;bed.name='NestFloor_ExistingPhysicalSurface';nest.add(bed);
  for(let i=0;i<28;i++){
    const angle=i/28*Math.PI*2,radius=31+random()*4;
    stones.push({x:Math.cos(angle)*radius,y:1.3+random(),z:Math.sin(angle)*radius,sx:4+random()*3,sy:3+random()*2,sz:4+random()*2,yaw:angle,color:i%3===0?0xa7aa90:stone});
    if(i%2===0)roots.push({x:Math.cos(angle)*28,y:3.5,z:Math.sin(angle)*28,sx:1.3+random(),sy:15+random()*5,sz:1.2,yaw:-angle,lean:1.18,color:0x807050});
    moss.push({x:Math.cos(angle)*30,y:4.2,z:Math.sin(angle)*30,sx:3+random()*3,sy:.5,sz:2+random()*2,yaw:angle,color:cold?0xc1d2c2:0x6e8245});
  }
  const braidMaterial=new MeshStandardMaterial({color:0x886443,roughness:1});
  for(let strand=0;strand<3;strand++){
    const points:Vector3[]=[];
    for(let i=0;i<=110;i++){
      const angle=2.19+i/110*(Math.PI*2-1.2),phase=angle*10+strand*Math.PI*2/3,radius=24.8+Math.sin(phase)*1.15;
      points.push(new Vector3(Math.cos(angle)*radius,5.8+Math.cos(phase)*.8,Math.sin(angle)*radius));
    }
    const braid=new Mesh(new TubeGeometry(new CatmullRomCurve3(points),110,.95,5,false),braidMaterial);braid.name='BraidedTwigRim_'+strand;nest.add(braid);
  }
  for(let i=0;i<88;i++){
    const angle=random()*Math.PI*2,radius=9+random()*15;
    twigs.push({x:Math.cos(angle)*radius,y:4.95+random()*.12,z:Math.sin(angle)*radius,sx:.13+random()*.08,sy:3+random()*6,sz:.13,yaw:random()*Math.PI*2,lean:Math.PI/2,color:i%2?0xb69b68:0x937c55});
  }
  for(let i=0;i<120;i++){
    const angle=random()*Math.PI*2,radius=38+random()*49,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    const wx=x+marker.position[0],wz=z+marker.position[2];
    if(trailClearance(wx,wz)<3)continue;
    const y=valleySurfaceHeight(wx,wz)-marker.position[1],s=1.4+random()*2.5;
    if(i%7===0)stones.push({x,y:y+s*.3,z,sx:s*1.4,sy:s*.75,sz:s,yaw:angle,color:stone});
    else plants.push({x,y:y+s*.55,z,sx:s,sy:s*.9,sz:s*.85,yaw:angle,color:cold?0x83aaa0:dry?0x919052:i%3===0?0x819345:0x4b7344});
    if(i%13===0)flowers.push({x,y:y+s*.8,z,sx:.8,sy:.5,sz:.8,color:cold?0xdde9db:dry?0xe2b569:0xe1cc8a});
  }
  addBatch(nest,'NestFracturedRockLedge',new IcosahedronGeometry(1,0),0xffffff,stones);
  addBatch(nest,'NestWeatheredRoots',new CylinderGeometry(.4,1,1,6),0xffffff,roots);
  addBatch(nest,'NestWovenTwigBedding',new CylinderGeometry(.6,1,1,5),0xffffff,twigs);
  addBatch(nest,'NestLedgeMoss',new IcosahedronGeometry(1,0),0xffffff,moss);
  addBatch(nest,'NestApronVegetation',new IcosahedronGeometry(1,1),0xffffff,plants);
  addBatch(nest,'NestApronFlowers',new IcosahedronGeometry(1,0),0xffffff,flowers);
  return nest;
}
