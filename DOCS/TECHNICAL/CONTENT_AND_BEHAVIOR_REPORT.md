# Content and behavior polish — 13 October 2026

Current local follow-up to the user-pushed `cfbd3a7` checkpoint and October13 recording. Previous Phase2/October12 reports remain historical evidence. This pass addresses the recording's nest variety, repeating Dragons, line-only safe border, walking-in-place Traveler, unrideable Horse and overactive parked Dragons. No commit, push, deployment, dependency download, original asset edit or real-user-save reset.

## Playable changes

- Eight separated nests: original Forest/Highland/Volcanic/Frost locations and balance preserved; new Meadow/Amber Canyon/Reedwater Marsh/Forgotten Ruins extend the existing12000-unit world. New trails, detailed ground ribbons and regional formations connect each apron; all34 Egg slots work. The compass now offers eight routes.
- Four appearance lineages from **two actual downloaded Dragon silhouettes**: Mountain, Meadow and Frostcrest use Mountain's rig with independent body/membrane palettes; Ashscale uses the downloaded Demon Dragon. Volcano/Canyon produce Ashscale, Highland/Meadow produce Meadow, Frost/Ruins produce Frostcrest, Forest/Marsh produce Mountain. Appearance stays independent of the existing Nature element/rarity. New eggs keep lineage through theft, secure, hatch, feed, riding and save; legacy records without a variant remain unchanged.
- Both downloaded families supply Baby/Young/Guardian visuals. Juveniles derive the same rig's scale/head/tail; they are not dedicated supplied Baby meshes. Growth keeps the same model instance, root, anchors and identity. Ashscale's final visual normalization is800, its Young saddle offset1, giving a rideable size relative to the5-unit Boy; the initial smaller400 normalization is retained only in intermediate worker evidence.
- Parked wings/feet/tail hold a canonical stopped pose with restrained breath. Authored offsets are restored before sampling, including joints absent from the imported animation; offsets no longer accumulate. Source locomotion/flight blends still animate. Collection recall chooses separate open bays instead of stacking every selected Dragon at one point.
- Traveler walks a22-unit route with stance-driven displacement, real pauses and gradual turns. Garden and market routes avoid city solids. Knight holds the reviewed planted pose. The former ambient Horse actor is replaced by one actual mount.
- Horse: E mounts, WASD rides, Shift sprints, Space makes one finite jump, F dismounts after landing. Ground physics is separate from Dragon flight/upgrades/tutorial rewards. Its actual supplied clips are Idle/Walk; high-speed gallop is explicitly **authored on its four real limb chains**, with world-fixed support and recovering swing phases. Rider legs have a Horse-specific pose and boots remain outside the saddle. Saddle and bags follow the supplied saddle joint. Padded oriented footprint prevents the head/flanks entering facades. Secure/capture/carry/services remain functional.
- Safe Zone now has a translucent animated hexagonal protective field and ceiling. Radius145/altitude100 still match existing delivery mechanics; city visibility and depth remain clear. No opaque cone perimeter.

## Asset qualification and source safety

Nine of19 acquired source groups now contribute to gameplay. Demon is the additional group in this pass; the preceding eight remain. Protected input verification passes for **1092 files**, and all16 preceding runtime outputs retain their exact hashes. The two new derivatives have220 joints/three supplied clips each:

| File | Triangles | Bytes | SHA256 |
| --- | ---: | ---: | --- |
| ashscale-family.glb | 53,151 | 6,659,160 | 3f556114b2a710c0493504a4ebbe8e054eacb09b91f62fd91482e645b4146fa7 |
| ashscale-lod1.glb | 21,885 | 5,197,728 | 2f30cfe8a4c4e9bd350301cff9954fbd5e6bf97e301360d8b75d68046513e9d8 |

Source Demon has312670 triangles. Collapse preserves the220-joint anatomy and supplied `flying_skeletal.3`, `idle_skeletal.3`, `running_skeletal.3` clips. Guardians useLOD1; owned Baby/Young use the family derivative. Runtime material/geometry palettes own their changes while immutable textures remain shared. Reproducible recipes are `tools/asset-pipeline/prepare-ashscale.py` and `compact-ashscale.py`; detailed pose/key/error records and manifests are under `ASSET_WORK/iteration2`.

## Verification

