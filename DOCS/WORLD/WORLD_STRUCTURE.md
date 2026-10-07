# Monster World Structure

> Current MVP preserves the 12,000-unit terrain extent and Nest coordinates. Horizontal Sanctuary distances are about 460 / 1,191 / 2,519 / 3,905 units, with elevations 25 / 145 / 330 / 620. Nests are functional and are not moved closer for testing.


Authority: [Master specification](../../MASTER_GAME_SPEC.md). Task 00 is a spatial inspection foundation; no traversal, theft, chase or region progression is live.

## Home and Physical Travel

The Sanctuary is an established compact fantasy Dragon City embedded in a valley. It is the warm, safe home and future collection/progression hub, not city-building gameplay. Streets, plazas, layered architecture, bridges and terraces connect its physical districts.

World scale is gameplay, not merely scenery. Starter nests lie relatively close; mid-tier nests lie clearly farther; high-tier nests are substantially farther; highest-tier journeys are among the longest. Greater distance generally accompanies elevation, harder terrain, more exposed traversal, stronger Guardian pressure and rarer pools. Natural geography matters; avoid a perfect vertical tower. Do not put all nests within seconds of home, inside one arena or visible from the central plaza.

The return journey while carrying a stolen Egg is core difficulty. A Guardian must not disengage solely at long distance. Arrival at the Sanctuary/Safe Zone is the successful escape condition. While carrying stolen Eggs, no direct teleport home, instant warp, skipped physical return or travel mechanic may cancel the chase. Convenience travel outside theft is optional future scope, not V1 requirement.

## Route Mastery

Important nests should have recognizable approaches and readable escape routes, navigation landmarks, obstacles, safer paths and risky shortcuts. Route knowledge, movement skill, Dragon performance and Rider upgrades all contribute to mastery. Exact route hazards and traversal design are TBD.

## Task 00 Geometry

[gameConfig.ts](../../src/config/gameConfig.ts) centralizes Sanctuary footprint, terrain extent, region/marker positions, elevations and camera framing. A continuous procedural valley terrain rises into forest hills, highlands, volcanic ridges and a distant frost summit. The order is directional, not a locked biome roster.

Four non-functional markers communicate progression. Their coordinates and approximate horizontal distances are review values only; they do not define final distances, travel times, levels, egg pools or the two nests receiving 600-second timers. Orbit inspection views are development tools, not player fast travel. Final collision and route feasibility require later gameplay playtesting.

See [Sanctuary](PLAYER_SANCTUARY.md), [Wild Nests](WILD_NEST_SYSTEM.md), [Nest Configs](../../DATA/NEST_CONFIGS.md) and [environment references](../../REFERENCES/ENVIRONMENT/README.md).
