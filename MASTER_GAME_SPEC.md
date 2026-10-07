# Steal a Baby Dragon — Master Game Specification

This specification integrates the original setup design and the approved Documentation + Reference Synchronization Pass. **Confirmed** rules, **configurable V1 values**, **targets**, **candidate examples**, and **TBD/TODO** decisions are distinguished. The original setup prompt is historical input. The synchronization pass was documentation-only. The user's subsequent Task 01 authorization permits that tutorial slice in Studio; it is now verified COMPLETE. See [Task 01 report](TESTING/TASK_01_PLAYTEST_REPORT.md). Later milestones remain unauthorized and NOT STARTED.

## 1. Game Vision

**Steal a Baby Dragon** combines Dragon Sanctuary / Dragon Village collection fantasy, hatching and growth, rideable dragons, multiple elements and rarities, and permanent rider progression with stealing eggs or baby dragons from guarded wild nests and escaping back home.

The sanctuary is a progression and collection hub. The game is **not a city-builder**; tile-by-tile building is not its core loop.

## 2. Core Fantasy

Explore a stylized fantasy world, brave a guardian's pursuit, secure an egg at home, hatch a Baby Dragon, feed it, and grow it into a rideable companion. Build a visible dragon collection in a compact sanctuary. Flight, physical egg carrying, growth reveals, and the return journey should be readable and satisfying.

## 3. Core Gameplay Loop

```text
Explore → Find Wild Nest → Choose Egg → Steal
→ Guardian Detects Theft → Guardian Chase → Escape
→ Reach Player Safe Zone → Secure Egg → Hatch Dragon
→ Feed / Grow Dragon → Ride Dragon → Earn Coins / progression resources
→ Upgrade → Raid farther and harder nests → Repeat
```

See [Core Loop](DOCS/GAMEPLAY/CORE_LOOP.md), [Dragon Growth](DOCS/DRAGONS/DRAGON_GROWTH.md), and [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md).

## 4. Player Character

Players begin the tutorial on foot and later ride their first Young/Juvenile dragon after feeding the hatched Baby. Permanent upgrades belong to the player/rider and apply universally to every dragon they ride.

On desktop, hold **Left Shift** to Sprint on foot and to Boost while riding. See section 11. Other character controls, interaction mappings, and on-foot sprint tuning remain TODO.

## 5. Dragon Mounts

Dragons hatch as **Baby Dragons**, which live in the sanctuary and cannot serve as normal full mounts yet. **Young/Juvenile** dragons are rideable and introduce flight. **Adult** dragons are rideable and receive the intended mature/base-stat profile for their species. Stage-dependent numerical scaling remains TBD.

### Independent Identity Dimensions

A dragon has three independent dimensions: **Rarity + Element + Growth Stage**. For example, Mythic + Storm + Baby = Mythic Storm Baby Dragon. Growth changes neither rarity nor element:

```text
Mythic Storm Egg → Mythic Storm Baby → Mythic Storm Juvenile → Mythic Storm Adult
```

V1 stage direction is Egg → Baby → Juvenile / Young → Adult; exact stage naming can be standardized later. Feeding grants Growth Points, fills Growth Progress, and triggers the next stage at its threshold. The transition updates the model, animation/VFX, and applicable stage-dependent stats.

Dragons have their own base movement stats and may have different movement profiles. Smooth movement and animation are priorities. Desired movement includes takeoff, normal flight, gliding, turning/banking, ascending, descending, landing, and boosting. These are future implementations.

See [Dragon System](DOCS/DRAGONS/DRAGON_SYSTEM.md), [Dragon Growth](DOCS/DRAGONS/DRAGON_GROWTH.md), and [Growth Values](DATA/DRAGON_GROWTH_VALUES.md).

## 6. Dragon Rarity

Rarity, element, and growth stage are independent properties. Growing a dragon does not change rarity or element. Candidate rarity categories include Common, Uncommon, Rare, Epic, Legendary, Mythic, and potentially special/secret tiers later. The roster and distributions are not final.

“Mythic Fire Dragon,” “Mythic Ice Dragon,” and “Mythic Storm Baby Dragon” illustrate independent identity properties; they do not establish final content or a mandatory rarity/element pairing.

See [Rarity System](DOCS/DRAGONS/RARITY_SYSTEM.md).

## 7. Dragon Elements

