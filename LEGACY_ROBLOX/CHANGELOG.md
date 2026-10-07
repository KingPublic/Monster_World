# Changelog

## 2026-10-07 — Task 01 Starter Nature Young Visual Replacement

- Integrated the user's approved imported `StarterNatureYoung_v1` static mesh only as the first rideable Nature Juvenile. Preserved original import in SBDAssets/Imported and old complete placeholder in ServerStorage/PrototypeBackups.
- Retained the existing JuvenileDragon template name, invisible Root, functional Seat, server controller, growth, remotes, Guardian, Safe Zone, stamina/Boost and camera. Uniform visual scale 12×, corrected forward orientation, fitted transparent Seat; mesh is unanchored/massless/noncollidable.
- Only FlightService's initial rider position changed from a placeholder Root offset to the fitted Seat CFrame. No new gameplay or creature rig/animation system.
- Fresh tutorial reached COMPLETE; all 14 requested integration checks passed, with aligned seated rider, stable welded mesh, flight/Boost/stamina/camera and dismount/remount. Existing 14 validation checks passed; fresh Output had no new major errors.
- Updated asset/reference role and documented static movement/animation limits. [Complete integration report](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md). Task 02 not started; Studio left in Edit mode.

## 2026-10-07 — Task 01 Core Tutorial Vertical Slice

- Implemented only the explicitly authorized first gameplay milestone in the connected Studio experience (PlaceId 138175399498508). Preserved default scene objects; no publishing or later milestone implementation.
- Added scoped sanctuary/Safe Zone/Hatchery and one Starter Wild Nest with Guardian, conceptual slot markers, and one server-claimed onboarding egg. Full 3–5 inventory and live 300/600-second timers remain Task 03.
- Added server tutorial, ownership/hold validation, Guardian state machine/return, quick hatch, free food, Baby → Juvenile growth retaining rarity/element, Seat mounting/dismounting, and bounded smoothed flight/stamina.
- Added desktop WASD/Space/Left Ctrl/held Left Shift/E/F controls, touch joystick/actions/held interaction, camera and dark/gold tutorial HUD. Central temporary tuning and replaceable primitive assets remain prototype-only; no final audio/assets or production DATA balances approved.
- Verified all 24 tutorial steps in fresh play, desktop Boost/release, phone simulator flow, dismount/remount, invalid-action/input rejection, death during chase cleanup, 14 rule checks and compilation of all 11 authored Lua source containers. Final fresh Output had no gameplay errors.
- Fixed ground probes hitting invisible Safe Zone, standing rider pose, unreachable dragon after dismount, compact HUD/control overlap, optional PlayerModule delay and quick Sprint-release throttling.
- Updated milestone status, architecture/session/network records, asset prototype readiness, acceptance/testing records and local ledger. [Complete Studio inventory, step results, limitations and manual review](TESTING/TASK_01_PLAYTEST_REPORT.md). Task 02 not started; real-phone simultaneous controls and multi-client/load testing remain unverified.
- Final audit inspected and indexed the additional local Starter Nature Young 3D reference without changing its filename or treating it as production-approved. All original 19 image hashes/filenames remain unchanged; current inventory is 20 images.

## 2026-10-07 — Documentation and Reference Synchronization

