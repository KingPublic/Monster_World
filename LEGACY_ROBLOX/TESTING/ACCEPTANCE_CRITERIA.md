# Gameplay Acceptance Criteria

Task 01 criteria below were verified in fresh Studio play sessions on 2026-10-07; see [all 24 step results](TASK_01_PLAYTEST_REPORT.md). Later systems retain TODO criteria. Local setup criteria belong to [Task 00](../TASKS/TASK_00_PROJECT_SETUP.md).

## Tutorial

PASS — fresh session completes on-foot theft → chase → own Safe Zone → hatch Baby → free food → feed/grow Juvenile → mount → flight/ascent → held/released Boost → COMPLETE without manually advancing progression.

## Egg Stealing

PASS for Task 01 — held nearby interaction is server validated; one tutorial claimant, carry model, short-hold rejection. Full nest inventory is deferred.

## Guardian Chase

PASS for Task 01 — IDLE → ALERT → ROAR → CHASE → SAFE_ZONE_STOP → RETURN → IDLE; original home reached. Death cleanup returns without claiming success. No combat or distance-based successful exit.

## Safe Zone

PASS for Task 01 — own-zone secure works in playtest; rules reject foreign ownership and excessive height. Multi-client scene tests remain later review.

## Hatching

PASS for Task 01 — fast interaction/shake/reveal produces one non-rideable Baby and grants free Starter Food.

## Mounting

PASS for Task 01 — Juvenile only, real Seat, character/camera attached; dismount restores movement/camera, dragon lands within reach, remount succeeds.

## Flight

PASS for Task 01 basic version — smoothed WASD movement/turning, Space ascent, Left Ctrl descent, bounded height/ground clearance. Advanced Task 02 flight criteria remain TODO.

## Boost

PASS for Task 01 — held Left Shift activates faster flight; release clears Boost and smoothly returns toward normal speed. Touch HOLD Boost and release exercised in simulator.

## Stamina

PASS for Task 01 — Boost drains faster than normal flight, exhaustion stops Boost, idle regeneration observed. Production balancing remains TBD.

## Carry Capacity

TODO: criteria when the relevant milestone is designed.

## UI

PASS for Task 01 — objective, carry, dragon/growth and relevant stamina shown; context interaction usable on keyboard and simulated phone. Final UI and real-device multi-touch review remain later work.

## Saving

TODO: criteria when the persistence foundation is designed.

## Multiplayer

TODO: criteria when detailed multiplayer rules are designed.

## Performance

TODO: targets and criteria when the relevant milestone is designed.

## Dragon Growth and Feeding

PASS for Task 01 — free food consumed once, progress fills, Baby changes to rideable Juvenile while rarity/element stay unchanged. Adult and production food balancing remain deferred.

## Shop and Food

TODO: criteria when the physical Shop and Coin-bought Dragon Food milestone is designed.

## Shared Egg Slots and Per-Slot Respawn

TODO: criteria when implemented, grounded in the approved 3–5 capacity target, configurable theft-triggered 300/600-second per-slot timers, unchanged untouched eggs, and server-authoritative single claims. No detailed procedures or runtime results are fabricated here.
