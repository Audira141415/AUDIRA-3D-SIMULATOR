import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVehicleRunStore } from '../../stores/useVehicleRunStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useVideoRecordStore } from '../../stores/useVideoRecordStore';
import { soundEngine } from '../audio/soundEngine';

export const MultiVehicleRunEngine: React.FC = () => {
  const isRunning = useVehicleRunStore((s) => s.isRunning);
  const isPaused = useVehicleRunStore((s) => s.isPaused);
  const runSpeed = useVehicleRunStore((s) => s.runSpeed);
  const runMode = useVehicleRunStore((s) => s.runMode);
  const runSet = useVehicleRunStore((s) => s.runSet);
  const runDisabled = useVehicleRunStore((s) => s.runDisabled);
  const manualGo = useVehicleRunStore((s) => s.manualGo);
  const paths = useVehicleRunStore((s) => s.paths);
  const followCam = useVehicleRunStore((s) => s.followCam);
  const smoothCam = useVehicleRunStore((s) => s.smoothCam);
  const focusedVehicleId = useVehicleRunStore((s) => s.focusedVehicleId);
  const autoRecord = useVehicleRunStore((s) => s.autoRecord);
  const smartDirector = useVehicleRunStore((s) => s.smartDirector);
  const cycleFocusCam = useVehicleRunStore((s) => s.cycleFocusCam);
  const saveInitialPosition = useVehicleRunStore((s) => s.saveInitialPosition);

  const objects = useWorldStore((s) => s.objects);
  const updateObject = useWorldStore((s) => s.updateObject);

  const { camera } = useThree();

  // Progress for each vehicle (0 to 1)
  const progressMap = useRef<Record<string, number>>({});
  // Cached curves and curve lengths for performance
  const curvesMap = useRef<Record<string, { curve: THREE.CatmullRomCurve3; length: number }>>({});
  // Sequence mode current active vehicle index
  const sequenceActiveIdx = useRef(0);

  // Smart director timers & angles
  const directorTimer = useRef(0);
  const directorAngleIdx = useRef(0);
  const cycleCarTimer = useRef(0);
  const orbitAngle = useRef(0);

  // Sound loop control
  useEffect(() => {
    if (isRunning && !isPaused && runSet.length > 0) {
      soundEngine.startEngine();
      soundEngine.updateEngine(Math.min(1, runSpeed / 40), true);
    } else {
      soundEngine.stopEngine();
    }
    return () => {
      soundEngine.stopEngine();
    };
  }, [isRunning, isPaused, runSet.length, runSpeed]);

  // Smart Auto-Recorder Trigger: Auto start/stop recording on RUN
  useEffect(() => {
    if (isRunning && autoRecord) {
      const started = useVideoRecordStore.getState().startRecording();
      if (started) {
        soundEngine.playSuccess();
      }
    } else if (!isRunning && autoRecord) {
      if (useVideoRecordStore.getState().isRecording) {
        useVideoRecordStore.getState().stopRecording();
      }
    }
  }, [isRunning, autoRecord]);

  // When RUN starts: Save initial positions of vehicles if not saved yet
  useEffect(() => {
    if (isRunning) {
      objects.forEach((obj) => {
        if (runSet.includes(obj.id)) {
          saveInitialPosition(obj.id, {
            position: { ...obj.position },
            rotation: { ...obj.rotation },
          });
        }
      });
      // Initialize progress to 0 for participating vehicles
      runSet.forEach((id) => {
        if (progressMap.current[id] === undefined) {
          progressMap.current[id] = 0;
        }
      });
    }
  }, [isRunning, runSet, objects, saveInitialPosition]);

  // Build / update CatmullRom curves whenever paths change
  useEffect(() => {
    const newCurves: Record<string, { curve: THREE.CatmullRomCurve3; length: number }> = {};
    Object.entries(paths).forEach(([vId, pts]) => {
      if (pts && pts.length >= 2) {
        const vectors = pts.map((p) => new THREE.Vector3(p.x, 0, p.z));
        const curve = new THREE.CatmullRomCurve3(vectors, false, 'centripetal', 0.5);
        const length = curve.getLength();
        newCurves[vId] = { curve, length: Math.max(1, length) };
      }
    });
    curvesMap.current = newCurves;
  }, [paths]);

  // Main Simulation Loop
  useFrame((_, delta) => {
    if (!isRunning || isPaused || runSet.length === 0) return;

    // Filter valid running vehicles
    const validVehicles = runSet.filter((id) => {
      return !runDisabled.includes(id) && curvesMap.current[id];
    });

    if (validVehicles.length === 0) return;

    // Smart Director Cut Timer
    if (smartDirector) {
      directorTimer.current += delta;
      if (directorTimer.current > 5.5) {
        directorTimer.current = 0;
        directorAngleIdx.current = (directorAngleIdx.current + 1) % 6;
      }
      orbitAngle.current += delta * 0.8;
    }

    // Auto Cycle Focus Vehicle Timer
    if (cycleFocusCam && validVehicles.length > 1) {
      cycleCarTimer.current += delta;
      if (cycleCarTimer.current > 6.0) {
        cycleCarTimer.current = 0;
        const currIdx = focusedVehicleId ? validVehicles.indexOf(focusedVehicleId) : 0;
        const nextIdx = (currIdx + 1) % validVehicles.length;
        useVehicleRunStore.getState().setFocusedVehicleId(validVehicles[nextIdx]);
      }
    }

    let targetCamPos: THREE.Vector3 | null = null;
    let targetCamLook: THREE.Vector3 | null = null;

    for (let idx = 0; idx < validVehicles.length; idx++) {
      const vId = validVehicles[idx];
      // Sequence mode: only current index vehicle runs
      if (runMode === 'sequence' && idx !== sequenceActiveIdx.current) {
        return;
      }

      // Manual mode: only vehicles in manualGo run
      if (runMode === 'manual' && !manualGo.includes(vId)) {
        return;
      }

      const { curve, length } = curvesMap.current[vId];
      let p = progressMap.current[vId] ?? 0;

      // Advance progress: delta * speed / length
      const step = (runSpeed * delta) / length;
      p += step;

      // Handle loop or sequence completion
      if (p >= 1) {
        if (runMode === 'sequence') {
          p = 0;
          sequenceActiveIdx.current = (sequenceActiveIdx.current + 1) % validVehicles.length;
        } else {
          p = p % 1; // Continuous loop
        }
      }
      progressMap.current[vId] = p;

      // Calculate 3D position and tangent direction
      const currentPos = curve.getPointAt(p);
      const tangent = curve.getTangentAt(p);

      // Compute heading yaw angle in degrees (consistent with WorldObject and VehicleSimulator)
      const yawDeg = Number(((Math.atan2(tangent.x, tangent.z) * 180) / Math.PI).toFixed(1));

      // Apply Ground Level Alignment (y >= 0)
      updateObject(vId, {
        position: { x: currentPos.x, y: 0, z: currentPos.z },
        rotation: { x: 0, y: yawDeg, z: 0 },
      });

      // Camera follow assignment
      const isTargetForCamera =
        focusedVehicleId === vId ||
        (!focusedVehicleId && idx === (runMode === 'sequence' ? sequenceActiveIdx.current : 0));

      if (followCam && isTargetForCamera) {
        const rightX = tangent.z;
        const rightZ = -tangent.x;

        if (smartDirector) {
          // Dynamic Multi-Angle AI Director Cuts
          switch (directorAngleIdx.current) {
            case 0: // Chase Behind
              targetCamPos = new THREE.Vector3(
                currentPos.x - tangent.x * 14,
                5.5,
                currentPos.z - tangent.z * 14
              );
              targetCamLook = new THREE.Vector3(currentPos.x + tangent.x * 4, 1.2, currentPos.z + tangent.z * 4);
              break;
            case 1: // Side-Right Action
              targetCamPos = new THREE.Vector3(
                currentPos.x + rightX * 11 + tangent.x * 2,
                3.2,
                currentPos.z + rightZ * 11 + tangent.z * 2
              );
              targetCamLook = new THREE.Vector3(currentPos.x, 1.2, currentPos.z);
              break;
            case 2: // Low Stunt Wheel View
              targetCamPos = new THREE.Vector3(
                currentPos.x - tangent.x * 7 + rightX * 2.2,
                0.8,
                currentPos.z - tangent.z * 7 + rightZ * 2.2
              );
              targetCamLook = new THREE.Vector3(currentPos.x + tangent.x * 8, 0.9, currentPos.z + tangent.z * 8);
              break;
            case 3: // Front Hood Approaching
              targetCamPos = new THREE.Vector3(
                currentPos.x + tangent.x * 13,
                3.8,
                currentPos.z + tangent.z * 13
              );
              targetCamLook = new THREE.Vector3(currentPos.x, 1.2, currentPos.z);
              break;
            case 4: // Bird-Eye Drone View
              targetCamPos = new THREE.Vector3(currentPos.x, 24, currentPos.z + 0.1);
              targetCamLook = new THREE.Vector3(currentPos.x, 0, currentPos.z);
              break;
            case 5: // Orbit 360 Sweep
            default: {
              const ox = Math.sin(orbitAngle.current) * 13;
              const oz = Math.cos(orbitAngle.current) * 13;
              targetCamPos = new THREE.Vector3(currentPos.x + ox, 4.5, currentPos.z + oz);
              targetCamLook = new THREE.Vector3(currentPos.x, 1.2, currentPos.z);
              break;
            }
          }
        } else {
          // Standard Follow / Chase Camera
          const camDistance = 14;
          const camHeight = 6;
          targetCamPos = new THREE.Vector3(
            currentPos.x - tangent.x * camDistance,
            camHeight,
            currentPos.z - tangent.z * camDistance
          );
          targetCamLook = new THREE.Vector3(currentPos.x, 1.5, currentPos.z);
        }
      }
    }

    // Smoothly update camera if followCam is enabled
    if (followCam && targetCamPos && targetCamLook) {
      // Ground Level Alignment: Never clip below ground y=0
      targetCamPos.y = Math.max(0.6, targetCamPos.y);

      if (smoothCam) {
        const lerpFactor = Math.min(1, delta * 3.8);
        camera.position.lerp(targetCamPos, lerpFactor);
        camera.lookAt(targetCamLook);
      } else {
        camera.position.copy(targetCamPos);
        camera.lookAt(targetCamLook);
      }
    }
  });

  return null;
};
