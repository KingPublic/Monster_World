# Phase 2 asset validation — 2026-10-09

**Current runtime update — 2026-10-12:** this table preserves Phase2 audit/integration state and measured source facts. Later visual polish promotes Traveler, Knight and Horse as ambient assets, adds Village trees and uses the optimized Mountain family for Baby/Young/Guardians. Current use is8/19 audited groups. Updated decisions, hashes, tests, screenshots and remaining blockers: [VISUAL_POLISH_REPORT.md](VISUAL_POLISH_REPORT.md). Historical AUDIT_ONLY/promotion labels below are not current usage.

All 19 downloaded sources have been audited from actual files: 635 model/editable files, including 602 individual FANTASTIC Village FBXs. Every acquisition metadata record was read. Acquisition PASS is retained as extraction evidence; it does not establish animation, visual quality, gameplay readiness or usage permission. Original archives were previously removed with user approval; no replacements or downloads were made.

`READY_GLB/READY_GLTF` describes the inspected format or the explicitly selected derived variant. `INTEGRATED_LOCAL` means it is used in this playable local milestone. `AUDIT_ONLY` means inspected but not part of gameplay. `BLOCKED` means a concrete conversion/rig/rights issue prevents promotion. Flags can coexist. Usage text is transcribed from acquired metadata, with unresolved terms retained; this report does not certify release rights.

All 1,092 protected files (SOURCE_ASSETS, all REFERENCES, historical Nature GLB) matched their initial SHA-256 snapshot. The preserved Nature GLB is 5,236,028 bytes, SHA-256 `b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615`. No source write, Git staging/commit/push/PR/deployment or framework migration was performed.

## Decisions for every downloaded source

