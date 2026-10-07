# Agent Rules

Before implementing any gameplay milestone:

1. Read `MASTER_GAME_SPEC.md`.
2. Read the current file under `TASKS/`.
3. Read all specialized documentation referenced by that task.
4. Inspect all relevant visual references under `REFERENCES/`.
5. Inspect the current Roblox Studio DataModel through MCP.
6. Implement ONLY the current milestone.
7. Do not implement future milestones unless a minimal interface/stub is strictly required.
8. Do not invent major gameplay mechanics not defined by the specifications.
9. Do not substantially change the approved visual direction.
10. Prefer configurable systems over duplicated hardcoded values.
11. Never delete or rename important Studio objects unless explicitly required.
12. Preserve existing working systems.
13. Use replaceable placeholder assets when production assets are unavailable.
14. Do not treat concept/reference images as automatically final assets.
15. Keep prototype assets replaceable.
16. After implementation, perform a Roblox Studio playtest.
17. Inspect Output/errors/warnings.
18. Fix regressions caused by the current task.
19. Verify every acceptance criterion.
20. Report exactly what was changed.
21. Report known limitations.
22. Stop after completing the requested milestone.

## Specification Priority

When information conflicts, use this order:

1. `MASTER_GAME_SPEC.md`
2. Current `TASKS/TASK_XX_*.md`
3. Specialized files under `DOCS/`
4. Canonical values under `DATA/`
5. Approved visual references under `REFERENCES/`
6. Existing implementation
7. Agent assumptions

If a genuine ambiguity could materially affect architecture, progression, economy, or gameplay, report it instead of silently inventing a major system.

## Roblox Studio Rule

The actual Roblox game is implemented inside Roblox Studio.

The local repository exists primarily for specifications, references, tasks, balancing, and development documentation unless a later task explicitly introduces local script synchronization tooling.
