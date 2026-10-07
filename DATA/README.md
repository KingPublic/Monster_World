# Balance and Design Data

DATA/ contains canonical planned balancing values and design tables. Future Roblox configuration should derive from approved values here where practical and keep per-nest timers/slot settings and later approved food/growth/stat values centralized.

## Confirmed Values and Open Balance

- Carry levels 1/2/3 hold 1/2/3 eggs; current maximum 3.
- Wild Nest physical slot capacity targets 3–5 with individual counts. Starter 3 / mid-tier 4 / larger up to 5 are examples, not final assignments.
- Per-slot respawn: 300 seconds for standard normal/lower/mid-tier nests, 600 for the TWO highest-tier nests; begins only after that slot's egg is taken. Untouched eggs remain available.
- Normal gameplay Coins primarily buy Dragon Food.
- Food points/prices, growth thresholds, stage scaling, multiplier curves, pool identities/rarity probabilities, and income remain TBD. TBD/TODO is an unresolved value, not a numerical default.

## Tables

- [Dragon Stats](DRAGON_STATS.md): stage-adjusted Speed/Stamina/Boost.
- [Rider Values](RIDER_UPGRADE_VALUES.md): universal multipliers and Carry 1–3.
- [Growth Values](DRAGON_GROWTH_VALUES.md): V1 placeholders and sufficient free tutorial food.
- [Egg Pools](EGG_SPAWN_POOLS.md): per-slot rolls from each nest's pool; probabilities TBD.
- [Nest Configs](NEST_CONFIGS.md): EggSlotCount, EggSpawnPool, EggRespawnSeconds, Guardian, Tier.
- [Economy](ECONOMY_BALANCE.md): approved Coin-bought food; unresolved prices/rewards.

[MASTER_GAME_SPEC.md](../MASTER_GAME_SPEC.md) remains authoritative. Shared egg claims must be server-authoritative; no production configuration or gameplay is created in this pass.
