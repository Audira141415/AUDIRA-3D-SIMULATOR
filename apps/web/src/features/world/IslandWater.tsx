import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../../stores/useWorldStore';

export const IslandWater: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const worldSize = useWorldStore((s) => s.worldSize) || 300;

  // Plane geometry parameters: large ocean surrounding the island
  const waterRadius = 1400;
  const segments = 80;

  // Initial vertex heights backup to apply procedural waves
  const { geometry, initialZ } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(waterRadius, waterRadius, segments, segments);
    geom.rotateX(-Math.PI / 2); // Lay flat on X-Z plane

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const initial = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      initial[i] = pos.getY(i);
    }
    return { geometry: geom, initialZ: initial };
  }, [waterRadius, segments]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;

    // Displace vertices with smooth oceanic sine/cosine waves
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Multi-octave wave equation
      const wave1 = Math.sin(x * 0.02 + time * 1.4) * Math.cos(z * 0.02 + time * 1.1) * 0.28;
      const wave2 = Math.sin(x * 0.05 - time * 0.8 + z * 0.03) * 0.14;
      const wave3 = Math.cos((x + z) * 0.015 + time * 0.5) * 0.1;

      pos.setY(i, initialZ[i] + wave1 + wave2 + wave3);
    }

    pos.needsUpdate = true;
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Main Animated Ocean Mesh */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#0284c7" // Deep ocean cyan-blue
          roughness={0.12}
          metalness={0.65}
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Coastal Shoreline Foam Ring (Surrounding the island terrain) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry
          args={[
            (worldSize * 0.5) - 4,
            (worldSize * 0.5) + 12,
            64,
          ]}
        />
        <meshBasicMaterial
          color="#e0f2fe"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
