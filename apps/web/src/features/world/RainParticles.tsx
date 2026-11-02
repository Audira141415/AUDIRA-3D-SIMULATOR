import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../audio/soundEngine';

const RAIN_COUNT = 2000;
const RAIN_BOUNDS = 90; // Spread around camera

export const RainParticles: React.FC = () => {
  const { camera } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const lightningLightRef = useRef<THREE.DirectionalLight>(null);

  // Lightning timing states
  const nextLightningTime = useRef(4 + Math.random() * 8);
  const isFlashing = useRef(false);
  const flashDuration = useRef(0);

  // Initialize Rain audio
  useEffect(() => {
    soundEngine.playRainAmbience();
    return () => {
      soundEngine.stopRainAmbience();
    };
  }, []);

  // Rain particle positions buffer
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3);
    const vel = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RAIN_BOUNDS * 2;
      pos[i * 3 + 1] = Math.random() * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * RAIN_BOUNDS * 2;
      vel[i] = 38 + Math.random() * 18; // Fall speed
    }

    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    const camX = camera.position.x;
    const camZ = camera.position.z;

    // Wind drift vector
    const windX = delta * 6.5;
    const windZ = delta * 3.5;

    for (let i = 0; i < RAIN_COUNT; i++) {
      const idx = i * 3;
      // Fall down
      posArray[idx + 1] -= velocities[i] * delta;
      posArray[idx] += windX;
      posArray[idx + 2] += windZ;

      // Wrap around camera bounding cylinder
      const dx = posArray[idx] - camX;
      const dz = posArray[idx + 2] - camZ;

      if (posArray[idx + 1] <= 0 || Math.hypot(dx, dz) > RAIN_BOUNDS) {
        posArray[idx] = camX + (Math.random() - 0.5) * RAIN_BOUNDS * 1.8;
        posArray[idx + 1] = 45 + Math.random() * 15;
        posArray[idx + 2] = camZ + (Math.random() - 0.5) * RAIN_BOUNDS * 1.8;
      }
    }

    posAttr.needsUpdate = true;

    // Lightning Flash Logic
    nextLightningTime.current -= delta;
    if (nextLightningTime.current <= 0 && !isFlashing.current) {
      isFlashing.current = true;
      flashDuration.current = 0.18;
      soundEngine.playThunder();
      nextLightningTime.current = 12 + Math.random() * 16;
    }

    if (isFlashing.current && lightningLightRef.current) {
      flashDuration.current -= delta;
      if (flashDuration.current > 0) {
        lightningLightRef.current.intensity = 4.5 + Math.random() * 3.5;
      } else {
        lightningLightRef.current.intensity = 0;
        isFlashing.current = false;
      }
    }
  });

  return (
    <>
      {/* Lightning Flash Directional Light */}
      <directionalLight
        ref={lightningLightRef}
        position={[20, 60, 20]}
        intensity={0}
        color="#c7d2fe"
      />

      {/* Rain Streaks Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.42}
          color="#93c5fd"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
