import { carryCapacity, mvpConfig, upgradeCost } from '../config/mvpConfig';
import type { EggRarity, MvpNestConfig, UpgradeKind } from '../config/mvpConfig';

export type DragonRarity = EggRarity;
export interface CarriedEgg { id: string; rarity: DragonRarity; element: 'Nature'; nestId: string; }
export interface DragonRecord { id: string; name: string; rarity: DragonRarity; element: 'Nature'; stage: 'Baby' | 'Young'; growth: number; }
export interface SaveData {
  version: 1;
  tutorialComplete: boolean;
  tutorialStep: number;
  coins: number;
  food: number;
  dragons: DragonRecord[];
  equippedDragonId: string | null;
  carryLevel: 1 | 2 | 3;
  upgrades: { speed: number; stamina: number; boost: number };
  securedEggs: CarriedEgg[];
}
export interface EggSlot { egg: CarriedEgg | null; remaining: number; }
export interface NestState { id: string; slots: EggSlot[]; }

let idSequence = 0;
function createId(prefix: string): string {
  const unique = globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + '-' + (++idSequence).toString(36) + '-' + Math.random().toString(36).slice(2);
  return prefix + '-' + unique;
}
function freshSave(): SaveData {
  return { version: 1, tutorialComplete: false, tutorialStep: 0, coins: 0, food: 0, dragons: [], equippedDragonId: null, carryLevel: 1, upgrades: { speed: 0, stamina: 0, boost: 0 }, securedEggs: [] };
}
function spawnEgg(config: MvpNestConfig): CarriedEgg {
  const total = config.pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  let rarity = config.pool[config.pool.length - 1].rarity;
  for (const entry of config.pool) { roll -= entry.weight; if (roll < 0) { rarity = entry.rarity; break; } }
  return { id: createId('egg'), rarity, element: 'Nature', nestId: config.id };
}

/** Pure local game state. Active raid loot and nest cooldowns deliberately do not persist. */
export class Progression {
  readonly state: SaveData;
  readonly carried: CarriedEgg[] = [];
  readonly nests: NestState[];

  constructor(save?: SaveData) {
    this.state = save ? { ...save, upgrades: { ...save.upgrades }, dragons: save.dragons.map((dragon) => ({ ...dragon })), securedEggs: save.securedEggs.map((egg) => ({ ...egg })) } : freshSave();
    // Reload cancels an active raid, so the tutorial offers theft again.
    if (!this.state.tutorialComplete && this.state.tutorialStep === 2) this.state.tutorialStep = 1;
    this.nests = mvpConfig.nests.map((config) => ({ id: config.id, slots: Array.from({ length: config.slotCount }, () => ({ egg: spawnEgg(config), remaining: 0 })) }));
  }

  updateSlots(dt: number, timeScale = 1): void {
    if (!Number.isFinite(dt) || dt <= 0 || !Number.isFinite(timeScale) || timeScale <= 0) return;
    const elapsed = dt * timeScale;
    if (!Number.isFinite(elapsed)) return;
    for (const nest of this.nests) {
      const config = mvpConfig.nests.find((candidate) => candidate.id === nest.id)!;
      for (const slot of nest.slots) {
        if (slot.egg) continue;
        slot.remaining = Math.max(0, slot.remaining - elapsed);
        if (slot.remaining === 0) slot.egg = spawnEgg(config);
      }
    }
  }

  steal(nestId: string, slotIndex: number): CarriedEgg | undefined {
    if (!Number.isInteger(slotIndex) || this.carried.length >= carryCapacity(this.state.carryLevel)) return undefined;
    if (this.state.securedEggs.length + this.carried.length >= mvpConfig.limits.securedEggs) return undefined;
    const nest = this.nests.find((candidate) => candidate.id === nestId);
    const slot = nest?.slots[slotIndex];
    const config = mvpConfig.nests.find((candidate) => candidate.id === nestId);
    if (!slot?.egg || !config) return undefined;
    const egg = slot.egg;
    slot.egg = null;
    slot.remaining = config.respawnSeconds;
    this.carried.push(egg);
    this.advanceTutorial(2);
    return egg;
  }

  secure(): number {
    const count = this.carried.length;
    if (!count) return 0;
    this.state.securedEggs.push(...this.carried);
    this.state.coins = Math.min(mvpConfig.limits.coins, this.state.coins + count * mvpConfig.deliveryReward);
    this.carried.length = 0;
    this.advanceTutorial(3);
    return count;
  }
  loseCarried(): void {
    this.carried.length = 0;
    if (!this.state.tutorialComplete && this.state.tutorialStep === 2) this.state.tutorialStep = 1;
  }

  hatch(): DragonRecord | undefined {
    if (this.state.dragons.length >= mvpConfig.limits.dragons) return undefined;
    const egg = this.state.securedEggs.shift();
    if (!egg) return undefined;
    const firstHatch = this.state.dragons.length === 0;
    const dragon: DragonRecord = { id: createId('dragon'), name: egg.rarity + ' Nature Dragon', rarity: egg.rarity, element: egg.element, stage: 'Baby', growth: 0 };
    this.state.dragons.push(dragon);
    if (firstHatch) this.state.food = Math.min(mvpConfig.limits.food, this.state.food + mvpConfig.starterFood);
    this.advanceTutorial(4);
    return dragon;
  }
  feed(id: string): boolean {
    const dragon = this.state.dragons.find((candidate) => candidate.id === id);
    if (!dragon || dragon.stage !== 'Baby' || this.state.food < 1) return false;
    this.state.food--;
    dragon.growth = Math.min(mvpConfig.youngThreshold, dragon.growth + mvpConfig.foodGrowth);
    if (dragon.growth >= mvpConfig.youngThreshold) { dragon.stage = 'Young'; this.advanceTutorial(5); }
    return true;
  }
  equip(id: string): boolean {
    const dragon = this.state.dragons.find((candidate) => candidate.id === id);
    if (!dragon || dragon.stage !== 'Young') return false;
    this.state.equippedDragonId = dragon.id;
    return true;
  }
  buyFood(): boolean {
    if (this.state.coins < mvpConfig.foodPrice || this.state.food >= mvpConfig.limits.food) return false;
    this.state.coins -= mvpConfig.foodPrice;
    this.state.food++;
    return true;
  }
  upgrade(kind: UpgradeKind): boolean {
    const level = kind === 'carry' ? this.state.carryLevel : this.state.upgrades[kind];
    const price = upgradeCost(kind, level);
    if (price === null || this.state.coins < price) return false;
    this.state.coins -= price;
    if (kind === 'carry') this.state.carryLevel = (level + 1) as 2 | 3;
    else this.state.upgrades[kind]++;
    return true;
  }
  completeTutorial(): void {
    if (this.state.tutorialComplete) return;
    this.state.tutorialComplete = true;
    this.state.tutorialStep = 7;
    this.state.coins = Math.min(mvpConfig.limits.coins, this.state.coins + mvpConfig.tutorialReward);
  }
  private advanceTutorial(step: number): void {
    if (!this.state.tutorialComplete) this.state.tutorialStep = Math.max(this.state.tutorialStep, step);
  }
}
