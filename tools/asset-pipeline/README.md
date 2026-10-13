# Phase 2 asset pipeline

Current October12 visual-polish commands/evidence are appended below. Historical Phase2 commands remain for comparison; do not rerun their one-time documentation/promotion scripts over the newer runtime state.

Run commands from the Monster_World root. SOURCE_ASSETS, REFERENCES and the historical Nature GLB are immutable. This tooling writes intermediates/evidence to ignored ASSET_WORK and explicitly curated derivatives to public/assets. No download, Git write or deployment command is part of the pipeline.

Required installed tools: Python 3.10 with Pillow/numpy, Node/npm for the existing project, and Blender 4.5.4 LTS at `C:/Program Files/Blender Foundation/Blender 4.5/blender.exe`. Adjust that converter path if using another machine. Inspection can continue without Blender; unfinished conversions must remain outside production. Browser scripts use the already installed Codex Playwright package and Chromium executable recorded in each script, without adding Playwright as an application dependency; adapt those paths when moving machines.

## Source audit and integrity

```powershell
python tools/asset-pipeline/audit.py snapshot
python tools/asset-pipeline/audit.py audit
python tools/asset-pipeline/audit.py verify
```

`snapshot` is run once and refuses to overwrite an existing baseline. `audit` measures each model/image and embeds all three acquired metadata records per asset; .blend/.obj/.dae properties not independently measured remain UNKNOWN. Binary FBX parsing comes from the previously verified local acquisition inspector, copied into fbx.py; it does not import or mutate sources. `verify` compares exact path/size/SHA-256 inventory and creates source-integrity.json. Full GLB inspection is also importable as `audit.gltf(path)` and used by verify-derived.py.

## Non-destructive preparation

```powershell
python tools/asset-pipeline/prepare.py village
python tools/asset-pipeline/prepare.py glb
python tools/asset-pipeline/prepare.py road
& 'C:/Program Files/Blender Foundation/Blender 4.5/blender.exe' --background --factory-startup --python-exit-code 1 --python tools/asset-pipeline/repair-player.py
```

repair-player.py writes cartoon-boy-repaired.glb. Finish its texture repack with `prepare.optimize_glb('ASSET_WORK/characters/cartoon-boy-repaired.glb','ASSET_WORK/characters/cartoon-boy-runtime.glb',1024)` from Python with tools/asset-pipeline on the import path. Source cluster binds, original weighted vertices and every shape key are mapped into the repaired canonical skeleton. Optional skateboard omission, texture relinking, PBR defaults and axis changes are recorded in its conversion sidecar. inspect-player.py/player-bind-inspect.py provide Blender diagnostics; diagnostic logs are not successful runtime conversions.

`prepare.py fbx` is an experimental work-only batch, **not required for current promotion**: the Tarisland exporter previously stalled and was terminated; it can stall again. Bernardo/Chinese/Horse/Castle/Medieval Scene derivatives are comparison outputs awaiting their listed repairs, never automatically promoted. convert.py writes only the requested ASSET_WORK destination and imports/exports in a fresh Blender process. No .blend source is resaved. optimize_glb resizes/re-encodes embedded images and preserves every non-image buffer; road processing preserves normalized AO range and extracts roughness from ARM G.

```powershell
python tools/asset-pipeline/verify-derived.py
python tools/asset-pipeline/promote.py
```

Promotion is the fixed reviewed 12-file subset, not a scan of all generated GLBs. It records final path/hash/bytes. Verify-derived compares non-image bytes and skin/animation/morph definitions, checks 100 player joints / 75 distinct morph names, and catches clipped-white road AO. align-runtime.py and clean-duplicate-derivatives.py are one-time Phase 2 path migration/cleanup tools, removing only recognized derivative hashes after target verification. update-docs.py is a one-time migration of old active-state descriptions and should not be rerun after those phrases have changed.

## Asset Lab and browser evidence

```powershell
npm run dev -- --port 5174 --strictPort
```

Open `http://127.0.0.1:5174/asset-lab.html`. Select a source or prepared variant, orbit/frame it, enable wire/bounds/skeleton, then select and play each exact clip. Source textures are allowlisted and real-path checked. .gltfbuffer is a read-only alias for .bin to avoid local IDM interception; no source rename is performed. The normal game imports no lab module. Production does not build the lab or expose raw-source middleware.

```powershell
node tools/asset-pipeline/browser-audit.mjs stylized-cartoon-boy mountain-dragon
node tools/asset-pipeline/browser-audit.mjs tarisland-dragon
node tools/asset-pipeline/browser-gameplay.mjs
node tools/asset-pipeline/browser-carry.mjs
node tools/asset-pipeline/browser-poses.mjs
node tools/asset-pipeline/browser-resilience.mjs
node tools/asset-pipeline/browser-walkways.mjs
node tools/asset-pipeline/browser-baseline.mjs
npm run build
npm run preview -- --port 5176 --strictPort
node tools/asset-pipeline/browser-production.mjs
```

