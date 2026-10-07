# Wild Nest System

> Current MVP activates all four preserved Nest positions: 3/4/5/5 physical slots and 300/300/600/600-second per-slot cooldowns. All pools contain Nature Eggs with increasing rarity. Development-only timer scaling accelerates testing while production config remains intact.


Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 12–15.

Each Wild Nest has multiple physical egg slots, its own egg pool and rarity distribution, its own Guardian, and per-nest configuration. V1 target slot capacity is **3–5**, allowed to differ between nests. Starter 3, mid-tier 4, and larger/higher-tier up to 5 are examples; actual assignments remain TBD.

## Per-Slot Respawn

After an egg is stolen, only its spawn slot empties and begins a respawn timer. Other eggs remain physically available. When the timer ends, that slot rolls/spawns from the nest's pool. There is no fixed global inventory refresh or whole-nest reset.

For five slots, theft from slots 1 and 2 leaves them empty/respawning while slots 3–5 remain available. Untouched eggs must not disappear or reroll.

| Nest category | EggRespawnSeconds | Trigger |
| --- | --- | --- |
| Standard normal/lower/mid-tier | 300 (5 minutes) | After that slot's egg is taken |
| Highest-tier Nest A (identity TBD) | 600 (10 minutes) | After that slot's egg is taken |
| Highest-tier Nest B (identity TBD) | 600 (10 minutes) | After that slot's egg is taken |

Only the TWO highest-tier nests use the confirmed longer default. Values are configurable per nest and may change after playtesting. Centralize EggSlotCount, EggSpawnPool, EggRespawnSeconds, Guardian, and Tier.

## Single-player Slots and Guardian Chase

The initial web version has local browser state and no multiplayer synchronization requirement. Slot cooldown is independent of Guardian pursuit. Future multiplayer claim/concurrency design is separate scope.

Stealing triggers that nest's guardian to pursue the thief throughout the return journey. Arrival in the thief's own safe zone secures the egg, ends pursuit, and sends the guardian to its original nest. Distance alone does not end aggression. Respawn cooldown is separate from the guardian chase end condition.

Later nests generally become farther away, may become higher, and offer better pools and harder guardians. The objective is escape; no guardian kill/boss requirement is introduced.

TBD: actual nest IDs/tier ordering, individual slot assignments, pools/probabilities, initial fill/restart policy, pickup interaction, and specific abilities.

Inspect [Stater-wild-nest-v1.png](../../REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png) and [High-tier-nest-v1.png](../../REFERENCES/ENVIRONMENT/High-tier-nest-v1.png) for composition only. See [Egg Pools](../../DATA/EGG_SPAWN_POOLS.md), [Nest Configs](../../DATA/NEST_CONFIGS.md), [Networking](../TECHNICAL/NETWORKING.md), and [Guardian AI](../AI/GUARDIAN_AI.md).

## Scale and Current Foundation

The compact fantasy Dragon City/Sanctuary is not city-building gameplay. Wild Nests must have meaningful physical travel distance from home: starter close, mid-tier farther, high-tier substantially farther and highest-tier among the longest journeys, generally with harder terrain and increased elevation. The Guardian return journey is core difficulty; no fast travel may skip it while carrying stolen Eggs. Exact distances/travel times remain subject to future playtesting.

Task 00 uses configurable procedural terrain and non-functional nest-shaped markers only. No egg slots/spawns, stealing, timers, Guardian AI/chase or progression are implemented. Marker geography does not assign final pools or the two 600-second nests. See [World Structure](WORLD_STRUCTURE.md) and [Sanctuary](PLAYER_SANCTUARY.md).
