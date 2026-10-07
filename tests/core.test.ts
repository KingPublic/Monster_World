import { Group } from 'three';
import { Flight } from '../src/gameplay/Flight';
import { groundHeight } from '../src/world/Traversal';
import { Progression } from '../src/gameplay/Progression';
import { SaveSystem, validateSave } from '../src/systems/SaveSystem';
import type { SaveData } from '../src/gameplay/Progression';

function check(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function equal(actual: unknown, expected: unknown, message: string): void {
  if (!Object.is(actual, expected)) throw new Error(message + ': expected ' + expected + ', received ' + actual);
}
function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}
function fixture(): SaveData {
  return { version: 1, tutorialComplete: false, tutorialStep: 0, coins: 0, food: 0, dragons: [], equippedDragonId: null, carryLevel: 1, upgrades: { speed: 0, stamina: 0, boost: 0 }, securedEggs: [] };
}

const cases: [string, () => void][] = [
  ['takeoff works at 30 60 and 120 fps and descent lands', () => {
    for (const dt of [1/30,1/60,1/120]) {
      const root=new Group();root.position.set(54,groundHeight(54,22),22);
      const flight=new Flight(),state=fixture();let code='Space';
      const input={movement:{x:0,y:0},held:(key:string)=>key===code};
      for(let i=0;i<Math.round(1/dt);i++)flight.update(dt,root,input,0,state);
      check(flight.airborne && root.position.y>groundHeight(54,22)+10,'held ascent must lift off at '+Math.round(1/dt)+' fps');
      code='ControlLeft';
      for(let i=0;i<Math.round(3/dt);i++)flight.update(dt,root,input,0,state);
      check(!flight.airborne,'descent lands at '+Math.round(1/dt)+' fps');
      equal(root.position.y,groundHeight(54,22),'landing follows ground');
    }
  }],

  ['full carry rejects theft without consuming another nest slot', () => {
    const progress = new Progression();
    const egg = progress.steal('forest', 0);
    check(egg, 'first theft must succeed');
    equal(egg.rarity, 'Common', 'tutorial egg rarity');
    equal(egg.element, 'Nature', 'tutorial egg element');
    const untouched = progress.nests[0].slots[1].egg;
    equal(progress.steal('forest', 1), undefined, 'second theft at Carry 1');
    equal(progress.nests[0].slots[1].egg, untouched, 'rejected theft preserves egg');
    equal(progress.nests[0].slots[1].remaining, 0, 'rejected theft starts no cooldown');
    progress.state.carryLevel = 3;
    check(progress.steal('forest', 1), 'second egg at Carry 3');
    check(progress.steal('forest', 2), 'third egg at Carry 3');
    equal(progress.carried.length, 3, 'Carry 3 capacity');
    equal(progress.steal('highland', 0), undefined, 'fourth egg rejected');
  }],
  ['only stolen slots respawn at their own 300 or 600 second deadline', () => {
    const progress = new Progression();
    progress.state.carryLevel = 3;
    equal(progress.nests.length, 4, 'four active nests initialize');
    const untouched = progress.nests[0].slots[1].egg;
    check(progress.steal('forest', 0), 'forest theft');
    check(progress.steal('volcano', 0), 'volcano theft');
    progress.updateSlots(299);
    equal(progress.nests[0].slots[0].egg, null, 'forest still empty before deadline');
    equal(progress.nests[2].slots[0].remaining, 301, 'volcano independent deadline');
    progress.updateSlots(1);
    check(progress.nests[0].slots[0].egg, 'forest refills at 300 seconds');
    equal(progress.nests[0].slots[1].egg, untouched, 'untouched egg object preserved');
    equal(progress.nests[2].slots[0].egg, null, 'volcano empty until 600 seconds');
    progress.updateSlots(300);
    check(progress.nests[2].slots[0].egg, 'volcano refills at 600 seconds');
    progress.updateSlots(-1);
    progress.updateSlots(Number.NaN);
    equal(progress.nests[0].slots[1].egg, untouched, 'invalid deltas do not reroll eggs');
  }],
  ['secure hatch and two free feeds produce a rideable dragon with the same identity', () => {
    const progress = new Progression();
    const egg = progress.steal('forest', 0)!;
    equal(progress.secure(), 1, 'secured egg count');
    equal(progress.carried.length, 0, 'delivery clears carried eggs');
    equal(progress.state.coins, 50, 'delivery reward');
    const baby = progress.hatch();
    check(baby, 'hatches secured egg');
    equal(baby.stage, 'Baby', 'hatch stage');
    equal(progress.state.food, 2, 'first hatch grants enough starter food');
    equal(progress.equip(baby.id), false, 'baby cannot equip as mount');
    check(progress.feed(baby.id), 'first feed');
    equal(baby.stage, 'Baby', 'one feed remains Baby');
    check(progress.feed(baby.id), 'second feed');
    equal(baby.stage, 'Young', 'two feeds reach rideable stage');
    equal(baby.rarity, egg.rarity, 'growth preserves rarity');
    equal(baby.element, egg.element, 'growth preserves element');
    check(progress.equip(baby.id), 'Young dragon equips');
    equal(progress.state.equippedDragonId, baby.id, 'equipped identity');
    equal(progress.feed(baby.id), false, 'Young consumes no more food in this MVP');
    equal(progress.secure(), 0, 'empty delivery awards nothing');
    equal(progress.state.coins, 50, 'no duplicate delivery reward');
    check(progress.steal('forest', 1), 'another egg'); progress.secure(); progress.hatch();
    equal(progress.state.food, 0, 'starter grant happens once');
    const rareSave = fixture(); rareSave.securedEggs.push({ id: 'egg-epic', rarity: 'Epic', element: 'Nature', nestId: 'frost' });
    const rareProgress = new Progression(rareSave); const epic = rareProgress.hatch()!;
    rareProgress.feed(epic.id); rareProgress.feed(epic.id);
    equal(epic.rarity, 'Epic', 'growth preserves nonstarter rarity');
    equal(epic.element, 'Nature', 'growth preserves nonstarter element');
    equal(rareProgress.state.dragons[0], epic, 'growth updates the owned dragon object');
  }],
  ['failed raid clears loot and reload keeps secured inventory only', () => {
    const progress = new Progression();
    progress.steal('forest', 0); progress.loseCarried();
    equal(progress.carried.length, 0, 'failure clears active raid');
    equal(progress.state.securedEggs.length, 0, 'failure grants no secured egg');
    equal(progress.state.coins, 0, 'failure grants no reward');
    progress.steal('forest', 1); progress.secure(); progress.steal('forest', 2);
    const reload = new Progression(progress.state);
    equal(reload.carried.length, 0, 'active raid not restored');
    equal(reload.state.securedEggs.length, 1, 'secured egg restored');
    check(reload.nests[0].slots[0].egg, 'fresh nest slots on reload');
    const interrupted = new Progression(); interrupted.steal('forest', 0);
    const resumed = new Progression(interrupted.state);
    equal(resumed.state.tutorialStep, 1, 'interrupted tutorial raid restarts at theft');
  }],
  ['save roundtrip deep validates inventory and reports corrupt old and unavailable saves', () => {
    const storage = memoryStorage();
    const saves = new SaveSystem(storage);
    const progress = new Progression(); progress.steal('forest', 0); progress.secure();
    check(saves.save(progress.state), 'save succeeds');
    const restored = saves.load(); check(restored, 'save loads');
    equal(restored.securedEggs[0].id, progress.state.securedEggs[0].id, 'egg survives roundtrip');
    restored.coins = 999;
    equal(progress.state.coins, 50, 'load returns independent object');
    storage.setItem(saves.key, '{broken');
    equal(saves.load(), undefined, 'corrupt JSON resets safely');
    equal(saves.status, 'invalid', 'corrupt save status');
    storage.setItem(saves.key, JSON.stringify({ ...fixture(), version: 99 }));
    equal(saves.load(), undefined, 'unknown schema resets safely');
    equal(saves.status, 'unsupported', 'old save status');
    const blocked = new SaveSystem({ getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('blocked'); } });
    equal(blocked.save(progress.state), false, 'quota failure returns false');
    equal(blocked.status, 'unavailable', 'quota failure status');
    equal(blocked.load(), undefined, 'blocked read returns no save');
    saves.reset(); equal(saves.load(), undefined, 'reset removes stored progression');
  }],
  ['save validation rejects malformed identity and clamps finite numerical bounds', () => {
    const dirty = { ...fixture(), coins: -5, food: 1e10, tutorialStep: 99, carryLevel: 9, upgrades: { speed: 90, stamina: -4, boost: 1.7 } };
    const normalized = validateSave(dirty); check(normalized, 'finite numbers normalize');
    equal(normalized.coins, 0, 'coins lower bound'); equal(normalized.food, 9999, 'food upper bound');
    equal(normalized.tutorialStep, 7, 'tutorial bound'); equal(normalized.carryLevel, 3, 'carry bound');
    equal(normalized.upgrades.speed, 3, 'speed upper bound'); equal(normalized.upgrades.stamina, 0, 'stamina lower bound');
    equal(normalized.upgrades.boost, 1, 'upgrade integral level');
    equal(validateSave({ ...fixture(), coins: Number.NaN }), undefined, 'NaN rejected');
    equal(validateSave({ ...fixture(), dragons: [{ id: 'x', name: 'Bad', rarity: 'Common', element: 'Fire', stage: 'Baby', growth: 0 }] }), undefined, 'unsupported element rejected');
    equal(validateSave({ ...fixture(), securedEggs: [{ id: 'x', rarity: 'Rare', element: 'Nature', nestId: 'missing' }] }), undefined, 'unknown egg nest rejected');
    equal(validateSave({ ...fixture(), equippedDragonId: 'missing' }), undefined, 'missing equipped dragon rejected');
    const dragon = { id: 'dragon-1', name: 'Nature Dragon', rarity: 'Epic', element: 'Nature', stage: 'Young', growth: 100 };
    equal(validateSave({ ...fixture(), dragons: [dragon, dragon] }), undefined, 'duplicate owned IDs rejected');
  }],
  ['food upgrades and tutorial completion spend or reward coins once', () => {
    const progress = new Progression();
    equal(progress.buyFood(), false, 'no coins buys no food');
    progress.state.coins = 1000;
    check(progress.buyFood(), 'food purchase'); equal(progress.state.coins, 980, 'food cost'); equal(progress.state.food, 1, 'food added');
    check(progress.upgrade('carry'), 'first carry upgrade'); equal(progress.state.carryLevel, 2, 'carry level increases');
    check(progress.upgrade('carry'), 'second carry upgrade'); equal(progress.state.carryLevel, 3, 'carry maximum');
    const beforeMax = progress.state.coins; equal(progress.upgrade('carry'), false, 'carry maximum cannot buy more'); equal(progress.state.coins, beforeMax, 'max carry costs nothing');
    check(progress.upgrade('speed'), 'speed upgrade'); equal(progress.state.upgrades.speed, 1, 'speed level increases');
    const beforeReward = progress.state.coins; progress.completeTutorial(); progress.completeTutorial();
    equal(progress.state.coins, beforeReward + 75, 'tutorial reward once'); equal(progress.state.tutorialStep, 7, 'tutorial complete step');
    check(progress.state.tutorialComplete, 'tutorial marked complete');
  }],
];

export function runCoreTests(): { name: string; pass: boolean; error?: string }[] {
  return cases.map(([name, run]) => { try { run(); return { name, pass: true }; } catch (error) { return { name, pass: false, error: error instanceof Error ? error.message : String(error) }; } });
}
