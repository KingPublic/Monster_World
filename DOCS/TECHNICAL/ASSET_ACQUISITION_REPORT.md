# Monster World Asset Acquisition Report

Updated: 2026-10-09T00:18:03+08:00 (Asia/Makassar).

Scope: the 19 exact approved sources in MONSTER_WORLD_ASSET_DOWNLOAD_MASTER_FINAL.md. Source acquisition only; no conversion or gameplay integration.

Later explicit user approval on 2026-10-09 supersedes initial archive preservation: redundant ZIP/RAR archives and Downloads model copies may be removed after complete content verification.

PASS means acquisition and file inspection passed, not production integration or license clearance.

PASS: 19 / PARTIAL: 0 / BLOCKED_MANUAL_DOWNLOAD: 0 / FAILED: 0

| # | Asset | Status | Source Root | Main File | Format | Rig | Animations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Stylized Cartoon Boy Character Rigged | PASS | `SOURCE_ASSETS/characters/player/stylized-cartoon-boy` | `FBX/Frank.fbx` | FBX | YES | 0 |
| 2 | FANTASTIC Village Pack | PASS | `SOURCE_ASSETS/environment/sanctuary/fantastic-village` | `3d/buildings/SM_BLD_balcony_v01_01.fbx` | FBX | NO | 0 |
| 3 | Tarisland Dragon | PASS | `SOURCE_ASSETS/dragons/tarisland-dragon` | `M_B_44_Qishilong_skin_Skeleton.FBX` | FBX | YES | 27 |
| 4 | Mountain Dragon | PASS | `SOURCE_ASSETS/dragons/mountain-dragon` | `source/MOUNTAIN_DRAGON_ANIMATIONS.glb` | GLB | YES | 1 |
| 5 | Stone Pathway | PASS | `SOURCE_ASSETS/materials/roads/stone-pathway` | `stone_pathway_4k.gltf (official material preview mesh; maps are the production source)` | BLEND + GLTF/BIN; JPG/PNG/EXR maps | NO (static material sample) | 0 |
| 6 | Fantasy Market /8 Stalls | PASS | `SOURCE_ASSETS/environment/sanctuary/fantasy-market` | `Fantasy_Vendor_Market_Free_8_Stall_Kit_Full_Layout.glb` | GLB | NO | 0 |
| 7 | Medieval Village Scene | PASS | `SOURCE_ASSETS/environment/sanctuary/medieval-village-scene` | `source/Scene.fbx` | FBX | NO | 1 |
| 8 | Traveler | PASS | `SOURCE_ASSETS/characters/npc/traveler` | `traveler.glb` | BLEND, GLB | YES | 1 |
| 9 | The Knight of Tomorrow | PASS | `SOURCE_ASSETS/characters/npc/knight-of-tomorrow` | `source/Knight_Done.glb` | GLB | YES | 1 |
| 10 | Fantasy Castle | PASS | `SOURCE_ASSETS/environment/sanctuary/fantasy-castle` | `Castle.fbx` | FBX | NO | 0 |
| 11 | Bernardo Dragon | PASS | `SOURCE_ASSETS/dragons/bernardo-dragon` | `source/Dragon_Animated.fbx` | FBX | YES | 2 |
| 12 | Wyvern Fishing | PASS | `SOURCE_ASSETS/dragons/wyvern-fishing` | `source/Sketchfab.fbx` | FBX, GLB | NO | 154 |
| 13 | Wyvern Animated | PASS | `SOURCE_ASSETS/dragons/wyvern-animated` | `source/Wyvern animated.fbx` | FBX, GLB | YES | 11 |
| 14 | Chinese Dragon | PASS | `SOURCE_ASSETS/dragons/chinese-dragon` | `source/Chinese dragon.fbx` | FBX | YES | 1 |
| 15 | Demon Dragon | PASS | `SOURCE_ASSETS/dragons/demon-dragon` | `demon_dragon_full_texture.glb` | BLEND, GLB | YES | 3 |
| 16 | Medieval Village Houses | PASS | `SOURCE_ASSETS/environment/outskirts/medieval-village-houses` | `medieval_village_houses_3d_model.glb` | GLB, OBJ | NO | 0 |
| 17 | Sky Temple / Fantasy Environment | PASS | `SOURCE_ASSETS/environment/regions/sky-temple` | `fantasy_environment.glb` | DAE, GLB | NO | 0 |
| 18 | Grand Fantasy Castle | PASS | `SOURCE_ASSETS/environment/sanctuary/grand-fantasy-castle` | `source/Hi3D_Stylized Victorian Chateau Hotel 3D Model_allparts_20260917.glb` | GLB | NO | 0 |
| 19 | Horse demo | PASS | `SOURCE_ASSETS/creatures/ambient/horse` | `source/HORSE_DEMO.fbx` | FBX | YES | 2 |

