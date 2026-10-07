# Task 01 — Implementation and Playtest Report

Date: 2026-10-07  
Status: COMPLETE — tutorial vertical slice verified; awaiting the user's manual review before any Task 02 work.  
Target: connected Roblox Studio experience **Steal a Baby Dragon**, PlaceId **138175399498508**.

Current visual polish: the user's approved imported `StarterNatureYoung_v1` now replaces only the Juvenile primitive appearance, retaining its functional Root/Seat/controller. The original implementation inventory below is historical; see [visual replacement report](TASK_01_STARTER_VISUAL_REPLACEMENT.md) for current scale, saddle fit, backup, one-line script change and all 14 integration checks.

Authority: the user's explicit Task 01 implementation authorization, [Task 01](../TASKS/TASK_01_CORE_TUTORIAL.md), and [Master specification](../MASTER_GAME_SPEC.md). The earlier documentation-only restriction applied to the previous synchronization pass. Only this first gameplay milestone was implemented.

## Studio Changes and Architecture

| Location | Created or modified | Responsibility |
| --- | --- | --- |
| `Workspace/SBD_Tutorial` | `Environment`, `Sanctuaries/Sanctuary_1`, `StarterWildNest`, `Runtime` | Small meadow/path, trees/lanterns, home courtyard, visible blue Safe Zone, player spawn, Hatchery, Baby/mount habitat, one nest, three conceptual slot markers, one tutorial egg, Guardian; session runtime models. Additional players receive separate owned sanctuaries. |
| Existing `Workspace` objects | Preserved `Baseplate`, `Terrain`, `Camera`, and default `SpawnLocation` | Default spawn disabled while tutorial spawns are used; no unrelated objects removed. |
| `ReplicatedStorage/SBD` | `Config`, `Rules`, `Remotes/State`, `Remotes/Input`, `Remotes/Action` | Central temporary tuning, shared validation, presentation snapshots, bounded movement input, allowed actions. |
| `ServerScriptService/SBD` | `Bootstrap`, `WorldBuilder`, `TutorialService`, `GuardianService`, `FlightService` | Server-authoritative progression, claim/ownership, Safe Zone, hatch, food/growth, Guardian state machine, mount lifecycle, bounded smoothed flight and stamina. |
| `ServerStorage/SBDAssets` | `Art`, `TutorialEgg`, `BabyDragon`, `JuvenileDragon`, `GuardianDragon` | Replaceable primitive templates and visual/prompt helpers. Juvenile includes a real `Saddle` Seat. |
| `ServerStorage/SBDTests` | `RulesChecks` | Fourteen validation checks, not an enabled gameplay script. |
| `StarterPlayer/StarterPlayerScripts/SBDClient` | `Controller`, `HUD` | Keyboard/touch input, held interaction, camera/FOV, contextual prompts, responsive HUD. |
| `StarterGui/SBDTutorialHUD` | Objective, dragon, stamina, carry, warning cards; progress bars; touch `InteractButton` | Dark/gold fantasy presentation; explicit hunger/free food/growth/first flight objectives. Held ascent/descent/Boost and dismount buttons are created on touch clients. |

Gameplay source lives in Studio. No local Luau script synchronization, Rojo, production DataStore, external dependencies, or publishing was introduced. Session state is separated from client presentation so persistence can be added in a later milestone.

Claim, secure, food consumption, growth, ride unlock, tutorial completion, and flight limits are validated on the server. No remote accepts arbitrary food grants or tutorial-stage changes. Safe Zone validation uses the player's own sanctuary owner, horizontal boundary, and height. The tutorial egg is claimed before any yielding work, preventing duplicate ownership.

The onboarding egg is re-armed when the Guardian returns so another session player can start. This is a tutorial-specific interaction, **not** the 3–5 shared-slot inventory or live 300/600-second respawn system, which remains Task 03.

## Replaceable Prototype Assets

- Cream/green-spotted tutorial egg and scaled carried/hatching copies.
- Green Baby, rideable Juvenile, and larger Guardian dragon models made from Roblox primitives, welded wings/limbs/horns/eyes/tail; Juvenile Seat saddle.
- Sanctuary courtyard, blue boundary markers, hatch columns/pad, habitat/mount pad, player spawn.
- Starter nest platform/twigs, three conceptual slot markers, path stones, meadow, trees, and lanterns.
- World labels/highlights, hatch shake, feeding/growth/secure flashes, simple wing flap and banking; these are procedural presentation, not final animation assets.
- Dark/gold tutorial HUD, progress bars, touch interaction and flight buttons.

