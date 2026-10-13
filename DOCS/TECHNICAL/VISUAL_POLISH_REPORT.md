# Monster World — visual cohesion and playability polish

Verified local pass: **2026-10-12**, continued from the user’s October11 recordings and existing Phase2 work. This report supersedes prior runtime-state descriptions; earlier measurements/reports remain historical. Sources were not re-audited unnecessarily. All19 original groups remain audited; **8 groups are now actually used in gameplay**, with11 unpromoted groups and exact repair steps below. This is a local implementation/verification milestone, not final art, universal device performance or release-rights clearance.

## What visibly changed

The two recordings showed tall slab terraces, noisy carpet-like roads, stretched facades, tiny/clipping camera framing, flat sparse surroundings, stiff posing and different procedural Baby/Guardian versus imported Young. The revised scene uses a low planted garden-city, natural uniformly scaled buildings, connected avenues/stairs, an open mount court, water/benches/banners/curbs and16 actual Village trees. All five service areas remain functional. Safe radius145, world extent12000, distant nest positions, speeds, economics, slot cooldowns and save version1 remain unchanged.

City foundation radius126/height1 slopes into the valley by radius140. Upper hatchery court height6 connects through28-unit-wide stairs. Services: Hatchery(0,6,-67), Shop(-62,1,48), Collection(-62,1,-27), Rider(74,1,-26), Mount(68,1,20). Ten Village buildings plus one Market stall preserve proportions; shared actual model AABBs drive collision/camera. Four banners, two watchtowers and one cart mark districts without overhead enclosure. Stationary self-owned details are instanced; replaceable groups stay independent.

One actual downloaded Mountain rig now represents owned Baby, Young and all four Guardian parents. Baby has authored head1.52×, wings0.67× and tail0.76× plus smaller body scale, blended into Young on the same instance/physics/mount/carry roots. It is not a supplied anatomically finalized Baby. Saved rarity/element/name identity stays unchanged. Guardian detection/chase/capture/safe-return rules are retained; no distance leash.

The intact96.7667s Take001 is sampled into runtime rest2.8–6.8s, ground48–50.6s and air28–30.2s windows. Sparse endpoints are interpolated and loops closed; source root/facing tracks are omitted only from runtime copies. Blending and authored neck/head/tail/breathe/eat/bank/wing response keep motion local. These are not separate supplied Fly/Idle/Run clips. Both skinned soles support ground contact; source jaw joint remains UNKNOWN. The saddle, stirrups, measured rider hip height, two-bone hand reach and bank/Boost lean improve riding and carrying. Cartoon Boy retains100-joint/75-morph source data and zero source clips; authored gait cadence follows travelled speed, with stance correction, transitions, blink and smile.

Follow camera tracks once, frames foot/mounted play, retracts against actual facades and recovers smoothly. A review regression caught lens padding collapsing the camera at legal wall-adjacent positions; it now stays16 units away when looking outward. Owned torso collision prevents walking through the Dragon. Decorative foliage remains outside gameplay obstacle mechanics.

The valley retains its full scale:1922 deterministic branching broadleaf/tiered evergreen trees, instanced undergrowth/rocks, continuous Forest/Highland trails,38 irregular ridge silhouettes, and braided/mossy nests with detailed ground aprons matching the existing physical floor. Warm sunlight, hemispheric fill, gradient/cloud sky, restrained fog and sky-derived IBL connect model materials. Traveler×2, Knight and lazy-loaded Horse are strictly ambient; no new services or mounts.

## Non-destructive preparation

Mountain derivative shrank18,636,276→10,069,068 bytes.707,014→177,294 animation keys remain across264 channels with unchanged geometry/nodes/skins and complete source time span. Every original key was checked: maximum quaternion error0.000699982rad, translation0.0248608 source units, scale0.0000005555, within0.0007/.025/.000015 limits. Actual texture→image mapping verified: inverse GLOSS packed into roughness, true ILLUM used for modest emission. Earlier incorrect orange previews were corrected before final evidence.

