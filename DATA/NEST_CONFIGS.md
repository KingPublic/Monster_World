# Nest Configuration Planning

> Executable MVP: Forest 3 slots/300s; Highland 4/300s; Volcanic 5/600s; Frost 5/600s. Four preserved world positions are active; all contain Nature Eggs. Source: [mvpConfig](../src/config/mvpConfig.ts). Final catalog/route tuning below remains planning.


Authority: [MASTER_GAME_SPEC.md](../MASTER_GAME_SPEC.md), sections 12–15 and 22.

## Confirmed V1 Fields

| Conceptual NestConfig field | Meaning | V1 value/status |
| --- | --- | --- |
| EggSlotCount | Physical slot capacity, not always-occupied egg count | Target 3–5; configurable individually |
| EggSpawnPool | Pool from which each slot rolls/spawns | TBD per nest |
| EggRespawnSeconds | Empty slot cooldown after its egg is taken | 300 standard; 600 for the TWO highest-tier nests |
| Guardian | That nest's protective/chasing guardian | Identity/tuning TBD per nest |
| Tier | Nest progression category | Exact identities/order TBD |

Starter 3 slots, mid-tier 4, and larger/higher-tier up to 5 are examples, not final assignments. Nests need not share the same count.

## Respawn Defaults

| Planning entry | EggSlotCount | EggRespawnSeconds | Pool / probabilities | Guardian / Tier |
| --- | --- | --- | --- | --- |
| Starter / standard normal-lower-mid nest | 3–5 target; exact count TBD | 300 (5 minutes) | TBD | TBD |
| Highest-tier Nest A (identity TBD) | 3–5 target; exact count TBD | 600 (10 minutes) | TBD | One of the two highest-tier nests |
| Highest-tier Nest B (identity TBD) | 3–5 target; exact count TBD | 600 (10 minutes) | TBD | One of the two highest-tier nests |

These are **configurable V1 balancing values**, adjustable after playtesting. The A/B labels are planning placeholders, not actual nest IDs or biome assignments.

## Per-Slot Lifecycle

A successful theft removes that egg, empties only that slot, and starts its timer. Untouched eggs stay available. After expiration, that slot rolls/spawns from the nest's pool. This is not a fixed periodic/global refresh of the nest.

Five-slot example: steal from slots 1 and 2 → they are empty/respawning; slots 3–5 remain available. V1 inventory is local single-player browser state; future multiplayer concurrency is separate scope.

The guardian chases the thief until arrival in their own safe zone, then returns to its original nest. Slot timers do not alter that chase rule.

TBD: actual IDs, tier ordering, per-nest slot count/positions, pool weights/rarity probabilities, guardian tuning, initial fill/restart behavior, and exact implementation. Centralize configuration; do not duplicate hardcoded timers.

See [Wild Nests](../DOCS/WORLD/WILD_NEST_SYSTEM.md), [Egg Pools](EGG_SPAWN_POOLS.md), and [Networking](../DOCS/TECHNICAL/NETWORKING.md).
