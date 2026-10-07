export type Position = readonly [number, number, number];
export interface NestMarkerConfig {
  readonly id: string;
  readonly name: string;
  readonly tier: string;
  readonly position: Position;
  readonly color: number;
  readonly terrainSpread: number;
}

/** Spatial review values only. No final travel times or gameplay balancing. */
export const gameConfig = {
  rendering: { maxPixelRatio: 1.5, fieldOfView: 48, near: 0.5, far: 18000 },
  world: { extent: 12000, terrainSegments: 220, treeCount: 680, seed: 2718 },
  sanctuary: { radius: 145, terraceHeights: [8, 17, 28], dragonPosition: [54, 18, 22] as Position, dragonSpan: 25 },
  camera: {
    sanctuary: { position: [225, 175, 275] as Position, target: [0, 22, -15] as Position },
    world: { position: [4200, 3900, 4400] as Position, target: [-100, 140, -1350] as Position },
    dragon: { position: [90, 41, 70] as Position, target: [54, 25, 22] as Position },
    minDistance: 15, maxDistance: 11500,
  },
  nestMarkers: [
    { id: 'forest', name: 'Forest Nest', tier: 'Starter', position: [340, 25, -310], color: 0x8ad7a3, terrainSpread: 200 },
    { id: 'highland', name: 'Highland Nest', tier: 'Mid-tier', position: [-780, 145, -900], color: 0xf2cd82, terrainSpread: 430 },
    { id: 'volcano', name: 'Volcanic Nest', tier: 'High-tier', position: [1720, 330, -1840], color: 0xef926f, terrainSpread: 700 },
    { id: 'frost', name: 'Frost Summit', tier: 'Highest-tier direction', position: [-1920, 620, -3400], color: 0xa5d6ed, terrainSpread: 900 },
  ] as readonly NestMarkerConfig[],
} as const;