Traveler11,588,188→1,637,652 bytes; Knight10,378,356→5,684,260; prepared Horse21,830,024→13,617,612. Ambient non-image buffers, geometry/skins/clip definitions are identical. Village tree1,071,836 bytes selects only LOD0 in its scene; alternative LOD buffers remain unreachable. All five promoted derivatives were independently verified against preparation sidecars. Cartoon Boy/roads/other curated modules retain prior verified bind/material conversion.

All1092 protected source/reference/historical files match SHA-256 baseline. Historical Nature GLB remains5,236,028 bytes / b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615. Neither it nor superseded Mountain Young/unused prepared Door is requested by current gameplay. Those preserved comparison files may still exist in public/build storage; absence from network loading does not mean storage pruning. No source edits, replacement downloads, new dependencies, Git writes, deployment or user-save reset occurred.

## Current decisions for all19 groups

Actual animation count/meaning stays distinct from authored gameplay actions, exporter fragments and hierarchy/helper counts. YES means local gameplay use of the curated derivative, not complete pack or release readiness.

| Asset/pack | Integrated now | Actual supplied clips/rig | Current runtime bytes | Evidence / remaining risk | Required next action |
| --- | --- | --- | ---: | --- | --- |
| Cartoon Boy | YES — player | 0 source;100 joints/75 morph names | 12,120,668 | Authored rig gait/jump/interaction/carry/mount, hand reach and facial morphs. Final animation/art tuning remains. | Retain canonical bind repair; further authored/baked motion; recorded TurboSquid terms. |
| Traveler | YES —2 ambient NPCs | Walk1.033s;45 joints | 1,637,652 | 1K textures; actual Walk preserved, no services. Slow wandering can still show foot sliding. | Add verified Idle or match route gait timing; CC BY4.0 attribution. |
| Knight of Tomorrow | YES — arrival ambient | Action.0019.833s;120 joints | 5,684,260 | Generic action meaning UNKNOWN; reviewed frozen pose with mild ambient turn/breath.65,502 triangles. | A proper idle and lower-cost LOD before expanding NPC count; CC BY4.0. |
| Horse | YES — lazy ambient | Horse_Idle13.9583s / Horse_Walk1.4583s | 13,617,612 | 82,426 triangles;676 hierarchy/helpers, not independent deform-joint count. No mount/service. | Reduce rig/geometry for more instances; CC BY-NC4.0 requires licensing solution before commercial release. |
| Mountain Dragon | YES — Baby/Young/4 Guardians | Take00196.7667s;95 joints/2 skins | 10,069,068 | 20,460 triangles per instance. Same-family growth; runtime juvenile proportions/windows and secondary motion. Jaw rig UNKNOWN. | Dedicated Baby/art/action clips, rig/contact refinement and full roster mapping remain; CC BY4.0. |
| Tarisland Dragon | NO | 27 normalized actual takes;155 hierarchy | Not loaded | Real deformation verified in Phase2; exporter stalled ~20min. Tencent/uploader restrictions unresolved. | Repair exporter/action timelines/root motion and resolve usage before promotion. |
| Bernardo Dragon | NO | 2 source stacks;107 derived joints | Not loaded | 258,960 triangles; missing UDIM/texture-name mapping and generic action semantics. | Relink UDIMs, silhouette-preserving LOD, explicit action mapping and visual recheck. |
| Chinese Dragon | NO | 1 source stack;0 Three source clips | Not loaded | 50,553 triangles/183 derived joints.103 Blender fragments are not103 supplied actions; eye/assembly issues. | Reconstruct continuous take, relink eyes, verify deformation/anatomy and anchors. |
| Demon Dragon | NO | 3 actual Fly/Idle/Run clips;220 joints | Not loaded | 312,670 triangles; reviewed clips but geometry/material/silhouette cost too high for current scene. | Create LOD, verify materials and rider/body anchors before integration. |
| Animated Wyvern | NO | 11 clips;181 joints/4 skins | Not loaded | 28,706 triangles; components detached/bind or assembly incorrect. Fab terms unresolved. | Repair mesh/skin bind, retest every clip/component and usage terms. |
| Fishing Wyvern | NO | 0 skeletal GLB clips;154 FBX object/camera takes | Not loaded | 60,304 triangles; fishing prop composition and no proven flight rig. | Build verified deformation rig/flight actions and remove fishing props in derivative. |
| FANTASTIC Village | YES — curated city/tree | 0 usable skeletal;602 source FBXs | 6994000 | 10 buildings,2 towers,4 flags,1 cart,16 LOD0 trees. File/LOD/engine variants are not concurrent scene assets. | Further curated modules/LOD if composition warrants; listing Allows usage with AI:No remains unresolved for external release. |
| Fantasy Market | YES — V01 Food Shop | 0 source | 842,844 | Selected10,408-triangle V01; full115,240-triangle scene/README counts differ. Other variants unused. | Curate further stalls if needed; verify exact Fab creator/license. |
| Fantasy Castle | NO | 0 | Not loaded | ~254,997 triangles/one mesh; material/texture relink and dense landmark cost. | Repair maps, split useful pieces and make LOD; then review silhouette/layout. |
| Grand Fantasy Castle | NO | 0 | Not loaded | 1,981,608 triangles/one mesh. Would overwhelm the current city with no prepared layout/LOD. | Split static landmark and silhouette-preserving LOD; visual comparison before promotion. |
| Medieval Village Scene | NO | 0 skeletal | Not loaded | 255,453 triangles/36 meshes; requested atlas name differs from supplied file. | Relink actual atlas, split useful modules, LOD/colliders and composition QA. |
| Medieval Village Houses | NO | 0 | Not loaded | 945,316 triangles/12 meshes; whole-scene placement unsuitable. | Split individual houses, make LOD/material variants and grounded colliders. |
| Sky Temple | NO | 0 | Not loaded | 56,198 triangles/69 meshes;~52MB textured comparison/many draws. No new region mechanic. | Reduce textures/draws, curate decorative modules and review existing-world placement. |
| Stone Pathway | YES — streets/plazas | 0 | 1,208,504 | Four1K maps; world-space UVs, normal/rough/AO and curbs.107,390-triangle preview excluded. | Keep CC0 attribution; no blanket displacement; verify seams with any layout edits. |

