# MONSTER WORLD
## Roblox → Three.js Web Game Migration, Repository Restructure, World Foundation & Documentation Sync

You are working inside the repository:

`C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox\Monster_World`

This repository originated from the Roblox prototype **Steal a Baby Dragon**.

We are now pivoting the project into a standalone browser-based 3D game called:

# MONSTER WORLD

The implementation stack is changing from Roblox Studio / Luau to:

- Vite
- TypeScript
- Three.js
- HTML / CSS for UI
- browser-native APIs where appropriate

The game must eventually be deployable through:

Local development  
→ Git  
→ GitHub  
→ Vercel

---

# 0. IMPORTANT — TASK BOUNDARY

This task is a:

# REPOSITORY MIGRATION + FOUNDATION + WORLD-DIRECTION PASS

DO NOT build the full game yet.

DO NOT implement the full gameplay loop yet.

DO NOT begin the first real playable vertical slice yet.

DO NOT create complete combat, economy, progression, shop, Guardian AI, Dragon flight gameplay, hatching gameplay, or multiplayer.

The objective is to:

1. cleanly migrate the project away from Roblox-specific implementation,
2. establish a correct Three.js/Vite/TypeScript foundation,
3. preserve all useful Dragon gameplay design and references,
4. reframe the project as **Monster World**,
5. preserve a Dragon-first implementation scope,
6. establish the intended world scale,
7. establish the Dragon Sanctuary / fantasy city direction,
8. preserve meaningful travel distance between Wild Nests,
9. verify that existing Dragon runtime assets can load in Three.js,
10. prepare the repository for the next gameplay milestone,
11. keep the project GitHub/Vercel-ready.

When this task is complete:

# STOP.

Do NOT begin Task 01 automatically.

---

# 1. CURRENT PROJECT IDENTITY

The project identity is now:

# Monster World

The long-term game may eventually support multiple fantasy creature families.

Possible future examples include:

- Dragons
- Griffins
- Serpents
- other fantasy creatures

However:

# CURRENT DEVELOPMENT FOCUS = DRAGONS ONLY

Do NOT introduce another monster family during this migration.

Do NOT create Griffin, Serpent, Wolf, Slime, Phoenix, or other content.

The architecture may support future extension conceptually:

```text
Creature
├── Dragon
├── Future Creature
├── Future Creature
└── ...
```

But the only active creature family is:

# DRAGON

The active first gameplay experience remains Dragon-focused.

Add a permanent scope rule:

> Dragons are the first implemented creature family and the sole gameplay/content focus of the initial web vertical slice. Architecture may support future creature families, but no other monster family should be implemented until explicitly authorized.

---

# 2. PRESERVE THE CORE DRAGON GAMEPLAY IDENTITY

The Dragon gameplay direction from the previous prototype remains valuable.

Do NOT discard it.

The initial Monster World Dragon loop remains approximately:

```text
Explore
→ Find Wild Dragon Nest
→ Inspect available Eggs
→ Steal Egg
→ Guardian detects theft
→ Guardian Chase
→ Escape
→ Reach Sanctuary / Safe Zone
→ Secure Egg
→ Hatch
→ Baby Dragon
→ Feed
→ Grow
→ Young / Juvenile
→ Ride
→ Explore farther
→ Find rarer nests
→ Repeat
```

Preserve confirmed concepts involving:

- Dragon Sanctuary
- Wild Dragon Nests
- physical Egg slots
- multiple Eggs per Nest
- per-slot Egg respawn
- Dragon Guardians
- Guardian Chase
- Safe Zone
- Dragon hatching
- Baby Dragons
- Feeding
- Dragon Growth
- Dragon Rarity
- Dragon Element
- Dragon Growth Stage
- rideable Young / Juvenile Dragons
- Dragon flight
- Rider progression
- Carry Capacity
- farther Wild Nests
- generally higher / harder Wild Nests
- premium stylized fantasy art direction

The GAMEPLAY DESIGN remains useful.

The ROBLOX IMPLEMENTATION does not.

---

# 3. WORLD IDENTITY — DRAGON SANCTUARY / FANTASY CITY

Monster World must NOT feel like a collection of disconnected prototype platforms.

The Player's home should eventually feel like a:

# DRAGON SANCTUARY / DRAGON VILLAGE / FANTASY DRAGON CITY

This is an important part of the game identity.

The Sanctuary is:

