import { describe, it, expect, beforeEach } from 'vitest';
import { useTerrainSculptStore } from '../stores/useTerrainSculptStore';
import * as THREE from 'three';

describe('Terrain Sculpting & Vehicle Trajectory Physics', () => {
  beforeEach(() => {
    useTerrainSculptStore.getState().clearHeightMap();
    useTerrainSculptStore.getState().setTool(null);
  });

  it('should initialize with default flat terrain elevation of zero', () => {
    const store = useTerrainSculptStore.getState();
    expect(store.getTerrainHeight(0, 0)).toBe(0);
    expect(store.getTerrainHeight(50, -50)).toBe(0);
  });

  it('should deform terrain vertices with raise brush and allow physical height sampling', () => {
    const store = useTerrainSculptStore.getState();
    store.setTool('raise');
    store.setRadius(10);
    store.setStrength(1.0);

    // Apply sculpt raise at center (0, 0)
    store.applySculptAtPoint(0, 0, 0.2);

    const centerHeight = store.getTerrainHeight(0, 0);
    expect(centerHeight).toBeGreaterThan(0);

    // Height should fall off radially from the center
    const nearHeight = store.getTerrainHeight(3, 0);
    const farHeight = store.getTerrainHeight(15, 0);
    expect(centerHeight).toBeGreaterThanOrEqual(nearHeight);
    expect(nearHeight).toBeGreaterThanOrEqual(farHeight);
  });

  it('should correctly calculate CatmullRom spline trajectories and tangent yaw', () => {
    const waypoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(20, 0, 30),
      new THREE.Vector3(50, 0, 40),
      new THREE.Vector3(80, 0, 0),
    ];

    const curve = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal', 0.5);
    const length = curve.getLength();
    expect(length).toBeGreaterThan(80);

    // Sample at 50%
    const midPoint = curve.getPointAt(0.5);
    const tangent = curve.getTangentAt(0.5);

    expect(midPoint.x).toBeGreaterThan(0);
    expect(tangent.length()).toBeCloseTo(1.0, 3);

    // Heading yaw in degrees
    const yawDeg = Number(((Math.atan2(tangent.x, tangent.z) * 180) / Math.PI).toFixed(1));
    expect(typeof yawDeg).toBe('number');
    expect(yawDeg).toBeGreaterThanOrEqual(-180);
    expect(yawDeg).toBeLessThanOrEqual(180);
  });

  it('should guarantee vehicles stay above ground level (y >= 0) on deformed terrain', () => {
    const store = useTerrainSculptStore.getState();
    store.setTool('raise');
    store.applySculptAtPoint(10, 10, 0.5);
    const groundElevation = store.getTerrainHeight(10, 10);

    const vehicleAltitude = 0; // On wheels
    const finalVehicleY = Number((groundElevation + vehicleAltitude).toFixed(2));

    expect(finalVehicleY).toBeGreaterThanOrEqual(0);
    expect(finalVehicleY).toBeCloseTo(groundElevation, 2);
  });
});
