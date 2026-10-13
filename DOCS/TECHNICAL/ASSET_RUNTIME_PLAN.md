# Phase 2 runtime plan and final promotion decisions

**Current runtime update — 2026-10-12:** [VISUAL_POLISH_REPORT.md](VISUAL_POLISH_REPORT.md) supersedes the historical decision table/hashes below for active gameplay. Mountain-family10,069,068bytes covers Baby/Young/4Guardians; Traveler/Knight/Horse and Village trees are integrated additions.8/19 groups are used; sources unchanged. Original Phase2 measurements/promotion history remain below, including the preserved comparison Mountain Young file that current Game does not request.

The bounded integration is complete for local play: repaired Cartoon Boy, curated city pieces, Stone Pathway maps and rideable Mountain Young. The whole downloaded library is not production-ready and external release is not cleared by this milestone. Future work listed below is a recommendation, not implemented scope.

## Historical Phase2 decision table

| Asset/Pack | Integrated Now? | Production File | Runtime Size | Actual Animation Count | Main Risk | Required Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| stylized-cartoon-boy | YES | public/assets/models/characters/player/cartoon-boy.glb | 12,120,668 bytes | 0 source | Source bind transforms inconsistent; no baked motion; further pose/art polish | Maintain / profile / polish |
| traveler | NO | — | Not loaded | 1 | Future NPC integration outside scope; no idle/service animation | Future NPC integration outside scope; no idle/service animation |
| knight-of-tomorrow | NO | — | Not loaded | 1 | 65,502 triangles and one generic action; retargeting/action meaning UNKNOWN | 65,502 triangles and one generic action; retargeting/action meaning UNKNOWN |
| horse | NO | — | Not loaded | 2 | 82,426 triangles; noncommercial restriction; never a mount | 82,426 triangles; noncommercial restriction; never a mount |
| mountain-dragon | YES | public/assets/models/dragons/mountain-young.glb | 18,636,276 bytes | 1 | One unsplit take; authored motion; no matching Baby; 18.6 MB load | Maintain / profile / polish |
| tarisland-dragon | NO | — | Not loaded | 27 | Blender export attempt stalled; rights unresolved; absolute action timelines | Blender export attempt stalled; rights unresolved; absolute action timelines |
| bernardo-dragon | NO | — | Not loaded | 2 source stacks | 258,960 triangles; UDIM/name mismatch; generic actions need mapping | 258,960 triangles; UDIM/name mismatch; generic actions need mapping |
| chinese-dragon | NO | — | Not loaded | 1 stack; 0 Three source clips | 103 fragments are not 103 supplied actions; reconstruct take, relink eyes, verify anchors | 103 fragments are not 103 supplied actions; reconstruct take, relink eyes, verify anchors |
| demon-dragon | NO | — | Not loaded | 3 | 312,670 triangles; silhouette/material fit and LOD before gameplay | 312,670 triangles; silhouette/material fit and LOD before gameplay |
| wyvern-animated | NO | — | Not loaded | 11 | Repair skin/bind and retest all components; optimized copy not promoted | Repair skin/bind and retest all components; optimized copy not promoted |
| wyvern-fishing | NO | — | Not loaded | 0 skeletal; FBX 154 object/camera takes | 60,304 triangles; requires actual rig/flight motion and removing fishing props for a runtime variant | 60,304 triangles; requires actual rig/flight motion and removing fishing props for a runtime variant |
| fantastic-village | YES | public/assets/models/environment/sanctuary/village-body.glb<br>public/assets/models/environment/sanctuary/village-body2.glb<br>public/assets/models/environment/sanctuary/village-tower.glb<br>public/assets/models/environment/sanctuary/village-flag.glb<br>public/assets/models/environment/sanctuary/village-cart.glb | 5,922,164 bytes | 0 usable skeletal | Only selected render files; do not load collision/LOD/engine variants together; verify external-use terms | Maintain / profile / polish |
| fantasy-market | YES | public/assets/models/environment/sanctuary/market-stall.glb | 842,844 bytes | 0 | README count differs from actual instances; other stalls unpromoted; usage verification pending | Maintain / profile / polish |
| fantasy-castle | NO | — | Not loaded | 0 | 254,997 binary/export triangles vs 254,988 Three triangulation; huge texture output, split landmark | 254,997 binary/export triangles vs 254,988 Three triangulation; huge texture output, split landmark |
| grand-fantasy-castle | NO | — | Not loaded | 0 | 1,981,608 triangles in one mesh; manual splitting and silhouette-preserving LOD | 1,981,608 triangles in one mesh; manual splitting and silhouette-preserving LOD |
| medieval-village-scene | NO | — | Not loaded | 0 skeletal | 255,453 triangles / 36 meshes; source filename differs from requested atlas | 255,453 triangles / 36 meshes; source filename differs from requested atlas |
| medieval-village-houses | NO | — | Not loaded | 0 | 945,316 triangles; separate houses and lightweight collisions before placement | 945,316 triangles; separate houses and lightweight collisions before placement |
| sky-temple | NO | — | Not loaded | 0 | 56,198 triangles; many textures/material draws; no new region authorized | 56,198 triangles; many textures/material draws; no new region authorized |
| stone-pathway | YES | public/assets/textures/materials/roads/stone-pathway-albedo.jpg<br>public/assets/textures/materials/roads/stone-pathway-normal.jpg<br>public/assets/textures/materials/roads/stone-pathway-roughness.jpg<br>public/assets/textures/materials/roads/stone-pathway-ao.jpg | 1,208,504 bytes | 0 | 107,390-triangle preview excluded; correct 16-bit AO normalization; no blanket displacement | Maintain / profile / polish |

