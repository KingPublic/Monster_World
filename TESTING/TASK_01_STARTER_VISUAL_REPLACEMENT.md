# Task 01 — Starter Nature Young Visual Replacement

Date: 2026-10-07  
Status: COMPLETE — visual integration and requested playtest passed. Task 02 was not started.

Target: connected Studio experience **Steal a Baby Dragon**, PlaceId **138175399498508**. The user explicitly approved imported `StarterNatureYoung_v1` for the first rideable Nature Young/Juvenile dragon only.

## Inspection

The imported source was `Workspace/StarterNatureYoung_v1`: one MeshPart, no PrimaryPart assigned, no Bone, Motor6D, attachments, Seat, scripts, AnimationController or creature rig. Its mesh ID was read from Studio: `rbxassetid://102505212074318`. Original model scale was 1; MeshPart dimensions approximately `0.963 × 0.662 × 1` studs, too small to ride. The source was unanchored and collidable.

The working `ServerStorage/SBDAssets/JuvenileDragon` used an invisible anchored `Root`, a server-controlled `Saddle` Seat, welded primitive visuals, and optional procedural wing joints. TutorialService clones this template after feeding/growth. FlightService moves its PrimaryPart/model pivot, checks nearby mounting, seats the character, applies bounded movement/stamina, and restores movement on dismount. The client camera follows PrimaryPart. Baby and Guardian have separate templates.

## Integration and Preservation

- Preserved the entire original Juvenile placeholder under `ServerStorage/PrototypeBackups/JuvenileDragon_Task01_Placeholder_v1`, including its Root, Seat, primitive parts and wing welds. It is absent from normal gameplay.
- Moved the unchanged-size imported source into `ServerStorage/SBDAssets/Imported/StarterNatureYoung_v1`. Original scale and pivot were recorded as attributes; the source MeshPart and texture were retained.
- Kept the active template name `ServerStorage/SBDAssets/JuvenileDragon`, preserving TutorialService's existing clone path. It contains the existing functional Root and Seat plus `Visuals/StarterNatureYoung_v1`.
- Used an unanchored, massless visible mesh welded to the existing Root by `VisualRootWeld`; it follows the same movement/pivot/banking. Existing kinematic Root remains anchored, as before. The visual mesh itself is not anchored during gameplay.
- Root and functional Seat are transparent. No old primitive body is visible in the replacement template. No fake wing/leg rig was introduced.
- Added `RiderMountAttachment` at the fitted saddle transform for explicit visual alignment. `SaddleControllerWeld` joins the Seat to Root. Seat activation/occupancy/server validation remain the existing system.

Tutorial/growth state, food, ownership/security, remotes, Guardian, Safe Zone, stamina, Boost, camera controller and flight tuning were preserved. Source comparison verified that only FlightService changed; no scripts were deleted or added. Baby and Guardian do not use the imported visual.

## Final Fit

| Setting | Final value |
| --- | --- |
| Visible model scale | **12×** imported scale; source stays at 1× |
| Mesh dimensions | Approximately **11.55 × 7.95 × 12 studs** before orientation |
| Orientation | **−90° Y**, aligning imported forward −X with controller forward −Z |
| Visual offset from Root | `(0, 0.125, 0)` studs |
| Seat / RiderMountAttachment relative to Root | `(0, 0.65, −1.8)` studs, facing forward |
| Rider initial placement | Seat CFrame + local `(0, 1.6, 0)`; native Seat weld handles the actual seated pose |

Fit was inspected beside the actual player character and while seated, from side/front camera views. Rider is centered over the saddle, faces the dragon's forward direction, and is neither floating above nor deeply clipped into the body. Young is larger than Baby and smaller than the existing Guardian. The mesh proportions were uniformly scaled; rider alignment was adjusted through the functional Seat.

## Collision and Animation

The decorative mesh uses `CanCollide = false`, `CanTouch = false`, `CanQuery = false`, `Massless = true`, `Anchored = false`. Wings, horns, leaves and tail add no detailed gameplay collision. Existing simple Root-based collidable-world raycasts, ground clearance and movement bounds remain unchanged. Functional Root/Seat also remain noncollidable.

