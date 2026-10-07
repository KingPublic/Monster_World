import { Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, Scene } from 'three';
import { gameConfig } from '../config/gameConfig';
import { assetManifest } from '../config/assetManifest';
import { AssetSystem } from '../systems/AssetSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { UIManager } from '../ui/UIManager';
import { disposeScene } from '../utils/scene';
import { World } from '../world/World';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';

/** Task 00 composition root. No Player, theft, AI, progression or persistence. */
export class Game {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(gameConfig.rendering.fieldOfView, 1, gameConfig.rendering.near, gameConfig.rendering.far);
  private readonly renderer: Renderer;
  private readonly cameraSystem: CameraSystem;
  private readonly assets = new AssetSystem();
  private readonly world = new World();
  private readonly ui: UIManager;
  private readonly loop: GameLoop;
  private disposed = false;
  constructor(private readonly host: HTMLElement) {
    this.scene.background = new Color(0xbad4d0);
    this.scene.fog = new Fog(0xbad4d0, 4500, 18000);
    this.scene.add(new HemisphereLight(0xe4f3f3, 0x7c8463, 2.1));
    const sun = new DirectionalLight(0xffe1b4, 3.2);
    sun.position.set(-150, 250, 100); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -180; sun.shadow.camera.right = 180;
    sun.shadow.camera.top = 180; sun.shadow.camera.bottom = -180; sun.shadow.camera.far = 650;
    sun.shadow.normalBias = 0.7;
    this.scene.add(sun, this.world.group);
    this.renderer = new Renderer(host, this.camera);
    this.cameraSystem = new CameraSystem(this.camera, this.renderer.webgl.domElement);
    this.ui = new UIManager(host, this.world.labels, id => this.cameraSystem.select(id));
    this.loop = new GameLoop(delta => {
      this.cameraSystem.update(delta);
      this.renderer.webgl.render(this.scene, this.camera);
      this.ui.update(this.camera, host.clientWidth, host.clientHeight);
    });
    this.loop.start(); host.dataset.bootState = 'ready';
    void this.loadDragon();
  }
  private async loadDragon(): Promise<void> {
    const url = import.meta.env.BASE_URL + assetManifest.natureYoungDragon.url;
    try {
      const report = await this.assets.loadShowcase(url, this.world.sanctuary.dragonStage, gameConfig.sanctuary.dragonSpan);
      if (this.disposed || !report) return;
      const fallback = this.world.sanctuary.dragonFallback;
      fallback.removeFromParent(); disposeScene(fallback);
      this.ui.assetLoaded(report);
    } catch (error) {
      if (this.disposed) return;
      console.error('[Monster World] Nature Young Dragon GLB failed; placeholder retained:', url, error);
      this.ui.assetFailed();
    }
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true; this.loop.dispose(); this.assets.dispose(); this.cameraSystem.dispose(); this.ui.dispose();
    disposeScene(this.scene); this.renderer.dispose(); delete this.host.dataset.bootState;
  }
}
