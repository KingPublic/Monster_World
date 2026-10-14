# Content variety and behavior implementation plan

> Apply systematic debugging/TDD and scoped subagent-driven work. Dispatch independent owned file domains under dispatching-parallel-agents; root owns integration/review. No Git writes.

**Goal:** address every concrete issue in the October13 recording with playable verified contents.
**Architecture:** existing Game/Progression/Save/Flight remain; explicit Dragon variant factory, one grounded Horse visual/controller and shared nest configs/shield compose with them.
**Stack:** existing Three.js/TypeScript/Vite, installed Blender/Python/browser tools; no new dependencies/downloads.
**Spec:** CONTENT_AND_BEHAVIOR_DESIGN.md.

## Constraints / review focus

Sources/references/history untouched; no reset or overwrite of user saves. HEADcfbd3a7 baseline. Old ids/nests/speeds/economy and safe145/alt100 retained. Additional optional appearance ids must be validated and remain independent of rarity/Nature element/stage. Source clips/root motion/material cache ownership must be honest. Horse never flies; repeated Space cannot provide unlimited ascent. Distinguish Dragon mount from Horse for capture/secure/pause/UI/debug travel/tutorial. Lazy-load extra models and retain fallbacks/disposal. No agent delegates its own agents or edits another owner's files.

### Task1 — actual NPC locomotion
Owner: AmbientResidents.ts and new tests/npc.test.ts; no Game/Horse/config edits. Remove the Horse visual actor (root will own its replacement), retain two Travelers+Knight and pen scenery. Diagnose actual Walk/root tracks; reconcile local root motion and visible forward axis with speed, move along a useful clear route with pauses/turns and planted rest pose, avoid buildings/fountain/owned street routes. No walk-in-place or arbitrary repeated full-action at rest. Independent tests/sample motion; report at ASSET_WORK/iteration2/npc-report.md.

### Task2 — quiet idle and real Dragon variety
Owner: MountainMotion.ts, RideableDragon.ts, dragonAssets.ts, new DragonVariants.ts plus additional visual/motion helpers, derivative tooling/new public Dragon derivative only, tests/dragon-content.test.ts. No Game/Guardian/Progression/Save/nest config edits. Produce factory createDragonVisual(assets:RuntimeAssets,variant:DragonVariantId,onFailure:(message:string)=>void,form:DragonForm):DragonVisual. Variant ids contract: mountain,meadow,frost,ashscale. Mountain/Meadow/Frost share the existing Mountain rig with per-instance owned palette materials; Ashscale uses a separately validated optimized downloaded Demon rig (actual Idle/Run/Fly), if feasibility fails report exact issue before fallback decision. Quiet canonical planted idle with subtle breath; walk/fly/Boost/reactive states still blend. Generic source root/facing motion must not displace physics; Bone/clip/anchor/contact/culling ownership applies to both silhouettes. Source files and previouspublicMountain derivative unchanged. Rig-backed juvenile forms maintain same-source continuity; do not claim dedicated supplied Baby. Report real source/derivative hashes/LODs/errors/clip names and motion evidence to ASSET_WORK/iteration2/dragon-report.md.

### Task3 — eight nests and a readable protective field
Owner: config/gameConfig.ts, config/mvpConfig.ts (spatial/NEW nest data only), World.ts, Environment.ts, Landscape.ts, NestLandscape.ts, new SafeZoneShield.ts and tests/world-content.test.ts. No Game/traversal/saves/Dragon fields edits. Preserve first4markers/balance; add four farther/side-valley existing-world nests with unique ids meadow,canyon,marsh,ruins and visible regional composition. Existing marker ids map to source families in root's variant catalog, not this task. Do not duplicate only same nests in a small cluster; clear approaches/ground/trail/tree corridors. Reuse old-tier balance values by explicit id rather than index overflow; existing4unchanged. Produce SafeZoneShield(radius:number=145,altitude:number=100) with root:Group,update(dt:number):void,dispose():void; lightweight translucent field, restrained rim/energy detail, no cone perimeter, city remains visible; mechanical boundary unchanged. Actual frame/resource/route/ground checks; report at ASSET_WORK/iteration2/world-report.md.

### Task4 — root integration and Horse riding
Root owns config/dragonVariants.ts (catalog contract), Game.ts, Guardian.ts, Progression.ts, SaveSystem.ts, EggModel.ts, UIManager.ts as needed, tests/core-runner.mjs, tests/riding-content.test.ts, new Horse visual/ground controller and QA/docs. First failing tests for legacy/new save lineage, nested raid lineage, grounded Horse physics, no flight and mount transitions. Optional variant carried/owned fields validated; absent legacy fields keep Mountain, no retroactive reroll. New eggs use variantForNest. Horse replaces former ambient instance at existing pen, mounted by E, real movement clips with saddle/rider/feet alignment, Shift land sprint and Space jump; no fly/stamina upgrades. Secure/capture/save/services/Dragon tutorial work with either mount; Horse does not complete Dragon flight tutorial. Root attaches new shield and visual factory/Guardians, adjusts UI clear mount mode, uses same body/facade rules. Keep keyboard/touch semantics.

### Task5 — whole verification / review / reports
- [ ] Per-task meaningful red→green tests and actual visual/motion checks; typecheck/tests/build.
- [ ] Physical new-nest raid/hatch/growth for extra silhouette, Horse mount/trot/sprint/jump/carry secure/dismount, legacy restore, calm idle, NPC route displacement and pauses, shield inside/outside.
- [ ] Repeated teardown/failure/touch/production/isolation/loaded cost; original protected hashes and independent scoped review of implementations plus integrated whole.
- [ ] Current durable Task08/report/manifest/attribution, exact assets/palette-vs-model distinctions, measured cost and residual blockers. No all-library/release claims; game remains running for user review.
