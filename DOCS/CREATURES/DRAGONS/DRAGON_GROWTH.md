# Dragon Growth System

> Current MVP: Basic Food grants 50 Growth; 100 transforms Baby into Young. First hatch grants 2 free Food for immediate growth. Feeding animates eating; transformation uses particles and a procedural form replacement. Rarity and Nature Element remain unchanged. Adult growth and final tuning are deferred.


Authority: [MASTER_GAME_SPEC.md](../../../MASTER_GAME_SPEC.md), sections 5–9, 18–22.

## Core Principle

Dragons hatch as **Baby Dragons**. Players grow them by feeding Dragon Food, primarily purchased using normal gameplay **Coins** from the physical Player Nest Shop.

A dragon has independent **Rarity + Element + Growth Stage**. Growth never changes rarity or element: Mythic Storm Egg → Mythic Storm Baby → Mythic Storm Juvenile → Mythic Storm Adult.

## Growth Stages

Current V1 direction: **Egg → Baby → Juvenile / Young → Adult**. Exact naming can be standardized later.

### Baby Stage

Newly hatched, visibly small and cute, and living inside the sanctuary. It cannot be used as the normal full mount yet.

### Juvenile / Young Stage

Larger and **rideable**, allowing the player to begin flying with this dragon.

### Adult Stage

Fully developed visual model and rideable, with the intended mature/base-stat profile for the species. Exact stage stat scaling remains TBD.

## Feeding

Food grants **Growth Points**, which fill a **Growth Progress** value. When the next-stage threshold is reached:

- Trigger growth animation/VFX.
- Update the growth stage and visual model.
- Unlock the next stage.
- Recalculate stage-dependent stats if applicable.

Rider multipliers apply after the stage-adjusted base stats. Growth thresholds, food points/prices, numerical scaling, surplus-point handling, and exact transition timings remain TBD.

## Tutorial Exception

The first dragon must not require grinding. Onboarding grants enough **FREE STARTER FOOD** to grow the first Baby into a rideable Young/Juvenile quickly. No long waiting or premium gate is added; food quantity and thresholds remain TBD until balanced together.

## References and Limits

[Egg-and-baby-dragon-v1.png](../../../REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) guides small Baby designs, hatch reveal, and visual growth scale. An Adult-only mount label in the concept does not override the approved rideable Young/Juvenile stage. Inspect the [Reference Index](../../../REFERENCES/REFERENCE_INDEX.md); exact species, rarity distributions, and growth numbers cannot be inferred from images.

See [Growth Values](../../../DATA/DRAGON_GROWTH_VALUES.md), [Shop and Food](../../GAMEPLAY/SHOP_AND_FOOD.md), and [Tutorial Flow](../../GAMEPLAY/TUTORIAL_FLOW.md). Documentation only; no gameplay or assets are created.