- the Player's home,
- the main Safe Zone,
- the collection hub,
- the Dragon progression hub,
- a strong visual landmark,
- the center from which the Player explores the world.

IMPORTANT:

# THIS IS NOT A CITY-BUILDING GAME.

The Player does NOT construct structures tile-by-tile.

The Sanctuary should already feel like an established fantasy settlement.

The Player interacts with its services and Dragons.

---

## 3.1 Sanctuary Physical Areas

The Sanctuary should eventually contain distinct physical areas for:

- Player spawn / arrival area
- central plaza
- Hatchery
- Dragon habitats
- Dragon Collection area
- Mount / Dragon selection area
- Rider Upgrade area
- Food / general Shop
- paths and bridges
- decorative Dragon statues
- banners / fantasy decorations
- trees and vegetation
- water features
- cliffs / elevated terraces
- owned Dragons visible in-world where practical
- recognizable landmarks

The Sanctuary should communicate:

```text
SAFE
WARM
MAGICAL
LIVED-IN
PREMIUM FANTASY
DRAGON SANCTUARY
```

Use existing:

- `REFERENCES/ART_DIRECTION/`
- `REFERENCES/ENVIRONMENT/`
- `REFERENCES/GUI/`

as visual guidance.

Do NOT reduce the Sanctuary into:

- one circular platform,
- several colored cubes,
- generic gray buildings,
- a tiny lobby,
- disconnected service kiosks.

Even procedural prototyping should establish:

- readable streets / paths
- plazas
- layered architecture
- verticality
- landmarks
- coherent city composition
- a strong visual center

The intended impression is closer to:

> Dragon Sanctuary / Fantasy Dragon Village / Dragon City

than:

> generic game lobby.

---

# 4. WORLD SCALE — DISTANCE BETWEEN SANCTUARY AND WILD NESTS

Travel distance is a CORE gameplay mechanic.

Wild Nests must NOT all be directly beside the Sanctuary.

The Player should feel that they are travelling into increasingly dangerous parts of Monster World.

General progression:

```text
Sanctuary
↓
Nearby Starter Nest
↓
Farther Mid-tier Nest
↓
Far High-tier Nest
↓
Very Distant Highest-tier Nest
```

Distance matters because:

# THE PLAYER MUST RETURN HOME WHILE BEING CHASED BY A GUARDIAN.

The challenge is not only reaching a Wild Nest.

The challenge is:

```text
Reach Nest
→ Steal Egg
→ Guardian Chase
→ Survive the return journey
→ Reach Safe Zone
```

Therefore:

DO NOT:

- put every Nest around the Sanctuary within a few seconds of travel,
- place every Nest in one small arena,
- make every Nest visible from the central plaza,
- compress the entire world purely for prototype convenience,
- trivialize return journeys.

---

## 4.1 Distance Progression

General intended feeling:

### Starter Nests
- relatively close to Sanctuary
- suitable for learning movement and stealing
- short return journey

### Mid-tier Nests
- clearly farther
- more terrain variation
- longer Guardian Chase

### High-tier Nests
- substantially farther
- more difficult terrain
- larger risk during escape

### Highest-tier Nests
- among the longest journeys
- rarest Egg pools
- dangerous route
- meaningful Stamina / Speed / Boost requirements

Do NOT lock exact travel times yet.

Distance tuning will require playtesting.

---

# 5. DISTANCE + ELEVATION + TERRAIN DIFFICULTY

World progression should generally combine:

- greater horizontal travel distance
- increased elevation
- harder terrain
- more exposed traversal
- stronger Guardian pressure
- rarer Egg pools

Not every Nest must literally be vertically higher than the previous one.

The geography should feel natural.

Conceptual world progression may resemble:

```text
Dragon Sanctuary Valley
↓
Forest Region
↓
Highland Region
↓
Volcanic Region
↓
Frozen Mountain Region
↓
Storm / Sky Region
```

This is DIRECTIONAL only.

Exact biome order remains subject to future iteration.

---

# 6. ESCAPE ROUTE DESIGN

Important Wild Nests should eventually have:

- recognizable approach routes
- readable escape routes
- environmental landmarks
- navigation decisions
- terrain obstacles
- route-learning opportunities

Players should gradually learn:

- faster paths,
- safer paths,
- risky shortcuts,
- efficient escape routes.

This creates Player mastery beyond raw stats.

The game should reward:

- route knowledge
- movement skill
- Dragon performance
- Rider upgrades

---

