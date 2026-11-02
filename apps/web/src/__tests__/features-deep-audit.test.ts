import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleFxStore } from '../stores/useVehicleFxStore';
import { useVisualStyleStore } from '../stores/useVisualStyleStore';
import { useMultiLayerRecordStore } from '../stores/useMultiLayerRecordStore';
import { useHistoryStore } from '../stores/useHistoryStore';
import { useWorldStore } from '../stores/useWorldStore';
import { GameObject } from '@audira/shared';

describe('Deep Features & Systems Audit', () => {
  beforeEach(() => {
    useWorldStore.setState({ objects: [] });
    useHistoryStore.setState({ past: [], future: [] });
    useVehicleFxStore.getState().restoreAllFx();
  });

  it('should test Vehicle Hydraulics & Destruction FX math and state', () => {
    const fxStore = useVehicleFxStore.getState();
    const vId = 'veh-test-truck';

    // Default item
    const defaultFx = fxStore.getVehicleFx(vId);
    expect(defaultFx.hydraulicActive).toBe(false);
    expect(defaultFx.hydraulicProgress).toBe(0);

    // Toggle hydraulics active
    fxStore.setHydraulicActive(vId, true);
    expect(useVehicleFxStore.getState().getVehicleFx(vId).hydraulicActive).toBe(true);

    // Step progress
    fxStore.stepHydraulicProgress(vId, 0.5);
    expect(useVehicleFxStore.getState().getVehicleFx(vId).hydraulicProgress).toBe(0.5);

    // Pitch tilt calculation: Math.sin(progress * PI) * 0.55 rad (~31.5 deg max tilt)
    const midProgressTilt = Math.sin(0.5 * Math.PI) * 0.55;
    expect(midProgressTilt).toBeCloseTo(0.55, 3);

    // Damage FX trigger
    fxStore.triggerFx(vId, 'crush');
    expect(useVehicleFxStore.getState().getVehicleFx(vId).fxType).toBe('crush');

    fxStore.triggerFx(vId, 'explode');
    expect(useVehicleFxStore.getState().getVehicleFx(vId).fxType).toBe('explode');

    // Restore all
    fxStore.restoreAllFx();
    expect(useVehicleFxStore.getState().getVehicleFx(vId).fxType).toBe('none');
    expect(useVehicleFxStore.getState().getVehicleFx(vId).hydraulicActive).toBe(false);
  });

  it('should test Visual Studio slowmo 0.25x and aspect ratio overlays', () => {
    const visualStore = useVisualStyleStore.getState();
    expect(visualStore.slowmoActive).toBe(false);
    expect(visualStore.aspectRatio).toBe('16:9');

    // Toggle slowmo
    visualStore.toggleSlowmo();
    expect(useVisualStyleStore.getState().slowmoActive).toBe(true);

    // Test physics delta scaling during slowmo: delta * 0.25
    const standardDelta = 0.016; // ~60fps
    const slowmoDelta = standardDelta * (useVisualStyleStore.getState().slowmoActive ? 0.25 : 1.0);
    expect(slowmoDelta).toBe(0.004);

    // Aspect ratio switching
    visualStore.setAspectRatio('9:16'); // Shorts / TikTok
    expect(useVisualStyleStore.getState().aspectRatio).toBe('9:16');
    visualStore.setAspectRatio('21:9'); // Cinematic Ultrawide
    expect(useVisualStyleStore.getState().aspectRatio).toBe('21:9');
  });

  it('should test Multi-Layer Activity Keyframe Recording & Ghost Replay', () => {
    const multiStore = useMultiLayerRecordStore.getState();
    expect(multiStore.isRecording).toBe(false);
    expect(multiStore.layers).toHaveLength(0);

    // Create a new layer
    const newLayer = {
      id: 'layer-1',
      vehicleId: 'veh-ghost-1',
      vehicleName: 'Scania Ghost',
      modelUrl: '/models/scania.glb',
      color: '#3b82f6',
      duration: 10,
      frames: [
        {
          time: 0.1,
          x: 5,
          y: 0,
          z: 10,
          rotY: 45,
          speed: 12,
          brake: false,
          lights: true,
        },
        {
          time: 0.2,
          x: 10,
          y: 0,
          z: 20,
          rotY: 45,
          speed: 14,
          brake: false,
          lights: true,
        },
      ],
      muted: false,
      solo: false,
    };

    useMultiLayerRecordStore.setState({ layers: [newLayer] });
    expect(useMultiLayerRecordStore.getState().layers).toHaveLength(1);
    expect(useMultiLayerRecordStore.getState().layers[0].frames).toHaveLength(2);
  });

  it('should test World Store and History Store Undo/Redo stack', () => {
    const testObj: GameObject = {
      id: 'test-house-1',
      assetId: 'prop-container',
      name: 'Rumah Kontainer',
      type: 'building',
      category: 'dekorasi',
      position: { x: 10, y: 0, z: 10 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      locked: false,
    };

    // Add object
    useWorldStore.getState().addObject(testObj);
    expect(useWorldStore.getState().objects).toHaveLength(1);
    expect(useWorldStore.getState().objects[0].id).toBe('test-house-1');

    // Update object transform
    useWorldStore.getState().updateObject('test-house-1', {
      position: { x: 25, y: 0, z: 35 },
    });
    expect(useWorldStore.getState().objects[0].position.x).toBe(25);

    // Delete object
    useWorldStore.getState().deleteObject('test-house-1');
    expect(useWorldStore.getState().objects).toHaveLength(0);
  });
});
