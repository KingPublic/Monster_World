# Networking Direction

The initial Monster World web version is single player. V1 has no multiplayer synchronization requirement. Egg-slot state, future theft, growth and progression will belong to the local browser runtime. Task 00 has none of these gameplay systems.

The old server/client and shared egg-claim architecture is obsolete for the active project; its records remain in [LEGACY_ROBLOX](../../LEGACY_ROBLOX/README.md). Do not implement remotes, WebSockets, networking frameworks, backends or accounts. Future multiplayer, validation and concurrency require separate authorization and design.

Preserved egg rules still apply locally: configurable 3–5 slots; theft empties only that slot; standard cooldown 300 seconds, 600 at the two highest-tier nests; untouched eggs are not reset. Guardian pursuit stops successfully at the Sanctuary/Safe Zone, never solely at distance. No theft-state fast travel. These rules are documentation only until authorized gameplay tasks implement them.
