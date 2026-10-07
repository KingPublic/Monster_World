# Technical Architecture

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), section 29, and [AGENTS.md](../../AGENTS.md).

The actual runtime, game objects, assets, scripts, UI, terrain, AI, and saving systems belong in the Roblox Studio place **Steal a Baby Dragon**. Later tasks use Roblox Studio MCP to inspect the existing DataModel and implement only the requested milestone while preserving working systems.

This local directory stores design specifications, references, tasks, balance planning, testing documentation, and asset planning. Local script synchronization is not configured. Task 00 introduces no Rojo, Script Sync, Wally, Aftman, Foreman, CI/CD, dependencies, or production Luau systems.

Prefer configurable systems to duplicated hardcoded values. Keep prototype assets replaceable. Do not invent major mechanics or silently resolve consequential ambiguities.

Production architecture and later systems remain TODO. The authorized Task 01 prototype organization is recorded below; it does not prescribe the complete game's future framework.

See [data model](DATA_MODEL.md), [save system](SAVE_SYSTEM.md), and [networking](NETWORKING.md).

## Confirmed V1 Configuration and Egg Authority

Future centralized per-nest configuration concept: EggSlotCount, EggSpawnPool, EggRespawnSeconds, Guardian, and Tier. Slot capacity targets 3–5 with individual counts; timer values are 300 seconds for standard nests and 600 for the TWO highest-tier nests. A slot timer starts only after its egg is taken. Untouched eggs remain available; no periodic whole-nest refresh is approved.

Egg slots are shared world resources. Egg claims must be server-authoritative so simultaneous players cannot both claim the same egg. Full shared-slot implementation remains Task 03. Task 01 validates one tutorial egg on the server, without live respawn timers.

Dragon Rarity, Element, and Growth Stage are independent. Stage-adjusted base Speed/Stamina/Boost precede rider multipliers. Food points, growth thresholds, prices, and scaling stay TBD in [Growth Values](../../../DATA/DRAGON_GROWTH_VALUES.md); later approved values should also be configurable. See [Nest Configs](../../../DATA/NEST_CONFIGS.md) and [Networking](NETWORKING.md).

## Task 01 Runtime

- `ReplicatedStorage/SBD`: prototype Config, shared Rules, State/Input/Action remotes.
- `ServerScriptService/SBD`: Bootstrap, WorldBuilder, TutorialService, GuardianService and FlightService. Server owns claims, progression, food/growth, Safe Zone, ride unlock and bounded flight.
- `ServerStorage/SBDAssets`: replaceable egg/Baby/Juvenile/Guardian templates and Art helper. `SBDTests/RulesChecks` contains validation checks.
- `StarterPlayerScripts/SBDClient`: Controller input/camera and HUD presentation; `StarterGui/SBDTutorialHUD` is the UI template.
- `Workspace/SBD_Tutorial`: scoped environment, owned session sanctuaries, one Starter Wild Nest and runtime models. Existing default scene objects preserved.

Session state only; no local script sync, production save system, full economy/Shop, or later milestone. See [implementation ledger](TASK_01_IMPLEMENTATION.md) and [tested inventory/results](../../TESTING/TASK_01_PLAYTEST_REPORT.md).
