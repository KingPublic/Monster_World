# Monster World — Master Game Specification

Monster World is a browser-based 3D fantasy creature adventure, currently focused on Dragons. This specification governs approved design. Confirmed rules, configurable V1 values, targets, candidate examples and TBD decisions remain distinct. Task 00 migration is complete. The 2026-10-08 Autonomous Dragon MVP authorization implements the vertical slice, procedural models/animation, flight, four nests, economy, local save and basic touch support. Prototype balancing is centralized and remains subject to playtesting. Historical prototype results live in [LEGACY_ROBLOX](LEGACY_ROBLOX/README.md).

## 1. Game Vision

### Long-term Vision
Monster World may eventually support multiple fantasy creature families through a practical Creature → Dragon architecture. Future expansion requires explicit authorization.

### Current Implementation Scope
Dragons only. The initial single-player web adventure preserves the Dragon Sanctuary, egg theft, Guardian escape, hatching, feeding, growth, riding and farther exploration fantasy.

> Dragons are the first implemented creature family and the sole gameplay/content focus of the initial web vertical slice. Architecture may support future creature families, but no other monster family should be implemented until explicitly authorized.

Task 00 established the technical world. The authorized MVP now implements the Dragon gameplay loop; no other creature family is implemented.

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

See [Core Loop](DOCS/GAMEPLAY/CORE_LOOP.md), [Dragon Growth](DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md), and [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md).

## 4. Player Character

Players begin the tutorial on foot and later ride their first Young/Juvenile dragon after feeding the hatched Baby. Permanent upgrades belong to the player/rider and apply universally to every dragon they ride.

On desktop, hold **Left Shift** to Sprint on foot and to Boost while riding. See section 11. MVP controls: WASD movement, mouse drag follow camera, E/context interaction, Space jump/ascend, Left Ctrl descend and F landed dismount. Foot speeds are provisionally 30 walk / 50 sprint.

## 5. Dragon Mounts

Dragons hatch as **Baby Dragons**, which live in the sanctuary and cannot serve as normal full mounts yet. **Young/Juvenile** dragons are rideable and introduce flight. **Adult** dragons are rideable and receive the intended mature/base-stat profile for their species. Stage-dependent numerical scaling remains TBD.

### Independent Identity Dimensions

A dragon has three independent dimensions: **Rarity + Element + Growth Stage**. For example, Mythic + Storm + Baby = Mythic Storm Baby Dragon. Growth changes neither rarity nor element:

```text
Mythic Storm Egg → Mythic Storm Baby → Mythic Storm Juvenile → Mythic Storm Adult
```

V1 stage direction is Egg → Baby → Juvenile / Young → Adult; exact stage naming can be standardized later. Feeding grants Growth Points, fills Growth Progress, and triggers the next stage at its threshold. The transition updates the model, animation/VFX, and applicable stage-dependent stats.

Dragons have their own base movement stats and may have different movement profiles. Smooth movement and animation are priorities. Desired movement includes takeoff, normal flight, gliding, turning/banking, ascending, descending, landing, and boosting. These movements are implemented procedurally for the MVP Young form; final animation polish remains future work.

See [Dragon System](DOCS/CREATURES/DRAGONS/DRAGON_SYSTEM.md), [Dragon Growth](DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md), and [Growth Values](DATA/DRAGON_GROWTH_VALUES.md).

## 6. Dragon Rarity

Rarity, element, and growth stage are independent properties. Growing a dragon does not change rarity or element. Candidate rarity categories include Common, Uncommon, Rare, Epic, Legendary, Mythic, and potentially special/secret tiers later. The roster and distributions are not final.

“Mythic Fire Dragon,” “Mythic Ice Dragon,” and “Mythic Storm Baby Dragon” illustrate independent identity properties; they do not establish final content or a mandatory rarity/element pairing.

See [Rarity System](DOCS/CREATURES/DRAGONS/RARITY_SYSTEM.md).