## Verification evidence

- Typecheck and production build passed;20/20 meaningful tests passed. New regressions were observed failing before their fixes: family continuity, camera obstruction/wall adjacency, pose transition/hand reach, sparse montage loop, both-foot contact, moving skin bounds and static batch transform/disposal. Original flight/frame-rate, raid/capacity/slot/economy/save checks remain.
- Fresh isolated browser loop passed: actual downloaded Guardians, theft, physical sprint escape and denied theft teleport, secure/reward, hatch/unrideable Baby, two starter feeds→same-family Young, mounting, held Boost/turning/flight/landing/dismount, Shop/Collection/Rider and exact save/reload. No page/console or failed-request errors. Test saves never touch the user’s browser context.
- Fourteen physical city route waypoints passed without teleport, covering all services/stairs/mount/exit. Owned Young approach uses a legal body standoff. Separate physical raid/return carrying Egg1 on the rider passed; Carry3 is an explicitly isolated three-angle pose/anchor fixture, not a fabricated three-Egg raid.
- Aborted player/family/building/normal-map loads retain a playable fallback including flight. Valid but empty city GLB keeps visible Hatchery/Rider fallbacks. Three Game cycles keep one canvas/one touch-control set and stable233 geometries/112 textures; six alternating Lab cycles keep stable counts per model/material type. Developer Lab exposes source/prepared/current published variants and all19 groups.
- Actual CDP touch events in Chromium390×844/DPR2 pass joystick/sprint, interact/mount, ascend/held Boost/release, descent/landing/dismount and no horizontal overflow. This is emulation, not physical-device certification.
- Production boot passed both fresh and Young-save contexts, with no debug API/UI, Lab entry or source/work gateway exposure. The tested raw routes serve ordinary game HTML fallback. Current Mountain family is downloaded once for shared Guardian/Young templates; historical Nature and superseded Mountain Young are not requested.
- Independent review found two P2s (wall-padding camera collapse and forced offscreen Guardian draws). Both fixed and re-reviewed. Actual family skin bounds:216samples/5,209,056 vertex checks across nine motion states, Baby→Young→Guardian, translated/rotated roots and bank/vertical extremes, zero vertices outside conservative spheres. Actual city before/after batching preserves589 represented objects while589→250 initial mesh submissions, zero checked transform/geometry/color/shadow descriptor differences. Review retains collection/device/art limits.

