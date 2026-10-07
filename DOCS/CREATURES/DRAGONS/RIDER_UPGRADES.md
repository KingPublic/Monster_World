# Rider Permanent Upgrades

> Current MVP: Coin-bought Speed/Stamina/Boost multiplier levels (three levels, +15% each) and Carry 1/2/3 work at the Rider area. Prices are provisional in [mvpConfig](../../../src/config/mvpConfig.ts).


Authority: [MASTER_GAME_SPEC.md](../../../MASTER_GAME_SPEC.md), sections 9–10.

Permanent rider upgrades apply universally to every dragon the player rides. Confirmed categories are Speed multiplier, Stamina multiplier, Boost multiplier, and Carry Capacity.

```text
Final Speed = Dragon stage-adjusted Base Speed × Rider Speed Multiplier
Final Stamina = Dragon stage-adjusted Base Stamina × Rider Stamina Multiplier
Final Boost = Dragon stage-adjusted Base Boost × Rider Boost Multiplier
```

These formulas are conceptual; final multiplier curves and numerical definitions are not locked. Current intended Carry Capacity is level 1 = 1 egg, level 2 = 2 eggs, and level 3 = 3 eggs, the current maximum.

Carrying should be visually physical. Carry 1 associates an egg with the rider; Carry 2 adds an egg carried by the dragon; Carry 3 intends one rider egg and one egg in each talon.

TODO: upgrade prices, multiplier levels, purchase rules, attachment/animation details, and persistence schema. See [upgrade values](../../../DATA/RIDER_UPGRADE_VALUES.md) and [upgrade GUI](../../UI_UX/UPGRADE_GUI.md).

Growth Stage stays separate from Rarity and Element; growth changes the applicable base profile, not the rider's universal upgrades. Inspect [Dragon-flight-carry-v1.png](../../../REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) for physical carry poses and [Rider-upgrades-v1.png](../../../REFERENCES/GUI/Rider-upgrades-v1.png) for visual layout. Shown prices/multipliers are not approved. See [Dragon Growth](DRAGON_GROWTH.md).
