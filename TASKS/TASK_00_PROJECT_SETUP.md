# Task 00 — Project Setup

STATUS: COMPLETE

Roblox Studio modification allowed: NO

## Objective

Establish the local specification/reference workspace for **Steal a Baby Dragon** at `C:\Users\Adrian\Games\Steal-Baby-Dragon-Roblox` using [the original setup prompt](../Steal_Baby_Dragon_Project_Setup_Prompt.md).

## Scope

Create the requested directories, core documents, high-level milestone briefs, reference READMEs, specialized design stubs, balance tables, testing stubs, task template, and conservative `.gitignore`. Populate them only with supplied design decisions and clearly labeled unresolved details.

## Non-Goals

Do not modify Roblox Studio, create gameplay objects or Luau systems, generate production assets, initialize Rojo/Script Sync/Wally/Aftman/Foreman/CI/CD, install dependencies, or begin Task 01.

## Acceptance Criteria

- [x] Every required directory exists.
- [x] Every required core Markdown file and starter document exists and is non-empty.
- [x] No existing files were deleted or blindly overwritten.
- [x] No Roblox Studio objects were modified.
- [x] No unrelated tooling was initialized.

## Validation Procedure

Re-scan the workspace against the directory/file list in the setup prompt. Check original files against their initial SHA-256 hashes, confirm all required files have content and their local links resolve, inspect the scope and provisional values, and print the final tree. Mark COMPLETE only when every criterion passes, then stop.

## Completion Report

**Historical Task 00 snapshot:** the counts, tree, reference availability, and provisional design below describe the original setup, not the current synchronized workspace. Current references are registered in [REFERENCE_INDEX.md](../REFERENCES/REFERENCE_INDEX.md); current gameplay rules are maintained in [MASTER_GAME_SPEC.md](../MASTER_GAME_SPEC.md). The later documentation pass adds feeding/growth and replaces whole-nest refresh planning with theft-triggered per-slot respawn.

Verified on **2026-10-07** (Asia/Makassar). Task 00 is complete. The setup stops here; Tasks 01–05 remain NOT STARTED.

### Validation Results

| Check | Result |
| --- | --- |
| Required directories | PASS — all 19 directories exist. |
| Required files | PASS — all 54 new files exist and are non-empty: 53 Markdown files and `.gitignore`. |
| Master specification | PASS — all 32 requested sections are present. |
| Agent rules | PASS — `AGENTS.md` exactly matches the supplied rule block. |
| Local document links | PASS — all 219 local Markdown links resolve. |
| Asset manifest | PASS — all 15 requested asset entries are pending; no IDs are invented. |
| Expected references | PASS — all 24 expected PNG filenames are documented; no fake media files were created. |
| Gameplay acceptance sections | PASS — all 14 requested sections remain TODO for later design. |
| Reusable task template | PASS — all requested headings and the stop-after-this-task reminder are present. |
| Ignore patterns | PASS — requested document, image, data, Lua, and Luau extensions are preserved. |
| Existing files | PASS — the original prompt is preserved byte-for-byte; no existing files were deleted. |
| Extra structure / tooling | PASS — no unexpected directories, duplicate structure, dependencies, or unrelated tooling were introduced. |
| Roblox Studio changes | PASS — no Roblox Studio MCP calls were made, so this task performed no Studio writes. |

### Created Files

| Area | New files | Contents |
| --- | --- | --- |
| Project root | 6 | Project README, agent rules, 32-section master specification, changelog, asset manifest, conservative `.gitignore`. |
| TASKS/ | 7 | Milestone README, this setup task/report, and high-level briefs for Tasks 01–05. |
| REFERENCES/ | 7 | Main reference README plus art direction, GUI, dragon, environment, animation, and audio READMEs. |
| DOCS/ | 21 | Gameplay, dragon, world, guardian AI, UI/UX, and technical starter documents. |
| DATA/ | 6 | Data README plus dragon stats, rider values, egg pools, nest configs, and economy planning tables. |
| TESTING/ | 4 | Testing README, acceptance TODOs, future playtest process, empty bug log. |
| PROMPTS/ | 2 | Prompt README and reusable task template. |
| ARCHIVE/ | 1 | Archive usage README. |
| **Total** | **54** | Every created file is listed in the final tree below. |

### Preserved Existing Files

The only pre-existing file was `Steal_Baby_Dragon_Project_Setup_Prompt.md` (26,100 bytes). It remains at the project root, unchanged. Its initial and verified SHA-256 are:

```text
0256D694411D45CC6A3A1BE11B38C94948C3BD982B07AA1EE4F0E8968230DDF0
```

At original Task 00 completion, the workspace contained 55 files: 54 created files and the preserved original prompt.

### Conflicts and Deviations

None. There was no existing specification structure to merge, and no non-empty files were overwritten blindly. The preserved source prompt is retained in addition to the requested structure.

### Original Setup Limitations (Historical)

- Original Task 00 input contained documentation only. Current approved visual images are now registered in [REFERENCE_INDEX.md](../REFERENCES/REFERENCE_INDEX.md); the historical tree below intentionally preserves the initial setup snapshot.
- Candidate rarity/element rosters, final balancing, currencies, income rules, guardian abilities, detailed multiplayer rules, technical architecture, and save schema remain unresolved.
- The supplied Carry Capacity progression is recorded as current intent. Approximately 1–3 minutes of onboarding and approximately 5 minutes between nest inventory refreshes remain targets rather than final balancing.
- Studio was not inspected or playtested. No gameplay, persistence, multiplayer, or performance functionality is claimed to be implemented or verified.
- Rojo, Script Sync, Wally, Aftman, Foreman, CI/CD, and dependency tooling were not initialized. No game implementation was started.

### Final Directory Tree

```text
Steal-Baby-Dragon-Roblox/
├── ARCHIVE/
│   └── README.md
├── DATA/
│   ├── DRAGON_STATS.md
│   ├── ECONOMY_BALANCE.md
│   ├── EGG_SPAWN_POOLS.md
│   ├── NEST_CONFIGS.md
│   ├── README.md
│   └── RIDER_UPGRADE_VALUES.md
├── DOCS/
│   ├── AI/
│   │   └── GUARDIAN_AI.md
│   ├── DRAGONS/
│   │   ├── DRAGON_SYSTEM.md
│   │   ├── ELEMENT_SYSTEM.md
│   │   ├── RARITY_SYSTEM.md
│   │   └── RIDER_UPGRADES.md
│   ├── GAMEPLAY/
│   │   ├── CORE_LOOP.md
│   │   ├── EGG_SYSTEM.md
│   │   ├── PROGRESSION.md
│   │   └── TUTORIAL_FLOW.md
│   ├── TECHNICAL/
│   │   ├── ARCHITECTURE.md
│   │   ├── DATA_MODEL.md
│   │   ├── NETWORKING.md
│   │   └── SAVE_SYSTEM.md
│   ├── UI_UX/
│   │   ├── DRAGON_COLLECTION_GUI.md
│   │   ├── HATCHING_GUI.md
│   │   ├── HUD_SPEC.md
│   │   └── UPGRADE_GUI.md
│   └── WORLD/
│       ├── PLAYER_NEST.md
│       ├── SAFE_ZONE.md
│       ├── WILD_NEST_SYSTEM.md
│       └── WORLD_STRUCTURE.md
├── PROMPTS/
│   ├── CODEX_TASK_TEMPLATE.md
│   └── README.md
├── REFERENCES/
│   ├── ANIMATION/
│   │   └── README.md
│   ├── ART_DIRECTION/
│   │   └── README.md
│   ├── AUDIO/
│   │   └── README.md
│   ├── DRAGONS/
│   │   └── README.md
│   ├── ENVIRONMENT/
│   │   └── README.md
│   ├── GUI/
│   │   └── README.md
│   └── README.md
├── TASKS/
│   ├── README.md
│   ├── TASK_00_PROJECT_SETUP.md
│   ├── TASK_01_CORE_TUTORIAL.md
│   ├── TASK_02_DRAGON_FLIGHT_AND_STATS.md
│   ├── TASK_03_WILD_NESTS_AND_GUARDIANS.md
│   ├── TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md
│   └── TASK_05_CONTENT_POLISH_AND_RELEASE.md
├── TESTING/
│   ├── ACCEPTANCE_CRITERIA.md
│   ├── BUG_LOG.md
│   ├── PLAYTEST_CHECKLIST.md
│   └── README.md
├── .gitignore
├── AGENTS.md
├── ASSET_MANIFEST.md
├── CHANGELOG.md
├── MASTER_GAME_SPEC.md
├── README.md
└── Steal_Baby_Dragon_Project_Setup_Prompt.md
```

**Stop condition:** Task 00 is complete. Do not proceed to Task 01 without a new request.
