# Adventure immersion implementation plan

> For agentic workers: use executing-plans and scoped dispatching-parallel-agents. Steps track this pass; no Git mutation is authorized.

Goal: improve physical/visual comfort and inhabit the existing Dragon adventure.
Architecture: spatial environment collisions, bounded companion garden, existing rig-backed residents and local authored conversations. Root owns Game/UI integration; disjoint workers own scenery collision and rig polish.
Stack: current Vite/TypeScript/Three.js and existing local browser tooling.
Spec: ADVENTURE_IMMERSION_DESIGN.md.

Global constraints: existing checkout, unchanged sources/runtime GLBs, save compatibility, world12000, shield145/100, speeds/economy/chase unchanged, no new dependencies/commit/push/deploy.

Review focus: active egg raid cannot be frozen by dialogue; large collections retain all records and selection; diagonal/fast movement cannot tunnel; distant resident unload cannot leave mixers/cache ownership; failed actor loads retain safe interaction/fallback.

## Task1: environment collision
- [x] Reproduce scenery pass-through and add meaningful tests in tests/environment-collision.test.ts.
- [x] Add src/world/WorldCollision.ts, register actual tree/rock/ridge/nest geometry via Environment/NestLandscape, query via Traversal. Expose altitude-aware obstacle resolution for root Flight integration. Preserve paths/aprons.
- [x] Verify actual fixture movement, free trails, raised flight and repeat world construction/disposal.

## Task2: character/rider polish
- [x] Inspect actual rigs and reproduce contact/seat defects.
- [x] Own CartoonBoy/RideableDragon/RigContact and focused rig helper/tests only. Improve planted feet and anatomical mount fit without original bytes changing; give root integration notes.
- [x] Actual rig/browser pose evidence and relevant tests pass.

## Task3: organized companion garden
- [x] Test deterministic open rows, large-save bounded display and selected berth.
- [x] Root updates MountParking and adds garden scenery/visible selection policy; Game no longer eagerly constructs every saved Dragon. Collection still retains all records and can select any eligible companion.
- [x] Mixed stages/source families remain separately spaced, current mounted Dragon stays alive, reload is deterministic, selection cannot skip an active raid.

## Task4: populated routes and conversations
- [x] Root adds data-driven residents/dialogues and tests route/availability/active-raid boundaries.
- [x] Extend AmbientResidents with nearby lazy rigs, distant release, fallback, unsynchronized routes, stationary talk facing. Add city and regional guide camps; integrate E and accessible existing panel/touch controls in Game/UI.
- [x] Dialogue actions only choose topics/close/set compass; no save/economy reward, teleport or guardian pause during theft.

## Task5: integration and evidence
- [x] Run whole tests/typecheck/build, actual browser gameplay/dialogue/collision/collection/touch/fallback/disposal, protect sources and save identity.
- [x] Independent focused review where available; fix important regressions with reproducing tests.
- [x] Update durable report/handoff with actual outcomes, percentages scoped to this pass and remaining limits.

Completed local pass; evidence and partial independent-review limits in ADVENTURE_IMMERSION_REPORT.md. New user recording requests the subsequent SANCTUARY_COMFORT_PLAN.md.