| Asset | Role | Source Format | Rig | Actual Clips | Visual QA | Technical Readiness | Gameplay Readiness | Usage Status | Primary Issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| stylized-cartoon-boy | Main player | FBX | 100 hierarchy bones; weighted skin; 75 morph channels | 0 source | PASS repaired bind, clothing/eyes and 11 authored pose states × 3 angles | READY_GLB derived | INTEGRATED_LOCAL | TurboSquid Standard recorded; user supplied | Source bind transforms inconsistent; no baked motion; further pose/art polish |
| traveler | Wandering NPC | GLB + BLEND | 45 joints; weighted skin | 1 | PASS model and Walk samples | READY_GLB; needs runtime preparation | AUDIT_ONLY | maxpanysh / CC BY 4.0 recorded | Future NPC integration outside scope; no idle/service animation |
| knight-of-tomorrow | Guard / important NPC | GLB | 120 joints; weighted skin | 1 | PASS model and Action.001 deformation | READY_GLB; NEEDS_OPTIMIZATION | AUDIT_ONLY | Kondrashov Anton / CC BY 4.0 recorded | 65,502 triangles and one generic action; retargeting/action meaning UNKNOWN |
| horse | Ambient only | FBX | 676 hierarchy/helper nodes; weighted skin; not 676 independent deform joints | 2 | PASS source/derived individual movement samples | NEEDS_OPTIMIZATION | AUDIT_ONLY | WildMesh 3D / CC BY-NC 4.0 recorded | 82,426 triangles; noncommercial restriction; never a mount |
| mountain-dragon | Rideable Young visual | GLB | 95 joints, 2 skins; weighted wings/head/neck/tail/legs | 1 | PASS source/derived, montage, actual flight and rider/carry | READY_GLB derived | INTEGRATED_LOCAL | Alexey / CC BY 4.0; attribution retained | One unsplit take; authored motion; no matching Baby; 18.6 MB load |
| tarisland-dragon | Future rideable species / reference | FBX | 155 hierarchy bones; real skin deformation | 27 | PASS all 27 normalized takes; root motion needs reconciliation | NEEDS_FBX_TO_GLB + NEEDS_MANUAL_REVIEW | BLOCKED | Tencent ownership; uploader noncommercial + PG13; conflicting generic CC label | Blender export attempt stalled; rights unresolved; absolute action timelines |
| bernardo-dragon | Future rideable species | FBX | 107 derived joints; source loader 419 includes helpers | 2 source stacks | PARTIAL source texture paths fail; 2 derived actions deform | NEEDS_TEXTURE_RELINK + NEEDS_LOD | BLOCKED | Bernardo Ferreira Baptista / CC BY 4.0 recorded | 258,960 triangles; UDIM/name mismatch; generic actions need mapping |
| chinese-dragon | Future rideable species | FBX | 180 source helper nodes / 183 derived joints; naming ambiguous | 1 stack; 0 Three source clips | PARTIAL; missing eye texture; 103 derived fragments individually sampled | NEEDS_MATERIAL_FIX + NEEDS_MANUAL_REVIEW | BLOCKED | MAXDESIGN-3D / CC BY 4.0 recorded | 103 fragments are not 103 supplied actions; reconstruct take, relink eyes, verify anchors |
| demon-dragon | Future rideable species | GLB + BLEND | 220 joints; weighted skin | 3 | PASS individual Fly/Idle/Run deformation | READY_GLB + NEEDS_LOD | AUDIT_ONLY | endlessvoidmc / CC BY 4.0 recorded | 312,670 triangles; silhouette/material fit and LOD before gameplay |
| wyvern-animated | Future rideable species | FBX + GLB | 181 GLB joints, 4 skins; FBX 277 hierarchy/helper nodes | 11 | FAIL assembled visual: detached components/bind defects despite changing skins | NEEDS_MANUAL_REVIEW + NEEDS_MATERIAL_FIX | BLOCKED | User supplied Fab package; exact license/creator UNKNOWN | Repair skin/bind and retest all components; optimized copy not promoted |
| wyvern-fishing | Future Dragon; static reference currently | FBX + GLB | 0 usable skin/joints in supplemental GLB | 0 skeletal; FBX 154 object/camera takes | PASS static visual; no skeletal flight proof | NEEDS_MANUAL_REVIEW | BLOCKED | Benoit Gagnier + cebraVFX shark / CC BY 4.0 recorded | 60,304 triangles; requires actual rig/flight motion and removing fishing props for a runtime variant |
| fantastic-village | Sanctuary style anchor | 602 FBX files | No skeletal rig on selected modules | 0 usable skeletal | PASS curated modules after material alias relink | READY_GLB selected subset | INTEGRATED_LOCAL | Tidal Flask Studios; listing Allows usage with AI: No; terms unresolved | Only selected render files; do not load collision/LOD/engine variants together; verify external-use terms |
| fantasy-market | Sanctuary Food Shop | 9 GLB files | Static modular stalls/layout | 0 | PASS V01 source/derived and functional Food Shop | READY_GLB selected V01 | INTEGRATED_LOCAL | User supplied Fab package; exact license/creator UNKNOWN | README count differs from actual instances; other stalls unpromoted; usage verification pending |
| fantasy-castle | Sanctuary landmark candidate | FBX | Static; no usable skeleton | 0 | PARTIAL black source material; derived relink comparison available | NEEDS_MATERIAL_FIX + NEEDS_LOD | AUDIT_ONLY | Hawtor Studio / CC BY 4.0 recorded | 254,997 binary/export triangles vs 254,988 Three triangulation; huge texture output, split landmark |
| grand-fantasy-castle | Sanctuary landmark candidate | GLB | Static single mesh | 0 | PASS appearance, excessive density | NEEDS_LOD + NEEDS_OPTIMIZATION | AUDIT_ONLY | Hamanzz / CC BY 4.0 recorded | 1,981,608 triangles in one mesh; manual splitting and silhouette-preserving LOD |
| medieval-village-scene | Sanctuary secondary set | FBX | Static scene; no usable skeleton | 0 skeletal | PARTIAL source atlas dependency mismatch; derived preview available | NEEDS_TEXTURE_RELINK + NEEDS_LOD | AUDIT_ONLY | Speed / CC BY 4.0 recorded | 255,453 triangles / 36 meshes; source filename differs from requested atlas |
| medieval-village-houses | Outskirts building reference | GLB + OBJ | Static 12 meshes | 0 | PASS appearance; very dense | NEEDS_LOD + NEEDS_OPTIMIZATION | AUDIT_ONLY | Abid7465 / CC BY 4.0 recorded | 945,316 triangles; separate houses and lightweight collisions before placement |
| sky-temple | Future region reference | GLB + DAE | Static 69 meshes | 0 | PASS GLB appearance | READY_GLB + NEEDS_OPTIMIZATION | AUDIT_ONLY | kylien / CC BY 4.0 recorded | 56,198 triangles; many textures/material draws; no new region authorized |
| stone-pathway | Sanctuary road material | GLTF + BIN + BLEND; PNG/JPG/EXR maps | Static high-poly preview only | 0 | PASS source preview and actual runtime material | READY_GLTF maps; READY runtime material | INTEGRATED_LOCAL | Amal Kumar / Poly Haven CC0 recorded | 107,390-triangle preview excluded; correct 16-bit AO normalization; no blanket displacement |

