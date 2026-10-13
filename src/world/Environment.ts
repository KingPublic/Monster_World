import { BufferGeometry, Color, ConeGeometry, CylinderGeometry, DataTexture, Float32BufferAttribute, Group, IcosahedronGeometry, LinearFilter, LinearMipmapLinearFilter, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, RGBAFormat, SRGBColorSpace } from 'three';
import { gameConfig } from '../config/gameConfig';
import { addBatch, addTrail, seededRandom, trailClearance, valleyTrails } from './Landscape';
import type { ScatterItem } from './Landscape';

export function terrainHeight(x: number, z: number): number {
  const homeDistance = Math.hypot(x, z);
  if (homeDistance < 180) return 0;
  let height = 14 + Math.sin(x * 0.004) * Math.cos(z * 0.005) * 16;
  for (const marker of gameConfig.nestMarkers) {
    const distance = Math.hypot(x - marker.position[0], z - marker.position[2]);
    if (distance < 60) return marker.position[1];
    height += marker.position[1] * Math.exp(-Math.pow(distance / marker.terrainSpread, 2));
  }
  return height * Math.min(1, (homeDistance - 180) / 150);
}

/** Render the existing physical nest apron, including its smooth landing slope. */
export function valleySurfaceHeight(x: number, z: number): number {
  for (const marker of gameConfig.nestMarkers) {
    const dx=x-marker.position[0],dz=z-marker.position[2],distance=Math.hypot(dx,dz);
    if(distance>=82)continue;
    if(distance<=29)return marker.position[1]+5;
    const outer=terrainHeight(marker.position[0]+dx/distance*82,marker.position[2]+dz/distance*82);
    const t=Math.max(0,Math.min(1,(82-distance)/53)),blend=t*t*(3-2*t);
    return outer+(marker.position[1]+5-outer)*blend;
  }
  return terrainHeight(x,z);
}

function terrainColor(x:number,z:number):Color {
  const volcano=gameConfig.nestMarkers[2]!,frost=gameConfig.nestMarkers[3]!;
  const dry=Math.max(0,1-Math.hypot(x-volcano.position[0],z-volcano.position[2])/1050);
  const snow=Math.max(0,1-Math.hypot(x-frost.position[0],z-frost.position[2])/1450);
  const patch=Math.sin(x*.011+Math.sin(z*.009)*2)*Math.cos(z*.008-x*.003);
  return new Color(0x7e9659).lerp(new Color(0xa59964),(patch+1)*.22).lerp(new Color(0x8b7665),dry*.87).lerp(new Color(0xc4d8d4),snow*.85).multiplyScalar(.95+.05*Math.sin(x*.039+z*.028));
}

function soilTexture():DataTexture {
  const size=128,data=new Uint8Array(size*size*4),random=seededRandom(691);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const variation=Math.sin(x*.35)*Math.sin(y*.31)*7+random()*16;
    const i=(y*size+x)*4;data[i]=222+variation;data[i+1]=222+variation;data[i+2]=211+variation;data[i+3]=255;
  }
  const texture=new DataTexture(data,size,size,RGBAFormat);texture.colorSpace=SRGBColorSpace;texture.wrapS=texture.wrapT=RepeatWrapping;texture.magFilter=LinearFilter;texture.minFilter=LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=4;texture.repeat.set(420,420);texture.needsUpdate=true;return texture;
}

/** Low-poly irregular ridge, with rock shelves rather than a single cone. */
function ridgeGeometry(seed:number):BufferGeometry {
  const random=seededRandom(seed),rings=7,sides=11,positions:number[]=[],colors:number[]=[],indices:number[]=[],color=new Color();
  const profiles=[1,.91,.69,.56,.32,.19,.025],offsets=Array.from({length:sides},()=>.8+random()*.45);
  for(let r=0;r<rings;r++)for(let s=0;s<=sides;s++){
    const a=s/sides*Math.PI*2,p=profiles[r]!,radius=p*offsets[s%sides]!;
    const y=r/(rings-1)+(r>0&&r<rings-1?(random()-.5)*.11:0);
    positions.push(Math.cos(a)*radius+.13*Math.sin(r*1.7),y,Math.sin(a)*radius+.07*r);
    color.set(r>4?0xaab8b3:0x7d9292).multiplyScalar(.88+random()*.22);colors.push(color.r,color.g,color.b);
    if(r<rings-1&&s<sides){const i=r*(sides+1)+s,n=i+sides+1;indices.push(i,n,i+1,i+1,n,n+1);}
  }
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}

