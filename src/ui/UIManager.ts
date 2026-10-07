import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';
import { gameConfig } from '../config/gameConfig';
import type { WorldLabel } from '../world/Sanctuary';
import type { AssetReport } from '../systems/AssetSystem';

export class UIManager {
  private readonly root = document.createElement('div');
  private readonly abort = new AbortController();
  private readonly labels: { element: HTMLElement; source: WorldLabel }[] = [];
  private readonly projected = new Vector3();
  private activeView = 'sanctuary';
  private readonly assetElement: HTMLElement;
  constructor(host: HTMLElement, labels: WorldLabel[], select: (id: string) => void) {
    this.root.className = 'inspection-ui';
    this.root.innerHTML = `<header class="masthead"><div><p class="eyebrow">A world for Dragons</p><h1>MONSTER <span>WORLD</span></h1><p class="subtitle">Dragon Sanctuary & the wild beyond</p></div><span class="pass-badge">WORLD FOUNDATION <b>00</b></span></header>
      <div class="world-labels" aria-hidden="true"></div>
      <details class="scale-panel" ${window.innerWidth >= 900 ? 'open' : ''}><summary><span class="eyebrow">Beyond the Sanctuary</span><strong>Four horizons</strong><span class="expand-hint">View nest markers</span></summary><div class="scale-content"><p>Distance, elevation & a journey home.</p><ol>${gameConfig.nestMarkers.map((marker, i) => `<li style="--region-color:#${marker.color.toString(16)}"><button type="button" data-view="${marker.id}"><span class="region-number">0${i + 1}</span><span><strong>${marker.name}</strong><small>${marker.tier} · elevation ${marker.position[1]}</small><em>~${Math.round(Math.hypot(marker.position[0], marker.position[2]))} world units from home</em></span><span class="arrow">↗</span></button></li>`).join('')}</ol><p class="review-note">Non-functional landmarks. Distances are spatial review values.</p></div></details>
      <section class="asset-card" aria-label="Dragon asset status"><span class="status-dot"></span><div><span class="eyebrow">Nature · Young / Juvenile</span><strong>Sanctuary showcase</strong><p data-asset-status="loading" role="status">Loading Dragon model…</p></div></section>
      <nav class="viewbar" aria-label="Inspection camera views"><span class="viewbar-label">INSPECT</span><button type="button" data-view="sanctuary" aria-pressed="true">Sanctuary</button><button type="button" data-view="world" aria-pressed="false">Whole world</button><button type="button" data-view="dragon" aria-pressed="false">Nature Dragon</button></nav>
      <p class="camera-hint">Drag to orbit <span>·</span> Scroll / pinch to zoom <span>·</span> Right-drag / two fingers to pan</p>
      <p class="foundation-note">Composition prototype · inspection camera</p>`;
    host.append(this.root);
    const wideScreen = window.matchMedia('(min-width: 900px)');
    wideScreen.addEventListener('change', event => { this.root.querySelector<HTMLDetailsElement>('details')!.open = event.matches; }, { signal: this.abort.signal });
    this.assetElement = this.root.querySelector<HTMLElement>('[data-asset-status]')!;
    const layer = this.root.querySelector<HTMLElement>('.world-labels')!;
    for (const source of labels) {
      const element = document.createElement('span'); element.className = 'world-label'; element.textContent = source.text;
      if (source.color) element.style.borderColor = source.color;
      layer.append(element); this.labels.push({ element, source });
    }
    this.root.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-view]');
      if (!button) return;
      const id = button.dataset.view!; this.activeView = id;
      this.root.querySelectorAll<HTMLButtonElement>('button[data-view]').forEach(view => view.setAttribute('aria-pressed', String(view.dataset.view === id)));
      select(id);
      if (window.innerWidth < 900) this.root.querySelector<HTMLDetailsElement>('details')!.open = false;
    }, { signal: this.abort.signal });
  }
  assetLoaded(report: AssetReport): void {
    this.assetElement.dataset.assetStatus = 'loaded';
    this.assetElement.textContent = report.clips === 0 ? 'Static model loaded · animation requires future work' : 'Model loaded · clips available for future review';
    this.assetElement.title = `${report.meshes} mesh(es), ${report.materials} material(s), ${report.bones} bones, ${report.skinnedMeshes} skinned meshes, ${report.clips} clips`;
  }
  assetFailed(): void { this.assetElement.dataset.assetStatus = 'failed'; this.assetElement.textContent = 'Dragon unavailable · placeholder displayed'; }
  update(camera: PerspectiveCamera, width: number, height: number): void {
    for (const { element, source } of this.labels) {
      const isNest = source.range > 1000;
      this.projected.set(...source.position);
      const distance = this.projected.distanceTo(camera.position);
      this.projected.project(camera);
      const visible = distance < source.range && this.projected.z > -1 && this.projected.z < 1 && Math.abs(this.projected.x) < 0.94 && Math.abs(this.projected.y) < 0.83 && !(isNest && (this.activeView === 'sanctuary' || this.activeView === 'dragon'));
      element.hidden = !visible;
      if (visible) element.style.transform = `translate(${(this.projected.x * 0.5 + 0.5) * width}px, ${(-this.projected.y * 0.5 + 0.5) * height + (source.text.startsWith('Dragon Sanctuary') ? 28 : 0)}px) translate(-50%, -100%)`;
    }
  }
  dispose(): void { this.abort.abort(); this.root.remove(); }
}
