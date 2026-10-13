# MONSTER WORLD — PHASE 2 MASTER PROMPT
## Asset Audit, Visual QA, Conversion, Optimization & Playable Integration

You are the technical 3D asset pipeline and integration agent for my existing Monster World browser game. The stack is Three.js, Vite, TypeScript, and HTML/CSS.

The downloaded assets must now become useful in the actual game. This authorization covers two ordered stages within Phase 2:

**Stage A:** audit all downloaded assets, inspect them visually, and prepare a verified runtime library.

**Stage B:** integrate validated assets into the playable MVP: the main player, a curated Sanctuary environment, road materials, and at least one downloaded Dragon used in the rideable gameplay flow.

Do not stop at reports or an Asset Lab. Do not blindly replace everything. Validate each asset before integration, preserve working gameplay, and report any blocked deliverable as incomplete.

## 0. Project and governing documents

Project root:

`C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World`

Before editing, read:

- `MASTER_GAME_SPEC.md`, `AGENTS.md`, `README.md`, and `ASSET_MANIFEST.md`.
- `TASKS/README.md` and `TASK_MVP_AUTONOMOUS_BUILD_REPORT.md`.
- `DOCS/TECHNICAL/ARCHITECTURE.md`, `ASSET_PIPELINE.md`, `ASSET_ACQUISITION_REPORT.md`, `INPUT_AND_CONTROLS.md`, and `SAVE_SYSTEM.md`.
- Relevant world, Dragon, gameplay, Guardian, and DATA documents before touching those systems.
- Every available `SOURCE_ASSETS/**/ASSET_INFO.md`, `INSPECTION.json`, and `SOURCE_FILE_VERIFICATION.json`.
- `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\MONSTER_WORLD_ASSET_DOWNLOAD_MASTER_FINAL.md` for exact asset identities, locked roles, and art direction.

The original download-only restrictions describe the completed acquisition phase. This prompt explicitly authorizes validation, preparation, and the bounded integration described here. It supersedes the earlier `PROMPTS/MONSTER_WORLD_TASK_06_ASSET_PIPELINE_AND_SANCTUARY.md` proposal. Do not treat audit-only wording from the earlier draft as a reason to stop before integration.

Inspect the actual filesystem, dependencies, Git status, current code, and browser behavior. Trust actual files over conflicting historical reports. Preserve user changes. Write a concise execution plan grounded in this inspection and implement in small verifiable steps within this authorized scope.

## 1. Protect source files and the existing MVP

`SOURCE_ASSETS/` is immutable. Do not delete, rename, overwrite, destructively resave, optimize, downscale, or write new audit outputs into it. Store new results elsewhere. Capture source hashes before work and compare after work.

Original ZIP/RAR archives and redundant Downloads copies were previously removed with explicit user approval after complete extraction verification. Their absence is expected. Do not recreate or re-download archives merely because they are absent.

All 19 approved sources previously passed acquisition. Reuse that evidence and verify the real files; acquisition PASS does not mean visual, animation, runtime, or usage validation has passed.

Do not search for replacement assets or re-download unless corruption/missing required content is established against the acquisition records. Distinguish a conversion-tool limitation from a missing source. Do not modify unrelated Downloads files.

Preserve all existing runtime files, including this exact historical/reference asset:

`public/assets/models/dragons/3d-young-dragon-nature.glb`

Its preservation does not require continuing to display it. Old procedural visuals may serve as temporary loading/error fallbacks or documented unfinished stages; they must not substitute for the required new integrations in the success report.

Do not stage, commit, merge, push, create PRs, rewrite history, change remotes, deploy, or add paid services. Do not migrate frameworks or reintroduce Roblox dependencies.

## 2. Working area and runtime library

Create `ASSET_WORK/` with `characters/`, `dragons/`, `creatures/`, `environment/`, `materials/`, `reports/`, and `previews/` for intermediates, experiments, logs, and comparisons.

Preserve existing ignore rules and ensure project-root `.gitignore` includes `/SOURCE_ASSETS/` and `/ASSET_WORK/`.