export class Environment {
  readonly group = new Group();
  constructor() {
    this.group.name='SurroundingWorld_Terrain';
    this.addTerrain();this.addWoodland();this.addUndergrowth();this.addRidges();
    addTrail(this.group,valleySurfaceHeight);
  }
  private addTerrain():void {
    const config=gameConfig.world,geometry=new PlaneGeometry(config.extent,config.extent,config.terrainSegments,config.terrainSegments);
    geometry.rotateX(-Math.PI/2);const positions=geometry.attributes.position!,colors:number[]=[];
    for(let i=0;i<positions.count;i++){
      const x=positions.getX(i),z=positions.getZ(i);positions.setY(i,valleySurfaceHeight(x,z)-.18);
      const color=terrainColor(x,z);colors.push(color.r,color.g,color.b);
    }
    // The distant grid must not bridge over exact walking surfaces. Its clipped
    // cells are covered by the more detailed ground ribbons/aprons below.
    const index=geometry.index!,kept:number[]=[];
    for(let i=0;i<index.count;i+=3){
      const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2),x=(positions.getX(a)+positions.getX(b)+positions.getX(c))/3,z=(positions.getZ(a)+positions.getZ(b)+positions.getZ(c))/3;
      const apron=gameConfig.nestMarkers.some(n=>Math.abs(x-n.position[0])<120&&Math.abs(z-n.position[2])<120);
      const corridor=x>-890&&x<440&&z>-1000&&z<30&&trailClearance(x,z)<20;
      if(!apron&&!corridor)kept.push(a,b,c);
    }
    geometry.setIndex(kept);
    geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
    const material=new MeshStandardMaterial({vertexColors:true,map:soilTexture(),roughness:1});
    const ground=new Mesh(geometry,material);ground.name='WarmMottledValleyGround';ground.receiveShadow=true;this.group.add(ground);
    // Detailed apron patches follow the existing traversal surface at each nest.
    for(const marker of gameConfig.nestMarkers){
      const patch=new PlaneGeometry(350,350,70,70);patch.rotateX(-Math.PI/2);const p=patch.attributes.position!,c:number[]=[],uv=patch.attributes.uv!;
      for(let i=0;i<p.count;i++){const x=p.getX(i)+marker.position[0],z=p.getZ(i)+marker.position[2];p.setXYZ(i,x,valleySurfaceHeight(x,z)-.05,z);uv.setXY(i,x/config.extent+.5,.5-z/config.extent);const color=terrainColor(x,z);c.push(color.r,color.g,color.b);}
      patch.setAttribute('color',new Float32BufferAttribute(c,3));patch.computeVertexNormals();
      const mesh=new Mesh(patch,material);mesh.name='NestLandingApron_'+marker.id;mesh.receiveShadow=true;this.group.add(mesh);
    }
    // A world-aligned fine grid cannot fold across itself on a tight trail bend.
    const corridor=new PlaneGeometry(1340,1080,268,216);corridor.rotateX(-Math.PI/2);
    const cp=corridor.attributes.position!,cc:number[]=[],ci:number[]=[],cu=corridor.attributes.uv!;
    for(let i=0;i<cp.count;i++){
      const x=cp.getX(i)-220,z=cp.getZ(i)-460,color=terrainColor(x,z);
      cp.setXYZ(i,x,valleySurfaceHeight(x,z)-.08,z);cc.push(color.r,color.g,color.b);cu.setXY(i,x/config.extent+.5,.5-z/config.extent);
    }
    const original=corridor.index!;
    for(let i=0;i<original.count;i+=3){
      const a=original.getX(i),b=original.getX(i+1),c=original.getX(i+2),x=(cp.getX(a)+cp.getX(b)+cp.getX(c))/3,z=(cp.getZ(a)+cp.getZ(b)+cp.getZ(c))/3;
      if(trailClearance(x,z)>86||gameConfig.nestMarkers.some(n=>Math.abs(x-n.position[0])<120&&Math.abs(z-n.position[2])<120))continue;
      ci.push(a,b,c);
    }
    corridor.setIndex(ci);corridor.setAttribute('color',new Float32BufferAttribute(cc,3));corridor.computeVertexNormals();
    const mesh=new Mesh(corridor,material);mesh.name='DetailedTrailGround';mesh.receiveShadow=true;this.group.add(mesh);
  }
  private addWoodland():void {
    const random=seededRandom(gameConfig.world.seed),trunks:ScatterItem[]=[],branches:ScatterItem[]=[],leaves:ScatterItem[]=[],distantLeaves:ScatterItem[]=[],pines:ScatterItem[]=[];
    const groves=[{x:270,z:-165,r:170},{x:480,z:-350,r:210},{x:220,z:-470,r:150},{x:-90,z:-315,r:190},{x:-460,z:-690,r:260},{x:90,z:300,r:180},{x:-320,z:140,r:190},{x:260,z:100,r:140}];
    for(let i=0;i<52;i++)groves.push({x:(random()-.5)*9700,z:(random()-.53)*9600,r:210+random()*390});
    const foliage=[0x477447,0x648044,0x7a904b,0x527c58,0x8a9654,0x3e6c57];
    for(let i=0;i<gameConfig.world.treeCount*3;i++){
      const grove=groves[Math.floor(random()*(i<950?8:groves.length))]!,a=random()*Math.PI*2,r=Math.sqrt(random())*grove.r;
      const x=grove.x+Math.cos(a)*r,z=grove.z+Math.sin(a)*r;
      if(Math.hypot(x,z)<181||trailClearance(x,z)<12||gameConfig.nestMarkers.some(n=>Math.hypot(x-n.position[0],z-n.position[2])<68))continue;
      const y=valleySurfaceHeight(x,z),height=19+random()*24,width=height*(.24+random()*.12),yaw=random()*Math.PI*2;
      const cold=z<-2500,conifer=cold||random()<.22;
      trunks.push({x,y:y+height*.32,z,sx:1+height*.025,sy:height*.64,sz:1+height*.025,yaw,lean:(random()-.5)*.12,color:0x8c7859});
      if(conifer){
        for(let j=0;j<3;j++)pines.push({x,y:y+height*(.43+j*.18),z,sx:width*(1-j*.24),sy:height*(.60-j*.11),sz:width*(1-j*.24),yaw,color:cold?0x789b8d:foliage[Math.floor(random()*4)]});
      }else{
        for(let j=0;j<4;j++){
          const angle=yaw+j*Math.PI*2/3,spread=j===3?0:width*.6;
          (Math.hypot(x,z)<1500?leaves:distantLeaves).push({x:x+Math.cos(angle)*spread,y:y+height*(j===3?.93:.74)+random()*2,z:z+Math.sin(angle)*spread,sx:width*(j===3?.83:1),sy:height*(.21+random()*.05),sz:width*(.84+random()*.2),yaw:angle,color:foliage[Math.floor(random()*foliage.length)]});
        }
        branches.push({x:x+width*.2,y:y+height*.51,z,sx:.8,sy:height*.32,sz:.8,yaw,lean:-.5,color:0x927657});
        branches.push({x:x-width*.22,y:y+height*.54,z,sx:.65,sy:height*.28,sz:.65,yaw,lean:.6,color:0x927657});
      }
    }
    addBatch(this.group,'GroveBranchingTrunks',new CylinderGeometry(.65,1,1,6),0xffffff,trunks);
    addBatch(this.group,'GroveSecondaryBranches',new CylinderGeometry(.3,1,1,5),0xffffff,branches);
    addBatch(this.group,'BroadleafLayeredCanopies',new IcosahedronGeometry(1,1),0xffffff,leaves);
    addBatch(this.group,'DistantBroadleafSilhouettes',new IcosahedronGeometry(1,0),0xffffff,distantLeaves);
    addBatch(this.group,'TieredEvergreenCanopies',new ConeGeometry(1,1,7),0xffffff,pines);
    this.group.userData.treeCount=trunks.length;
  }
  private addUndergrowth():void {
    const random=seededRandom(841),rocks:ScatterItem[]=[],shrubs:ScatterItem[]=[],grass:ScatterItem[]=[],flowers:ScatterItem[]=[];
    const detailPoints=valleyTrails.flatMap(t=>t.curve.getPoints(140));
    for(let i=0;i<2900;i++){
      const base=i<1900?detailPoints[Math.floor(random()*detailPoints.length)]!:{x:(random()-.5)*2100,z:(random()-.62)*2500};
      const angle=random()*Math.PI*2,r=12+random()*55,x=base.x+Math.cos(angle)*r,z=base.z+Math.sin(angle)*r;
      if(Math.hypot(x,z)<155||trailClearance(x,z)<1.2||gameConfig.nestMarkers.some(n=>Math.hypot(x-n.position[0],z-n.position[2])<33))continue;
      const y=valleySurfaceHeight(x,z),yaw=random()*Math.PI*2;
      if(i%13===0){const s=2+random()*5;rocks.push({x,y:y+s*.35,z,sx:s*1.5,sy:s*.9,sz:s,yaw,color:i%26===0?0x9d9b80:0x7a8878});}
      else if(i%4===0){const s=1.8+random()*3;shrubs.push({x,y:y+s*.5,z,sx:s,sy:s*.85,sz:s*.9,yaw,color:i%8===0?0x7f9250:0x496f46});}
      else{
        for(let j=0;j<3;j++)grass.push({x:x+(random()-.5)*2,y:y+.5,z:z+(random()-.5)*2,sx:.35+random()*.35,sy:1+random()*1.4,sz:.35+random()*.35,yaw:yaw+j*2,color:i%5===0?0xb3b075:0x779350});
        if(i%17===0)flowers.push({x,y:y+1.6,z,sx:.65,sy:.4,sz:.65,yaw,color:i%34===0?0xe8c77c:0xc5b8d2});
      }
    }
    addBatch(this.group,'TrailWeatheredBoulders',new IcosahedronGeometry(1,0),0xffffff,rocks);
    addBatch(this.group,'TrailLeafyUnderstory',new IcosahedronGeometry(1,1),0xffffff,shrubs);
    // Folded tapered blades have volume from every mounted viewing angle.
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.22,.5,.08,0,-.5,-.5,0,-.5,.5,.08,.5,.22],3));geometry.computeVertexNormals();
    // Back faces are duplicated so thin blades remain visible without transparent overdraw.
    const p=geometry.attributes.position!,positions:number[]=[];for(let i=0;i<p.count;i++)positions.push(p.getX(i),p.getY(i),p.getZ(i));
    for(let i=0;i<p.count;i+=3)for(const j of [i+2,i+1,i])positions.push(p.getX(j),p.getY(j),p.getZ(j));geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.computeVertexNormals();
    addBatch(this.group,'MeadowGrassClumps',geometry,0xffffff,grass);
    addBatch(this.group,'MeadowWildflowers',new IcosahedronGeometry(1,0),0xffffff,flowers);
  }
  private addRidges():void {
    const random=seededRandom(77),material=new MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});
    const ridges=new Group();ridges.name='LayeredRockyValleyRidges';this.group.add(ridges);
    for(let i=0;i<38;i++){
      const angle=i/38*Math.PI*2,radius=4800+Math.sin(i*9)*480,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
      const geometry=ridgeGeometry(700+i),height=420+random()*610;
      const mountain=new Mesh(geometry,material);mountain.position.set(x,terrainHeight(x,z)-15,z);mountain.scale.set(380+random()*420,height,310+random()*380);mountain.rotation.y=angle+random();ridges.add(mountain);
    }
    for(const [index,marker] of gameConfig.nestMarkers.entries()){
      if(index<1)continue;
      const count=index===1?4:7;
      for(let i=0;i<count;i++){
        const angle=i/count*Math.PI*1.1+Math.PI*.7,radius=420+random()*260;
        const x=marker.position[0]+Math.cos(angle)*radius,z=marker.position[2]+Math.sin(angle)*radius;
        if(trailClearance(x,z)<80)continue;
        const mountain=new Mesh(ridgeGeometry(index*100+i),material.clone());
        mountain.position.set(x,terrainHeight(x,z)-20,z);mountain.scale.set(110+random()*120,120+index*110+random()*190,120+random()*100);mountain.rotation.y=angle;
        (mountain.material as MeshStandardMaterial).color.set(index===3?0xc8e5e4:index===2?0x9f7664:0xa0a58b);ridges.add(mountain);
      }
    }
  }
}
