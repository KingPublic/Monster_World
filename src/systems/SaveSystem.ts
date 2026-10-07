import { mvpConfig } from '../config/mvpConfig';
import type { CarriedEgg, DragonRarity, DragonRecord, SaveData } from '../gameplay/Progression';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export type SaveStatus = 'idle' | 'empty' | 'loaded' | 'saved' | 'reset' | 'invalid' | 'unsupported' | 'unavailable';

const rarities = new Set<DragonRarity>(['Common', 'Uncommon', 'Rare', 'Epic']);
const nestIds = new Set(mvpConfig.nests.map((nest) => nest.id));
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function id(value: unknown): value is string { return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(value); }
function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, Math.floor(value))); }
function rarity(value: unknown): value is DragonRarity { return typeof value === 'string' && rarities.has(value as DragonRarity); }
function validName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 80 && !/[\u0000-\u001f\u007f]/.test(value);
}

/** Reject malformed identities/structures, normalize finite numeric bounds, and whitelist saved fields. */
export function validateSave(input: unknown): SaveData | undefined {
  if (!record(input) || input.version !== 1 || typeof input.tutorialComplete !== 'boolean') return undefined;
  if (!finite(input.tutorialStep) || !finite(input.coins) || !finite(input.food) || !finite(input.carryLevel)) return undefined;
  if (!record(input.upgrades) || !finite(input.upgrades.speed) || !finite(input.upgrades.stamina) || !finite(input.upgrades.boost)) return undefined;
  if (!Array.isArray(input.dragons) || input.dragons.length > mvpConfig.limits.dragons || !Array.isArray(input.securedEggs) || input.securedEggs.length > mvpConfig.limits.securedEggs) return undefined;
  if (input.equippedDragonId !== null && !id(input.equippedDragonId)) return undefined;

  const seen = new Set<string>();
  const dragons: DragonRecord[] = [];
  for (const raw of input.dragons) {
    if (!record(raw) || !id(raw.id) || seen.has(raw.id) || !validName(raw.name) || !rarity(raw.rarity) || raw.element !== 'Nature') return undefined;
    if ((raw.stage !== 'Baby' && raw.stage !== 'Young') || !finite(raw.growth)) return undefined;
    seen.add(raw.id);
    dragons.push({ id: raw.id, name: raw.name.trim(), rarity: raw.rarity, element: 'Nature', stage: raw.stage,
      growth: raw.stage === 'Young' ? mvpConfig.youngThreshold : clamp(raw.growth, 0, mvpConfig.youngThreshold - 1) });
  }
  const securedEggs: CarriedEgg[] = [];
  for (const raw of input.securedEggs) {
    if (!record(raw) || !id(raw.id) || seen.has(raw.id) || !rarity(raw.rarity) || raw.element !== 'Nature' || typeof raw.nestId !== 'string' || !nestIds.has(raw.nestId)) return undefined;
    seen.add(raw.id);
    securedEggs.push({ id: raw.id, rarity: raw.rarity, element: 'Nature', nestId: raw.nestId });
  }
  if (input.equippedDragonId !== null && !dragons.some((dragon) => dragon.id === input.equippedDragonId && dragon.stage === 'Young')) return undefined;
  return {
    version: 1,
    tutorialComplete: input.tutorialComplete,
    tutorialStep: input.tutorialComplete ? 7 : clamp(input.tutorialStep, 0, 7),
    coins: clamp(input.coins, 0, mvpConfig.limits.coins),
    food: clamp(input.food, 0, mvpConfig.limits.food),
    dragons,
    equippedDragonId: input.equippedDragonId,
    carryLevel: clamp(input.carryLevel, 1, 3) as 1 | 2 | 3,
    upgrades: { speed: clamp(input.upgrades.speed, 0, mvpConfig.upgrades.maxLevel), stamina: clamp(input.upgrades.stamina, 0, mvpConfig.upgrades.maxLevel), boost: clamp(input.upgrades.boost, 0, mvpConfig.upgrades.maxLevel) },
    securedEggs,
  };
}

/** Device-local storage with safe fallback when storage is blocked, corrupt, or full. */
export class SaveSystem {
  readonly key = 'monster-world-save';
  private readonly storage: StorageLike | undefined;
  private currentStatus: SaveStatus = 'idle';
  private currentMessage = '';
  get status(): SaveStatus { return this.currentStatus; }
  get message(): string { return this.currentMessage; }

  constructor(storage?: StorageLike) {
    if (storage) this.storage = storage;
    else {
      try { this.storage = typeof localStorage === 'undefined' ? undefined : localStorage; }
      catch { this.storage = undefined; }
    }
  }
  load(): SaveData | undefined {
    if (!this.storage) { this.report('unavailable', 'Local saving is unavailable. Progress lasts for this session.'); return undefined; }
    let serialized: string | null;
    try { serialized = this.storage.getItem(this.key); }
    catch { this.report('unavailable', 'The browser could not read your local save.'); return undefined; }
    if (serialized === null) { this.report('empty', 'New adventure. Progress saves on this device.'); return undefined; }
    let input: unknown;
    try { input = JSON.parse(serialized); }
    catch { this.report('invalid', 'Your local save was damaged. A new adventure has started.'); return undefined; }
    if (record(input) && input.version !== 1) { this.report('unsupported', 'This save uses an unsupported version. A new adventure has started.'); return undefined; }
    const state = validateSave(input);
    if (!state) { this.report('invalid', 'Your local save was damaged. A new adventure has started.'); return undefined; }
    this.report('loaded', 'Adventure restored from this device.');
    return state;
  }
  save(state: SaveData): boolean {
    const normalized = validateSave(state);
    if (!normalized) { this.report('invalid', 'Progress could not be saved because its data is invalid.'); return false; }
    if (!this.storage) { this.report('unavailable', 'Local saving is unavailable. Progress lasts for this session.'); return false; }
    try { this.storage.setItem(this.key, JSON.stringify(normalized)); }
    catch { this.report('unavailable', 'The browser could not save progress. Storage may be full or blocked.'); return false; }
    this.report('saved', 'Progress saved on this device.');
    return true;
  }
  reset(): void {
    if (!this.storage) { this.report('unavailable', 'The browser could not reset your local save.'); return; }
    try { this.storage.removeItem(this.key); }
    catch { this.report('unavailable', 'The browser could not reset your local save.'); return; }
    this.report('reset', 'Local adventure reset.');
  }
  private report(status: SaveStatus, message: string): void { this.currentStatus = status; this.currentMessage = message; }
}
