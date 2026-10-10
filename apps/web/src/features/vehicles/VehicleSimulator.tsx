import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Square } from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { soundEngine } from '../audio/soundEngine';

export type CameraMode = 'follow' | 'cockpit' | 'cinematic' | 'drone';

export const VehicleController: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const setSimState = useEditorStore((s) => s.setSimState);
  const objects = useWorldStore((s) => s.objects);
  const updateObject = useWorldStore((s) => s.updateObject);
  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);

  const { camera } = useThree();

  // Driving & Flight physics states
  const keys = useRef<{ [key: string]: boolean }>({});
  const speed = useRef(0);
  const steerAngle = useRef(0);
  const verticalVelocity = useRef(0);
  const altitude = useRef(0);
  const pitchAngle = useRef(0);
  const rollAngle = useRef(0);
  const isAirborne = useRef(false);

  // Camera mode state (Follow, Cockpit, Cinematic, Drone)
  const [cameraMode, setCameraMode] = useState<CameraMode>('follow');
  const cinematicCamPos = useRef(new THREE.Vector3(20, 8, 20));

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

      // Honk Horn
      if (e.code === 'KeyH') {
        soundEngine.playHorn();
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

    // Max speeds
    const maxSpeed = isAircraft ? 36 : 24; // 130 km/h for aircraft, 86 km/h for cars
    const accel = isAircraft ? 16 : 14;
    const brakeForce = 22;
    const friction = 5;
    const turnRate = isAircraft ? 1.8 : 2.5;

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

    // Boundaries clamping (100x100m terrain: bounds -48 to 48)
    newX = Math.max(-48, Math.min(48, newX));
    newZ = Math.max(-48, Math.min(48, newZ));

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

    // Update object transform in World Store
    updateObject(
      targetVehicle.id,
      {
        position: {
          x: Number(newX.toFixed(2)),
          y: Number((targetVehicle.position.y ? 0 : 0) + altitude.current.toFixed(2)),
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

    // Update engine sound
    const speedRatio = Math.abs(speed.current) / maxSpeed;
    soundEngine.updateEngine(speedRatio, isAccelerating);

    // ==========================================
    // 3. MULTI-ANGLE CAMERA MODES
    // ==========================================
    const currentY = altitude.current;

    if (cameraMode === 'cockpit') {
      // Cockpit View: Inside the driver seat / cockpit
      const cockpitOffset = isAircraft
        ? new THREE.Vector3(forwardX * 1.6, currentY + 1.65, forwardZ * 1.6)
        : new THREE.Vector3(forwardX * 0.2, currentY + 1.25, forwardZ * 0.2);

      const targetPos = new THREE.Vector3(newX + cockpitOffset.x, cockpitOffset.y, newZ + cockpitOffset.z);
      camera.position.lerp(targetPos, 0.25);
      camera.lookAt(newX + forwardX * 25, currentY + 1.2, newZ + forwardZ * 25);
    } else if (cameraMode === 'cinematic') {
      // Cinematic Roadside Tracking Camera
      if (camera.position.distanceTo(new THREE.Vector3(newX, currentY, newZ)) > 35) {
        cinematicCamPos.current.set(newX + forwardX * 16 + 10, currentY + 4, newZ + forwardZ * 16 + 10);
      }
      camera.position.lerp(cinematicCamPos.current, 0.05);
      camera.lookAt(newX, currentY + 1.2, newZ);
    } else if (cameraMode === 'drone') {
      // Drone / Top-Down View
      const dronePos = new THREE.Vector3(newX, currentY + 28, newZ + 2);
      camera.position.lerp(dronePos, 0.1);
      camera.lookAt(newX, currentY, newZ);
    } else {
      // Default: Smooth Chase / Follow Camera
      const camDist = isAircraft ? 12 : 9;
      const camHeight = isAircraft ? 5.5 : 4.0;
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

  return null;
};

export const VehicleHUD: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const simSpeed = useEditorStore((s) => s.simSpeed);
  const simVehicleName = useEditorStore((s) => s.simVehicleName);

  if (!isPlaying) return null;

  const handleStop = () => {
    soundEngine.stopEngine();
    setIsPlaying(false);
  };

  return (
    <div className="absolute top-16 left-6 z-30 pointer-events-none select-none flex flex-col gap-2">
      {/* Speedometer & Instrument Status */}
      <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-4 min-w-[280px]">
        <div className="relative flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 border-cyan-500/40 bg-slate-900/80 shadow-inner">
          <span className="text-xl font-black font-mono text-cyan-400 tracking-tighter">
            {simSpeed}
          </span>
          <span className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">
            KM/H
          </span>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                SIMULASI AKTIF
              </span>
            </div>

            {/* In-HUD Guaranteed Stop Button */}
            <button
              type="button"
              onClick={handleStop}
              className="pointer-events-auto px-2 py-0.5 rounded-md bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/60 text-rose-300 hover:text-white text-[10px] font-black flex items-center gap-1 transition-all shadow active:scale-95 cursor-pointer"
              title="Hentikan Mode Mengemudi (Esc)"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>STOP (ESC)</span>
            </button>
          </div>

          <span className="text-xs font-extrabold text-white truncate max-w-[150px]">
            {simVehicleName || 'Kendaraan 3D'}
          </span>
          <span className="text-[10px] text-cyan-300 font-mono">
            Kamera: <strong className="text-amber-400">[C]</strong> • Klakson: <strong className="text-amber-400">[H]</strong>
          </span>
        </div>
      </div>

      {/* Controls Hint Overlay */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-[11px] text-slate-300 flex items-center gap-3">
        <span><strong className="text-cyan-400 font-mono">WASD</strong> Kemudi</span>
        <span>•</span>
        <span><strong className="text-cyan-400 font-mono">SPACE</strong> Rem</span>
        <span>•</span>
        <span><strong className="text-cyan-400 font-mono">C</strong> Kamera</span>
        <span>•</span>
        <span><strong className="text-cyan-400 font-mono">H</strong> Klakson</span>
        <span>•</span>
        <span><strong className="text-rose-400 font-mono">ESC</strong> Stop</span>
      </div>
    </div>
  );
};
