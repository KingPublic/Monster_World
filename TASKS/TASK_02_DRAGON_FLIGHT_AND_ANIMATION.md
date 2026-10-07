# Task 02 — Dragon Flight and Animation

STATUS: MVP IMPLEMENTED — authorized autonomous run on 2026-10-08

## Objective

Mount lifecycle, smooth Dragon flight/takeoff/glide/bank/ascent/descent/landing/held Boost, procedural hierarchy/component animation, stage-adjusted base Speed/Stamina/Boost and universal Rider multipliers/Carry Capacity. Existing GLB is static and optional; core Dragons are procedural.

## Required Reading

[Master specification](../MASTER_GAME_SPEC.md), [Agent rules](../AGENTS.md), [Architecture](../DOCS/TECHNICAL/ARCHITECTURE.md), [World Structure](../DOCS/WORLD/WORLD_STRUCTURE.md), [Dragon Growth](../DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md), relevant [DATA](../DATA/README.md), [Reference Index](../REFERENCES/REFERENCE_INDEX.md) and actual relevant images.

## Boundary

Dragons only; single-player browser runtime. Preserve working systems, exact reference filenames and configurable approved rules. Unapproved numbers stay TBD. The Autonomous Dragon MVP authorization covers phases A–H in this run. No commits/push/merge/deployment unless explicitly requested.

Implemented scope and validation are recorded in the [MVP report](../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md) and [build plan](../DOCS/TECHNICAL/MVP_BUILD_PLAN.md). Provisional tuning lives in src/config/mvpConfig.ts. Adult forms, additional elements, final art/audio and release certification remain deferred.
