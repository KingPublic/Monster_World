import { CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Shape } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Parts } from '../utils/scene';
import { cityBuildings, cityFoundation, cityPaving, hatcheryStair, upperCourt, sanctuaryServices, citySolids } from './SanctuaryLayout';
import type { CityBuilding } from './SanctuaryLayout';
import { batchStaticScene } from '../utils/batchStaticScene';
export interface WorldLabel{text:string;position:readonly [number,number,number];color?:string;range:number;}
export class Sanctuary {
 readonly group=new Group();readonly dragonStage=new Group();readonly dragonFallback=new Group();
 readonly labels:WorldLabel[]=[];
 readonly buildings:(CityBuilding&{group:Group})[]=[];
 readonly trees:{group:Group;width:number}[]=[];readonly arrivalTowers:Group[]=[];readonly flags:Group[]=[];readonly foodAwning=new Group();
 private readonly parts=new Parts();
 private readonly colors={stone:0xa49c87,edge:0xded4b6,timber:0x63493b,roof:0x397f80,gold:0xc9a765,dark:0x416461,light:0xffd29b,leaf:0x59825a};
 constructor(){
  const p=this.parts,c=this.colors,g=this.group;g.name='DragonSanctuary_GardenCity';
  // A low sloped landform joins the valley, avoiding the former sheer slab perimeter.
  const foundation=new Mesh(new CylinderGeometry(cityFoundation.radius,cityFoundation.apronRadius,1,96),new MeshStandardMaterial({color:0x7b9667,roughness:1}));foundation.position.y=.5;foundation.receiveShadow=true;g.add(foundation);
  const outline=new Shape();upperCourt.outline.forEach(([x,z],i)=>i?outline.lineTo(x,-z):outline.moveTo(x,-z));outline.closePath();
  const terrace=new Mesh(new ExtrudeGeometry(outline,{depth:5,bevelEnabled:false}),new MeshStandardMaterial({color:c.stone,roughness:1}));terrace.rotation.x=-Math.PI/2;terrace.position.y=1;terrace.receiveShadow=true;g.add(terrace);
  // Individual stone courses and planting soften the raised Hatchery garden.
  for(let i=0;i<upperCourt.outline.length;i++){
   const a=upperCourt.outline[i]!,b=upperCourt.outline[(i+1)%upperCourt.outline.length]!;
   if(a[1]===-62&&b[1]===-62)continue;
   const length=Math.hypot(b[0]-a[0],b[1]-a[1]);
   for(let y=1.8;y<6;y+=1.4){const edge=p.add(g,'box',y>4?c.edge:c.stone,[(a[0]+b[0])/2,y,(a[1]+b[1])/2],[length,.25,.5]);edge.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);}
  }
  // Restrained pale paving leaves generous planted ground between the districts.
  for(const r of cityPaving)p.add(g,'box',c.edge,[r.x,r.y-.03,r.z],[r.width,.06,r.depth]);
  for(const [x,z,r] of [[0,22,32],[68,20,29],[-62,46,23]]){
   const plaza=new Mesh(new CylinderGeometry(r!,r!,.06,64),new MeshStandardMaterial({color:x===68?0xd3c6a2:0xded2b5,roughness:1}));plaza.position.set(x!,1,z!);plaza.receiveShadow=true;g.add(plaza);
  }
  for(const x of [-13.5,13.5])p.add(g,'box',c.stone,[x,1.04,86],[.45,.12,80]);
  const stair=hatcheryStair,run=(stair.startZ-stair.endZ)/stair.count;
  for(let i=0;i<stair.count;i++){const h=(i+.5)/stair.count*(stair.high-stair.low);p.add(g,'box',c.edge,[stair.x,stair.low+h/2,stair.startZ-(i+.5)*run],[stair.halfWidth*2,h,run+.025]);}
  for(const b of cityBuildings){
   const group=p.group(g,b.name,b.x,b.y,b.z);group.rotation.y=b.rotation;group.userData.cityId=b.id;this.buildings.push({...b,group});
   // Calm coherent fallback, replaced only when its real model succeeds.
   p.add(group,'box',0xd1c3a3,[0,b.height*.3,0],[b.width*.82,b.height*.6,b.depth*.82]);
   const roof=p.add(group,'cone',c.roof,[0,b.height*.77,0],[b.width*.66,b.height*.4,b.depth*.66]);roof.rotation.y=Math.PI/4;
   p.add(group,'box',c.timber,[0,3,b.depth*.415],[3.5,6,.1]);
   if(b.name!=='Sanctuary Home')this.labels.push({text:b.name,position:[b.x,b.y+b.height+5,b.z],range:350});
  }
  this.fountain(0,22);
  // Quiet water garden, deliberately outside every service approach.
  p.add(g,'cylinder',c.stone,[-60,1.05,0],[21,.22,12]);
  p.add(g,'cylinder',0x529a9b,[-60,1.19,0],[19.6,.05,10.7]);
  for(let i=0;i<5;i++){const x=-72+i*5,z=2+Math.sin(i*2)*5;p.add(g,'cylinder',0x769f73,[x,1.24,z],[1.25,.05,.9]);p.add(g,'sphere',0xf2dcab,[x,1.4,z],[.4,.2,.4]);}
  if(!citySolids.some(s=>s.id==='water-garden'))citySolids.push({id:'water-garden',x:-60,z:0,halfX:20,halfZ:11,minY:1,maxY:1.3});
  // Layered grove canopies, understory and flowering beds frame clear streets.
  const trees:readonly (readonly [number,number,number,number])[]=[[-30,1,73,16],[31,1,73,17],[-84,1,18,18],[-88,1,-37,16],[-45,1,-89,17],[43,1,-85,18],[-28,6,-105,15],[28,6,-104,17],[-27,6,-76,13],[27,6,-76,14],[101,1,38,19],[93,1,66,16],[-42,1,110,17],[42,1,110,18],[-113,1,12,15],[28,1,0,13]];
  for(const [x,y,z,h] of trees)this.tree(x,y,z,h);
  for(const [x,z,w,d] of [[-30,48,9,9],[32,48,10,9],[-48,-16,12,6],[-73,-16,12,6],[44,-43,12,7],[96,-27,8,7],[-20,96,7,14],[20,96,7,14],[-31,-43,11,7],[31,-43,11,7]])this.garden(x!,1,z!,w!,d!);
  for(const [x,z] of [[-17,57],[17,57],[-17,88],[17,88],[-18,-30],[18,-30],[-82,-27],[-42,-27],[45,-27],[92,20]])this.lantern(x!,1,z!);
  for(const x of [-17,17])this.lantern(x,6,-65);
  for(const [x,z,rotation] of [[-18,20,Math.PI/2],[18,20,-Math.PI/2],[-48,12,0],[91,43,-.7]])this.bench(x!,z!,rotation!);
  // Paired real watchtowers mark the entry without an enclosing overhead arch.
  for(const x of [-24,24]){const t=p.group(g,'Arrival Watchtower',x,1,99);t.userData.cityId='arrival-'+x;this.arrivalTowers.push(t);p.add(t,'cylinder',c.timber,[0,4,0],[1,8,1]);}
  for(const [x,z] of [[-17,101],[17,101],[-20,-64],[20,-64]]){
   const flag=p.group(g,'Sanctuary Banner',x!,z!<0?6:1,z!);this.flags.push(flag);p.add(flag,'cylinder',c.gold,[0,5,0],[.18,10,.18]);p.add(flag,'box',c.roof,[1.5,7.5,0],[3,4,.1]);
  }
  // Open mount court: flush concentric inlay, no high plinth or enclosing furniture.
  for(const radius of [25.5,27]){const ring=p.add(g,'ring',radius===27?c.stone:c.gold,[68,1.08,20],[radius,radius,.4]);ring.rotation.x=-Math.PI/2;}
  this.labels.push({text:'Mount Court',position:[68,15,20],range:250});
  this.dragonStage.name='Dragon_ShowcaseStage';this.dragonStage.position.set(...gameConfig.sanctuary.dragonPosition);g.add(this.dragonStage);this.dragonStage.add(this.dragonFallback);
  p.add(this.dragonFallback,'sphere',c.leaf,[0,3,0],[3,2,5]);
  // Threshold mosaics identify the service without filling the street with props.
  for(const key of ['hatchery','shop','collection','rider'] as const){const [x,y,z]=sanctuaryServices[key];const ring=p.add(g,'ring',c.gold,[x,y+.09,z],[3.4,3.4,.2]);ring.rotation.x=-Math.PI/2;}
  batchStaticScene(g,new Set([...this.buildings.map(b=>b.group),...this.trees.map(t=>t.group),...this.arrivalTowers,...this.flags,this.dragonFallback]));
 }
 private fountain(x:number,z:number){const p=this.parts,c=this.colors,g=this.group;
  p.add(g,'cylinder',c.stone,[x,1.45,z],[7.2,.9,7.2]);p.add(g,'cylinder',c.edge,[x,2,z],[6.7,.5,6.7]);p.add(g,'cylinder',0x71b9b1,[x,2.3,z],[5.8,.08,5.8]);
  p.add(g,'cylinder',c.stone,[x,3.2,z],[1.5,2.5,1.5]);p.add(g,'cylinder',c.edge,[x,4.5,z],[3,.6,3]);p.add(g,'cylinder',0x8bd4c4,[x,4.84,z],[2.5,.07,2.5]);
  p.add(g,'sphere',0xc6d5ae,[x,6.8,z],[1.5,2,1.5]);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;p.add(g,'sphere',c.gold,[x+Math.cos(a)*6.45,2.35,z+Math.sin(a)*6.45],[.22,.22,.22]);}
 }
 private tree(x:number,y:number,z:number,h:number){const p=this.parts,c=this.colors,g=this.group;
  p.add(g,'cylinder',0x789167,[x,y+.1,z],[5,.2,5]);const crown=p.group(g,'Village Garden Tree',x,y,z);this.trees.push({group:crown,width:h*.85});p.add(crown,'cylinder',c.timber,[0,h*.34,0],[.65,h*.68,.65]);
  for(let i=0;i<5;i++){const a=i*2.4,dx=Math.cos(a)*h*.18,dz=Math.sin(a)*h*.18;const branch=p.add(crown,'cylinder',c.timber,[dx*.45,h*.54,dz*.45],[.3,h*.35,.3]);branch.rotation.z=Math.cos(a)*.6;branch.rotation.x=Math.sin(a)*.6;p.add(crown,'sphere',[0x547953,0x6c8d58,0x809955][i%3]!,[dx,h*(.73+(i%2)*.1),dz],[h*.28,h*.2,h*.27]);}
  for(let i=0;i<4;i++){const a=i*1.7;p.add(g,'sphere',0x719354,[x+Math.cos(a)*3.7,y+.8,z+Math.sin(a)*3.7],[1.7,1,1.5]);}
 }
 private garden(x:number,y:number,z:number,w:number,d:number){const p=this.parts,g=this.group;
  p.add(g,'box',0xb5ad92,[x,y+.08,z],[w,.16,d]);p.add(g,'box',0x688055,[x,y+.18,z],[w-.5,.16,d-.5]);
  for(let i=0;i<7;i++){const dx=Math.sin(i*2.37)*(w*.37),dz=Math.cos(i*3.1)*(d*.34);p.add(g,'sphere',i%2?0x7f995d:0x53734e,[x+dx,y+.65,z+dz],[1.6,.65,1.2]);if(i%2===0)p.add(g,'sphere',i%3===0?0xe1bd78:0xb7a1bd,[x+dx,y+1.25,z+dz],[.6,.55,.6]);}
 }
 private lantern(x:number,y:number,z:number){const p=this.parts,c=this.colors,g=this.group;p.add(g,'cylinder',c.stone,[x,y+.35,z],[.8,.7,.8]);p.add(g,'cylinder',c.timber,[x,y+3.4,z],[.18,6.8,.18]);p.add(g,'box',c.light,[x,y+6.8,z],[1.1,1.6,1.1]);p.add(g,'cone',c.dark,[x,y+7.9,z],[1,1,1]);}
 private bench(x:number,z:number,rotation:number){const p=this.parts,c=this.colors,b=p.group(this.group,'Garden Bench',x,1,z);b.rotation.y=rotation;p.add(b,'box',c.timber,[0,1.1,0],[5,.3,1.5]);p.add(b,'box',c.timber,[0,2,-.65],[5,1.3,.25]);for(const xx of [-1.8,1.8])p.add(b,'box',c.stone,[xx,.5,0],[.45,1,1.3]);}
}
