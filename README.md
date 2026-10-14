# Monster World

A playable single-player Dragon adventure built with TypeScript, plain Three.js and Vite. Current October13–14 polish uses Cartoon Boy, an enlarged Village/Market Sanctuary and Stone Pathway streets, Mountain/Ashscale Dragon silhouettes across matching Baby/Young/Guardians, a rideable Horse, Travelers/guides/conversations and a few original forest roamers. Eggs remain procedural; source-based juvenile proportions/motion are authored at runtime. The historical Nature GLB is preserved and never requested by gameplay.

The MVP includes eight existing Wild Nests, per-slot Eggs, theft/Guardian pursuit, shielded220-radius delivery, hatching/feeding/Baby→Young growth, an organized companion garden, Horse riding/Dragon flight, independent foot/Horse sprint and Dragon Boost stamina, Coins/Food/Collection/upgrades and local saves. The bespoke moving menu uses generated panorama/transparent Dragon artwork without a3Dpreview model. Adult stages/combat and final element mechanics remain future content.

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

Phase 2: [validation](DOCS/TECHNICAL/ASSET_VALIDATION_REPORT.md), [runtime plan](DOCS/TECHNICAL/ASSET_RUNTIME_PLAN.md), [integration](DOCS/TECHNICAL/ASSET_INTEGRATION_REPORT.md). With the dev server running, open `/asset-lab.html` for isolated source/derived inspection. The production build contains only the game. Tooling: [asset pipeline commands](tools/asset-pipeline/README.md).

Latest: [Sanctuary comfort report](DOCS/TECHNICAL/SANCTUARY_COMFORT_REPORT.md), [checkpoint](DOCS/TECHNICAL/SANCTUARY_COMFORT_HANDOFF.md) and [short continuation prompt](PROMPTS/MONSTER_WORLD_CONTINUE_LATEST.md). Current9/19audited groups are used; blocked groups retain concrete qualification steps. Local polish does not certify final art/physical devices/external usage clearance. Prior reports retain their historical evidence.

October14 addendum: [livelier population/HUD/mouth polish](DOCS/TECHNICAL/LIVING_WORLD_POLISH_REPORT.md),73people definitions with20nearby rigs, additional city/trail walking/conversations, more transparent HUD and a localized resting-mouth correction.
