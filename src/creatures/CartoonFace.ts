import {CatmullRomCurve3,CylinderGeometry,Group,Matrix4,Mesh,MeshStandardMaterial,SphereGeometry,TubeGeometry,Vector3} from 'three';
import type {BufferGeometry,Material,Object3D} from 'three';

/** A clean, instance-owned cartoon head on the supplied head bone. The original
 * head, skin weights, UVs and facial morphs remain intact underneath it. */
export class CartoonFace {
 private readonly geometry=new Set<BufferGeometry>();
 private readonly materials=new Set<Material>();
 private readonly hidden=new Map<Object3D,boolean>();
 private readonly eyes:Group[]=[];
 private readonly head=new Group();
 constructor(model:Object3D){
  const bone=model.getObjectByName('CC_Base_Head'),source=model.getObjectByName('Mesh001');
  if(!bone||!(source instanceof Mesh))return;
  model.updateWorldMatrix(true,true);
  for(const name of ['Mesh001','Mesh001_6','CC_Base_Eye','Mesh002','Mesh002_1','CC_Base_Tongue']){
   const node=model.getObjectByName(name);if(node){this.hidden.set(node,node.visible);node.visible=false;}
  }
  this.head.name='CartoonFace-AuthoredHead';
  // Author in normalized character units, then convert once into the source
  // bone's bind frame. Head movement therefore follows the existing rig exactly.
  const world=bone.getWorldPosition(new Vector3()),attachment=new Matrix4().copy(bone.matrixWorld).invert().multiply(new Matrix4().makeTranslation(world.x,world.y,world.z));
  attachment.decompose(this.head.position,this.head.quaternion,this.head.scale);bone.add(this.head);
  const material=(color:number,roughness=1)=>{const m=new MeshStandardMaterial({color,roughness,metalness:0});this.materials.add(m);return m;};
  const skin=material(0x945c43),earShade=material(0x784733),brow=material(0x30251d),white=material(0xfff4dc),iris=material(0x5b3824),pupil=material(0x211b16),shine=material(0xfffaf0,.5),mouth=material(0x633c30);
  const mesh=(name:string,geometry:BufferGeometry,mat:Material,parent:Object3D=this.head)=>{this.geometry.add(geometry);const m=new Mesh(geometry,mat);m.name=name;m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
  const oval=(name:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,mat:Material,parent:Object3D=this.head)=>{const m=mesh(name,new SphereGeometry(1,32,24),mat,parent);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m;};
  const curve=(name:string,points:number[][],radius:number,mat:Material)=>mesh(name,new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(p[0],p[1],p[2]))),24,radius,6,false),mat);
  const skull=oval('CartoonFace-Skin',0,.2,-.11,.263,.405,.30,skin);
  // Keep cheeks round, with a narrower jaw and a shallow chin in profile.
  const positions=skull.geometry.getAttribute('position');for(let i=0;i<positions.count;i++){const y=positions.getY(i),lower=Math.max(0,-y);positions.setX(i,positions.getX(i)*(1-.08*lower));positions.setY(i,y<0?y*.92:y);positions.setZ(i,positions.getZ(i)*(1-.08*lower));}positions.needsUpdate=true;skull.geometry.computeVertexNormals();
  const neck=mesh('CartoonFace-Neck',new CylinderGeometry(.12,.17,.35,24),skin);neck.position.set(0,-.30,.035);
  for(const[side,sign]of[['L',1],['R',-1]]as const){
   oval('CartoonFace-Ear-'+side,sign*.256,.13,-.082,.046,.075,.043,skin);
   oval('CartoonFace-EarInner-'+side,sign*.268,.13,-.12,.018,.043,.009,earShade);
   const eye=new Group();eye.name='CartoonFace-Eye-'+side;eye.position.set(sign*.105,.255,-.386);eye.rotation.y=-sign*.35;this.head.add(eye);this.eyes.push(eye);
   oval('CartoonFace-Sclera-'+side,0,0,0,.059,.065,.013,white,eye);
   oval('CartoonFace-Iris-'+side,0,-.001,-.011,.032,.038,.006,iris,eye);
   oval('CartoonFace-Pupil-'+side,0,-.001,-.016,.018,.024,.003,pupil,eye);
   oval('CartoonFace-Glint-'+side,-.011,.014,-.019,.007,.007,.002,shine,eye);
   curve('CartoonFace-Brow-'+side,[[sign*.051,.344,-.382],[sign*.104,.354,-.369],[sign*.158,.337,-.347]],.008,brow);
  }
  const nose=new Group();nose.name='CartoonFace-Nose';this.head.add(nose);
  oval('CartoonFace-NoseBridge',0,.153,-.385,.025,.057,.029,skin,nose);
  oval('CartoonFace-NoseTip',0,.108,-.402,.043,.035,.046,skin,nose);
  curve('CartoonFace-NeutralMouth',[[-.078,-.014,-.327],[-.04,-.019,-.341],[0,-.021,-.344],[.04,-.019,-.341],[.078,-.014,-.327]],.0035,mouth);
 }
 update(time:number):void {
  const phase=time%4.3,blink=phase>4.05?Math.sin((phase-4.05)/.25*Math.PI):0;
  for(const eye of this.eyes){eye.scale.y=1-Math.max(0,blink)*.94;for(const child of eye.children)if(child.name.includes('Sclera')||child.name.includes('Glint'))child.visible=blink<.65;}
 }
 clear():void {
  this.head.removeFromParent();this.head.clear();for(const[node,visible]of this.hidden)node.visible=visible;this.hidden.clear();
  for(const geometry of this.geometry)geometry.dispose();for(const material of this.materials)material.dispose();this.geometry.clear();this.materials.clear();this.eyes.length=0;
 }
}