Use existing `public/assets/` conventions. Ensure model destinations exist for `characters/player`, `characters/npc`, `dragons`, `creatures/ambient`, and `environment/{sanctuary,outskirts,regions}`. Keep texture destinations for characters, dragons, environment, and `materials/roads`; preserve audio/fonts/images/vfx directories.

Only promote validated derived assets. Use stable names and avoid collisions with existing files. Record source path/hash, conversion settings, output path/hash/size, and dependencies. Keep environment modularity; do not combine a whole pack into one giant scene by default.

## 3. Locked asset roles and art direction

Player: `SOURCE_ASSETS/characters/player/stylized-cartoon-boy/` is the main playable character.

NPCs: `characters/npc/traveler/` is a wandering adventurer; `characters/npc/knight-of-tomorrow/` is a Sanctuary guard/important NPC, possibly a future trainer. Audit both; new NPC services or quest systems are outside this phase.

Audit every Dragon under `SOURCE_ASSETS/dragons/`:

- `mountain-dragon`
- `tarisland-dragon`
- `bernardo-dragon`
- `wyvern-fishing`
- `wyvern-animated`
- `chinese-dragon`
- `demon-dragon`

Selected Dragon species are ultimately intended to be obtainable and rideable, not permanently classified as enemy-only. Mountain and Tarisland are major visual references; reference quality alone does not establish gameplay or usage readiness.

Sanctuary style anchor: `environment/sanctuary/fantastic-village/`.

Also audit `environment/sanctuary/{fantasy-market,medieval-village-scene,fantasy-castle,grand-fantasy-castle}`, `environment/outskirts/medieval-village-houses/`, and `environment/regions/sky-temple/`.

Road source: `materials/roads/stone-pathway/`. Ambient reference: `creatures/ambient/horse/`; audit the horse without introducing riding or non-Dragon gameplay.

Aim for premium stylized fantasy: cartoon/toy-like shapes, coherent semi-realistic materials, attractive geometry, and rich fantasy detail. FANTASTIC Village anchors the style; selected complementary pieces should avoid the appearance of an untouched marketplace template.

Visually inspect actual references before visual work, especially:

- `REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png`
- `REFERENCES/ENVIRONMENT/Player-nest-v1.png`
- `REFERENCES/ENVIRONMENT/Player-nest-services-v1.png`
- `REFERENCES/ENVIRONMENT/World-overview-v1.png`
- `REFERENCES/ENVIRONMENT/Stater-wild-nest-v1.png`
- `REFERENCES/ANIMATION/Dragon-flight-carry-v1.png`
- `REFERENCES/ANIMATION/Guardian-chase-v1.png`

Image prices, timers, or implied mechanics do not override the master specification.

## 4. Discover tools before converting

Check installed Node/npm, Blender, glTF tooling, project dependencies, loaders, and optional compression decoders. Inspect local installations without allowing a version check to silently download packages.

Do not automatically install heavyweight desktop software. A useful lightweight development dependency may be added with a documented reason. Prefer established glTF tooling where appropriate, but do not add tools without need.

If Blender or another required converter is unavailable, continue metadata and visual auditing. Use available GLB/GLTF tooling and Three.js FBXLoader where practical. Mark unresolved conversions `NEEDS_CONVERSION_TOOL`; do not pretend FBX inspection proves successful GLB conversion. Continue independent work and report the precise blocker.

## 5. Reusable, non-destructive auditor

Create documented reusable tooling under `tools/asset-pipeline/`, including audit and glTF inspection scripts. Put bulk generated outputs in `ASSET_WORK/reports/`, outside the source library.

Capture, when reliably measurable: source format/path/size; mesh and primitive counts; unique mesh triangles; scene-instance triangles; material/texture counts; texture dimensions/bit depth; embedded versus external dependencies; joints/skin/weights; animation count, exact names, durations and targets; morph targets; bounds, scale, and axis evidence.

Distinguish helper nodes from deforming joints, render geometry from collision geometry, and LOD variants from concurrently visible geometry. State whether bounds represent a bind pose or sampled animation. Use `UNKNOWN` when inspection cannot establish a fact.

