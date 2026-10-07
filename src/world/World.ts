import { Group } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Parts } from '../utils/scene';
import { Environment } from './Environment';
import { Sanctuary } from './Sanctuary';
import type { WorldLabel } from './Sanctuary';

export class World {
  readonly group = new Group();
  readonly sanctuary = new Sanctuary();
  readonly labels: WorldLabel[];
  constructor() {
    this.group.name = 'MonsterWorld_Task00';
    this.group.add(new Environment().group, this.sanctuary.group);
    this.labels = [...this.sanctuary.labels, { text: 'Dragon Sanctuary · Home', position: [0, 92, 0], range: 14000 }];
    const parts = new Parts();
    for (const marker of gameConfig.nestMarkers) {
      const [x, y, z] = marker.position, nest = parts.group(this.group, 'NonFunctionalNest_' + marker.id, x, y, z);
      parts.add(nest, 'cylinder', 0x797765, [0, -8, 0], [38, 20, 38]);
      parts.add(nest, 'cylinder', 0xb0956d, [0, 3, 0], [29, 4, 29]);
      const rim = parts.add(nest, 'ring', 0x6b553a, [0, 7, 0], [27, 27, 27]); rim.rotation.x = Math.PI / 2;
      for (let i = 0; i < 9; i++) {
        const angle = i * Math.PI * 2 / 9;
        const twig = parts.add(nest, 'box', 0x8c7048, [Math.cos(angle) * 24, 7, Math.sin(angle) * 24], [21, 2, 3]); twig.rotation.y = -angle + 0.5;
      }
      parts.add(nest, 'cone', marker.color, [0, 42, 0], [5, 16, 5]);
      parts.add(nest, 'cylinder', marker.color, [0, 19, 0], [0.55, 28, 0.55]);
      this.labels.push({ text: marker.name + ' · ' + marker.tier, position: [x, y + 65, z], range: 14000, color: '#' + marker.color.toString(16).padStart(6, '0') });
    }
  }
}
