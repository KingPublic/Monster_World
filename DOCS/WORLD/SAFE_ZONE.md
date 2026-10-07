# Safe Zone

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 15–17.

Each player nest acts as that player's own safe zone. Arrival secures the stolen egg/baby dragon and provides the primary successful end condition for guardian pursuit. The guardian stops chasing and returns to its original wild nest.

The guardian must not simply lose aggression because the player traveled far away. The supplied successful-arrival rule specifically names the thief's **own** safe zone.

TODO: zone shape and boundaries, ownership/arrival validation, visual/audio feedback, and failure or interruption handling. Do not infer what happens in someone else's safe zone until the relevant task defines it.

See [guardian AI](../AI/GUARDIAN_AI.md), [player nest](PLAYER_NEST.md), and [safe-zone reference planning](../../REFERENCES/ENVIRONMENT/README.md). No zone objects are created during Task 00.

## Visual and Audio Direction

Inspect [Player-nest-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-v1.png) and [Guardian-chase-v1.png](../../REFERENCES/ANIMATION/Guardian-chase-v1.png) for readable home entry, safe-zone presentation, disengagement, and return-home intent. Exact barrier geometry/physics and image-only invulnerability rules are not approved.

[Audio direction](../../REFERENCES/AUDIO/README.md) resolves chase tension on successful own-safe-zone arrival and uses Safe Zone Entry / Egg Secured cues. Slot respawn cooldown is separate from chase resolution: theft starts only the slot timer and does not end pursuit. Fast Travel is not a confirmed escape tool.