## PASS (19)

### Stylized Cartoon Boy Character Rigged

- Exact URL: [Stylized Cartoon Boy Character Rigged](https://www.turbosquid.com/3d-models/stylized-cartoon-boy-character-rigged-3d-1979778)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\characters\player\stylized-cartoon-boy`
- Preferred format: All useful FBX variants and Texture.rar / all textures; OBJ is not primary
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): User supplied FBX.rar and Texture.rar directly in the approved root. Both RARs extracted with existing Windows tar/libarchive; natural FBX/ and Texture/ folders retained. Actual FBX contains 16 meshes, 101 skeleton nodes, 75 morph channels and zero AnimationStacks. One FBX file was supplied, not three separate variants. 44 external images inspected; Maya swatch/cache files preserved as source. Runtime animation/retargeting and texture remapping remain future work.
- Manual action: None for source acquisition. Future conversion, material setup, animation playback and optimization require a separate runtime preparation pass.

- Verification: Final recheck: 53 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Canino 3d. TurboSquid Standard License displayed. FBX.rar and Texture.rar downloaded manually by the user; license acceptance was not performed by the agent.
### FANTASTIC Village Pack

- Exact URL: [FANTASTIC Village Pack](https://www.fab.com/listings/52529a12-e88e-41a0-8834-b87306f20c24)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\sanctuary\fantastic-village`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): User supplied the complete FBX-and-textures ZIP in the approved root. CRC verified and all 602 FBX files plus 79 maps extracted and inspected. Buildings, plants, food, props, collision geometry, vertex-paint variants and supplied LODs retained. One Primary Model entry is a representative piece; total pack figures cover every file and are not a placed scene budget. No Blender source was supplied or needed for acquisition.
- Manual action: None for source acquisition. Future conversion, material setup, animation playback and optimization require a separate runtime preparation pass.

- Verification: Final recheck: 681 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Tidal Flask Studios. Fab source provided manually by the user; license acceptance was not performed by the agent. Listing says Allows usage with AI: No.
### Tarisland Dragon

- Exact URL: [Tarisland Dragon](https://sketchfab.com/3d-models/tarisland-dragon-high-poly-ecf63885166c40e2bbbcdf11cd14e65f)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\tarisland-dragon`
- Preferred format: Original multitake FBX, all textures, all animation data
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Uploader states Tencent owns this game asset and permits only non-commercial PG13 use, despite the generic CC Attribution download label. Rights remain unresolved for a commercial game. Preserve this restriction; acquisition PASS does not clear use.
- Manual action: None for acquisition.

- Verification: Final recheck: 15 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Tencent ownership stated by uploader; creator identity not reverified. Generic CC Attribution label conflicts with uploader non-commercial and PG13-only permission; NOT cleared for commercial use.
### Mountain Dragon

- Exact URL: [Mountain Dragon](https://sketchfab.com/3d-models/mountain-dragon-0a0665396f634b0e9d0872720087f52c)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\mountain-dragon`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  One generic Take 001 exists; individual gameplay actions are UNKNOWN until animation timeline inspection.
- Manual action: None for acquisition.

- Verification: Final recheck: 6 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Alexey. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Stone Pathway

- Exact URL: [Stone Pathway](https://polyhaven.com/a/stone_pathway)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\materials\roads\stone-pathway`
- Preferred format: 4K diffuse, Normal GL, roughness, AO, displacement/height; preserve EXR displacement
- Result: Downloaded 11 original files via the official Poly Haven API: editable BLEND, GLTF/BIN and all supplied dependencies, plus separate AO and EXR displacement maps. No archive was supplied; no conversion, optimization or integration performed. All glTF external dependencies resolve locally.
- Manual action: None for acquisition. Use maps in a later authorized runtime material task.

- Verification: All 11 nonzero files match official sizes and MD5 checksums; SHA-256 recorded. Total 134,877,889 bytes. All eight maps decoded at 4096 x 4096, including three finite float32 EXRs. Compressed BLEND has the expected Zstandard signature; GLTF JSON, buffer lengths, dependency paths and mesh metadata inspected. BLEND internals were not parsed. Blender compression reference: https://docs.blender.org/manual/en/3.0/files/blend/open_save.html Final recheck: 11 nonzero source files; all source SHA-256 hashes saved in SOURCE_FILE_VERIFICATION.json; all supplied ZIPs CRC checked; RAR extraction manifests checked; exact Downloads copies compared where available.
- License / creator: Amal Kumar. CC0: https://polyhaven.com/license
### Fantasy Market /8 Stalls

- Exact URL: [Fantasy Market /8 Stalls](https://www.fab.com/listings/1428ffad-d895-4e1a-a308-af0b30d7277e)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\sanctuary\fantasy-market`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): User supplied fantasy_market_glb.zip in the approved root. CRC verified; full layout GLB plus eight separate stall GLBs and README extracted. Embedded images inspected. Static scenes have zero skins and animations. Full-layout mesh-definition count is 115,240 triangles; README advertises 54,952 for its layout, so this discrepancy needs scene-level review later. Glass/transmission and shared materials require destination rendering checks; no collision/LOD implementation performed.
- Manual action: None for source acquisition. Future conversion, material setup, animation playback and optimization require a separate runtime preparation pass.

- Verification: Final recheck: 10 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Fab/source asset supplied manually by the user; creator identity and exact license terms not independently verified from the supplied package. Acquisition does not assert production rights clearance.
### Medieval Village Scene

- Exact URL: [Medieval Village Scene](https://sketchfab.com/3d-models/medieval-village-scene-5203eda39dcc4eb9a9395efe4c9a4351)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\sanctuary\medieval-village-scene`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here. 
- Manual action: None for acquisition.

- Verification: Final recheck: 7 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Speed. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Traveler

- Exact URL: [Traveler](https://sketchfab.com/3d-models/traveler-f86f5f2a779d496c95c9aca8ba13246f)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\characters\npc\traveler`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original BLEND and the official 2K converted GLB are both preserved. The GLB contains Walk; editable BLEND internals were not parsed.
- Manual action: None for acquisition.

- Verification: Final recheck: 6 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: maxpanysh. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### The Knight of Tomorrow

- Exact URL: [The Knight of Tomorrow](https://sketchfab.com/3d-models/the-knight-of-tomorrow-1a54cac1b89a4c9092f810c59b04f816)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\characters\npc\knight-of-tomorrow`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  One Action.001 clip exists; its gameplay meaning is UNKNOWN. Some skeleton names are ambiguous (DEF_Hand alongside facial bones); humanoid retargeting has not been validated.
- Manual action: None for acquisition.

- Verification: Final recheck: 3 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Kondrashov Anton. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Fantasy Castle

- Exact URL: [Fantasy Castle](https://sketchfab.com/3d-models/fantasy-castle-1b3756460dde44399fd7b9bb3b78127c)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\sanctuary\fantasy-castle`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original nested Castle.rar was safely extracted with the existing Windows libarchive utility; both archives preserved. Listing carries NoAI.
- Manual action: None for acquisition.

- Verification: Final recheck: 35 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Hawtor Studio. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Bernardo Dragon

- Exact URL: [Bernardo Dragon](https://sketchfab.com/3d-models/dragon-07930cb939194d8e88017134e921f373)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\bernardo-dragon`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Two AnimationStacks exist: Base_Layer and Anim_Layer. Their action meaning is UNKNOWN; no renamed gameplay clips invented.
- Manual action: None for acquisition.

- Verification: Final recheck: 26 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Bernardo Ferreira Baptista. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Wyvern Fishing

- Exact URL: [Wyvern Fishing](https://sketchfab.com/3d-models/wyvern-fishing-06c8ebe3d34642e697755a516468315a)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\wyvern-fishing`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 2 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original FBX has 154 object/camera AnimationStacks but zero Skin/Cluster deformers and zero skeleton bones. These are not verified ready skeletal dragon clips. Supplemental official 1K GLB is static (zero skins and animations). Keep FBX for later scene-animation investigation; included shark credit must be retained.
- Manual action: None for acquisition.

- Verification: Final recheck: 21 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Benoit Gagnier; included shark credited to cebraVFX (https://skfb.ly/6JSD8). CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Wyvern Animated

- Exact URL: [Wyvern Animated](https://www.fab.com/listings/d1faa655-b744-40d1-af90-ff8748f4398d)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\wyvern-animated`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): User supplied original FBX-and-textures ZIP and supplemental GLB in the approved root. CRC verified and original files extracted. FBX has 28,706 triangles, 277 skeleton nodes and 11 AnimationStacks; GLB has 181 joints and 11 clips. Skin weights exist in both formats. Helper-node and exporter naming differences preserved; action semantics and visual animation playback require later verification.
- Manual action: None for source acquisition. Future conversion, material setup, animation playback and optimization require a separate runtime preparation pass.

- Verification: Final recheck: 7 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Fab/source asset supplied manually by the user; creator identity and exact license terms not independently verified from the supplied package. Acquisition does not assert production rights clearance.
### Chinese Dragon

- Exact URL: [Chinese Dragon](https://sketchfab.com/3d-models/chinese-dragon-a5ad5ec06f43461f95bb93e95fe7553b)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\chinese-dragon`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  The FBX has 180 skeleton nodes, mostly identically named drgon. Wings/tail/legs/head/jaw mapping cannot be reliably inferred. One generic Take 001 exists.
- Manual action: None for acquisition.

- Verification: Final recheck: 4 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: MAXDESIGN-3D. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Demon Dragon

- Exact URL: [Demon Dragon](https://sketchfab.com/3d-models/demon-dragon-full-texture-19035a72cdcb4abfa2c161de32823e6b)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\dragons\demon-dragon`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original BLEND and the official 2K GLB are preserved. GLB contains flying_skeletal.3, idle_skeletal.3 and running_skeletal.3. BLEND internals remain unparsed. Original BLEND and the official 2K GLB are preserved. GLB contains flying_skeletal.3, idle_skeletal.3 and running_skeletal.3. Natural d_blend/ wrapper retained to preserve editable source references and avoid collisions with differing outer texture files. BLEND internals remain unparsed.
- Manual action: None for acquisition.

- Verification: Final recheck: 8 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: endlessvoidmc. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Medieval Village Houses

- Exact URL: [Medieval Village Houses](https://sketchfab.com/3d-models/medieval-village-houses-3d-model-e1a27498c9b744479d0015a270efd683)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\outskirts\medieval-village-houses`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 2 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original OBJ and official GLB preserved. OBJ has 945,317 triangulated face equivalents; GLB has 945,316 triangles and embedded materials/textures. GLB is preferred for later static runtime preparation.
- Manual action: None for acquisition.

- Verification: Final recheck: 2 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Abid7465. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Sky Temple / Fantasy Environment

- Exact URL: [Sky Temple / Fantasy Environment](https://sketchfab.com/3d-models/fantasy-environment-2920b212d34044fb9e102064e04fed4d)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\regions\sky-temple`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  Original nested DAE and the official 2K GLB preserved. Natural model/ wrapper is retained because model/textures and outer textures contain differing files with the same names. This prevents overwrite and preserves DAE relative references. DAE XML structure/dependencies checked; detailed geometry/skeleton inspection uses the GLB.
- Manual action: None for acquisition.

- Verification: Final recheck: 96 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: kylien. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Grand Fantasy Castle

- Exact URL: [Grand Fantasy Castle](https://sketchfab.com/3d-models/free-fantasy-castle-medieval-game-environment-6d2b1820bbd740c69b3d5bffd4b51976)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\environment\sanctuary\grand-fantasy-castle`
- Preferred format: Full original source / FBX / BLEND / GLB / GLTF plus all textures and modular pieces
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  1,981,608 triangles in one supplied mesh. Heavy simplification and LOD work required in a future task; no current optimization performed.
- Manual action: None for acquisition.

- Verification: Final recheck: 4 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: Hamanzz. CC Attribution 4.0 displayed by Sketchfab: https://creativecommons.org/licenses/by/4.0/
### Horse demo

- Exact URL: [Horse demo](https://sketchfab.com/3d-models/horse-realistic-3d-model-demo-free-65d6a70a6721495f938c93e80a5998e4)
- Exact destination folder: `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World\SOURCE_ASSETS\creatures\ambient\horse`
- Preferred format: Original rigged/animated source; FBX/BLEND plus textures; GLB/GLTF if animations are preserved
- Result: Extracted source models, editable source formats, textures and material dependencies retained and verified. Original and nested ZIP/RAR archives were removed at the explicit user request after every member matched its extracted copy. Initial acquisition/inspection history (archive-preservation statements refer to the initial pass): Original official browser download preserved in the assigned asset root. Archive CRC verified and usable contents extracted into the same root. 1 FBX/GLTF/GLB files inspected; no conversions performed. Browser saves to its standard Downloads location; an unchanged copy is preserved here.  CC Attribution-NonCommercial is displayed. Demo contains exactly Horse|Horse_Idle and Horse|Horse_Walk; full-pack animation advertisements do not describe the downloaded demo. 676 skeleton nodes include many helper/end/corrective nodes, not 676 independent weighted joints.
- Manual action: None for acquisition.

- Verification: Final recheck: 6 retained nonzero source files; model and texture hashes match the pre-cleanup inventory. SHA-256 records in SOURCE_FILE_VERIFICATION.json. Removed archive checksums, every extracted-member comparison and deletion audit are preserved in output/playwright/asset-acquisition/extracted-cleanup-result.json. No source models or textures removed.
- License / creator: WildMesh 3D. CC Attribution-NonCommercial 4.0: https://creativecommons.org/licenses/by-nc/4.0/

## PARTIAL (0)

None.

## BLOCKED_MANUAL_DOWNLOAD (0)

None.

## FAILED (0)

None.

## Ready for future GLB conversion

- Stylized Cartoon Boy Character Rigged: `FBX/Frank.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- FANTASTIC Village Pack: `3d/buildings/SM_BLD_balcony_v01_01.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Tarisland Dragon: `M_B_44_Qishilong_skin_Skeleton.FBX`; preserve original materials, rig and takes. See per-asset limitations.
- Medieval Village Scene: `source/Scene.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Fantasy Castle: `Castle.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Bernardo Dragon: `source/Dragon_Animated.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Wyvern Fishing: `source/Sketchfab.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Wyvern Animated: `source/Wyvern animated.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Chinese Dragon: `source/Chinese dragon.fbx`; preserve original materials, rig and takes. See per-asset limitations.
- Horse demo: `source/HORSE_DEMO.fbx`; preserve original materials, rig and takes. See per-asset limitations.

## Heavy optimization / LOD review

- Fantasy Market /8 Stalls: 115,240 triangles; 384 meshes.
- Medieval Village Scene: 255,453 triangles; 36 meshes.
- Fantasy Castle: 254,997 triangles; 1 meshes.
- Bernardo Dragon: 258,960 triangles; 14 meshes.
- Demon Dragon: 312,670 triangles; 3 meshes.
- Medieval Village Houses: 945,316 triangles; 12 meshes.
- Grand Fantasy Castle: 1,981,608 triangles; 1 meshes.
- Horse: 82,426 triangles but 676 skeleton nodes; rig and texture budget review required. Stone Pathway: 4K maps; preview geometry is not the intended road source.

## Final verification

- All 19 exact approved sources attempted: {'PASS': 19}.
- 1001 nonzero retained source files, 2,352,792,344 bytes total; 0 archives remain. Removed archives were verified before the explicitly approved cleanup.
- ASSET_INFO.md exists in every one of the 19 roots; PASS roots include INSPECTION.json and SOURCE_FILE_VERIFICATION.json.
- All 64 baseline files under src/, tests/, public/assets/ and REFERENCES/ retain their sizes and SHA-256 hashes; no files added to these areas. Empty runtime folders prepared.
- Historical Nature GLB preserved at 5,236,028 bytes, SHA-256 b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615.
- Raw sources ignored, no tracked SOURCE_ASSETS files, staged diff empty, HEAD unchanged; no stage/commit/push performed.
- npm run typecheck: exit 0. npm run build: exit 0, existing >500KB chunk warning. Local production preview booted in the in-app browser at http://127.0.0.1:4173/; Sanctuary welcome screen/canvas present, captured error log empty. Evidence: output/playwright/asset-acquisition/game-boot.png.
- Final git status: M .gitignore; ?? DOCS/TECHNICAL/ASSET_ACQUISITION_REPORT.md
- No conversion, optimization, gameplay integration or source/test edits performed. Browser downloads were copied unchanged from the standard Downloads directory into exact roots.
- Inspection limitations: Blender internals and FBX embedded image pixels were not decoded; anatomical rig bindings and animation playback/action semantics await future visual pipeline inspection. Unknown fields explicitly remain UNKNOWN.
- Initial Downloads cleanup: 14 duplicate archives removed after SHA-256 comparison; 1,140,917,916 bytes reclaimed. Subsequent archive removal, if any, follows the later explicit user request. Audit: output/playwright/asset-acquisition/downloads-cleanup-result.json.
- Explicit user cleanup on 2026-10-09: 31 redundant source archives, duplicate downloaded GLBs and project snapshot removed; 2,249,264,075 additional bytes reclaimed. Every archive member was compared to its extracted copy; all retained models, textures and project files still match. Audit: output/playwright/asset-acquisition/extracted-cleanup-result.json.

## Folder tree

```text
Monster_World/
  SOURCE_ASSETS/
    characters/
      npc/
        knight-of-tomorrow/
          source/
          textures/
        traveler/
          source/
          textures/
      player/
        stylized-cartoon-boy/
          FBX/
          Texture/
    creatures/
      ambient/
        horse/
          source/
          textures/
    dragons/
      bernardo-dragon/
        source/
        textures/
      chinese-dragon/
        source/
        textures/
      demon-dragon/
        d_blend/
          textures/
        source/
        textures/
      mountain-dragon/
        source/
        textures/
      tarisland-dragon/
        source/
        textures/
      wyvern-animated/
        source/
        textures/
      wyvern-fishing/
        source/
        textures/
    environment/
      outskirts/
        medieval-village-houses/
          source/
      regions/
        sky-temple/
          model/
          source/
          textures/
      sanctuary/
        fantastic-village/
          2d/
          3d/
        fantasy-castle/
          source/
          textures/
        fantasy-market/
        grand-fantasy-castle/
          source/
          textures/
        medieval-village-scene/
          source/
          textures/
    materials/
      roads/
        stone-pathway/
          textures/
  public/assets/
    audio/
    fonts/
    images/
    models/
      characters/
        npc/
        player/
      creatures/
        ambient/
      dragons/
      environment/
        outskirts/
        regions/
        sanctuary/
      monsters/
    textures/
      characters/
      dragons/
      environment/
      materials/
        roads/
    vfx/
  Preserved file: public/assets/models/dragons/3d-young-dragon-nature.glb
  DOCS/TECHNICAL/ASSET_ACQUISITION_REPORT.md
```

Raw source folders are ignored by /SOURCE_ASSETS/. Asset source files were not staged, committed, or pushed. The historical Nature GLB remains runtime/reference content, separate from this acquisition list.
