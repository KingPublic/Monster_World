import { MathUtils, Quaternion, Vector3 } from 'three';
import type { Bone, Object3D } from 'three';

function aim(bone: Bone, current: Vector3, desired: Vector3, weight: number): void {
  const original = bone.quaternion.clone();
  const delta = new Quaternion().setFromUnitVectors(current.normalize(), desired.normalize());
  const rotation = delta.multiply(bone.getWorldQuaternion(new Quaternion()));
  bone.quaternion.copy(bone.parent!.getWorldQuaternion(new Quaternion()).invert().multiply(rotation));
  bone.quaternion.copy(original.slerp(bone.quaternion, weight));
}
/** Two-bone arm reach with an explicit elbow pole; never changes the physics root. */
export function reachHand(root: Object3D, upper: Bone, elbow: Bone, hand: Bone, target: Vector3, pole: Vector3, weight: number): void {
  if (weight < .001) return;
  root.updateWorldMatrix(true, true);
  const shoulder = upper.getWorldPosition(new Vector3()), joint = elbow.getWorldPosition(new Vector3()), wrist = hand.getWorldPosition(new Vector3());
  const a = shoulder.distanceTo(joint), b = joint.distanceTo(wrist);
  if (a < .001 || b < .001) return;
  const direction = target.clone().sub(shoulder), distance = MathUtils.clamp(direction.length(), Math.abs(a - b) + .001, a + b - .001);
  direction.normalize();
  const bend = pole.clone().sub(shoulder); bend.addScaledVector(direction, -bend.dot(direction));
  if (bend.lengthSq() < .000001) bend.set(1, 0, 0).addScaledVector(direction, -direction.x);
  bend.normalize();
  const cos = MathUtils.clamp((a * a + distance * distance - b * b) / (2 * a * distance), -1, 1);
  const elbowTarget = shoulder.clone().addScaledVector(direction, a * cos).addScaledVector(bend, a * Math.sqrt(1 - cos * cos));
  aim(upper, joint.clone().sub(shoulder), elbowTarget.sub(shoulder), weight);
  root.updateWorldMatrix(true, true);
  const movedJoint = elbow.getWorldPosition(joint), movedHand = hand.getWorldPosition(wrist);
  aim(elbow, movedHand.clone().sub(movedJoint), target.clone().sub(movedJoint), weight);
  root.updateWorldMatrix(true, true);
}