Candidate elements include Nature, Fire, Ice, Storm, Earth, Shadow, and Light / Celestial. The final roster is not locked. Element is independent of rarity and growth stage, and stays unchanged during growth.

Elements primarily influence movement identity, visual identity, and potentially specialized stats. The MVP should not become a combat-heavy RPG. Do not turn element labels in a reference into fixed rarity tiers or approved combat abilities.

See [Element System](DOCS/DRAGONS/ELEMENT_SYSTEM.md).

## 8. Dragon Base Stats

Confirmed base stats are **Speed**, **Stamina**, and **Boost**. Different dragons can have different movement profiles. Growth stage adjusts the base-stat profile before universal rider multipliers apply; Adults receive the intended mature profile for their species.

Final values, units, stat ranges, and stage scaling remain TBD. See [Dragon Stats](DATA/DRAGON_STATS.md) and [Growth Values](DATA/DRAGON_GROWTH_VALUES.md).

## 9. Rider Permanent Upgrades

Confirmed categories are Speed Multiplier, Stamina Multiplier, Boost Multiplier, and Carry Capacity. These permanent rider upgrades affect every dragon the rider uses.

```text
Final Speed = Dragon stage-adjusted Base Speed × Rider Speed Multiplier
Final Stamina = Dragon stage-adjusted Base Stamina × Rider Stamina Multiplier
Final Boost = Dragon stage-adjusted Base Boost × Rider Boost Multiplier
```

Final multiplier progression, prices, stage scaling, and numerical interpretation of Boost remain TBD. Additive bonuses displayed in a concept image do not replace the multiplier formulas.

See [Rider Upgrades](DOCS/DRAGONS/RIDER_UPGRADES.md) and [Upgrade Values](DATA/RIDER_UPGRADE_VALUES.md).

## 10. Carry Capacity

Carry Capacity is a permanent rider upgrade. The confirmed V1 progression is:

| Carry level | Egg capacity |
| --- | --- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3; current maximum |

At Carry 1, an egg is associated with/carried by the rider. At Carry 2, an additional egg can be carried physically by the dragon. The Carry 3 visual concept is one egg carried/held by the rider and one egg in each dragon foot/talon.

Carrying should feel physical and readable. Use [Dragon-flight-carry-v1.png](REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) for poses. TODO: exact attachments, animation timing, and baby-dragon capacity rules; the egg progression does not silently define those details.

## 11. Boost and Stamina

Boost is **hold-to-use**, without repeated tapping. Holding Boost increases flight speed and consumes stamina substantially faster. Releasing it smoothly returns toward normal flight speed. Stamina regeneration follows future balancing rules.

### Confirmed Desktop Input

| Player state | Input | Action |
| --- | --- | --- |
| On foot | Hold Left Shift | Sprint |
| Riding a dragon | Hold Left Shift | Dragon Boost |

Boost is active only while held. Do not require frequent repeated Shift presses.

### Confirmed Mobile Input

Use a dedicated **HOLD Boost** button. [Mobile-HUD-v1.png](REFERENCES/GUI/Mobile-HUD-v1.png) guides general placement and visual direction; exact sizing is implementation-dependent. Other touch controls and on-foot mobile Sprint mapping remain TODO.

TODO: normal flight stamina behavior, depletion, regeneration, drain rates, and all unconfirmed inputs. [HUD-v2.png](REFERENCES/GUI/HUD-v2.png) and [Flight-hud-v1.png](REFERENCES/GUI/Flight-hud-v1.png) provide presentation references. A Q shortcut or separate numerical Boost meter in another image is not an approved input or resource mechanic.

## 12. Wild Dragon Nests

The world has multiple wild nests. Later nests generally become farther away, may gradually become higher, and can have more dangerous or visually distinct environments and better egg pools. Nests should not form a perfectly vertical tower.

The longer return journey matters because guardian pursuit creates tension. Each nest has its own multiple physical spawn slots, possible egg pool, rarity distribution, and guardian. V1 target capacity is 3–5 egg slots per nest, configurable individually; occupied availability can decrease when eggs are stolen.

See [Wild Nest System](DOCS/WORLD/WILD_NEST_SYSTEM.md).

## 13. Egg Spawn and Refresh

Each Wild Nest has multiple physical egg spawn slots, its own egg pool/rarity distribution, and its own Guardian. **V1 target slot capacity: 3–5 per nest**, with counts allowed to differ. Starter 3, mid-tier 4, and larger/higher-tier up to 5 are examples, not final assignments.

