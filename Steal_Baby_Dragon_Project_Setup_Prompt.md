# Codex Prompt — Project Workspace Setup  
## Steal a Baby Dragon (Roblox)

You are setting up the local development workspace for a Roblox game project called:

# **STEAL A BABY DRAGON**

**LOCAL PROJECT ROOT**

```text
C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox
```

---

# 0. IMPORTANT PROJECT WORKFLOW

This local directory is **NOT** intended to replace Roblox Studio as the game runtime or primary place editor.

The local directory exists primarily as the project's:

- design bible
- visual reference library
- gameplay specification workspace
- balancing/data documentation workspace
- milestone/task workspace
- testing documentation workspace
- asset planning workspace

The **actual Roblox game implementation** will be performed directly inside the connected Roblox Studio place through **Roblox Studio MCP** in later tasks.

The current Roblox Studio experience is:

```text
Steal a Baby Dragon
```

Roblox Studio is already connected to Codex through MCP.

However, for **THIS setup task only**:

> **DO NOT MODIFY ROBLOX STUDIO.**

Do not create Roblox objects, scripts, GUI, terrain, assets, or gameplay systems yet.

This task only establishes the local reference/specification workspace that Codex must read before future implementation tasks.

Future workflow:

```text
ChatGPT / Game Design
        ↓
Visual References + Specifications
        ↓
Local Project Workspace
        ↓
Codex reads the current task
        ↓
Roblox Studio MCP
        ↓
Implementation directly in Roblox Studio
        ↓
Playtest
        ↓
Review / Fix
        ↓
Next milestone
```

---

# 1. SAFETY / EXISTING PROJECT CHECK

First inspect:

```text
C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox
```

If the directory already contains files:

- preserve them
- do not delete them
- do not overwrite non-empty files blindly
- merge safely where appropriate
- report any conflicts
- report any unexpected existing structure

If the directory is empty, proceed normally.

Do not initialize unrelated tooling.

---

# 2. CREATE THIS PROJECT STRUCTURE

Create the following structure:

```text
Steal-Baby-Dragon-Roblox/
│
├── README.md
├── AGENTS.md
├── MASTER_GAME_SPEC.md
├── CHANGELOG.md
├── ASSET_MANIFEST.md
├── .gitignore
│
├── TASKS/
│   ├── README.md
│   ├── TASK_00_PROJECT_SETUP.md
│   ├── TASK_01_CORE_TUTORIAL.md
│   ├── TASK_02_DRAGON_FLIGHT_AND_STATS.md
│   ├── TASK_03_WILD_NESTS_AND_GUARDIANS.md
│   ├── TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md
│   └── TASK_05_CONTENT_POLISH_AND_RELEASE.md
│
├── REFERENCES/
│   ├── README.md
│   │
│   ├── ART_DIRECTION/
│   │   └── README.md
│   │
│   ├── GUI/
│   │   └── README.md
│   │
│   ├── DRAGONS/
│   │   └── README.md
│   │
│   ├── ENVIRONMENT/
│   │   └── README.md
│   │
│   ├── ANIMATION/
│   │   └── README.md
│   │
│   └── AUDIO/
│       └── README.md
│
├── DOCS/
│   ├── GAMEPLAY/
│   │   ├── CORE_LOOP.md
│   │   ├── TUTORIAL_FLOW.md
│   │   ├── EGG_SYSTEM.md
│   │   └── PROGRESSION.md
│   │
│   ├── DRAGONS/
│   │   ├── DRAGON_SYSTEM.md
│   │   ├── ELEMENT_SYSTEM.md
│   │   ├── RARITY_SYSTEM.md
│   │   └── RIDER_UPGRADES.md
│   │
│   ├── WORLD/
│   │   ├── WORLD_STRUCTURE.md
│   │   ├── WILD_NEST_SYSTEM.md
│   │   ├── PLAYER_NEST.md
│   │   └── SAFE_ZONE.md
│   │
│   ├── AI/
│   │   └── GUARDIAN_AI.md
│   │
│   ├── UI_UX/
│   │   ├── HUD_SPEC.md
│   │   ├── UPGRADE_GUI.md
│   │   ├── DRAGON_COLLECTION_GUI.md
│   │   └── HATCHING_GUI.md
│   │
│   └── TECHNICAL/
│       ├── ARCHITECTURE.md
│       ├── DATA_MODEL.md
│       ├── SAVE_SYSTEM.md
│       └── NETWORKING.md
│
├── DATA/
│   ├── README.md
│   ├── DRAGON_STATS.md
│   ├── RIDER_UPGRADE_VALUES.md
│   ├── EGG_SPAWN_POOLS.md
│   ├── NEST_CONFIGS.md
│   └── ECONOMY_BALANCE.md
│
├── TESTING/
│   ├── README.md
│   ├── ACCEPTANCE_CRITERIA.md
│   ├── PLAYTEST_CHECKLIST.md
│   └── BUG_LOG.md
│
├── PROMPTS/
│   ├── README.md
│   └── CODEX_TASK_TEMPLATE.md
│
└── ARCHIVE/
    └── README.md
```

