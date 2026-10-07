# Asset Manifest

This manifest tracks planned art, eggs, dragons, guardians, environments, UI, animation, items, audio, and music. The [Reference Index](REFERENCES/REFERENCE_INDEX.md) registers **21 actual images** at the Task 01 visual-replacement audit. The user-approved imported Starter Nature Young v1 mesh is separately recorded below; see [visual integration report](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md).

## Status Meaning

- **REFERENCE AVAILABLE**: an actual listed concept/pose image exists for the stated visual use. It is not a ready Roblox asset.
- **PROTOTYPE ASSET READY**: an actual usable Roblox prototype verified in an authorized milestone, with partial scope stated in Notes.
- **FINAL ASSET APPROVED**: reserved for an actual asset explicitly reviewed and approved for production.
- **APPROVED V1 VISUAL**: the user-approved imported visual, verified in Task 01; complete creature rig/animation remains pending.
- **PENDING**: no dedicated reference or readiness/approval is established for that entry.

Task 01's verified usable prototypes are marked PROTOTYPE ASSET READY below with their limited scope. The approved imported Young mesh is marked APPROVED V1 VISUAL; complete production rig/animation approvals remain pending. Images remain separate from usable Studio assets. See [original Task 01 report](TESTING/TASK_01_PLAYTEST_REPORT.md) and [current Young integration](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md). Keep prototypes replaceable and never invent Roblox Asset IDs.

Wild Nests target 3–5 physical slots with per-slot theft-triggered respawn: 300 seconds standard; 600 seconds for the TWO highest-tier nests. Untouched eggs remain available; claims must be server-authoritative. Exact nest identities, pools, and probabilities remain TBD.

Exact filenames/versions are preserved. Sources are local approved visual references where listed; detailed creator/provenance remains TBD. Reference images do not authorize prices, stats, timers, paid products, Fast Travel, city-building, or boss combat. Planned families/areas are not a finalized species or biome roster.

## Art Direction

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Art Direction Master | Art Direction | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) | Local approved visual reference; provenance TBD | Global premium toy-fantasy style, sanctuary, world, dragon scale, materials, and GUI. |

## Eggs

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Starter Egg | Eggs | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png)<br>[REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png) | Local approved visual reference; provenance TBD | First tutorial egg; exact starter identity remains TBD. Task 01 primitive template and carried/hatching copies ready in ServerStorage/SBDAssets/TutorialEgg. |
| Element Egg Variants | Eggs | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Elemental shell design; final roster, pools, and probabilities TBD. |

## Dragons

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| StarterNatureYoung_v1 | Dragons — Nature Young/Juvenile only | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | APPROVED V1 VISUAL; full rig pending | [Starter-nature-young-3d-reference-v1.png](REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png) | User-approved Studio import; observed MeshId `rbxassetid://102505212074318` | Source retained in ServerStorage/SBDAssets/Imported; 12× static visual welded inside JuvenileDragon, fitted invisible Seat; Baby/Guardian/Adult excluded. Old placeholder retained in PrototypeBackups. [Verified integration](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md). |
| Starter Baby Dragon | Dragons | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Hatches as Baby; free food grows it into a rideable Young/Juvenile. Common rarity remains prototype configuration; the Nature Young visual role is now user-approved. Task 01 BabyDragon primitive remains; Juvenile now uses imported StarterNatureYoung_v1 visual with the existing controller. This does not finalize the full roster. |
| Nature Dragon Family | Dragons | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Family visual planning; rarity and growth remain independent of element. |
| Fire Dragon Family | Dragons | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Ice Dragon Family | Dragons | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Storm Dragon Family | Dragons | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Dragon Growth Stages | Dragons | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING |[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png)<br>[REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png](REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png) | Local approved visual reference; provenance TBD |Egg → Baby → Young/Juvenile → Adult. Young/Juvenile is rideable despite Adult-only labels in the concept. Task 01 Baby/Juvenile model transition ready; Adult remains pending. User-approved StarterNatureYoung_v1 replaces the Juvenile visual only; Baby remains separate and Adult pending. |

