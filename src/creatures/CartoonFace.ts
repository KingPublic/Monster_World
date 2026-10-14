import { MathUtils, Mesh, Vector3 } from 'three';
import type { BufferGeometry, Object3D } from 'three';

/** Instance-owned lining repair and a localized neutral lower-lip corrective.
 * Source geometry, UVs, skin, morph channels and character identity stay intact. */
const restMouth={lowerLipVertex:2132,noseVertex:3879,halfWidth:.22,halfHeight:.085,retreat:.035}as const;
export class CartoonFace {
 private readonly geometry=new Set<BufferGeometry>();
 private readonly faces:Mesh[]=[];
 private readonly jaw:Object3D|undefined;
 private readonly jawRest=new Vector3();private readonly jawOffset=new Vector3();
 constructor(model:Object3D){
  model.updateWorldMatrix(true,true);model.updateMatrixWorld(true);
  this.jaw=model.getObjectByName('CC_Base_JawRoot');
  if(this.jaw?.parent){
   this.jawRest.copy(this.jaw.position);
   const target=this.jaw.getWorldPosition(new Vector3()).add(new Vector3(0,0,.07));
   this.jawOffset.copy(this.jaw.parent.worldToLocal(target)).sub(this.jawRest);
  }
  model.traverse(node=>{
   if(!(node instanceof Mesh))return;
   if(node.morphTargetDictionary&&node.morphTargetInfluences)this.faces.push(node);
   if(Array.isArray(node.material)||node.material.name!=='Std_Skin_Head1')return;
   const source=node.geometry,uv=source.getAttribute('uv'),index=source.index;if(!uv||!index||node.morphTargetDictionary?.Mouth_Plosive===undefined)return;
   const lining=(vertex:number)=>{const u=uv.getX(vertex),v=uv.getY(vertex);return v>.84&&v<.985&&((u>.105&&u<.235)||(u>.765&&u<.895));};
   const retained:number[]=[];
   for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);if(!lining(a)||!lining(b)||!lining(c))retained.push(a,b,c);}
   if(retained.length===index.count)return;
   const local=source.clone();local.setIndex(retained);
   // Actual supplied lower lip projects beyond the nose even after jaw closure.
   // Source expression morphs barely change that profile. Correct only the lip
   // support, in the reviewed canonical rest skin; do not narrow it or move chin.
   const positions=local.getAttribute('position'),original=source.getAttribute('position'),normals=source.getAttribute('normal'),changed=new Set<number>(),inverse=node.matrixWorld.clone().invert();
   if(positions.count>restMouth.noseVertex){
    const lip=node.getVertexPosition(restMouth.lowerLipVertex,new Vector3()).applyMatrix4(node.matrixWorld),nose=node.getVertexPosition(restMouth.noseVertex,new Vector3()).applyMatrix4(node.matrixWorld),world=new Vector3(),target=new Vector3(),base=new Vector3();
    for(let i=0;i<positions.count;i++){
     if(uv.getX(i)<.35||uv.getX(i)>.65||uv.getY(i)<.48||uv.getY(i)>.57)continue;
     node.getVertexPosition(i,world).applyMatrix4(node.matrixWorld);
     const dx=(world.x-lip.x)/restMouth.halfWidth,dy=(world.y-lip.y)/restMouth.halfHeight,falloff=Math.pow(Math.max(0,1-dx*dx-dy*dy),2),front=MathUtils.clamp((nose.z+.035-world.z)/.105,0,1),weight=falloff*front;
     if(weight<.00001)continue;
     base.copy(world).applyMatrix4(inverse);target.copy(world).add(new Vector3(0,0,restMouth.retreat*weight)).applyMatrix4(inverse).sub(base);
     positions.setXYZ(i,original.getX(i)+target.x,original.getY(i)+target.y,original.getZ(i)+target.z);changed.add(i);
    }
    positions.needsUpdate=true;local.computeVertexNormals();
    if(normals){const localNormals=local.getAttribute('normal');for(let i=0;i<normals.count;i++)if(!changed.has(i))localNormals.setXYZ(i,normals.getX(i),normals.getY(i),normals.getZ(i));}
    local.computeBoundingBox();local.computeBoundingSphere();
   }
   node.userData.restMouthVertices=changed.size;node.geometry=local;this.geometry.add(local);
  });
  this.jaw?.position.copy(this.jawRest);
 }
 update(time:number):void {
  // Source lower lip sits .114u ahead of the nasal profile. A fixed .07u
  // retreat in rest-head coordinates preserves lip shape and never accumulates.
  this.jaw?.position.copy(this.jawRest).add(this.jawOffset);
  const phase=time%4.3,blink=phase>4.05?Math.sin((phase-4.05)/.25*Math.PI):0;
  for(const face of this.faces){const targets=face.morphTargetDictionary!,weights=face.morphTargetInfluences!;
   for(const [name,value]of [['Eye_Blink',.22+blink*.66],['Mouth_Smile',0],['Mouth_Plosive',.6],['Mouth_Lips_Tuck',.25],['Mouth_Bottom_Lip_Under',.35]] as const){const index=targets[name];if(index!==undefined)weights[index]=value;}
  }
 }
 clear():void {this.jaw?.position.copy(this.jawRest);for(const geometry of this.geometry)geometry.dispose();this.geometry.clear();this.faces.length=0;}
}