---

# 3. INITIAL FILE CONTENT

Do not leave important Markdown files completely blank.

Create concise starter content based only on confirmed game decisions.

Do **not** invent major gameplay systems or final balancing values.

---

## README.md

Create:

```markdown
# Steal a Baby Dragon

A Roblox game where players steal dragon eggs or baby dragons from guarded wild nests, escape angry parent dragons, return safely to their own nest, hatch collected eggs, ride dragons, upgrade rider capabilities, and travel farther to obtain increasingly rare dragons.
```

Include this development workflow:

```text
Design / References
        ↓
MASTER_GAME_SPEC
        ↓
Milestone Task
        ↓
Codex
        ↓
Roblox Studio MCP
        ↓
Implementation in Roblox Studio
        ↓
Playtest
        ↓
Review
        ↓
Next Milestone
```

Clearly state:

### Roblox Studio

Roblox Studio is the actual game/runtime source and contains the eventual:

- Workspace objects
- terrain
- maps
- UI
- Scripts
- LocalScripts
- ModuleScripts
- dragon assets
- nest assets
- guardian AI
- gameplay systems
- animations
- VFX
- saving systems

### Local repository

This local directory is currently the source of truth for:

- design documentation
- visual references
- task specifications
- balancing plans
- gameplay rules
- testing requirements
- asset planning

Do **not** claim that Rojo or Script Sync is configured.

---

# 4. AGENTS.md

This file is extremely important.

Create the following project-wide rules.

```markdown
# Agent Rules

Before implementing any gameplay milestone:

1. Read `MASTER_GAME_SPEC.md`.
2. Read the current file under `TASKS/`.
3. Read all specialized documentation referenced by that task.
4. Inspect all relevant visual references under `REFERENCES/`.
5. Inspect the current Roblox Studio DataModel through MCP.
6. Implement ONLY the current milestone.
7. Do not implement future milestones unless a minimal interface/stub is strictly required.
8. Do not invent major gameplay mechanics not defined by the specifications.
9. Do not substantially change the approved visual direction.
10. Prefer configurable systems over duplicated hardcoded values.
11. Never delete or rename important Studio objects unless explicitly required.
12. Preserve existing working systems.
13. Use replaceable placeholder assets when production assets are unavailable.
14. Do not treat concept/reference images as automatically final assets.
15. Keep prototype assets replaceable.
16. After implementation, perform a Roblox Studio playtest.
17. Inspect Output/errors/warnings.
18. Fix regressions caused by the current task.
19. Verify every acceptance criterion.
20. Report exactly what was changed.
21. Report known limitations.
22. Stop after completing the requested milestone.

## Specification Priority

When information conflicts, use this order:

1. `MASTER_GAME_SPEC.md`
2. Current `TASKS/TASK_XX_*.md`
3. Specialized files under `DOCS/`
4. Canonical values under `DATA/`
5. Approved visual references under `REFERENCES/`
6. Existing implementation
7. Agent assumptions

If a genuine ambiguity could materially affect architecture, progression, economy, or gameplay, report it instead of silently inventing a major system.

## Roblox Studio Rule

The actual Roblox game is implemented inside Roblox Studio.

The local repository exists primarily for specifications, references, tasks, balancing, and development documentation unless a later task explicitly introduces local script synchronization tooling.
```

---

# 5. MASTER_GAME_SPEC.md

Create:

```markdown
# Steal a Baby Dragon — Master Game Specification
```

Create the following sections:

