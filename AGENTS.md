# Monster World Agent Rules

1. Read [MASTER_GAME_SPEC.md](MASTER_GAME_SPEC.md) first.
2. Read the currently authorized [TASKS](TASKS/README.md) file and its specialized docs.
3. Inspect relevant actual REFERENCES images before visual implementation; preserve their exact filenames.
4. Implement only the authorized milestone. Task 00 must stop before Task 01.
5. Never invent gameplay because it appears in an AI reference image; the master specification wins.
6. Preserve working systems and useful Dragon design; archive superseded implementation history.
7. Prefer centralized configurable values over scattered constants. Unapproved balancing stays TBD.
8. Keep runtime assets in public/assets and design references in REFERENCES, outside the runtime bundle.
9. Dragons are the first implemented creature family and the sole gameplay/content focus of the initial web vertical slice. Architecture may support future creature families, but no other monster family should be implemented until explicitly authorized.
10. Target desktop and mobile browsers with responsive canvas, capped pixel ratio and touch-safe structure.
11. Run npm run typecheck and npm run build before claiming completion; inspect the boot in a browser and report evidence honestly.
12. Do not commit, merge, push, create a PR, rewrite history or change Git remotes unless explicitly asked. The migration authorizes none of these.
13. Do not silently add paid services, authentication, backends or cloud save providers.
14. Do not reintroduce Roblox runtime dependencies. Historical identifiers belong only in LEGACY_ROBLOX.
15. Keep systems practical; do not create empty architecture stubs or add unnecessary frameworks.
16. World scale and physical Wild Nest travel distance are gameplay requirements. Higher progression generally means farther/harder nests.
17. Sanctuary should read as an established fantasy Dragon city with coherent streets, plazas, landmarks and verticality; it is not city-building gameplay.
18. Do not compress the world to simplify implementation. Do not allow theft-state fast travel.

Specification priority: master specification → authorized task → specialized DOCS → DATA → approved visual references → existing implementation → assumptions. Current stack: Vite, TypeScript, plain Three.js and HTML/CSS UI. V1 is single player. Task 00 excludes all gameplay, persistence, final controls and final art. Report unresolved consequential choices rather than inventing infrastructure.