## Guardians

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Starter Guardian | Guardians | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png)<br>[REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local approved visual reference; provenance TBD | Beginner protective/chasing guardian; exact identity/tuning TBD. Task 01 large primitive GuardianDragon ready with visual state feedback; no production audio or combat. |
| Nature Guardian | Guardians | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local approved visual reference; provenance TBD | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Fire Guardian | Guardians | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local approved visual reference; provenance TBD | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Ice Guardian | Guardians | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local approved visual reference; provenance TBD | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Storm Guardian | Guardians | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local approved visual reference; provenance TBD | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |

## Environment

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Player Nest / Sanctuary | Environment | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png)<br>[REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) | Local approved visual reference; provenance TBD | Compact Dragon Sanctuary/Dragon Village hub; tile-by-tile city-building is not the core loop. Task 01 compact primitive courtyard/sanctuary ready; final full hub remains pending. |
| Hatchery Area | Environment | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local approved visual reference; provenance TBD | Secure/place/hatch eggs into Babies; image counts/timers are not canonical. Task 01 primitive hatch pad/columns and held hatch interaction ready. |
| Mount Area | Environment | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local approved visual reference; provenance TBD | Physical selection/ride presentation for eligible Young/Juvenile and Adult dragons; exact interactions TBD. Task 01 habitat/pad and Juvenile Saddle Seat ready. |
| Rider Upgrade Area | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local approved visual reference; provenance TBD | Physical location for four approved universal rider upgrades; image-only extra categories are excluded. |
| Shop Area | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png)<br>[REFERENCES/GUI/Shop-v1.png](REFERENCES/GUI/Shop-v1.png) | Local approved visual reference; provenance TBD | Physical Shop primarily sells Dragon Food for normal gameplay Coins. Items/prices TBD. |
| Dragon Collection Area | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local approved visual reference; provenance TBD | Visible owned dragons; inspect/compare identity, growth, stats, rideability, and equipped state. |
| Safe Zone | Environment | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ANIMATION/Guardian-chase-v1.png](REFERENCES/ANIMATION/Guardian-chase-v1.png) | Local approved visual reference; provenance TBD | Own-zone arrival secures stolen items and ends pursuit. Barrier styling is visual; exact barrier physics TBD. Task 01 blue boundary and server owner/radius/height validation ready. |
| Starter Wild Nest | Environment | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png) | Local approved visual reference; provenance TBD | 3–5 slot capacity target; Starter 3 is an example. Standard 300-second per-slot respawn after theft; untouched eggs remain available. Task 01 primitive nest, three concept markers and ONE onboarding egg ready; full shared slot inventory/live timers remain Task 03. |
| Fire / Volcano Wild Nest | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local approved visual reference; provenance TBD | Environmental example, not a fixed biome order or rarity-element mapping. Exact two highest-tier nest identities remain TBD; no image-only fast travel/level locks. |
| Ice / Frost Wild Nest | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local approved visual reference; provenance TBD | Environmental example, not a fixed biome order or rarity-element mapping. Exact two highest-tier nest identities remain TBD; no image-only fast travel/level locks. |
| Storm / Mythic Wild Nest | Environment | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local approved visual reference; provenance TBD | Environmental example, not a fixed biome order or rarity-element mapping. Exact two highest-tier nest identities remain TBD; no image-only fast travel/level locks. |

## UI

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tutorial HUD | UI | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/GUI/HUD-v1.png](REFERENCES/GUI/HUD-v1.png)<br>[REFERENCES/GUI/HUD-v2.png](REFERENCES/GUI/HUD-v2.png) | Local approved visual reference; provenance TBD | Retain both versions; objective progression includes free food/feeding/growth before first ride. Q in v1 does not override Left Shift. Task 01 objective/carry/dragon/growth cards and prompts ready; final art pending. |
| Flight HUD | UI | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/GUI/Flight-hud-v1.png](REFERENCES/GUI/Flight-hud-v1.png) | Local approved visual reference; provenance TBD | Return/pursuit/stamina/carry/current mount presentation; no guardian HP or separate Boost resource is approved by image filler. Task 01 stamina/Boost/mount presentation ready; advanced HUD pending. |
| Rider Upgrade GUI | UI | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/GUI/Rider-upgrades-v1.png](REFERENCES/GUI/Rider-upgrades-v1.png) | Local approved visual reference; provenance TBD | Speed/Stamina/Boost multipliers and Carry; stage-adjusted bases × multipliers. Prices/curves TBD. |
| Dragon Collection GUI | UI | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/GUI/Dragon-collection-mount-v1.png](REFERENCES/GUI/Dragon-collection-mount-v1.png) | Local approved visual reference; provenance TBD | Add Growth Stage, rideability, and equipped state. No image-only passive income or additive rider bonus. |
| Hatchery GUI | UI | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/GUI/Hatchery-v1.png](REFERENCES/GUI/Hatchery-v1.png) | Local approved visual reference; provenance TBD | Egg/progress/reveal presentation; no approved multi-hour timers, paid speed-up, premium currency, or exact incubator count. |
| Shop GUI | UI | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/GUI/Shop-v1.png](REFERENCES/GUI/Shop-v1.png) | Local approved visual reference; provenance TBD | Item-card/category visual style. Dragon Food core; Utility optional future; Cosmetics not required for current MVP gameplay. |
| Mobile Controls GUI | UI | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/GUI/Mobile-HUD-v1.png](REFERENCES/GUI/Mobile-HUD-v1.png) | Local approved visual reference; provenance TBD | Dedicated HOLD Boost placement/visual direction; exact sizes and other input mappings TBD. Task 01 held interaction, joystick support, 56-pixel ascent/descent/Boost/dismount actions ready; real-phone simultaneous control review pending. |

