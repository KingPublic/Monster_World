# Dragon Sanctuary / Fantasy Dragon City

> Current MVP preserves Task 00's compact Dragon City and adds walkable terraces/stairs, physical service interactions, owned Dragons, Safe Zone markers and a Forest approach path. Hatchery, Food Shop, Collection, Rider upgrades and Mount court are functional.


Authority: [Master specification](../../MASTER_GAME_SPEC.md). An established compact fantasy settlement: safe, warm, magical, lived-in and a strong visual home landmark. The player uses its services and cares for Dragons; they do not construct buildings tile-by-tile.

## Physical Areas

Arrival court and central plaza form the visual center. Hatchery, Dragon habitats, Collection Hall, Mount/Dragon selection court, Rider Upgrade hall and Food/general Shop occupy connected districts. Paths, bridges, stairs/ramps, elevated terraces, cliffs, vegetation, water features, banners, Dragon statues and recognizable landmarks create a coherent city composition. Owned Dragons should be visible in-world where practical.

Future secured Eggs hatch into Babies here. Feeding grants Growth Progress; Young/Juvenile is the first rideable stage. Food is primarily bought with normal gameplay Coins; tutorial Starter Food is free and sufficient to reach first rideability quickly. Growth preserves Rarity and Element. These are preserved design, not Task 00 functionality.

## Task 00 Composition

[Sanctuary.ts](../../src/world/Sanctuary.ts) uses warm stone, teal/gold peaked roofs, timber trim, arched facades, small houses, lanterns, planted courts and layered service silhouettes. Broad terraced streets connect the arrival court, plaza and upper districts; a bridge spans the decorative stream. A static Nature Young Dragon occupies the Mount court as asset verification. Service markers identify composition only; they do not open gameplay interfaces.

The surrounding world extends well beyond the city. Higher progression generally reaches farther/harder nests, and the Guardian return journey makes that physical distance meaningful. No stolen-Egg state may use home teleportation or skip the escape. Task 00 camera presets inspect the layout and never move a player.

Inspect [Player-nest-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-v1.png), [services reference](../../REFERENCES/ENVIRONMENT/Player-nest-services-v1.png) and [art direction](../../REFERENCES/ART_DIRECTION/Art-direction-master-style-v1.png). Preserve image names; concepts do not lock prices, timers, services, Fast Travel or city-building.

Final buildings, habitat/owned-dragon displays, Safe Zone boundaries, interactions, navigation/collision and art remain TBD. See [Safe Zone](SAFE_ZONE.md), [Growth](../CREATURES/DRAGONS/DRAGON_GROWTH.md), [Shop/Food](../GAMEPLAY/SHOP_AND_FOOD.md) and [World Structure](WORLD_STRUCTURE.md).
