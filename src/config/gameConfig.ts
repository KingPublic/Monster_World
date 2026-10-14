import { sanctuaryServices } from '../world/SanctuaryLayout';
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
  sanctuary: { radius: 220, terraceHeights: [1, 6], dragonPosition: sanctuaryServices.mount, dragonSpan: 25 },
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
    // Elevations sampled from the established valley, before local landing aprons.
    { id: 'meadow', name: 'Wildflower Meadow', tier: 'Starter side valley', position: [-1250, 2, 760], color: 0xe2c875, terrainSpread: 160 },
    { id: 'canyon', name: 'Amber Canyon', tier: 'High-tier', position: [3000, 29, -2080], color: 0xdb9b63, terrainSpread: 160 },
    { id: 'marsh', name: 'Reedwater Nest', tier: 'Mid-tier', position: [1650, 14, 1560], color: 0x81c6b4, terrainSpread: 160 },
    { id: 'ruins', name: 'Moonstone Ruins', tier: 'Highest-tier side valley', position: [-2850, 13, -1900], color: 0xb7a9df, terrainSpread: 160 },
    { id:'dunes',name:'Golden Dunes',tier:'Rare desert region',position:[2380,85,2440],color:0xe1bb7d,terrainSpread:410 },
    { id:'ember',name:'Emberfall Crater',tier:'Epic Dragon region',position:[3790,340,-1370],color:0xe9a17a,terrainSpread:460 },
    { id:'glacier',name:'Crystal Crown',tier:'Legendary ice region',position:[-3550,730,-4350],color:0x9fd9ed,terrainSpread:540 },
    { id:'moonwell',name:'Moonveil Grove',tier:'Legendary twilight region',position:[-4320,400,2330],color:0xc5b4e5,terrainSpread:470 },
    { id:'sunreach',name:'Suncrest Temple',tier:'Legendary sanctuary of the wild',position:[4230,530,-2960],color:0xf2d58b,terrainSpread:540 },
    { id:'stormspire',name:'Stormspire',tier:'Mythical Dragon region',position:[4390,880,4260],color:0xb7ccec,terrainSpread:620 },
  ] as readonly NestMarkerConfig[],
} as const;
