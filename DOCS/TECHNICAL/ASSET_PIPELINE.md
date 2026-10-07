# Asset Pipeline

Concept / Reference → External 3D Tool → GLB / GLTF → public/assets/ → GLTFLoader → Three.js Scene.

REFERENCES contains development visual guidance, never an automatic runtime bundle. Runtime Dragon models live in public/assets/models/dragons; the future models/monsters directory remains empty. Textures, images, audio and fonts have reserved directories. The [manifest](../../ASSET_MANIFEST.md) and [runtime manifest](../../src/config/assetManifest.ts) register actual available assets.

The existing file is [3d-young-dragon-nature.glb](../../public/assets/models/dragons/3d-young-dragon-nature.glb), 5,236,028 bytes, moved without modifying or duplicating its binary. SHA-256: b2e0f29c1e238efc8cba8a6435cd12c201acb7a8df06ce5d02cb79b77130c615. GLB v2 has one scene, two nodes, one mesh, one material, three embedded images, no skins/joints/bones and zero animation clips. Runtime GLTFLoader traversal checks the loaded scene and reports mesh/material/bone/clip counts. Static visual asset — animation/rigging requires future work.

A uniform showcase transform fits the model onto the Mount court without changing its file. A failed fetch/decode keeps a visible fallback and logs a clear error; the world keeps rendering. No AnimationMixer or fabricated wing motion is attached. Export optimization, topology review, production licensing/provenance, rigging, skinning and real clips remain future work. Historical imports/identifiers are retained only in LEGACY_ROBLOX and are not runtime dependencies.

The public directory is served at the site root; source constructs asset URLs using Vite BASE_URL for a configured base path. See [Vite static assets](https://vite.dev/guide/assets.html#the-public-directory) and [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html). Final audio remains pending; preserve [Audio Direction](../../REFERENCES/AUDIO/README.md).
