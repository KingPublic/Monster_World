# Tutorial Flow

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), section 21, and [Task 01](../../TASKS/TASK_01_DRAGON_VERTICAL_SLICE.md).

Keep onboarding FAST within the opening few minutes; the approximately **1–3 minute** target remains subject to playtesting. No grinding, long waiting, or premium gates.

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

Free Starter Food must provide enough Growth Points to reach the first rideable Young/Juvenile stage quickly. Grant quantities, food points, and thresholds remain TBD and must be balanced together. Baby is not a normal full mount. Growth preserves rarity and element.

The initial theft/escape occurs on foot: hold Left Shift to Sprint on desktop. While riding, hold Left Shift for Dragon Boost; mobile has a dedicated HOLD Boost button. Other desktop and mobile inputs remain TBD for the web slice; historical prototype mappings do not define final controls.

Planned nests follow per-slot inventory rules: configurable capacity 3–5, standard 300-second respawn after theft and 600 seconds at the two highest-tier nests. Untouched eggs remain available. No egg inventory or respawn runs during Task 00.

Inspect [HUD-v1.png](../../REFERENCES/GUI/HUD-v1.png), [HUD-v2.png](../../REFERENCES/GUI/HUD-v2.png), [Stater-wild-nest-v1.png](../../REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png), [Player-nest-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-v1.png), and [Egg-and-baby-dragon-v1.png](../../REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png). Concept-only keys, timers, adult-only mounts, and monetary values do not override the specification.

The web Task 01 is NOT STARTED. Task 00 contains a static world/Dragon showcase only. Food amounts, hatch/growth timing, Guardian tuning and starter rarity remain TBD. See [Growth](../CREATURES/DRAGONS/DRAGON_GROWTH.md) and [Shop/Food](SHOP_AND_FOOD.md).
