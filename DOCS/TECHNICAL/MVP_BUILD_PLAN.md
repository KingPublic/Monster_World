# Autonomous Dragon MVP Implementation Plan
> For agentic workers: use superpowers:subagent-driven-development; execute continuously under the user's explicit autonomous authorization.

Goal: Playable single-player Dragon MVP through theft, escape, hatch, feeding, growth, mounting, flight and reload.
Architecture: Preserve Task 00 world. Pure Progression and validated local save own inventory; Game coordinates visual actors, interactions and Guardian pursuit. Procedural Dragon groups animate local transforms. Input and a follow camera control foot/flight movement. HTML/CSS owns HUD and service panels.
Tech stack: Existing Vite, TypeScript and plain Three.js, no new runtime dependencies.
Authority: User's Autonomous Dragon MVP Build directive on 2026-10-08 supersedes Task 00 stop boundary for this run.

## Global constraints
- Dragons only, Nature family, single player; no backend/login/monetization/combat/other families.
- No Git mutations, commits, pushes, merges, remote changes or deployment. Work in the specified repository.
- Existing GLB preserved but optional debug only; core gameplay never requests it.
- Preserve world extent and marker coordinates. Four active nests, 3/4/5/5 slots; 300/300/600/600 production seconds. Dev acceleration gated by import.meta.env.DEV.
- No home teleport while carrying; development teleport rejects carried loot.
- Prototype balance centralized and explicitly provisional; feeding preserves rarity/element.

## Review focus
Save corruption/old schema resets safely; per-slot cooldown leaves untouched eggs intact; no distance disengage; mount/dismount and panel focus clear held input; disposal and debug mode cannot leak into production.

## Work units and ownership
- [x] Models: src/creatures/ProceduralDragon.ts and EggModel.ts. Baby/Young/Guardian distinct proportions, mountAnchor, component animation. API root Group, update(dt,pose), stage constructor, dispose. Visual check in final playthrough.
- [x] Motion: src/systems/InputSystem.ts, FollowCamera.ts, src/gameplay/PlayerController.ts, src/world/Traversal.ts, mobile.css. Controls WASD/Shift/E/Space/Ctrl; follow camera without OrbitControls. Input code held/pressed and movement forward/right, camera yaw. Foot ground-height collision and building footprints. Check movement, camera, walkable steps, flight landing and mobile once.
- [x] State: src/config/mvpConfig.ts, gameplay/Progression.ts, systems/SaveSystem.ts, tests/core*. Pure inventories/slot timers/tutorial/save versioning. Meaningful core tests first for per-slot respawn, capacity, no identity mutation, roundtrip/invalid save. No broad test suite.
- [x] Integration: core/Game.ts, gameplay/Guardian.ts, gameplay/Flight.ts, UIManager/main.css. Functional four nests, carried visuals, theft hold, physical return, safe-zone delivery, hatch reveal, food/growth, equip/mount, flight/stamina/Boost, shop/collection/upgrades, gated dev tools.
- [x] Review and final verification: typecheck/build at major checkpoints, one complete browser playthrough with gated travel shortcuts outside active theft, save/reload, additional nest, mobile once. Fix blocking issues only. Synchronize active docs and TASK_MVP_AUTONOMOUS_BUILD_REPORT.md.

## Decisions
Use simple height collision and fixed building footprints; preserve large terrain. Hatch shell pieces/particles instead of fracture physics. Procedural cyclic limbs instead of IK. Four Nature nests with independent rarity pools; terrain region does not imply a different Dragon element. Adult remains future scope. UI uses English in-game consistent with existing references; progress reports use Indonesian.

## Completion evidence
All work units completed at MVP quality. Final typecheck/build and 8 core tests passed; full desktop loop, save/reload, Highland raid/capture, production gates and one emulated touch pass verified. See [MVP report](../../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md) for limitations. No Git mutation or deployment.
