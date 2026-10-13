# Monster World Asset Manifest

Runtime assets and visual references are distinct. All 21 original PNG references retain their exact names and hashes. Source creator/licensing detail remains TBD unless recorded; migration does not certify production licensing or final art. Historical imports/identifiers and prototype statuses are in [LEGACY_ROBLOX](LEGACY_ROBLOX/ASSET_MANIFEST.md).

Available includes generated procedural geometry or an implemented runtime interface. Pending means no current runtime content; planned element variants remain deferred. A visual reference does not certify a model, rig, animation or gameplay feature. The only active creature family is Dragon.


## Current runtime library — October12 polish

| Asset | Runtime path | Status / evidence |
| --- | --- | --- |
| Cartoon Boy | [cartoon-boy.glb](public/assets/models/characters/player/cartoon-boy.glb) | Visible playable player; 12,120,668 bytes, 100 joints, 75 distinct morph names; zero source clips, authored rig poses. Canino 3d / recorded TurboSquid Standard; user supplied. |
| FANTASTIC Village selected subset | public/assets/models/environment/sanctuary/village-{body,body2,tower,flag,cart,tree}.glb | Curated natural-proportion garden-city plus16 LOD0 trees; source/material aliases fixed on derivatives. Listing's Allows usage with AI: No remains unresolved for external release. |
| Market V01 | public/assets/models/environment/sanctuary/market-stall.glb | Actual Food Shop; 842,844 bytes, 10,408 triangles; exact Fab license/creator pending. |
| Stone Pathway maps | public/assets/textures/materials/roads/stone-pathway-{albedo,normal,roughness,ao}.jpg | Four1K maps, CC0; normalized16-bit AO, shared world-space UVs over8 street planes and3 plaza circles. |
| Traveler | public/assets/models/characters/npc/traveler.glb | Two ambient wandering NPCs;1,637,652bytes; actual Walk1.033s preserved; no services. |
| Knight of Tomorrow | public/assets/models/characters/npc/knight.glb | Ambient arrival guard;5,684,260bytes; one generic Action.001 preserved, reviewed static pose; not a supplied Idle. |
| Horse demo | public/assets/models/creatures/ambient/horse.glb | Lazy-loaded ambient Horse;13,617,612bytes; two actual demo clips preserved, Idle used. CC BY-NC4.0; no mount/service. |