# 7. NO FAST TRAVEL DURING ACTIVE THEFT

Fast travel must NOT trivialize the core chase loop.

When carrying stolen Eggs:

- no direct teleport home,
- no instant Sanctuary warp,
- no skipping the physical return trip,
- no travel mechanic that cancels Guardian Chase.

The physical escape is part of the game fantasy.

Future convenience travel MAY be considered later outside active theft states.

It is NOT a current V1 gameplay requirement.

---

# 8. FIRST — FULL REPOSITORY AUDIT

Before editing anything:

Recursively inspect the entire repository.

Inspect:

- `README.md`
- `AGENTS.md`
- `MASTER_GAME_SPEC.md`
- `ASSET_MANIFEST.md`
- `CHANGELOG.md`
- `.gitignore`
- `DATA/`
- `DOCS/`
- `TASKS/`
- `TESTING/`
- `REFERENCES/`
- `PROMPTS/`
- `ARCHIVE/`
- all existing runtime/model assets
- all build/package files if any
- current Git status

Also inspect:

- current Git branch
- repository root
- configured remotes

IMPORTANT:

DO NOT:

- run `git init`
- delete `.git`
- change remote
- rewrite Git history
- force reset
- merge
- push
- commit automatically

The user will review changes and handle Git operations after this migration.

---

# 9. PRESERVE ALL VISUAL REFERENCES

The existing reference pack is valuable.

Preserve exact existing filenames.

DO NOT rename reference images.

Preserve:

```text
REFERENCES/
├── ART_DIRECTION/
├── GUI/
├── DRAGONS/
├── ENVIRONMENT/
├── ANIMATION/
└── AUDIO/
```

The reference pack remains useful for:

- art direction
- Dragon appearance
- Egg appearance
- Sanctuary direction
- Wild Nest direction
- UI composition
- world mood
- flight intention
- Guardian animation intention
- mobile-control direction

Reference images define:

- visual language
- composition
- style
- mood
- color
- shape language
- scale intention
- broad animation intention

Reference images DO NOT automatically define:

- exact prices
- exact timers
- exact stats
- exact progression locks
- exact monetization
- exact levels
- exact currency
- unsupported gameplay mechanics

If an image conflicts with active gameplay documentation:

# MASTER_GAME_SPEC.md WINS.

Update `REFERENCES/README.md` and `REFERENCES/REFERENCE_INDEX.md` only as needed to reflect Monster World and the web project.

Do not destroy historical provenance.

---

# 10. EXISTING 3D DRAGON ASSET

Inspect the existing Dragon `.glb` file already present in the repository.

It represents the current Nature Young/Juvenile Dragon candidate.

It is useful for the new Three.js project.

Three.js should eventually load it through:

`GLTFLoader`

Create a clean runtime location such as:

```text
public/
└── assets/
    └── models/
        └── dragons/
```

Move the runtime GLB there if appropriate.

Rules:

- preserve the existing filename unless there is a compelling technical reason not to
- do not modify the binary during migration
- do not duplicate it unnecessarily
- update documentation paths
- register it in `ASSET_MANIFEST.md`

Old Roblox Asset IDs are:

# HISTORICAL ONLY

They are not active runtime dependencies anymore.

---

# 11. ARCHIVE ROBLOX-SPECIFIC IMPLEMENTATION HISTORY

Do NOT delete previous work.

Create:

`LEGACY_ROBLOX/`

Archive Roblox-specific historical material there.

Examples:

- Roblox setup prompts
- Roblox Studio implementation reports
- Roblox Task 01 implementation report
- Roblox playtest reports
- Roblox visual replacement reports
- ServerScriptService architecture
- ReplicatedStorage design
- RemoteEvent design
- DataStore implementation notes
- Roblox MCP instructions
- Seat / Motor6D implementation
- Studio-specific workflow

Do NOT archive useful engine-neutral gameplay design.

The purpose is:

```text
ACTIVE DOCS
=
Monster World / Three.js

LEGACY_ROBLOX
=
Historical Roblox implementation
```

---

# 12. ACTIVE DOCUMENTATION STRUCTURE

Retain and migrate useful engine-neutral documentation.

Recommended active structure:

```text
DOCS/
├── GAMEPLAY/
├── CREATURES/
│   └── DRAGONS/
├── WORLD/
├── AI/
├── UI_UX/
└── TECHNICAL/
```

If the repository currently uses:

`DOCS/DRAGONS/`

you may migrate it to:

`DOCS/CREATURES/DRAGONS/`

if doing so improves long-term organization.

If moving files:

- update all Markdown links,
- preserve content,
- do not invent other creature documentation.

---

# 13. REWRITE MASTER_GAME_SPEC.md

Rewrite the active identity from:

`Steal a Baby Dragon`

to:

# Monster World

Clearly distinguish:

## Long-term Vision

Monster World may eventually support multiple fantasy creature families.

## Current Implementation Scope

Dragons only.

Include the permanent scope guard:

> Dragons are the first implemented creature family and the sole gameplay/content focus of the initial web vertical slice. Architecture may support future creature families, but no other monster family should be implemented until explicitly authorized.

Preserve approved Dragon gameplay systems.

Remove or rewrite Roblox-specific implementation language such as:

- Roblox Studio
- Roblox runtime
- Roblox character
- Seat
- Motor6D
- RemoteEvents
- ServerScriptService
- ReplicatedStorage
- DataStore
- Studio MCP
- Roblox Asset ID

Where future implementation is undecided:

use:

`TBD`

Do not invent infrastructure.

---

# 14. WEB PROJECT STACK

Create the actual web project foundation using:

# Vite + TypeScript + Three.js

Prefer plain Three.js.

Do NOT introduce React Three Fiber unless explicitly required.

Reasons:

- direct engine control
- lower abstraction
- easier agent maintenance
- easier debugging
- simpler game loop
- simpler procedural world generation

Essential runtime dependency:

- `three`

Expected development dependencies:

- `vite`
- `typescript`
- `@types/three`

Use appropriate stable versions available through the package manager.

Do not introduce unnecessary frameworks.

---

# 15. CREATE ROOT WEB PROJECT FILES

Create a valid Vite project at repository root.

Expected root files include:

```text
package.json
index.html
tsconfig.json
vite.config.ts
```

Add other standard Vite/TypeScript config files only if genuinely required.

Ensure these commands work:

```bash
npm install
npm run dev
npm run build
```

Also add:

```bash
npm run preview
```

and, if useful:

```bash
npm run typecheck
```

---

# 16. TARGET SOURCE ARCHITECTURE

Create a clean starting architecture approximately like:

```text
src/
├── main.ts
│
├── core/
│   ├── Game.ts
│   ├── Renderer.ts
│   ├── SceneManager.ts
│   └── GameLoop.ts
│
├── world/
│   ├── World.ts
│   ├── Environment.ts
│   └── Sanctuary.ts
│
├── creatures/
│   ├── Creature.ts
│   └── dragons/
│       ├── Dragon.ts
│       ├── DragonConfig.ts
│       └── GuardianDragon.ts
│
├── gameplay/
│   ├── Player.ts
│   ├── Egg.ts
│   ├── WildNest.ts
│   └── TutorialState.ts
│
├── systems/
│   ├── InputSystem.ts
│   ├── CameraSystem.ts
│   ├── MovementSystem.ts
│   ├── CollisionSystem.ts
│   ├── AssetSystem.ts
│   ├── AudioSystem.ts
│   └── SaveSystem.ts
│
├── ui/
│   ├── UIManager.ts
│   └── styles/
│
├── config/
│   ├── gameConfig.ts
│   └── assetManifest.ts
│
└── utils/
```

This is a TARGET architecture.

Do NOT create dozens of meaningless empty files purely to match a diagram.

Prefer:

- useful foundations
- simple responsibilities
- low coupling
- maintainability
- extensibility

Avoid enterprise-style overengineering.

---

# 17. PUBLIC RUNTIME ASSET STRUCTURE

Create:

```text
public/
└── assets/
    ├── models/
    │   ├── dragons/
    │   └── monsters/
    ├── textures/
    ├── images/
    ├── audio/
    └── fonts/
```

Important:

`public/assets/models/monsters/`

may exist for future expansion but remains unused.

Current runtime content remains:

# DRAGONS ONLY.

Do NOT copy the entire `REFERENCES/` tree into `public/assets/`.

Development references and runtime assets must remain distinct.

---

# 18. MINIMAL WORLD BOOT SCENE

Create a minimal technical world that proves:

- Three.js works,
- Vite works,
- runtime asset loading works,
- the intended WORLD SCALE works,
- the intended Sanctuary composition direction works.

This is NOT the first gameplay milestone.

Do not implement the full gameplay loop.

---

## 18.1 Three.js Technical Foundation

