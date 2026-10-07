# Task 03 — Wild Nests and Guardians

STATUS: NOT STARTED

## High-Level Objective

- Multiple wild nests and nest progression.
- Egg spawn pools and per-slot respawn after theft; 3–5 slot capacity target with individual nest counts.
- Standard slots respawn after 300 seconds; the TWO highest-tier nests use 600 seconds, configurable per nest.
- Shared server-authoritative claims prevent duplicate theft; untouched eggs stay available.
- Nest guardians.
- Chase throughout the return journey until arrival in the thief's own safe zone.

## Required Reading When Requested

- [Master specification](../MASTER_GAME_SPEC.md)
- [Wild nest system](../DOCS/WORLD/WILD_NEST_SYSTEM.md) and [world structure](../DOCS/WORLD/WORLD_STRUCTURE.md)
- [Egg system](../DOCS/GAMEPLAY/EGG_SYSTEM.md)
- [Guardian AI](../DOCS/AI/GUARDIAN_AI.md) and [safe zone](../DOCS/WORLD/SAFE_ZONE.md)
- [Egg pools](../DATA/EGG_SPAWN_POOLS.md) and [nest configs](../DATA/NEST_CONFIGS.md)
- Relevant [environment](../REFERENCES/ENVIRONMENT/README.md) and [dragon](../REFERENCES/DRAGONS/README.md) references

Detailed requirements, guardian abilities, exact pools/probabilities, nest identities/tier ordering, per-nest slot assignments, initial fill/restart behavior, acceptance criteria, and playtest procedure are TODO. The confirmed configurable V1 per-slot respawn replaces periodic whole-nest refresh. The objective is escape, not a guardian kill or boss fight. Do not implement this milestone during Task 00 or automatically proceed to Task 04.

Read [Networking](../DOCS/TECHNICAL/NETWORKING.md) and [Reference Index](../REFERENCES/REFERENCE_INDEX.md). World level locks, exact biome ordering, Fast Travel, HP bars, and image-only abilities remain unapproved. This documentation pass allows no Studio changes.
