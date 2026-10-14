import {BufferGeometry,Float32BufferAttribute,Group,IcosahedronGeometry} from 'three';
import {addBatch,seededRandom}from './Landscape';import type{ScatterItem}from './Landscape';
import {cityGroundHeight,cityPaving,citySolids,insideUpperCourt}from './SanctuaryLayout';
/** Low planted detail on lawns; services, roads, stairs and companion lanes stay clear. */
export class CityPlanting {
 readonly root=new Group();private readonly wind={value:0};
 constructor(){
  this.root.name='SanctuaryGrassAndWildflowers';const random=seededRandom(43019),grass:ScatterItem[]=[],flowers:ScatterItem[]=[],shrubs:ScatterItem[]=[];
  for(let i=0;i<3100;i++){
   const x=(random()-.5)*416,z=(random()-.5)*416,r=Math.hypot(x,z);if(r>208||r<36||Math.abs(r-172)<12||insideUpperCourt(x,z))continue;
   if(cityPaving.some(p=>Math.abs(x-p.x)<p.width/2+2&&Math.abs(z-p.z)<p.depth/2+2)||citySolids.some(p=>Math.abs(x-p.x)<p.halfX+4&&Math.abs(z-p.z)<p.halfZ+4))continue;
   if(x>27&&x<101&&z>-32&&z<70||x>-119&&x<-75&&z>54&&z<101||Math.abs(x)<20&&z<-28&&z>-70||Math.hypot(x+62,z-46)<28||Math.hypot(x+60,z)<24)continue;
   const y=cityGroundHeight(x,z),h=.45+random()*.55,yaw=random()*Math.PI*2;
   grass.push({x,y:y+h/2,z,sx:.7+random()*.6,sy:h,sz:.7+random()*.6,yaw,color:[0x75844f,0x849357,0x9da269,0x55755b][i%4]});
   if(i%17===0)flowers.push({x,y:y+h+.12,z,sx:.22,sy:.14,sz:.22,color:i%2?0xdfc787:0xc7b1c9});
   if(i%83===0&&r>125)shrubs.push({x,y:y+.55,z,sx:1.15,sy:.62,sz:.85,color:0x718264});
  }
  const triangle=[-.5,-.5,0,.5,-.5,0,.15,.5,.06,0,-.5,-.5,0,-.5,.5,.06,.5,.15],vertices=[...triangle];for(let i=0;i<triangle.length;i+=9)vertices.push(...triangle.slice(i+6,i+9),...triangle.slice(i+3,i+6),...triangle.slice(i,i+3));
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const blades=addBatch(this.root,'CityShortMeadowGrass',geometry,0xffffff,grass);
  const material=Array.isArray(blades.material)?blades.material[0]!:blades.material;material.onBeforeCompile=shader=>{shader.uniforms.cityWindTime=this.wind;shader.vertexShader='uniform float cityWindTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
   #ifdef USE_INSTANCING
   vec4 meadow=instanceMatrix*vec4(position,1.0);transformed.x+=sin(meadow.x*.22+meadow.z*.1+cityWindTime*.85)*.07*max(position.y+.5,0.0);
   #endif`);};material.customProgramCacheKey=()=> 'monster-world-city-grass-wind-v1';
  addBatch(this.root,'CityWildflowers',new IcosahedronGeometry(1,1),0xffffff,flowers);addBatch(this.root,'CitySoftShrubs',new IcosahedronGeometry(1,1),0xffffff,shrubs);
 }
 update(dt:number):void{this.wind.value+=Math.min(.1,Math.max(0,dt));}
}