### Per-Slot Respawn

Availability does **not** globally refresh/reset the whole nest. After an egg is stolen, that egg disappears from its nest slot, only that slot becomes empty, and its respawn timer starts. Untouched eggs remain physically available. When that timer expires, the empty slot rolls/spawns a new egg from its nest's configured pool.

For a five-slot nest, theft from slots 1 and 2 leaves those two empty/respawning while slots 3–5 remain available. No untouched egg is removed or rerolled.

### Configurable V1 Timers

| Nest category | Egg Slot Respawn Time | Timer trigger |
| --- | --- | --- |
| Normal / lower / mid-tier nests | **300 seconds (5 minutes)** | After that slot's egg is taken |
| The **two highest-tier** Wild Nests | **600 seconds (10 minutes)** | After that slot's egg is taken |

Both values are approved **configurable V1 balancing values**, adjustable after playtesting. Centralize configuration per nest: `EggSlotCount`, `EggSpawnPool`, `EggRespawnSeconds`, `Guardian`, and `Tier`. Do not duplicate hardcoded timers across systems. Exact nest identities/tier ordering, per-nest slot assignment, pools, and rarity probabilities remain TBD.

### Shared Multiplayer Inventory

Egg slots are shared world resources. A successful theft makes that egg unavailable to other players; only that slot enters cooldown and other slots remain stealable. Claims must be **server-authoritative**, preventing multiple players from successfully claiming the same egg simultaneously.

See [Egg System](DOCS/GAMEPLAY/EGG_SYSTEM.md), [Wild Nest System](DOCS/WORLD/WILD_NEST_SYSTEM.md), [Egg Spawn Pools](DATA/EGG_SPAWN_POOLS.md), [Nest Configs](DATA/NEST_CONFIGS.md), and [Networking](DOCS/TECHNICAL/NETWORKING.md).

## 14. Guardian Dragons

Each wild nest has its own protective parent/guardian dragon. Mommy Dragon, Daddy Dragon, and elemental variants are examples rather than a final roster.

Difficulty generally increases at more valuable nests and should not rely only on raw speed. Future guardians may differ through pursuit behavior, ranged pressure, elemental effects, acceleration, movement patterns, or environmental interaction. These abilities are not finalized or implemented during Task 00.

Guardians create chase pressure; the objective is **ESCAPE**, not killing the guardian. Elemental breath, dives, movement pressure, and environmental hazards are possible later variations, not finalized abilities. Guardian HP bars, damage builds, weapons, and boss combat are not confirmed systems.

See [Guardian AI](DOCS/AI/GUARDIAN_AI.md).

## 15. Guardian Chase Rules

```text
Steal from a wild nest
↓
That nest's guardian becomes aggressive
↓
Guardian pursues the thief throughout the return journey
↓
Player enters their own safe zone
↓
Stolen item is secured
↓
Guardian stops pursuing
↓
Guardian returns to its original wild nest
```

The guardian must not simply lose aggression because the player has flown far enough away. Arrival in the player's own safe zone is the primary successful chase end condition.

TODO: consequences of capture, death, disconnection, abandoned stolen items, and simultaneous thieves. Those unresolved cases must not silently become new chase rules.

## 16. Player Nest

Each player has their own nest/base, serving as home, safe zone, hatch area, dragon collection area, mount selection area, and progression hub. Owned dragons can visibly live here, including small Baby Dragons awaiting feeding.

### Sanctuary / Village Direction

The Player Nest should visually feel like a compact **Dragon Sanctuary or Dragon Village**. It may contain physical Hatchery, Dragon Collection, Mount selection, Rider Upgrade, and Shop areas, decorative habitats, and spaces for owned dragons. A social/progression hub feeling and dragon-city collection fantasy are approved visual direction.

The game is **not a city-builder**. Players are not required to construct buildings tile-by-tile as the core loop. The primary loop remains stealing from guarded wild nests and physically escaping home, followed by Hatch → Feed → Grow → Ride → Upgrade.

The physical Shop primarily sells Dragon Food for normal gameplay Coins. Detailed layout, sanctuary visual progression, and other services remain TODO. Teleport/Fast Travel shown in [Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) is visual/conceptual only and is not an approved service.

See [Player Nest](DOCS/WORLD/PLAYER_NEST.md) and [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md).

## 17. Safe Zone

The player returns to their own safe zone to secure stolen items. The pursuing guardian stops and returns to its original wild nest after successful arrival.

