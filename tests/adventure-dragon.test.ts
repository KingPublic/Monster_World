import { Box3, Group, Mesh, Vector3 } from 'three';
import { mkdir, writeFile } from 'node:fs/promises';
import { AdventureDragon } from '../src/creatures/AdventureDragon';
import { ADVENTURE_DRAGON_PROFILE_IDS, adventureDragonProfiles } from '../src/config/adventureDragonProfiles';
import type { DragonPose } from '../src/creatures/ProceduralDragon';
function check(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
const settle = (dragon: AdventureDragon, pose: DragonPose = { state: 'idle' }, frames = 180) => { for (let i = 0; i < frames; i++) dragon.update(1 / 60, pose); };
const size = (dragon: AdventureDragon) => new Box3().setFromObject(dragon.root, true).getSize(new Vector3());
const measurements: unknown[] = [];
const cases: [string, () => void][] = [
  ['six authored Dragon species have different real anatomy and geometry silhouettes', () => {
    const signatures = new Set<string>();
    for (const id of ADVENTURE_DRAGON_PROFILE_IDS) {
      const dragon = new AdventureDragon('Young', id); settle(dragon);
      try {
        const bounds = new Box3().setFromObject(dragon.root, true); const dimensions = bounds.getSize(new Vector3());
        let vertices = 0; let meshes = 0; dragon.root.traverse(node => { if (node instanceof Mesh) { vertices += node.geometry.getAttribute('position').count; meshes++; } });
        signatures.add([vertices, dimensions.x.toFixed(3), dimensions.y.toFixed(3), dimensions.z.toFixed(3)].join(','));
        check(dragon.root.userData.assetStatus === 'ready' && dragon.root.userData.sourceReady === false && dragon.root.userData.authoredTemporary, 'authored art misreported as a model fallback');
        check(dragon.root.userData.runtimeAsset === 'authored:' + id, 'identity missing');
        const legs = dragon.root.children[0]!.children.filter(node => /-(fore|hind)-leg$/.test(node.name));
        check(legs.length === (id === 'crystalwyvern' ? 2 : 4), id + ' has wrong limb anatomy');
        check(dimensions.x < 26 && dimensions.z < 30, id + ' does not fit the 35-unit garden bay');
        check(dragon.mountAnchor.position.y > 3 && dragon.mountAnchor.position.y < 6, id + ' has an unsuitable back height');
        check(meshes < 140 && dragon.root.userData.resourceBudget.triangles < 55000 && dragon.root.userData.resourceBudget.materials <= 12, id + ' exceeds mobile composition budget');
        measurements.push({ profile: id, family: adventureDragonProfiles[id].family, young: dimensions.toArray(), lowestSurface: bounds.min.y, backHeight: dragon.mountAnchor.position.y, legs: legs.length, budget: dragon.root.userData.resourceBudget });
      } finally { dragon.dispose(); }
    }
    check(signatures.size === 6, 'the profiles only recolor repeated geometry');
  }],
  ['Dragon rest plants every foot and stops gait rather than looping jogging', () => {
    for (const id of ADVENTURE_DRAGON_PROFILE_IDS) {
      const dragon = new AdventureDragon('Young', id);
      try {
        settle(dragon, { state: 'walk', speed: 12 }, 120); settle(dragon, { state: 'idle' }, 180);
        const feet: Group[] = []; dragon.root.traverse(node => { if (node instanceof Group && node.name === 'grounded-talon') feet.push(node); });
        const rest = feet.map(foot => foot.getWorldPosition(new Vector3()));
        for (let i = 0; i < 360; i++) {
          dragon.update(1 / 60, { state: 'idle' });
          for (const [index, foot] of feet.entries()) check(foot.getWorldPosition(new Vector3()).distanceTo(rest[index]!) < .0001, id + ' moves a stopped foot');
        }
        check(dragon.root.userData.canonicalRest && dragon.root.userData.gait < .001, id + ' keeps running at rest');
        check(rest.every(point => Math.abs(point.y - .15) < .002), id + ' feet float above ground');
        check(new Box3().setFromObject(dragon.root, true).min.y >= -.01, id + ' resting surface sinks underground');
        dragon.update(.1, { state: 'walk', speed: 0 }); check(dragon.root.userData.gait < .001, 'zero-speed walk triggers an endless jog');
      } finally { dragon.dispose(); }
    }
  }],
  ['Dragon wing, limb, mouth and bank joints distinguish care and aerial poses', () => {
    for (const id of ADVENTURE_DRAGON_PROFILE_IDS) {
      const dragon = new AdventureDragon('Young', id);
      try {
        settle(dragon); const wing = dragon.root.getObjectByName('left-folding-wing')!; const wrist = wing.getObjectByName(id === 'suncrest' ? 'feather-fan-wrist' : 'membrane-finger-wrist')!;
        const groundWing = wing.quaternion.clone(); const groundWrist = wrist.quaternion.clone(); const jaw = dragon.root.getObjectByName('articulated-jaw')!;
        settle(dragon, { state: 'eat' }, 80); check(Math.abs(jaw.rotation.x) > .04, id + ' has no meal mouth');
        settle(dragon, { state: 'takeoff' }, 90); check(wing.quaternion.angleTo(groundWing) > .25 && wrist.quaternion.angleTo(groundWrist) > .25, id + ' only rigidly floats its folded wing');
        settle(dragon, { state: 'glide', bank: .65, vertical: .5 }, 150);
        const airSize = size(dragon); check(airSize.x > 9, id + ' flight silhouette fails to unfold');
        const frame = dragon.root.children[0]!; check(frame.rotation.z < -.2 && frame.rotation.x > .05, id + ' bank/ascent not articulated');
        const glide = wing.quaternion.clone(); settle(dragon, { state: 'boost', bank: 0 }, 40); check(wing.quaternion.angleTo(glide) > .05, id + ' boost has no wing motion');
        settle(dragon, { state: 'land' }, 180); check(wing.quaternion.angleTo(groundWing) < .001 && wrist.quaternion.angleTo(groundWrist) < .001, id + ' fails to refold after landing');
        check(frame.position.y < .001 && dragon.root.position.length() === 0, id + ' animation moves the physics root');
      } finally { dragon.dispose(); }
    }
  }],
  ['Baby, Young and Guardian retain one identity with smooth art growth and normal rider scale', () => {
    for (const id of ADVENTURE_DRAGON_PROFILE_IDS) {
      const dragon = new AdventureDragon('Baby', id); const root = dragon.root; const anchor = dragon.mountAnchor; const rider = new Group(); anchor.add(rider);
      try {
        settle(dragon); const baby = size(dragon); dragon.setForm('Young'); dragon.update(1 / 60, { state: 'idle' });
        check(root === dragon.root && anchor === dragon.mountAnchor && root.userData.visualScale < .5, 'form transition snaps or replaces identity');
        settle(dragon); const young = size(dragon); check(young.y / baby.y > 2 && young.y / baby.y < 2.9, id + ' lacks Baby/Young scale distinction');
        check(root.getObjectByName('fitted-leather-saddle')!.visible, 'Young saddle absent');
        const oldSeat = anchor.position.y; dragon.setGrowth(1.35); dragon.update(1 / 60, { state: 'idle' }); check(root.userData.visualScale < 1.04, 'meal growth snaps'); settle(dragon);
        check(anchor.position.y > oldSeat * 1.3, id + ' rider anchor fails to track grown back');
        check(rider.getWorldScale(new Vector3()).distanceTo(new Vector3(1, 1, 1)) < 1e-7 && root.scale.distanceTo(new Vector3(1, 1, 1)) === 0, id + ' growth scales rider/physics');
        dragon.setForm('Guardian'); settle(dragon); check(root.userData.visualScale > 1.84 && root.userData.visualScale < 1.86 && root.userData.variant === id, 'Guardian loses identity or scale');
        check(!root.getObjectByName('fitted-leather-saddle')!.visible, 'Guardian displays mount equipment');
      } finally { rider.removeFromParent(); dragon.dispose(); }
    }
  }],
  ['authored Dragon disposal releases every geometry and material once and remains isolated', () => {
    const a = new AdventureDragon('Young', 'stormserpent'); const b = new AdventureDragon('Young', 'stormserpent');
    const resources = [...(a as unknown as { geometries: Set<import('three').BufferGeometry> }).geometries, ...(a as unknown as { materials: Set<import('three').Material> }).materials];
    const counts = new Map(resources.map(resource => [resource, 0]));
    for (const resource of resources) resource.addEventListener('dispose', () => counts.set(resource, counts.get(resource)! + 1));
    a.dispose(); a.dispose(); a.update(.1, { state: 'flight' }); a.setForm('Baby'); a.setGrowth(1.3);
    check([...counts.values()].every(count => count === 1), 'owned art resource leaked or disposed twice');
    check(a.root.children.length === 0 && a.root.userData.disposed, 'disposed rig remains live');
    b.update(.1, { state: 'flight' }); check(b.root.children.length > 0 && b.root.userData.assetStatus === 'ready', 'disposing one species destroys another instance'); b.dispose();
  }],
];
export async function runCoreTests() {
  const results = []; for (const [name, run] of cases) { try { run(); results.push({ name, pass: true }); } catch (error) { results.push({ name, pass: false, error: String(error) }); } }
  await mkdir('ASSET_WORK/iteration7', { recursive: true }); await writeFile('ASSET_WORK/iteration7/species-measurements.json', JSON.stringify(measurements, null, 2));
  return results;
}
