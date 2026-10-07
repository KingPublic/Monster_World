# Monster World Migration Implementation Plan

**Goal:** Complete the authorized migration and inspection world, then stop before Task 01.
**Spec:** [Migration master prompt](../../PROMPTS/MONSTER_WORLD_MIGRATION_MASTER_PROMPT.md).
**Architecture:** Plain TypeScript owns a Three.js scene and orbit inspection camera; HTML/CSS provides inspection UI. World geometry and asset loading remain separate from future gameplay.
**Execution:** Inline in the requested repository. No commits, branches, remote changes, publishing or deployment.

## Constraints

Dragons only; single player; no gameplay systems or other families. Preserve every reference image and GLB bytes. Temporary positions are configurable and never final travel-time promises. Use Three.js, Vite, TypeScript and @types/three only.

## Steps

- [x] Recursively inventory and read repository documents, inspect references, Git state and GLB metadata; record original hashes.
- [x] Preserve Studio-specific reports, tasks and core snapshots under LEGACY_ROBLOX; move Dragon design and runtime GLB.
- [x] Rewrite active identity, gameplay/world/technical docs, web tasks, testing and links while retaining approved design.
- [x] Create package/config files and renderer, loop, camera, world, Sanctuary, asset-loading and inspection UI modules.
- [x] Verify increasing marker distance/elevation, layered city composition and static GLB loading; exercise missing-asset fallback.
- [x] Run npm install, typecheck and build; inspect dev/preview pages at desktop and phone sizes, resize and controls.
- [x] Validate all local Markdown links and reference/GLB hashes; report Git status and stop.

## Review Focus

Missing GLB must retain a visible placeholder. Resize must update camera/canvas without overflow. HMR must dispose listeners and GPU resources. Every marker must rest on terrain at a distinct distance. Inspection views must never become gameplay teleport mechanics.

## Completion

Task 00 completed on 2026-10-08 (Asia/Makassar). Install, strict typecheck, production build, browser inspection/resize/model fallback/teardown and integrity checks passed. Independent final review found no actionable defects. See the [completion report](../../TESTING/TASK_00_WEB_MIGRATION_REPORT.md) for evidence and limitations. No Task 01 work was started.
