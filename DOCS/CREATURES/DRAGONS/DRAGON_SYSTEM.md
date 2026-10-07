# Dragon System

Authority: [MASTER_GAME_SPEC.md](../../../MASTER_GAME_SPEC.md), sections 5–11, 19, and 24–25.

Hatched dragons belong to the player and begin as Babies, which cannot serve as normal full mounts. Feeding grows them into rideable Young/Juvenile dragons, then rideable Adults with the intended mature/base-stat profile. Rarity, Element, and Growth Stage are three independent identity dimensions; growth changes neither rarity nor element.

Dragon base Speed, Stamina, and Boost are stage-adjusted before universal rider multipliers apply. Different dragons can have different movement profiles; all numeric scaling remains TBD.

```text
Final Speed = Dragon stage-adjusted Base Speed × Rider Speed Multiplier
Final Stamina = Dragon stage-adjusted Base Stamina × Rider Stamina Multiplier
Final Boost = Dragon stage-adjusted Base Boost × Rider Boost Multiplier
```

Desired flight includes takeoff, normal flight, gliding, banking/turning, ascending, descending, landing, and boosting. Boost is held to use, increases speed, and drains stamina faster; releasing it smoothly returns toward normal speed.

Future dragon animation states may include idle, breathing, walking, running, takeoff, flight, flap, glide, bank left/right, ascend, descend, boost, and landing. Smooth movement and transitions are priorities.

Keep prototype assets replaceable. Final models may require modeling, optimization, rigging, skinning, animation, importing, and review.

TODO: mount lifecycle, controller, rig standard, state transitions, collision behavior, stat units, numerical values, and device controls. See [dragon stats](../../../DATA/DRAGON_STATS.md) and [dragon references](../../../REFERENCES/DRAGONS/README.md). No Dragon gameplay implementation occurs in Task 00.

## Growth, Controls, and References

Food grants Growth Points and fills Growth Progress. Stage thresholds trigger growth animation/VFX, update the model/stage, and recalculate stage-dependent stats if applicable. Tutorial free Starter Food must reach the first rideable stage quickly.

Confirmed desktop input: hold Left Shift for Sprint on foot and Dragon Boost while riding. Mobile uses a dedicated HOLD Boost button; exact sizing follows implementation needs.

Inspect [Dragon-style-v1.png](../../../REFERENCES/DRAGONS/Dragon-style-v1.png), [Egg-and-baby-dragon-v1.png](../../../REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png), and [Dragon-flight-carry-v1.png](../../../REFERENCES/ANIMATION/Dragon-flight-carry-v1.png). Image-only numbers, rarity-element pairings, and Adult-only mounting do not override written rules. See [Growth](DRAGON_GROWTH.md), [Growth Values](../../../DATA/DRAGON_GROWTH_VALUES.md), and [Reference Index](../../../REFERENCES/REFERENCE_INDEX.md).

## Nature Young Static Showcase

The existing Nature Young/Juvenile GLB is registered in [Asset Manifest](../../../ASSET_MANIFEST.md) and displayed through GLTFLoader as a static Sanctuary showcase. The file contains two nodes, one mesh/material, embedded textures, no skins/bones and no animation clips. Static visual asset — animation/rigging requires future work. It does not establish Baby, Guardian or Adult runtime assets, rarity, stats, mounting or flight.
