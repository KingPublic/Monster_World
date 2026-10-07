# Autonomous Dragon MVP Build Report

Date: 2026-10-08  
Result: coherent playable single-player Dragon MVP. Authorized Phases A–H are complete at MVP quality; final release certification is deferred. No deployment performed.

## Completed

- Responsive procedural player, third-person follow camera, jumping/sprint, terrain floor/building collision and walkable Sanctuary services.
- Four Wild Nests, independent physical Egg slots, hold-to-steal, visible carried loot, Guardian pursuit/capture, Safe Zone delivery.
- Tutorial through Hatch → Feed → Grow → Mount → Fly → held Boost → Land/Dismount.
- Coins, Food Shop, Dragon Collection, Rider upgrades, local save, basic touch controls and development-only shortcuts.

## Procedural Dragon System

[ProceduralDragon](src/creatures/ProceduralDragon.ts) generates Nature Baby, Young and Guardian as animated Three.js groups. Baby has a larger head, small wings/legs and leaf accents; Young has heroic proportions and a saddle anchor; Guardian has a wider chest, heavier head, branched horns and much larger wings.

Component animation covers breathing, head look, tail movement, wing idle, eating, cyclic ground movement, takeoff, flap/glide, banking, vertical/Boost poses, alert/roar, return and landing settle. No external rig or advanced IK. [EggModel](src/creatures/EggModel.ts) provides Common/Uncommon/Rare/Epic Nature Eggs.

The external static GLB is preserved unchanged as optional historical content. Core gameplay never requests it. All 21 original reference PNG hashes are unchanged.

## World

The 12,000-unit world and original Nest coordinates are preserved. Sanctuary retains plaza, Hatchery, Shop, Collection, Rider/Mount areas, habitats, houses/towers, stairs/terraces, bridge/stream/fountain, lanterns/banners and vegetation. Terrace openings and collision align for traversal; a path guides the Forest approach.

| Nest | Horizontal distance from Sanctuary | Marker elevation | Slots | Production respawn | Nature rarity pool |
| --- | --- | --- | --- | --- | --- |
| Forest | ~460 | 25 | 3 | 300s per slot | Common 100% |
| Highland | ~1,191 | 145 | 4 | 300s per slot | Common 20%, Uncommon 80% |
| Volcanic | ~2,519 | 330 | 5 | 600s per slot | Uncommon 20%, Rare 80% |
| Frost | ~3,905 | 620 | 5 | 600s per slot | Rare 25%, Epic 75% |

All four use the functional Nest/Guardian system; Highland and later Guardians are faster. Regional scenery does not imply Fire/Ice Dragon content.

## Gameplay

The complete first loop passed in-browser. Only the stolen slot disappeared/cooled down, other Eggs remained, and teleport was rejected while carrying. The return to Sanctuary used physical sprint movement. Delivery secured the Egg before capture, ended pursuit and awarded Coins.

Hatching takes 2.5 seconds with wobble/glow/particles; Baby appears at the Mount court/habitat. First hatch grants two free Food. Two feeds reach Young at 100 Growth without changing Rarity or Element. Mounting parents the rider to the saddle; landed dismount restores foot controls.

Guardian states: IDLE → ALERT → ROAR → CHASE → SAFE_ZONE_STOP → RETURN → IDLE. No distance disengage. Highland capture was also verified: stolen Egg lost, player safely returned, owned Dragon/tutorial preserved.

## Flight

WASD flies; Space ascends; Left Ctrl descends/lands; held Left Shift Boosts; F dismounts after landing. Smooth acceleration/deceleration, steering/banking, wider follow camera, Boost FOV, Stamina drain/regeneration and exhaustion release handling work.

Flight is arcade-style. Normal flight currently costs no Stamina; Boost drains it. The initial takeoff/landing condition was fixed and regression-checked at 30/60/120 FPS. No realistic aerodynamics or advanced camera collision.

## Economy / Collection / Save

Delivery gives 50 Coins/Egg; tutorial completion gives 75. Basic Food costs 20 Coins and gives 50 Growth. Shop purchase, Collection selection/equipped display and a Speed upgrade were verified. Carry 1/2/3 and universal Speed/Stamina/Boost upgrades are centralized and persisted.

Validated localStorage schema v1 saves tutorial, Coins/Food, Dragons/identity/growth, equipped Young, upgrades/Carry and secured Eggs. Browser reload restored the completed tutorial and owned/equipped Young. Corrupt/unknown-version/unavailable storage cases have safe fallback and feedback.

## Mobile

One emulated 390×844 touch-device pass verified responsive layout without horizontal overflow, joystick movement, Interact/mounting and held ascent. Buttons remain in bounds with usable target sizes. Touch also supports camera swipe, descend, held Sprint/Boost and landed dismount. Physical mobile-device certification is pending.

## Validation

- `npm run typecheck`: PASS.
- `npm run build`: PASS; production JS ~623 kB / ~162.5 kB gzip. Vite warns about the bundle exceeding 500 kB.
- `npm test`: 8/8 PASS covering frame-rate takeoff/landing, capacity, per-slot 300/600 timers, identity-preserving growth, failed raids, save validation/fallback, economy and rewards.
- One complete desktop fresh-start gameplay loop: movement/jump/camera → Forest theft → physical escape → delivery → Hatch/Baby → Feed/Grow → Mount/Fly/Boost → Land/Dismount → tutorial complete.
- Development travel shortcuts were used outside carried-loot state to avoid repeated long service/Nest travel. Active theft return was physical; timer acceleration preserved production configuration.
- Save/reload, Highland theft/chase/capture, shop/collection/upgrade checks and one mobile pass: PASS.
- Focused regression: quick E tap cannot bypass the steal hold. Mounted rider disposal and takeoff fix received read-only review.
- Production preview boot/movement: PASS; one canvas, no debug UI/API even with `?debug=1`, zero GLB requests, zero page errors and zero console warnings/errors.
- All 21 PNG reference hashes and the original GLB hash preserved. Active Markdown links checked.

## Known Limitations

- Simple terrain/building collision and direct Guardian steering; camera can clip scenery. Full mobile performance/device profiling remains pending.
- Volcanic/Frost use the common functional system but did not receive complete return-trip browser playthroughs. Route difficulty, economy and upgrade values are provisional.
- Active carried Eggs, position, pursuit and slot cooldowns are session-only: reload abandons carried loot and refills Nests. Secured Eggs and owned progression persist.
- Hatching uses particles and a habitat spawn instead of physical shell fracture/reveal choreography; carry visuals use simple rider attachments.
- Nature Baby/Young/Guardian only. Adult, additional elements, final audio/music and detailed art polish remain deferred.
- Single local browser save; no backend/accounts/cloud save. Production bundle splitting is a later optimization.

## Git Status

Version control remains with the user. No staged files, commit, push, merge, history rewrite, remote change or deployment.

Verified branch `main`, HEAD `492baf9286f793c50c31a4374c97b14a100dcb0a`, origin `https://github.com/KingPublic/Monster_World.git` unchanged.

Final `git status --short` and `git diff --stat` were run. Tracked diff: **52 files changed, 674 insertions, 372 deletions**. New untracked files include the procedural models, gameplay/state modules, input/follow camera/save/traversal, mobile CSS, tests, implementation plan and this report; Git diff statistics exclude untracked files. Screenshot/model-check scratch output is ignored.

To play: `npm run dev`, open the printed URL and choose **Begin adventure** / **Continue adventure**. This authorized build stops here.
