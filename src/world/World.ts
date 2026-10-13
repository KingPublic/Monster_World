import { Group } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Environment } from './Environment';
import { createNestLandscape } from './NestLandscape';
import { Sanctuary } from './Sanctuary';
import type { WorldLabel } from './Sanctuary';

export class World {
  readonly group = new Group();
  readonly sanctuary = new Sanctuary();
  readonly labels: WorldLabel[];
  constructor() {
    this.group.name = 'MonsterWorld_DragonMVP';
    this.group.add(new Environment().group, this.sanctuary.group);
    this.labels = [...this.sanctuary.labels, { text: 'Dragon Sanctuary · Home', position: [0, 92, 0], range: 14000 }];
    for (const [index, marker] of gameConfig.nestMarkers.entries()) {
      const [x, y, z] = marker.position;
      this.group.add(createNestLandscape(marker,index));
      this.labels.push({ text: marker.name + ' · ' + marker.tier, position: [x, y + 65, z], range: 14000, color: '#' + marker.color.toString(16).padStart(6, '0') });
    }
  }
}