## Actual representative file costs

These are chosen source files, not the optimized runtime or the sum of pack alternatives. External texture count covers each source folder (including duplicates/alternate maps); embedded image count covers the chosen GLB/GLTF. FBX hierarchy counts include helpers.

| Asset | Chosen source file | Source bytes | Scene triangles | Mesh instances / objects | Materials | External image files | Embedded images | Joints / hierarchy | Weight entries |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| stylized-cartoon-boy | FBX/Frank.fbx | 17,839,184 | 66130 | 16 | 20 | 44 | 0 | 101 | 64637 |
| traveler | traveler.glb | 11,588,188 | 12118 | 1 | 1 | 4 | 3 | 45 | 10710 |
| knight-of-tomorrow | source/Knight_Done.glb | 10,378,356 | 65502 | 3 | 2 | 2 | 2 | 120 | 66641 |
| horse | source/HORSE_DEMO.fbx | 23,507,740 | 82426 | 1 | 5 | 5 | 0 | 676 | 164805 |
| mountain-dragon | source/MOUNTAIN_DRAGON_ANIMATIONS.glb | 64,285,316 | 20460 | 1 | 1 | 5 | 5 | 95 | 51418 |
| tarisland-dragon | M_B_44_Qishilong_skin_Skeleton.FBX | 118,671,952 | 40437 | 1 | 2 | 12 | 0 | 155 | 49575 |
| bernardo-dragon | source/Dragon_Animated.fbx | 10,578,220 | 258960 | 14 | 9 | 25 | 0 | 107 | 302837 |
| chinese-dragon | source/Chinese dragon.fbx | 34,422,016 | 50553 | 1 | 2 | 3 | 0 | 180 | 63104 |
| demon-dragon | demon_dragon_full_texture.glb | 31,748,408 | 312670 | 3 | 1 | 6 | 2 | 220 | 406105 |
| wyvern-animated | wyvern_animated.glb | 53,622,968 | 28706 | 6 | 4 | 5 | 5 | 181 | 33960 |
| wyvern-fishing | wyvern_fishing.glb | 18,332,548 | 60304 | 9 | 9 | 19 | 19 | 0 | 0 |
| fantastic-village | 3d/buildings/SM_BLD_body_v01_01.fbx | 100,012 | 1708 | 1 | 4 | 79 | 0 | 0 | 0 |
| fantasy-market | Fantasy_Vendor_Market_Free_8_Stall_Kit_Full_Layout.glb | 17,472,668 | 115240 | 384 | 26 | 0 | 52 | 0 | 0 |
| fantasy-castle | Castle.fbx | 7,673,068 | 254997 | 1 | 7 | 34 | 0 | 0 | 0 |
| grand-fantasy-castle | source/Hi3D_Stylized Victorian Chateau Hotel 3D Model_allparts_20260917.glb | 73,888,116 | 1981608 | 1 | 1 | 3 | 2 | 0 | 0 |
| medieval-village-scene | source/Scene.fbx | 8,301,840 | 255453 | 36 | 2 | 6 | 0 | 0 | 0 |
| medieval-village-houses | medieval_village_houses_3d_model.glb | 40,176,848 | 945316 | 12 | 1 | 0 | 0 | 0 | 0 |
| sky-temple | fantasy_environment.glb | 52,072,024 | 56198 | 69 | 9 | 94 | 30 | 0 | 0 |
| stone-pathway | stone_pathway_4k.gltf | 2,788 | 107390 | 1 | 1 | 8 | 3 | 0 | 0 |

## Measurement and inspection limits