Starter Food is a server session counter with HUD/feeding feedback. No dedicated food model, food icon, Shop, sound, music, or production animation asset was created. All final asset approvals remain pending. Actual reference filenames were preserved; relevant images were inspected via the [Reference Index](../../REFERENCES/REFERENCE_INDEX.md).

The final repository audit found an additional local `REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png` beyond the previous synchronization inventory. It was inspected, preserved and registered as an available visual reference, not generated by this implementation or automatically approved as a model/final starter identity. Current reference inventory is 20 images; all original 19 filenames and SHA256 hashes remain unchanged.

## Temporary Configuration

All values below live in `ReplicatedStorage/SBD/Config`, marked `Prototype = true`, version `Task01-v1`. They are playable tuning choices authorized for this slice, not final balancing values or canonical DATA tables.

| Setting | Prototype value |
| --- | --- |
| Steal / other interaction hold | 1 second / 0.35 second |
| Interaction distance | 11 studs |
| Walk / held Sprint | 16 / 25 studs per second |
| Safe Zone horizontal radius / height allowance | 23 / 12 studs |
| Guardian chase / return speed | 21 / 34 studs per second |
| Alert / roar / Safe Zone stop presentation | 0.55 / 0.9 / 0.5 seconds |
| Hatch / feed / growth presentation | 2.2 / 0.9 / 1.1 seconds |
| Free Starter Food | 1 portion, 100 Growth Points; Baby → Juvenile requirement 100 |
| Starter identity | Sprout, Common + Nature, configurable prototype candidate |
| Normal speed / held Boost factor | 32 studs per second / 1.75× |
| Stamina / normal drain / Boost drain / idle regeneration | 100 / 2 per second / 18 per second / 14 per second |
| Vertical speed / height ceiling | 18 studs per second / 130 studs |
| Current rider multipliers / carry | 1× / one tutorial egg |
| Flight introduction completion | Travel 20 studs, ascend more than 4 studs, Boost at least 0.8 second, then release |

Desktop: WASD, Space ascend, Left Ctrl descend, **hold Left Shift** Sprint/Boost, hold E interact, F dismount. Touch: movement joystick, held contextual interaction, ascent/descent, **HOLD Boost**, dismount. Growth retains Common + Nature; only growth stage changes to Juvenile.

The planned 300/600-second per-slot rules and all unapproved production growth/stats/prices remain unchanged in DATA. No live timer is implemented in this milestone.

## Playtest Procedure and Results

Fresh Studio play sessions used real movement navigation and held keyboard/pointer interactions. Inspection read runtime attributes, models, camera, seat state, and Output; progression was not manually advanced to complete the tutorial. A separate deliberate death fixture checked chase cleanup.