## Promoted outputs and exact hashes

| Output | Bytes | SHA-256 | Working derivative |
| --- | --- | --- | --- |
| public/assets/models/characters/player/cartoon-boy.glb | 12,120,668 | b8e264363fe4924ea8096338431b218cd17e714f1460663714f7d5445d370860 | ASSET_WORK/characters/cartoon-boy-runtime.glb |
| public/assets/models/dragons/mountain-young.glb | 18,636,276 | d83ce4ec7f3090f3166791ed2c5f1687d82e6e8a54fd0d0ba6a12a53a1520ca4 | ASSET_WORK/dragons/mountain.glb |
| public/assets/models/environment/sanctuary/market-stall.glb | 842,844 | b422f347eeb0f3678ce2fc5b7c75ff6127fe7ba85fc3da681deff22862c79026 | ASSET_WORK/environment/market-stall.glb |
| public/assets/models/environment/sanctuary/village-body.glb | 1,550,668 | b3dd8b3540769b38019e68871c0b2721c2c6febde74d0ff58ce5027f58d37e2a | ASSET_WORK/environment/village-body-runtime.glb |
| public/assets/models/environment/sanctuary/village-body2.glb | 1,682,488 | c396180a431ad847314b9fe675f737a3032cf3d7842bafbccc70b0558dc579bf | ASSET_WORK/environment/village-body2-runtime.glb |
| public/assets/models/environment/sanctuary/village-tower.glb | 521,716 | 63db467a6658be849d310df015fd79a0f941615a38f064de90a5bbb07ff01ada | ASSET_WORK/environment/village-tower-runtime.glb |
| public/assets/models/environment/sanctuary/village-flag.glb | 1,314,712 | 67f0be2ed0cc9c80547f1898e1b094ac6f8cb070c4e4f1a2133b8341abd3f467 | ASSET_WORK/environment/village-flag-runtime.glb |
| public/assets/models/environment/sanctuary/village-cart.glb | 852,580 | 3bdaf4b1ff7c1a492bf487e903a06ec5e155f8603152899b46299fb2fc883791 | ASSET_WORK/environment/village-cart-runtime.glb |
| public/assets/textures/materials/roads/stone-pathway-albedo.jpg | 290,337 | 4e972bc399d05f9b833ac8f8a36d26c46e9fa170615ee5c73caf3c33503e96c2 | ASSET_WORK/materials/stone-pathway-albedo.jpg |
| public/assets/textures/materials/roads/stone-pathway-normal.jpg | 362,417 | 677c17692806dc369217ecc90ed90e081d2211bdec4ee587c1796f6da8ef083a | ASSET_WORK/materials/stone-pathway-normal.jpg |
| public/assets/textures/materials/roads/stone-pathway-roughness.jpg | 223,773 | b817a0ee290d836f37629b6faec4771fac13d2a053785a816424e72a29a0cfe9 | ASSET_WORK/materials/stone-pathway-roughness.jpg |
| public/assets/textures/materials/roads/stone-pathway-ao.jpg | 331,977 | 3408400d55ca4174f04bdc802c076b59c6f1c3b4412f26cd0c5eb2c4ad62722a | ASSET_WORK/materials/stone-pathway-ao.jpg |

