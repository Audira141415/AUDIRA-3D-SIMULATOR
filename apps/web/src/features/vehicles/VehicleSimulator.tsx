import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Square, Zap } from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { soundEngine } from '../audio/soundEngine';
import { useCameraStore } from '../../stores/useCameraStore';
import { useVehicleAudioStore } from '../../stores/useVehicleAudioStore';
import { useMultiLayerRecordStore } from '../../stores/useMultiLayerRecordStore';
import { useTerrainSculptStore } from '../../stores/useTerrainSculptStore';
import { useVisualStyleStore } from '../../stores/useVisualStyleStore';
import { useVideoRecordStore } from '../../stores/useVideoRecordStore';
import { VehicleDynamicLights } from './VehicleDynamicLights';
import { VehicleParticleTrail } from './VehicleParticleTrail';

export type CameraMode = 'follow' | 'cockpit' | 'cinematic' | 'drone';

export const VehicleController: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const setSimState = useEditorStore((s) => s.setSimState);
  const cameraModePill = useVehicleAudioStore((s) => s.cameraModePill);
  const headlights = useVehicleAudioStore((s) => s.headlights);
  const toggleHeadlights = useVehicleAudioStore((s) => s.toggleHeadlights);
  const toggleHighBeam = useVehicleAudioStore((s) => s.toggleHighBeam);
  const toggleBlinkerLeft = useVehicleAudioStore((s) => s.toggleBlinkerLeft);
  const toggleBlinkerRight = useVehicleAudioStore((s) => s.toggleBlinkerRight);
  const nitro = useVehicleAudioStore((s) => s.nitro);
  const setNitro = useVehicleAudioStore((s) => s.setNitro);
  const isNitroActive = useVehicleAudioStore((s) => s.isNitroActive);
  const setIsNitroActive = useVehicleAudioStore((s) => s.setIsNitroActive);
  const worldSize = useWorldStore((s) => s.worldSize) || 300;
  const objects = useWorldStore((s) => s.objects);
  const updateObject = useWorldStore((s) => s.updateObject);
  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);

  const { camera } = useThree();

  // Auto-record on drive
  useEffect(() => {
    const autoRec = useVideoRecordStore.getState().autoRecordOnDrive;
    if (isPlaying && autoRec) {
      useVideoRecordStore.getState().startRecording();
    }
    return () => {
      if (useVideoRecordStore.getState().isRecording && autoRec) {
        useVideoRecordStore.getState().stopRecording();
      }
    };
  }, [isPlaying]);

  // Driving & Flight physics states
  const keys = useRef<{ [key: string]: boolean }>({});
  const speed = useRef(0);
  const steerAngle = useRef(0);
  const verticalVelocity = useRef(0);
  const altitude = useRef(0);
  const pitchAngle = useRef(0);
  const rollAngle = useRef(0);
  const recordingClock = useRef(0);
  const isAirborne = useRef(false);
  const collisionCooldown = useRef(0);
  const nitroTank = useRef(nitro);

  // Camera mode state (Follow, Cockpit, Cinematic, Drone)
  const [cameraMode, setCameraMode] = useState<CameraMode>('follow');
  const cinematicCamPos = useRef(new THREE.Vector3(20, 8, 20));
  const trackingAngle = useCameraStore((s) => s.trackingAngle);
  const trackingDist = useCameraStore((s) => s.trackingDistance);
  const trackingH = useCameraStore((s) => s.trackingHeight);
  const orbitSpd = useCameraStore((s) => s.orbitSpeed);
  const simOrbitAngle = useRef(0);
  const simDirectorTimer = useRef(0);
  const simDirectorAngle = useRef('chase');

  // Find target vehicle or aircraft
  const targetVehicle = useMemo(() => {
    if (!isPlaying) return null;
    if (selectedObjectId) {
      const selected = objects.find((o) => o.id === selectedObjectId);
      if (
        selected &&
        (selected.category === 'kendaraan' ||
          selected.category === 'pesawat' ||
          selected.category === 'tractor' ||
          selected.category === 'vehicles')
      ) {
        return selected;
      }
    }
    // Fallback to first vehicle or aircraft
    return (
      objects.find(
        (o) =>
          o.category === 'kendaraan' ||
          o.category === 'pesawat' ||
          o.category === 'tractor' ||
          o.category === 'vehicles'
      ) || null
    );
  }, [isPlaying, selectedObjectId, objects]);

  // Sync vehicle selection cleanly in effect
  useEffect(() => {
    if (isPlaying && targetVehicle && selectedObjectId !== targetVehicle.id) {
      selectObject(targetVehicle.id);
    }
  }, [isPlaying, targetVehicle, selectedObjectId, selectObject]);

  const isAircraft = targetVehicle?.category === 'pesawat';

  // Ramps in scene for stunt jump collision detection
  const rampObjects = useMemo(() => {
    return objects.filter(
      (o) =>
        o.assetId?.includes('ramp') ||
        o.assetId?.includes('stunt') ||
        o.type?.includes('ramp')
    );
  }, [objects]);

  // Keyboard controls listener
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      // Honk Horn ('H' or 'B' matching screenshot)
      if (e.code === 'KeyH' || e.code === 'KeyB') {
        soundEngine.playHorn();
      }
      // Air brake release on brake tap ('Space')
      if (e.code === 'Space' && Math.abs(speed.current) > 2) {
        soundEngine.playAirBrake();
      }
      // Camera Mode Switch ('C')
      if (e.code === 'KeyC') {
        setCameraMode((prev) => {
          if (prev === 'follow') return 'cockpit';
          if (prev === 'cockpit') return 'cinematic';
          if (prev === 'cinematic') return 'drone';
          return 'follow';
        });
      }
      // Headlights Toggle ('L')
      if (e.code === 'KeyL') {
        toggleHeadlights();
        soundEngine.playUIClick();
      }
      // High Beam Toggle ('K')
      if (e.code === 'KeyK') {
        toggleHighBeam();
        soundEngine.playUIClick();
      }
      // Blinker Left ('Z')
      if (e.code === 'KeyZ' || e.code === 'BracketLeft') {
        toggleBlinkerLeft();
        soundEngine.playUIClick();
      }
      // Blinker Right ('X')
      if (e.code === 'KeyX' || e.code === 'BracketRight') {
        toggleBlinkerRight();
        soundEngine.playUIClick();
      }
      // Exit Simulation
      if (e.code === 'Escape') {
        soundEngine.stopEngine();
        setIsPlaying(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keys.current = {};
      speed.current = 0;
      steerAngle.current = 0;
      verticalVelocity.current = 0;
      altitude.current = 0;
      soundEngine.stopEngine();
      useEditorStore.getState().setSimState(0, '');
    };
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    if (targetVehicle) {
      soundEngine.startEngine();
      setSimState(0, targetVehicle.name);
      altitude.current = targetVehicle.position.y || 0;
      // Setup cinematic camera point near vehicle
      cinematicCamPos.current.set(
        targetVehicle.position.x + 18,
        targetVehicle.position.y + 6,
        targetVehicle.position.z + 18
      );
    } else {
      soundEngine.stopEngine();
      setSimState(0, '');
    }
  }, [targetVehicle, setSimState]);

  useFrame((_, delta) => {
    if (!isPlaying || !targetVehicle) return;

    const isAccelerating = !!(keys.current['KeyW'] || keys.current['ArrowUp']);
    const isReversing = !!(keys.current['KeyS'] || keys.current['ArrowDown']);
    const isSteeringLeft = !!(keys.current['KeyA'] || keys.current['ArrowLeft']);
    const isSteeringRight = !!(keys.current['KeyD'] || keys.current['ArrowRight']);
    const isBraking = !!keys.current['Space'];

    // Flight specific keys (Pitch Up/Down)
    const isPitchUp = !!(keys.current['KeyE'] || (isAircraft && keys.current['Space']));
    const isPitchDown = !!(keys.current['KeyQ'] || (isAircraft && keys.current['ShiftLeft']));
    const isShiftPressed = !!(keys.current['ShiftLeft'] || keys.current['ShiftRight']);

    // Turbo Nitro Boost logic
    const isNitroFiring = isAccelerating && isShiftPressed && nitroTank.current > 5;
    if (isNitroFiring) {
      if (!isNitroActive) {
        setIsNitroActive(true);
        soundEngine.playNitroBoost();
      }
      nitroTank.current = Math.max(0, nitroTank.current - delta * 32);
      setNitro(nitroTank.current);
    } else {
      if (isNitroActive) {
        setIsNitroActive(false);
        soundEngine.stopNitroBoost();
      }
      if (nitroTank.current < 100) {
        nitroTank.current = Math.min(100, nitroTank.current + delta * 15);
        setNitro(nitroTank.current);
      }
    }

    // Max speeds & multipliers
    const nitroSpeedMult = isNitroFiring ? 1.45 : 1.0;
    const nitroAccelMult = isNitroFiring ? 2.2 : 1.0;

    const maxSpeed = (isAircraft ? 36 : 24) * nitroSpeedMult; // up to ~125 km/h for cars with nitro
    const accel = (isAircraft ? 16 : 14) * nitroAccelMult;
    const brakeForce = 22;
    const friction = 5;
    const turnRate = isAircraft ? 1.8 : 2.5;

    // Camera FOV punch on nitro
    if ((camera as THREE.PerspectiveCamera).fov) {
      const targetFov = isNitroFiring ? 54 : 45;
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.fov = THREE.MathUtils.lerp(pCam.fov, targetFov, 0.1);
      pCam.updateProjectionMatrix();
    }

    // Acceleration & Braking
    if (isAccelerating) {
      speed.current = Math.min(speed.current + accel * delta, maxSpeed);
    } else if (isReversing) {
      speed.current = Math.max(speed.current - (accel * 0.6) * delta, -maxSpeed * 0.35);
    } else {
      if (speed.current > 0) {
        speed.current = Math.max(0, speed.current - friction * delta);
      } else if (speed.current < 0) {
        speed.current = Math.min(0, speed.current + friction * delta);
      }
    }

    if (isBraking && !isAircraft) {
      if (speed.current > 0) {
        speed.current = Math.max(0, speed.current - brakeForce * delta);
      } else if (speed.current < 0) {
        speed.current = Math.min(0, speed.current + brakeForce * delta);
      }
    }

    // Steering & Roll
    let targetSteer = 0;
    if (isSteeringLeft) targetSteer += 1;
    if (isSteeringRight) targetSteer -= 1;

    steerAngle.current = THREE.MathUtils.lerp(steerAngle.current, targetSteer, 0.15);

    const currentRotY = (targetVehicle.rotation.y * Math.PI) / 180;
    const newRotY = currentRotY + steerAngle.current * turnRate * (speed.current / maxSpeed) * delta;

    const forwardX = Math.sin(newRotY);
    const forwardZ = Math.cos(newRotY);

    let newX = targetVehicle.position.x + forwardX * speed.current * delta;
    let newZ = targetVehicle.position.z + forwardZ * speed.current * delta;

    // Boundaries clamping (responsive to full island world size)
    const halfBound = (worldSize * 0.5) - 4;
    newX = Math.max(-halfBound, Math.min(halfBound, newX));
    newZ = Math.max(-halfBound, Math.min(halfBound, newZ));

    // ==========================================
    // 0. OBSTACLE COLLISION DETECTION & CRASH BUMP
    // ==========================================
    if (collisionCooldown.current > 0) {
      collisionCooldown.current -= delta;
    } else if (!isAirborne.current && Math.abs(speed.current) > 2.5) {
      for (const obj of objects) {
        if (obj.id === targetVehicle.id) continue;
        const cat = (obj.category || '').toLowerCase();
        if (cat === 'road' || cat === 'peta' || obj.assetId?.includes('ramp') || obj.type?.includes('ramp')) {
          continue;
        }

        const objRadius = Math.max(1.3, ((obj.scale?.x || 1) + (obj.scale?.z || 1)) * 0.55);
        const dist = Math.hypot(newX - obj.position.x, newZ - obj.position.z);

        if (dist < objRadius + 1.2) {
          // Crash bump collision!
          soundEngine.playCrashBump();
          speed.current = -speed.current * 0.45; // Rebound bounce
          collisionCooldown.current = 0.45;

          // Camera impact jolt
          camera.position.x += (Math.random() - 0.5) * 0.8;
          camera.position.y += 0.35;

          // Push back
          const pushX = (newX - obj.position.x) / (dist || 1);
          const pushZ = (newZ - obj.position.z) / (dist || 1);
          newX += pushX * 0.6;
          newZ += pushZ * 0.6;
          break;
        }
      }
    }

    // ==========================================
    // 1. AIRCRAFT FLIGHT SIMULATOR DYNAMICS
    // ==========================================
    if (isAircraft) {
      const airspeedRatio = Math.abs(speed.current) / maxSpeed;
      if (isPitchUp && airspeedRatio > 0.25) {
        pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, 24, 0.1);
        altitude.current += airspeedRatio * 18 * delta;
      } else if (isPitchDown) {
        pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, -20, 0.1);
        altitude.current = Math.max(0, altitude.current - 14 * delta);
      } else {
        pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, 0, 0.08);
        if (altitude.current > 0 && airspeedRatio < 0.2) {
          altitude.current = Math.max(0, altitude.current - 8 * delta); // Stall descent
        }
      }

      rollAngle.current = THREE.MathUtils.lerp(rollAngle.current, -steerAngle.current * 30, 0.12);
      altitude.current = Math.min(55, Math.max(0, altitude.current)); // Ceiling 55m
    }

    // ==========================================
    // 2. STUNT RAMP JUMP & GRAVITY PHYSICS
    // ==========================================
    if (!isAircraft) {
      // Check collision with any stunt ramp
      let onRamp = false;
      for (const ramp of rampObjects) {
        const dx = Math.abs(newX - ramp.position.x);
        const dz = Math.abs(newZ - ramp.position.z);
        if (dx < 3.2 && dz < 3.2) {
          onRamp = true;
          // If driving fast onto ramp, launch into air!
          if (speed.current > 9 && !isAirborne.current) {
            isAirborne.current = true;
            verticalVelocity.current = Math.min(20, speed.current * 0.7);
            pitchAngle.current = -18; // Nose up
            soundEngine.playPlacement();
          }
          break;
        }
      }

      // Airborne trajectory with gravity
      if (isAirborne.current) {
        altitude.current += verticalVelocity.current * delta;
        verticalVelocity.current -= 18 * delta; // Gravity g = 18 m/s^2

        // Rotate pitch towards downward as apex is reached
        if (verticalVelocity.current < 0) {
          pitchAngle.current = THREE.MathUtils.lerp(pitchAngle.current, 12, 0.08); // Nose down
        }

        // Landing touch-down
        if (altitude.current <= 0) {
          altitude.current = 0;
          verticalVelocity.current = 0;
          pitchAngle.current = 0;
          isAirborne.current = false;
          soundEngine.playCrash(); // Suspension landing thump
        }
      } else if (!onRamp) {
        altitude.current = 0;
        pitchAngle.current = 0;
      }
    }

    // Sample terrain elevation so vehicle climbs hills and dips into valleys
    const groundElevation = useTerrainSculptStore.getState().getTerrainHeight(newX, newZ);
    const finalVehicleY = Number((groundElevation + altitude.current).toFixed(2));

    // Update object transform in World Store
    updateObject(
      targetVehicle.id,
      {
        position: {
          x: Number(newX.toFixed(2)),
          y: Math.max(0, finalVehicleY),
          z: Number(newZ.toFixed(2)),
        },
        rotation: {
          x: Number(pitchAngle.current.toFixed(1)),
          y: Number(((newRotY * 180) / Math.PI).toFixed(1)),
          z: Number(rollAngle.current.toFixed(1)),
        },
      },
      false
    );

    // Record frame if Multi-Layer recording is active
    const mlStore = useMultiLayerRecordStore.getState();
    if (mlStore.isRecording) {
      recordingClock.current += delta;
      mlStore.appendFrame({
        time: recordingClock.current,
        x: Number(newX.toFixed(2)),
        y: Math.max(0, altitude.current),
        z: Number(newZ.toFixed(2)),
        rotY: Number(((newRotY * 180) / Math.PI).toFixed(1)),
        speed: speed.current,
        brake: isBraking,
        lights: Boolean(headlights),
      });
    } else {
      recordingClock.current = 0;
    }

    // Update engine sound
    const speedRatio = Math.abs(speed.current) / maxSpeed;
    soundEngine.updateEngine(speedRatio, isAccelerating);

    // ==========================================
    // 3. MULTI-ANGLE CAMERA MODES
    // ==========================================
    const currentY = altitude.current;

    // Dynamic Tracking Angles from useCameraStore
    const rightX = forwardZ;
    const rightZ = -forwardX;

    const isCockpit = trackingAngle === 'front' || cameraMode === 'cockpit' || cameraModePill === 'cockpit';
    const isDrone = trackingAngle === 'drone' || cameraMode === 'drone' || cameraModePill === 'drone';
    const isCinematic = cameraMode === 'cinematic' || cameraModePill === 'cinematic';
    const isOrbit = trackingAngle === 'orbit-360' || cameraModePill === 'orbit' || cameraModePill === '3p-orbit';
    const isFlow = trackingAngle === 'low-stunt' || cameraModePill === 'flow';
    const isDirector = trackingAngle === 'director' || cameraModePill === 'director';

    if (isDirector) {
      simDirectorTimer.current += delta;
      // Evaluate telemetry for cinematic cuts
      if (isAirborne.current) {
        simDirectorAngle.current = 'drone';
      } else if (Math.abs(steerAngle.current) > 0.4) {
        simDirectorAngle.current = steerAngle.current > 0 ? 'side-right' : 'side-left';
      } else if (Math.abs(speed.current) > 15) {
        simDirectorAngle.current = 'low-stunt';
      } else if (Math.abs(speed.current) < 1.0) {
        simDirectorAngle.current = 'orbit-360';
      } else if (simDirectorTimer.current > 5.5) {
        simDirectorTimer.current = 0;
        const choices = ['chase', 'cockpit', 'side-right', 'low-stunt', 'front', 'side-left'];
        const nextIdx = (choices.indexOf(simDirectorAngle.current) + 1) % choices.length;
        simDirectorAngle.current = choices[nextIdx];
      }
    }

    if (isDirector && simDirectorAngle.current === 'drone') {
      const dronePos = new THREE.Vector3(newX, currentY + trackingDist * 2, newZ + 2);
      camera.position.lerp(dronePos, 0.1);
      camera.lookAt(newX, currentY, newZ);
    } else if (isDirector && simDirectorAngle.current === 'side-left') {
      const desiredPos = new THREE.Vector3(newX - rightX * trackingDist, currentY + trackingH * 0.8, newZ - rightZ * trackingDist);
      camera.position.lerp(desiredPos, 0.12);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (isDirector && simDirectorAngle.current === 'side-right') {
      const desiredPos = new THREE.Vector3(newX + rightX * trackingDist, currentY + trackingH * 0.8, newZ + rightZ * trackingDist);
      camera.position.lerp(desiredPos, 0.12);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (isDirector && simDirectorAngle.current === 'low-stunt') {
      const stuntPos = new THREE.Vector3(newX - forwardX * (trackingDist * 0.6) + rightX * 2, currentY + 0.6, newZ - forwardZ * (trackingDist * 0.6) + rightZ * 2);
      camera.position.lerp(stuntPos, 0.15);
      camera.lookAt(newX + forwardX * 6, currentY + 0.8, newZ + forwardZ * 6);
    } else if (isDirector && simDirectorAngle.current === 'orbit-360') {
      simOrbitAngle.current += delta * orbitSpd;
      const ox = Math.sin(simOrbitAngle.current) * trackingDist;
      const oz = Math.cos(simOrbitAngle.current) * trackingDist;
      const orbitPos = new THREE.Vector3(newX + ox, currentY + trackingH, newZ + oz);
      camera.position.lerp(orbitPos, 0.1);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (isCockpit || (isDirector && simDirectorAngle.current === 'cockpit')) {
      const cockpitOffset = isAircraft
        ? new THREE.Vector3(forwardX * 1.6, currentY + 1.65, forwardZ * 1.6)
        : new THREE.Vector3(forwardX * 0.2, currentY + 1.25, forwardZ * 0.2);
      const targetPos = new THREE.Vector3(newX + cockpitOffset.x, cockpitOffset.y, newZ + cockpitOffset.z);
      camera.position.lerp(targetPos, 0.25);
      camera.lookAt(newX + forwardX * 25, currentY + 1.2, newZ + forwardZ * 25);
    } else if (trackingAngle === 'side-left') {
      const desiredPos = new THREE.Vector3(newX - rightX * trackingDist, currentY + trackingH * 0.8, newZ - rightZ * trackingDist);
      camera.position.lerp(desiredPos, 0.12);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (trackingAngle === 'side-right') {
      const desiredPos = new THREE.Vector3(newX + rightX * trackingDist, currentY + trackingH * 0.8, newZ + rightZ * trackingDist);
      camera.position.lerp(desiredPos, 0.12);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (isDrone) {
      const dronePos = new THREE.Vector3(newX, currentY + trackingDist * 2, newZ + 2);
      camera.position.lerp(dronePos, 0.1);
      camera.lookAt(newX, currentY, newZ);
    } else if (isFlow) {
      const stuntPos = new THREE.Vector3(newX - forwardX * (trackingDist * 0.6) + rightX * 2, currentY + 0.6, newZ - forwardZ * (trackingDist * 0.6) + rightZ * 2);
      camera.position.lerp(stuntPos, 0.15);
      camera.lookAt(newX + forwardX * 6, currentY + 0.8, newZ + forwardZ * 6);
    } else if (isOrbit) {
      simOrbitAngle.current += delta * orbitSpd;
      const ox = Math.sin(simOrbitAngle.current) * trackingDist;
      const oz = Math.cos(simOrbitAngle.current) * trackingDist;
      const orbitPos = new THREE.Vector3(newX + ox, currentY + trackingH, newZ + oz);
      camera.position.lerp(orbitPos, 0.1);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (isCinematic) {
      if (camera.position.distanceTo(new THREE.Vector3(newX, currentY, newZ)) > 35) {
        cinematicCamPos.current.set(newX + forwardX * 16 + 10, currentY + 4, newZ + forwardZ * 16 + 10);
      }
      camera.position.lerp(cinematicCamPos.current, 0.05);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else {
      // Default: Chase / Follow / Ikuti Camera
      const camDist = isAircraft ? 12 : trackingDist;
      const camHeight = isAircraft ? 5.5 : trackingH;
      const desiredCamPos = new THREE.Vector3(
        newX - forwardX * camDist,
        currentY + camHeight,
        newZ - forwardZ * camDist
      );
      camera.position.lerp(desiredCamPos, 0.12);
      camera.lookAt(newX, currentY + 1.2, newZ);
    }

    const kmh = Math.round(Math.abs(speed.current) * 3.6);
    setSimState(kmh, targetVehicle.name);
  });

  if (!isPlaying || !targetVehicle) return null;

  return (
    <>
      <VehicleDynamicLights
        vehicle={targetVehicle}
        speed={speed.current}
        isBraking={!!keys.current['Space']}
      />
      <VehicleParticleTrail
        vehicle={targetVehicle}
        speed={speed.current}
        isBraking={!!keys.current['Space']}
        steerAngle={steerAngle.current}
        isNitro={isNitroActive}
      />
    </>
  );
};

export const VehicleHUD: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const simSpeed = useEditorStore((s) => s.simSpeed);
  const simVehicleName = useEditorStore((s) => s.simVehicleName);
  const isObsMode = useVehicleAudioStore((s) => s.isObsMode);
  const nitro = useVehicleAudioStore((s) => s.nitro);
  const isNitroActive = useVehicleAudioStore((s) => s.isNitroActive);

  if (!isPlaying || isObsMode) return null;

  const handleStop = () => {
    soundEngine.stopEngine();
    setIsPlaying(false);
  };

  return (
    <div className="absolute bottom-6 left-6 z-30 pointer-events-none select-none flex flex-col gap-2 max-w-sm animate-fadeIn">
      {/* Supercar Digital Cockpit Dashboard */}
      <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col gap-2.5 min-w-[290px]">
        <div className="flex items-center gap-3.5">
          {/* Circular Digital Speedometer Dial */}
          <div className="relative flex flex-col items-center justify-center w-15 h-15 rounded-full border-3 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[inset_0_0_15px_rgba(6,182,212,0.25)]">
            <span className="text-2xl font-black font-mono text-cyan-400 tracking-tighter leading-none">
              {simSpeed}
            </span>
            <span className="text-[7.5px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">
              KM/H
            </span>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest">
                  SIMULASI AKTIF
                </span>
              </div>

              {/* Stop Button */}
              <button
                type="button"
                onClick={handleStop}
                className="pointer-events-auto px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/60 text-rose-300 hover:text-white text-[9.5px] font-black flex items-center gap-1 transition-all shadow active:scale-95 cursor-pointer"
                title="Hentikan Mode Mengemudi (Esc)"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>STOP (ESC)</span>
              </button>
            </div>

            <span className="text-xs font-black text-white truncate max-w-[160px] tracking-tight">
              {simVehicleName || 'Kendaraan 3D'}
            </span>
            <span className="text-[9.5px] text-cyan-300 font-mono">
              Kamera: <strong className="text-amber-400">[C]</strong> • Klakson: <strong className="text-amber-400">[H]</strong>
            </span>
          </div>
        </div>

        {/* Turbo Nitro Tank Progress Bar */}
        <div className="flex flex-col gap-1 w-full bg-slate-900/90 rounded-xl p-2 border border-cyan-500/20">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className="text-cyan-300 flex items-center gap-1 font-mono">
              <Zap className={`w-3 h-3 ${isNitroActive ? 'text-cyan-300 animate-ping' : 'text-cyan-400'} fill-current`} />
              TURBO NITRO [SHIFT]
            </span>
            <span className={`font-mono font-black ${isNitroActive ? 'text-amber-300 animate-pulse' : 'text-cyan-400'}`}>
              {Math.round(nitro)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                isNitroActive
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${nitro}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sleek Minimalist Controls Keycaps */}
      <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-1.5 text-[9.5px] text-slate-300 flex flex-wrap items-center gap-2 max-w-sm shadow-lg">
        <span><strong className="text-cyan-400 font-mono font-bold">WASD</strong> Kemudi</span>
        <span>•</span>
        <span><strong className="text-cyan-300 font-mono font-bold">SHIFT</strong> Turbo</span>
        <span>•</span>
        <span><strong className="text-cyan-400 font-mono font-bold">SPACE</strong> Rem</span>
        <span>•</span>
        <span><strong className="text-amber-400 font-mono font-bold">L/K</strong> Lampu</span>
        <span>•</span>
        <span><strong className="text-amber-400 font-mono font-bold">Z/X</strong> Sein</span>
        <span>•</span>
        <span><strong className="text-amber-400 font-mono font-bold">H</strong> Klakson</span>
        <span>•</span>
        <span><strong className="text-rose-400 font-mono font-bold">ESC</strong> Stop</span>
      </div>
    </div>
  );
};