## 7. Dragon Elements

Candidate elements include Nature, Fire, Ice, Storm, Earth, Shadow, and Light / Celestial. The final roster is not locked. Element is independent of rarity and growth stage, and stays unchanged during growth.

Elements primarily influence movement identity, visual identity, and potentially specialized stats. The MVP should not become a combat-heavy RPG. Do not turn element labels in a reference into fixed rarity tiers or approved combat abilities.

See [Element System](DOCS/CREATURES/DRAGONS/ELEMENT_SYSTEM.md).

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

See [Rider Upgrades](DOCS/CREATURES/DRAGONS/RIDER_UPGRADES.md) and [Upgrade Values](DATA/RIDER_UPGRADE_VALUES.md).

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

Boost is **hold-to-use**, without repeated tapping. Holding Boost increases flight speed and consumes stamina substantially faster. Releasing it smoothly returns toward normal flight speed. MVP Boost drains 28 Stamina/s; regeneration is 18/s after a short delay. Normal flight is currently free; tuning is provisional.

### Confirmed Desktop Input

| Player state | Input | Action |
| --- | --- | --- |
| On foot | Hold Left Shift | Sprint |
| Riding a dragon | Hold Left Shift | Dragon Boost |

Boost is active only while held. Do not require frequent repeated Shift presses.

### Confirmed Mobile Input

Use a dedicated **HOLD Boost** button. [Mobile-HUD-v1.png](REFERENCES/GUI/Mobile-HUD-v1.png) guides general placement and visual direction; exact sizing is implementation-dependent. Basic touch joystick, camera swipe, Interact, Up/Jump, Down, held Sprint/Boost and Dismount are implemented; physical-device certification remains pending.

MVP flight values are centralized in [mvpConfig](src/config/mvpConfig.ts); exhaustion requires releasing Boost before reuse. Final drain/balance tuning remains open. [HUD-v2.png](REFERENCES/GUI/HUD-v2.png) and [Flight-hud-v1.png](REFERENCES/GUI/Flight-hud-v1.png) provide presentation references. A Q shortcut or separate numerical Boost meter in another image is not an approved input or resource mechanic.

## 12. Wild Dragon Nests

The world has multiple wild nests. Later nests generally become farther away, may gradually become higher, and can have more dangerous or visually distinct environments and better egg pools. Nests should not form a perfectly vertical tower.

World scale is gameplay, not just scenery. Starter nests are nearby; mid-tier nests are clearly farther; high-tier nests are substantially farther; highest-tier regions involve the longest journeys. Do not cluster every nest within seconds, reveal every nest from the plaza, or compress the world for convenience. Exact distances and travel times require future playtesting. Recognizable approach/escape routes, landmarks, obstacles, safer paths and risky shortcuts support route mastery. General elevation and terrain difficulty increase naturally without a perfect vertical tower.

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

Both values are approved **configurable V1 balancing values**, adjustable after playtesting. Centralize configuration per nest: `EggSlotCount`, `EggSpawnPool`, `EggRespawnSeconds`, `Guardian`, and `Tier`. Do not duplicate hardcoded timers across systems. The current provisional assignment is Forest 3 slots/300s, Highland 4/300s, Volcanic 5/600s, Frost 5/600s. All pools use Nature, with Common through Epic progression. Final tuning remains open.

### Single-player Inventory Direction

V1 runs in one browser session. Only the stolen slot empties and enters cooldown; untouched eggs remain available. Future multiplayer concurrency and synchronization are separate scope. Task 00's markers are now functional Wild Nests with independent Eggs and timers; their original coordinates are preserved.

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

While carrying stolen Eggs, no direct teleport home, instant Sanctuary warp, skipped physical return or travel mechanic may cancel the Guardian Chase. Future convenience travel outside active theft is optional later scope.