The boot scene should:

- initialize Three.js
- create renderer
- create scene
- create perspective camera
- create lighting
- support resize
- support reasonable devicePixelRatio capping
- start a clean update/render loop
- avoid immediate runtime errors

---

## 18.2 Central Dragon Sanctuary Prototype

Create a procedural placeholder Dragon Sanctuary / fantasy city.

The city should establish composition rather than final art.

Include lightweight procedural approximations of:

- central plaza
- several fantasy structures
- pathways
- bridges where useful
- vegetation
- trees
- water or decorative pools if practical
- vertical terraces
- stairs / ramps
- cliffs or raised platforms
- Hatchery landmark placeholder
- Shop landmark placeholder
- Dragon Collection landmark placeholder
- Rider Upgrade landmark placeholder
- Mount area placeholder

These are:

# WORLD-COMPOSITION PLACEHOLDERS.

They are NOT final production assets.

Do NOT make the city look like:

- random boxes on a flat plane,
- an empty circular platform,
- a Roblox lobby recreation.

Use:

- coherent placement,
- varied heights,
- layered pathways,
- fantasy silhouettes,
- readable districts.

---

## 18.3 Surrounding World

Build enough lightweight procedural surrounding terrain so the Sanctuary feels embedded in a larger world.

Suggest:

- valley
- forest
- hills
- cliffs
- distant mountains
- elevated highlands
- future biome directions

Use lightweight procedural Three.js geometry/materials.

Do not attempt final terrain art.

The key requirement is:

# SCALE.

The world should clearly extend beyond the Sanctuary.

---

## 18.4 Non-functional Wild Nest Markers

Create several non-functional placeholder Wild Nest locations.

They exist only to communicate:

- scale,
- progression,
- distance,
- elevation.

Example conceptual placement:

```text
Dragon Sanctuary
↓
Starter Forest Nest
↓
Farther Highland Nest
↓
Distant Volcano Nest
↓
Very Distant Frost / Storm region
```

DO NOT implement:

- Egg stealing
- Egg spawn system
- Guardian Chase
- Guardian AI
- progression logic

during Task 00.

Markers may be:

- nest-shaped procedural geometry,
- colored world markers,
- simple landmarks.

Do NOT place them all close together.

---

## 18.5 Relative Nest Distance

The boot scene must make it obvious that:

- Starter Nest is relatively close,
- Mid-tier Nest is farther,
- High-tier Nest is significantly farther,
- Highest-tier areas feel distant.

Do NOT lock exact final distances.

The purpose is visual/spatial review.

Distance values should be centralized/configurable.

---

## 18.6 Development Inspection Camera

Provide a temporary development-only inspection camera if useful.

Orbit-style inspection is acceptable.

Its purpose is to inspect:

- city layout
- city scale
- surrounding terrain
- nest distances
- verticality
- Dragon model

This inspection camera:

# DOES NOT DEFINE FINAL GAMEPLAY CONTROLS.

---

## 18.7 Dragon Showcase

If practical:

load the approved Nature Young Dragon GLB using `GLTFLoader`.

Display it in the Sanctuary as a static showcase asset.

Inspect whether the GLB contains:

- scene hierarchy
- meshes
- materials
- skeleton
- bones
- animation clips

Report truthfully.

If the asset contains no animation clips:

DO NOT fabricate animation.

Document:

`Static visual asset — animation/rigging requires future work.`

If loading fails:

- show a safe placeholder
- log a clear error
- do not break the entire app

---

# 19. RESPONSIVE WEB FOUNDATION

Target platforms:

- desktop browser
- mobile browser

Set up:

- responsive canvas
- resize handling
- reasonable devicePixelRatio cap
- touch-safe page structure
- prevent undesirable page scrolling around game canvas where appropriate

Do NOT implement final mobile controls yet.

---

# 20. UI ARCHITECTURE

Use:

```text
Three.js WebGL Canvas
+
HTML/CSS HUD Overlay
```

Do NOT attempt to build every interface as 3D WebGL UI.

HTML/CSS will later support:

- tutorial objectives
- stamina
- carry count
- Dragon information
- hatching interface
- shop
- collection
- mobile buttons

Preserve visual direction from:

`REFERENCES/GUI/`

Do not implement final UI during migration.

---

# 21. SAVE SYSTEM DIRECTION

Roblox DataStore is obsolete.

For the initial single-player browser game:

plan for:

- `localStorage`
and/or
- `IndexedDB`

