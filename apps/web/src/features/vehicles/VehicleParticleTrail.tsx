import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameObject } from '@audira/shared';

interface VehicleParticleTrailProps {
  vehicle: GameObject | null;
  speed: number;
  isBraking: boolean;
  steerAngle: number;
  isNitro?: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
}

const MAX_PARTICLES = 50;

export const VehicleParticleTrail: React.FC<VehicleParticleTrailProps> = ({
  vehicle,
  speed,
  isBraking,
  steerAngle,
  isNitro = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const nitroPointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const nitroParticles = useRef<Particle[]>([]);
  const spawnTimer = useRef(0);
  const nitroSpawnTimer = useRef(0);

  // Buffer geometries for dust
  const [positions] = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    return [pos];
  }, []);

  // Buffer geometries for nitro flames
  const [nitroPositions] = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    return [pos];
  }, []);

  useFrame((_, delta) => {
    const absSpeed = Math.abs(speed);
    const isDrifting = Math.abs(steerAngle) > 0.4 && absSpeed > 6;
    const shouldEmitDust = (absSpeed > 5 && isBraking) || isDrifting || (absSpeed > 14);

    // 1. Spawn dust puff behind tires
    if (vehicle && shouldEmitDust) {
      spawnTimer.current += delta;
      if (spawnTimer.current > 0.05 && particles.current.length < MAX_PARTICLES) {
        spawnTimer.current = 0;

        const heading = vehicle.rotation.y || 0;
        const forwardX = Math.sin(heading);
        const forwardZ = Math.cos(heading);
        const rightX = Math.cos(heading);
        const rightZ = -Math.sin(heading);

        const sideOffset = (Math.random() - 0.5) * 1.6;
        const rearDistance = 1.8;

        const posX = vehicle.position.x - forwardX * rearDistance + rightX * sideOffset;
        const posY = Math.max(0.1, vehicle.position.y + 0.15);
        const posZ = vehicle.position.z - forwardZ * rearDistance + rightZ * sideOffset;

        particles.current.push({
          x: posX,
          y: posY,
          z: posZ,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 0.8 + 0.3,
          vz: (Math.random() - 0.5) * 1.5,
          life: 0,
          maxLife: 0.65 + Math.random() * 0.35,
          size: 0.25 + Math.random() * 0.35,
        });
      }
    }

    // 2. Spawn Turbo Nitro Cyan Exhaust Flame
    if (vehicle && isNitro) {
      nitroSpawnTimer.current += delta;
      if (nitroSpawnTimer.current > 0.025 && nitroParticles.current.length < MAX_PARTICLES) {
        nitroSpawnTimer.current = 0;
        const heading = vehicle.rotation.y || 0;
        const forwardX = Math.sin(heading);
        const forwardZ = Math.cos(heading);
        const rightX = Math.cos(heading);
        const rightZ = -Math.sin(heading);

        const rearDistance = 2.1;
        const sideOffset = (Math.random() - 0.5) * 0.5;

        nitroParticles.current.push({
          x: vehicle.position.x - forwardX * rearDistance + rightX * sideOffset,
          y: Math.max(0.18, vehicle.position.y + 0.35),
          z: vehicle.position.z - forwardZ * rearDistance + rightZ * sideOffset,
          vx: -forwardX * (14 + Math.random() * 8),
          vy: (Math.random() - 0.3) * 1.2,
          vz: -forwardZ * (14 + Math.random() * 8),
          life: 0,
          maxLife: 0.2 + Math.random() * 0.15,
          size: 0.35 + Math.random() * 0.3,
        });
      }
    }

    // 3. Update Dust Particles
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life += delta;
        if (p.life >= p.maxLife) {
          particles.current.splice(i, 1);
          continue;
        }
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.z += p.vz * delta;
        p.vy *= 0.95;
      }

      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (i < particles.current.length) {
          const p = particles.current[i];
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;
        } else {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = -100;
          positions[i * 3 + 2] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 4. Update Nitro Particles
    if (nitroPointsRef.current) {
      const geom = nitroPointsRef.current.geometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;

      for (let i = nitroParticles.current.length - 1; i >= 0; i--) {
        const p = nitroParticles.current[i];
        p.life += delta;
        if (p.life >= p.maxLife) {
          nitroParticles.current.splice(i, 1);
          continue;
        }
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.z += p.vz * delta;
      }

      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (i < nitroParticles.current.length) {
          const p = nitroParticles.current[i];
          nitroPositions[i * 3] = p.x;
          nitroPositions[i * 3 + 1] = p.y;
          nitroPositions[i * 3 + 2] = p.z;
        } else {
          nitroPositions[i * 3] = 0;
          nitroPositions[i * 3 + 1] = -100;
          nitroPositions[i * 3 + 2] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Tire Dust Cloud Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          color="#d6d3d1"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </points>

      {/* Turbo Nitro Cyan Flame Points */}
      <points ref={nitroPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nitroPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.85}
          color="#00f0ff"
          transparent
          opacity={0.88}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
