# Task 01 Implementation Plan and Ledger

**Goal:** Implement the authorized first playable tutorial in the currently connected Roblox Studio place, ending at first flight.

**Authority:** [Master specification](../../MASTER_GAME_SPEC.md), [Task 01](../../TASKS/TASK_01_CORE_TUTORIAL.md), and the user's detailed Task 01 implementation authorization of 2026-10-07. That authorization supersedes historical documentation-pass prohibitions and explicitly defers live multi-slot respawn to Task 03.

**Architecture:** Studio is the source of gameplay implementation; no local script synchronization. Shared prototype configuration and validation modules live in ReplicatedStorage/SBD. Replaceable templates live in ServerStorage/SBDAssets. ServerScriptService/SBD owns tutorial progression, Guardian movement, feeding/growth, ownership, and bounded flight simulation. A StarterPlayerScripts client collects desktop/touch input, updates the camera, and presents StarterGui/SBDTutorialHUD.

## Scope and Decisions

- Preserve Baseplate, Terrain, Camera, and the default spawn object. Disable the default spawn while tutorial spawns are active.
- Implement one shared, server-claimed tutorial egg; decorative slot markers support future expansion. Re-arm this onboarding interaction only after its Guardian returns. This is not a live 300/600-second inventory implementation.
- Assign each session player a separate sanctuary and validate its owner and boundary on the server.
- Session state only; no economy, Shop, production persistence, Adult growth, combat, or future milestone implementation.
- Prototype dragon identity is Common + Nature; both fields remain configurable and unchanged by growth. This is not a final spawn pool or roster decision.
- WASD movement, Space ascent, Left Ctrl descent, held Left Shift Sprint/Boost, F dismount. Touch uses the existing movement joystick, a contextual held interaction button, and held action buttons.
- Numeric tuning is explicitly temporary and centralized. Normal flight drains less stamina than Boost; idle flight regenerates. Exhausted Boost requires release before reuse.
- A kinematic server flight controller avoids unstable placeholder physics; camera/input presentation is local. Collision checks and ground clearance bound movement.
- Guardian pressure has no damage/capture system in this milestone. Death/disconnection releases onboarding resources and prevents stuck chase state.
- No final audio assets are available; use visual alert/roar feedback and no invented audio IDs.

## Review Focus

1. Duplicate/remote egg claims: only one claimant, valid state, proximity, hold duration.
2. Wrong sanctuary: carrying another owner's boundary cannot secure an egg.
3. Repeated hatch/feed input: one food grant, no negative food, no duplicate dragons or growth.
4. Death/disconnect/missing input: cleanup mounts, chase targets, and stalled held Boost.
5. Desktop/touch presentation: readable HUD, actual mount/dismount, and released Boost smoothing.

## Execution Checklist

- [x] Read required specifications and specialized documentation; inspect relevant actual images.
- [x] Inspect all six target DataModel services and baseline Studio Output.
- [x] Create meaningful failing checks for progression and input validation before implementation.
- [x] Build configuration/validation, replaceable dragon/egg templates, and scoped tutorial environment.
- [x] Implement server-authoritative claims, Guardian state machine, Safe Zone, hatch, food, growth, and mount lifecycle.
- [x] Implement basic smoothed flight, stamina, desktop/touch inputs, camera, and fantasy HUD.
- [x] Playtest the fresh complete sequence through held/released Boost and tutorial completion.
- [x] Verify rejection/cleanup behavior; inspect Output and visuals; fix regressions.
- [x] Update milestone status, asset readiness, changelog, and recorded acceptance results accurately.

## Evidence / Ledger

- Inspection: connected place `Steal a Baby Dragon`, PlaceId 138175399498508; Edit mode; only default scene objects, no scripts or existing gameplay in target services.
- Baseline Output already contained ViewSelector plugin and GameSettingsPlugin errors before this task. Keep those separate from gameplay regressions.
- Execution: authorized direct implementation in the shared Studio target; no worktree or new local tooling is applicable to this Studio-only runtime.
- Validation checks failed before Rules existed; after implementation all 14 passed. All 11 authored Lua source containers compile.
- Fresh desktop walkthrough verified all 24 requested steps through COMPLETE; phone simulator verified held interactions, joystick, vertical controls, Boost/release, completion and dismount.
- Reproduced and fixed invisible Safe Zone floor hits, standing rider pose, unreachable hovering dragon after dismount, phone overlap/control size, optional PlayerModule lookup, and quick Sprint release.
- Final regression verified grounded dismount/remount, unchanged growth identity, rejected unsupported actions/input, and death during chase returning Guardian to IDLE.
- Final fresh Output contained only expected readiness logs. Studio left in Edit mode; Task 02 not started.
- Full evidence, prototype values, asset inventory and intentional limitations: [Task 01 Playtest Report](../../TESTING/TASK_01_PLAYTEST_REPORT.md). Real-phone simultaneous joystick + Boost and multi-client testing remain manual/later review.

## Subsequent Task 01 Visual Polish

- Authorized imported Starter Nature Young v1 visual only; source inspected as one static MeshPart without rig/scripts.
- Preserved old Juvenile under ServerStorage/PrototypeBackups; retained active JuvenileDragon Root/Seat/template path, added unanchored massless welded visual at 12× and fitted Seat.
- Only FlightService's initial rider placement now follows Seat CFrame. Other authored script sources were verified unchanged.
- Fresh tutorial and all 14 requested integration checks passed, including saddle fit, WASD/vertical flight, held/released Boost, stamina, camera, dismount/remount and clean Output. Existing 14 RulesChecks passed.
- [Current visual integration report](../../TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md) documents dimensions/offsets, preserved source and static animation limitation. Studio in Edit mode; no Task 02 work.