MVP capture loses carried stolen Eggs and resets the player safely to Sanctuary; owned Dragons and Coins remain. Reload abandons active carried loot and resets in-session slots/Guardians; secured loot persists. No death/combat system.

## 16. Dragon Sanctuary / Fantasy City

The single player has an established Sanctuary, serving as home, safe zone, hatch area, dragon collection area, mount selection area, and progression hub. Owned dragons can visibly live here, including small Baby Dragons awaiting feeding.

### Sanctuary / Village Direction

The Sanctuary should visually feel like a compact **fantasy Dragon City / Dragon Sanctuary / Dragon Village** with coherent streets, plazas, layered architecture, terraces, stairs/ramps, bridges, vegetation, water features, banners, Dragon statues and a strong central landmark. The arrival area, Hatchery, habitats, Collection Hall, Mount court, Rider Upgrade hall and Food Shop are physical districts. It should feel safe, warm, magical and lived-in. It may contain physical Hatchery, Dragon Collection, Mount selection, Rider Upgrade, and Shop areas, decorative habitats, and spaces for owned dragons. A social/progression hub feeling and dragon-city collection fantasy are approved visual direction.

The game is **not a city-builder**. Players are not required to construct buildings tile-by-tile as the core loop. The primary loop remains stealing from guarded wild nests and physically escaping home, followed by Hatch → Feed → Grow → Ride → Upgrade.

The physical Shop primarily sells Dragon Food for normal gameplay Coins. Hatchery, Food Shop, Collection, Rider upgrades and Mount court are functional; final city polish and broader service content remain future work. Teleport/Fast Travel shown in [Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) is visual/conceptual only and is not an approved service.

See [Player Nest](DOCS/WORLD/PLAYER_SANCTUARY.md) and [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md).

## 17. Safe Zone

The player returns to their own safe zone to secure stolen items. The pursuing guardian stops and returns to its original wild nest after successful arrival.

MVP Safe Zone is a glowing 145-unit Sanctuary perimeter with altitude below 100. Delivery is evaluated before Guardian capture. See [Safe Zone](DOCS/WORLD/SAFE_ZONE.md).

## 18. Hatching

Secured stolen eggs are placed/hatched at the player's sanctuary Hatchery. Dragons hatch as **Babies**, which are not normal full mounts. The tutorial hatches quickly, then grants enough **FREE STARTER FOOD** to grow the first Baby into a rideable Young/Juvenile dragon quickly. Hatching alone does not make it rideable.

Later hatch timings remain TBD. Hatching should include satisfying egg movement, cracking, elemental VFX, reveal, and Baby emergence rather than an instant asset swap. [Hatchery-v1.png](REFERENCES/GUI/Hatchery-v1.png) guides egg presentation, progress presentation, atmosphere, and reveal; its multi-hour timers, paid speed-ups, premium currency, and incubator counts are not approved rules.

See [Hatching GUI](DOCS/UI_UX/HATCHING_GUI.md) and [Dragon Growth](DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md).

## 19. Dragon Collection

Hatched dragons belong to the player and should be meaningful, visible collectibles. Players eventually inspect, compare, select, and ride/equip eligible dragons.

Collection presentation should support dragon name, Rarity, Element, Growth Stage, Base Stats, rider-modified Final Stats, rideability, and equipped/current mount state. Growth Progress can appear where appropriate. Growing a dragon preserves its rarity and element.

See [Dragon Collection GUI](DOCS/UI_UX/DRAGON_COLLECTION_GUI.md). Passive income amounts or extra tiers in the concept image are not approved economy or roster decisions.

## 20. Economy

**Coins** are approved normal gameplay currency for primarily purchasing Dragon Food from the physical Player Nest Shop. Food grants Growth Points and supports Baby → Young/Juvenile → Adult growth, giving players reasons to earn Coins, return home, and care for collected dragons.