- **47 regressions pass; typecheck and build pass.** Final JS820.70kB /221.60kB gzip; existing>500kB chunk warning remains. No claim of lint checks or dependency installation.
- Actual20-step gameplay passed in an isolated browser: legacy restore, eight routes, Horse riding/sprint/jump/airborne-F rejection/landing/dismount, physical Forest theft and return, physical Volcanic Ashscale theft and return with normal Boost regeneration and descent below safe100, both eggs hatched, real food purchase/feed, same-source Ashscale growth, flight/Boost/landing, exact save/reload. No loot teleport, grant or progression edit was used. Final save is earned test progress with three companions; the real user's browser save was untouched.
- NPC support slip measured on fixed actual skinned vertices at30/60/120FPS, both directions: median<.002u/s, P95<1.48. Independent reviewer reproduced and accepted this correction. Residual toe-off/handover is documented.
- Horse actual96 selected hoof vertices at34/50u/s and30/60/120FPS: median.0055–.0189u/s, P95.102–.466, versus the previous~27/39u/s skating. Explicit regression limits are median.15/P951.5; these measure near-ground support, not every vertex throughout swing or full anatomical joint constraints.
- Textured fixtures cover four appearances, source clips, same-source growth, final larger Ashscale, rider and three talon eggs, plus temporal quiet rest:27 records/errors[]. Actual game regions and interior/exterior field were inspected. New Horse side/phase/jump pictures verify visible rider boots and stance.
- Controlled failures retain playable Dragon/Horse and city fallbacks. Three full teardown/recreate cycles each retain one canvas/one control root and259 geometries/118 textures,13 templates/49 instances. Six lab switches have stable per-asset resource counts. These are allocation counts, not a heap/physical-memory leak profile.
- Real Chromium touch events at390x844/DPR2 pass Horse ride/sprint/finite held jump/dismount and Dragon mount/ascend/held Boost/release/descent/dismount; no page-width overflow. This is emulation, not a physical-phone qualification.
- Local production fresh and saved-family boots have no browser/network errors or debug/lab APIs. Raw lab/source/work routes return the game HTML, not original asset data. Historical unused public comparison files remain preserved. Warmed completed-body120-frame results at1440x900/DPR1 on Radeon680M are approximately17.5–18.2ms P50 and18.3–18.4ms P95,544–564 submitted draws and1.23–1.32million submitted triangles including shadows. Initial decoded payload is44.59MB fresh/51.25MB saved-family; Horse13.62MB is loaded on approach. These are stated local desktop conditions, not guaranteed/mobile FPS. Production Horse ordinary keyboard/visible-compass approach, mount/sprint/jump/airborne-F rejection/land/dismount passes with debug API absent; exact records are in production.json.

Test-harness corrections are retained transparently: screenshots/CPU bounds during active theft consumed escape time, hovering above safe100 did not secure, a page predicate initially referenced an outer variable, and an init script initially reapplied legacy save on reload. Corrections were in the harness; production balance/save were not weakened. A timed production walk also under-travelled during Horse loading; its replacement reads the visible compass for normal-control route feedback.

## Remaining acquired assets

These ten groups are not falsely marked integrated. Their prior file audit remains valid; current remaining work is repair/qualification, not another19-source audit.

| Group | Concrete blocker | Next repair |
| --- | --- | --- |
| Tarisland Dragon |155-joint/27-take package; prior export stalled>20min, recorded usage restrictions unresolved | Isolate one mesh/action, profile export/root motion and verify each resulting clip; settle recorded package terms before external release |
| Bernardo Dragon |258960 triangles, UDIM texture aliases, generic actions | Relink/bake atlas, establish genuine action semantics and derive measured LODs |
| Chinese Dragon |50553 triangles; supplied take does not yield usable runtime skeletal clips;103 fragments are not103 actions | Consolidate/bake skeletal animation and eye materials, verify actual clip/bind geometry |
| Wyvern Animated |28706 triangles/181 joints/11clips, detached bind assembly | Repair mesh/bone bind spaces and compare actual deformation before conversion |
| Wyvern Fishing |60304 triangles/no verified weighted skeleton;154 object/camera takes do not supply riding/flight | Build/skin suitable anatomy and explicit locomotion/flight, or retain a static decorative role after separate qualification |
| Castle |254997 triangles; material relink/LOD not qualified | Repair maps, split modules and derive budgeted LOD |
| Grand Castle |1981608 triangles | Modularize/collapse with silhouette checks and measured draw/memory cost |
| Medieval Scene |255453 triangles/36 missing atlas images | Recover supplied texture paths, validate material packing and split scene |
| Medieval Houses |945316 triangles | Split individual buildings and author/review LODs before placement |
| Sky Temple |56198 triangles/69 maps/~52MB | Relink/pack/downsize maps and validate a selected modular composition |

Remaining quality limits: Dragon Run is adapted to walking without full stance IK; wing/tail geometry can overlap ground during some gait phases and folded wings can overlap riders at some angles. Larger Ashscale appendage overlap must be judged at final runtime scale, not the smaller intermediate. Geometry collapse has no certified Hausdorff bound; JPEG normal/roughness maps are lossy. Comprehensive decorative tree/ridge/wing collision, stronger single art direction, collection streaming at the256-record limit, dedicated Baby art, more species and physical-device performance need further work. Recorded package terms and Horse NonCommercial attribution remain in `public/assets/ATTRIBUTION.md`; local playable use is not external-release clearance.

Primary evidence: `ASSET_WORK/iteration2/{gameplay,resilience,production,visuals,runtime-manifest,source-integrity,horse-sole-drift,npc-sole-drift}.json`, `dragon-final/dragon-browser.json`, recordings and full-size screenshots. Worker reports preserve intermediate decisions and exact derivative validation. Current design/plan accompany this report.