```text
## 1. Game Vision
## 2. Core Fantasy
## 3. Core Gameplay Loop
## 4. Player Character
## 5. Dragon Mounts
## 6. Dragon Rarity
## 7. Dragon Elements
## 8. Dragon Base Stats
## 9. Rider Permanent Upgrades
## 10. Carry Capacity
## 11. Boost and Stamina
## 12. Wild Dragon Nests
## 13. Egg Spawn and Refresh
## 14. Guardian Dragons
## 15. Guardian Chase Rules
## 16. Player Nest
## 17. Safe Zone
## 18. Hatching
## 19. Dragon Collection
## 20. Economy
## 21. Tutorial
## 22. World Progression
## 23. UI/UX
## 24. Animation Direction
## 25. Art Direction
## 26. Multiplayer Rules
## 27. Monetization Principles
## 28. Saving / Persistence
## 29. Technical Architecture
## 30. MVP Scope
## 31. Out of Scope
## 32. Milestones
```

Populate the document with only the confirmed high-level facts below.

---

## CONFIRMED GAME DESIGN

### Core concept

The game is currently called:

**Steal a Baby Dragon**

Players steal dragon eggs or baby dragons from wild nests protected by parent/guardian dragons.

The core gameplay loop is:

```text
Explore
↓
Find a wild nest
↓
Inspect available eggs/baby dragons
↓
Steal
↓
Guardian becomes aggressive
↓
Escape while being chased
↓
Reach the player's safe zone
↓
Secure the stolen egg/baby dragon
↓
Hatch / collect
↓
Ride dragons
↓
Earn progression resources
↓
Upgrade rider capabilities
↓
Travel farther
↓
Raid rarer nests
↓
Repeat
```

### Player beginning

- Players begin the tutorial on foot.
- The first approximately 1–3 minutes act as an onboarding/tutorial sequence.
- The player is directed to a nearby beginner wild nest.
- The player steals their first tutorial egg.
- A beginner guardian dragon pursues them.
- The player returns to their own player nest/safe zone.
- The tutorial egg hatches quickly.
- The first hatch gives the player their first rideable dragon.
- From that point onward, dragon flight becomes a central movement mechanic.

### Dragons are mounts

- Hatched dragons can become rideable mounts.
- Dragons have their own base movement stats.
- Different dragons can have different movement profiles.
- Smooth dragon movement and animation are high priorities.

### Dragon base stats

The currently confirmed base stats are:

- Speed
- Stamina
- Boost

Do not finalize balancing values yet.

### Dragon rarity

Dragon rarity and dragon element are separate properties.

Possible rarity structure may include categories such as:

- Common
- Uncommon
- Rare
- Epic
- Legendary
- Mythic
- potentially special/secret tiers later

Do not finalize all tiers unless explicitly required later.

A dragon can therefore be something like:

```text
Mythic Fire Dragon
Mythic Ice Dragon
Mythic Storm Dragon
```

without rarity and element being the same system.

### Dragon elements

Elements may include:

- Nature
- Fire
- Ice
- Storm
- Earth
- Shadow
- Light / Celestial

The exact final element roster is not locked yet.

Elements should primarily influence movement identity, visual identity, and potentially specialized stats rather than turning the MVP into a combat-heavy RPG.

### Rider upgrades

The player/rider has permanent universal upgrades.

These upgrades affect **every dragon the player rides**.

Current confirmed rider upgrade categories:

- Speed multiplier
- Stamina multiplier
- Boost multiplier
- Carry Capacity

Conceptual formula:

```text
Final Speed
=
Dragon Base Speed
×
Rider Speed Multiplier
```

Likewise for Stamina and Boost.

Do not lock final multiplier progression values yet.

### Carry Capacity

Carry Capacity is a permanent rider upgrade.

Current intended progression:

```text
Level 1 = 1 egg
Level 2 = 2 eggs
Level 3 = 3 eggs (maximum currently planned)
```

Visual concept:

- At Carry 1, one egg is associated with/carried by the rider.
- At Carry 2, an additional egg can be carried physically by the dragon.
- At Carry 3, the intended visual concept is:
  - one egg carried/held by the rider
  - one egg carried by one dragon foot/talon
  - one egg carried by the other dragon foot/talon

The carry system should feel physical and visually readable rather than behaving only like an invisible inventory.

### Flight

Dragon flight should feel smooth, polished, and responsive.

The desired movement feel includes future support for:

- takeoff
- normal flight
- gliding
- turning/banking
- ascending
- descending
- landing
- boosting

Do not implement these systems during Task 00.

### Boost

Boost is:

**Hold-to-use**

not repeated button tapping.

While Boost is held:

- dragon speed increases
- stamina drains substantially faster

When Boost is released:

- dragon returns smoothly toward normal flight speed
- stamina can regenerate according to future balancing rules

The system should avoid requiring frequent repeated Shift presses.

### Wild nests

The world contains multiple wild dragon nests.

Nests should not simply form a perfectly vertical tower.

Instead:

- later nests generally become farther away
- later nests can gradually become higher
- travel/escape distance increases
- environments can become more dangerous or visually distinct
- better egg pools appear farther into progression

The longer return journey is important because guardian pursuit is a major part of the game's tension.

### Egg availability

Each wild nest can contain multiple eggs simultaneously.

Each nest has:

- its own egg spawn slots
- its own possible egg pool
- its own rarity distribution
- its own guardian dragon

Current design target:

```text
Nest egg inventory refresh ≈ every 5 minutes
```

This is **not final balancing** and must be validated during playtesting.

A nest should not necessarily contain only one egg type.

Different eggs can appear inside the same nest according to that nest's spawn pool.

### Guardian dragons

Each wild nest has its own protective parent/guardian dragon.

Examples may include:

- Mommy Dragon
- Daddy Dragon
- elemental guardian variants

Guardian difficulty should generally increase as the player reaches more valuable nests.

Guardian progression should not rely only on raw speed.

Future guardians may differ through:

- pursuit behavior
- ranged pressure
- elemental effects
- acceleration
- movement patterns
- environmental interaction

Do not finalize abilities during Task 00.

### Guardian chase rule

This is a core game rule.

When a player steals an egg/baby dragon from a wild nest:

```text
Steal
↓
That nest's guardian becomes aggressive
↓
Guardian pursues the thief
↓
Guardian continues pursuing throughout the return journey
↓
Player enters their own safe zone
↓
Stolen item is secured
↓
Guardian stops pursuing
↓
Guardian returns to its original wild nest
```

The guardian should **not simply lose aggro because the player flew far enough away**.

Safe-zone arrival is the primary successful end condition for the chase.

### PvP stealing

Players do **NOT** steal eggs or dragons from other players.

The primary stealing interaction is:

```text
Player
vs
Wild Guardian NPC
```

rather than:

```text
Player
vs
Player inventory/base
```

Player collections should feel safe from direct theft by other players.

### Player nest

Each player has their own nest/base.

The player nest acts as:

- home
- safe zone
- hatch area
- dragon collection area
- mount selection area
- progression hub

The nest should visually develop later, but progression details are not finalized.

### Hatching

Stolen eggs are returned to the player nest and hatched.

The tutorial egg should hatch very quickly so the player receives their first mount within the opening tutorial.

Later hatch timing is not finalized.

Hatching should eventually include satisfying animation/VFX rather than an instant asset swap.

### Dragon collection

Hatched dragons belong to the player.

Collected dragons should be visible as meaningful collectibles rather than existing only as abstract inventory records.

Players should eventually be able to:

- inspect owned dragons
- compare dragon stats
- select a dragon
- ride/equip a dragon

### World progression

Progression is primarily spatial and capability-based.

Players begin near easier nests.

As progression increases:

```text
distance ↑
general elevation ↑
guardian difficulty ↑
egg quality ↑
rarity potential ↑
escape difficulty ↑
```

Avoid unnecessary hard level walls when possible.

The intended fantasy is that stronger player progression and stronger dragons allow the player to successfully raid increasingly difficult locations.

### UI / UX

The GUI direction should be:

- clean
- highly readable
- modern
- polished
- fantasy themed
- appropriate for desktop and mobile
- not excessively cluttered

Expected future UI includes:

- coins/resources
- stamina
- boost
- carry count
- current dragon
- tutorial objective
- rider upgrades
- dragon collection
- hatching UI

Approved reference images placed under `REFERENCES/GUI/` should guide the visual direction.

### Art direction

Current desired art direction:

**Stylized Premium Fantasy / Premium Toy-Fantasy**

Avoid:

- hyper-realistic visual direction
- extremely childish/chibi-only presentation
- inconsistent asset packs
- generic low-quality AI-generated appearance