TODO: exact boundaries, presentation, and arrival validation. See [Safe Zone](DOCS/WORLD/SAFE_ZONE.md).

## 18. Hatching

Secured stolen eggs are placed/hatched at the player's sanctuary Hatchery. Dragons hatch as **Babies**, which are not normal full mounts. The tutorial hatches quickly, then grants enough **FREE STARTER FOOD** to grow the first Baby into a rideable Young/Juvenile dragon quickly. Hatching alone does not make it rideable.

Later hatch timings remain TBD. Hatching should include satisfying egg movement, cracking, elemental VFX, reveal, and Baby emergence rather than an instant asset swap. [Hatchery-v1.png](REFERENCES/GUI/Hatchery-v1.png) guides egg presentation, progress presentation, atmosphere, and reveal; its multi-hour timers, paid speed-ups, premium currency, and incubator counts are not approved rules.

See [Hatching GUI](DOCS/UI_UX/HATCHING_GUI.md) and [Dragon Growth](DOCS/DRAGONS/DRAGON_GROWTH.md).

## 19. Dragon Collection

Hatched dragons belong to the player and should be meaningful, visible collectibles. Players eventually inspect, compare, select, and ride/equip eligible dragons.

Collection presentation should support dragon name, Rarity, Element, Growth Stage, Base Stats, rider-modified Final Stats, rideability, and equipped/current mount state. Growth Progress can appear where appropriate. Growing a dragon preserves its rarity and element.

See [Dragon Collection GUI](DOCS/UI_UX/DRAGON_COLLECTION_GUI.md). Passive income amounts or extra tiers in the concept image are not approved economy or roster decisions.

## 20. Economy

**Coins** are approved normal gameplay currency for primarily purchasing Dragon Food from the physical Player Nest Shop. Food grants Growth Points and supports Baby → Young/Juvenile → Adult growth, giving players reasons to earn Coins, return home, and care for collected dragons.

Shop categories are Dragon Food (core progression), Utility (future optional support; exact items unresolved), and Cosmetics (future customization; not required for current MVP gameplay). Candidate food types include Starter Food, Basic Food, Better Food, and element-themed treats; exact items and values remain TBD. Tutorial Starter Food is free and sufficient for the first rideable stage.

Income sources, reward rules, food prices/points, growth thresholds, rider costs, and any other currencies remain TBD. No passive-income system, temporary boosts, paid timers, or premium products are approved by image filler.

See [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md), [Growth Values](DATA/DRAGON_GROWTH_VALUES.md), and [Economy Balance](DATA/ECONOMY_BALANCE.md).

## 21. Tutorial

Keep onboarding fast: approximately the opening **1–3 minutes / few minutes**, subject to playtesting. Spawn on foot → learn movement → travel to nearby Starter Wild Nest → see Guardian protecting eggs → steal tutorial egg → theft detected → Guardian alerts/roars and pursues → return to own Sanctuary/Safe Zone → egg secured → Guardian stops and returns home → place/hatch egg → Baby appears → explain hunger → grant FREE STARTER FOOD → feed Baby → Growth Progress fills → Baby grows into rideable Young/Juvenile → mount → basic flight introduction → tutorial complete.

The first dragon requires no grinding, long waiting, or premium gates. The free starter grant must be sufficient to reach the first rideable stage; quantities, points, and thresholds remain TBD.

Task 01's first playable prototype is COMPLETE: theft/chase/secure, fast hatch, free feeding, Baby → Juvenile, Seat mounting/dismounting, basic flight/stamina, held Boost and touch controls. Desktop tutorial inputs are WASD, Space ascend, Left Ctrl descend, held E interaction, F dismount, and held Left Shift Sprint/Boost. Prototype values and starter identity are configurable in Studio and do not finalize production DATA balances. The full shared 3–5 egg inventory and live 300/600-second timers remain Task 03. See [Tutorial Flow](DOCS/GAMEPLAY/TUTORIAL_FLOW.md) and [verified results/limitations](TESTING/TASK_01_PLAYTEST_REPORT.md).

Task 01 visual polish: the user-approved imported `StarterNatureYoung_v1` represents Nature + Young/Juvenile + first rideable tutorial dragon only. It replaces the Juvenile placeholder appearance while retaining Root/Seat/controller. Baby and Guardian remain separate; it is not an Adult model. Rarity and numerical tuning are unchanged. The asset is static; full creature rig/animation is later work. See [visual replacement validation](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md).

