import { gameConfig } from './gameConfig';
import type { NestMarkerConfig, Position } from './gameConfig';

export type EggRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type UpgradeKind = 'speed' | 'stamina' | 'boost' | 'carry';
export interface EggPoolEntry { readonly rarity: EggRarity; readonly weight: number; }
export interface MvpNestConfig extends NestMarkerConfig {
  readonly slotCount: number;
  readonly respawnSeconds: number;
  readonly pool: readonly EggPoolEntry[];
  readonly guardianSpeed: number;
  readonly guardianGraceSeconds: number;
  readonly catchRadius: number;
}

const nestBalance: readonly Omit<MvpNestConfig, keyof NestMarkerConfig>[] = [
  { slotCount: 3, respawnSeconds: 300, pool: [{ rarity: 'Common', weight: 100 }], guardianSpeed: 42, guardianGraceSeconds: 2.8, catchRadius: 5 },
  { slotCount: 4, respawnSeconds: 300, pool: [{ rarity: 'Common', weight: 20 }, { rarity: 'Uncommon', weight: 80 }], guardianSpeed: 100, guardianGraceSeconds: 2.5, catchRadius: 6 },
  { slotCount: 5, respawnSeconds: 600, pool: [{ rarity: 'Uncommon', weight: 20 }, { rarity: 'Rare', weight: 80 }], guardianSpeed: 118, guardianGraceSeconds: 2.2, catchRadius: 7 },
  { slotCount: 5, respawnSeconds: 600, pool: [{ rarity: 'Rare', weight: 25 }, { rarity: 'Epic', weight: 75 }], guardianSpeed: 140, guardianGraceSeconds: 2, catchRadius: 8 },
];

/** Provisional MVP playtest values. Marker coordinates and world extent stay unchanged. */
export const mvpConfig = {
  provisionalBalance: true,
  player: { walkSpeed: 30, sprintSpeed: 50 },
  flight: { speed: 85, boostSpeed: 155, verticalSpeed: 35, stamina: 100, boostDrain: 28, staminaRegen: 18 },
  theftHoldSeconds: 1.1,
  hatchSeconds: 2.5,
  foodGrowth: 50,
  youngThreshold: 100,
  starterFood: 2,
  foodPrice: 20,
  deliveryReward: 50,
  tutorialReward: 75,
  safeZoneRadius: 145,
  maxSafeAltitude: 100,
  services: {
    hatchery: [0, 28, -62] as Position,
    shop: [-42, 8, 40] as Position,
    collection: [-41, 17, -28] as Position,
    rider: [44, 17, -29] as Position,
    mount: [54, 18, 22] as Position,
  },
  upgrades: { maxLevel: 3, multiplierPerLevel: 0.15, basePrice: 100, priceStep: 75, carryPrices: [100, 225] as readonly number[] },
  limits: { coins: 1_000_000_000, food: 9999, dragons: 256, securedEggs: 128 },
  nests: gameConfig.nestMarkers.map((marker, index): MvpNestConfig => ({ ...marker, ...nestBalance[index] })),
} as const;

export function upgradeCost(kind: UpgradeKind, currentLevel: number): number | null {
  if (!Number.isInteger(currentLevel)) return null;
  if (kind === 'carry') return currentLevel >= 1 && currentLevel < 3 ? mvpConfig.upgrades.carryPrices[currentLevel - 1] : null;
  return currentLevel >= 0 && currentLevel < mvpConfig.upgrades.maxLevel
    ? mvpConfig.upgrades.basePrice + currentLevel * mvpConfig.upgrades.priceStep : null;
}
export function upgradeMultiplier(level: number): number {
  return 1 + Math.max(0, Math.min(mvpConfig.upgrades.maxLevel, Math.floor(level))) * mvpConfig.upgrades.multiplierPerLevel;
}
export function carryCapacity(level: number): number {
  return Math.max(1, Math.min(3, Math.floor(level)));
}