Each browser script launches an isolated context. Gameplay writes a save obtained by actually completing the loop; carry/resilience/routes/production reuse that fixture only in other isolated contexts. The user's existing browser save is never cleared or edited. Touch uses Chromium mobile emulation plus actual CDP touch events, not a physical-device claim. A three-Egg pose fixture is separate from real raid evidence. Production measurements wait for complete GLB body timing, not response headers.

For baseline comparison, baseline-copy.py reads HEAD source into ASSET_WORK/baseline-app without checkout/reset; start it directly with `node ../../node_modules/vite/bin/vite.js . --port 5175 --strictPort` from that folder. Do not use npm run dev there, because npm resolves the parent package root. Set GAME_URL to `http://127.0.0.1:5175/?debug=1` and REPORT_LABEL to baseline-paired for browser-baseline.mjs; it rejects an integrated-asset snapshot. Never overwrite the original evidence with a final run. Run baseline/final performance sessions sequentially.

Browser audit JSON includes source/variant URL, dimensions/pose, exact normalized durations and source key range, sampled deformation and actionable dependency errors. Clips with absolute FBX timeline offsets are normalized only in cloned previews; helper counts and source take counts remain distinct. summarize-evidence.py shortens exceptionally long generated report names for Windows readability. qa-sheets.py builds screenshot contact sheets. reports.py generates durable validation/runtime/domain decisions and provenance; integration-report.py consolidates final gameplay/performance evidence. Re-run reports.py after audit.py audit because the latter regenerates the raw Village catalog.

```powershell
npm run typecheck
npm test
npm run build
python tools/asset-pipeline/audit.py verify
python tools/asset-pipeline/reports.py
python tools/asset-pipeline/integration-report.py
```

Do not treat existence of a GLB, a source download PASS, changing vertex samples or a single benchmark as production approval. Compare actual appearance/assembly and every action, preserve usage restrictions, and record failures in the queue.

## October12 visual polish

The authorized follow-up adds matching Dragon forms, garden-city/valley/motion polish and suitable ambient assets. Current decisions and16-file hashes: DOCS/TECHNICAL/VISUAL_POLISH_REPORT.md. Sources stay immutable; previous audit is reused, not repeated. Lab catalog now includes published player/family/Traveler/Knight/Horse/tree variants beside source/prepared comparisons.

Prepare only reviewed derivatives:

```powershell
python tools/asset-pipeline/polish-derivatives.py mountain
python tools/asset-pipeline/polish-derivatives.py ambient
python tools/asset-pipeline/promote-polish.py
python tools/asset-pipeline/verify-polish.py
```

Mountain preparation reads the preserved18.6MB Phase2 derivative, reduces keys with explicit error bounds and fixes actual map indices. Complete montage time span/geometry/skin/nodes remain. Ambient preparation preserves non-image data. Tree preparation used convert.py from the actual SM_ENV_TREE_village.fbx into ASSET_WORK/polish/village-tree.glb, then prepare.optimize_glb to village-tree-runtime.glb at1K; promotion selects LOD0. It retains unreachable alternative LOD buffers. promote-polish.py validates sidecar hashes and writes only the fixed five-file roster, never an arbitrary generated folder. verify-polish.py independently compares non-image bytes/rig definitions and every original family animation key, then records current published hashes. It does not assume reduced animation bytes remain identical.

With dev5174 and local preview5176 running:

```powershell
node tools/asset-pipeline/browser-polish.mjs
node tools/asset-pipeline/browser-polish-city.mjs
node tools/asset-pipeline/browser-polish-carry.mjs
node tools/asset-pipeline/browser-polish-poses.mjs
node tools/asset-pipeline/browser-polish-visuals.mjs
node tools/asset-pipeline/browser-polish-resilience.mjs
npm test
npm run build
node tools/asset-pipeline/browser-polish-production.mjs
python tools/asset-pipeline/audit.py verify
python tools/asset-pipeline/polish-report.py
```

Run production profiling sequentially after other browser tests. It waits for complete model bodies, six seconds of shader/texture warmup and120 rendered frames. Do not merge cold-load stalls into a steady-state FPS claim. All test contexts remain isolated from the user's save. The physical carry loop tests Egg1; three-angle Carry3/family images are explicitly fixtures. Empty valid city models and aborted assets preserve visible/playable fallbacks. Final evidence goes into ASSET_WORK/polish, preserving the historical Phase2 directories. polish-report.py refuses missing/failed required JSON evidence and generates the durable current report, runtime hash manifest, performance summary and contextual comparison images.
