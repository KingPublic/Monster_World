# Monster World

A browser-based 3D fantasy creature adventure game, currently focused on Dragons.

**Current content focus:** Dragons only. Future creature families require explicit authorization.
**Technology:** TypeScript, plain Three.js, Vite, HTML/CSS UI.
**Target:** Desktop and mobile browsers with WebGL 2.
**Deployment direction:** GitHub → Vercel; standard static Vite output in dist/.

## Local development

Use Node.js 20.19+ or 22.12+ (compatible modern LTS recommended).

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Open the URL printed by Vite. The current app is a technical world inspection scene: orbit, zoom and pan; review the Sanctuary, wider world, distant non-functional Wild Nest markers and static Nature Young Dragon. Camera view buttons move only the inspection camera. They do not define player controls or gameplay fast travel.

Task 00 is the migration/foundation pass. No egg theft, Guardian gameplay, hatching, feeding, growth, riding, flight, economy or saves are implemented. Task 01 is NOT STARTED and needs separate authorization.

## Project map

- src/: renderer, loop, inspection camera, procedural world, GLB loading and HTML/CSS inspection UI.
- public/assets/: runtime Dragon GLB and reserved asset categories; no reference image bundle.
- [MASTER_GAME_SPEC.md](MASTER_GAME_SPEC.md): approved Dragon design and unresolved decisions.
- [TASKS](TASKS/README.md): web roadmap and strict milestone boundaries.
- DOCS/: gameplay, creatures/dragons, world, AI, UI/UX and technical direction.
- [DATA](DATA/README.md): preserved balance planning; unapproved values stay TBD.
- [REFERENCES](REFERENCES/README.md): 21 preserved visual references with exact filenames.
- [ASSET_MANIFEST.md](ASSET_MANIFEST.md): actual runtime availability and asset provenance.
- [TESTING](TESTING/README.md): migration evidence and future browser verification.
- [PROMPTS](PROMPTS/README.md): migration authority and reusable web task template.
- [LEGACY_ROBLOX](LEGACY_ROBLOX/README.md): historical prototype specs, setup, implementation and playtest reports. The Studio place itself is external to this repository.
- [ARCHIVE](ARCHIVE/README.md): future superseded engine-neutral design.

The Sanctuary is an established compact fantasy Dragon City, not a city-building game. World scale matters: progressively farther/harder nests make the physical Guardian escape home meaningful. Stolen Eggs must never enable an instant home warp. The first gameplay slice remains Dragon-focused: Explore → Steal Egg → Escape → Hatch Baby → Feed → Grow → Ride.

See [Architecture](DOCS/TECHNICAL/ARCHITECTURE.md), [deployment setup](DOCS/TECHNICAL/DEPLOYMENT.md), and [Task 00 validation](TESTING/TASK_00_WEB_MIGRATION_REPORT.md). No deployment is performed by the migration.
