import { BoxGeometry, BufferGeometry, CatmullRomCurve3, ConeGeometry, CylinderGeometry, Float32BufferAttribute, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, TorusGeometry, TubeGeometry, Vector3 } from 'three';
import type { NestMarkerConfig } from '../config/gameConfig';
import { addBatch, seededRandom, trailClearance, valleyTrails } from './Landscape';
import type { ScatterItem } from './Landscape';
import { valleySurfaceHeight } from './Environment';
import { WorldCollision, worldCollision } from './WorldCollision';

/** Rock roots, twig braid and living apron, aligned to the existing +5 nest floor. */
export function createNestLandscape(marker:NestMarkerConfig,index:number,collision:WorldCollision=worldCollision):Group {
  const nest=new Group();nest.name='WildNest_'+marker.id;nest.position.set(...marker.position);
  const random=seededRandom(500+index),stones:ScatterItem[]=[],roots:ScatterItem[]=[],twigs:ScatterItem[]=[],moss:ScatterItem[]=[],plants:ScatterItem[]=[],flowers:ScatterItem[]=[];
  const cold=marker.id==='frost'||marker.id==='glacier',dry=['volcano','canyon','dunes','ember','sunreach'].includes(marker.id);
  const approach=valleyTrails.find(t=>t.nestId===marker.id)!.curve.getPointAt(.98);
  const entrance=Math.atan2(approach.z-marker.position[2],approach.x-marker.position[0]);
  nest.userData.region=marker.id;nest.userData.entranceAngle=entrance;
  const stone=cold?0xa1b8b8:dry?0x8b7566:0x939786;
  const rockMaterial=new MeshStandardMaterial({color:stone,roughness:1,flatShading:true});
  const foundation=new Mesh(new CylinderGeometry(29,36,8,19),rockMaterial);foundation.position.y=.9;nest.add(foundation);
  const regionalFloor:Readonly<Record<string,number>>={meadow:0xbeac78,canyon:0xb59272,marsh:0x9ba58d,ruins:0xb0a5a4,dunes:0xd1b587,ember:0x9a7667,glacier:0xb2d3df,moonwell:0xa49daf,sunreach:0xd6be88,stormspire:0xa7b8c7};
  const bed=new Mesh(new CylinderGeometry(27,29,2.2,36),new MeshStandardMaterial({color:regionalFloor[marker.id]??(cold?0xa4a8a0:0xa9946d),roughness:1}));bed.position.y=3.91;bed.receiveShadow=true;bed.name='NestFloor_ExistingPhysicalSurface';nest.add(bed);
  for(let i=0;i<28;i++){
    const angle=i/28*Math.PI*2,radius=31+random()*4;
    const clear=trailClearance(marker.position[0]+Math.cos(angle)*radius,marker.position[2]+Math.sin(angle)*radius)>4;
    if(clear)stones.push({x:Math.cos(angle)*radius,y:1.3+random(),z:Math.sin(angle)*radius,sx:4+random()*3,sy:3+random()*2,sz:4+random()*2,yaw:angle,color:i%3===0?0xa7aa90:stone});
    if(clear&&i%2===0)roots.push({x:Math.cos(angle)*28,y:3.5,z:Math.sin(angle)*28,sx:1.3+random(),sy:15+random()*5,sz:1.2,yaw:-angle,lean:1.18,color:0x807050});
    moss.push({x:Math.cos(angle)*30,y:4.2,z:Math.sin(angle)*30,sx:3+random()*3,sy:.5,sz:2+random()*2,yaw:angle,color:cold?0xc1d2c2:0x6e8245});
  }
  const braidMaterial=new MeshStandardMaterial({color:0x886443,roughness:1});
  for(let strand=0;strand<3;strand++){
    const sections:Vector3[][]=[],points:Vector3[]=[];
    for(let i=0;i<=110;i++){
      const angle=entrance+.6+i/110*(Math.PI*2-1.2),phase=angle*10+strand*Math.PI*2/3,radius=24.8+Math.sin(phase)*1.15;
      const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
      // Some nests connect onward to another trail. Cut the rendered braid as
      // well as its solid proxy at every crossing, retaining a body-width margin.
      if(trailClearance(x+marker.position[0],z+marker.position[2])<=3){if(points.length>1)sections.push(points.splice(0));else points.length=0;}
      else points.push(new Vector3(x,5.8+Math.cos(phase)*.8,z));
    }
    if(points.length>1)sections.push(points);
    for(const [piece,points]of sections.entries()){
      const segments=points.length-1,braid=new Mesh(new TubeGeometry(new CatmullRomCurve3(points),segments,.95,5,false),braidMaterial);
      braid.name='BraidedTwigRim_'+strand+(piece?'_'+piece:'');nest.add(braid);collision.registerTube(braid,segments,5);
    }
  }
  for(let i=0;i<88;i++){
    const angle=random()*Math.PI*2,radius=9+random()*15;
    twigs.push({x:Math.cos(angle)*radius,y:4.95+random()*.12,z:Math.sin(angle)*radius,sx:.13+random()*.08,sy:3+random()*6,sz:.13,yaw:random()*Math.PI*2,lean:Math.PI/2,color:i%2?0xb69b68:0x937c55});
  }
  for(let i=0;i<120;i++){
    const angle=random()*Math.PI*2,radius=38+random()*49,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
    const wx=x+marker.position[0],wz=z+marker.position[2];
    if(trailClearance(wx,wz)<5)continue;
    const y=valleySurfaceHeight(wx,wz)-marker.position[1],s=1.4+random()*2.5;
    if(i%7===0)stones.push({x,y:y+s*.3,z,sx:s*1.4,sy:s*.75,sz:s,yaw:angle,color:stone});
    else plants.push({x,y:y+s*.55,z,sx:s,sy:s*.9,sz:s*.85,yaw:angle,color:cold?0x83aaa0:dry?0x919052:i%3===0?0x819345:0x4b7344});
    if(i%13===0)flowers.push({x,y:y+s*.8,z,sx:.8,sy:.5,sz:.8,color:cold?0xdde9db:dry?0xe2b569:0xe1cc8a});
  }
  collision.registerMesh(addBatch(nest,'NestFracturedRockLedge',new IcosahedronGeometry(1,0),0xffffff,stones));
  collision.registerMesh(addBatch(nest,'NestWeatheredRoots',new CylinderGeometry(.4,1,1,6),0xffffff,roots));
  addBatch(nest,'NestWovenTwigBedding',new CylinderGeometry(.6,1,1,5),0xffffff,twigs);
  addBatch(nest,'NestLedgeMoss',new IcosahedronGeometry(1,0),0xffffff,moss);
  addBatch(nest,'NestApronVegetation',new IcosahedronGeometry(1,1),0xffffff,plants);
  addBatch(nest,'NestApronFlowers',new IcosahedronGeometry(1,0),0xffffff,flowers);
  addRegionalComposition(nest,marker,random,collision);
  return nest;
}

