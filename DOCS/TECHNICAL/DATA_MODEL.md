# Data Model Planning

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 6–10, 12–13, 19, and 28.

Confirmed domain concepts include dragon ownership and selection, independent dragon Rarity/Element/Growth Stage, Growth Progress, food ownership, stage-adjusted dragon base Speed/Stamina/Boost, universal rider upgrades, Carry Capacity, shared per-nest physical slots/pools/distributions/guardian and per-slot respawn, and future persistent progression/currency.

These are design concepts, not a finalized runtime or save schema. No finalized record schema, identifiers, serialization format, remote contracts, or Studio instances are defined during this documentation pass.

TODO: approved records and relationships, stable identifiers, field types, ownership representation, carried versus secured items, and versioning when the relevant milestone is designed.

See [architecture](ARCHITECTURE.md), [save system](SAVE_SYSTEM.md), and [DATA](../../DATA/README.md).

## Approved Nest Configuration Concept

EggSlotCount, EggSpawnPool, EggRespawnSeconds, Guardian, and Tier are the supplied conceptual per-nest configuration fields, not a finalized runtime schema. V1 slot capacity targets 3–5 with individual counts; standard slot respawn is 300 seconds and the TWO highest-tier nests use 600 seconds. Per-slot timers begin after theft; untouched eggs remain available. Shared claims must be server-authoritative.

Food grants Growth Points and fills Growth Progress; Young/Juvenile is the first rideable stage. Growth preserves rarity and element. Stage-adjusted base stats are multiplied by rider global multipliers. Food values, thresholds, prices, IDs, and stage scaling remain TBD. See [Growth](../DRAGONS/DRAGON_GROWTH.md) and [Growth Values](../../DATA/DRAGON_GROWTH_VALUES.md).

## Task 01 Session Representation

The authorized Studio prototype holds server sessions keyed by Player, with stage, UserId, owned Home, carried/secured egg state, food count, Dragon identity/growth record, model and mounted state. A token prevents obsolete delayed hatch/growth callbacks after session removal. Runtime Player/model attributes and State snapshots expose presentation/debug information; clients cannot approve progression through them.

The dragon record keeps Rarity, Element, GrowthStage and GrowthPoints separate. One shared tutorial slot records its Claimant before any yielding work. Owned sanctuary/dragon models use OwnerUserId. These are session structures only, not a production save schema or full NestConfig implementation. See [Task 01 report](../../TESTING/TASK_01_PLAYTEST_REPORT.md); stable persistence IDs/schema remain later work.
