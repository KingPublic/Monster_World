# Bug Log

Task 01 issues below were reproduced and fixed during Studio playtesting. See [full verification](TASK_01_PLAYTEST_REPORT.md). This is not a claim that the complete game or future systems are bug-free.

| ID | Date | Milestone | Summary | Reproduction / observed result | Expected result | Status | Resolution / verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01-001 | 2026-10-07 | 01 | Dragon floated above home boundary | Mount ground probe hit invisible Safe Zone, producing approximately 19.5-stud height | Ground clearance follows solid floor | FIXED | Collidable-only raycasts; approximately 5.15-stud mount height verified. |
| T01-002 | 2026-10-07 | 01 | Rider stood while mounted | Root weld attached character without seated pose | Stable seated rider | FIXED | Real Saddle Seat; live Sit/SeatPart and flight verified. |
| T01-003 | 2026-10-07 | 01 | Dismounted dragon remained unreachable | Dismount at high altitude landed player but left mount hovering | Dragon remains accessible | FIXED | Dragon lands with player; reachable distance and remount passed. |
| T01-004 | 2026-10-07 | 01 | Compact HUD/control overlap | Phone viewport placed dragon card over jump/flight region; action buttons too small | Readable cards and usable touch actions | FIXED | Compact layout, 56-pixel actions, dedicated held interaction; simulator flow completed. |
| T01-005 | 2026-10-07 | 01 | Optional control module lookup delay | Current client lacked PlayerModule | Movement input still usable without delayed optional lookup | FIXED | Immediate optional lookup and Humanoid movement fallback; joystick flight verified. |
| T01-006 | 2026-10-07 | 01 | Quick Sprint release could be throttled | Action throttle could reject a rapid boolean release | Release always restores normal walk | FIXED | Sprint excluded from action throttle; release behavior verified. |

Add actual reproducible issues when found. Describe the relevant task, environment, steps, observed and expected behavior, status, and evidence of a fix. Do not invent placeholder bug reports.
