import {mvpConfig,upgradeMultiplier} from '../config/mvpConfig';
import type {DragonRecord,SaveData} from './Progression';
/** Derived values keep saved identity small and old saves compatible. */
export function dragonStats(dragon?:DragonRecord,upgrades?:SaveData['upgrades']){
 const c=mvpConfig.dragonCare,n=Math.min(c.maxMeals,Math.max(0,Math.floor(dragon?.careMeals??0))),f=mvpConfig.flight;
 return {meals:n,level:1+Math.floor(n/c.mealsPerLevel),size:1+n*c.sizePerMeal,
  maxHealth:c.baseHealth+n*c.healthPerMeal,
  speed:f.speed*(1+n*c.speedPerMeal)*upgradeMultiplier(upgrades?.speed??0),
  stamina:f.stamina*(1+n*c.staminaPerMeal)*upgradeMultiplier(upgrades?.stamina??0),
  boost:f.boostSpeed*(1+n*c.boostPerMeal)*upgradeMultiplier(upgrades?.boost??0)};
}
export function dragonAvailable(dragon:DragonRecord):boolean{return (dragon.recoveryReadyAt??0)===0&&(dragon.health??dragonStats(dragon).maxHealth)>0;}
export function recoverySecondsLeft(dragon:DragonRecord,now=Date.now()):number{return Math.max(0,Math.ceil(((dragon.recoveryReadyAt??0)-now)/1000));}
export function recoveryLabel(dragon:DragonRecord,now=Date.now()):string{const s=recoverySecondsLeft(dragon,now);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
