# Networking Planning

Authority: [MASTER_GAME_SPEC.md](../../MASTER_GAME_SPEC.md), sections 13, 15, 26, and 29.

## Confirmed Shared Egg Claims

Each nest targets 3–5 physical slots (EggSlotCount), configurable individually rather than forced to one common count. Physical egg slots are shared world resources. Claims must be **server-authoritative**, preventing multiple players from successfully taking the same egg simultaneously. A successful theft makes that egg unavailable to other players, empties only its slot, and starts only that slot's cooldown. Remaining eggs stay physically available and stealable.

After that slot's timer expires it rolls/spawns from the nest's configured pool. Standard nests use 300 seconds; the TWO highest-tier nests use 600 seconds. Timers start after theft and are configurable per nest. Do not refresh/reroll untouched eggs or globally reset the nest.

## Ownership and Chase

Players cannot steal others' owned eggs or dragons. A theft activates that nest's guardian. Successful arrival in the thief's own safe zone secures the stolen item, ends pursuit, and returns the guardian to its original nest. Distance alone does not end aggression; slot cooldown is not the chase end condition.

## Open Technical Decisions

TBD: claim API and implementation, slot identifiers/lifecycle, replication, initial fill/restart policy, multiple-thief guardian targeting, flight synchronization, death/disconnection behavior, and validation for feeding/purchases/growth. Server authority is confirmed specifically for shared egg claims; other boundaries are not silently finalized here.

The documentation synchronization pass created no remotes or runtime scripts. Subsequent authorized Task 01 implementation uses the limited contract below. See [Architecture](ARCHITECTURE.md), [Wild Nests](../../../DOCS/WORLD/WILD_NEST_SYSTEM.md), [Guardian AI](../../../DOCS/AI/GUARDIAN_AI.md), and [Nest Configs](../../../DATA/NEST_CONFIGS.md).

## Task 01 Contract

`ReplicatedStorage/SBD/Remotes/State` sends server snapshots to the owning client. `Input` accepts bounded finite movement Vector3, vertical intent and held Boost boolean only for an active mounted rider. `Action` accepts only Snapshot, Dismount and boolean Sprint; arbitrary progression/food grants are ignored.

Egg/hatch/feed/mount actions use proximity prompts with server state, owner, live character, distance and hold-duration checks. Claim ownership is committed before yielding. Own Safe Zone secures; server feeding consumes the free tutorial portion and preserves rarity/element. The Guardian/flight/progression services own state. Desktop and touch share these rules.

This is a session tutorial contract, not the final multi-slot/persistence protocol. [Playtest evidence](../../TESTING/TASK_01_PLAYTEST_REPORT.md) includes short-hold rejection, unsupported remote/input rejection, death cleanup and 14 rule checks; no multi-client race/load test is claimed.