Do not count object/camera takes as proof of skeletal animation. Separate acquisition evidence from new findings and report disagreements.

## 6. Isolated development Asset Lab

Build a separate dev-only harness such as `asset-lab.html`, `src/dev/asset-lab.ts`, and `src/dev/asset-lab.css`, consistent with the existing Vite setup. The main game must neither import nor depend on the lab, and production must not expose raw source directories.

Support GLTFLoader and FBXLoader; provide a neutral ground/background, consistent lighting, orbit camera, automatic framing, asset selector, clip selector, play/pause/speed, bounds/skeleton/wireframe toggles, measured statistics, and actionable load errors.

Resolve external texture paths safely. Compare source and derived variants under the same lighting/camera. On switching assets, release resources and animation state correctly. A broken source must not crash the entire lab or game.

Catalog all assets; preview representative modules for large environment packs rather than loading every pack simultaneously. Test each important character/Dragon from multiple angles and play every available clip individually, with special attention to gameplay actions and deformation.

## 7. Player and NPC audits

Inspect the Cartoon Boy's primary source, skin weights, bone hierarchy, morphs, materials, eyes/clothing, texture mapping, bounds, axes, and actual animations. Existing evidence found `FBX/Frank.fbx`, a rig/morphs, and **zero animation clips**. Verify rather than assume otherwise.

During Stage A, report support for idle/walk/run/sprint/jump/fall/land/interact/carry/mount/mounted/dismount; do not invent existing clips. During Stage B, author or adapt the minimum required motions using the verified rig and available permitted sources. Distinguish authored procedural poses from source clips. Never report a T-pose model as completed character integration.

For Traveler and Knight, inspect rig compatibility, actual clips, texture completeness, visual fit, complexity, and conversion needs. Audit the horse similarly, recording its ambient-only intended role.

Write `player-audit.md`, `npc-audit.md`, and `horse-audit.md` in `ASSET_WORK/reports/`.

## 8. Dragon audits and selection

Audit each Dragon individually: best source, rig/weights, wing/neck/head/jaw/tail/legs, bounds/axes, materials, actual clip names/durations, root motion, morphs, and measured runtime cost.

Classify actions only after playback inspection: Idle, Walk, Run, Takeoff, Fly, Glide, Land, Roar, Attack, Hit, Death, Sleep/Rest, Other, or UNKNOWN. Preserve exact source names. Verify every Tarisland take rather than trusting marketplace claims.

Treat Wyvern Fishing cautiously: previous FBX inspection found many object/camera takes without usable skeletal skinning, while its supplemental GLB was static. Confirm current evidence; do not infer a flight-ready rig from the take count.

Record technical readiness, gameplay readiness, and usage status independently. Preserve known restrictions, including the unresolved Tarisland commercial-use limitation. Do not erase attribution requirements or treat acquisition PASS as usage clearance.

Select at least one verified downloaded Dragon for actual rideable integration based on visual fit, correct deformation, usable flight motion or safely authored missing motion, performance, and documented usage status. Do not automatically assign rarity/element from appearance. Record any temporary mapping to the existing prototype flow without claiming a finalized roster.

Write `ASSET_WORK/reports/dragon-audit.md`. Include stage suitability, required rider/carry anchors, missing actions, and remaining work for every species.

## 9. Environment and material audits

Catalog every environment pack: modularity, scene organization, triangles/materials/textures, scale, actual Three.js appearance, collision suitability, separability, instancing opportunities, and LOD/splitting needs.

For FANTASTIC Village, catalog representative filenames for buildings/towers/walls/gates/bridges, market/support, fences/furniture/carts/food, banners, plants, and other available categories. Do not invent categories absent from the files. Distinguish supplied collision, LOD, and engine-specific variants. Do not interpret totals across all 602 FBX files as one placed scene.

For Fantasy Market, investigate the recorded difference between mesh-definition triangle totals and its README layout claim. Count actual instances before choosing runtime pieces.

