# Guardian AI

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 14–15.

Each wild nest has a protective parent/guardian. Stealing makes that nest's guardian aggressive toward the thief. Pursuit continues throughout the return journey until successful arrival in the player's own safe zone, where the stolen item is secured. The guardian then stops and returns to its original nest. **Distance alone must not end aggression.**

Guardians generally become harder at more valuable nests. Difficulty should not rely only on raw speed. Possible future variation includes pursuit behavior, ranged pressure, elemental effects, acceleration, movement patterns, and environmental interaction; no abilities are finalized here.

Future animation targets may include sleep/idle, alert, roar, takeoff, chase, attack, safe-zone disengagement, and return to nest.

TODO: AI architecture, pursuit movement, targeting with multiple thieves, capture/failure consequences, death/disconnection, and per-guardian abilities. Mommy/Daddy/elemental names are examples, not a final roster.

See [safe zone](../WORLD/SAFE_ZONE.md) and [nest configs](../../DATA/NEST_CONFIGS.md). Do not create AI scripts or Studio objects during Task 00.

## Escape Focus and Active References

The objective is **ESCAPE**, not KILL THE GUARDIAN. Possible later elemental breath, dives, movement pressure, or environmental hazards remain unfinalized chase variations. Guardian HP bars, weapons, damage builds, and boss combat are not confirmed.

Inspect [Guardian-dragon-v1.png](../../REFERENCES/DRAGONS/Guardian-dragon-v1.png) and [Guardian-chase-v1.png](../../REFERENCES/ANIMATION/Guardian-chase-v1.png) for larger intimidating silhouettes, alert/roar, pursuit, safe-zone stop, and return intent. Depicted abilities, exact sizes, and levels are not approved values. The tutorial theft and first escape occur on foot.

An egg theft starts its slot's cooldown (300 seconds standard, 600 for the two highest-tier nests); it does not remove untouched eggs or reset guardian pursuit. Shared egg claims must be server-authoritative, while multiple-thief guardian targeting remains TBD. [Audio direction](../../REFERENCES/AUDIO/README.md) escalates after theft and resolves at successful safe-zone arrival.
