# Core Gameplay Loop

> Current MVP implements Explore → Steal → Guardian escape → Safe Zone delivery → Hatch Baby → Feed → Grow Young → Mount/Fly/Boost → distant raids. See the [verified build report](../../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md).


Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 3, 15, and 26.

```text
Explore → Find Wild Nest → Choose Egg → Steal → Guardian Detects Theft
→ Guardian Chase → Escape to own safe zone → Secure Egg → Hatch Baby
→ Feed → Grow into Young/Juvenile → Ride → Earn Coins / progression resources
→ Upgrade rider → Travel farther → Raid rarer nests → Repeat
```

The stealing interaction is against wild guardian NPCs. Players do not steal from other players' owned collections, inventory, or bases. A guardian pursues throughout the return journey rather than losing aggression solely because of distance; the thief's own safe zone is the primary successful chase end condition.

TODO: capture/failure outcomes, progression resource sources, and detailed interactions. Do not infer those mechanics from the loop. No gameplay is implemented during Task 00.

The sanctuary supports collection, feeding, growth, and progression. It may look like a Dragon Village, but tile-by-tile construction is not core gameplay. Physical escape distance matters; image-only Fast Travel is unapproved. Guardians create escape pressure, not a kill/boss objective.

See [Growth](../CREATURES/DRAGONS/DRAGON_GROWTH.md), [Shop/Food](SHOP_AND_FOOD.md), and [Progression](PROGRESSION.md).