The binary auditor records model file/hash/size, geometry, scene instances, materials, image dimensions/bit depth, external dependencies, skin weights, joints, exact animation names/targets and morphs in `ASSET_WORK/reports/source-audit.json`. FBX helper node counts differ from weighted joints; unresolved anatomy is UNKNOWN. Bind bounds and sampled animation bounds are labelled separately. Large packs were catalogued in full and visually sampled by representative render modules; all 602 files were not placed or visually inspected simultaneously. Non-GLB editable formats are preserved and their unmeasured properties remain UNKNOWN.

Three.js can report a different triangulation of FBX polygons from the binary polygon count (Frank 66,108 vs 66,130; Castle 254,988 vs 254,997). The runtime Cartoon Boy has 62,810 triangles after excluding its optional skateboard; the source is untouched. LOD/collision/Unreal/Unity variants are alternate files, not concurrent geometry. Fantasy Market's actual full-layout scene is 115,240 triangles and 384 mesh instances; its README claims 54,952 triangles / 28,400 vertices. That claim is not used as a budget. The integrated V01 stall is 10,408 triangles / 35 instances.

The dev Asset Lab provides GLB/GLTF/FBX, safe texture relinking, source/derived variants, framing, orbit, bounds, wireframe, skeleton, exact clip selection, play/pause/speed, metrics and errors. FBX absolute key times are normalized on cloned preview clips; original files never change. This corrects apparent cumulative durations on Tarisland. Cached bind-pose culling is disabled for skinned lab models so root motion remains visible. Production has no raw source middleware or Asset Lab entry.

## Player, NPC and ambient findings

Frank.fbx contains 16 mesh objects, 15 skins, 198 clusters, 64,637 weight entries, 100 LimbNode bones plus a metadata root, 75 morph channels and zero clips. Direct source loading detached facial/clothing parts; the first Blender export also mismatched mesh bind scales. The final derivative rebuilds a canonical skeleton from original cluster TransformLink/Transform matrices and remaps every vertex and morph with original weights. Head/facial binds and left-leg twist/share locations are repaired. All 75 distinct exported target names and 100 hierarchy joints survive; 483 primitive-level targets include duplicates across material splits. Optional Skate_Board is omitted only from the derivative. Runtime maps are at most 1K, PBR relinked, roughness/metal defaults documented by repair-player.py. No baked animation was fabricated: movement is authored against this rig in CartoonBoy/RigPose.

Idle, walk/run/sprint, jump/fall/landing, interact/carry, mount/seated/dismount use authored pose transitions. Mount/dismount inherit actual transform ownership; their transitions are not separate source clips. Clothing, eyes, front/side/back and gameplay silhouettes were inspected. Dedicated cinematic transitions, facial animation, cloth and final gait polishing remain future work. Traveler has one `Walk` clip and Knight one `Action.001`; both deform and remain future NPC content, with no new service. Horse has only the two supplied demo clips and remains ambient-only.

## Exact Dragon clips and rig evidence

| Dragon | Exact clip / take | Measured duration | Playback action classification | Evidence / limit |
| --- | --- | --- | --- | --- |
| mountain-dragon | Take 001 | 96.766998 s | Other / unsplit montage | Skin samples changed |
| demon-dragon | flying_skeletal.3 | 13.125000 s | Fly | Skin samples changed |
| demon-dragon | idle_skeletal.3 | 12.416667 s | Idle | Skin samples changed |
| demon-dragon | running_skeletal.3 | 9.958333 s | Run | Skin samples changed |
| wyvern-animated | idol.001 | 16.416666 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | walk | 1.916667 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | walk.001 | 3.125000 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | flaping | 1.875000 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | take off | 4.625000 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | metarigidol | 16.416666 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | metarigflaping | 2.416667 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | metarigflying | 7.875000 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | metarigtake off | 4.625000 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | metarigwalk | 2.041667 s | UNKNOWN — assembly defect | Skin samples changed |
| wyvern-animated | Cube.002flying | 7.875000 s | UNKNOWN — assembly defect | No change at sampled vertices; track targets require review |
| tarisland-dragon | Qishilong_attack01 | 6.400000 s | Attack | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_attack02 | 6.500000 s | Attack | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_CG3_SC01_C03_DH | 5.666667 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_die | 7.400002 s | Death | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_down | 1.799999 s | Land | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_down01 | 1.800001 s | Land | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_down_dz | 1.800001 s | Land | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_fly2 | 36.633331 s | Fly | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_SC01C11_B_CG3_DH | 5.033333 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill02 | 5.699997 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill05 | 2.833336 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill06 | 5.599998 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill06_dz | 5.599998 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill07 | 3.133339 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill08 | 1.666664 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill09 | 5.599998 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill10 | 5.666672 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill10_dz | 5.666664 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_skill11 | 2.900002 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_stand | 3.333336 s | Idle | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_taitou_02_12_DH | 6.000000 s | Other / UNKNOWN cinematic or skill | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_turnleft | 1.000000 s | Other — turn | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_turnright | 1.000000 s | Other — turn | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_up | 1.500000 s | Takeoff | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_up01 | 1.500000 s | Takeoff | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_up_dz | 1.500000 s | Takeoff | All three time samples tested; skin changed |
| tarisland-dragon | Qishilong_walk | 1.733322 s | Walk | All three time samples tested; skin changed |
| bernardo-dragon | Armature\|Anim_Layer | 5.000000 s | UNKNOWN — generic derived action | Source stacks Base_Layer / Anim_Layer; Three source exposes 0 |
| bernardo-dragon | Armature\|Base_Layer | 5.000000 s | UNKNOWN — generic derived action | Source stacks Base_Layer / Anim_Layer; Three source exposes 0 |
| chinese-dragon | Take 001 | UNKNOWN coherent source duration | UNKNOWN | One source stack; Three exposes 0; Blender emits 103 fragments (not source actions) |
| wyvern-fishing | No usable skeletal clip | — | Static | 154 object/camera FBX takes listed in raw audit; GLB 0 skin / 0 clips |