[Full19-source validation](DOCS/TECHNICAL/ASSET_VALIDATION_REPORT.md), [historical Phase2 runtime decisions](DOCS/TECHNICAL/ASSET_RUNTIME_PLAN.md), [historical integration evidence](DOCS/TECHNICAL/ASSET_INTEGRATION_REPORT.md), and [current use of8/19 groups, exact16-file hashes and blockers](DOCS/TECHNICAL/VISUAL_POLISH_REPORT.md). Remaining11 groups stay audited/prepared only; no public release rights are inferred. [Attribution](public/assets/ATTRIBUTION.md) retains recorded restrictions.

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
| Nature Young Dragon | Dragon — temporary owned Young mapping | Available — downloaded Mountain rig / montage windows + authored offsets | Existing Nature reference retained | Alexey, CC BY4.0 recorded; attribution retained | [mountain-family.glb](public/assets/models/dragons/mountain-family.glb) |10,069,068bytes;95 joints/2 skins; complete Take00196.7667s, bounded keys/PBR fix; actual growth/mount/flight/Boost/landing. Not a finalized species roster. |
| Starter Baby Dragon | Dragons | Available — matching downloaded rig with authored juvenile proportions | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Alexey Mountain source; authored runtime proportions | [RideableDragon.ts](src/creatures/RideableDragon.ts) | Head1.52×, wings.67×, tail.76× and smaller body; same-instance blended growth. Unrideable; dedicated final Baby anatomy/art remains unfinished. |
| Nature Dragon Family | Dragons | Available — one matching temporary Baby/Young/Guardian family | Existing family references retained | Alexey Mountain / authored forms | [RideableDragon.ts](src/creatures/RideableDragon.ts) | Four Guardian parents use independent rigs; Baby→Young preserves identity, physics/root and anchors. Procedural only loading/failure fallback. Adult/final species palette unfinished. |
| Fire Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Ice Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Storm Dragon Family | Dragons | Pending | Available · [REFERENCES/DRAGONS/Dragon-style-v1.png](REFERENCES/DRAGONS/Dragon-style-v1.png)<br>[REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Baby/Young/Adult visual planning; exact species/stat scaling TBD. |
| Dragon Growth Stages | Dragons | Available — Baby → Young | Available · [REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png](REFERENCES/DRAGONS/Egg-and-baby-dragon-v1.png)<br>[REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png](REFERENCES/DRAGONS/Starter-nature-young-3d-reference-v1.png) | Local visual references; creator/provenance TBD | [Game.ts](src/core/Game.ts) | Two starter feeds transform Baby into rideable Young with particles. Rarity/Element unchanged; Adult deferred. |
## Guardians

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Starter Guardian | Guardians | Available — downloaded Mountain parent rig | Available · [REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png](REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png)<br>[REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Alexey Mountain; CC BY4.0 recorded | [Guardian.ts](src/gameplay/Guardian.ts) | Forest Guardian still alerts/roars/chases, stops at safe boundary and physically returns. |
| Nature Guardian | Guardians | Available — downloaded Mountain family, independently animated | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Alexey Mountain; authored parent motion | [RideableDragon.ts](src/creatures/RideableDragon.ts) | Four actual downloaded Guardians, conservative skinned culling bounds; unchanged chase/capture rules. Parent scale differs from Young; no Adult progression. |
| Fire Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Ice Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
| Storm Guardian | Guardians | Pending | Available · [REFERENCES/DRAGONS/Guardian-dragon-v1.png](REFERENCES/DRAGONS/Guardian-dragon-v1.png) | Local visual references; creator/provenance TBD | — | Elemental silhouette/atmosphere planning; specific attacks, HP, level gates, and combat systems not approved. |
Baby/Young/Guardians now use mountain-family.glb. Eggs remain procedural; ProceduralDragon is a temporary loading/failure fallback. Historical Nature GLB and superseded mountain-young.glb remain preserved comparison files and are never requested by current Game.

## Environment

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Player Nest / Sanctuary | Environment | Available — curated downloaded garden-city | Existing Sanctuary/style references retained | Tidal Flask Studios Village; supplied Fab Market; Amal Kumar CC0 roads; restrictions retained | [SanctuaryAssets.ts](src/world/SanctuaryAssets.ts) | Ten Village buildings, one V01 Food Shop, two towers, four flags, one cart,16 trees; low court/broad stairs, planted connected avenues/open mount court; actual bounds/shared service anchors. |
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
| Dragon Flight Animation Set | Animation | Available — authored poses of downloaded rig | Existing flight reference retained | Mountain source has one unsplit Take 001; it is preserved | [RideableDragon.ts](src/creatures/RideableDragon.ts) | Local wing/gait/head/tail and bank poses follow existing flight state; physics root stays separate from source root motion. Baby/Guardian component animation remains procedural. |
| Egg Carry Animation Set | Animation | Available — rider + independent talon attachments | Existing carry reference retained | Authored local transforms | [CarriedEggs.ts](src/creatures/CarriedEggs.ts) | Carry 1 on rider; Carry 2 adds right foot; Carry 3 adds left foot. Moving-world transforms tested and actual Egg flight/delivery verified. Detailed grasp polish remains. |
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

The Nature GLB is 5,236,028 bytes; SHA-256 b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615. The future public/assets/models/monsters directory stays unused. References are outside public. [Asset pipeline](DOCS/TECHNICAL/ASSET_PIPELINE.md) records the active downloaded/procedural pipeline and historical GLB preservation. Audio/music remains direction only; no licensed audio was added.
