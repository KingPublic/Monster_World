# Asset Pipeline

**Active core strategy:** reference guidance → reusable Three.js geometry/materials/groups → procedural Nature Dragon/Egg instances → local-transform animation. [ProceduralDragon](../../src/creatures/ProceduralDragon.ts) implements Baby, Young and Guardian with different proportions, joint groups, segmented tails and lightweight wing membranes. Young exposes an explicit mount anchor. [EggModel](../../src/creatures/EggModel.ts) implements Common/Uncommon/Rare/Epic shells, spots and Nature details.

Core gameplay never fetches a GLB, uses an external rig or requires Blender. Resources are shared within a model instance and disposed idempotently; they are isolated across instances. Models remain replaceable as art develops.

All 21 visual PNG references remain unchanged under REFERENCES and outside public. See [reference index](../../REFERENCES/REFERENCE_INDEX.md) and [asset manifest](../../ASSET_MANIFEST.md).

The existing [Nature Young GLB](../../public/assets/models/dragons/3d-young-dragon-nature.glb) remains optional historical showcase/reference content: 5,236,028 bytes; SHA-256 `b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615`. It has one mesh/material, no skins/bones and no animation clips. Task 00's loader/inspection utilities remain available in source but are not instantiated by Game. Removing this file does not affect the core loop.

Future imported assets may use GLTFLoader and Vite BASE_URL, with optimization and provenance review. Adult/other elements, final audio/music and dedicated item icons remain deferred. No other monster family is introduced.
