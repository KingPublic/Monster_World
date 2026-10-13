# Monster World visual polish implementation plan

> **For agentic workers:** Use superpowers:subagent-driven-development or executing-plans for the scoped existing-code tasks. No Git mutations; user authorization governs approval and work location.

**Goal:** Make the existing playable loop visually cohesive and more comfortable based on the two user recordings.

**Architecture:** Existing Three.js scene and gameplay remain. Share city spatial data between visuals and collision; evolve the rig-backed Dragon visual across growth/Guardian roles; add bounded scene/motion and camera improvements.

**Tech Stack:** Existing Vite, TypeScript, Three.js; installed Blender/Python for non-destructive local derivatives; existing browser tooling.

**Spec:** DOCS/TECHNICAL/VISUAL_POLISH_DESIGN.md and MASTER_GAME_SPEC.md; latest user authorization overrides Phase 2's former Baby/Guardian visual restrictions.

## Global constraints

- SOURCE_ASSETS, REFERENCES and historical Nature GLB immutable; derivatives only in ASSET_WORK/public/assets.
- No staging, commits, push, PR, deployment, new dependencies or downloaded replacement art.
- No theft-state teleport, Guardian distance leash, world/nest-distance compression, economy or save reset.
- Preserve existing speed limits, safe radius 145 and gameplay service semantics.
- Root implements models/Game/Guardians/camera/terrain; city implementer owns Sanctuary, SanctuaryAssets, Traversal, new shared SanctuaryLayout, and only spatial service/sanctuary fields of configuration. Never overwrite another worker's edits.

## Review focus

Growth during in-flight model loading; independent skeleton/texture ownership; camera inside building after reset; stair/footprint disagreement; shared GPU resources during repeated teardown.

### Task 1: Sanctuary composition

- [x] Rebuild connected spacious streets, gardens, market, upper hatchery and open mount court using natural proportions and shared layout.
- [x] Share measured building/service/stair/surface footprints with traversal; keep exported groundHeight/isBlocked signatures.
- [x] Preserve constructor/interface used by Game, status counts used by diagnostics, and selected validated city assets.
- [x] Add suitable verified village/market variety; all source files remain untouched.
- [x] Check walkable routes, loading/fallback, footprints and camera clearance; report exact coordinates/new files and limits.

### Task 2: Dragon family and movement

- [x] Add meaningful failing tests for growth/model continuity, continuous pose changes, asynchronous disposal, and independent instances.
- [x] Upgrade RideableDragon to support Baby, Young and Guardian roles with consistent anatomy/material identity and authored juvenile proportions.
- [x] Replace Guardian normal visuals with real cached downloaded family; preserve AI outcomes.
- [x] Smooth coordinated wing/body/neck/tail/leg motion, saddle, rider and growth reveal; no root-motion physics drift.
- [x] Improve Cartoon Boy gait/stance/interaction transitions and camera obstruction; verify multi-angle motion, feet and anchors.

### Task 3: Surroundings and inhabited detail

- [x] Replace sparse single-cone surroundings with deterministic layered foliage, rocks/grass, regional terrain variation, real trails, atmospheric ridges, sky/clouds and warm lighting.
- [x] Add audited suitable NPC/ambient pieces with scale/animation/resource ownership checked. Avoid adding unverified heavy/broken assets just to increase the count.
- [x] Keep full extent and all nest coordinates; improve nest composition and approaches without changing chase logic.

### Task 4: Whole-game verification and reports

- [x] Typecheck/tests/build; compare matched before/after views and motion sequences at ground and air level.
- [x] Fresh isolated theft→escape→hatch/feed→growth→mount/Boost/land→services→save/reload; physical city routes, actual downloaded Guardians and Baby consistency.
- [x] Failure/teardown/touch/production exposure checks; protected hashes.
- [x] Independent review with findings fixed; document visual improvements, actual additional assets, performance and exact remaining blockers.

