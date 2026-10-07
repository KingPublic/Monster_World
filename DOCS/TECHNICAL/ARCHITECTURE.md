# Web Architecture

Browser → Game Loop → Three.js Scene → future Gameplay Systems → HTML/CSS UI.

The active runtime is plain Three.js with TypeScript and Vite. V1 is single player. [Game.ts](../../src/core/Game.ts) composes the renderer, scene, world, camera and UI. [Renderer.ts](../../src/core/Renderer.ts) owns WebGL, capped pixel ratio and resize. [GameLoop.ts](../../src/core/GameLoop.ts) owns animation frames and visibility pausing. [CameraSystem.ts](../../src/systems/CameraSystem.ts) owns OrbitControls and inspection presets, not player controls.

[World.ts](../../src/world/World.ts) combines continuous surrounding terrain, the layered Sanctuary and non-functional nest markers. [Sanctuary.ts](../../src/world/Sanctuary.ts) is city composition; [Environment.ts](../../src/world/Environment.ts) is procedural terrain/vegetation. [AssetSystem.ts](../../src/systems/AssetSystem.ts) loads and inspects the static GLB, with a safe visual fallback. [UIManager.ts](../../src/ui/UIManager.ts) provides HTML inspection controls, labels and asset status. Configurable positions and rendering values live in [gameConfig.ts](../../src/config/gameConfig.ts); runtime paths live in [assetManifest.ts](../../src/config/assetManifest.ts).

No empty gameplay architecture stubs are added. Future Creature/Dragon, Player/Egg/WildNest/Tutorial, movement/collision/input/audio/save modules should be introduced when a task needs them. Only Dragons are authorized. Scene geometry/materials/textures, controls, event listeners and render loops are disposed during HMR/teardown. Asset completion after disposal must not restore an obsolete scene.

Three.js uses a perspective camera, ambient hemisphere/directional light, fog, responsive canvas and capped devicePixelRatio. Modern desktop/mobile WebGL 2 browsers are the target; performance budgets and older devices require later profiling. World scale and distant nest return routes are gameplay requirements, even before gameplay exists.

No backend, account, multiplayer or persistence is implemented. Former Studio architecture and reports are in [LEGACY_ROBLOX](../../LEGACY_ROBLOX/README.md). See [asset pipeline](ASSET_PIPELINE.md), [controls](INPUT_AND_CONTROLS.md), [save direction](SAVE_SYSTEM.md) and [deployment](DEPLOYMENT.md).
