import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gameConfig } from '../config/gameConfig';
import type { Position } from '../config/gameConfig';

export class CameraSystem {
  readonly controls: OrbitControls;
  constructor(readonly camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.minDistance = gameConfig.camera.minDistance;
    this.controls.maxDistance = gameConfig.camera.maxDistance;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.select('sanctuary');
  }
  /** Development inspection only: there is no Player or travel state in Task 00. */
  select(id: string): void {
    const preset = id === 'world' ? gameConfig.camera.world : id === 'dragon' ? gameConfig.camera.dragon : gameConfig.camera.sanctuary;
    const marker = gameConfig.nestMarkers.find(nest => nest.id === id);
    const target: Position = marker ? [marker.position[0], marker.position[1] + 30, marker.position[2]] : preset.target;
    const position: Position = marker ? [target[0] + 230, target[1] + 190, target[2] + 260] : preset.position;
    this.controls.target.set(...target); this.camera.position.set(...position);
    this.controls.update(); this.controls.saveState();
  }
  update(delta: number): void { this.controls.update(delta); }
  dispose(): void { this.controls.dispose(); }
}