- Registered the V1 reference pack and Art Direction master using exact existing filenames: 18 v1 images plus the retained HUD-v2 image. Expanded the existing Reference Index; inspected all 19 images. No reference was renamed, replaced, or deleted.
- Introduced Dragon Growth as independent from Rarity/Element, feeding-based Growth Points/Progress, Baby → rideable Young/Juvenile → Adult, and stage-adjusted bases × universal rider multipliers.
- Established the physical Food Shop role: normal gameplay Coins primarily buy Dragon Food; unapproved points, thresholds, prices, and scaling remain TBD.
- Revised the fast tutorial to include Baby hunger, sufficient FREE STARTER FOOD, Feed → Growth → first ride → basic flight, without grind, long waits, or premium gates.
- Clarified held Left Shift for Sprint on foot and Dragon Boost while riding, plus dedicated mobile HOLD Boost.
- Incorporated the latest Wild Nest inventory decision: configurable V1 target capacity 3–5 slots; a 300-second standard **per-slot** respawn timer starts only after theft; the TWO highest-tier nests use 600 seconds. This supersedes whole-nest periodic refresh planning. Untouched eggs remain available.
- Documented shared, server-authoritative egg claims to prevent multiple players claiming the same egg; centralized per-nest EggSlotCount/EggSpawnPool/EggRespawnSeconds/Guardian/Tier planning.
- Documented sanctuary/exploration/chase audio direction, core SFX, and dynamic calm/adventure/tension/resolution/reward states. Final audio assets remain pending.
- Updated the asset manifest to separate reference availability, prototype readiness, and final approval, with actual image paths and no invented Roblox IDs.
- Audited reference availability, growth/rideability, controls, carry, chase resolution, inventory, Shop, and audio. Fast Travel, tile-by-tile city-building, guardian boss combat, and image-only monetization remain unapproved.
- Local Markdown documentation only. No Studio/MCP calls, gameplay implementation, Luau scripts, object creation, media generation, dependencies, or synchronization tooling. Tasks 01–05 remain NOT STARTED.

### Files Created or Modified in This Pass

