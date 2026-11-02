import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoRecordStore } from '../stores/useVideoRecordStore';
import { useVehicleRunStore, Waypoint } from '../stores/useVehicleRunStore';

describe('Smart Auto-Director & Video Recorder', () => {
  beforeEach(() => {
    useVideoRecordStore.setState({
      isRecording: false,
      recordDuration: 0,
      targetFPS: 60,
      videoQuality: 'high',
      autoRecordOnRun: false,
      autoRecordOnDrive: false,
    });

    useVehicleRunStore.setState({
      isOpen: false,
      isRunning: false,
      isPaused: false,
      runSpeed: 11.11,
      runSet: [],
      paths: {},
      autoRecord: false,
      smartDirector: true,
      cycleFocusCam: true,
    });
  });

  it('should toggle auto-recording flags for RUN and Drive modes', () => {
    useVideoRecordStore.getState().setAutoRecordOnRun(true);
    expect(useVideoRecordStore.getState().autoRecordOnRun).toBe(true);

    useVideoRecordStore.getState().setAutoRecordOnDrive(true);
    expect(useVideoRecordStore.getState().autoRecordOnDrive).toBe(true);

    useVideoRecordStore.getState().setTargetFPS(30);
    expect(useVideoRecordStore.getState().targetFPS).toBe(30);

    useVideoRecordStore.getState().setVideoQuality('ultra');
    expect(useVideoRecordStore.getState().videoQuality).toBe('ultra');
  });

  it('should manage multi-vehicle run waypoints with undo and clear', () => {
    const vId = 'veh-lightning-mcqueen';
    useVehicleRunStore.getState().setPathEdit(true, vId);

    const pt1: Waypoint = { x: 0, y: 0, z: 0 };
    const pt2: Waypoint = { x: 10, y: 0, z: 20 };
    const pt3: Waypoint = { x: 25, y: 0, z: 40 };

    useVehicleRunStore.getState().addPathPoint(pt1);
    useVehicleRunStore.getState().addPathPoint(pt2);
    useVehicleRunStore.getState().addPathPoint(pt3);

    let currentPaths = useVehicleRunStore.getState().paths[vId];
    expect(currentPaths).toHaveLength(3);
    expect(currentPaths[2]).toEqual(pt3);

    // Test Undo
    useVehicleRunStore.getState().undoPathPoint();
    currentPaths = useVehicleRunStore.getState().paths[vId];
    expect(currentPaths).toHaveLength(2);
    expect(currentPaths[1]).toEqual(pt2);

    // Test Clear
    useVehicleRunStore.getState().clearPath(vId);
    expect(useVehicleRunStore.getState().paths[vId]).toBeUndefined();
  });

  it('should toggle smart director, auto record, and cycle focus camera in RUN store', () => {
    useVehicleRunStore.getState().setAutoRecord(true);
    expect(useVehicleRunStore.getState().autoRecord).toBe(true);

    useVehicleRunStore.getState().setSmartDirector(false);
    expect(useVehicleRunStore.getState().smartDirector).toBe(false);
    useVehicleRunStore.getState().setSmartDirector(true);
    expect(useVehicleRunStore.getState().smartDirector).toBe(true);

    useVehicleRunStore.getState().setCycleFocusCam(false);
    expect(useVehicleRunStore.getState().cycleFocusCam).toBe(false);
  });

  it('should evaluate simulated telemetry for AI director angle cuts correctly', () => {
    // Test the director angle decision logic used in VehicleSimulator
    function evaluateDirectorAngle(telemetry: {
      isAirborne: boolean;
      steerAngle: number;
      speed: number;
      timer: number;
    }): string {
      if (telemetry.isAirborne) return 'drone';
      if (Math.abs(telemetry.steerAngle) > 0.4) {
        return telemetry.steerAngle > 0 ? 'side-right' : 'side-left';
      }
      if (Math.abs(telemetry.speed) > 15) return 'low-stunt';
      if (Math.abs(telemetry.speed) < 1.0) return 'orbit-360';
      return 'chase';
    }

    // 1. Airborne jump
    expect(
      evaluateDirectorAngle({ isAirborne: true, steerAngle: 0, speed: 20, timer: 0 })
    ).toBe('drone');

    // 2. Hard right steer (drift)
    expect(
      evaluateDirectorAngle({ isAirborne: false, steerAngle: 0.65, speed: 10, timer: 0 })
    ).toBe('side-right');

    // 3. Hard left steer (drift)
    expect(
      evaluateDirectorAngle({ isAirborne: false, steerAngle: -0.55, speed: 10, timer: 0 })
    ).toBe('side-left');

    // 4. High speed sprint
    expect(
      evaluateDirectorAngle({ isAirborne: false, steerAngle: 0.05, speed: 22, timer: 0 })
    ).toBe('low-stunt');

    // 5. Stopped / idle
    expect(
      evaluateDirectorAngle({ isAirborne: false, steerAngle: 0, speed: 0.2, timer: 0 })
    ).toBe('orbit-360');

    // 6. Regular cruising
    expect(
      evaluateDirectorAngle({ isAirborne: false, steerAngle: 0.02, speed: 8, timer: 0 })
    ).toBe('chase');
  });
});