For Stone Pathway, identify albedo, Normal GL, roughness, AO, and height/displacement, with formats/resolutions/bit depth. Make a material preview and recommend near/mid/far approaches. Its high-poly material-preview mesh is not the road implementation.

Write `environment-audit.md`, `fantastic-village-catalog.md`, and `road-material-audit.md` in `ASSET_WORK/reports/`.

## 10. Conversion, optimization, and promotion

Choose one canonical source per runtime variant. Use a primary decision plus multiple issue flags: `READY_GLB`, `READY_GLTF`, `NEEDS_FBX_TO_GLB`, `NEEDS_TEXTURE_RELINK`, `NEEDS_MATERIAL_FIX`, `NEEDS_SCALE_FIX`, `NEEDS_AXIS_FIX`, `NEEDS_OPTIMIZATION`, `NEEDS_LOD`, `NEEDS_CONVERSION_TOOL`, `NEEDS_MANUAL_REVIEW`, or `BROKEN`.

Convert without losing required skin weights, rig behavior, animations, materials, or morphs. Compare source/derived playback and appearance before promotion. Failed conversions remain outside production. Record all fixes and differences.

Never degrade source textures. Runtime copies may generally start at 2K for hero characters/Dragons, 1K–2K for NPCs/props, and appropriate lower resolutions for distant assets. These are starting recommendations, not mandatory upscaling or arbitrary degradation. Record resizing and format changes.

Evaluate deduplication, unused-resource cleanup, meshopt, and supported texture compression only when useful. Any compression must work with verified runtime decoders/base URLs. Do not remove animation tracks, break skins, or destroy morphs for smaller numbers.

Measure LOD needs, especially Demon/Bernardo Dragons, Grand Fantasy Castle, Medieval Village Houses, and other large scenes. Preserve hero silhouettes; do not force smaller source meshes up to an arbitrary triangle target. LODs must be visually compared and selected by screen coverage/distance.

Write `ASSET_WORK/reports/conversion-queue.md`. Promote validated outputs into `public/assets` with stable names, including a clearly identified player and selected Dragon. Files for later content may be prepared without being loaded by the main game.

## 11. Stage B — actually use the downloaded assets

After the relevant assets pass Stage A, integrate them incrementally. A lab-only preview, files copied into `public/assets`, or optional showcase outside the gameplay loop do not satisfy this stage.

### Main player

Use Cartoon Boy as the visible controllable player. Preserve the existing movement/physics root, input, collision, save semantics, and mount transform ownership. Correct materials, scale, axes, and foot contact. Provide readable idle, movement, sprint, jump/landing, egg carrying, and mounted poses. Avoid animation-driven drift unless explicitly reconciled with physics.

### Sanctuary

Use curated FANTASTIC Village modules, compatible Market stalls, and Stone Pathway-derived materials in the actual Sanctuary. Create coherent streets/plazas/terraces and a recognizable established Dragon city. Add selected variation rather than dumping whole scenes.

Keep Hatchery, Food Shop, Collection Hall, Rider Hall, and Mount Court discoverable and functional. Preserve gameplay anchors where possible; align collision, interaction volumes, camera clearance, stairs/ramps, landing space, and routes with the rendered geometry. Roads should have material depth and selected lightweight edge/stone detail rather than a flat decal or expensive blanket displacement.

### Downloaded Dragon in the core loop

Replace the visual implementation of at least one playable rideable Dragon with a validated downloaded model. It must be reachable through the existing acquisition/growth flow and support mounting, takeoff, flight/turning, held Boost, landing, and dismounting. Verify rider alignment, carried eggs, wing/body deformation, and transform ownership.

Do not restrict all new Dragons to a Guardian or decorative display. Where suitable, update Guardian visuals using validated assets while keeping its chase logic unchanged. Broader species rollout follows readiness; do not promise all seven fully playable in this bounded milestone.

Baby is not rideable. If a matching Baby model is absent, explicitly document the temporary Baby representation and the art work still required. Merely shrinking a mature model does not prove an anatomically appropriate production Baby. Preserve growth identity and avoid claiming the complete species/stage library is finished.