Shop categories are Dragon Food (core progression), Utility (future optional support; exact items unresolved), and Cosmetics (future customization; not required for current MVP gameplay). Candidate food types include Starter Food, Basic Food, Better Food, and element-themed treats; exact items and values remain TBD. Tutorial Starter Food is free and sufficient for the first rideable stage.

MVP provisional values: delivery 50 Coins/Egg, tutorial reward 75, Basic Food 20 Coins/+50 Growth, Young threshold 100. Rider values are centralized in mvpConfig. Only Coins are implemented. No passive-income system, temporary boosts, paid timers, or premium products are approved by image filler.

See [Shop and Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md), [Growth Values](DATA/DRAGON_GROWTH_VALUES.md), and [Economy Balance](DATA/ECONOMY_BALANCE.md).

## 21. Tutorial

Keep onboarding fast: approximately the opening **1–3 minutes / few minutes**, subject to playtesting. Spawn on foot → learn movement → travel to nearby Starter Wild Nest → see Guardian protecting eggs → steal tutorial egg → theft detected → Guardian alerts/roars and pursues → return to own Sanctuary/Safe Zone → egg secured → Guardian stops and returns home → place/hatch egg → Baby appears → explain hunger → grant FREE STARTER FOOD → feed Baby → Growth Progress fills → Baby grows into rideable Young/Juvenile → mount → basic flight introduction → tutorial complete.

The first dragon requires no grinding, long waiting, or premium gates. The free starter grant must be sufficient to reach the first rideable stage; the MVP grants 2 Food, each worth 50 Growth, to reach Young at 100.

The first web vertical slice is implemented under [Task 01](TASKS/TASK_01_DRAGON_VERTICAL_SLICE.md) and the autonomous MVP authorization. The historical prototype provides design lessons, not an existing web implementation. The current starter is Common Nature. Desktop/touch controls and tutorial completion through landed dismount are implemented; final onboarding tuning remains open.

Core Nature Baby, Young and Guardian visuals use procedural Three.js groups and component animation. The external static GLB is preserved as an optional debug/reference asset and is never needed by gameplay. Adult content remains deferred.

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

**Stylized Premium Fantasy / Premium Toy-Fantasy** is the desired direction. Aim for polished, attractive, smooth, collectible dragons with readable silhouettes, slightly stylized forms, controlled color, and a premium fantasy feel. Baby dragons can be small and cute; Young/Juvenile and Adult mounts should be impressive; guardians should be larger and more intimidating. Sanctuary architecture may evoke Dragon Village collection games without introducing tile-by-tile building.

Avoid hyper-realism, an exclusively extremely childish/chibi presentation, inconsistent asset packs, and a generic low-quality AI-generated appearance.

Concept/reference images are visual targets, not automatically production-final assets. Core Dragons use procedural geometry and component animation; final art can iterate without requiring external rigging or a GLB. All prototypes must remain replaceable.

[Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) is the active global visual reference: warm sanctuary spaces, distinct elemental zones, readable growth/guardian silhouettes, and dark panels with fantasy trim. Image-only Strength/Luck stats, selling, products, and numbers are not approved mechanics.

See [Art Direction References](REFERENCES/ART_DIRECTION/README.md), [Reference Index](REFERENCES/REFERENCE_INDEX.md), and [Asset Manifest](ASSET_MANIFEST.md).

## 26. Single-player and Future Networking

The initial browser version is single player, with no multiplayer synchronization requirement. No network framework, WebSockets, backend or user accounts are introduced. Future multiplayer is separate scope. Owned collections remain safe; direct theft from other players is not a design goal. See [Networking](DOCS/TECHNICAL/NETWORKING.md).

## 27. Monetization Principles

Monetization is outside the current implementation task. Do not make core play mandatory pay-to-win or remove the need to engage with the main loop. Convenience and cosmetic opportunities can be considered later.

Task 05 considers monetization only after the core game is proven fun and exact systems receive explicit approval. No monetization products or prices are locked. Premium currencies, paid items, and speed-ups shown in references are visual filler, not approval. Dragon Food purchased with normal gameplay Coins is approved core progression.

