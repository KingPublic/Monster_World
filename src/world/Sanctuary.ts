import { Group } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Parts } from '../utils/scene';

export interface WorldLabel { text: string; position: readonly [number, number, number]; color?: string; range: number; }
export class Sanctuary {
  readonly group = new Group();
  readonly dragonStage = new Group();
  readonly dragonFallback = new Group();
  readonly labels: WorldLabel[] = [];
  private readonly parts = new Parts();
  private readonly colors = { stone: 0xcca982, edge: 0xe7cda4, timber: 0x735039, roof: 0x286864, gold: 0xc79e55, dark: 0x344c49, light: 0xffd086, leaf: 0x5e9363 };
  constructor() {
    this.group.name = 'DragonSanctuary_Composition';
    const p = this.parts, c = this.colors, g = this.group;
    // Overlapping terraces establish a connected city foundation, not floating kiosks.
    p.add(g, 'box', c.stone, [-14, 4, 12], [88, 8, 122]);
    p.add(g, 'box', c.stone, [0, 8.5, -49], [118, 17, 72]);
    p.add(g, 'box', c.stone, [0, 14, -83], [66, 28, 44]);
    p.add(g, 'box', c.stone, [72, 8.5, 14], [58, 17, 83]);
    p.add(g, 'box', c.edge, [-14, 8.15, 12], [89, 0.3, 122]);
    p.add(g, 'box', c.edge, [0, 17.15, -49], [119, 0.3, 72]);
    p.add(g, 'box', c.edge, [0, 28.15, -83], [67, 0.3, 44]);
    p.add(g, 'box', c.edge, [72, 17.15, 14], [59, 0.3, 84]);
    // Broad main street, paved plaza, approach and connected district stairs.
    p.add(g, 'cylinder', 0xe4c09a, [0, 8.5, 25], [25, 0.5, 25]);
    p.add(g, 'box', c.dark, [0, 8.6, 25], [6, 0.2, 90]);
    this.stairs(0, 8, -10, 15, 10, 0.9, -1);
    this.stairs(0, 17, -57, 18, 11, 1, -1);
    this.stairs(0, 0, 86, 18, 8, 1, -1);
    p.add(g, 'box', c.edge, [0, 0.3, 124], [18, 0.6, 74]);
    // Watercourse, planted court and bridge into the Mount district.
    p.add(g, 'box', 0x58a6aa, [36.5, 6.4, 30], [12, 0.3, 83]);
    const bridge = p.group(g, 'GardenBridge', 38, 17.6, -12);
    p.add(bridge, 'box', c.timber, [0, 0, 0], [31, 1, 10]);
    for (const z of [-5, 5]) {
      p.add(bridge, 'box', c.timber, [0, 3, z], [31, 0.5, 0.5]);
      for (const x of [-14, 0, 14]) p.add(bridge, 'box', c.gold, [x, 1.5, z], [0.7, 3, 0.7]);
    }
    this.building('Hatchery', 0, 28, -84, 27, 28, c.roof);
    p.add(g, 'sphere', c.gold, [0, 69, -84], [9, 13, 9]);
    this.building('Collection Hall', -41, 17, -47, 24, 23, 0x386b7c);
    this.building('Rider Hall', 44, 17, -48, 21, 29, 0x394e72);
    this.building('Food Shop', -42, 8, 20, 19, 16, 0xab6757);
    const awning = p.add(g, 'box', 0xd18c69, [-42, 18, 33], [21, 1, 10]); awning.rotation.x = -0.15;
    for (const x of [-51, -33]) p.add(g, 'cylinder', c.timber, [x, 13, 36], [0.5, 10, 0.5]);
    // Homes wrap the streets to make a compact inhabited settlement.
    for (const [x, z, height] of [[-44, 55, 13], [-21, 62, 10], [18, 59, 13], [-51, -12, 11], [76, -11, 12], [87, 43, 10], [-73, -50, 14], [71, -75, 13]]) {
      const base = x! < -60 || z! < -65 ? 0 : x! > 60 || z! < -10 ? 17 : 8;
      this.building('Sanctuary Home', x!, base, z!, 12, height!, c.roof, false);
    }
    // Plaza fountain with warm stone rim and a slender magical central landmark.
    p.add(g, 'cylinder', c.stone, [0, 9.5, 24], [9, 2, 9]);
    p.add(g, 'cylinder', 0x66bdbe, [0, 10.6, 24], [7.5, 0.25, 7.5]);
    p.add(g, 'cylinder', c.gold, [0, 13, 24], [2, 5, 2]);
    p.add(g, 'cone', 0xa6e2ce, [0, 22, 24], [4, 15, 4]);
    // Arrival arch, low walls, banners and paired stylized Dragon memorials.
    for (const x of [-13, 13]) this.tower(x, 8, 70, 6, 20);
    p.add(g, 'box', c.stone, [0, 25, 70], [26, 5, 5]);
    for (const x of [-13, 13]) this.banner(x, 8, 55);
    for (const x of [-27, 27]) this.statue(x, 8, 54);
    for (const [x, z, y] of [[-55, 39, 8], [55, -26, 17], [-30, -80, 28], [31, -82, 28], [-22, 7, 8], [21, 43, 8], [90, 4, 17]]) this.tree(x!, y!, z!, 13);
    for (const [x, z, y] of [[-16, 45, 8], [16, 45, 8], [-15, -29, 17], [15, -29, 17], [-30, -45, 17], [30, -45, 17], [-17, -71, 28], [17, -71, 28]]) this.lantern(x!, y!, z!);
    p.add(g, 'cylinder', c.gold, [54, 17.6, 22], [19, 1.2, 19]);
    p.add(g, 'cylinder', c.dark, [54, 18.25, 22], [17, 0.2, 17]);
    this.dragonStage.name = 'NatureYoungDragon_ShowcaseStage';
    this.dragonStage.position.set(...gameConfig.sanctuary.dragonPosition);
    g.add(this.dragonStage);
    this.dragonStage.add(this.dragonFallback);
    // Neutral sculptural stand-in stays visible only while loading or on failure.
    new Parts().add(this.dragonFallback, 'sphere', c.leaf, [0, 6, 0], [5, 4, 8]);
    new Parts().add(this.dragonFallback, 'cone', c.gold, [0, 12, -4], [3, 8, 3]);
    this.labels.push({ text: 'Hatchery', position: [0, 87, -84], range: 750 }, { text: 'Collection Hall', position: [-41, 62, -47], range: 650 }, { text: 'Rider Hall', position: [44, 69, -48], range: 650 }, { text: 'Food Shop', position: [-42, 41, 20], range: 650 }, { text: 'Mount Court', position: [54, 43, 22], range: 650 });
  }
  private stairs(x: number, y: number, z: number, width: number, count: number, rise: number, direction: number): void {
    for (let i = 0; i < count; i++) this.parts.add(this.group, 'box', this.colors.edge, [x, y + (i + 1) * rise / 2, z + direction * i * 2.2], [width, (i + 1) * rise, 2.3]);
  }
  private building(name: string, x: number, y: number, z: number, width: number, height: number, roof: number, service = true): void {
    const p = this.parts, c = this.colors, b = p.group(this.group, name, x, y, z);
    p.add(b, 'box', c.stone, [0, height / 2, 0], [width, height, width * 0.8]);
    p.add(b, 'box', c.gold, [0, height * 0.78, 0], [width + 0.6, 0.8, width * 0.8 + 0.6]);
    const cap = p.add(b, 'cone', roof, [0, height + width * 0.4, 0], [width * 0.83, width * 0.8, width * 0.83]); cap.rotation.y = Math.PI / 4;
    p.add(b, 'sphere', c.gold, [0, height + width * 0.82, 0], [0.8, 1.6, 0.8]);
    p.add(b, 'box', c.timber, [0, 3.5, width * 0.4 + 0.2], [4, 7, 0.4]);
    p.add(b, 'sphere', c.timber, [0, 7, width * 0.4 + 0.15], [2, 2, 0.3]);
    for (const xx of [-width * 0.3, width * 0.3]) {
      p.add(b, 'box', c.timber, [xx, height / 2, width * 0.4 + 0.25], [0.8, height, 0.7]);
      p.add(b, 'box', c.light, [xx, height * 0.55, width * 0.4 + 0.35], [2, 3.5, 0.3]);
    }
    if (service) for (const xx of [-width * 0.46, width * 0.46]) this.tower(x + xx, y, z - width * 0.25, 3.2, height + 4);
  }
  private tower(x: number, y: number, z: number, radius: number, height: number): void {
    const p = this.parts, c = this.colors;
    p.add(this.group, 'cylinder', c.stone, [x, y + height / 2, z], [radius, height, radius]);
    p.add(this.group, 'cone', c.roof, [x, y + height + radius, z], [radius * 1.3, radius * 3, radius * 1.3]);
    p.add(this.group, 'sphere', c.gold, [x, y + height + radius * 2.6, z], [0.8, 1.4, 0.8]);
  }
  private tree(x: number, y: number, z: number, height: number): void {
    const p = this.parts, c = this.colors;
    p.add(this.group, 'cylinder', c.timber, [x, y + height / 3, z], [1, height * 0.65, 1]);
    p.add(this.group, 'sphere', c.leaf, [x, y + height * 0.8, z], [height * 0.38, height * 0.44, height * 0.38]);
    p.add(this.group, 'cylinder', c.stone, [x, y + 0.6, z], [5, 1.2, 5]);
  }
  private lantern(x: number, y: number, z: number): void {
    const p = this.parts, c = this.colors;
    p.add(this.group, 'cylinder', c.timber, [x, y + 5, z], [0.4, 10, 0.4]);
    p.add(this.group, 'box', c.light, [x, y + 10.2, z], [2, 2.8, 2]);
    p.add(this.group, 'cone', c.roof, [x, y + 12, z], [1.7, 1.5, 1.7]);
  }
  private banner(x: number, y: number, z: number): void {
    this.parts.add(this.group, 'cylinder', this.colors.gold, [x, y + 10, z], [0.25, 20, 0.25]);
    this.parts.add(this.group, 'box', this.colors.roof, [x + 2.5, y + 15, z], [5, 7, 0.2]);
    this.parts.add(this.group, 'sphere', this.colors.gold, [x, y + 20, z], [0.6, 0.6, 0.6]);
  }
  private statue(x: number, y: number, z: number): void {
    const p = this.parts, c = this.colors;
    p.add(this.group, 'cylinder', c.stone, [x, y + 2, z], [3.2, 4, 3.2]);
    p.add(this.group, 'sphere', c.gold, [x, y + 7, z], [2.4, 3, 2.4]);
    p.add(this.group, 'sphere', c.gold, [x, y + 10, z - 1.5], [2, 1.5, 2.7]);
    for (const dir of [-1, 1]) { const wing = p.add(this.group, 'cone', c.gold, [x + dir * 3, y + 8, z], [1.2, 6, 0.6]); wing.rotation.z = dir * -0.65; }
  }
}
