import { sanctuaryServices } from '../world/SanctuaryLayout';
import { gameConfig } from './gameConfig';
import type { NestMarkerConfig } from './gameConfig';

export type EggRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
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
  {slotCount:4,respawnSeconds:300,pool:[{rarity:'Rare',weight:75},{rarity:'Epic',weight:25}],guardianSpeed:108,guardianGraceSeconds:2.5,catchRadius:6},
  {slotCount:5,respawnSeconds:600,pool:[{rarity:'Epic',weight:80},{rarity:'Legendary',weight:20}],guardianSpeed:125,guardianGraceSeconds:2.3,catchRadius:7},
  {slotCount:4,respawnSeconds:600,pool:[{rarity:'Epic',weight:30},{rarity:'Legendary',weight:70}],guardianSpeed:138,guardianGraceSeconds:2.2,catchRadius:8},
  {slotCount:4,respawnSeconds:600,pool:[{rarity:'Legendary',weight:85},{rarity:'Mythical',weight:15}],guardianSpeed:142,guardianGraceSeconds:2.3,catchRadius:8},
  {slotCount:4,respawnSeconds:600,pool:[{rarity:'Legendary',weight:100}],guardianSpeed:145,guardianGraceSeconds:2.4,catchRadius:8},
  {slotCount:3,respawnSeconds:600,pool:[{rarity:'Mythical',weight:100}],guardianSpeed:150,guardianGraceSeconds:2.6,catchRadius:8},
];
// Explicit inherited presets prevent an array expansion from producing empty nests.
const nestPresetById: Readonly<Record<string, number>> = {
  forest: 0, highland: 1, volcano: 2, frost: 3,
  meadow: 0, canyon: 2, marsh: 1, ruins: 3,
  dunes:4,ember:5,glacier:6,moonwell:7,sunreach:8,stormspire:9,
};

/** Provisional MVP playtest values. Marker coordinates and world extent stay unchanged. */
export const mvpConfig = {
  provisionalBalance: true,
  player: { walkSpeed: 30, sprintSpeed: 50 },
  horse: { walkSpeed: 34, sprintSpeed: 50 },
  // Separate transient sprint pools; rider upgrades continue to affect Dragons.
  sprint: {
    player: { capacity: 100, drain: 20, recovery: 22, recoveryDelay: .8, restartFraction: .2 },
    horse: { capacity: 100, drain: 16, recovery: 20, recoveryDelay: .8, restartFraction: .2 },
  },
  flight: { speed: 85, boostSpeed: 155, verticalSpeed: 35, stamina: 100, boostDrain: 28, staminaRegen: 18 },
  theftHoldSeconds: 1.1,
  hatchSeconds: 2.5,
  foodGrowth: 50,
  youngThreshold: 100,
  dragonCare: {
    maxMeals: 100, mealsPerLevel: 4, sizePerMeal: .0035,
    speedPerMeal: .0025, staminaPerMeal: .005, boostPerMeal: .003,
    baseHealth: 100, healthPerMeal: 2, mealHealing: 25,
    guardianDamage: 32, hitInterval: 1.8, riderEscapeGrace: 4,
    recoverySeconds: {Common:60,Uncommon:120,Rare:180,Epic:300,Legendary:420,Mythical:600},
  },
  starterFood: 2,
  foodPrice: 20,
  deliveryReward: 50,
  tutorialReward: 75,
  safeZoneRadius: gameConfig.sanctuary.radius,
  maxSafeAltitude: 100,
  services: sanctuaryServices,
  upgrades: { maxLevel: 3, multiplierPerLevel: 0.15, basePrice: 100, priceStep: 75, carryPrices: [100, 225] as readonly number[] },
  limits: { coins: 1_000_000_000, food: 9999, dragons: 256, securedEggs: 128 },
  nests: gameConfig.nestMarkers.map((marker): MvpNestConfig => {
    const preset = nestBalance[nestPresetById[marker.id]!];
    if (!preset) throw new Error('Missing nest balance preset: ' + marker.id);
    return { ...marker, ...preset };
  }),
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