Desired characteristics:

- polished
- attractive
- smooth
- readable silhouettes
- slightly stylized
- collectible
- colorful but controlled
- premium Roblox feel
- dragons can be cute when young but impressive when used as mounts
- guardian dragons should feel larger and more intimidating

Visual references are concept targets, not automatically final production assets.

### Animation direction

Smoothness is a major quality goal.

Future dragon animation states may include:

- idle
- breathing
- walking
- running
- takeoff
- normal flight
- flap
- glide
- bank left
- bank right
- ascend
- descend
- boost
- landing

Guardians may eventually require:

- sleep/idle
- alert
- roar
- takeoff
- chase
- attack
- disengage at safe zone
- return-to-nest behavior

Hatching should eventually include:

- egg movement
- cracking
- elemental VFX
- hatch reveal
- baby dragon emergence

Do not implement these during Task 00.

### Prototype asset philosophy

High-quality final dragon models may require later:

- mesh generation or modeling
- optimization
- rigging
- skinning
- animation
- Roblox importing
- review and iteration

Codex must not assume temporary/generated assets are production-final.

All prototype assets should remain replaceable.

### Multiplayer

Players can share the world.

Players can compete naturally for available wild nest eggs, but player-owned eggs/dragons cannot be stolen.

Detailed multiplayer rules will be defined later.

### Monetization

Monetization is not part of the current implementation task.

Current principle:

- do not design the core game as mandatory pay-to-win
- monetization should not remove the need to play the main loop
- convenience/cosmetic opportunities can be considered later

### Saving

Long-term progression is expected eventually to persist, including things such as:

- owned dragons
- rider upgrades
- progression
- currency
- selected/equipped dragon

The exact save architecture will be designed later.

---

# 6. TASK FILES

## TASK_00_PROJECT_SETUP.md

Set:

```text
STATUS: IN PROGRESS
```

Explain that the goal is only to establish the local specification/reference workspace.

Explicitly state:

```text
Roblox Studio modification allowed: NO
```

Acceptance criteria:

- required directories exist
- core Markdown files exist
- no existing files were deleted
- no Roblox Studio objects were modified
- no unrelated tooling was initialized

---

## TASK_01_CORE_TUTORIAL.md

Set:

```text
STATUS: NOT STARTED
```

High-level objective only:

Create the first playable vertical slice:

```text
Spawn on foot
↓
Steal first tutorial egg
↓
Guardian chase
↓
Reach player safe zone
↓
Secure egg
↓
Hatch first dragon
↓
Mount first dragon
↓
Basic tutorial complete
```

Do not provide detailed implementation instructions yet.

---

## TASK_02_DRAGON_FLIGHT_AND_STATS.md

Set:

```text
STATUS: NOT STARTED
```

High-level objective:

- dragon mounting
- smooth flight
- Speed
- Stamina
- hold-to-Boost
- Rider multipliers
- Carry Capacity 1–3

Do not implement.

---

## TASK_03_WILD_NESTS_AND_GUARDIANS.md

Set:

```text
STATUS: NOT STARTED
```

High-level objective:

- multiple wild nests
- nest progression
- egg spawn pools
- refresh system
- guardians
- chase-to-safe-zone rule

Do not implement.

---

## TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md

Set:

```text
STATUS: NOT STARTED
```

High-level objective:

- hatching
- dragon ownership
- collection
- mount selection
- player nest functionality
- income/economy
- persistence foundation

Do not implement.

---

## TASK_05_CONTENT_POLISH_AND_RELEASE.md

Set:

```text
STATUS: NOT STARTED
```

High-level objective:

- additional content
- refined art
- animation polish
- UI polish
- mobile support
- VFX/SFX
- balancing
- multiplayer testing
- performance
- monetization only after the core game is proven fun

Do not implement.

---

# 7. ASSET_MANIFEST.md

Create a table with:

```text
Asset
Category
Prototype Status
Final Status
Reference
Source
Notes
```

Add placeholder rows for:

- Starter Egg
- Common Nature Dragon
- Starter Guardian Dragon
- Player Nest
- Wild Nest
- Safe Zone
- Tutorial HUD
- Flight HUD
- Rider Upgrade GUI
- Dragon Collection GUI
- Fire Dragon Family
- Ice Dragon Family
- Storm Dragon Family
- Forest Guardian
- Volcano Guardian

