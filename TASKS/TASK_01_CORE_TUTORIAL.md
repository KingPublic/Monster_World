# Task 01 — Core Tutorial

STATUS: COMPLETE — first playable vertical slice verified on 2026-10-07; manual review pending before Task 02.

## High-Level Objective

Create a fast first playable slice within the opening few minutes:

```text
Spawn on foot
↓
Learn movement
↓
Travel to nearby Starter Wild Nest
↓
See Guardian protecting eggs
↓
Steal first tutorial egg
↓
Guardian detects theft
↓
Guardian alerts / roars
↓
Guardian pursues player
↓
Return to own Sanctuary / Safe Zone
↓
Egg becomes secured
↓
Guardian stops pursuit
↓
Guardian returns to Wild Nest
↓
Player places / hatches egg
↓
Baby Dragon appears
↓
Tutorial explains that the Baby is hungry
↓
Player receives FREE STARTER FOOD
↓
Feed Baby
↓
Growth Progress fills
↓
Baby grows into Young / Juvenile dragon
↓
Dragon becomes rideable
↓
Player mounts first dragon
↓
Basic flight introduction
↓
Tutorial complete
```

The initial theft/escape occurs on foot. Baby is not immediately mountable; enough free Starter Food must reach Young/Juvenile quickly without grinding, long waits, or premium gates. Growth preserves rarity and element. Exact food quantities/points, thresholds, hatch timing, and starter identity remain TBD.

Confirmed desktop controls: hold Left Shift to Sprint on foot and to Boost while riding. Task 01 uses WASD, Space ascent, Left Ctrl descent, hold E interaction, F dismount. Mobile uses a dedicated HOLD Boost button, held interaction, joystick, ascent/descent and dismount controls.

This authorized slice implements one shared server-claimed tutorial egg and three conceptual slot markers. The full 3–5 slot inventory and theft-triggered 300/600-second timers remain Task 03; tutorial re-arming after Guardian return is not that production respawn system. Temporary growth/food/flight values and Common + Nature identity are centralized in Studio `ReplicatedStorage/SBD/Config`, marked prototype. Production balancing values in DATA remain TBD.

## Required Reading When Requested

- [Master specification](../MASTER_GAME_SPEC.md)
- [Tutorial flow](../DOCS/GAMEPLAY/TUTORIAL_FLOW.md) and [Core Loop](../DOCS/GAMEPLAY/CORE_LOOP.md)
- [Egg System](../DOCS/GAMEPLAY/EGG_SYSTEM.md) and [Nest Configs](../DATA/NEST_CONFIGS.md)
- [Guardian AI](../DOCS/AI/GUARDIAN_AI.md), [Player Nest](../DOCS/WORLD/PLAYER_NEST.md), and [Safe Zone](../DOCS/WORLD/SAFE_ZONE.md)
- [Dragon Growth](../DOCS/DRAGONS/DRAGON_GROWTH.md), [Growth Values](../DATA/DRAGON_GROWTH_VALUES.md), and [Shop/Food](../DOCS/GAMEPLAY/SHOP_AND_FOOD.md)
- [HUD Spec](../DOCS/UI_UX/HUD_SPEC.md)
- [Reference Index](../REFERENCES/REFERENCE_INDEX.md), then relevant actual GUI, dragon, environment, and animation images

## Authorized Slice and Acceptance

The user's explicit Task 01 authorization permits Studio implementation and supersedes the previous documentation-pass restriction for this milestone. The slice includes own Safe Zone ownership checks, the full Guardian state sequence, fast hatch, free feeding, Baby → Juvenile growth, real Seat mounting/dismounting, basic smoothed flight/stamina, and desktop/touch HUD. Session state is sufficient; all assets/tuning are replaceable prototypes.

Acceptance requires a fresh play session to complete theft → chase → secure → hatch → feed → growth → mount → flight → held/released Boost without manual progression intervention, a returning Guardian, preserved rarity/element, and no major gameplay Output errors. All 24 requested steps were verified. See [implementation ledger](../DOCS/TECHNICAL/TASK_01_IMPLEMENTATION.md), [acceptance criteria](../TESTING/ACCEPTANCE_CRITERIA.md), and [playtest report](../TESTING/TASK_01_PLAYTEST_REPORT.md) for evidence, changes, fixes, and limitations.

No full Shop/economy, Adult, roster, live multi-slot respawn, combat, Fast Travel, production persistence/audio, or later milestone was implemented. Stop here; do not begin Task 02 without authorization.
