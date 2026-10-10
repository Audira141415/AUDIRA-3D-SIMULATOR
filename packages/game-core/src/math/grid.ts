import { Vector3D } from '@audira/shared';

export function snapToGrid(position: Vector3D, gridSize = 1): Vector3D {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.max(0, position.y),
    z: Math.round(position.z / gridSize) * gridSize,
  };
}

export function distance3D(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
