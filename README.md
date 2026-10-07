# Monster World

A playable single-player Dragon adventure built with TypeScript, plain Three.js and Vite. Core Dragons and Eggs are procedural; the preserved external Nature GLB is optional historical showcase content and is never requested by gameplay.

The current MVP includes a walkable Sanctuary, four distant Wild Nests, per-slot Eggs, theft and Guardian pursuit, Safe Zone delivery, hatching, feeding, Baby → Young growth, mounting, arcade flight, held Boost, Coins, Food Shop, Collection, Rider upgrades and device-local saves. Only Nature Dragons are currently implemented. Adult stages and other elements remain future content.

## Run locally

Use Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, choose **Begin adventure**, and follow the objective and destination compass. Progress saves automatically in this browser. The world remains large: the first raid is on foot; distant raids are intended for a grown, rideable Dragon.

## Controls

| Action | Desktop |
| --- | --- |
| Move / fly | WASD |
| Rotate follow camera | Drag the mouse on the world |
| Sprint / hold Boost | Left Shift |
| Interact | E; hold E to steal an Egg |
| Jump / ascend | Space |
| Descend / land | Left Ctrl |
| Dismount after landing | F |
| Close a panel | Escape |

Touch devices have a movement joystick, camera swipe, Interact, Jump/Ascend, Descend, held Sprint/Boost and Dismount buttons. Desktop is the priority; mobile is a basic emulated-device pass.

## Development and validation

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Development-only tools: open the dev server with `?debug=1`. Teleport to services/Nests, grant Coins/Food, accelerate slot cooldowns, or reset the local save. Teleport refuses carried Eggs and mounted travel. Respawn acceleration does not change production 300/600-second values. Debug UI/API is absent from production builds.

## Project map

- [MVP build report](TASK_MVP_AUTONOMOUS_BUILD_REPORT.md): verified behavior, current limitations and Git status.
- [Master spec](MASTER_GAME_SPEC.md) and [Tasks](TASKS/README.md): approved direction and current milestone status.
- [Architecture](DOCS/TECHNICAL/ARCHITECTURE.md), [controls](DOCS/TECHNICAL/INPUT_AND_CONTROLS.md) and [save format](DOCS/TECHNICAL/SAVE_SYSTEM.md).
- [Runtime balance](src/config/mvpConfig.ts) and [DATA](DATA/README.md): provisional MVP tuning and future balance planning.
- [References](REFERENCES/REFERENCE_INDEX.md) and [asset manifest](ASSET_MANIFEST.md): preserved visual guidance and actual runtime assets.
- [Deployment setup](DOCS/TECHNICAL/DEPLOYMENT.md): static Vite output for GitHub → Vercel.
- [Task 00 report](TESTING/TASK_00_WEB_MIGRATION_REPORT.md) and [Legacy Roblox](LEGACY_ROBLOX/README.md): historical migration/prototype records.

No backend, account, multiplayer, combat, monetization or cloud save. No commit, push or deployment is performed by this build.
