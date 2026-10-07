# Dragon Collection GUI

> Current MVP: responsive HTML Collection cards show rarity, Nature element, Baby/Young stage, growth, rideable status and equipped state. Selecting an owned Young equips/recalls it to the Mount court; Baby must be fed first.


Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 5–9, 19, and 23.

Hatched dragons belong to the player and should feel meaningful and visible. Players eventually inspect, compare, select, and ride/equip eligible dragons.

## Required Display Capability

- Dragon name
- Rarity
- Element
- Growth Stage
- Base Stats (stage-adjusted Speed, Stamina, Boost)
- Rider-modified Final Stats
- Rideability
- Equipped/current mount state

Growth Progress can be represented where appropriate. Rarity, Element, and Growth Stage are independent; growth changes neither rarity nor element. Baby cannot be a normal full mount; Young/Juvenile and Adult are rideable.

Final Speed/Stamina/Boost = stage-adjusted Base Speed/Stamina/Boost × corresponding Rider Multiplier. Values and stage scaling remain TBD.

## Active Reference

[Dragon-collection-mount-v1.png](../../REFERENCES/GUI/Dragon-collection-mount-v1.png) guides collection cards, selected preview, separate rarity/element presentation, stat comparison, and ride-action styling. Its missing Growth Stage must be added according to written requirements. Exact names/stats, Divine tiers, locks, passive income, additive bonuses, and powers are not approved.

Detailed layout, comparison behavior, selection/equip validation, filtering, and schema remain TODO. See [Growth](../CREATURES/DRAGONS/DRAGON_GROWTH.md), [Player Nest](../WORLD/PLAYER_SANCTUARY.md), and [Reference Index](../../REFERENCES/REFERENCE_INDEX.md). No GUI is created in this pass.

The web UI direction uses an HTML/CSS overlay above the Three.js canvas. Task 00 exposes inspection controls only; this gameplay interface remains unimplemented.
