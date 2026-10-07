import { Bone, Box3, Group, Mesh, SkinnedMesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { Object3D } from 'three';
import { disposeScene } from '../utils/scene';

export interface AssetReport { nodes: number; meshes: number; materials: number; bones: number; skinnedMeshes: number; clips: number; }
export class AssetSystem {
  private disposed = false;
  private readonly loader = new GLTFLoader();
  async loadShowcase(url: string, parent: Group, span: number): Promise<AssetReport | undefined> {
    const gltf = await this.loader.loadAsync(url);
    if (this.disposed) { disposeScene(gltf.scene); return undefined; }
    const report: AssetReport = { nodes: 0, meshes: 0, materials: 0, bones: 0, skinnedMeshes: 0, clips: gltf.animations.length };
    const materials = new Set();
    gltf.scene.traverse((node: Object3D) => {
      report.nodes++;
      if (node instanceof Bone) report.bones++;
      if (node instanceof SkinnedMesh) report.skinnedMeshes++;
      if (node instanceof Mesh) {
        report.meshes++; node.castShadow = true; node.receiveShadow = true;
        (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
      }
    });
    report.materials = materials.size;
    const box = new Box3().setFromObject(gltf.scene);
    const size = box.getSize(new Vector3()), center = box.getCenter(new Vector3());
    const largest = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(largest) || largest <= 0) { disposeScene(gltf.scene); throw new Error('Dragon GLB has no finite visible bounds'); }
    const scale = span / largest;
    gltf.scene.scale.multiplyScalar(scale);
    gltf.scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    gltf.scene.name = 'NatureYoungDragon_StaticShowcase';
    parent.add(gltf.scene);
    console.info('[Monster World] Dragon GLB loaded', report);
    return report;
  }
  dispose(): void { this.disposed = true; }
}