| File | Change | Summary |
| --- | --- | --- |
| [ASSET_MANIFEST.md](ASSET_MANIFEST.md) | Modified | 59 planned entries; real image paths; separate reference/prototype/final statuses. |
| [CHANGELOG.md](CHANGELOG.md) | Modified | Synchronization history, latest respawn decision, and per-file change summary. |
| [DATA/DRAGON_GROWTH_VALUES.md](../DATA/DRAGON_GROWTH_VALUES.md) | Created | Five TBD growth values and sufficient free tutorial grant; configurable future balance. |
| [DATA/DRAGON_STATS.md](../DATA/DRAGON_STATS.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DATA/ECONOMY_BALANCE.md](../DATA/ECONOMY_BALANCE.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DATA/EGG_SPAWN_POOLS.md](../DATA/EGG_SPAWN_POOLS.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DATA/NEST_CONFIGS.md](../DATA/NEST_CONFIGS.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DATA/README.md](../DATA/README.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DATA/RIDER_UPGRADE_VALUES.md](../DATA/RIDER_UPGRADE_VALUES.md) | Modified | Approved configurable nest/carry values, growth-adjusted stats, Coin-food planning and unapproved balance TBD. |
| [DOCS/AI/GUARDIAN_AI.md](../DOCS/AI/GUARDIAN_AI.md) | Modified | Escape objective, guardian reactions/return, slot cooldown separation and actual pose references. |
| [DOCS/DRAGONS/DRAGON_GROWTH.md](../DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md) | Created | Feeding, independent growth stages, rideability, growth transitions and free tutorial food. |
| [DOCS/DRAGONS/DRAGON_SYSTEM.md](DOCS/DRAGONS/DRAGON_SYSTEM.md) | Modified | Independent Rarity/Element/Growth Stage, stage-adjusted bases, universal multipliers and real references. |
| [DOCS/DRAGONS/ELEMENT_SYSTEM.md](../DOCS/CREATURES/DRAGONS/ELEMENT_SYSTEM.md) | Modified | Independent Rarity/Element/Growth Stage, stage-adjusted bases, universal multipliers and real references. |
| [DOCS/DRAGONS/RARITY_SYSTEM.md](../DOCS/CREATURES/DRAGONS/RARITY_SYSTEM.md) | Modified | Independent Rarity/Element/Growth Stage, stage-adjusted bases, universal multipliers and real references. |
| [DOCS/DRAGONS/RIDER_UPGRADES.md](../DOCS/CREATURES/DRAGONS/RIDER_UPGRADES.md) | Modified | Independent Rarity/Element/Growth Stage, stage-adjusted bases, universal multipliers and real references. |
| [DOCS/GAMEPLAY/CORE_LOOP.md](../DOCS/GAMEPLAY/CORE_LOOP.md) | Modified | Current core/tutorial/progression loop, feeding/food and shared per-slot egg rules. |
| [DOCS/GAMEPLAY/EGG_SYSTEM.md](../DOCS/GAMEPLAY/EGG_SYSTEM.md) | Modified | Current core/tutorial/progression loop, feeding/food and shared per-slot egg rules. |
| [DOCS/GAMEPLAY/PROGRESSION.md](../DOCS/GAMEPLAY/PROGRESSION.md) | Modified | Current core/tutorial/progression loop, feeding/food and shared per-slot egg rules. |
| [DOCS/GAMEPLAY/SHOP_AND_FOOD.md](../DOCS/GAMEPLAY/SHOP_AND_FOOD.md) | Created | Physical Coin-bought Food Shop, core/future categories and image-only mechanic limits. |
| [DOCS/GAMEPLAY/TUTORIAL_FLOW.md](../DOCS/GAMEPLAY/TUTORIAL_FLOW.md) | Modified | Current core/tutorial/progression loop, feeding/food and shared per-slot egg rules. |
| [DOCS/TECHNICAL/ARCHITECTURE.md](DOCS/TECHNICAL/ARCHITECTURE.md) | Modified | Approved per-nest fields/server-authoritative egg claims; growth/food planning with architecture details TBD. |
| [DOCS/TECHNICAL/DATA_MODEL.md](DOCS/TECHNICAL/DATA_MODEL.md) | Modified | Approved per-nest fields/server-authoritative egg claims; growth/food planning with architecture details TBD. |
| [DOCS/TECHNICAL/NETWORKING.md](DOCS/TECHNICAL/NETWORKING.md) | Modified | Approved per-nest fields/server-authoritative egg claims; growth/food planning with architecture details TBD. |
| [DOCS/TECHNICAL/SAVE_SYSTEM.md](DOCS/TECHNICAL/SAVE_SYSTEM.md) | Modified | Approved per-nest fields/server-authoritative egg claims; growth/food planning with architecture details TBD. |
| [DOCS/UI_UX/DRAGON_COLLECTION_GUI.md](../DOCS/UI_UX/DRAGON_COLLECTION_GUI.md) | Modified | Actual UI references, confirmed controls, growth/rideability/stat display and image-only limits. |
| [DOCS/UI_UX/HATCHING_GUI.md](../DOCS/UI_UX/HATCHING_GUI.md) | Modified | Actual UI references, confirmed controls, growth/rideability/stat display and image-only limits. |
| [DOCS/UI_UX/HUD_SPEC.md](../DOCS/UI_UX/HUD_SPEC.md) | Modified | Actual UI references, confirmed controls, growth/rideability/stat display and image-only limits. |
| [DOCS/UI_UX/UPGRADE_GUI.md](../DOCS/UI_UX/UPGRADE_GUI.md) | Modified | Actual UI references, confirmed controls, growth/rideability/stat display and image-only limits. |
| [DOCS/WORLD/PLAYER_NEST.md](../DOCS/WORLD/PLAYER_SANCTUARY.md) | Modified | Sanctuary and spatial progression, own-safe-zone chase resolution, per-slot inventory and reference limits. |
| [DOCS/WORLD/SAFE_ZONE.md](../DOCS/WORLD/SAFE_ZONE.md) | Modified | Sanctuary and spatial progression, own-safe-zone chase resolution, per-slot inventory and reference limits. |
| [DOCS/WORLD/WILD_NEST_SYSTEM.md](../DOCS/WORLD/WILD_NEST_SYSTEM.md) | Modified | Sanctuary and spatial progression, own-safe-zone chase resolution, per-slot inventory and reference limits. |
| [DOCS/WORLD/WORLD_STRUCTURE.md](../DOCS/WORLD/WORLD_STRUCTURE.md) | Modified | Sanctuary and spatial progression, own-safe-zone chase resolution, per-slot inventory and reference limits. |
| [MASTER_GAME_SPEC.md](MASTER_GAME_SPEC.md) | Modified | Integrated approved design while preserving the 32 sections; latest 3–5-slot/300–600-second per-slot/server-authority rules. |
| [README.md](README.md) | Modified | Current identity, active references, growth/food, controls, per-slot rules, documentation-only scope. |
| [REFERENCES/ANIMATION/README.md](../REFERENCES/ANIMATION/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/ART_DIRECTION/README.md](../REFERENCES/ART_DIRECTION/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/AUDIO/README.md](../REFERENCES/AUDIO/README.md) | Modified | Sanctuary/exploration/chase moods, SFX, music and dynamic audio states; final assets pending. |
| [REFERENCES/DRAGONS/README.md](../REFERENCES/DRAGONS/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/ENVIRONMENT/README.md](../REFERENCES/ENVIRONMENT/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/GUI/README.md](../REFERENCES/GUI/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/README.md](../REFERENCES/README.md) | Modified | Actual filenames/versions, active visual direction, per-image limits and Reference Index links. |
| [REFERENCES/REFERENCE_INDEX.md](../REFERENCES/REFERENCE_INDEX.md) | Modified | Every actual image's exact path/version/status/use/visual concepts/inference limits. |
| [TASKS/README.md](TASKS/README.md) | Modified | Updated milestone summaries; implementation remains unstarted. |
| [TASKS/TASK_00_PROJECT_SETUP.md](TASKS/TASK_00_PROJECT_SETUP.md) | Modified | Marked the original setup counts/tree as historical; linked current references without reopening Task 00. |
| [TASKS/TASK_01_CORE_TUTORIAL.md](TASKS/TASK_01_CORE_TUTORIAL.md) | Modified | Fast theft, Baby, free food, feeding/growth, first ride and flight brief. |
| [TASKS/TASK_02_DRAGON_FLIGHT_AND_STATS.md](TASKS/TASK_02_DRAGON_FLIGHT_AND_STATS.md) | Modified | Stage-adjusted stats, confirmed held controls, growth/reference reading. |
| [TASKS/TASK_03_WILD_NESTS_AND_GUARDIANS.md](TASKS/TASK_03_WILD_NESTS_AND_GUARDIANS.md) | Modified | Shared per-slot inventory, configurable 300/600 timers, server authority, escape focus. |
| [TASKS/TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md](TASKS/TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md) | Modified | Feeding/growth, physical Food Shop, independent identity and balance TBD. |
| [TASKS/TASK_05_CONTENT_POLISH_AND_RELEASE.md](TASKS/TASK_05_CONTENT_POLISH_AND_RELEASE.md) | Modified | Actual references, Baby/growth animation needs, dynamic audio/polish direction. |
| [TESTING/ACCEPTANCE_CRITERIA.md](TESTING/ACCEPTANCE_CRITERIA.md) | Modified | Added growth/feeding, Food Shop, shared-slot TODO areas without fabricated gameplay tests. |

All 19 image files, the original setup prompt, AGENTS.md, .gitignore, and other unchanged records are preserved. Existing REFERENCE_INDEX.md was expanded, not newly created. Historic setup values are retained only as clearly labeled history; current approved specifications govern future work.

## 2026-10-07 — Task 00 workspace setup

- Added the local specification, reference, milestone, balance, testing, prompt, and archive structure requested by the setup prompt.
- Recorded confirmed design rules separately from provisional targets, examples, and TODO decisions.
- Preserved the original setup prompt.
- Added a conservative `.gitignore`; no extra tooling was initialized.
- Roblox Studio was not accessed or modified. No game systems or production assets were created.

See [Task 00](TASKS/TASK_00_PROJECT_SETUP.md) for verified completion status and the setup report. Future milestones remain NOT STARTED.