/** Ground-sampled regional silhouettes stay outside the 29-unit egg floor. */
function addRegionalComposition(nest:Group,marker:NestMarkerConfig,random:()=>number,collision:WorldCollision):void {
  const rocks:ScatterItem[]=[],columns:ScatterItem[]=[],reeds:ScatterItem[]=[],petals:ScatterItem[]=[],logs:ScatterItem[]=[],pads:ScatterItem[]=[];
  const ground=(x:number,z:number)=>valleySurfaceHeight(x+marker.position[0],z+marker.position[2])-marker.position[1];
  const clear=(x:number,z:number)=>Math.hypot(x,z)>40&&trailClearance(x+marker.position[0],z+marker.position[2])>12;
  const pillar=(x:number,z:number,height:number,width:number,color:number)=>{if(clear(x,z))columns.push({x,y:ground(x,z)+height/2,z,sx:width,sy:height,sz:width*.85,yaw:.1+random()*.2,color});};
  if(marker.id==='forest'){
    for(const [x,z]of [[-58,-43],[53,58]])if(clear(x!,z!)){const h=ground(x!,z!);logs.push({x:x!,y:h+3,z:z!,sx:3.4,sy:29,sz:3.4,yaw:.7,lean:Math.PI/2,color:0x746044});}
    for(let i=0;i<14;i++){const a=i/14*Math.PI*1.5,x=Math.cos(a)*69,z=Math.sin(a)*69;if(clear(x,z))rocks.push({x,y:ground(x,z)+3,z,sx:7,sy:6,sz:5,yaw:a,color:0x779473});}
  }else if(marker.id==='highland'){
    for(const [x,z]of [[-60,-35],[57,-59],[80,30]])if(clear(x!,z!))for(let j=0;j<4;j++)rocks.push({x:x!,y:ground(x!,z!)+1.6+j*2.7,z:z!,sx:8-j,sy:3.2,sz:6-j*.7,yaw:j*.8,color:0xb5b09a});
  }else if(marker.id==='volcano'){
    for(let i=0;i<13;i++){const a=i/13*Math.PI*2,x=Math.cos(a)*(73+random()*20),z=Math.sin(a)*(73+random()*20);pillar(x,z,12+random()*17,8,0x594e49);}
  }else if(marker.id==='frost'){
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=Math.cos(a)*76,z=Math.sin(a)*76;if(clear(x,z))rocks.push({x,y:ground(x,z)+8,z,sx:3+random()*3,sy:18+random()*12,sz:4,yaw:a,color:i%2?0xc4e2df:0x92bdc5});}
  }else if(marker.id==='meadow'){
    for(let i=0;i<190;i++){const a=random()*Math.PI*2,r=46+random()*54,x=Math.cos(a)*r,z=Math.sin(a)*r;if(!clear(x,z))continue;petals.push({x,y:ground(x,z)+1.4,z,sx:2.2,sy:.7,sz:2.2,color:i%3===0?0xd39fb3:i%3===1?0xe6cd78:0xdddac6});reeds.push({x,y:ground(x,z)+.65,z,sx:.18,sy:1.3,sz:.18,color:0x798b48});}
    for(const [x,z]of [[-71,-46],[68,52]])if(clear(x!,z!))logs.push({x:x!,y:ground(x!,z!)+2,z:z!,sx:2.2,sy:24,sz:2.2,lean:Math.PI/2,yaw:.5,color:0x9b8056});
  }else if(marker.id==='canyon'){
    // Two staggered stratified shelves, with an open trail between them.
    for(const side of [-1,1])for(let i=0;i<4;i++){
      const x=side*(90+i*12),z=-82+i*43;if(!clear(x,z))continue;
      for(let j=0;j<4;j++)columns.push({x,y:ground(x,z)+6+j*11,z,sx:30-j*3,sy:12,sz:25-j*2,yaw:side*.12,color:j%2?0xbd8862:0x967357});
    }
  }else if(marker.id==='marsh'){
    // Shallow isolated backwater patches do not alter the walk/landing surface.
    for(const [x,z]of [[-76,-56],[66,-62],[82,61]]){
      if(!clear(x!,z!))continue;
      const vertices:number[]=[],indices:number[]=[],sides=24,rings=5;
      for(let ring=0;ring<=rings;ring++)for(let i=0;i<=sides;i++){const a=i/sides*Math.PI*2,r=ring/rings*21,px=x!+Math.cos(a)*r,pz=z!+Math.sin(a)*r;vertices.push(px,ground(px,pz)+.12,pz);if(ring<rings&&i<sides){const p=ring*(sides+1)+i,q=p+sides+1;indices.push(p,p+1,q,p+1,q+1,q);}}
      const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
      const water=new Mesh(geometry,new MeshStandardMaterial({color:0x6caeaa,roughness:.28,transparent:true,opacity:.62,depthWrite:false}));water.name='ReedwaterShallowPool';nest.add(water);
      for(let i=0;i<26;i++){const a=random()*Math.PI*2,px=x!+Math.cos(a)*23,pz=z!+Math.sin(a)*23;if(!clear(px,pz))continue;const h=3+random()*4;reeds.push({x:px,y:ground(px,pz)+h/2,z:pz,sx:.25,sy:h,sz:.25,color:0x7b9262});petals.push({x:px,y:ground(px,pz)+h,z:pz,sx:.55,sy:1.4,sz:.55,color:0x75634d});}
      for(let i=0;i<6;i++){const px=x!+(random()-.5)*22,pz=z!+(random()-.5)*22;pads.push({x:px,y:ground(px,pz)+.3,z:pz,sx:2.8,sy:.12,sz:2.3,yaw:random()*6,color:0x85a868});}
    }
  }else if(marker.id==='dunes'){
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,r=64+random()*34,x=Math.cos(a)*r,z=Math.sin(a)*r;if(clear(x,z))rocks.push({x,y:ground(x,z)+2.2,z,sx:9+random()*9,sy:3+random()*4,sz:7+random()*5,yaw:a,color:i%2?0xc3a476:0xae895d});}
    for(const[x,z]of [[-64,-46],[65,51]])pillar(x!,z!,19,9,0xd4b888);
  }else if(marker.id==='ember'){
    for(let i=0;i<17;i++){const a=i/17*Math.PI*2,x=Math.cos(a)*(75+random()*20),z=Math.sin(a)*(75+random()*20);pillar(x,z,14+random()*28,7+random()*4,i%3?0x574b47:0x91684e);if(clear(x,z))rocks.push({x:x*.85,y:ground(x*.85,z*.85)+3,z:z*.85,sx:8,sy:5,sz:7,yaw:a,color:0x7a5544});}
  }else if(marker.id==='glacier'){
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2,x=Math.cos(a)*78,z=Math.sin(a)*78;pillar(x,z,17+random()*25,5+random()*5,i%2?0x9dd8e8:0xc7e6ec);if(clear(x,z))rocks.push({x:x*1.18,y:ground(x*1.18,z*1.18)+4,z:z*1.18,sx:12,sy:7,sz:8,yaw:a,color:0xb3d4df});}
  }else if(marker.id==='moonwell'){
    for(let i=0;i<28;i++){const a=random()*Math.PI*2,r=56+random()*36,x=Math.cos(a)*r,z=Math.sin(a)*r;if(!clear(x,z))continue;const h=3+random()*5;reeds.push({x,y:ground(x,z)+h/2,z,sx:.7,sy:h,sz:.7,color:0x9c91ae});pads.push({x,y:ground(x,z)+h,z,sx:3+random()*2,sy:.7,sz:3+random()*2,yaw:a,color:i%2?0xb5a6cf:0x839aa8});if(i%3===0)petals.push({x,y:ground(x,z)+1.1,z,sx:2.8,sy:1.1,sz:2.8,color:0xc2d6dc});}
    for(const[x,z]of [[-73,-48],[74,59]])pillar(x!,z!,23,8,0x8a859a);
  }else if(marker.id==='sunreach'){
    for(const[x,z]of [[-63,-58],[63,-58],[-65,57],[65,57]]){pillar(x!,z!,24,8,0xc7b17e);if(clear(x!,z!)){columns.push({x:x!,y:ground(x!,z!)+25,z:z!,sx:12,sy:3,sz:12,color:0xe6d093});columns.push({x:x!,y:ground(x!,z!)+1.8,z:z!,sx:15,sy:3.6,sz:15,color:0xb99e67});}}
    for(const[x,z]of [[-77,0],[77,0]])if(clear(x!,z!)){const arch=new Mesh(new TorusGeometry(15,2.2,7,24,Math.PI),new MeshStandardMaterial({color:0xdec48a,roughness:.86}));arch.name='SuncrestTempleArch';arch.position.set(x!,ground(x!,z!)+5,z!);arch.rotation.y=Math.PI/2;nest.add(arch);collision.registerMesh(arch);}
  }else if(marker.id==='stormspire'){
    for(let i=0;i<11;i++){const a=i/11*Math.PI*2,x=Math.cos(a)*90,z=Math.sin(a)*90;pillar(x,z,24+random()*35,10+random()*6,i%2?0x8fa4b7:0xb6c6d3);if(clear(x,z))rocks.push({x,y:ground(x,z)+4,z,sx:16,sy:8,sz:12,yaw:a,color:0x8796a5});}
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=Math.cos(a)*66,z=Math.sin(a)*66;if(clear(x,z))petals.push({x,y:ground(x,z)+2.6,z,sx:2.1,sy:3.4,sz:2.1,color:0xd0dfea});}
  }else if(marker.id==='ruins'){
    for(const [x,z,h]of [[-68,-52,35],[66,-58,27],[-72,52,20],[63,62,32]]){
      pillar(x!,z!,h!,9,0xa29caa);if(clear(x!,z!))columns.push({x:x!,y:ground(x!,z!)+2,z:z!,sx:16,sy:4,sz:15,color:0x858490});
    }
    // Broken lintels and squared rubble distinguish it from natural rock rings.
    for(let i=0;i<20;i++){const a=random()*Math.PI*2,r=52+random()*42,x=Math.cos(a)*r,z=Math.sin(a)*r;if(clear(x,z))columns.push({x,y:ground(x,z)+1.2,z,sx:5+random()*6,sy:2.4,sz:4,yaw:a,color:0xaaa49c});}
    for(const [x,z]of [[-68,-52],[63,62]])if(clear(x!,z!))columns.push({x:x!+5,y:ground(x!,z!)+(x!<0?35:32),z:z!,sx:24,sy:5,sz:11,yaw:.12,color:0xc0b7c8});
  }
  if(rocks.length)collision.registerMesh(addBatch(nest,'RegionalRockSilhouette_'+marker.id,new IcosahedronGeometry(1,0),0xffffff,rocks));
  if(columns.length){
    const geometry=marker.id==='volcano'||marker.id==='ember'?new CylinderGeometry(.48,.57,1,6):marker.id==='glacier'||marker.id==='stormspire'?new ConeGeometry(.7,1,5):new BoxGeometry(1,1,1);
    if(marker.id==='canyon'){
      // Offset and chip corners in a shared small shelf; avoid perfect stacked boxes.
      const p=geometry.attributes.position!;
      for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(y>0?.82:1.08)+z*.15+y*.17,y+(x*z)*.13,z*(y>0?.92:1.05)+x*.12);}
      geometry.computeVertexNormals();
    }
    collision.registerMesh(addBatch(nest,'RegionalMasonry_'+marker.id,geometry,0xffffff,columns));
  }
  if(reeds.length)addBatch(nest,'RegionalStems_'+marker.id,new CylinderGeometry(.6,1,1,5),0xffffff,reeds);
  if(petals.length)addBatch(nest,'RegionalFlowers_'+marker.id,new IcosahedronGeometry(1,0),0xffffff,petals);
  if(logs.length)collision.registerMesh(addBatch(nest,'RegionalFallenTimber_'+marker.id,new CylinderGeometry(1,1,1,7),0xffffff,logs));
  if(pads.length)addBatch(nest,'RegionalLilyPads_'+marker.id,new CylinderGeometry(1,1,1,9),0xffffff,pads);
}
