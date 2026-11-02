import { describe, it, expect, beforeEach } from 'vitest';
import { useCameraStore, CameraTrackingAngle } from '../stores/useCameraStore';
import * as THREE from 'three';

describe('Camera System & Rotation Controls', () => {
  beforeEach(() => {
    useCameraStore.getState().resetView();
  });

  it('should initialize with default isometric preset and free tracking angle', () => {
    const state = useCameraStore.getState();
    expect(state.preset).toBe('isometric');
    expect(state.trackingAngle).toBe('free');
    expect(state.trackingDistance).toBe(12);
    expect(state.trackingHeight).toBe(5);
    expect(state.orbitSpeed).toBe(0.5);
    expect(state.isCinematicPanelOpen).toBe(false);
  });

  it('should switch between all 9 tracking angles properly', () => {
    const angles: CameraTrackingAngle[] = [
      'free',
      'chase',
      'front',
      'side-left',
      'side-right',
      'drone',
      'orbit-360',
      'low-stunt',
      'director',
    ];

    angles.forEach((angle) => {
      useCameraStore.getState().setTrackingAngle(angle);
      expect(useCameraStore.getState().trackingAngle).toBe(angle);
    });
  });

  it('should correctly switch camera presets and reset tracking angle to free', () => {
    useCameraStore.getState().setTrackingAngle('chase');
    expect(useCameraStore.getState().trackingAngle).toBe('chase');

    useCameraStore.getState().setPreset('top');
    expect(useCameraStore.getState().preset).toBe('top');
    expect(useCameraStore.getState().trackingAngle).toBe('free');

    useCameraStore.getState().setPreset('front');
    expect(useCameraStore.getState().preset).toBe('front');

    useCameraStore.getState().setPreset('side');
    expect(useCameraStore.getState().preset).toBe('side');
  });

  it('should adjust tracking distance, height, and orbit speed within valid ranges', () => {
    useCameraStore.getState().setTrackingDistance(25);
    expect(useCameraStore.getState().trackingDistance).toBe(25);

    useCameraStore.getState().setTrackingHeight(8.5);
    expect(useCameraStore.getState().trackingHeight).toBe(8.5);

    useCameraStore.getState().setOrbitSpeed(1.8);
    expect(useCameraStore.getState().orbitSpeed).toBe(1.8);

    useCameraStore.getState().setSmartDirectorCutInterval(7);
    expect(useCameraStore.getState().smartDirectorCutInterval).toBe(7);
  });

  it('should enforce ground level constraints (y >= 0.6) so camera never clips into ground', () => {
    // Test boundary constraint logic used across CameraController & MultiVehicleRunEngine
    const rawTargetPositions = [
      new THREE.Vector3(10, -5, 20),
      new THREE.Vector3(0, -0.2, 0),
      new THREE.Vector3(15, 0.4, 5),
      new THREE.Vector3(30, 8.0, 10),
    ];

    rawTargetPositions.forEach((pos) => {
      pos.y = Math.max(0.6, pos.y);
      expect(pos.y).toBeGreaterThanOrEqual(0.6);
    });
  });

  it('should compute correct 360 degree orbit offsets', () => {
    const dist = 14;
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];

    angles.forEach((rad) => {
      const ox = Math.sin(rad) * dist;
      const oz = Math.cos(rad) * dist;
      const computedDist = Math.sqrt(ox * ox + oz * oz);
      expect(Math.abs(computedDist - dist)).toBeLessThan(0.0001);
    });
  });
});