Do NOT build an unnecessarily complex persistence system during migration.

Document:

### Phase 1
Local browser save.

### Future
Optional cloud/authenticated save if later required.

Do NOT add:

- Firebase
- Supabase
- custom backend
- user accounts

without explicit authorization.

---

# 22. NETWORKING DIRECTION

Initial Monster World web version is:

# SINGLE PLAYER.

Do not implement multiplayer.

Rewrite active networking documentation accordingly.

State:

- V1 has no multiplayer synchronization requirement,
- Roblox server/client architecture is obsolete,
- future multiplayer is separate future scope.

Do not introduce WebSockets or networking frameworks yet.

---

# 23. ACTIVE TECHNICAL DOCUMENTATION

Create or rewrite:

```text
DOCS/TECHNICAL/ARCHITECTURE.md
DOCS/TECHNICAL/ASSET_PIPELINE.md
DOCS/TECHNICAL/SAVE_SYSTEM.md
DOCS/TECHNICAL/DEPLOYMENT.md
DOCS/TECHNICAL/INPUT_AND_CONTROLS.md
```

Architecture should explain:

```text
Browser
↓
Game Loop
↓
Three.js Scene
↓
Gameplay Systems
↓
HTML/CSS UI
```

Asset pipeline:

```text
Concept / Reference
↓
External 3D Tool
↓
GLB / GLTF
↓
public/assets/
↓
GLTFLoader
↓
Three.js Scene
```

Do NOT claim static models have skeletal animation.

---

# 24. WORLD DOCUMENTATION REQUIREMENT

Create/update:

```text
DOCS/WORLD/WORLD_STRUCTURE.md
DOCS/WORLD/PLAYER_SANCTUARY.md
DOCS/WORLD/WILD_NEST_SYSTEM.md
```

These must explicitly document:

- Sanctuary as compact fantasy Dragon City
- Sanctuary is not city-building gameplay
- meaningful physical travel distance
- farther Nests for higher progression
- general increase in elevation / terrain difficulty
- Guardian return journey as core difficulty
- no theft-state fast travel
- procedural world foundation suitable for Three.js
- world scale as gameplay, not merely scenery

---

# 25. WILD NEST RULES TO PRESERVE

Preserve the approved V1 direction.

Each Wild Nest normally exposes:

# 3–5 EGG SLOTS

Exact slot count is configurable per Nest.

Respawn is:

# PER SLOT.

When an Egg is stolen:

1. only that slot becomes empty,
2. untouched Eggs remain,
3. timer begins for the stolen slot,
4. the slot later rolls/spawns a new Egg from that Nest's pool.

Standard Wild Nests:

# 300 seconds

Two highest-tier Dragon Nests:

# 600 seconds

These are:

# CONFIGURABLE V1 BALANCING VALUES.

Do not scatter them as hardcoded constants.

The current web version is single-player, so Roblox-specific server-authoritative language should be removed from active docs.

Future multiplayer concurrency is separate future work.

---

# 26. DRAGON IDENTITY MODEL TO PRESERVE

Dragon identity remains three independent dimensions:

```text
RARITY
+
ELEMENT
+
GROWTH STAGE
```

Example:

```text
Mythic
+
Storm
+
Baby
=
Mythic Storm Baby Dragon
```

Growth does NOT change Rarity.

Growth does NOT change Element.

Current growth direction:

```text
Egg
→ Baby
→ Young / Juvenile
→ Adult
```

Current intent:

### Baby
- newly hatched
- small
- not normal full mount yet

### Young / Juvenile
- larger
- rideable
- first practical flight stage

### Adult
- fully developed
- mature visual/stat profile

Do not finalize Adult implementation during migration.

---

# 27. DRAGON STATS / RIDER UPGRADES TO PRESERVE

Preserve Dragon base concepts:

- Speed
- Stamina
- Boost

Preserve Rider upgrade categories:

- Speed Multiplier
- Stamina Multiplier
- Boost Multiplier
- Carry Capacity

Current Carry Capacity direction:

```text
Level 1 = 1 Egg
Level 2 = 2 Eggs
Level 3 = 3 Eggs
```

Current maximum:

# 3 EGGS

Do not finalize balance values during migration.

---

# 28. DRAGON GROWTH + FOOD TO PRESERVE

Preserve:

- Dragons hatch as Baby Dragons
- Dragons grow through Feeding
- Food grants Growth Progress
- Food is primarily purchased from Sanctuary Shop
- tutorial Starter Food is free
- tutorial must not require grinding

