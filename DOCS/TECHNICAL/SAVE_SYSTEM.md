# Local Save System

[SaveSystem](../../src/systems/SaveSystem.ts) uses localStorage key `monster-world-save`, schema version **1**. Game saves after progression changes and reports storage problems through notifications.

Persisted fields: tutorial completion/step, Coins, Food, owned Dragon IDs/names/Rarity/Element/Stage/Growth, equipped Young Dragon, Carry level, Speed/Stamina/Boost upgrade levels and secured Eggs.

Data is deeply validated and whitelisted. Malformed IDs, duplicate identities, unsupported elements/stages and invalid equipped ownership are rejected; finite numeric values are bounded. Missing saves start fresh. Corrupt or unknown-version saves start a new adventure with feedback. Blocked/full storage falls back to session-only play. There is no old-version migration yet.

Player position, active flight, carried stolen Eggs, Guardian state and slot cooldowns are session state. Reload returns to Sanctuary, abandons carried loot and refills Nests. An interrupted first raid resumes the travel objective. Secured Eggs and owned Dragons survive reload.

A reset option exists only in development debug mode. Saves are local to the browser and origin; dev and preview URLs have separate storage. No accounts, backend, IndexedDB or cloud sync. See [domain model](DATA_MODEL.md) and [MVP validation](../../TASK_MVP_AUTONOMOUS_BUILD_REPORT.md).
