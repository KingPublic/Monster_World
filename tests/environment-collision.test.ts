import { Box3, BoxGeometry, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { Environment } from '../src/world/Environment';
import { createNestLandscape } from '../src/world/NestLandscape';
import { gameConfig } from '../src/config/gameConfig';
import { citySolids } from '../src/world/SanctuaryLayout';
import { groundHeight, isBlocked } from '../src/world/Traversal';
import * as traversal from '../src/world/Traversal';
import { disposeScene } from '../src/utils/scene';
import { valleyTrails } from '../src/world/Landscape';
import { World } from '../src/world/World';
import { WorldCollision } from '../src/world/WorldCollision';

function check(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function placedCenter(mesh: InstancedMesh, index = 0): Vector3 {
  mesh.updateWorldMatrix(true, false);
  const matrix = new Matrix4(); mesh.getMatrixAt(index, matrix);
  return new Vector3().setFromMatrixPosition(matrix.premultiply(mesh.matrixWorld));
}
function blockingEnvironmentMeshes(environment: Environment, x: number, z: number, floor: number): string[] {
  const names: string[] = [];
  environment.group.traverse(object => {
    if (!(object instanceof Mesh) || !(['GroveBranchingTrunks', 'GroveSecondaryBranches', 'TrailWeatheredBoulders'].includes(object.name) || object.parent?.name === 'LayeredRockyValleyRidges')) return;
    const box = new Box3().setFromObject(object);
    if (x + 2.5 < box.min.x || x - 2.5 > box.max.x || z + 2.5 < box.min.z || z - 2.5 > box.max.z || floor + 5.5 < box.min.y || floor + .12 > box.max.y) return;
    const isolated = new WorldCollision();
    try {
      if (object.parent?.name === 'LayeredRockyValleyRidges') isolated.registerRidge(object, 7, 11); else isolated.registerMesh(object);
      if (isolated.isBlocked(x, z, { radius: 2.5, minY: floor + .12, maxY: floor + 5.5 })) names.push(object.name || 'ridge at ' + object.position.toArray().join(','));
    } finally { isolated.clear(); }
  });
  return names;
}
const cases: [string, () => Promise<void>][] = [
  ['diagonal high-speed movement respects a solid corner and can slide along a face', async () => {
    const root = new Mesh(new BoxGeometry(2, 6, 2), new MeshStandardMaterial()), collision = new WorldCollision();
    collision.registerMesh(root);
    try {
      const hit = collision.resolveMovement({ x: -10, y: 0, z: -10 }, { x: 10, y: 0, z: 10 }, { radius: 1, minY: .1, maxY: 5 });
      check(hit.blocked && (hit.x <= -1.999 || hit.z <= -1.999), 'diagonal step skips box corner');
      check(!collision.isBlocked(hit.x, hit.z, { minY: hit.y + .1, maxY: hit.y + 5, radius: 1 }), 'diagonal sweep ends inside corner');
      const slide = collision.resolveMovement({ x: -10, y: 0, z: 0 }, { x: 10, y: 0, z: .5 }, { radius: 1, minY: .1, maxY: 5 });
      check(slide.blocked && slide.x <= -1.999 && Math.abs(slide.z - .5) < .001, 'wall response loses tangential movement');
      const away = collision.resolveMovement({ x: -2, y: 0, z: 0 }, { x: -10, y: 0, z: 0 }, { radius: 1, minY: .1, maxY: 5 });
      check(!away.blocked && away.x === -10, 'contact traps a body moving away');
    } finally { root.geometry.dispose(); (root.material as MeshStandardMaterial).dispose(); }
  }],
  ['two perpendicular walls stop fast diagonal travel into their closed corner', async () => {
    const xWall = new Mesh(new BoxGeometry(2, 6, 40), new MeshStandardMaterial());
    const zWall = new Mesh(new BoxGeometry(40, 6, 2), new MeshStandardMaterial()), collision = new WorldCollision();
    collision.registerMesh(xWall); collision.registerMesh(zWall);
    try {
      const hit = collision.resolveMovement({ x: -10, y: 0, z: -10 }, { x: 10, y: 0, z: 10 }, { radius: 1, minY: .1, maxY: 5 });
      check(hit.blocked && hit.x <= -1.999 && hit.z <= -1.999, 'diagonal travel crosses a closed two-wall corner');
    } finally { for (const root of [xWall, zWall]) { root.geometry.dispose(); (root.material as MeshStandardMaterial).dispose(); } }
  }],
  ['vertical flight sweep respects the body bottom on roofs and its head below ceilings', async () => {
    const root = new Mesh(new BoxGeometry(2, 6, 2), new MeshStandardMaterial()), collision = new WorldCollision();
    collision.registerMesh(root);
    try {
      const down = collision.resolveMovement({ x: 0, y: 20, z: 0 }, { x: 0, y: -20, z: 0 }, { radius: .75, minY: .1, maxY: 5 });
      check(down.blocked && Math.abs(down.y - 2.9) < .001 && down.normal.y > .99, 'descent tunnels through roof');
      const up = collision.resolveMovement({ x: 0, y: -20, z: 0 }, { x: 0, y: 20, z: 0 }, { radius: .75, minY: .1, maxY: 5 });
      check(up.blocked && Math.abs(up.y + 8) < .001 && up.normal.y < -.99, 'ascent tunnels head through ceiling');
    } finally { root.geometry.dispose(); (root.material as MeshStandardMaterial).dispose(); }
  }],
  ['rendered valley tree trunks stop a body at their actual height and release with scenery', async () => {
    const environment = new Environment();
    try {
      const trunks = environment.group.getObjectByName('GroveBranchingTrunks') as InstancedMesh;
      const p = placedCenter(trunks);
      check(isBlocked(p.x, p.z, { minY: p.y - .3, maxY: p.y + .3, radius: .75 }), 'body passes through rendered trunk');
      check(!isBlocked(p.x, p.z, { minY: p.y + 100, maxY: p.y + 103, radius: .75 }), 'trunk becomes an infinite wall');
      disposeScene(environment.group);
      check(!isBlocked(p.x, p.z, { minY: p.y - .3, maxY: p.y + .3, radius: .75 }), 'disposed trunk still blocks traversal');
    } finally { disposeScene(environment.group); }
  }],
  ['rendered trail boulders block their solid body', async () => {
    const environment = new Environment();
    try {
      const rocks = environment.group.getObjectByName('TrailWeatheredBoulders') as InstancedMesh;
      const p = placedCenter(rocks);
      check(isBlocked(p.x, p.z, { minY: p.y - .25, maxY: p.y + .25, radius: .75 }), 'body passes through rendered boulder');
    } finally { disposeScene(environment.group); }
  }],
  ['nest masonry blocks a body while the central egg floor remains open', async () => {
    const marker = gameConfig.nestMarkers.find(n => n.id === 'ruins')!;
    const nest = createNestLandscape(marker, 7);
    try {
      const masonry = nest.getObjectByName('RegionalMasonry_ruins') as InstancedMesh;
      const p = placedCenter(masonry);
      check(isBlocked(p.x, p.z, { minY: p.y - .5, maxY: p.y + .5, radius: .75 }), 'body passes through ruin pillar');
      check(!isBlocked(marker.position[0], marker.position[2]), 'central eggs inaccessible');
      check(groundHeight(marker.position[0], marker.position[2]) === marker.position[1] + 5, 'nest floor changed');
    } finally { disposeScene(nest); }
  }],
  ['city solids retain ground blocking but let a body pass above the actual roof', async () => {
    const city = citySolids.find(s => s.id === 'hatchery')!;
    check(isBlocked(city.x, city.z), 'existing city blocker removed');
    check(!isBlocked(city.x, city.z, { minY: city.maxY + 5, maxY: city.maxY + 8, radius: .75 }), 'raised flight still blocks above roof');
  }],
  ['a fast flight step cannot tunnel through a rendered thin trunk', async () => {
    const environment = new Environment();
    try {
      const trunks = environment.group.getObjectByName('GroveBranchingTrunks') as InstancedMesh;
      const p = placedCenter(trunks);
      check(typeof traversal.resolveTraversalMovement === 'function', 'altitude-aware swept traversal is missing');
      const hit = traversal.resolveTraversalMovement({ x: p.x - 40, y: p.y, z: p.z }, { x: p.x + 40, y: p.y, z: p.z }, { radius: .75, minY: -.25, maxY: .25 });
      check(hit.blocked && Math.abs(hit.x - p.x - 40) > 1, 'fast flight ignored trunk contact');
      check(!isBlocked(hit.x, hit.z, { minY: hit.y - .25, maxY: hit.y + .25, radius: .75 }), 'sweep leaves body inside trunk');
      const raised = traversal.resolveTraversalMovement({ x: p.x - 40, y: p.y + 100, z: p.z }, { x: p.x + 40, y: p.y + 100, z: p.z }, { radius: .75, minY: -.25, maxY: .25 });
      check(!raised.blocked && Math.abs(raised.x - p.x - 40) < .0001, 'raised flight cannot clear trunk');
    } finally { disposeScene(environment.group); }
  }],
  ['ridge collision follows its shrinking upper silhouette instead of an invisible tall box', async () => {
    const environment = new Environment();
    try {
      const ridge = environment.group.getObjectByName('LayeredRockyValleyRidges')!.children[0] as Mesh;
      const box = new Box3().setFromObject(ridge), center = box.getCenter(new Vector3());
      const low = ridge.position.y + ridge.scale.y * .3;
      check(isBlocked(ridge.position.x, ridge.position.z, { minY: low, maxY: low + 1, radius: .75 }), 'body passes through ridge interior');
      // This lies well outside the narrow summit, but inside its overall X/Z box.
      const x = center.x + (box.max.x - box.min.x) * .35, y = ridge.position.y + ridge.scale.y * .92;
      check(!isBlocked(x, center.z, { minY: y, maxY: y + 1, radius: .75 }), 'ridge footprint becomes a giant summit wall');
      check(!isBlocked(ridge.position.x, ridge.position.z, { minY: box.max.y + 5, maxY: box.max.y + 9, radius: 2.5 }), 'raised flight cannot clear ridge');
    } finally { disposeScene(environment.group); }
  }],
  ['the visible woven nest rim is solid without filling its open approach', async () => {
    const marker = gameConfig.nestMarkers[0]!, nest = createNestLandscape(marker, 0);
    try {
      const rim = nest.getObjectByName('BraidedTwigRim_0') as Mesh;
      rim.updateWorldMatrix(true, false);
      const p = new Vector3().fromBufferAttribute(rim.geometry.attributes.position!, 150).applyMatrix4(rim.matrixWorld);
      check(isBlocked(p.x, p.z, { minY: p.y - .5, maxY: p.y + .5, radius: .75 }), 'body passes through visible nest rim');
      const approach = valleyTrails.find(t => t.nestId === marker.id)!.curve.getPointAt(.98), floor = groundHeight(approach.x, approach.z);
      check(!isBlocked(approach.x, approach.z, { minY: floor + .05, maxY: floor + 4.9, radius: .75 }), 'nest rim seals approach');
    } finally { disposeScene(nest); }
  }],
  ['all authored route centers and nest approaches remain passable with scenery collision', async () => {
    const environment = new Environment(), nests = gameConfig.nestMarkers.map((n, i) => createNestLandscape(n, i));
    try {
      for (const trail of valleyTrails) for (const p of trail.curve.getSpacedPoints(Math.ceil(trail.curve.getLength() / 5))) {
        if (Math.hypot(p.x, p.z) <= 181) continue;
        const floor = groundHeight(p.x, p.z);
        check(!isBlocked(p.x, p.z, { minY: floor + .05, maxY: floor + 4.9, radius: .75 }), 'blocked walking trail ' + trail.nestId + ' at ' + p.x + ',' + p.z);
        if(isBlocked(p.x, p.z, { minY: floor + .12, maxY: floor + 5.5, radius: 2.5 })) throw new Error('blocked ground-mount trail ' + trail.nestId + ' at ' + p.x + ',' + p.z + ' by ' + blockingEnvironmentMeshes(environment, p.x, p.z, floor).join(';'));
      }
      for (const trail of valleyTrails) for (let i = 1; i <= 100; i++) {
        const p = trail.curve.getPointAt(i / 100), direction = trail.curve.getTangentAt(i / 100);
        if (Math.hypot(p.x, p.z) <= 181) continue;
        for (const side of [-.35, 0, .35]) {
          const x = p.x - direction.z * trail.width * side, z = p.z + direction.x * trail.width * side, floor = groundHeight(x, z);
          check(!isBlocked(x, z, { minY: floor + .05, maxY: floor + 4.9, radius: .75 }), 'blocked trail width ' + trail.nestId + ' at ' + x + ',' + z);
        }
        const floor = groundHeight(p.x, p.z);
        check(!isBlocked(p.x, p.z, { minY: floor + .12, maxY: floor + 5.5, radius: 2.5 }), 'blocked ground-mount route ' + trail.nestId + ' at ' + p.x + ',' + p.z);
      }
      for (const n of gameConfig.nestMarkers) check(!isBlocked(n.position[0], n.position[2]), 'blocked egg floor ' + n.id);
    } finally { for (const nest of nests) disposeScene(nest); disposeScene(environment.group); }
  }],
  ['world reconstruction owns and releases its collision registry independently', async () => {
    for (let i = 0; i < 2; i++) {
      const world = new World();
      try {
        check(world.collision?.size > 0, 'World does not own a collision registry');
        const p = placedCenter(world.group.getObjectByName('GroveBranchingTrunks') as InstancedMesh);
        check(isBlocked(p.x, p.z, { minY: p.y - .25, maxY: p.y + .25 }), 'World registry not active');
        world.disposeCollision(); world.disposeCollision();
        check(world.collision.size === 0 && world.collision.cellCount === 0, 'World collision lifetime leaks');
        check(!isBlocked(p.x, p.z, { minY: p.y - .25, maxY: p.y + .25 }), 'destroyed world still blocks traversal');
      } finally { world.disposeCollision?.(); disposeScene(world.group); }
    }
  }],
];
export async function runCoreTests() {
  const results = [];
  for (const [name, run] of cases) {
    try { await run(); results.push({ name, pass: true }); }
    catch (error) { results.push({ name, pass: false, error: String(error) }); }
  }
  return results;
}