Do NOT implement gameplay during Task 00.

Only preserve/document the system.

---

# 29. GUARDIAN GAMEPLAY TO PRESERVE

Core Guardian intent remains:

```text
IDLE
↓
ALERT
↓
ROAR
↓
CHASE
↓
SAFE ZONE STOP
↓
RETURN
↓
IDLE
```

Important:

Guardian Chase should not stop merely because the Player travelled far away.

The successful end condition is reaching the Player's Sanctuary / Safe Zone while carrying the stolen Egg.

The game is primarily:

# ESCAPE

not:

# KILL THE GUARDIAN.

Do not introduce boss-combat design during migration.

---

# 30. TASK STRUCTURE

Replace/archive Roblox-oriented active Tasks.

Create active web milestone structure:

```text
TASKS/
├── README.md
├── TASK_00_WEB_MIGRATION_AND_WORLD_FOUNDATION.md
├── TASK_01_DRAGON_VERTICAL_SLICE.md
├── TASK_02_DRAGON_FLIGHT_AND_ANIMATION.md
├── TASK_03_WILD_NESTS_AND_GUARDIANS.md
├── TASK_04_GROWTH_COLLECTION_ECONOMY.md
└── TASK_05_WORLD_CONTENT_AND_RELEASE.md
```

Task 00:

# this migration.

Task 01 later targets:

```text
Spawn
→ Explore
→ Steal Dragon Egg
→ Guardian Chase
→ Escape
→ Hatch
→ Feed
→ Grow
→ Ride
```

Do NOT implement Task 01 now.

---

# 31. AGENTS.md

Rewrite `AGENTS.md` for the new Three.js workflow.

Permanent rules should include:

1. Read `MASTER_GAME_SPEC.md` first.
2. Read the currently authorized `TASKS/` file.
3. Inspect relevant references before visual implementation.
4. Implement only the authorized milestone.
5. Never invent gameplay because it appears in an AI reference image.
6. Preserve working systems.
7. Prefer centralized config over scattered constants.
8. Runtime assets and design references are separate.
9. Dragons only until another creature family is explicitly authorized.
10. Target desktop and mobile browser compatibility.
11. Run typecheck/build before claiming completion.
12. Do not commit, merge, push, or change Git remote unless explicitly asked.
13. Do not silently add paid services/backends.
14. Do not reintroduce Roblox dependencies.
15. Keep game systems practical and avoid premature overengineering.
16. World scale and Nest travel distance are gameplay requirements.
17. Sanctuary should visually read as a fantasy Dragon city, not a generic lobby.
18. Do not compress the world just to simplify implementation.

---

# 32. README.md

Rewrite around:

# Monster World

Describe it as:

> A browser-based 3D fantasy creature adventure game, currently focused on Dragons.

Include:

### Current Content Focus
Dragons.

### Technology
- TypeScript
- Three.js
- Vite

### Target
- Desktop browser
- Mobile browser

### Deployment
- GitHub
- Vercel

Include setup:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Explain major directories.

Link to `LEGACY_ROBLOX/` for historical prototype material.

Do not describe Roblox Studio as the runtime.

---

# 33. ASSET_MANIFEST.md

Migrate away from Roblox-specific status.

Suggested columns:

| Asset | Category | Runtime Status | Reference Status | Source | Runtime Path | Notes |
| --- | --- | --- | --- | --- | --- | --- |

Example:

| Nature Young Dragon | Dragon Model | Available | Reference Available | Existing GLB | `/assets/models/dragons/...` | Static model unless inspection proves rig/animations exist |

Do NOT use Roblox Asset IDs as active runtime identifiers.

Historical IDs may remain under `LEGACY_ROBLOX/` only if useful.

---

# 34. DATA/

Preserve useful balancing documents such as:

- Dragon growth values
- Dragon stats
- economy balance
- Egg spawn pools
- Nest configs
- Rider upgrades

Remove Roblox-specific implementation language.

Keep unapproved values as:

`TBD`

Future approved balancing may later move into TypeScript config.

Do not perform extensive balance design during migration.

---

# 35. AUDIO

Preserve current Audio Direction documentation.

No final audio library needs to be created during migration.

Future audio states remain approximately:

```text
Sanctuary
→ Calm

Exploration
→ Adventure

Egg Stolen
→ Tension

Guardian Chase
→ High Intensity

Safe Zone
→ Tension Resolve

Hatch / Growth
→ Reward
```