## 22. World Progression

Progression combines permanent rider upgrades, increasingly rare dragon collection, feeding-based dragon growth, and spatial/capability-based world access.

Stronger rider + better dragon + higher growth stage allow farther travel and successful raids of harder Wild Nests. Players begin near easier nests; distance, general elevation, guardian difficulty, egg quality, rarity potential, and escape difficulty increase farther into progression. Avoid unnecessary hard level walls.

The meta loop is Steal → Hatch → Feed → Grow → Ride → Earn → Upgrade → Go farther → Steal rarer eggs. Physical escape distance is part of chase difficulty. **Fast Travel / teleportation is not a confirmed core feature**; image-only portals, map markers, biome locks, numeric level requirements, and exact biome order are not approved.

See [World Structure](DOCS/WORLD/WORLD_STRUCTURE.md) and [Progression](DOCS/GAMEPLAY/PROGRESSION.md).

## 23. UI/UX

The GUI should be clean, highly readable, modern, polished, fantasy themed, and appropriate for desktop/mobile without excessive clutter.

Future UI includes Coins/resources, stamina, hold-to-use Boost, carry count, current dragon, tutorial objectives, rider upgrades, collection, Hatchery, and Shop presentation. Collection supports the three independent identity dimensions, stage-adjusted Base Stats, rider-modified Final Stats, rideability, and equipped state; Growth Progress can be shown where appropriate.

Approved visual references are present under `REFERENCES/GUI/`, including both `HUD-v1.png` and `HUD-v2.png`. Inspect actual images listed in [Reference Index](REFERENCES/REFERENCE_INDEX.md). Keep exact filenames and versions. Composition and visual language are guidance; exact pixel layouts, sizes, prices, timers, stats, and unsupported controls/mechanics remain unapproved.

See [HUD Spec](DOCS/UI_UX/HUD_SPEC.md), [Upgrade GUI](DOCS/UI_UX/UPGRADE_GUI.md), [Collection GUI](DOCS/UI_UX/DRAGON_COLLECTION_GUI.md), and [Hatching GUI](DOCS/UI_UX/HATCHING_GUI.md).

## 24. Animation Direction

Smoothness is a major quality goal. Future dragon states may include idle, breathing, walking, running, takeoff, normal flight, flap, glide, bank left/right, ascend, descend, boost, and landing.

Future guardian states may include sleep/idle, alert, roar, takeoff, chase, attack, disengage at the safe zone, and return to nest. Hatching may include egg movement, cracking, elemental VFX, reveal, and baby dragon emergence.

Baby idle/living behavior, eating, and growth transformation animation/VFX are also required design targets. Growth thresholds trigger the stage/model update and applicable stat recalculation. Dedicated production animation assets are not established by the reference images.

These are future animation targets, not implementations in this documentation pass. See [Animation References](REFERENCES/ANIMATION/README.md).

## 25. Art Direction

**Stylized Premium Fantasy / Premium Toy-Fantasy** is the desired direction. Aim for polished, attractive, smooth, collectible dragons with readable silhouettes, slightly stylized forms, controlled color, and a premium Roblox feel. Baby dragons can be small and cute; Young/Juvenile and Adult mounts should be impressive; guardians should be larger and more intimidating. Sanctuary architecture may evoke Dragon Village collection games without introducing tile-by-tile building.

Avoid hyper-realism, an exclusively extremely childish/chibi presentation, inconsistent asset packs, and a generic low-quality AI-generated appearance.

Concept/reference images are visual targets, not automatically production-final assets. High-quality final models may require modeling or mesh generation, optimization, rigging, skinning, animation, Roblox importing, review, and iteration. All prototypes must remain replaceable.

[Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) is the active global visual reference: warm sanctuary spaces, distinct elemental zones, readable growth/guardian silhouettes, and dark panels with fantasy trim. Image-only Strength/Luck stats, selling, products, and numbers are not approved mechanics.

See [Art Direction References](REFERENCES/ART_DIRECTION/README.md), [Reference Index](REFERENCES/REFERENCE_INDEX.md), and [Asset Manifest](ASSET_MANIFEST.md).

## 26. Multiplayer Rules

Players share the world and can naturally compete for available wild nest eggs. Physical egg slots are shared resources; the server authoritatively validates a single successful claim per egg. Theft starts only that slot's cooldown while untouched eggs remain available. Players do **not** steal eggs or dragons from other players. Owned eggs, dragons, inventories, bases, and collections are safe from direct player theft.

