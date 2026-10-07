> Historical Roblox prototype documentation. The following original README preserves prior implementation claims; it does not describe the active Monster World web runtime or current task status. Active rules live in [Monster World](../README.md). The external Studio place was not changed or exported by this migration.

# Steal a Baby Dragon

A Roblox game where players steal dragon eggs or baby dragons from guarded wild nests, escape angry parent dragons, return safely to their own nest, hatch collected eggs into Baby Dragons, feed and grow them into rideable dragons, upgrade rider capabilities, and travel farther to obtain increasingly rare dragons.

## Development workflow

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

## Roblox Studio

Roblox Studio is the actual game/runtime source. The connected experience is named **Steal a Baby Dragon**. Eventual Workspace objects, terrain, maps, UI, Scripts, LocalScripts, ModuleScripts, dragon assets, nest assets, guardian AI, gameplay systems, animations, VFX, and saving systems belong in the Studio place.

Task 00 establishes this local workspace only. It does not modify Roblox Studio. Future implementation tasks use Roblox Studio MCP and require inspection of the current place before changing it.

## Local repository

This directory is currently the source of truth for design documentation, visual references, task specifications, balancing plans, gameplay rules, testing requirements, and asset planning. Rojo and Script Sync are not configured by this setup; no local script synchronization tooling is introduced.

## Start here

- [Agent rules](AGENTS.md): reading order, scope, and preservation requirements.
- [Master game specification](MASTER_GAME_SPEC.md): confirmed design and explicitly unresolved decisions.
- [Milestones](TASKS/README.md): Task 00 and the future development sequence.
- [References](../REFERENCES/README.md): approved visual targets and the actual versioned reference index.
- [Design documentation](../DOCS/GAMEPLAY/CORE_LOOP.md): specialized documentation grouped by system.
- [Balance planning](../DATA/README.md): approved values and unresolved tables.
- [Testing](TESTING/README.md): acceptance and playtest documentation.
- [Asset manifest](ASSET_MANIFEST.md): asset planning without invented asset IDs.
- [Task prompt template](PROMPTS/CODEX_TASK_TEMPLATE.md): a reusable milestone brief.

The original [workspace setup prompt](PROMPTS/Steal_Baby_Dragon_Project_Setup_Prompt.md) is preserved as the setup source. Candidate rosters, examples, and targets in the documents are not final gameplay or production assets.

## Current Approved Design and References

Approved V1 visual references are present, together with the existing `GUI/HUD-v2.png` variation. Inventory at the Task 01 visual-replacement audit is **21 images**: the original 19 plus the Young turnaround and additional single view. The corresponding imported `StarterNatureYoung_v1` model is user-approved and integrated only as the first rideable Nature Juvenile; see [visual replacement report](TESTING/TASK_01_STARTER_VISUAL_REPLACEMENT.md). See [Reference Index](../REFERENCES/REFERENCE_INDEX.md). Preserve exact filenames and inspect relevant images before a milestone. Images guide visuals; gameplay decisions come from the master specification.

The sanctuary evokes Dragon Sanctuary / Dragon Village collection fantasy. The core loop is Steal → Escape → Secure → Hatch → Feed → Grow → Ride → Earn → Upgrade → Raid farther nests. Baby Dragons need growth before normal mounting; free tutorial Starter Food quickly unlocks the Young/Juvenile stage. Coins primarily buy food in the physical sanctuary Shop. See [Dragon Growth](../DOCS/CREATURES/DRAGONS/DRAGON_GROWTH.md) and [Shop and Food](../DOCS/GAMEPLAY/SHOP_AND_FOOD.md).

Confirmed controls: hold Left Shift for Sprint on foot and Boost while riding; mobile has a dedicated HOLD Boost button. Wild Nests target 3–5 slots with configurable per-slot respawn: 300 seconds for standard nests and 600 seconds for the two highest-tier nests, starting only after theft. Untouched eggs remain available; shared claims must be server-authoritative. Growth points, thresholds, prices, and final stat scaling remain TBD.

Task 00 and the documentation synchronization pass are complete. The user's subsequent authorization enabled Task 01 in the connected Studio place: the first playable tutorial is now COMPLETE, including theft/chase, Safe Zone, hatch, free feeding/growth, mounting, basic flight, held Boost, and desktop/touch HUD. See [Task 01 playtest report](TESTING/TASK_01_PLAYTEST_REPORT.md) for Studio changes, all 24 verified steps, prototype tuning and limitations. Tasks 02–05 remain NOT STARTED; review Task 01 before authorizing further work.

Task 01 uses one onboarding egg and conceptual slot markers; full shared 3–5 inventory and live 300/600-second timers remain Task 03. Gameplay source stays in Studio, with session-only progression and replaceable assets. The original setup prompt and Task 00 report are historical records; current approved rules are maintained in the master specification. City-building, Fast Travel, boss combat, and image-only monetization are not confirmed gameplay features.
