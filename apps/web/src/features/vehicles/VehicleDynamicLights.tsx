import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVehicleAudioStore } from '../../stores/useVehicleAudioStore';
import { GameObject } from '@audira/shared';

interface VehicleDynamicLightsProps {
  vehicle: GameObject | null;
  speed: number;
  isBraking: boolean;
}

export const VehicleDynamicLights: React.FC<VehicleDynamicLightsProps> = ({
  vehicle,
  speed,
  isBraking,
}) => {
  const headlights = useVehicleAudioStore((s) => s.headlights);
  const highBeam = useVehicleAudioStore((s) => s.highBeam);
  const blinkerLeft = useVehicleAudioStore((s) => s.blinkerLeft);
  const blinkerRight = useVehicleAudioStore((s) => s.blinkerRight);

  // Group container that follows vehicle transform
  const lightsGroupRef = useRef<THREE.Group>(null);
  const leftHeadTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const rightHeadTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  // Blinker pulse timer
  const blinkerPulse = useRef(false);
  const pulseTimer = useRef(0);

  // Approximate vehicle dimensions for positioning lights
  const dims = useMemo(() => {
    if (!vehicle) return { length: 4.5, width: 2.0, height: 1.5 };
    const cat = vehicle.category?.toLowerCase() || '';
    if (cat === 'tractor' || vehicle.name.toLowerCase().includes('scania') || vehicle.name.toLowerCase().includes('truck')) {
      return { length: 6.5, width: 2.5, height: 2.2, headY: 0.9 };
    }
    if (cat === 'pesawat' || vehicle.name.toLowerCase().includes('plane')) {
      return { length: 8.0, width: 3.0, height: 1.8, headY: 0.7 };
    }
    return { length: 4.2, width: 1.9, height: 1.2, headY: 0.5 };
  }, [vehicle]);

  useFrame((_, delta) => {
    if (!lightsGroupRef.current || !vehicle) return;

    // Follow vehicle position and orientation
    lightsGroupRef.current.position.set(
      vehicle.position.x,
      vehicle.position.y,
      vehicle.position.z
    );
    lightsGroupRef.current.rotation.set(
      vehicle.rotation.x || 0,
      vehicle.rotation.y || 0,
      vehicle.rotation.z || 0
    );

    // Blinker flash calculation (~2.8 Hz)
    pulseTimer.current += delta;
    if (pulseTimer.current >= 0.35) {
      blinkerPulse.current = !blinkerPulse.current;
      pulseTimer.current = 0;
    }
  });

  if (!vehicle) return null;

  const isReversing = speed < -0.2;
  const isDecelerating = isBraking || (speed > 1 && isBraking);

  // Half dimensions
  const halfLen = dims.length * 0.5;
  const halfWidth = dims.width * 0.42;
  const lightY = dims.headY || 0.6;

  // Headlight reach & intensity
  const lightIntensity = highBeam ? 5.5 : headlights ? 3.2 : 0;
  const lightDistance = highBeam ? 60 : 35;
  const lightAngle = highBeam ? Math.PI / 4.5 : Math.PI / 5.5;

  return (
    <group ref={lightsGroupRef}>
      {/* Invisible target objects placed far ahead of vehicle to aim spotlights */}
      <primitive
        object={leftHeadTargetRef.current}
        position={[-halfWidth, lightY - 0.2, halfLen + (highBeam ? 45 : 25)]}
      />
      <primitive
        object={rightHeadTargetRef.current}
        position={[halfWidth, lightY - 0.2, halfLen + (highBeam ? 45 : 25)]}
      />

      {/* 1. FRONT HEADLIGHTS (Dual SpotLights) */}
      {(headlights || highBeam) && (
        <>
          {/* Left Headlight */}
          <spotLight
            position={[-halfWidth, lightY, halfLen]}
            target={leftHeadTargetRef.current}
            intensity={lightIntensity}
            distance={lightDistance}
            angle={lightAngle}
            penumbra={0.65}
            color={highBeam ? '#e0f2fe' : '#fef08a'}
            castShadow={false}
          />
          {/* Right Headlight */}
          <spotLight
            position={[halfWidth, lightY, halfLen]}
            target={rightHeadTargetRef.current}
            intensity={lightIntensity}
            distance={lightDistance}
            angle={lightAngle}
            penumbra={0.65}
            color={highBeam ? '#e0f2fe' : '#fef08a'}
            castShadow={false}
          />

          {/* Front Light Glow Mesh Orbs */}
          <mesh position={[-halfWidth, lightY, halfLen + 0.05]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color={highBeam ? '#38bdf8' : '#fde047'} />
          </mesh>
          <mesh position={[halfWidth, lightY, halfLen + 0.05]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshBasicMaterial color={highBeam ? '#38bdf8' : '#fde047'} />
          </mesh>
        </>
      )}

      {/* 2. REAR TAILLIGHTS & BRAKE LIGHTS */}
      {/* Idle running red taillights (when headlights on) or strong red brake light */}
      {(headlights || isDecelerating) && (
        <>
          {/* Left Taillight */}
          <pointLight
            position={[-halfWidth, lightY, -halfLen]}
            intensity={isDecelerating ? 3.0 : 0.8}
            distance={isDecelerating ? 12 : 5}
            color="#ef4444"
          />
          {/* Right Taillight */}
          <pointLight
            position={[halfWidth, lightY, -halfLen]}
            intensity={isDecelerating ? 3.0 : 0.8}
            distance={isDecelerating ? 12 : 5}
            color="#ef4444"
          />

          {/* Red glowing orbs */}
          <mesh position={[-halfWidth, lightY, -halfLen - 0.05]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={isDecelerating ? '#ff0000' : '#dc2626'} />
          </mesh>
          <mesh position={[halfWidth, lightY, -halfLen - 0.05]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={isDecelerating ? '#ff0000' : '#dc2626'} />
          </mesh>
        </>
      )}

      {/* 3. REVERSE WHITE LIGHT */}
      {isReversing && (
        <>
          <pointLight
            position={[0, lightY, -halfLen]}
            intensity={2.0}
            distance={8}
            color="#f8fafc"
          />
          <mesh position={[0, lightY, -halfLen - 0.05]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* 4. TURN SIGNALS / BLINKERS (Amber Pulsing) */}
      {blinkerLeft && blinkerPulse.current && (
        <>
          {/* Front Left Blinker */}
          <pointLight
            position={[-halfWidth - 0.1, lightY, halfLen]}
            intensity={2.5}
            distance={6}
            color="#f59e0b"
          />
          <mesh position={[-halfWidth - 0.1, lightY, halfLen]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {/* Rear Left Blinker */}
          <pointLight
            position={[-halfWidth - 0.1, lightY, -halfLen]}
            intensity={2.5}
            distance={6}
            color="#f59e0b"
          />
          <mesh position={[-halfWidth - 0.1, lightY, -halfLen]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </>
      )}

      {blinkerRight && blinkerPulse.current && (
        <>
          {/* Front Right Blinker */}
          <pointLight
            position={[halfWidth + 0.1, lightY, halfLen]}
            intensity={2.5}
            distance={6}
            color="#f59e0b"
          />
          <mesh position={[halfWidth + 0.1, lightY, halfLen]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {/* Rear Right Blinker */}
          <pointLight
            position={[halfWidth + 0.1, lightY, -halfLen]}
            intensity={2.5}
            distance={6}
            color="#f59e0b"
          />
          <mesh position={[halfWidth + 0.1, lightY, -halfLen]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </>
      )}
    </group>
  );
};