Mark as pending unless an actual local asset is already found.

Do not invent asset IDs.

---

# 8. REFERENCES

## REFERENCES/README.md

Explain:

- these folders contain approved visual references
- references establish visual targets
- agents should inspect them before implementing relevant tasks
- reference images are **not automatically production-final assets**
- gameplay rules in `MASTER_GAME_SPEC.md` override ambiguous visual details

---

## REFERENCES/GUI/README.md

Document expected future files:

```text
tutorial_hud_reference.png
flight_hud_reference.png
rider_upgrade_gui_reference.png
dragon_collection_gui_reference.png
hatch_gui_reference.png
```

---

## REFERENCES/DRAGONS/README.md

Document expected future files:

```text
dragon_style_reference.png
nature_family_reference.png
fire_family_reference.png
ice_family_reference.png
storm_family_reference.png
guardian_reference.png
dragon_scale_reference.png
```

---

## REFERENCES/ENVIRONMENT/README.md

Document expected future files:

```text
world_overview_reference.png
starter_valley_reference.png
player_nest_reference.png
wild_nest_reference.png
mountain_progression_reference.png
safe_zone_reference.png
```

---

## REFERENCES/ANIMATION/README.md

Document expected future files:

```text
flight_reference.png
takeoff_landing_reference.png
boost_reference.png
egg_carry_reference.png
guardian_chase_reference.png
hatch_reference.png
```

Do not create fake image files.

Only document expected filenames.

---

# 9. DATA/README.md

State:

`DATA/` contains canonical planned balancing values and design tables.

Future Roblox configuration modules should derive from approved values stored here where practical.

Do not create final production balancing numbers yet.

---

# 10. TESTING/ACCEPTANCE_CRITERIA.md

Create TODO sections for:

```text
## Tutorial
## Egg Stealing
## Guardian Chase
## Safe Zone
## Hatching
## Mounting
## Flight
## Boost
## Stamina
## Carry Capacity
## UI
## Saving
## Multiplayer
## Performance
```

Do not fabricate detailed tests before the relevant milestone is designed.

---

# 11. PROMPTS/CODEX_TASK_TEMPLATE.md

Create this reusable structure:

```markdown
# Task

## Objective

## Required Reading

## Visual References

## Existing Systems to Preserve

## Requirements

## Non-Goals

## Roblox Studio Changes Allowed

## Acceptance Criteria

## Playtest Procedure

## Completion Report
```

Add a reminder:

```text
Implement only this task.
Do not automatically continue to the next milestone.
```

---

# 12. .gitignore

Create a conservative `.gitignore`.

Ignore common:

- OS metadata
- editor caches
- temporary files
- logs

Do **NOT** ignore:

- Markdown
- PNG
- JPG/JPEG
- WebP
- JSON
- Lua
- Luau
- specification files
- reference images

---

# 13. DO NOT INITIALIZE EXTRA TOOLING

For this task:

DO NOT:

- initialize Rojo
- enable/configure Script Sync
- configure Wally
- configure Aftman
- configure Foreman
- create CI/CD
- install dependencies
- create production Luau systems
- modify Roblox Studio
- create gameplay objects
- generate production assets

Those decisions belong to later milestones.

---

# 14. ROBLOX STUDIO MCP

Roblox Studio MCP is connected and will be used later.

For this task:

- you may verify that the MCP connection exists only if necessary
- do not write to Roblox Studio
- do not create test objects
- do not alter the DataModel

This setup task concerns the local project workspace only.

---

# 15. VALIDATION

After creating the structure:

1. Re-scan:

```text
C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox
```

2. Verify every required directory exists.
3. Verify all important Markdown files exist.
4. Ensure no accidental duplicate directories were created.
5. Ensure no existing user files were deleted.
6. Ensure Roblox Studio was not modified.
7. Print the final directory tree.
8. Summarize all created files.
9. Report any existing files intentionally preserved.
10. Report any conflicts or deviations.
11. Report whether the setup task is complete.

Then update:

```text
TASKS/TASK_00_PROJECT_SETUP.md
```

to:

```text
STATUS: COMPLETE
```

only if every setup acceptance criterion has been met.

Then **STOP**.

Do not proceed to `TASK_01_CORE_TUTORIAL.md`.

Do not start implementing the Roblox game yet.
