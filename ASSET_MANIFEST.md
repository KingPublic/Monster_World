# Monster World Asset Manifest

Runtime assets and visual references are distinct. All 21 original PNG references retain their exact names and hashes. Source creator/licensing detail remains TBD unless recorded; migration does not certify production licensing or final art. Historical imports/identifiers and prototype statuses are in [LEGACY_ROBLOX](LEGACY_ROBLOX/ASSET_MANIFEST.md).

Available includes generated procedural geometry or an implemented runtime interface. Pending means no current runtime content; planned element variants remain deferred. A visual reference does not certify a model, rig, animation or gameplay feature. The only active creature family is Dragon.


## Art Direction

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Art Direction Master | Art Direction | Applied guidance | Available · [REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) | Local visual references; creator/provenance TBD | [src](src/) | Premium stylized low-poly fantasy direction; references are not runtime texture assets. |
## Eggs

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Starter Egg | Eggs | Available — procedural | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png)<br>[REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png) | Local visual references; creator/provenance TBD | [EggModel.ts](src/creatures/EggModel.ts) | Common Nature first tutorial Egg; independent slot and carry visuals. |
| Element Egg Variants | Eggs | Available — Nature only | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | [EggModel.ts](src/creatures/EggModel.ts) | Common/Uncommon/Rare/Epic Nature shells, spots, glow and leaf accents; other elements deferred. |
## Dragons

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Nature Young Dragon | Dragon Model — Nature Young/Juvenile | Available — procedural, animated | Available · [Starter-nature-young-3d-reference-v1.png](REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png) | Existing local GLB; prior scoped visual approval retained | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Heroic Nature proportions, wings, legs, segmented tail, saddle/mount anchor. Core gameplay uses this model. |
| Starter Baby Dragon | Dragons | Available — procedural, animated | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Larger expressive head, short snout/legs, small horns/wings, leaf accents; not rideable. |
| Nature Dragon Family | Dragons | Available — Baby / Young / Guardian | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Shared Nature visual family with distinct form proportions. Adult deferred. |
| Fire Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Ice Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Storm Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Dragon Growth Stages | Dragons | Available — Baby → Young | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png)<br>[REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png](REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Two starter feeds transform Baby into rideable Young with particles. Rarity/Element unchanged; Adult deferred. |
## Guardians

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Starter Guardian | Guardians | Available — procedural, animated | Available · [REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png)<br>[REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | [Guardian.ts](src/gameplay/Guardian.ts) | Forest protective Guardian alerts/roars/chases after theft, then stops at Safe Zone and returns. |
| Nature Guardian | Guardians | Available — procedural, animated | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Broad chest, heavy head, branched horns, large wings; different proportions, not just a scaled Baby. Used at all four Nests. |
| Fire Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Ice Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Storm Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
Core models are procedural and animated. The external [Nature Young GLB](public/assets/models/dragons/3d-young-dragon-nature.glb) is preserved as optional historical showcase/reference content and is not requested by Game.

## Environment

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Player Nest / Sanctuary | Environment | Available — procedural city | Available · [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png)<br>[REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png](REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png) | Local visual references; creator/provenance TBD | [Sanctuary.ts](src/world/Sanctuary.ts) | Preserved compact city with plaza, houses, towers, terraces, paths, bridges, vegetation, water and service districts; walkable MVP. |
| Hatchery Area | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Secure Eggs hatch with a 2.5-second wobble/glow/particle sequence; Baby appears at Mount court/habitat. |
| Mount Area | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Young mounts at explicit saddle anchor; landing then F/touch dismount. Adult deferred. |
| Rider Upgrade Area | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Coin-priced universal Speed/Stamina/Boost multipliers and Carry upgrades; provisional tuning. |
| Shop Area | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png)<br>[REFERENCES/GUI/Shop-v1.png](REFERENCES/GUI/Shop-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Basic Food costs 20 Coins and grants 50 Growth; no premium currency. |
| Dragon Collection Area | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/Player-nest-services-v1.png](REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Owned Dragon rarity, element, growth, rideability and equipped state; Young selection recalls to Mount court. |
| Safe Zone | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Player-nest-v1.png](REFERENCES/ENVIRONMENT/Player-nest-v1.png)<br>[REFERENCES/ANIMATION/Guardian-chase-v1.png](REFERENCES/ANIMATION/Guardian-chase-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Glowing radius-145 perimeter; altitude below 100 secures carried loot, ends pursuit and rewards Coins. |
| Starter Wild Nest | Environment | Available — functional | Available · [REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png) | Local visual references; creator/provenance TBD | [mvpConfig.ts](src/config/mvpConfig.ts) | Forest: three slots, individual 300-second respawn, Common Nature pool, own Guardian; preserved physical distance. |
| Fire / Volcano Wild Nest | Environment | Available — Volcanic region | Available · [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local visual references; creator/provenance TBD | [mvpConfig.ts](src/config/mvpConfig.ts) | Five slots, individual 600-second respawn, Uncommon/Rare Nature pool; harder Guardian. No Fire Dragon implemented. |
| Ice / Frost Wild Nest | Environment | Available — Frost region | Available · [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local visual references; creator/provenance TBD | [mvpConfig.ts](src/config/mvpConfig.ts) | Five slots, individual 600-second respawn, Rare/Epic Nature pool; hardest Guardian. No Ice Dragon implemented. |
| Storm / Mythic Wild Nest | Environment | Pending | Available · [REFERENCES/ENVIRONMENT/High-tier-nest-v1.png](REFERENCES/ENVIRONMENT/High-tier-nest-v1.png)<br>[REFERENCES/ENVIRONMENT/World-overview-v1.png](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Local visual references; creator/provenance TBD | — | Environmental example, not a fixed biome order or rarity-element mapping. Exact two highest-tier nest identities remain TBD; no image-only fast travel/level locks. |
| Highland Wild Nest | Environment | Available — functional | Available · [World overview](REFERENCES/ENVIRONMENT/World-overview-v1.png) | Procedural implementation guided by local references | [mvpConfig.ts](src/config/mvpConfig.ts) | Four slots, individual 300-second cooldown, Common/Uncommon Nature pool and its own Guardian. |

## UI

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Tutorial HUD | UI | Available — HTML/CSS | Available · [REFERENCES/GUI/HUD-v1.png](REFERENCES/GUI/HUD-v1.png)<br>[REFERENCES/GUI/HUD-v2.png](REFERENCES/GUI/HUD-v2.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Objectives/destination compass, context hold prompt, Coins/Food, carry, notifications and growth. |
| Flight HUD | UI | Available — HTML/CSS | Available · [REFERENCES/GUI/Flight-hud-v1.png](REFERENCES/GUI/Flight-hud-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Stamina, held Boost, carry/current Dragon, contextual flight guidance; no Guardian HP. |
| Rider Upgrade GUI | UI | Available — HTML/CSS | Available · [REFERENCES/GUI/Rider-upgrades-v1.png](REFERENCES/GUI/Rider-upgrades-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Centralized provisional Coin prices and owned levels; universal multipliers and Carry 1–3. |
| Dragon Collection GUI | UI | Available — HTML/CSS | Available · [REFERENCES/GUI/Dragon-collection-mount-v1.png](REFERENCES/GUI/Dragon-collection-mount-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Rarity, Element, Growth Stage/progress, rideable and equipped state. |
| Hatchery GUI | UI | Available — HUD sequence | Available · [REFERENCES/GUI/Hatchery-v1.png](REFERENCES/GUI/Hatchery-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Context interaction, hatch progress/wobble/glow/particles. Dedicated incubator panel deferred. |
| Shop GUI | UI | Available — HTML/CSS | Available · [REFERENCES/GUI/Shop-v1.png](REFERENCES/GUI/Shop-v1.png) | Local visual references; creator/provenance TBD | [UIManager.ts](src/ui/UIManager.ts) | Basic Food purchase and inventory; more catalog categories deferred. |
| Mobile Controls GUI | UI | Available — basic touch | Available · [REFERENCES/GUI/Mobile-HUD-v1.png](REFERENCES/GUI/Mobile-HUD-v1.png) | Local visual references; creator/provenance TBD | [InputSystem.ts](src/systems/InputSystem.ts) | Joystick, world camera swipe, Interact, Up/Jump, Down, held Sprint/Boost and Dismount. |
## Animation

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Dragon Flight Animation Set | Animation | Available — procedural component poses | Available · [REFERENCES/ANIMATION/Dragon-flight-carry-v1.png](REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Idle, ground cycle, takeoff, flap, glide, banking, vertical/Boost poses and landing settle; no external clips. |
| Egg Carry Animation Set | Animation | Available — simplified attachments | Available · [REFERENCES/ANIMATION/Dragon-flight-carry-v1.png](REFERENCES/ANIMATION/Dragon-flight-carry-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Readable carried Egg meshes attached to rider; capacity 1/2/3. Detailed talon grasp animations deferred. |
| Guardian Animation Set | Animation | Available — procedural component poses | Available · [REFERENCES/ANIMATION/Guardian-chase-v1.png](REFERENCES/ANIMATION/Guardian-chase-v1.png) | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Idle, alert/roar, wings spread, takeoff/chase flap, banking, return and landing; no combat. |
| Baby Dragon Idle Animation | Animation | Available — procedural | Pending — no dedicated reference | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Breathing, head look, tail wiggle and subtle wing movement. |
| Baby Dragon Eating Animation | Animation | Available — procedural | Pending — no dedicated reference | Local visual references; creator/provenance TBD | [ProceduralDragon.ts](src/creatures/ProceduralDragon.ts) | Readable head/body eating motion after feed interaction. |
| Dragon Growth Animation / VFX | Animation | Available — simplified | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | [Effects.ts](src/gameplay/Effects.ts) | Particle burst and Baby → Young form replacement; no fracture/advanced morph rig. |
## Items

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Starter Dragon Food | Items | Available — inventory grant | Pending — no dedicated reference | Local visual references; creator/provenance TBD | [Progression.ts](src/gameplay/Progression.ts) | First hatch grants two free Basic Food, enough for immediate Young growth. No separate 3D food asset. |
| Basic Dragon Food | Items | Available — inventory/shop | Pending — no dedicated reference | Local visual references; creator/provenance TBD | [Progression.ts](src/gameplay/Progression.ts) | 20 Coins, +50 Growth; hunger/feed interaction and eating animation. Dedicated item model deferred. |
| Better Dragon Food | Items | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Possible food type; values TBD. The previous Premium Food planning label does not establish premium currency or monetization. |
| Food Icons | Items | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Dedicated food icon assets pending; Shop-v1 guides generic item-card presentation only. |
## Audio

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Egg Steal / Pickup | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Theft/pickup feedback. No final audio asset/source/ID exists. |
| Guardian Alert | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Detection response. No final audio asset/source/ID exists. |
| Guardian Roar | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Theft reaction. No final audio asset/source/ID exists. |
| Wing Flap | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Dragon flight feedback. No final audio asset/source/ID exists. |
| Boost | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Held Boost feedback. No final audio asset/source/ID exists. |
| Wind Flight Loop | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Flight atmosphere. No final audio asset/source/ID exists. |
| Hatch Crack | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Egg crack sequence. No final audio asset/source/ID exists. |
| Hatch Reveal | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Baby reward reveal. No final audio asset/source/ID exists. |
| Baby Dragon Vocal | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Small living Baby feedback. No final audio asset/source/ID exists. |
| Dragon Eating | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Feeding feedback. No final audio asset/source/ID exists. |
| Upgrade Purchase | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Approved upgrade purchase feedback; prices TBD. No final audio asset/source/ID exists. |
| Coin Gain | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Normal gameplay Coin reward feedback; sources/amounts TBD. No final audio asset/source/ID exists. |
| Safe Zone Secure | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Safe Zone Entry and Egg Secured feedback. No final audio asset/source/ID exists. |
| Growth Transformation | Audio | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Stage-change reward feedback. No final audio asset/source/ID exists. |
## Music

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Sanctuary Theme | Music | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Warm, magical, safe, comforting, adventurous fantasy. Final music asset/source/ID pending. |
| Exploration Theme | Music | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Open, curious, uplifting adventure. Final music asset/source/ID pending. |
| Guardian Chase Layer | Music | Pending | Pending — no dedicated reference | Local visual references; creator/provenance TBD | — | Escalates after theft; urgent pursuit, resolves at own safe zone; avoid horror. Final music asset/source/ID pending. |

The Nature GLB is 5,236,028 bytes; SHA-256 b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615. The future public/assets/models/monsters directory stays unused. References are outside public. [Asset pipeline](DOCS/TECHNICAL/ASSET_PIPELINE.md) records procedural runtime strategy and historical GLB inspection. Audio/music remains direction only; no licensed audio was added.