Do not add final licensed music/audio assets during migration.

---

# 36. VERCEL READINESS

Ensure project builds as a standard static Vite site.

Do NOT deploy automatically.

Do NOT require secrets.

Do NOT add serverless APIs.

Do not create `vercel.json` unless actually necessary.

Document deployment flow:

```text
Local
↓
Git
↓
GitHub
↓
Vercel Project
↓
Vite Build
↓
dist/
↓
Automatic Deployment from main
```

---

# 37. .gitignore

Update `.gitignore` appropriately.

Include:

```text
node_modules/
dist/
.vite/
.env
.env.*
*.local
```

Preserve appropriate editor/OS ignores.

Do NOT ignore:

- source files
- Markdown docs
- `REFERENCES/`
- runtime `.glb` assets
- `package-lock.json`

---

# 38. CHANGELOG

Add migration entry including:

- project reframed as Monster World
- Roblox prototype moved to legacy status
- Three.js/Vite/TypeScript foundation introduced
- Dragon-first scope preserved
- future creature extensibility documented
- Dragon Sanctuary / fantasy city world direction locked
- larger world scale locked
- meaningful Nest distance documented
- higher-tier Nests farther/harder direction documented
- reference pack preserved
- Nature Young Dragon GLB registered for Three.js
- single-player browser target established
- GitHub/Vercel deployment direction established

Do NOT claim full gameplay migrated.

---

# 39. DO NOT IMPLEMENT DURING TASK 00

Do NOT implement:

- Egg stealing
- Guardian AI gameplay
- real Guardian chase
- hatching gameplay
- feeding gameplay
- growth gameplay
- Dragon mounting
- Dragon flight controls
- full Player controller
- final mobile controls
- economy
- Shop
- Collection
- persistence
- multiplayer
- backend
- authentication
- other creature families
- final Sanctuary art
- final biome art
- final UI

Only foundation / boot-scene work is authorized.

---

# 40. VALIDATION

Before claiming completion:

Run:

```bash
npm install
npm run typecheck
npm run build
```

if `typecheck` exists.

Start development server long enough to verify:

- page loads,
- Three.js renderer initializes,
- no immediate runtime crash,
- responsive resize works,
- minimal world displays,
- Sanctuary placeholder displays,
- distant world exists,
- Wild Nest markers appear at meaningfully different distances,
- Dragon GLB loads if configured.

If browser automation is available:

visually inspect the page.

Specifically inspect:

- whether Sanctuary feels like a city foundation,
- whether the world feels larger than an arena,
- whether Nest markers are actually spaced out,
- whether high-tier regions visually feel farther/higher.

If browser automation is NOT available:

say so clearly.

Do NOT fabricate visual inspection.

---

# 41. DOCUMENTATION VALIDATION

Check active Markdown links.

Verify:

- no reference image was renamed
- no reference image was deleted
- Roblox history remains recoverable
- active technical docs no longer describe Roblox Studio as runtime
- no Roblox APIs remain as active implementation dependencies
- no other monster family was implemented
- Dragon GLB runtime path is valid
- reference assets and runtime assets remain clearly separated
- Sanctuary city direction is documented
- world scale is documented
- Nest distance progression is documented
- no theft-state fast travel is documented
- active Dragon scope remains intact

---

# 42. GIT SAFETY

Before stopping:

show:

```bash
git status --short
git branch --show-current
git remote -v
```

Do NOT:

- commit
- push
- merge
- create pull request
- rewrite history

The user will review first.

---

# 43. COMPLETION REPORT

At the end, report:

## Repository Migration
What was moved, archived, renamed, or restructured.

## New Web Foundation
Files, dependencies, and architecture created.

## World Foundation
Describe:
- Sanctuary prototype
- surrounding world
- verticality
- Wild Nest marker spacing
- how distance progression was represented

## Documentation Updated
List important documents changed.

## Assets
State:
- where the Dragon GLB now lives
- whether it successfully loaded
- whether it contains rig/bones/animations

## Legacy Roblox
Describe what was preserved.

## Validation
Report results for:
- npm install
- typecheck
- build
- dev boot
- browser visual inspection if available

## Known Limitations
Clearly state everything intentionally deferred.

## Git Status
Show concise current state.

Then:

# STOP.

Do NOT begin `TASK_01_DRAGON_VERTICAL_SLICE.md`.
