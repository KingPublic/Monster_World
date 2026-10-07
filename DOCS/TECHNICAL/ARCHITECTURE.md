# Web Architecture

The active runtime is TypeScript + plain Three.js + Vite, with HTML/CSS overlays and browser-local persistence. [Game](../../src/core/Game.ts) coordinates the single-player scene and owns startup, pause/panels, interactions, tutorial transitions and teardown.

| Responsibility | Implementation |
| --- | --- |
| Renderer, capped pixel ratio, resize / visibility-aware loop | [Renderer](../../src/core/Renderer.ts), [GameLoop](../../src/core/GameLoop.ts) |
| Keyboard/touch edges and holds, follow camera | [InputSystem](../../src/systems/InputSystem.ts), [FollowCamera](../../src/systems/FollowCamera.ts) |
| Foot movement / arcade mounted flight | [PlayerController](../../src/gameplay/PlayerController.ts), [Flight](../../src/gameplay/Flight.ts) |
| Terrain floor and simple building footprints | [Traversal](../../src/world/Traversal.ts) |
| Large world / layered Sanctuary | [World](../../src/world/World.ts), [Sanctuary](../../src/world/Sanctuary.ts), [Environment](../../src/world/Environment.ts) |
| Animated Nature family / rarity Eggs | [ProceduralDragon](../../src/creatures/ProceduralDragon.ts), [EggModel](../../src/creatures/EggModel.ts) |
| Pure inventory, independent slot timers, growth/economy | [Progression](../../src/gameplay/Progression.ts) |
| Pursuit and return / limited particles | [Guardian](../../src/gameplay/Guardian.ts), [Effects](../../src/gameplay/Effects.ts) |
| Versioned validated local storage | [SaveSystem](../../src/systems/SaveSystem.ts) |
| HUD, welcome, shop, collection, upgrades | [UIManager](../../src/ui/UIManager.ts) |
| Provisional runtime balance / world coordinates | [mvpConfig](../../src/config/mvpConfig.ts), [gameConfig](../../src/config/gameConfig.ts) |

Dragon roots own world transforms; component animation stays local. Mount anchors explicitly parent the rider. Game evaluates Safe Zone delivery before Guardian capture. Pursuit has no distance leash. Each stolen slot owns its cooldown.

Normal gameplay uses the follow camera. Task 00's OrbitControls camera and GLB loader remain optional inspection utilities, with no core runtime dependency. The static GLB is preserved unchanged.

Repeated vegetation uses instancing; Dragon static pieces are batched within each instance. Pixel ratio, particle counts and shadow casters are limited. Collision, camera obstruction and Guardian steering are deliberately simple. Geometry/materials, listeners, controls, rider/model resources and render loops are disposed on teardown/HMR.

Development tools require both `import.meta.env.DEV` and `?debug=1`; no production debug API/UI or accelerated balancing. See [controls](INPUT_AND_CONTROLS.md), [save format](SAVE_SYSTEM.md), [asset pipeline](ASSET_PIPELINE.md) and [build report](../../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md). No backend or multiplayer.