Mountain's source accessor span is 96.766670 s; the cloned normalized Three preview is 96.766998 s due to a tiny negative start key. `Take 001` is one supplied montage, not separate named Fly/Idle/Land clips. The original clip is preserved byte-for-byte. Runtime freezes a usable rest at t=4 and authors local wing/gait/head/tail/banking motion; animation never drives the physics root. Bones include Pelvis_03, Head_010, WingR_Arm_012 / Forearm_013, WingL_Arm_024 / Forearm_025, R/L thighs and feet, Tail_083 through its segments. Rider anchor follows the pelvis; independent carried-egg anchors follow right and left feet. Scale is 0.009 after measured source bounds, +Y up, source +Z forward rotated to game -Z. All action names and runtime state names are separate concepts.

Tarisland's 27 source takes all deform after normalization; e.g. fly2 keys span 31.600000–68.233330, making the action 36.633330 s rather than the loader's cumulative end timestamp. Cinematics, skills and root-motion tracks still need trimming/mapping, not a combat implementation. Export stalled in Blender and was terminated without source changes; no successful production GLB is claimed. Wyvern Animated contains real weights and actions but its downloaded assembly visibly separates parts. Bernardo source missing paths and Chinese eye path are actionable unresolved dependencies. Chinese helper-based names require anatomy mapping; jaw/wing suitability and carry anchors remain UNKNOWN until repaired. Wyvern Fishing has no proven flight-ready skeleton.

No downloaded species receives finalized rarity/element from its appearance. Mountain temporarily represents the existing owned Nature Young record; all seven species remain intended future obtainable/rideable candidates after readiness work. Baby remains explicitly procedural and unrideable because no appropriate matching Baby was supplied. Guardians retain their existing visuals and chase logic.

## Environment and road findings

FANTASTIC Village's selected body/body2, wooden watchtower, flag and cart were compared against source under neutral lighting after T_wood_03/T_wall_02 alias and normal/albedo relinking. Eleven houses/service buildings, one V01 Food Shop, two towers, two flags and one cart are visible in the actual city. Existing terraces, fountain, bridge, stairs, landing spaces and stone edging preserve the route composition. Large castles/villages are not inserted wholesale. Their splitting/LOD and material issues are listed above; Sky Temple stays a future-region reference.

Stone maps are all 4096×4096: diffuse JPG 8-bit, Normal GL JPG 8-bit and EXR HALF RGB 16-bit, ARM JPG 8-bit (AO R, roughness G, metallic B), AO PNG 16-bit, height PNG 16-bit and EXR HALF Y 16-bit, roughness EXR HALF Y 16-bit. Four runtime 1024×1024 JPEGs use albedo, Normal GL, standalone AO and extracted ARM G roughness. The AO derivative divides 16-bit samples by 257 before 8-bit quantization, avoiding the clipped-white direct PIL conversion. Seven road planes are 14 triangles with tiled maps, UV support, existing edge stones and no height displacement. Near: normal/AO with edge details; mid: same tiled material; far: plain low-detail terrain/material until a measured LOD need arises. The 107,390-triangle GLTF preview sphere is only in the lab.

