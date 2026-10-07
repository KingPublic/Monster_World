# Browser Domain Model Direction

Design concepts, not a finalized runtime/save schema: Dragon ownership/selection; independent Rarity + Element + Growth Stage; Growth Progress; Food ownership; stage-adjusted base Speed/Stamina/Boost; universal Rider multipliers and Carry Capacity 1/2/3; carried versus secured Eggs; per-nest slots/pools/Guardian/Tier; Coins and progression.

Planned NestConfig fields remain EggSlotCount (configurable 3–5), EggSpawnPool (TBD), EggRespawnSeconds (300 standard; 600 for the two highest-tier nests), Guardian (TBD) and Tier (TBD). Only a stolen slot enters cooldown; untouched eggs remain. V1 state is single player. Stable IDs, field types, serialization/versioning, saved cooldown initialization and failure handling remain TBD.

Task 00 config describes visual region positions and runtime assets only; it is not a production balance catalog. Future Creature → Dragon extension must remain practical and Dragons-only until authorized. Growth preserves Rarity/Element and Rider multipliers apply after stage-adjusted bases. [DATA](../../DATA/README.md) retains balance planning. See [save direction](SAVE_SYSTEM.md) and [architecture](ARCHITECTURE.md).
