# Save System Planning

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), section 28.

Long-term progression is expected eventually to persist, including owned dragons, rider upgrades, progression, currency, and selected/equipped dragon. The exact save architecture will be designed later; Task 04 includes the persistence foundation.

Task 00 creates no datastore code, keys, save records, dependencies, or Studio systems. Owned eggs and dragons must remain safe from direct player theft under the confirmed multiplayer rule.

TODO: save schema, backend/API choice, load/save lifecycle, validation, migration, failure handling, and persistence acceptance criteria. Do not claim any saving functionality is implemented or tested yet.

See [Task 04](../../TASKS/TASK_04_HATCHING_COLLECTION_AND_ECONOMY.md) and [data model](DATA_MODEL.md).

## Growth and Food Planning

Later persistence design must consider Growth Stage/Progress and food ownership alongside owned dragons, universal rider upgrades, selected/equipped dragon, progression, and normal gameplay Coins. Feeding grows Baby → rideable Young/Juvenile → Adult without changing rarity or element. Exact schemas and save handling remain TBD.

Shared slot cooldown initialization/restart policy is not finalized by the per-slot respawn rule. Define it later without resetting untouched eggs during normal theft/respawn. No saving, offline growth, timer persistence, or datastore behavior is implemented or newly approved in this pass.
