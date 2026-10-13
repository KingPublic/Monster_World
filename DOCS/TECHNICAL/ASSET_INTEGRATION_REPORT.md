# Phase 2 playable asset integration report — finalized 2026-10-11

**Current runtime update — 2026-10-12:** the subsequent user-authorized visual-cohesion pass is documented in [VISUAL_POLISH_REPORT.md](VISUAL_POLISH_REPORT.md). It replaces former procedural Baby/Guardian normal visuals with one matching Mountain family, recomposes the garden-city/valley, improves motion/rider/camera, adds suitable ambient assets, and verifies the new complete loop. Current20/20 tests, build, carried flight, city routes, touch emulation, fallback/lifecycle/source hashes and production checks pass. Measurements/screenshots below remain the historical Phase2 evidence; do not mix their performance/features with the current report.

**Bounded local milestone verified.** All 19 libraries were audited; repaired Cartoon Boy, curated FANTASTIC Village/Market city, Stone Pathway maps and a downloaded Mountain Dragon now function in the core playable loop. This is not completion of every species/stage or external release clearance. Technical/usage blockers remain in the all-source validation and runtime decision tables.

## Actual integrations

- Visible controllable Cartoon Boy: original movement/collision/physics root retained; repaired rig, eyes/clothing/morphs and authored idle/walk/sprint/jump/fall/landing/interact/carry/seated transitions. Source has zero clips. Camera/model transform ownership is separate from source rig animation.
- Sanctuary: eleven Village buildings, one V01 Market Food Shop, two wooden watchtowers, two flags, one cart. Seven road surfaces use four 1K Stone maps with normal/AO/roughness and retained stone edges. Existing service footprints, main stairs, bridges, terraces and landing area remain. Simple colliders fit the selected scaled module bounds; they do not reproduce every ornamental protrusion.
- Downloaded Mountain becomes the actual owned Young visual after stealing, hatching and feeding the original Nature record. Same rarity/element/growth identity; no new balance/species assignment. Mount, takeoff, flight/turning, held Boost, land and dismount were played. Stable pelvis/rider and right/left talon anchors preserve Egg transforms.
- Baby and Guardians remain explicitly procedural. Baby is unrideable and has no matching downloaded production anatomy; dedicated Baby art is future work. Guardians keep alert/chase/return semantics without a distance leash.

## Verification and isolated save

Before implementation: package typecheck/build passed, 8 gameplay tests passed; baseline JS 623.14 kB / gzip 162.50 kB. Final: typecheck and build passed, 11/11 meaningful tests passed. Final JS 726.20 kB / gzip 191.29 kB; CSS 12.38 kB / gzip 3.58 kB. Vite still warns about the >500 kB JS chunk; code splitting remains a performance follow-up. The future native-config import warning was resolved. No lint script was claimed.

Fresh browser progress: move/jump → forest theft → Guardian chase → physical sprint escape → Safe Zone secures one Egg / +50 Coins → Hatchery → unrideable Baby / two free Food → two feeds → downloaded Young ready → mount → ascend / held Boost / turn → land / dismount → Food Shop purchase, Collection Hall and Rider Hall upgrade → save/reload exact state. Development travel was used only to set up unladen locations for individual service checks; a separate physical route check walked through every service area without teleport. Theft-state travel was explicitly rejected. Existing slot cooldown/capacity/economy/save validation regression tests pass.

The recorded physical escape interval was 6.26 s in this test, not a balancing promise. Final isolated save: 5 Coins, 1 Food, one Young Nature Dragon, Speed level 1, tutorial complete. Save JSON is in ASSET_WORK/reports/gameplay-browser.json. New browser contexts preserve the user's existing save. No save schema/migration change. Temporary carried loot remains unsaved.

Real carried-flight test: physical mounted trip to a Wild Nest → land/dismount → steal one Egg → walk/remount → Boost while carrying → physical return and secure. No theft-state teleport. Screenshot/position evidence is in carry-browser.json. Carry 3 was verified separately with actual model/anchors in an isolated 3-Egg visual fixture plus a world-transform regression test; a three-Egg live raid was not claimed. Egg 1 follows rider, Egg 2 right talon, Egg 3 left talon.

Failure test intentionally aborts player, Mountain, one city module and one road map. Explicit fallbacks remain playable, including mounted flight, without page exceptions. Three game teardown/recreate cycles each produce one canvas, one control root, 8 templates / 19 instances, and exactly 232 GPU geometries / 109 textures with Young loaded. Six alternating road/Mountain lab switches retain stable per-asset GPU counts. This measures allocated resource counts, not heap-memory profiling. Texture cleanup waits for all outcomes, and cache tests verify retry/late-load disposal/shared ownership.

Touch: Chromium emulation 390×844 at DPR 2; actual browser touch events drive joystick movement, held sprint, mount, ascend, held Boost, release, descent and dismount. No horizontal page overflow. No physical phone/tablet was tested. Desktop and touch screenshots are explicit below.

Production fresh and saved-Young boots have zero console/page/network errors. Neither window.__MW nor window.__ASSET_LAB exists. Probing /asset-lab.html, /__asset_catalog, /__asset_source/... and /__asset_work/... returns normal SPA fallback HTML, never source bytes or lab code. Only index.html is built. Model bodies fully complete before performance sampling; the earlier header-only measurement was superseded. No additional decoder or paid service.

