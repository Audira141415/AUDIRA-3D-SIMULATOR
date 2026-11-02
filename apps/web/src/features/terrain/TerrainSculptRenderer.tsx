import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTerrainSculptStore, SculptTool } from '../../stores/useTerrainSculptStore';

export const TerrainSculptRenderer: React.FC = () => {
  const isSculptActive = useTerrainSculptStore((s) => s.isSculptActive);
  const tool = useTerrainSculptStore((s) => s.tool);
  const radius = useTerrainSculptStore((s) => s.radius);
  const cursorPosition = useTerrainSculptStore((s) => s.cursorPosition);
  const applySculptAtPoint = useTerrainSculptStore((s) => s.applySculptAtPoint);

  const ringMeshRef = useRef<THREE.Mesh>(null);
  const isMouseDownRef = useRef(false);

  // Listen for pointer down / up on window to support continuous drag sculpting
  React.useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (e.button === 0) isMouseDownRef.current = true;
    };
    const handleUp = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  // Continuous sculpting frame loop
  useFrame((_, delta) => {
    if (!isSculptActive || !tool || !isMouseDownRef.current || !cursorPosition) return;
    applySculptAtPoint(cursorPosition.x, cursorPosition.z, Math.min(0.1, delta));
  });

  const toolColor = useMemo(() => {
    switch (tool) {
      case 'raise':
        return '#00ffcc'; // Cyan
      case 'lower':
        return '#f43f5e'; // Rose Red
      case 'flatten':
        return '#eab308'; // Amber Yellow
      case 'slope':
        return '#8b5cf6'; // Purple
      case 'smooth':
        return '#3b82f6'; // Blue
      default:
        return '#00d2ff';
    }
  }, [tool]);

  if (!isSculptActive || !cursorPosition || !tool) return null;

  return (
    <group position={[cursorPosition.x, cursorPosition.y + 0.05, cursorPosition.z]}>
      {/* Outer Brush Ring */}
      <mesh ref={ringMeshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(0.2, radius - 0.2), radius, 48]} />
        <meshBasicMaterial color={toolColor} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      {/* Inner Center Dot */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={toolColor} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

