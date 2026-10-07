import {
  BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial,
  OctahedronGeometry, Quaternion, SphereGeometry, TorusGeometry, Vector3,
} from 'three';

export type EggRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
const COLORS: Record<EggRarity, { shell: number; glow: number; metallic: number }> = {
  Common: { shell: 0xf3ead0, glow: 0xc5dd93, metallic: 0.02 },
  Uncommon: { shell: 0xcce6ad, glow: 0x80e773, metallic: 0.08 },
  Rare: { shell: 0x98d3c4, glow: 0x65c7ff, metallic: 0.13 },
  Epic: { shell: 0xb9b0d0, glow: 0xc185ff, metallic: 0.18 },
};

function leafGeometry(): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([
    0, 1, 0, 0.45, 0.2, 0, 0, -0.6, 0, -0.45, 0.2, 0, 0, 0.18, 0.14,
  ], 3));
  geometry.setIndex([0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0, 0, 2, 3, 0, 1, 2]);
  geometry.computeVertexNormals(); return geometry;
}

/** Self-contained resources, safe to dispose with disposeScene. Origin is the shell's base. */
export function createEgg(rarity: EggRarity, element: 'Nature' = 'Nature'): Group {
  const egg = new Group(); egg.name = element + '-' + rarity + '-Egg';
  egg.userData.rarity = rarity; egg.userData.element = element;
  const colors = COLORS[rarity];
  const shellGeometry = new SphereGeometry(1, 18, 14);
  const position = shellGeometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    // Round lower shell, gently tapered crown, without a pointed cone silhouette.
    const width = 0.92 * (1 - (y + 1) * 0.09);
    position.setXYZ(i, position.getX(i) * width, y * 1.3, position.getZ(i) * width);
  }
  shellGeometry.computeVertexNormals();
  const shellMaterial = new MeshStandardMaterial({ color: colors.shell, roughness: 0.48, metalness: colors.metallic });
  const shell = new Mesh(shellGeometry, shellMaterial);
  shell.name = 'egg-shell'; shell.position.y = 1.3;
  shell.castShadow = true; shell.receiveShadow = true; egg.add(shell);
  const leaf = leafGeometry();
  const leafMaterial = new MeshStandardMaterial({ color: 0x48884e, roughness: 0.66, flatShading: true });
  const leafLight = new MeshStandardMaterial({ color: 0x90b859, roughness: 0.68, flatShading: true });
  const trim = new MeshStandardMaterial({ color: 0xd6bb71, roughness: 0.4, metalness: 0.25 });
  const seedGeometry = new OctahedronGeometry(1, 0);
  const glowMaterial = new MeshStandardMaterial({
    color: colors.glow, emissive: colors.glow, emissiveIntensity: rarity === 'Common' ? 0.08 : 0.5,
    roughness: 0.4, metalness: 0.12,
  });
  const forward = new Vector3(0, 0, 1);
  // Nature motifs stay green at every rarity. Small seeds and trim supply rarity color.
  for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 0.4 + ring * 0.43;
    const y = ring === 0 ? -0.33 : 0.42;
    const radius = 0.92 * (1 - (y + 1) * 0.09) * Math.sqrt(1 - y * y);
    const normal = new Vector3(Math.sin(angle), y * 0.35, Math.cos(angle)).normalize();
    const motif = new Mesh(leaf, i % 2 === 0 ? leafMaterial : leafLight);
    motif.name = 'nature-shell-leaf';
    motif.position.set(Math.sin(angle) * (radius + 0.015), 1.3 + y * 1.3, Math.cos(angle) * (radius + 0.015));
    motif.quaternion.copy(new Quaternion().setFromUnitVectors(forward, normal));
    motif.scale.set(0.28, 0.33, 0.38); motif.castShadow = true; egg.add(motif);
  }
  // A larger leaf insignia on the front reads clearly while carried.
  const emblemBorder = new Mesh(leaf, trim); emblemBorder.position.set(0, 1.33, -0.867);
  emblemBorder.rotation.y = Math.PI; emblemBorder.scale.set(0.48, 0.52, 0.6); egg.add(emblemBorder);
  const emblem = new Mesh(leaf, leafMaterial); emblem.position.set(0, 1.33, -0.905);
  emblem.rotation.y = Math.PI; emblem.scale.set(0.37, 0.43, 0.7); egg.add(emblem);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 0.4;
    const petal = new Mesh(leaf, i % 2 === 0 ? leafMaterial : leafLight);
    petal.position.set(Math.sin(angle) * 0.46, 0.27, Math.cos(angle) * 0.46);
    petal.rotation.order = 'YXZ'; petal.rotation.set(-0.72, angle, 0); petal.scale.set(0.33, 0.4, 0.6);
    petal.castShadow = true; egg.add(petal);
  }
  const collarGeometry = new TorusGeometry(0.745, 0.025, 5, 20);
  const collar = new Mesh(collarGeometry, trim); collar.position.y = 0.65; collar.rotation.x = Math.PI / 2; egg.add(collar);
  const sparkCount = rarity === 'Common' ? 3 : rarity === 'Uncommon' ? 4 : rarity === 'Rare' ? 5 : 6;
  for (let i = 0; i < sparkCount; i++) {
    const angle = i * Math.PI * 2 / sparkCount + 0.18;
    const seed = new Mesh(seedGeometry, glowMaterial);
    seed.name = 'rarity-seed'; seed.position.set(Math.sin(angle) * 0.82, 0.95 + (i % 3) * 0.42, Math.cos(angle) * 0.82);
    seed.scale.set(0.06, 0.105, 0.05); seed.rotation.z = (i % 2 ? 1 : -1) * 0.32;
    egg.add(seed);
  }
  egg.userData.shellName = 'egg-shell';
  return egg;
}