## 28. Saving / Persistence

Long-term persistence is expected eventually for owned dragons, rider upgrades, progression, currency, and selected/equipped dragon. Growth Stage, Growth Progress, and food ownership must be considered in later persistence/data-model planning; their schemas are not defined here. Exact save architecture and data schemas are TODO.

See [Save System](DOCS/TECHNICAL/SAVE_SYSTEM.md) and [Data Model](DOCS/TECHNICAL/DATA_MODEL.md).

## 29. Technical Architecture

The active runtime is Vite + TypeScript + plain Three.js, WebGL canvas and HTML/CSS overlays. Game coordinates PlayerController, FollowCamera/InputSystem, Flight, Guardians, procedural Dragon/Egg models, pure Progression, Effects and SaveSystem. Normal gameplay never uses OrbitControls or the external GLB. Resource/listener cleanup supports HMR and mounted teardown.

Configurable prototype balancing lives in [mvpConfig.ts](src/config/mvpConfig.ts), with original world extent/positions in gameConfig.ts. Four nests retain 3/4/5/5 slots and production respawn 300/300/600/600 seconds. Dev-only respawn acceleration and travel helpers require DEV plus ?debug=1; stolen loot forbids debug travel. Saved owned identity/growth/equipment, tutorial, Coins, Food and Rider upgrades use validated localStorage version1. Active loot/cooldowns do not persist across reload.

Core Dragon animation uses local transforms for breathing, head/tail, cyclic legs, wings, alert/roar, flight/bank/ascent/descent/Boost and landing. No external rig or clips are implied. Static GitHub/Vercel deployment remains documented, with no deployment performed. See [Architecture](DOCS/TECHNICAL/ARCHITECTURE.md) and [MVP report](TASK_MVP_AUTONOMOUS_BUILD_REPORT.md).

## 30. MVP Scope

The first playable vertical slice is Task 01: spawn on foot, learn movement, steal the tutorial egg, escape to the owner's safe zone, secure and hatch the egg into a Baby, receive free Starter Food, feed and grow it into a rideable Young/Juvenile, mount it, introduce basic flight, and complete the tutorial.

The following milestones outline additional planned systems. TODO: final MVP/release feature cutoff; the roadmap is not a finalized release scope.

## 31. Out of Scope

Multiplayer, trading, breeding, other creature families, backend/accounts/cloud save, weapons/Guardian HP/boss combat, premium currency/monetization and city building are excluded. No fast travel while carrying stolen Eggs. Adult forms, additional elements, final art/audio, advanced IK/collision/camera obstruction and release/device certification remain future work. Current numeric tuning is provisional, not final balance.

## 32. Web Milestones

| Task | Current result |
| --- | --- |
| [00](TASKS/TASK_00_WEB_MIGRATION_AND_WORLD_FOUNDATION.md) | COMPLETE — migration foundation preserved |
| [01](TASKS/TASK_01_DRAGON_VERTICAL_SLICE.md) | MVP IMPLEMENTED — complete tutorial loop |
| [02](TASKS/TASK_02_DRAGON_FLIGHT_AND_ANIMATION.md) | MVP IMPLEMENTED — procedural family/animation, arcade flight |
| [03](TASKS/TASK_03_WILD_NESTS_AND_GUARDIANS.md) | MVP IMPLEMENTED — four distant nests, slot cooldowns and Guardians |
| [04](TASKS/TASK_04_GROWTH_COLLECTION_ECONOMY.md) | MVP IMPLEMENTED — Baby→Young, shop/collection/save/upgrades; Adult deferred |
| [05](TASKS/TASK_05_WORLD_CONTENT_AND_RELEASE.md) | MVP POLISH IMPLEMENTED — touch/VFX; final art, balance/device certification/release deferred |

This autonomous run stops after final MVP verification/report. Version control and release remain the user's responsibility.
