# Balance and Design Data

Current executable MVP balance lives in [src/config/mvpConfig.ts](../src/config/mvpConfig.ts), marked `provisionalBalance: true`. DATA tables retain final-design planning; their TBD entries do not mean the current gameplay system is absent.

## Implemented MVP values

| System | Current configuration |
| --- | --- |
| Carry | Level 1/2/3 = 1/2/3 Eggs |
| Nest slots / production cooldown | Forest 3/300s; Highland 4/300s; Volcanic 5/600s; Frost 5/600s |
| Rarity pools, all Nature | Forest Common 100%; Highland Common 20%/Uncommon 80%; Volcanic Uncommon 20%/Rare 80%; Frost Rare 25%/Epic 75% |
| Food / growth | Basic Food 20 Coins, 50 Growth; Young threshold 100; first hatch grants 2 Food |
| Rewards | Secured Egg 50 Coins; tutorial completion 75 Coins |
| Foot / flight | Walk 30, sprint 50; flight 85, Boost 155, vertical 35 world units/s |
| Stamina | Base 100; held Boost drains 28/s; regeneration 18/s after delay |
| Rider upgrades | Three multiplier levels, +15% each; prices 100/175/250; Carry upgrades 100/225 |

Respawn is per slot and production 300/600 seconds remains intact. Only development debug mode accelerates timer updates. Feeding preserves Rarity and Element. Adult stage scaling, final reward tuning and broader element catalogs remain unresolved.

## Planning tables

[Dragon Stats](DRAGON_STATS.md), [Rider Values](RIDER_UPGRADE_VALUES.md), [Growth Values](DRAGON_GROWTH_VALUES.md), [Egg Pools](EGG_SPAWN_POOLS.md), [Nest Configs](NEST_CONFIGS.md), [Economy](ECONOMY_BALANCE.md).

[MASTER_GAME_SPEC.md](../MASTER_GAME_SPEC.md) remains authoritative. Current state is single-player and browser-local.
