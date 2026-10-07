# Dragon References

Approved V1 visual references are present. They guide elemental eggs, small cute Babies, growth scale, dragon family silhouettes, and larger intimidating guardians.

A dragon's **Rarity + Element + Growth Stage** are independent. Growing changes neither rarity nor element. Baby is not a normal full mount; Young/Juvenile and Adult are rideable. Image rarity-element pairings and an Adult-only mount label do not override those rules.

Final rosters, stats, exact guardian sizes/abilities, and production readiness remain unresolved. Keep models replaceable; optimization, rigging, skinning, animation, GLB export, and review may still be required.

## Actual Reference Files

- [Dragon-style-v1.png](Dragon-style-v1.png) — v1.
- [Egg-and-baby-dragon-v1.png](Egg-and-baby-dragon-v1.png) — v1.
- [Guardian-dragon-v1.png](Guardian-dragon-v1.png) — v1.
- [Starter-nature-young-3d-reference-v1.png](Starter-nature-young-3d-reference-v1.png) — additional v1 Young/Juvenile model reference inspected in the Task 01 audit. Corresponding imported `StarterNatureYoung_v1` was explicitly user-approved for the historical prototype for first rideable Nature Young only; [fit/playtest report](../../LEGACY_ROBLOX/TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md). The image itself does not establish stats, rarity, a rig or animation readiness.
- [3d-references-single-v1.png](3d-references-single-v1.png) — additional available v1 single view found and inspected during visual replacement; same Nature Young appearance/saddle guidance, no new gameplay or rig approval.

Agents MUST inspect relevant images before implementing a milestone. Preserve exact filenames and versions unless the user explicitly requests a rename. The original three are ACTIVE VISUAL REFERENCES; the additional Young reference is available as indicated above. None is automatically a finished runtime asset. [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md) governs gameplay; see [REFERENCE_INDEX.md](../REFERENCE_INDEX.md) for per-image status and limits.

## Web Runtime Candidate

The Nature Young/Juvenile [GLB](../../public/assets/models/dragons/3d-young-dragon-nature.glb) moved from this directory without binary changes. It is loaded as a static showcase during the Monster World migration, with no skeleton, bones or animation clips. Static visual asset — animation/rigging requires future work. These PNG references remain at their original paths and are not copied into public/assets.
