# Changelog

## 2026-10-07 — Monster World Web Migration and World Foundation

- Reframed the project as Monster World, a single-player browser adventure, preserving Dragons as the only active creature family and conceptual future extensibility.
- Moved former prototype setup, milestone/report/testing and technical workflow records to LEGACY_ROBLOX; retained core snapshots and historical asset identifiers there. The external Studio place remains untouched.
- Introduced Vite 8.3.3, TypeScript 7.0.2, Three.js 0.186.1 and @types/three 0.186.0, exact dependency pins, package lock, renderer/resize lifecycle, capped pixel ratio, clean render loop, static GLB loading and HTML/CSS inspection UI.
- Established the Sanctuary fantasy Dragon City direction: connected terraces, streets/plaza, buildings, Hatchery/Collection/Rider/Shop/Mount landmarks, bridge, stream, fountain, homes, vegetation, banners and Dragon memorials. All are composition placeholders.
- Established larger-world scale as a gameplay requirement, meaningful physical Nest distance and generally farther/higher/harder high-tier progression. Added continuous procedural valley/forest/highland/volcanic/frost directions with configurable non-functional markers. Distances are review values; travel times remain unlocked.
- Documented physical Guardian return journey, no theft-state fast travel, preserved 3–5 slots with configurable per-slot 300/600-second respawn, independent Dragon identity/growth and free tutorial Starter Food.
- Preserved all 21 reference images at exact paths; moved the existing Nature Young Dragon GLB unchanged to public/assets/models/dragons/3d-young-dragon-nature.glb. Static model loads with one mesh/material and no rig, bones or animation clips.
- Reorganized engine-neutral Dragon docs under DOCS/CREATURES/DRAGONS, migrated active specs/data/world/technical/network/save/control docs and created the web Task 00–05 roadmap. Task 01 is NOT STARTED.
- Prepared a standard static dist/ build and GitHub/Vercel documentation. No Git mutations or deployment performed; no full gameplay migration is claimed.

Verification evidence is recorded in [Task 00 report](TESTING/TASK_00_WEB_MIGRATION_REPORT.md). Complete former project chronology remains in the [historical changelog](LEGACY_ROBLOX/CHANGELOG.md).
