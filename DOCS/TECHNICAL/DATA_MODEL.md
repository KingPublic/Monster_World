# Browser Domain Model

[Progression](../../src/gameplay/Progression.ts) owns serializable inventory/economy/tutorial state and independent in-session Egg slots. Rendering consumes this state; Three.js objects are never serialized.

| Record | Main fields |
| --- | --- |
| DragonRecord | id, name, rarity, element: Nature, stage: Baby/Young, growth |
| CarriedEgg / secured Egg | id, rarity, element: Nature, nestId |
| SaveData v1 | tutorialComplete/step, coins, food, dragons, equippedDragonId, carryLevel, upgrades, securedEggs |
| NestState | id, slots: egg or null + remaining cooldown |
| Runtime Nest config | preserved marker coordinates, slotCount, pool, respawnSeconds, Guardian speed/grace/catch radius |

Rarity and Element are independent of Growth Stage. Feeding cannot change either identity. Baby is not equipable/rideable; Young owns a procedural saddle anchor. Carry levels 1/2/3 permit exactly 1/2/3 Eggs.

Only a stolen slot empties and begins its 300/600-second cooldown. Development time scaling is passed to timer updates, never written into production config. Captured stolen loot is lost; ownership and Coins remain intact. Safe Zone delivery moves carried Eggs to secured inventory and grants rewards before capture can apply.

[Runtime configuration](../../src/config/mvpConfig.ts) centralizes provisional balance, distinct from unresolved final tuning in [DATA](../../DATA/README.md). See [save behavior](SAVE_SYSTEM.md).
