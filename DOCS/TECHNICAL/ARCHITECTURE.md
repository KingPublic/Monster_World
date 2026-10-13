# Web Architecture

The active runtime is TypeScript + plain Three.js + Vite, with HTML/CSS overlays and browser-local persistence. [Game](../../src/core/Game.ts) coordinates the single-player scene and owns startup, pause/panels, interactions, tutorial transitions and teardown.

| Responsibility | Implementation |
| --- | --- |
| Renderer, capped pixel ratio, resize / visibility-aware loop | [Renderer](../../src/core/Renderer.ts), [GameLoop](../../src/core/GameLoop.ts) |
| Keyboard/touch edges and holds, follow camera | [InputSystem](../../src/systems/InputSystem.ts), [FollowCamera](../../src/systems/FollowCamera.ts) |
| Foot movement / arcade mounted flight | [PlayerController](../../src/gameplay/PlayerController.ts), [Flight](../../src/gameplay/Flight.ts) |
| Terrain floor, shared measured city footprints / camera clearance | [Traversal](../../src/world/Traversal.ts), [SanctuaryLayout](../../src/world/SanctuaryLayout.ts), [CameraClearance](../../src/systems/CameraClearance.ts) |
| Large valley, garden-city, trails / nests / atmosphere | [World](../../src/world/World.ts), [Sanctuary](../../src/world/Sanctuary.ts), [Environment](../../src/world/Environment.ts), Landscape, NestLandscape, Atmosphere |
| Player / Baby / Young / Guardian rig visuals | [CartoonBoy](../../src/creatures/CartoonBoy.ts), [RideableDragon](../../src/creatures/RideableDragon.ts), [MountainMotion](../../src/creatures/MountainMotion.ts), RigPose, RigIK, RigContact, RigBounds |
| Skeleton-safe asset cache / city imports | [RuntimeAssets](../../src/systems/RuntimeAssets.ts), [SanctuaryAssets](../../src/world/SanctuaryAssets.ts) |
| Loading/failure Dragon fallback / rarity Eggs | [ProceduralDragon](../../src/creatures/ProceduralDragon.ts), [EggModel](../../src/creatures/EggModel.ts) |
| Ambient residents; no new services or mounts | [AmbientResidents](../../src/world/AmbientResidents.ts) |
| Pure inventory, independent slot timers, growth/economy | [Progression](../../src/gameplay/Progression.ts) |
| Pursuit and return / limited particles | [Guardian](../../src/gameplay/Guardian.ts), [Effects](../../src/gameplay/Effects.ts) |
| Versioned validated local storage | [SaveSystem](../../src/systems/SaveSystem.ts) |
| HUD, welcome, shop, collection, upgrades | [UIManager](../../src/ui/UIManager.ts) |
| Provisional runtime balance / world coordinates | [mvpConfig](../../src/config/mvpConfig.ts), [gameConfig](../../src/config/gameConfig.ts) |

PlayerController and Dragon physics roots own world transforms; imported rig poses stay local. RuntimeAssets owns shared geometry/material/texture templates; skeleton-safe instances own independent bones and release only their own skeletons. Game releases instances before cache templates. Roads wait for all texture results for cleanup. CarriedEggs keeps Egg 1 with the rider and maps Eggs 2/3 from independent talon world transforms. Dragon roots own world transforms; component animation stays local. Mount anchors explicitly parent the rider. Game evaluates Safe Zone delivery before Guardian capture. Pursuit has no distance leash. Each stolen slot owns its cooldown.

Normal gameplay uses the follow camera. Task 00's OrbitControls camera and GLB loader remain optional inspection utilities, with no core runtime dependency. The static GLB is preserved unchanged.

Repeated valley vegetation and stationary city details use instancing; replaceable city model groups stay separate. RigBounds transforms cached per-bone bind-space envelopes each frame to cover interpolated skin/juvenile poses without enumerating20k vertices every frame; offscreen Guardians can be culled in normal and shadow passes. RigContact samples both skinned soles below the physics root. Same-instance Baby→Young preserves anchors and identity. Montage windows sample sparse endpoints/close loops from the intact source take; runtime offsets preserve physics/facing. Pixel ratio and effects are bounded. Collision, camera obstruction and Guardian steering remain simple. Geometry/materials, instance buffers, PMREM target, listeners, controls, rider/model resources and loops are released on teardown/HMR. See [current verification and limits](VISUAL_POLISH_REPORT.md).

Development tools require both `import.meta.env.DEV` and `?debug=1`; no production debug API/UI or accelerated balancing. See [controls](INPUT_AND_CONTROLS.md), [save format](SAVE_SYSTEM.md), [asset pipeline](ASSET_PIPELINE.md) and [build report](../../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md). No backend or multiplayer.
