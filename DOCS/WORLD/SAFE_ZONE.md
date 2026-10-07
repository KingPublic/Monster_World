# Safe Zone

> Current MVP: a glowing Sanctuary perimeter at radius 145 world units; delivery also requires altitude below 100. Entering secures all carried Eggs, rewards Coins, shows particles/feedback and sends each corresponding Guardian home. Safe Zone delivery is evaluated before capture.


Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 15–17.

The single player's Sanctuary acts as their Safe Zone. Arrival secures the stolen egg/baby dragon and provides the primary successful end condition for guardian pursuit. The guardian stops chasing and returns to its original wild nest.

The guardian must not simply lose aggression because the player traveled far away. The supplied successful-arrival rule specifically names the thief's **own** safe zone.

TODO: zone shape and boundaries, arrival validation, visual/audio feedback, and failure or interruption handling. Future multiplayer boundaries are separate scope.

See [guardian AI](../AI/GUARDIAN_AI.md), [player nest](PLAYER_SANCTUARY.md), and [safe-zone reference planning](../../REFERENCES/ENVIRONMENT/README.md). Task 00 has no functional zone detection.

## Visual and Audio Direction

Inspect [Player-nest-v1.png](../../REFERENCES/ENVIRONMENT/Player-nest-v1.png) and [Guardian-chase-v1.png](../../REFERENCES/ANIMATION/Guardian-chase-v1.png) for readable home entry, safe-zone presentation, disengagement, and return-home intent. Exact barrier geometry/physics and image-only invulnerability rules are not approved.

[Audio direction](../../REFERENCES/AUDIO/README.md) resolves chase tension on successful own-safe-zone arrival and uses Safe Zone Entry / Egg Secured cues. Slot respawn cooldown is separate from chase resolution: theft starts only the slot timer and does not end pursuit. Fast travel is forbidden while carrying stolen Eggs; the physical escape cannot be skipped.