The primary stealing interaction is player versus wild guardian NPC. Detailed multiplayer rules remain TODO.

## 27. Monetization Principles

Monetization is outside the current implementation task. Do not make core play mandatory pay-to-win or remove the need to engage with the main loop. Convenience and cosmetic opportunities can be considered later.

Task 05 considers monetization only after the core game is proven fun and exact systems receive explicit approval. No monetization products or prices are locked. Premium currencies, paid items, and speed-ups shown in references are visual filler, not approval. Dragon Food purchased with normal gameplay Coins is approved core progression.

## 28. Saving / Persistence

Long-term persistence is expected eventually for owned dragons, rider upgrades, progression, currency, and selected/equipped dragon. Growth Stage, Growth Progress, and food ownership must be considered in later persistence/data-model planning; their schemas are not defined here. Exact save architecture and data schemas are TODO.

See [Save System](DOCS/TECHNICAL/SAVE_SYSTEM.md) and [Data Model](DOCS/TECHNICAL/DATA_MODEL.md).

## 29. Technical Architecture

The actual game is implemented directly in the connected Roblox Studio place via Roblox Studio MCP. The local workspace holds specifications, references, tasks, balance planning, testing documentation, and asset planning.

No Rojo, Script Sync, Wally, Aftman, Foreman, CI/CD, dependencies, production Luau systems, gameplay objects, or production assets are introduced during Task 00 or this documentation pass. Future per-nest configuration should centralize EggSlotCount (3–5 target), EggSpawnPool, EggRespawnSeconds (300 standard; 600 for the two highest-tier nests), Guardian, and Tier, together with approved growth/food values. Shared egg claims must be server-authoritative; unapproved values stay TBD.

TODO: implementation architecture, module boundaries, data schema, networking, and save design in the relevant later milestone. See [Architecture](DOCS/TECHNICAL/ARCHITECTURE.md) and [Networking](DOCS/TECHNICAL/NETWORKING.md).

## 30. MVP Scope

The first playable vertical slice is Task 01: spawn on foot, learn movement, steal the tutorial egg, escape to the owner's safe zone, secure and hatch the egg into a Baby, receive free Starter Food, feed and grow it into a rideable Young/Juvenile, mount it, introduce basic flight, and complete the tutorial.

The following milestones outline additional planned systems. TODO: final MVP/release feature cutoff; the roadmap is not a finalized release scope.

## 31. Out of Scope

- Task 00: all Roblox Studio changes, gameplay implementation, production assets, dependency installation, and extra tooling.
- All milestones: direct player theft of other players' owned eggs or dragons.
- MVP direction: a combat-heavy RPG or boss-fighting game; guardian HP bars, damage builds, and weapons are not confirmed.
- Tile-by-tile city-building as core gameplay.
- Image-only Fast Travel/teleportation, hard biome locks, level gates, passive income, premium currency, paid speed-ups, or shop products.
- Unapproved final balance numbers, content rosters, guardian abilities, architecture, and monetization products.
- Automatic implementation of future milestones after the current task is complete.

## 32. Milestones

| Task | Objective | Current status |
| --- | --- | --- |
| [00](TASKS/TASK_00_PROJECT_SETUP.md) | Local specification/reference workspace only | COMPLETE — setup acceptance criteria verified |
| [01](TASKS/TASK_01_CORE_TUTORIAL.md) | Fast tutorial through feeding, first growth, first mount, and basic flight | COMPLETE — prototype verified; manual review before Task 02 |
| [02](TASKS/TASK_02_DRAGON_FLIGHT_AND_STATS.md) | Mounting, smooth flight, base stats, rider multipliers, Carry Capacity | NOT STARTED |
| [03](TASKS/TASK_03_WILD_NESTS_AND_GUARDIANS.md) | Multiple nests, progression, spawn pools, refresh, guardians | NOT STARTED |
| [04](TASKS/TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md) | Hatching, growth/feeding, Shop/Food, collection, economy, persistence foundation | NOT STARTED |
| [05](TASKS/TASK_05_CONTENT_POLISH_AND_RELEASE.md) | Content, art/animation/UI polish, mobile, balance, multiplayer, performance | NOT STARTED |

Each task file owns its current status. Stop after the requested milestone; Task 00 does not authorize Task 01.
