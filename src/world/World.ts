import { Group } from 'three';
import { gameConfig } from '../config/gameConfig';
import { Environment } from './Environment';
import { createNestLandscape } from './NestLandscape';
import { Sanctuary } from './Sanctuary';
import type { WorldLabel } from './Sanctuary';
import { WorldCollision } from './WorldCollision';
import { releaseTraversalCollision, useTraversalCollision } from './Traversal';

export class World {
  readonly group = new Group();
  readonly sanctuary = new Sanctuary();
  readonly labels: WorldLabel[];
  readonly collision = new WorldCollision();
  constructor() {
    this.group.name = 'MonsterWorld_DragonMVP';
    this.group.add(new Environment(this.collision).group, this.sanctuary.group);
    this.labels = [...this.sanctuary.labels, { text: 'Dragon Sanctuary · Home', position: [0, 92, 0], range: 14000 }];
    for (const [index, marker] of gameConfig.nestMarkers.entries()) {
      const [x, y, z] = marker.position;
      this.group.add(createNestLandscape(marker,index,this.collision));
      this.labels.push({ text: marker.name + ' · ' + marker.tier, position: [x, y + 65, z], range: 14000, color: '#' + marker.color.toString(16).padStart(6, '0') });
    }
    useTraversalCollision(this.collision);
  }
  disposeCollision(): void { this.collision.clear(); releaseTraversalCollision(this.collision); }
  update(dt:number):void{this.sanctuary.planting.update(dt);}
}