**Starter Nature Young Dragon v1 currently uses static/prototype visual movement. Full creature rigging, wing animation, leg animation, takeoff, glide and landing animation will be handled later.**

Root movement/rotation/banking work now; individual creature parts do not animate. The imported visual's approval does not certify a finished creature rig or animation set.

## Script Modified

Only `ServerScriptService/SBD/FlightService`, initial mount placement:

```lua
-- Previously tied to the placeholder Root height:
root.CFrame = dragon.PrimaryPart.CFrame * CFrame.new(0, 3.35, 0)
-- Now follows the fitted functional Seat:
root.CFrame = seat.CFrame * CFrame.new(0, 1.6, 0)
```

This also remains compatible with the archived placeholder's Seat height. Flight movement, stamina math, Boost, dismount, remotes and camera source were unchanged.

## Requested Playtest Results

A fresh session traversed theft → Guardian chase → own Safe Zone → hatch → free food → growth using movement and held interactions. No progression was manually advanced.

| # | Check | Result |
| --- | --- | --- |
| 1 | Tutorial reaches Growth | PASS — food and FEEDING/GROWING transitions reached normally. |
| 2 | Baby → Young transition | PASS — original primitive Baby remains non-rideable; after feeding stage becomes JUVENILE, food 0, growth 100. |
| 3 | Imported model appears | PASS — runtime `Dragon_<UserId>/Visuals/StarterNatureYoung_v1`, one visible mesh; no placeholder body. |
| 4 | Approach dragon | PASS — nearby held mount prompt available. |
| 5 | Mount | PASS — Mounted true, Humanoid Sit true, correct Saddle SeatPart. |
| 6 | Saddle alignment | PASS — side/front visual inspection with actual character confirms centered forward-facing seated rider. |
| 7 | Model stays assembled | PASS — mesh remains root-welded through translation/turning; relative offset error below 0.00001 stud, no facing error. |
| 8 | Flight | PASS — W/A/S/D, Space ascent, Left Ctrl descent; normal speed approximately 32 studs/second. |
| 9 | Held Shift Boost | PASS — Boosting true, speed approximately 56; release clears Boost and tutorial reaches COMPLETE. |
| 10 | Stamina | PASS — observed approximately 90.63 before Boost and 8.68 during held Boost; idle regeneration observed afterward. Tuning unchanged. |
| 11 | Camera | PASS — follows existing Root while mounted; FOV about 80 during Boost and returns to 70; dismount follows character Humanoid. |
| 12 | Dismount | PASS — Sit/PlatformStand false, dragon lands at existing ground clearance, within interaction range; remount succeeds. |
| 13 | Collision | PASS — no severe collision/assembly issue during tested travel, ascent/descent, turns and dismount. Visible mesh unanchored/noncollidable/massless. |
| 14 | Output | PASS — only expected service/client readiness logs in fresh play; no new major errors. |

Identity remains Common + Nature; growth remains Juvenile. Guardian history remained `IDLE → ALERT → ROAR → CHASE → SAFE_ZONE_STOP → RETURN → IDLE`, confirming the earlier tutorial systems still worked. Fourteen existing RulesChecks passed; changed FlightService compiled. Studio was stopped in Edit mode; temporary fit preview and QA visibility changes were removed/restored.

## Known Limitations

- Static visual pose; full creature rig/animation remains later work.
- Simple existing server flight and collision; no advanced Task 02 handling introduced.
- Scale/Seat fit verified with the current player avatar; extreme avatar proportions need later testing.
- This pass retested desktop controls. Touch UI/remotes/controller were unchanged; real-phone simultaneous controls were not retested.
- Baby, Guardian and Adult visual replacements are outside this request. No additional gameplay, balancing changes or publishing.

See [original Task 01 report](TASK_01_PLAYTEST_REPORT.md), [asset manifest](../ASSET_MANIFEST.md), and [Dragon System](../DOCS/DRAGONS/DRAGON_SYSTEM.md). Stop here; do not proceed to Task 02.

Documentation validation preserved all 20 previous reference filenames/hashes and found an additional local [3d-references-single-v1.png](../REFERENCES/DRAGONS/3d-references-single-v1.png). It was inspected and indexed as available single-view guidance, not generated by this implementation. Audit inventory is 21 images; no reference was renamed or deleted.
