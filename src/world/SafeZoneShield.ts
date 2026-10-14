import { CircleGeometry, CylinderGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, ShaderMaterial, TorusGeometry } from 'three';
import { disposeScene } from '../utils/scene';
/** The visual cylinder follows radius/altitude delivery semantics exactly. */
export class SafeZoneShield {
  readonly root = new Group();
  readonly rootGroup = this.root;
  private readonly field: ShaderMaterial;
  private disposed = false;
  constructor(readonly radius=145,readonly altitude=100){
    this.root.name='SanctuaryProtectiveField';
    this.root.userData.boundary={radius,altitude,shape:'cylinder'};
    this.field=new ShaderMaterial({
      transparent:true,depthWrite:false,side:DoubleSide,
      uniforms:{time:{value:0},radius:{value:radius}},
      vertexShader:`varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;varying float vRoof;void main(){vLocal=(modelMatrix*vec4(position,1.0)).xyz;vRoof=step(.9,abs((mat3(modelMatrix)*normal).y));vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
      fragmentShader:`uniform float time;uniform float radius;varying vec3 vNormal;varying vec3 vView;varying vec3 vLocal;varying float vRoof;void main(){float edge=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0);vec2 p=mix(vec2(atan(vLocal.z,vLocal.x)*radius,vLocal.y),vLocal.xz,vRoof)/9.0;vec2 spacing=vec2(1.732,3.0);vec2 a=mod(p,spacing)-spacing*.5;vec2 b=mod(p-vec2(.866,1.5),spacing)-spacing*.5;vec2 cell=abs(dot(a,a)<dot(b,b)?a:b);float seam=1.0-smoothstep(.015,.045,.866-max(cell.x,dot(cell,vec2(.5,.866))));float wave=pow(.5+.5*sin(vLocal.y*.16-time*.7),20.0);float alpha=mix(.006,.003,vRoof)+edge*.16+wave*.012+seam*.048;gl_FragColor=vec4(.70,.82,1.,alpha);}`,
    });
    const wall=new Mesh(new CylinderGeometry(radius,radius,altitude,80,8,true),this.field);wall.name='ShieldCylinderWall';wall.position.y=altitude/2;wall.renderOrder=5;this.root.add(wall);
    const roof=new Mesh(new CircleGeometry(radius,80),this.field);roof.name='ShieldAltitudeCeiling';roof.rotation.x=-Math.PI/2;roof.position.y=altitude;roof.renderOrder=4;this.root.add(roof);
    const rimMaterial=new MeshBasicMaterial({color:0xc2d8ff,transparent:true,opacity:.52,depthWrite:false});
    for(const [name,y]of [['ShieldGroundRim',.45],['ShieldUpperRim',altitude]] as const){const rim=new Mesh(new TorusGeometry(radius,.48,5,80),rimMaterial);rim.name=name;rim.rotation.x=Math.PI/2;rim.position.y=y;rim.renderOrder=6;this.root.add(rim);}
    // Eight slender light strokes provide height cues without opaque perimeter props.
    const strokeGeometry=new CylinderGeometry(.2,.2,altitude,4),strokeMaterial=new MeshBasicMaterial({color:0xc8deff,transparent:true,opacity:.16,depthWrite:false});
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,stroke=new Mesh(strokeGeometry,strokeMaterial);stroke.name='ShieldEnergyStroke';stroke.position.set(Math.cos(a)*radius,altitude/2,Math.sin(a)*radius);this.root.add(stroke);}
  }
  update(dt:number):void{if(!this.disposed&&Number.isFinite(dt)&&dt>0)this.field.uniforms.time!.value+=Math.min(dt,.1);}
  dispose():void{if(this.disposed)return;this.disposed=true;disposeScene(this.root);this.root.removeFromParent();}
}
