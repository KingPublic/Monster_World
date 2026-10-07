# Egg Spawn Pools

Authority: [MASTER_GAME_SPEC.md](../MASTER_GAME_SPEC.md), sections 12–13.

Each Wild Nest has its own configured pool and rarity distribution. Each physical egg slot draws from that pool; different eggs can coexist. V1 slot capacity targets 3–5 and may differ per nest. Farther progression should offer better pools and greater rarity potential.

| Nest planning entry | Egg pool | Rarity distribution / probabilities | Slot capacity |
| --- | --- | --- | --- |
| Starter / standard nest | Tutorial egg identity / individual pools TBD | TBD | 3–5 target; Starter 3 is an example |
| Other standard normal/lower/mid-tier nests | Individual pools TBD | TBD | 3–5 target; mid-tier 4 is an example |
| TWO highest-tier nests (identities TBD) | Individual pools TBD | TBD | 3–5 target; exact counts TBD |

These are planning placeholders, not a final catalog, nest count, biome order, guaranteed roll, or production configuration. Rarity, Element, and Growth Stage are independent; reference labels do not establish fixed rarity-element pairs or odds.

**Per-slot** respawn begins after theft: standard nests 300 seconds; the two highest-tier nests 600 seconds. Only the empty slot rolls/spawns after its cooldown. Untouched eggs remain physically available and are not reset or rerolled. V1 inventory is local single-player state.

See [Nest Configs](NEST_CONFIGS.md), [Egg System](../DOCS/GAMEPLAY/EGG_SYSTEM.md), and [Networking](../DOCS/TECHNICAL/NETWORKING.md). Pool identities, weights, and probabilities remain TBD.
