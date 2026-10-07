import { Float32BufferAttribute, Color, ConeGeometry, CylinderGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Parts } from '../utils/scene';

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

export class Environment {
  readonly group = new Group();
  constructor() {
    this.group.name = 'SurroundingWorld_Terrain';
    const config = gameConfig.world;
    const geometry = new PlaneGeometry(config.extent, config.extent, config.terrainSegments, config.terrainSegments);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position!;
    const colors: number[] = [], color = new Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i), height = terrainHeight(x, z);
      positions.setY(i, height - 1);
      const volcano = gameConfig.nestMarkers[2]!, frost = gameConfig.nestMarkers[3]!;
      if (Math.hypot(x - frost.position[0], z - frost.position[2]) < 1000) color.set(0xb6cbcb);
      else if (Math.hypot(x - volcano.position[0], z - volcano.position[2]) < 850) color.set(0x796962);
      else color.set(height > 140 ? 0x7e8f78 : 0x7eaa80);
      color.multiplyScalar(0.93 + Math.sin(x * 0.037 + z * 0.029) * 0.05);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const ground = new Mesh(geometry, new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
    ground.receiveShadow = true; this.group.add(ground);
    // Instanced foliage covers distance cheaply; deterministic seed keeps review repeatable.
    let seed: number = config.seed;
    const random = (): number => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const trunks = new InstancedMesh(new CylinderGeometry(1, 1.4, 1, 5), new MeshStandardMaterial({ color: 0x715942 }), config.treeCount);
    const crowns = new InstancedMesh(new ConeGeometry(1, 1, 7), new MeshStandardMaterial({ color: 0x3d765f, flatShading: true }), config.treeCount);
    const matrix = new Matrix4(), scale = new Vector3(); let actual = 0;
    for (let i = 0; i < config.treeCount; i++) {
      const x = (random() - 0.5) * 3100, z = (random() - 0.7) * 3400;
      if (Math.hypot(x, z) < 195 || gameConfig.nestMarkers.some(n => Math.hypot(x - n.position[0], z - n.position[2]) < 100)) continue;
      const height = 12 + random() * 25, y = terrainHeight(x, z);
      matrix.makeScale(1.4, height * 0.5, 1.4).setPosition(x, y + height * 0.25, z); trunks.setMatrixAt(actual, matrix);
      scale.set(height * 0.24, height, height * 0.24); matrix.makeScale(scale.x, scale.y, scale.z).setPosition(x, y + height * 0.8, z); crowns.setMatrixAt(actual, matrix); actual++;
    }
    trunks.count = actual; crowns.count = actual; this.group.add(trunks, crowns);
    const p = new Parts();
    // Background ridges frame the larger valley, with distinct regional silhouettes.
    for (let i = 0; i < 24; i++) {
      const angle = i / 24 * Math.PI * 2, radius = 4900 + Math.sin(i * 13) * 400;
      const x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
      const height = 350 + (i % 5) * 160;
      const mountain = p.add(this.group, 'cone', i % 3 === 0 ? 0xc3d5d2 : 0x829e98, [x, height / 2, z], [450 + i % 3 * 80, height, 500]);
      mountain.castShadow = false;
    }
    const volcano = gameConfig.nestMarkers[2]!;
    p.add(this.group, 'cone', 0x6f625f, [volcano.position[0] + 240, 520, volcano.position[2] - 280], [310, 760, 310]);
    p.add(this.group, 'cone', 0xde946f, [volcano.position[0] + 240, 880, volcano.position[2] - 280], [30, 35, 30]);
    const frost = gameConfig.nestMarkers[3]!;
    p.add(this.group, 'cone', 0xb6d5d9, [frost.position[0] - 210, 700, frost.position[2] - 240], [380, 900, 380]);
  }
}
