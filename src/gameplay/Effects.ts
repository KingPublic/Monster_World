import { Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
export class Effects {
  readonly root = new Group();
  private readonly geometry = new IcosahedronGeometry(0.4,0);
  private readonly particles: {mesh:Mesh;velocity:Vector3;life:number}[] = [];
  burst(position:Vector3,color=0xffde84,count=22): void {
    for(let i=0;i<Math.min(count,40);i++) {
      const material=new MeshBasicMaterial({color,transparent:true});
      const mesh=new Mesh(this.geometry,material);mesh.position.copy(position);
      const velocity=new Vector3((Math.random()-.5)*16,4+Math.random()*15,(Math.random()-.5)*16);
      this.root.add(mesh);this.particles.push({mesh,velocity,life:1.5});
    }
  }
  update(dt:number):void {
    for(let i=this.particles.length-1;i>=0;i--) {
      const p=this.particles[i]!;p.life-=dt;p.velocity.y-=12*dt;p.mesh.position.addScaledVector(p.velocity,dt);
      (p.mesh.material as MeshBasicMaterial).opacity=Math.max(0,p.life/1.5);
      if(p.life<=0) {p.mesh.removeFromParent();(p.mesh.material as MeshBasicMaterial).dispose();this.particles.splice(i,1);}
    }
  }
  dispose():void {this.particles.forEach(p=>(p.mesh.material as MeshBasicMaterial).dispose());this.root.clear();this.geometry.dispose();}
}
