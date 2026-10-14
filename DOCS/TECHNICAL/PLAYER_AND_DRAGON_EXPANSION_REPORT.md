# Player and Dragon world expansion — 2026-10-14

Task12 addresses the user's latest complaints: the player's mouth still looked wrong, Legendary/Mythical Eggs were absent from the actual world, and nests/Dragon shapes repeated. This is a local playable expansion; final imported art and release/device certification remain separate.

## Visible changes

The player now has an instance-owned cartoon head attached to the supplied `CC_Base_Head` bone: a small closed mouth, shallower jaw, fitted nose, brown eyes/brows and timed blinks. Original facial meshes remain intact and hidden on this instance; disposal restores their visibility. Source curls, body, clothing geometry, rig, foot support and rider poses remain. Owned outfit materials use teal/navy/tan. This supersedes the Task10 lip-only correction. Before/after and idle/walk/riding/blink evidence: `ASSET_WORK/iteration7/player-report.md` and `player-final-*.png`.

Six original temporary Dragon profiles provide different bodies, limbs, head crests, tails and wings:

| Stable saved variant | Shape | New region |
| --- | --- | --- |
| `duneback` | Heavy four-legged plated back, ram horns | Golden Dunes |
| `emberdrake` | Broad chest, four legs, fire crest | Emberfall Crater |
| `crystalwyvern` | Two legs, tall neck, angular crystal sails | Crystal Crown |
| `moonveil` | Crescent horns, broad scalloped wings | Moonveil Grove |
| `suncrest` | Solar mane, layered feather wings | Suncrest Temple |
| `stormserpent` | Long torso/neck/tail, antlers/whiskers, ribbon fins | Stormspire |

Each identity has Baby/Young/Guardian forms, blinking/jaw motion, quiet grounded rest, planted feet, speed-driven walking, flight/glide/boost/bank/landing, Young saddle and world-scale rider/carry anchors. Baby growth and later care scale the visual without scaling the physics root or rider. Temporary instances explicitly report `authoredTemporary:true`, `sourceReady:false` and `runtimeAsset:authored:<id>`. Details and measured render budgets: `ASSET_WORK/iteration7/species-report.md`. Existing Mountain/Meadow/Frostcrest/Ashscale IDs and source mappings remain: ten saved lineages total, six newly authored geometry profiles plus two existing downloaded geometry families.

## Fourteen real nests, 58 Egg slots

The original eight IDs and coordinates remain. World extent stays12000. Six physical regions add terrain aprons, connected trails, regional props, Guardian, real Egg slots, destination cards, local travelers and named guides:

| ID / destination | Center x,y,z | Slots / respawn | Actual rarity pool |
| --- | --- | --- | --- |
| `dunes` / Golden Dunes | 2380,85,2440 | 4 /300s | Rare75%, Epic25% |
| `ember` / Emberfall Crater | 3790,340,-1370 | 5 /600s | Epic80%, Legendary20% |
| `glacier` / Crystal Crown | -3550,730,-4350 | 4 /600s | Epic30%, Legendary70% |
| `moonwell` / Moonveil Grove | -4320,400,2330 | 4 /600s | Legendary85%, Mythical15% |
| `sunreach` / Suncrest Temple | 4230,530,-2960 | 4 /600s | **Legendary100%** |
| `stormspire` / Stormspire | 4390,880,4260 | 3 /600s | **Mythical100%** |

These are natural drops, not merely admin-only records. Golden Dunes uses sandstone, Emberfall basalt columns, Crystal Crown pointed crystals, Moonveil mushrooms/ancient posts, Suncrest temple columns/arches and Stormspire high jagged spires. Broad terrain supports the elevated regions; detailed aprons/trails match the physical ground. Props stay outside the Egg floor and approach. Rarity/variant persists through theft, securing, hatch, growth, riding and save. Legendary/Mythical Eggs have distinct halos/crowns/orbits. Original Nature element remains; visual themes do not introduce new elemental gameplay.

The catalog grows from73 to109 resident definitions:25 in the city and six per region (five travelers plus a guide), with at most20 nearby loaded models. Six new guides explain their actual region/species/pools. Hidden Egg visuals beyond1100 and idle Guardian visuals beyond1900 are skipped while slot deadlines/pursuit still run; active pursuing Guardians remain visible. This is bounded render work, not a measured device-FPS guarantee.

## Replacing temporary Dragons later

Keep the six stable variant IDs in saved Eggs/Dragon records. `src/config/dragonVariants.ts` maps identity to either `file:null` plus `temporary` profile or a qualified source file. `src/creatures/DragonVariants.ts` is the single visual factory. Replacing art must preserve its `DragonVisual` contract: root, mount/carry anchors, `update`, form/growth and disposal.

A future GLB needs source/rights/texture/rig/animation inspection, size/floor/saddle validation and a matching rig adapter. The existing imported adapter understands the supplied Mountain/Demon families; an unrelated rig needs its own adapter. Put validated derivatives in the appropriate runtime model folder, map the same ID, and inspect Baby/Young/Guardian and rider/carry support before enabling it. Arbitrary GLBs cannot be substituted safely by filename alone. Do not edit immutable downloads or existing derivatives in place.

## Preserved behavior

C descent/Ctrl backup/mobile DOWN, independent foot/Horse stamina, Dragon care/stat/HP/size/recovery/audio, shield, Sanctuary services, illustrated menu without a3DDragon, five visible garden berths and all saved collection records continue. Physical return remains required after theft; no carried-Egg teleport or mounted debug travel. New silhouettes have differentiated voice pitch using the existing stylized audio system.

Local `?debug=1` tools add14 nest choices and two private secured-Egg grants for staging. DEV+loopback+explicit opt-in remains mandatory; production has no active panel/debug API. This is local isolation, not authenticated exclusive online account access. See `LOCAL_ADMIN_ACCESS.md`. No login/backend/dependencies/Git writes/deployment/source overwrite/personal-save reset.

## Verification and limits

Focused world/progression/player/species/rig/Guardian/C regression checks passed. The final collected scoped run passed23 checks. Full build/typecheck passed:76 modules,922.40kB JS (256.75kB gzip),24.29kB CSS; existing large-chunk warning remains. No broad audit or full-suite replay was needed.

Integrated browser evidence `ASSET_WORK/iteration7/adventure-expansion-browser.json` has `pass:true`, no page errors and no failed asset responses. Its isolated fixture stages prior earned records, Food and local secured-Egg grants. Legendary and Mythical real hatch/two meals/mount/Space ascent/C landing/dismount/save reload use the actual Game and UI. Natural14-region slots/6authored Guardians/destination pool labels and a real Stormspire theft are separate checks; teleport refuses carried loot. Production boot even with `?debug=1` has0admin buttons and no debug API. It does not claim a fully earned Legendary/Mythical raid return. Original browser storage is untouched. A retained `adventure-browser-before-selector-fix.json` records a harness selector typo, not a game exception. Initial local-server connection failures were resolved by restarting loopback servers.

The face is authored runtime geometry rather than a sculpted final GLB head; its smooth surface differs from retained textured curls/fabric, and facial expression currently covers neutral mouth/blink. Six Dragons are deliberate temporary art with procedural motion, not new imported clips/textures. New pool/Guardian tuning is provisional. Ten blocked download groups remain unqualified; newly authored species do not change the9/19 downloaded-group count. High-end/mobile device performance and final art/licensing review remain open.