## Measured cost and limits

Production sampling uses Chromium153 headless,1440×900/DPR1, AMD Radeon680M through ANGLE/D3D11. It waits for complete player/family response bodies, six seconds of shader/texture warmup, then120 rendered frames; shadows included, idle spawn. Cold loading/compiler stalls are excluded from this steady-state window and remain a loading concern. The earlier short27-frame fresh sample was unsuitable for a steady-state claim and was replaced.

| Build context | Rendered frames | p50 interval(ms) | p95 interval(ms) | Mean draws/frame | Mean triangles/frame | Completed decoded network bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Fresh | 120 | 6.10 | 12.10 | 524 | 1198792 | 39,356,260 |
| Young | 120 | 6.10 | 12.10 | 533 | 1220292 | 39,356,260 |

These are RAF intervals and draw counters on this machine, not guaranteed FPS/input latency on other hardware. Compared with a recorded earlier polish save-reload sample1009 calls, the final equivalent context is about530–533 calls; animation/camera phases vary slightly. Batching and skin culling reduce submission cost. Older Phase2 production captures show ~825calls/~334k triangles, but used simpler surroundings and a different feature set/warmup; do not interpret them as a controlled FPS comparison. The richer final scene has roughly1.2M shadow-inclusive triangles at spawn. Low-end devices still need spatial grove chunking/distance LOD, lower ambient LOD/rig cost and real-device profiling.

Network startup is39.36MB decoded in both tested contexts, including code and current nearby models/maps. Horse adds13.62MB when approached and is not loaded at spawn. Download once/template caching does not eliminate clone draw/animation cost. Main JS786.87kB minified /211.13kB gzip retains the existing >500kB advisory. Texture decode/shader compilation can briefly pause initial loading; code/model streaming and shader warmup remain performance work. Current16 used asset files total bytes are recorded below; dormant comparison storage is separate.

Art limitations remain explicit: temporary Mountain family rather than a final Nature species/stage library, generic source montage/juvenile anatomy, feet aligned to a shared root floor rather than full terrain-aware IK, static decorative vegetation/water, occasional slow-NPC gait sliding, simple torso/facade colliders and no tree/ridge collision. Palette/scale/lighting/composition are materially more cohesive, but a realistic Dragon among stylized scenery still needs deliberate final art direction. Authoritative user aesthetic approval and physical/mobile comfort cannot be certified by automated checks. Large saved collections are not a256-Dragon performance guarantee. Licensing restrictions (especially Horse NC, Village listing, Tencent/Fab unknowns) remain release blockers.

## Final runtime paths and hashes