## Animation

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dragon Flight Animation Set | Animation | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ANIMATION/Dragon-flight-carry-v1.png](REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) | Local approved visual reference; provenance TBD | Takeoff, flight, glide, banks, ascend/descend, held Boost, landing; pose sheet is not an animation clip. |
| Egg Carry Animation Set | Animation | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ANIMATION/Dragon-flight-carry-v1.png](REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) | Local approved visual reference; provenance TBD | Carry 1 rider egg; Carry 2 rider + dragon egg; Carry 3 rider + one egg per talon. Maximum 3. |
| Guardian Animation Set | Animation | REFERENCE AVAILABLE | PENDING | PENDING | [REFERENCES/ANIMATION/Guardian-chase-v1.png](REFERENCES/ANIMATION/Guardian-chase-v1.png) | Local approved visual reference; provenance TBD | Idle, theft detect, alert/roar, takeoff, chase, disengage at own safe zone, return. Pressure artwork does not approve boss combat. |
| Baby Dragon Idle Animation | Animation | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Required living/idle behavior; dedicated animation reference/clip pending. Baby appearance follows the dragon reference pack. |
| Baby Dragon Eating Animation | Animation | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Required feeding behavior; dedicated reference/clip pending. |
| Dragon Growth Animation / VFX | Animation | REFERENCE AVAILABLE | PROTOTYPE ASSET READY | PENDING | [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local approved visual reference; provenance TBD | Visual growth scale reference only; dedicated transformation motion/VFX assets pending. Task 01 procedural flash and Baby/Juvenile model swap ready; dedicated animation clip/final VFX pending. |

## Items

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Starter Dragon Food | Items | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Free tutorial grant sufficient for first rideability; grant quantity, points, price, and actual food asset TBD. Task 01 implements a session food counter/feeding feedback only; dedicated food model/icon remains pending. |
| Basic Dragon Food | Items | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Possible Coin-bought food type; exact catalog/points/price TBD. |
| Better Dragon Food | Items | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Possible food type; values TBD. The previous Premium Food planning label does not establish premium currency or monetization. |
| Food Icons | Items | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Dedicated food icon assets pending; Shop-v1 guides generic item-card presentation only. |

## Audio

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Egg Steal / Pickup | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Theft/pickup feedback. No final audio asset/source/ID exists. |
| Guardian Alert | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Detection response. No final audio asset/source/ID exists. |
| Guardian Roar | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Theft reaction. No final audio asset/source/ID exists. |
| Wing Flap | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Dragon flight feedback. No final audio asset/source/ID exists. |
| Boost | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Held Boost feedback. No final audio asset/source/ID exists. |
| Wind Flight Loop | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Flight atmosphere. No final audio asset/source/ID exists. |
| Hatch Crack | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Egg crack sequence. No final audio asset/source/ID exists. |
| Hatch Reveal | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Baby reward reveal. No final audio asset/source/ID exists. |
| Baby Dragon Vocal | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Small living Baby feedback. No final audio asset/source/ID exists. |
| Dragon Eating | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Feeding feedback. No final audio asset/source/ID exists. |
| Upgrade Purchase | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Approved upgrade purchase feedback; prices TBD. No final audio asset/source/ID exists. |
| Coin Gain | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Normal gameplay Coin reward feedback; sources/amounts TBD. No final audio asset/source/ID exists. |
| Safe Zone Secure | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Safe Zone Entry and Egg Secured feedback. No final audio asset/source/ID exists. |
| Growth Transformation | Audio | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Stage-change reward feedback. No final audio asset/source/ID exists. |

## Music

| Asset | Category | Reference Status | Prototype Status | Final Status | Reference | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sanctuary Theme | Music | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Warm, magical, safe, comforting, adventurous fantasy. Final music asset/source/ID pending. |
| Exploration Theme | Music | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Open, curious, uplifting adventure. Final music asset/source/ID pending. |
| Guardian Chase Layer | Music | PENDING | PENDING | PENDING | Pending — no dedicated reference file | Pending | Escalates after theft; urgent pursuit, resolves at own safe zone; avoid horror. Final music asset/source/ID pending. |

Audio/musical direction is documented in [REFERENCES/AUDIO/README.md](REFERENCES/AUDIO/README.md); a written direction is not an audio file. [Growth](DOCS/DRAGONS/DRAGON_GROWTH.md), [Shop/Food](DOCS/GAMEPLAY/SHOP_AND_FOOD.md), and [Nest Configs](DATA/NEST_CONFIGS.md) govern behavior and approved configurable values. No models, rigs, scripts, sound files, images, or production assets are generated in this pass.
