import { ACESFilmicToneMapping, PCFShadowMap, WebGLRenderer } from 'three';
import type { PerspectiveCamera } from 'three';
import { gameConfig } from '../config/gameConfig';

export class Renderer {
  readonly webgl = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  private readonly observer: ResizeObserver;
  constructor(private readonly host: HTMLElement, private readonly camera: PerspectiveCamera) {
    this.webgl.toneMapping = ACESFilmicToneMapping;
    this.webgl.toneMappingExposure = 1.15;
    this.webgl.shadowMap.enabled = true;
    this.webgl.shadowMap.type = PCFShadowMap;
    this.webgl.domElement.setAttribute('aria-label', '3D world; drag to orbit, pinch or scroll to zoom');
    this.webgl.domElement.tabIndex = 0;
    host.append(this.webgl.domElement);
    this.observer = new ResizeObserver(this.resize);
    this.observer.observe(host);
    window.addEventListener('resize', this.resize);
    this.resize();
  }
  private readonly resize = (): void => {
    const width = Math.max(1, this.host.clientWidth), height = Math.max(1, this.host.clientHeight);
    this.webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, gameConfig.rendering.maxPixelRatio));
    this.webgl.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Preserve horizontal framing in portrait viewports.
    this.camera.fov = Math.min(90, 2 * Math.atan(Math.tan(gameConfig.rendering.fieldOfView * Math.PI / 360) / Math.min(1, this.camera.aspect)) * 180 / Math.PI);
    this.camera.updateProjectionMatrix();
  };
  dispose(): void {
    this.observer.disconnect(); window.removeEventListener('resize', this.resize);
    this.webgl.dispose(); this.webgl.forceContextLoss(); this.webgl.domElement.remove();
  }
}