| # | Required step | Observed result |
| --- | --- | --- |
| 1 | Player spawns | PASS — on foot in assigned sanctuary, live character. |
| 2 | Tutorial objective appears | PASS — movement/nest objective visible in HUD. |
| 3 | Player reaches Starter Wild Nest | PASS — nearby path traversable on foot; held Shift Sprint works. |
| 4 | Guardian is visible | PASS — large primitive Guardian beside nest; initially IDLE. |
| 5 | Player steals egg | PASS — held E claims once, original egg hides, physical carried egg appears, ESCAPE starts. A short 0.2-second hold was rejected. |
| 6 | Guardian reacts | PASS — ALERT → ROAR label/pulse presentation. No sound asset used. |
| 7 | Guardian chases | PASS — CHASE follows the stealing player; no distance-based success exit. |
| 8 | Player reaches Safe Zone | PASS — own sanctuary entry validated by server. |
| 9 | Guardian stops | PASS — SAFE_ZONE_STOP recorded at successful secure. |
| 10 | Guardian returns home | PASS — RETURN → IDLE at original `(0, 9, -160)` position. |
| 11 | Egg becomes hatchable | PASS — HATCH objective and owned Hatchery prompt enabled. |
| 12 | Egg hatches | PASS — short placed-egg shake/reveal sequence, no purchase/wait gate. |
| 13 | Baby appears | PASS — small Baby model, BABY stage, not rideable. |
| 14 | Starter Food granted | PASS — one free portion appears with hunger objective. |
| 15 | Player feeds Baby | PASS — held feed interaction consumes the portion; FEEDING feedback. |
| 16 | Baby grows | PASS — 100 Growth Points, GROWING feedback, model changes to Juvenile. |
| 17 | Dragon becomes rideable | PASS — rideability enabled; rarity Common and element Nature unchanged. |
| 18 | Player mounts | PASS — held mount prompt, real Saddle Seat, character seated, camera follows dragon. |
| 19 | Dragon takes off | PASS — Space ascent from safe ground clearance. |
| 20 | Normal flight | PASS — smoothed movement/turning, about 32 studs per second, Left Ctrl descent, basic wing/bank presentation. |
| 21 | Held Shift Boost | PASS — held Shift sets Boosting true, about 56 studs per second. |
| 22 | Stamina drains faster | PASS — observed stamina reduction during held Boost; configured 18 versus 2 per second. Exhaustion stops Boost. |
| 23 | Release stops Boost | PASS — Boosting false; speed eases toward 32, camera FOV returns, idle flight regenerates stamina. |
| 24 | Tutorial completes | PASS — server records COMPLETE only after flight/ascent/Boost/release; HUD shows completion. |

Final successful state history:

```text
LEARN_MOVE → SEEK_EGG → ESCAPE → HATCH → HATCHING → FEED
→ FEEDING → GROWING → MOUNT → FLIGHT → COMPLETE
```

Successful Guardian history:

```text
IDLE → ALERT → ROAR → CHASE → SAFE_ZONE_STOP → RETURN → IDLE
```

Additional verification:

- Dismount restored normal character movement, `Sit = false`, `PlatformStand = false`, and camera subject to character Humanoid. Dragon lands at reachable ground height; distance remained within the 11-stud interaction range. Mount → dismount → remount succeeded.
- Death during CHASE released the carried egg, returned progression to SEEK_EGG, respawned the player at home with 100 health, and returned Guardian through RETURN → IDLE. It did not count as a successful secure.
- Unsupported `GrantFood` / `SetStage` remote actions and malformed input did not change food, growth, rideability, or COMPLETE state.
- Fourteen RulesChecks passed: valid claim, duplicate/distant/short/wrong-stage claim rejection, own/foreign/high-altitude Safe Zone, growth/food/identity, repeated feeding, NaN/wrong-type input, bounded movement input. These validate rules; they do not substitute for a live multi-client race test.
- All 11 authored Lua source containers compiled. Final successful and death-cleanup play sessions had only the two expected service/client readiness logs, with no gameplay errors, infinite yields, or broken remotes in Output.
- Baseline Studio plugin errors were present before implementation; they were not observed in final fresh playtest Output.

## Mobile Verification

Studio iPhone 17 Pro landscape simulator, effective viewport **750 × 361**: held interaction completed steal, hatch, feed, and mount; joystick moved the dragon; held ascend/descend, Boost/release, and dismount were exercised. Tutorial reached COMPLETE. Compact HUD remained readable after moving cards away from flight controls and replacing the duplicated jump button while riding.

Simulator pointer coordinates required tool targeting calibration. This was checked against the actual UI receiving input. The MCP uses one pointer, so simultaneous two-finger joystick + Boost on real hardware was **not** verified; that remains a manual review item. No separate mobile gameplay authority was added.

## Errors Fixed

| Issue | Fix and observed verification |
| --- | --- |
| Ground probe treated invisible Safe Zone as floor; mount floated too high | Flight/collision/landing probes respect collidable parts. Mount ground height returned to approximately 5.15 studs. |
| Welded rider stayed standing | Replaceable Juvenile includes server-controlled Seat; live Humanoid `Sit` and `SeatPart` verified. |
| Dismount left dragon hovering beyond interaction reach | Dismount lands the dragon and character; reachable distance and subsequent remount passed. |
| Phone HUD overlapped flight/jump region; touch actions too small | Compact cards relocated, 56-pixel action buttons, dedicated held interaction, default jump hidden while mounted. Phone walkthrough passed. |
| Optional PlayerModule absent in current client runtime | Immediate optional lookup and Humanoid movement fallback; real simulator joystick movement verified without an infinite yield. |
| Very quick Sprint release could encounter action rate limit | Boolean Sprint updates bypass the action throttle; release restores normal WalkSpeed. |