## Evidence and reusable tools

Bulk evidence lives in ignored ASSET_WORK: source-audit.json, source-hashes-before/after.json, derived-verification.json, promoted-assets.json, browser-audit JSON, mountain-montage.json, authored-pose-browser.json, gameplay-browser.json, carry-browser.json, resilience-browser.json, production-browser.json and previews/*.png. Windows-long first-batch report was shortened to browser-audit-batch-1.json. Every other asset has front/side/back screenshots when loading succeeds; failures remain errors rather than PASS.

Companion reports: [runtime plan](ASSET_RUNTIME_PLAN.md), [integration evidence](ASSET_INTEGRATION_REPORT.md). The required player-audit.md, npc-audit.md, horse-audit.md, dragon-audit.md, environment-audit.md, road-material-audit.md and conversion-queue.md are generated in ASSET_WORK/reports; the full 602-file fantastic-village-catalog.md is retained there. Tool usage is documented in tools/asset-pipeline/README.md.

## Individual Dragon anatomy and action gaps

Named joints below are inspection clues; a name alone does not prove anatomical weighting, articulation or independent deform control. Source helper/end nodes remain distinct from weighted influences. UNKNOWN is retained for ambiguous generic names and absent jaw evidence. Exact hierarchies, weight counts and sampled bone/vertex transforms are in source-audit.json and browser-audit records. Mountain head/neck/wings/legs/tail are exercised by the gameplay poses; a dedicated jaw/roar system was not implemented. Every unselected species still needs actual rider/carry anchor and required Idle/Walk/Takeoff/Fly/Land action mapping, regardless of supplied clip names.

| Dragon | Wing named clues | Neck | Head | Jaw | Tail | Leg/foot | Weight entries | Morphs | Gameplay gaps / anchors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mountain-dragon | MountainDragon_WingR_Arm_012; MountainDragon_WingR_ForeArm_013; MountainDragon_WingR_Hand_014 | MountainDragon_ Neck_06; MountainDragon_ Neck1_07; MountainDragon_ Neck2_08 | MountainDragon_ Head_010 | UNKNOWN / no unambiguous named joint | MountainDragon_ Ponytail1_011; MountainDragon_ Tail_083; MountainDragon_ Tail1_084 | MountainDragon_ R Thigh_059; MountainDragon_ R Calf_060; MountainDragon_ R Foot_062 | 51418 | 0 | Verified stable pelvis/rider and right/left foot anchors; missing discrete source actions authored |
| tarisland-dragon | UNKNOWN / no unambiguous named joint | Bip001-Neck; Bip001-Neck1; Bip001-Neck2 | Bip001-Head | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | Bip001-L-Thigh; Bip001-L-Calf; Bip001-L-Foot | 49575 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
| bernardo-dragon | Wingfinger_1_L; Wingfinger_2_L; Wing1_L | Neck_2; Neck_1; Neck_Wiggle | Head | UNKNOWN / no unambiguous named joint | Tail_1; Tail_2; Tail_3 | Thighs_L; Shin_L; Foot2_L | 302837 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
| chinese-dragon | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | 63104 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
| demon-dragon | l_wingFlapA_01.90_74; l_wingFlapA_02.91_73; l_wingFlapA_03.92_72 | neck_01.14_58; neck_02.15_57; neck_03.16_56 | head.25_21 | jaw_01.26_8; jaw_02.27_1 | tail_01.183_213; tail_02.184_211; tail_03.185_209 | UNKNOWN / no unambiguous named joint | 406105 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
| wyvern-animated | wingspine4.1.l_099; wingspine4.2.l_0100; wingspine3.1.l_0101 | UNKNOWN / no unambiguous named joint | head_021 | jaw_022 | tail_05; tail.1_06; tail.2_07 | thigh.L_0144; shin.L_0145; foot.L_0146 | 33960 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
| wyvern-fishing | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | UNKNOWN / no unambiguous named joint | 0 | 0 | Not authored/verified for gameplay; action/root-motion mapping and anchors pending |
