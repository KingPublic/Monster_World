# Tutorial Flow

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), section 21, and [Task 01](../../TASKS/TASK_01_CORE_TUTORIAL.md).

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

The initial theft/escape occurs on foot: hold Left Shift to Sprint on desktop. While riding, hold Left Shift for Dragon Boost; mobile has a dedicated HOLD Boost button. Task 01 inputs: WASD, Space ascend, Left Ctrl descend, hold E interact, F dismount. Touch uses the movement joystick, held contextual interaction, ascent/descent, HOLD Boost and dismount buttons.

Production nests follow shared per-slot inventory rules: V1 target capacity 3–5, with a 3-slot Starter example; standard respawn is 300 seconds after that slot's egg is taken, while untouched eggs remain available. Task 01 explicitly implements one shared onboarding egg with conceptual slot markers and re-arms it after Guardian return. Full live inventory/timers remain Task 03; onboarding re-arming does not change the production rules.

Inspect [HUD-v1.png](../../REFERENCES/GUI/HUD-v1.png), [HUD-v2.png](../../REFERENCES/GUI/HUD-v2.png), [Stater-wild-nest-v1.png](../../REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png), [Player-nest-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-v1.png), and [Egg-and-baby-dragon-v1.png](../../REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png). Concept-only keys, timers, adult-only mounts, and monetary values do not override the specification.

Task 01 is COMPLETE following the user's explicit implementation authorization. Temporary prompts/layout, short hatch/growth timing, Guardian/flight tuning, and Common + Nature starter candidate live in Studio `ReplicatedStorage/SBD/Config`; final balances remain TBD. See [verified playtest report](../../TESTING/TASK_01_PLAYTEST_REPORT.md), [Growth](../DRAGONS/DRAGON_GROWTH.md), and [Shop/Food](SHOP_AND_FOOD.md). No full Shop/economy or Task 02 implementation was added.