## Known Limitations and Review Before Task 02

- Primitive art, labels, procedural VFX/wing movement, and simple camera; no final models, animation clips, audio, or music.
- Session-only state; ending play resets progression. No publishing or production persistence.
- One shared onboarding egg at a time; concept slot markers only. No full nest pools/respawn system or multi-client stress test.
- Guardian creates visual chase pressure without damage/capture/combat or terrain-aware advanced navigation.
- Basic bounded server flight; advanced handling, collision tuning, landing behavior, network/performance tuning, and production stamina balance remain later work.
- Only Baby → Juvenile, one configurable prototype identity, one tutorial food counter, and carry one. No Adult, Shop/economy, collection UI, upgrades, all elements/rarities, monetization, or Fast Travel.
- No beginner timing study; short travel and brief hatch/growth delays support a few-minute onboarding, but the 1–3 minute target remains for human playtesting.
- Real-phone simultaneous controls, gamepad, multiple active players, disconnect/rejoin, and load/performance testing were not certified by this slice.

Manually review a fresh uninterrupted tutorial, nest/Guardian readability, return-home pressure, Baby feeding/reveal, seat/camera comfort, WASD + Space + Left Ctrl + held/released Shift, F dismount/remount, and real-phone joystick + held Boost. Studio was left stopped in Edit mode. **Task 02 was not started.**

## Local Documentation Files

Gameplay source remains in Studio. This task created two Markdown records and modified seventeen existing documents:

| File | Change | Purpose |
| --- | --- | --- |
| [Implementation ledger](../DOCS/TECHNICAL/TASK_01_IMPLEMENTATION.md) | Created | Scoped plan, completed checks, evidence. |
| [This report](TASK_01_PLAYTEST_REPORT.md) | Created | Studio inventory, 24 steps, fixes, prototype tuning, limitations. |
| [README](../README.md) | Modified | Current milestone/reference inventory and review status. |
| [Master specification](../MASTER_GAME_SPEC.md) | Modified | Task 01 completion and scoped prototype implementation note. |
| [Asset manifest](../ASSET_MANIFEST.md) | Modified | Thirteen usable prototype entries, all final approvals pending. |
| [Changelog](../CHANGELOG.md) | Modified | Honest implementation and validation history. |
| [Task index](../TASKS/README.md) | Modified | Task 01 complete, Tasks 02–05 unstarted. |
| [Task 01](../TASKS/TASK_01_CORE_TUTORIAL.md) | Modified | Authorized slice, controls, exclusions and acceptance links. |
| [Tutorial Flow](../../DOCS/GAMEPLAY/TUTORIAL_FLOW.md) | Modified | Implemented inputs and Task 03 inventory deferral. |
| [Architecture](../DOCS/TECHNICAL/ARCHITECTURE.md) | Modified | Current Studio module responsibilities. |
| [Data Model](../DOCS/TECHNICAL/DATA_MODEL.md) | Modified | Temporary server session representation. |
| [Networking](../DOCS/TECHNICAL/NETWORKING.md) | Modified | Limited input/action/snapshot contract and validation. |
| [Testing index](README.md) | Modified | Current report/results versus later tests. |
| [Acceptance criteria](ACCEPTANCE_CRITERIA.md) | Modified | Verified Task 01 criteria; later systems remain TODO. |
| [Playtest checklist](PLAYTEST_CHECKLIST.md) | Modified | Links the completed Task 01 procedure; retains next-task template. |
| [Bug log](BUG_LOG.md) | Modified | Six observed/fixed issues and verification. |
| [Reference Index](../../REFERENCES/REFERENCE_INDEX.md) | Modified | Registers additional available Young reference with inference limits. |
| [Reference overview](../../REFERENCES/README.md) | Modified | Current count/status distinctions. |
| [Dragon reference README](../../REFERENCES/DRAGONS/README.md) | Modified | Additional actual reference filename/status. |

The additional PNG was already a local reference discovered during audit; it was not created by this implementation. No file was deleted. Original setup prompt, AGENTS, DATA balancing files, Tasks 02–05 and original image files were preserved.
