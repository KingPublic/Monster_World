# Save Direction

Phase 1: local browser saves through localStorage and/or IndexedDB. The exact storage choice and versioned schema are TBD when an authorized persistence milestone needs them. Task 00 implements no saving and writes no progression to browser storage.

Future saves should consider owned Dragons, independent Rarity/Element/Growth Stage, Growth Progress, food, Rider multipliers/Carry Capacity, progression, Coins and equipped Dragon. Food/growth balance is still TBD. Define load/save validation, corrupt-save handling, versioning, migration, reset/export policy and slot cooldown restart rules later. Browser-local saves depend on the device/browser and may be cleared; user-facing behavior should be designed with the actual persistence feature.

Future: optional authenticated/cloud save only if explicitly required. Do not add Firebase, Supabase, a custom backend or user accounts during the migration. See [data model](DATA_MODEL.md) and [Task 04](../../TASKS/TASK_04_GROWTH_COLLECTION_ECONOMY.md).
