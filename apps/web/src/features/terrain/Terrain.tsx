import React, { Suspense, useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture, Grid } from '@react-three/drei';
import { snapToGrid } from '@audira/game-core';
import { GameObject } from '@audira/shared';
import { useEditorStore } from '../../stores/useEditorStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { soundEngine } from '../../features/audio/soundEngine';
import { useVehicleRunStore } from '../../stores/useVehicleRunStore';
import { useTerrainSculptStore } from '../../stores/useTerrainSculptStore';

// PBR Grass Material with FS22 textures & natural green meadow tint
const PBRGrassMaterial: React.FC = () => {
  const [grassColor, grassNormal, grassRough] = useTexture([
    '/textures/fs22-meadow-grass.jpg',
    '/textures/grass_ground_normal.jpg',
    '/textures/grass_ground_rough.jpg',
  ]);

  useMemo(() => {
    if (grassColor) {
      grassColor.colorSpace = THREE.SRGBColorSpace;
    }
    [grassColor, grassNormal, grassRough].forEach((tex) => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(250, 250);
        tex.anisotropy = 16;
      }
    });
  }, [grassColor, grassNormal, grassRough]);

  return (
    <meshStandardMaterial
      map={grassColor}
      color="#7cb342" // Natural lush meadow grass green
      normalMap={grassNormal}
      roughnessMap={grassRough}
      roughness={0.85}
      metalness={0.02}
    />
  );
};

export const Terrain: React.FC = () => {
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const gridSize = useEditorStore((s) => s.gridSize);
  const placingAsset = useEditorStore((s) => s.placingAsset);
  const setPlacingAsset = useEditorStore((s) => s.setPlacingAsset);
  const addObject = useWorldStore((s) => s.addObject);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);
  const worldSize = useWorldStore((s) => s.worldSize) || 300;
  const isSculptActive = useTerrainSculptStore((s) => s.isSculptActive);
  const heightMap = useTerrainSculptStore((s) => s.heightMap);
  const getTerrainHeight = useTerrainSculptStore((s) => s.getTerrainHeight);
  const setCursorPosition = useTerrainSculptStore((s) => s.setCursorPosition);

  const pointerDownCoord = useRef<{ x: number; y: number } | null>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  // Update vertex heights dynamically whenever heightMap mutates
  useEffect(() => {
    if (!geomRef.current) return;
    const pos = geomRef.current.attributes.position;
    if (!pos) return;

    for (let i = 0; i < pos.count; i++) {
      const lx = pos.getX(i);
      const ly = pos.getY(i);
      // Plane is rotated -PI/2 around X: local X is world X, local Y is world -Z, local Z is world Y (height)
      const wx = lx;
      const wz = -ly;
      const h = getTerrainHeight(wx, wz);
      pos.setZ(i, h);
    }
    pos.needsUpdate = true;
    geomRef.current.computeVertexNormals();
  }, [heightMap, getTerrainHeight]);

  const handlePointerDown = (e: any) => {
    pointerDownCoord.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: any) => {
    // 1. If an object was clicked or selected in the last 400ms, DO NOT deselect!
    const lastSelectedAt = useSelectionStore.getState().lastSelectedAt;
    if (Date.now() - lastSelectedAt < 400) {
      return;
    }

    // 2. If ray intersected an object in front of the terrain plane, DO NOT deselect!
    if (e.intersections && e.intersections.length > 0 && e.intersections[0].object !== e.object) {
      return;
    }

    // 3. Check if user was dragging to orbit/pan camera
    if (pointerDownCoord.current) {
      const dx = e.clientX - pointerDownCoord.current.x;
      const dy = e.clientY - pointerDownCoord.current.y;
      const dist = Math.hypot(dx, dy);
      pointerDownCoord.current = null;
      // If mouse moved more than 5 pixels, it's a camera drag, DO NOT deselect!
      if (dist > 5) return;
    }

    e.stopPropagation();

    // If we have an active asset selected for placement
    // 00. If Terrain Sculpting mode is active
    if (isSculptActive) {
      return;
    }

    // 0. If Waypoint Path Drawing mode is active in RUN mode
    const { pathEdit, pathOwner, addPathPoint } = useVehicleRunStore.getState();
    if (pathEdit && pathOwner) {
      const clickPoint = e.point;
      addPathPoint({ x: clickPoint.x, y: 0.12, z: clickPoint.z });
      soundEngine.playUIClick();
      return;
    }

    if (placingAsset) {
      const clickPoint = e.point;
      const rawPos = { x: clickPoint.x, y: 0, z: clickPoint.z };
      const snappedPos = gridSnap ? snapToGrid(rawPos, gridSize) : rawPos;
      // Standard metric scale (1.0 = real-world proportional target size)
      const initialScale = placingAsset.defaultScale || { x: 1, y: 1, z: 1 };

      const newObj: GameObject = {
        id: `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: placingAsset.name,
        type: placingAsset.type,
        category: placingAsset.category,
        assetId: placingAsset.id,
        position: snappedPos,
        rotation: { x: 0, y: 0, z: 0 },
        scale: initialScale,
        visible: true,
        locked: false,
        castShadow: true,
        receiveShadow: true,
        color: placingAsset.color,
        modelUrl: placingAsset.modelUrl,
        thumbnailUrl: placingAsset.thumbnailUrl,
        targetSize: placingAsset.targetSize,
      };

      addObject(newObj);
      selectObject(newObj.id);

      // Auto smoothly focus camera on newly placed object
      setFocusTarget(snappedPos);

      // Continuous placement if Shift key is pressed
      if (!e.shiftKey) {
        setPlacingAsset(null);
      }
    } else {
      // Genuine stationary click on empty terrain deselects current object
      selectObject(null);
    }
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    soundEngine.playUIClick();
    setFocusTarget({ x: e.point.x, y: 0, z: e.point.z });
  };

  return (
    <group>
      {/* 1. Pure Meadow Green Grass Ground (2,000 x 2,000 meters) at y = 0 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => {
          if (isSculptActive) {
            setCursorPosition({ x: e.point.x, y: e.point.y, z: e.point.z });
          }
        }}
        onPointerLeave={() => {
          if (isSculptActive) {
            setCursorPosition(null);
          }
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <planeGeometry ref={geomRef} args={[worldSize, worldSize, 120, 120]} />
        <Suspense fallback={<meshStandardMaterial color="#689f38" roughness={0.85} />}>
          <PBRGrassMaterial />
        </Suspense>
      </mesh>

      {/* 2. Adaptive Anti-Aliased Grid (Fades distant lines smoothly so landscape stays 100% clean without moire / blinking) */}
      {showGrid && (
        <Grid
          position={[0, 0.035, 0]}
          args={[worldSize, worldSize]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#ffffff"
          sectionSize={10}
          sectionThickness={1.0}
          sectionColor="#22d3ee"
          fadeDistance={90}
          fadeStrength={2.0}
          fadeFrom={0}
          renderOrder={1}
        />
      )}
    </group>
  );
};