## Performance under stated conditions

Windows desktop, AMD Ryzen 7 6800H (8 cores / 16 threads), 16,312,721,408 bytes RAM; ANGLE (AMD, AMD RadeonT 680M (0x00001681) Direct3D11 vs_5_0 ps_5_0, D3D11). Headless Chromium, Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36. Viewport 1440×900, DPR 1. Source/final contexts are isolated and measured sequentially with no other active browser test. Baseline is reconstructed read-only from HEAD runtime source (initial user modifications were docs/ignore only) using the same installed dependencies; no checkout/reset. The performance script rejects an integrated snapshot labelled baseline.

Decoded bytes are Resource Timing completed bodies; transfer bytes include browser overhead and may differ with caching. Development totals include Vite/module payloads and must not be compared as production compressed download sizes. Calls/triangles are actual WebGL draw submissions including shadows and repeated instances, not unique asset triangles. Random Egg rarity decorations can vary counts slightly. P50/P95 are the last up to 120 rendered requestAnimationFrame intervals after readiness/warmup, including browser scheduling; these are not separate CPU/GPU frame profiles or guaranteed FPS on other devices.

| Scenario | Decoded bytes | Transfer bytes | Calls/frame | Submitted triangles/frame | RAF P50 / P95 ms | Samples |
| --- | ---: | ---: | ---: | ---: | --- | ---: |
| Baseline dev / fresh | 6,797,872 | 6,806,572 | 805 | 182,366 | 6.1 / 6.2 | 120 |
| Final dev / fresh | 27,335,006 | 27,349,406 | 824 | 333,800 | 6.2 / 12.2 | 120 |
| Final production / fresh | 20,832,776 | 20,291,468 | 825 | 333,808 | 6.1 / 6.2 | 120 |
| Final production / Young loaded | 39,469,052 | 38,928,044 | 832 | 374,760 | 6.05 / 6.2 | 120 |

Fresh game does not request Mountain or all seven species/packs. Young acquisition/save load adds 18,636,276 bytes for Mountain. Twelve promoted model/map files total 38,730,456 bytes plus attribution; the preserved historical GLB is separate and unused. Local desktop boot is playable but startup texture cost and existing world draw count remain significant; physical mobile profiling, atlases/streaming/LOD and code splitting are recommended before release. Hero silhouettes were not arbitrarily reduced.

## Visual and evidence paths

All paths below are relative to Monster_World and files remain on disk:

- ASSET_WORK/previews/baseline-paired-game.png and final-boot-game.png: same spawn comparison.
- ASSET_WORK/previews/game-{idle,walk,jump,theft-carry,secured,baby,young,mounted,flight-boost,flight-turn,landed,dismounted,service-shop,service-collection,service-rider,save-reload}.png.
- ASSET_WORK/previews/carry-{arrive-nest,on-foot,stolen,remounted,flight-with-egg,delivered}.png: actual carried flight.
- ASSET_WORK/previews/pose-{idle,walk,sprint,jump,fall,interact,carry,mounted,flight,boost,land}-{0,1,2}.png: isolated authored pose/Carry 3 angles.
- ASSET_WORK/previews/route-{food-shop,collection-hall,hatchery,rider-hall,mount-court}.png: physical city route.
- ASSET_WORK/previews/mobile-touch.png, failure-fallback.png, production-{fresh,young}.png.
- ASSET_WORK/previews/lab/*: source/derived front/side/back, individual clips; mountain-contact and tarisland-normalized sheets.

Machine-readable records: source-audit, source-integrity, derived-verification, promoted-assets, gameplay-browser, carry-browser, authored-pose-browser, resilience-browser, walkways-browser, baseline-paired-browser, final-boot-browser, production-browser. All in ASSET_WORK/reports. Source and derived conversion sidecars retain original/output hashes and exact settings. Static review of carry/world transforms, cleanup and URL/file alignment found no remaining correctness blocker; 11/11 tests also passed in that review.

## Repository safety and remaining work

1,092 protected files matched initial hashes, including all references and historical Nature GLB. SOURCE_ASSETS is immutable and ignored; ASSET_WORK is ignored. Existing user changes to ignore/prompts/acquisition report remain. All changes are unstaged; no commit, push, PR, merge or deployment. No replacement download, backend, multiplayer, combat, horse mount, new service/quest/region, Adult progression or balance rule was added.

Known limits: authored motion still needs gait/mount/landing polish; no matching Baby; conservative lightweight city collision; no physical mobile measurement; >500 kB script and substantial texture cost. Tarisland conversion/usage, Wyvern bind assembly, Chinese eye/action fragments, Bernardo UDIM/LOD, dense castle/village LOD and Fab terms remain explicit in [validation](ASSET_VALIDATION_REPORT.md) and [runtime plan](ASSET_RUNTIME_PLAN.md). These do not prevent the bounded local player/city/road/rideable-Dragon milestone from functioning; they prevent declaring the entire library/release complete.

Recommended Phase 3 order: resolve usage/attribution terms → physical-device performance and player/Baby/saddle polish → repair Wyvern/Chinese/Bernardo and LOD Demon → Tarisland export/root motion after rights review → split heavy environments and prepare future NPCs within new authorization. No Phase 3 work implemented.