Twelve files total 38,730,456 bytes; historical Nature GLB is additional preserved content and never requested by Game. No failed exports are in this table.

## Canonical sources

| Output | Canonical source | Source SHA-256 |
| --- | --- | --- |
| public/assets/models/characters/player/cartoon-boy.glb | SOURCE_ASSETS/characters/player/stylized-cartoon-boy/FBX/Frank.fbx | 52bc354a7400580d4c99c3dd91511485f76f163c37be3faefddc21f03004eeef |
| public/assets/models/dragons/mountain-young.glb | SOURCE_ASSETS/dragons/mountain-dragon/source/MOUNTAIN_DRAGON_ANIMATIONS.glb | e2e90b8e349b38081a59cd70d598eeaddc7a16fb9e2db3c9e7e15bc65c9b6ca5 |
| public/assets/models/environment/sanctuary/market-stall.glb | SOURCE_ASSETS/environment/sanctuary/fantasy-market/Fantasy_Vendor_Market_Free_8_Stall_Kit_V01.glb | 8e768685e240f025c91647e21fbf25432382e3f62ea249c526f46db31d27aefd |
| public/assets/models/environment/sanctuary/village-body.glb | SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/buildings/SM_BLD_body_v01_01.fbx | 37888d7764f47464ec51579ee5f0def9d589c67248cc1a4d04879b699d430968 |
| public/assets/models/environment/sanctuary/village-body2.glb | SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/buildings/SM_BLD_body_v02_01.fbx | 18b0eaadf8add6a32ef033221cbf486b266007ebe0ae3a36fd6faad8957108b4 |
| public/assets/models/environment/sanctuary/village-tower.glb | SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/props/SM_PROP_watchtower_wood_01.fbx | 33abe99d42b87981dd639ce168a7229bc5e0f0a3e838d209a17a60c6aaaf126f |
| public/assets/models/environment/sanctuary/village-flag.glb | SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/props/SM_PROP_flag_01.fbx | 9df733d5375a3ae11e47c0b0aeb1f75df205173e8ab6b305e5a923cfc5b66eee |
| public/assets/models/environment/sanctuary/village-cart.glb | SOURCE_ASSETS/environment/sanctuary/fantastic-village/3d/props/SM_PROP_cart_01.fbx | b530bba979225d1d1282548d66b34f16eb2aef28e633710ba1508b3bf1f81dd6 |
| public/assets/textures/materials/roads/stone-pathway-albedo.jpg | SOURCE_ASSETS/materials/roads/stone-pathway/textures/stone_pathway_diff_4k.jpg | 944272bff1cf3c18926c9f91fdb1be5cd5e73796eaa3cf2d6c825b8bd3b5cf14 |
| public/assets/textures/materials/roads/stone-pathway-normal.jpg | SOURCE_ASSETS/materials/roads/stone-pathway/textures/stone_pathway_nor_gl_4k.jpg | 56554bd2fa32264bdf2adc498f66c4707569b490cd5fa700126763a9a43ee20f |
| public/assets/textures/materials/roads/stone-pathway-roughness.jpg | SOURCE_ASSETS/materials/roads/stone-pathway/textures/stone_pathway_arm_4k.jpg | bf2cd673297429b41919f0dcbd40bc7157652911865c83ad5fbf0242b94eb215 |
| public/assets/textures/materials/roads/stone-pathway-ao.jpg | SOURCE_ASSETS/materials/roads/stone-pathway/textures/stone_pathway_ao_4k.png | ac6753e84940486507aa8863e4c3691d1bf62ff6ede1ee3d639ad05b32dbe7a6 |