| Current used output | Bytes | SHA-256 |
| --- | ---: | --- |
| public/assets/models/characters/player/cartoon-boy.glb | 12,120,668 | b8e264363fe4924ea8096338431b218cd17e714f1460663714f7d5445d370860 |
| public/assets/models/characters/npc/traveler.glb | 1,637,652 | 7be9df17d2d450419c0a1b5186ca32617f12ea615270db668458599b255d8845 |
| public/assets/models/characters/npc/knight.glb | 5,684,260 | bb96091255fc1e9a754df3cb1f53132752bbcf5cc7587516e8ca0bc3a579099d |
| public/assets/models/creatures/ambient/horse.glb | 13,617,612 | 95a6cafb00886f2cde616f70ed380e847f890a7343679eb8ea496e30713cb271 |
| public/assets/models/dragons/mountain-family.glb | 10,069,068 | f86ea6dc5aea6da516af62d0ace9f5e42f8203ee561724b0b4aec26c22d83a38 |
| public/assets/models/environment/sanctuary/village-body.glb | 1,550,668 | b3dd8b3540769b38019e68871c0b2721c2c6febde74d0ff58ce5027f58d37e2a |
| public/assets/models/environment/sanctuary/village-body2.glb | 1,682,488 | c396180a431ad847314b9fe675f737a3032cf3d7842bafbccc70b0558dc579bf |
| public/assets/models/environment/sanctuary/village-tower.glb | 521,716 | 63db467a6658be849d310df015fd79a0f941615a38f064de90a5bbb07ff01ada |
| public/assets/models/environment/sanctuary/village-flag.glb | 1,314,712 | 67f0be2ed0cc9c80547f1898e1b094ac6f8cb070c4e4f1a2133b8341abd3f467 |
| public/assets/models/environment/sanctuary/village-cart.glb | 852,580 | 3bdaf4b1ff7c1a492bf487e903a06ec5e155f8603152899b46299fb2fc883791 |
| public/assets/models/environment/sanctuary/village-tree.glb | 1,071,836 | eefd0644a4ecb9697027eba18e75f6f95f1c74728b4d17709ca038056fbfae63 |
| public/assets/models/environment/sanctuary/market-stall.glb | 842,844 | b422f347eeb0f3678ce2fc5b7c75ff6127fe7ba85fc3da681deff22862c79026 |
| public/assets/textures/materials/roads/stone-pathway-albedo.jpg | 290,337 | 4e972bc399d05f9b833ac8f8a36d26c46e9fa170615ee5c73caf3c33503e96c2 |
| public/assets/textures/materials/roads/stone-pathway-normal.jpg | 362,417 | 677c17692806dc369217ecc90ed90e081d2211bdec4ee587c1796f6da8ef083a |
| public/assets/textures/materials/roads/stone-pathway-roughness.jpg | 223,773 | b817a0ee290d836f37629b6faec4771fac13d2a053785a816424e72a29a0cfe9 |
| public/assets/textures/materials/roads/stone-pathway-ao.jpg | 331,977 | 3408400d55ca4174f04bdc802c076b59c6f1c3b4412f26cd0c5eb2c4ad62722a |

## Visual and machine evidence

![Earlier Phase2 versus current city context](../../ASSET_WORK/polish/comparison-city.jpg)

Comparison uses the former walk screenshot and the current arrival context. Camera framing/height and layout deliberately changed; this is a contextual appearance comparison, not an identical-camera geometry/performance benchmark.

![Current game: mounted Dragon and connected garden-city](../../ASSET_WORK/polish/game-mounted.png)

![Actual family silhouettes (isolated fixture)](../../ASSET_WORK/polish/comparison-family.jpg)

Family fixture independently frames each form; apparent image size is not a world-size comparison. Baby shape is authored on the matching rig. Actual play/carry screenshots and eight consecutive flight-motion frames remain beside the JSON evidence.

Evidence: ASSET_WORK/polish/{gameplay,city-walkways,carry,poses,resilience,production,derived-verification,runtime-manifest,performance-summary}.json; review.md; landscape-report.md; comparison images; game-*.png; pose-*.png; family-*.png; flight-motion0..7. Protected hashes: ASSET_WORK/reports/source-integrity.json. Baseline Phase2 evidence remains in ASSET_WORK/reports and previews.

Reusable commands and current Lab variants are described in tools/asset-pipeline/README.md. Next work order: user art/playability review of this pass; low-end device/LOD/loading work; dedicated matching Baby/actions and family palette; then repair individual blocked packs according to the table. No unapproved new gameplay or release work was performed.