Old visuals are temporary fallbacks, not the target outcome. If the new player, environment, or rideable Dragon cannot be integrated, report the milestone as partial with exact blockers rather than declaring success after retaining all old visuals.

## 12. Gameplay boundaries and performance

Preserve Explore → Wild Nest → steal Egg → Guardian chase → physical escape to Sanctuary → secure → hatch Baby → feed → grow Young → ride/fly → reach harder nests.

Keep existing world scale/nest travel, Safe Zone behavior, per-slot respawn, capacity rules, rarity/element/stage independence, Coins/Food/upgrades, local save, and held Sprint/Boost controls. No theft-state teleportation and no chase-ending distance leash.

Do not implement combat, city building, new regions, Adult progression, quests, new NPC services, horse mounts, multiplayer, backend, cloud save, or new economy/balance rules. Limit UI changes to necessary loading/error/debug support.

Implement asset caching and safe ownership/disposal; use skeleton-safe cloning where needed. Avoid loading all species/packs at startup. Use lightweight colliders, appropriate shadows, capped DPR, reusable materials, and instancing where suitable.

Measure baseline and final loaded bytes, rendered geometry, draw calls, frame timing, and repeated load/unload behavior under stated conditions. Record hardware/browser/viewport and distinguish emulation from physical-device testing. Do not claim universal performance from one machine.

## 13. Verification, durable reports, and definition of done

Before and after implementation, run the actual package scripts: `npm run typecheck`, `npm test`, and `npm run build`. Report missing scripts honestly. Do meaningful tests for conversion/loading/animation or gameplay regressions; avoid tests that simply repeat implementation details.

Inspect Asset Lab and production game boot in a browser. Check console, network/texture errors, decoder/base-path support, materials, clip playback, and responsive/touch controls. The main production entry must not depend on lab code or raw source access.

Test fresh progress in isolation and save/reload without destroying the user's save. Play through theft, chase, safe delivery, hatch/feed/growth, mount, flight/Boost, landing/dismount, and Sanctuary services. Test failure fallback and inspect the new assets while actually playing. Save before/after and animation screenshots with explicit paths.

Recheck original source hashes and the preserved historical Nature GLB. Update `ASSET_MANIFEST.md` and relevant technical docs to describe actual runtime assets accurately. Register this authorized work in TASKS without rewriting previous milestone history.

Produce durable reports:

- `DOCS/TECHNICAL/ASSET_VALIDATION_REPORT.md`
- `DOCS/TECHNICAL/ASSET_RUNTIME_PLAN.md`
- `DOCS/TECHNICAL/ASSET_INTEGRATION_REPORT.md`

The validation table must include Asset, Role, Source Format, Rig, Actual Clips, Visual QA, Technical Readiness, Gameplay Readiness, Usage Status, and Primary Issues. Use clearly defined readiness labels; pending fixes/conversion are not production-ready.

The final decision table must include Asset/Pack, Integrated Now?, Production File, Runtime Size, Actual Animation Count, Main Risk, and Required Next Action. Distinguish audited, prepared, visually verified, and actually integrated content.

Completion requires all 19 sources audited with honest evidence/unknowns; immutable sources verified; reusable tooling and working Asset Lab; real clip/rig inspection; environment/road catalogues; validated conversions promoted; **new player, Sanctuary assets, and at least one downloaded rideable Dragon functioning in the actual game**; gameplay regression checks and build/tests passing; measured limits and remaining work documented.

Audit may be complete while conversion or integration remains partial. Do not call Phase 2 complete or the entire library production-ready when a required deliverable is blocked. Continue independent work and present the smallest concrete unresolved issue.

Final response: summarize repository safety, audit results for every source, exact Dragon clips and rig findings, environment selection, runtime output paths, actual integrations, assets not promoted and why, measured validation, limitations, and concise Git status. Recommend Phase 3 order based on these findings without implementing new scope.

Begin with repository inspection and baseline verification, then proceed through Stage A and Stage B within this authorization.
