import { BackSide, Color, Group, Mesh, Scene, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
/** Daylight sky, soft clouds and reflected ambient light share one palette. */
export class Atmosphere {
  readonly root = new Group();
  private readonly material = new ShaderMaterial({
    side: BackSide, depthWrite: false, fog: false, toneMapped: false,
    uniforms: { time: { value: 0 }, zenith: { value: new Color(0x719dbf) }, horizon: { value: new Color(0xd6dfd8) }, sun: { value: new Vector3(-.5, .75, .35).normalize() } },
    vertexShader: `varying vec3 direction; void main(){direction=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `uniform float time; uniform vec3 zenith,horizon,sun; varying vec3 direction;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      void main(){vec3 d=normalize(direction);float h=pow(max(d.y,0.0),.48);vec3 c=mix(horizon,zenith,h);
      vec2 p=d.xz/max(d.y,.09)*1.9+vec2(time*.004,0.);float n=noise(p)*.55+noise(p*2.1)*.28+noise(p*4.3)*.17;
      float clouds=smoothstep(.58,.78,n)*smoothstep(.05,.2,d.y)*(1.-smoothstep(.7,.92,d.y));c=mix(c,vec3(.88,.9,.86),clouds*.78);
      float glow=pow(max(dot(d,sun),0.0),24.);c+=vec3(.16,.11,.04)*glow;c+=vec3(.5,.38,.18)*smoothstep(.9995,.9999,dot(d,sun));
      gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`,
  });
  private readonly geometry = new SphereGeometry(9000, 32, 16);
  constructor() { this.root.name = 'ValleyDaylightAtmosphere'; const sky = new Mesh(this.geometry, this.material); sky.frustumCulled = false; sky.renderOrder = -100; this.root.add(sky); }
  reflectionScene(): Scene { const scene = new Scene(); scene.add(this.root.clone()); return scene; }
  update(dt: number, position: Vector3): void { this.material.uniforms.time!.value += dt; this.root.position.copy(position); }
  dispose(): void { this.root.removeFromParent(); this.geometry.dispose(); this.material.dispose(); this.root.clear(); }
}
