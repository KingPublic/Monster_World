# Egg System

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 10, 12–13, 15, and 18.

Players steal eggs or baby dragons from guarded wild nests and secure them at their own safe zone. Owned eggs and dragons cannot be stolen by other players. Returned eggs hatch as Babies; feeding/growth is required before normal mounting.

## Physical Egg Slots

Each nest has multiple physical slots, with a V1 capacity target of **3–5 slots**. Exact counts may differ: Starter 3, mid-tier 4, larger/higher-tier up to 5 are examples, not finalized assignments. Each slot can draw from its nest's configured pool and rarity distribution.

## Per-Slot Respawn

After theft, the egg disappears from the nest, only its slot becomes empty, and that slot's timer begins. Other eggs remain physically available. When the timer expires, the empty slot rolls/spawns a new egg from its nest's pool.

For five slots, stealing eggs from slots 1 and 2 leaves them empty/respawning while slots 3–5 stay available. Do not refresh/reset the whole nest, remove untouched eggs, or reroll them.

- Standard normal/lower/mid-tier nests: **300 seconds / 5 minutes** after theft.
- The **two highest-tier** nests: **600 seconds / 10 minutes** after theft.
- Timers are configurable per nest, not duplicated hardcoded periodic timers.

## Single-player Inventory

V1 inventory belongs to one browser session and has no multiplayer synchronization requirement. A successful theft empties only its slot and starts that slot cooldown. Future multiplayer concurrency is separate scope. Task 00 has no inventory system.

## Carry and Hatching

Confirmed Carry levels 1, 2, and 3 hold 1, 2, and 3 eggs, maximum 3. Carry 1 is with the rider; Carry 2 adds one carried physically by the dragon; Carry 3 uses one rider egg and one egg per talon. Use [Dragon-flight-carry-v1.png](../../REFERENCES/ANIMATION/Dragon-flight-carry-v1.png).

Secured eggs hatch as Babies in the sanctuary. Tutorial free Starter Food quickly grows the first Baby into a rideable Young/Juvenile; hatching alone does not unlock mounting.

TBD: actual nest identities, per-nest slot assignment, pools/probabilities, pickup controls, initial fill/restart policy, failure handling, baby-dragon carrying rules, and later hatch timings. Approved per-slot respawn is settled; these open details must not replace it.

See [Egg Pools](../../DATA/EGG_SPAWN_POOLS.md), [Nest Configs](../../DATA/NEST_CONFIGS.md), [Networking](../TECHNICAL/NETWORKING.md), and [Dragon Growth](../CREATURES/DRAGONS/DRAGON_GROWTH.md). No gameplay implementation occurs in this pass.
