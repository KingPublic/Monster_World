import { BoxGeometry, ConeGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry, TorusGeometry, Texture } from 'three';
import type { Material, Object3D } from 'three';

/** Shared primitive geometry/materials keep procedural composition inexpensive. */
export class Parts {
  private readonly geometries = {
    box: new BoxGeometry(1, 1, 1), cylinder: new CylinderGeometry(1, 1, 1, 12),
    cone: new ConeGeometry(1, 1, 8), sphere: new SphereGeometry(1, 12, 8),
    ring: new TorusGeometry(1, 0.13, 5, 24),
  };
  private readonly materials = new Map<number, MeshStandardMaterial>();
  add(parent: Object3D, shape: keyof Parts['geometries'], color: number, position: readonly number[], scale: readonly number[]): Mesh {
    let material = this.materials.get(color);
    if (!material) {
      material = new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.03 });
      this.materials.set(color, material);
    }
    const mesh = new Mesh(this.geometries[shape], material);
    mesh.position.set(position[0]!, position[1]!, position[2]!);
    mesh.scale.set(scale[0]!, scale[1]!, scale[2]!);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  group(parent: Object3D, name: string, x = 0, y = 0, z = 0): Group {
    const group = new Group(); group.name = name; group.position.set(x, y, z); parent.add(group); return group;
  }
}

/** Deduplicated cleanup includes GLB textures and primitive resources. */
export function disposeScene(root: Object3D): void {
  const geometries = new Set<BoxGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.forEach(material => {
      materials.add(material);
      Object.values(material).forEach(value => { if (value instanceof Texture) textures.add(value); });
    });
  });
  textures.forEach(texture => { texture.dispose(); const img = texture.image; if (typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap) img.close(); });
  materials.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose());
  root.clear();
}