## Conversion and ownership

Blender 4.5.4 LTS is installed; no desktop software was installed. Node 20.19.3 / npm 10.8.2 / Python 3.10 + Pillow/numpy and existing Three loaders provide inspection. @types/node is the only lightweight added development type dependency (for safe Vite middleware); no runtime framework/decoder was added. Version checks did not invoke package downloads.

Player: repair-player.py imports original FBX into memory, repairs canonical mesh binds, preserves skin/morph keys and relinks original textures; exports GLB with no animations, +Y up and at most 1K working images. prepare.optimize_glb repacks embedded images (JPEG quality 90 / PNG when alpha exists) without changing non-image buffers. Mountain uses the supplied GLB, preserves 20,460 triangles / 95 joints / 2 skins / Take 001 and downsizes embedded maps to at most 2K: 64,285,316 → 18,636,276 bytes. Player repaired GLB → final 12,120,668 bytes. V01 Market 4,499,412 → 842,844 bytes with at most 1K maps; 10,408 triangles unchanged. Village exports retain separate modular meshes, +Y up, relink base-color/normal aliases, at most 1K maps; no giant merged city. Road maps use 1K JPEG quality 93, roughness ARM G and normalized 16-bit AO. Exact settings and image changes are in *.conversion.json next to intermediates and the scripts.

No animation tracks, required skin or morphs were stripped for compression. Meshopt/KTX2/Draco are not enabled because verified runtime decoders are absent and measured texture cost dominates these selected files. Geometry is unchanged by image optimization; verify-derived.py asserts all non-image buffer views and nodes/meshes/skins/animations/accessors identical. It also verifies player morph target names and AO dynamic range. Unused optional skateboard is the one documented player prop omission.

RuntimeAssets owns shared template geometry/materials/textures and creates SkeletonUtils clones with independent bones/skeleton textures. Concurrent requests share one load. Instances release only their own skeletons; cache teardown releases shared resources once, including late fulfilled loads; failed loads can retry. Game keeps physics roots and stable mount/carry groups outside animated source roots. Roads wait for every texture result before cleaning up failed/late loads.

Runtime destinations exist for models/characters/{player,npc}, models/dragons, models/creatures/ambient, models/environment/{sanctuary,outskirts,regions}, textures/{characters,dragons,environment,materials/roads}. Existing audio/fonts/images/vfx and historical files are preserved. Initial Phase 2 derivative copies were moved to these destinations after exact hash verification; source files never moved.

## Recommended Phase 3 order

1. Confirm recorded package usage terms for Village/Market/player and Tarisland before any public release; retain creator attribution. No legal readiness inferred from local integration.
2. Profile physical mobile devices; reduce startup texture residency/draw calls with shared atlases, selective city streaming and appropriate LOD; code-split the >500 kB script. Improve Cartoon Boy gait/landing/mount transitions and dedicated matching Baby art; refine saddle/talon grasp.
3. Repair Wyvern Animated bind assembly and Chinese eye/take export; resolve Bernardo UDIM aliases and author screen-coverage LOD for Bernardo/Demon. Keep hero silhouettes and compare visually.
4. Stabilize Tarisland export/action root-motion mappings only after usage terms are settled. Rig a purpose-built Wyvern Fishing gameplay variant if selected, without claiming its camera takes are a rig.
5. Split and LOD dense village/castle scenes before measured environment additions; prepare Traveler/Knight for future authorized NPC scope. No quests, services, regions, combat, Adult progression or horse riding added now.
