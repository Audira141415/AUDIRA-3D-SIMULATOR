import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { TransformControls, Html } from '@react-three/drei';
import { GameObject } from '@audira/shared';
import {
  Move,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Trash2,
  ArrowDownToLine,
  CopyPlus,
  Play,
} from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { soundEngine } from '../../features/audio/soundEngine';
import { ModelRenderer } from './ModelRenderer';

interface WorldObjectProps {
  object: GameObject;
}

export const WorldObject: React.FC<WorldObjectProps> = ({ object }) => {
  const groupRef = useRef<THREE.Group>(null);
  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const transformMode = useEditorStore((s) => s.transformMode);
  const setTransformMode = useEditorStore((s) => s.setTransformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const gridSize = useEditorStore((s) => s.gridSize);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);

  const updateObject = useWorldStore((s) => s.updateObject);
  const deleteObject = useWorldStore((s) => s.deleteObject);
  const duplicateObject = useWorldStore((s) => s.duplicateObject);
  const dropToGround = useWorldStore((s) => s.dropToGround);

  const isSelected = selectedObjectId === object.id;

  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  const [isHovered, setIsHovered] = useState(false);
  const [meshHeight, setMeshHeight] = useState<number | null>(null);

  // Measure actual model bounding box whenever model or scale changes
  useEffect(() => {
    if (!groupRef.current) return;
    const timer = setTimeout(() => {
      if (groupRef.current) {
        const box = new THREE.Box3().setFromObject(groupRef.current);
        if (isFinite(box.max.y) && isFinite(box.min.y)) {
          const h = box.max.y - object.position.y;
          if (h > 0.1) {
            setMeshHeight(h);
          }
        }
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [object.type, object.modelUrl, object.scale?.y, object.position.y]);

  // Baseline height estimation if box is not yet computed
  const estimatedHeight = useMemo(() => {
    const typeStr = (object.type || '').toLowerCase();
    let baseH = 1.8;
    if (typeStr.includes('knight') || typeStr.includes('armor') || typeStr.includes('character')) {
      baseH = 1.8;
    } else if (typeStr.includes('truck') || typeStr.includes('crane') || typeStr.includes('excavator')) {
      baseH = 2.2;
    } else if (typeStr.includes('tree') || typeStr.includes('tower')) {
      baseH = 3.5;
    } else if (typeStr.includes('building') || typeStr.includes('house') || typeStr.includes('warehouse')) {
      baseH = 3.0;
    } else if (typeStr.includes('car') || typeStr.includes('sport')) {
      baseH = 1.4;
    }
    return baseH * (object.scale?.y || 1);
  }, [object.type, object.scale?.y]);

  // Exact world coordinate Y for the floating quick-action pill:
  // Placed tightly 35 cm directly above the top of the model
  const floatingY = object.position.y + (meshHeight !== null ? meshHeight : estimatedHeight) + 0.35;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    soundEngine.playUIClick();
    selectObject(object.id);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'default';
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    soundEngine.playUIClick();
    selectObject(object.id);
    setFocusTarget(object.position);
  };

  const handleScaleDelta = (multiplier: number) => {
    soundEngine.playUIClick();
    const currentScale = object.scale || { x: 1, y: 1, z: 1 };
    const newX = Math.max(0.1, Number((currentScale.x * multiplier).toFixed(2)));
    const newY = Math.max(0.1, Number((currentScale.y * multiplier).toFixed(2)));
    const newZ = Math.max(0.1, Number((currentScale.z * multiplier).toFixed(2)));

    updateObject(
      object.id,
      {
        scale: { x: newX, y: newY, z: newZ },
      },
      true
    );
  };

  const handleResetScale = () => {
    soundEngine.playUIClick();
    updateObject(
      object.id,
      {
        scale: { x: 1, y: 1, z: 1 },
      },
      true
    );
  };

  const isDrivable =
    object.category === 'kendaraan' ||
    object.category === 'tractor' ||
    object.category === 'pesawat';

  // Convert degrees to radians for rendering
  const rotRad: [number, number, number] = [
    (object.rotation.x * Math.PI) / 180,
    (object.rotation.y * Math.PI) / 180,
    (object.rotation.z * Math.PI) / 180,
  ];

  return (
    <>
      <group
        ref={groupRef}
        position={[object.position.x, object.position.y, object.position.z]}
        rotation={rotRad}
        scale={[object.scale.x, object.scale.y, object.scale.z]}
        onClick={handlePointerDown}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={object.visible}
      >
        <ModelRenderer
          type={object.type}
          color={object.color}
          modelUrl={object.modelUrl}
          category={object.category}
          targetSize={object.targetSize}
        />

        {/* Generous Click Hitbox: guarantees easy selection even for thin or wireframe meshes */}
        <mesh
          position={[0, 1.2, 0]}
          onClick={handlePointerDown}
          onPointerDown={handlePointerDown}
          onDoubleClick={handleDoubleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <cylinderGeometry args={[1.4, 1.4, 2.6, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Subtle Hover Ring when mouse touches object */}
        {isHovered && !isSelected && (
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.45, 36]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
        )}

        {/* Selected Glowing Base Ring (rendered in local object coordinates) */}
        {isSelected && !isPlaying && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.5, 36]} />
            <meshBasicMaterial color="#00d2ff" side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
        )}
      </group>

      {/* Floating Interactive Quick-Action Pill (Positioned in WORLD SPACE directly above object head) */}
      {isSelected && !object.locked && !isPlaying && (
        <Html
          position={[object.position.x, floatingY, object.position.z]}
          center
        >
          <div
            className="flex items-center gap-1.5 p-1.5 bg-[#080d18]/90 backdrop-blur-md border border-cyan-400/60 rounded-xl shadow-[0_4px_24px_rgba(0,210,255,0.4)] select-none pointer-events-auto animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Transform Gizmo Modes: Move / Rotate / Scale */}
            <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => {
                  soundEngine.playUIClick();
                  setTransformMode('translate');
                }}
                className={`p-1.5 rounded-md transition-all ${
                  transformMode === 'translate'
                    ? 'bg-cyan-500/35 text-cyan-200 border border-cyan-400/80 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mode Geser Posisi (W)"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundEngine.playUIClick();
                  setTransformMode('rotate');
                }}
                className={`p-1.5 rounded-md transition-all ${
                  transformMode === 'rotate'
                    ? 'bg-cyan-500/35 text-cyan-200 border border-cyan-400/80 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mode Putar Orientasi (E)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundEngine.playUIClick();
                  setTransformMode('scale');
                }}
                className={`p-1.5 rounded-md transition-all ${
                  transformMode === 'scale'
                    ? 'bg-cyan-500/35 text-cyan-200 border border-cyan-400/80 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mode Tarik Skala Gizmo (R)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-5 bg-white/15" />

            {/* Quick Scale Pill: - / Scale / + */}
            <div className="flex items-center gap-1 bg-black/40 px-1 py-0.5 rounded-lg border border-white/10 font-mono text-xs">
              <button
                onClick={() => handleScaleDelta(0.8)}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                title="Perkecil Objek (-20%)"
              >
                <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <span
                onClick={handleResetScale}
                className="px-1 text-[11px] font-bold text-cyan-300 cursor-pointer hover:underline"
                title="Klik untuk reset skala ke 1.0x"
              >
                {object.scale.x.toFixed(1)}x
              </span>
              <button
                onClick={() => handleScaleDelta(1.25)}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                title="Perbesar Objek (+25%)"
              >
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            <div className="w-[1px] h-5 bg-white/15" />

            {/* Quick Actions: Ke Lantai, Duplikat, Hapus */}
            <button
              onClick={() => {
                soundEngine.playUIClick();
                dropToGround(object.id);
              }}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/25 transition-all border border-emerald-400/20 active:scale-90"
              title="Ratakan ke Lantai Dasar (Y = 0)"
            >
              <ArrowDownToLine className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEngine.playUIClick();
                const copy = duplicateObject(object.id);
                if (copy) selectObject(copy.id);
              }}
              className="p-1.5 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-500/25 transition-all active:scale-90"
              title="Duplikat Objek (Ctrl+D)"
            >
              <CopyPlus className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEngine.playUIClick();
                deleteObject(object.id);
                clearSelection();
              }}
              className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/25 transition-all active:scale-90"
              title="Hapus Objek (Delete / Backspace)"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Drive Button (Vehicles) */}
            {isDrivable && (
              <>
                <div className="w-[1px] h-5 bg-white/15" />
                <button
                  onClick={() => {
                    soundEngine.playUIClick();
                    setIsPlaying(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400/70 transition-all flex items-center gap-1 text-xs font-bold shadow-sm active:scale-95"
                  title="Mulai Kendarai Kendaraan Ini"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>GAS!</span>
                </button>
              </>
            )}
          </div>
        </Html>
      )}

      {/* TransformControls: active when in translate, rotate, or scale mode */}
      {isSelected && !object.locked && !isPlaying && groupRef.current && transformMode !== 'select' && (
        <TransformControls
          object={groupRef as any}
          mode={transformMode}
          size={1.3}
          translationSnap={gridSnap ? gridSize : undefined}
          rotationSnap={gridSnap ? Math.PI / 12 : undefined} // 15 degrees snap
          scaleSnap={gridSnap ? 0.2 : undefined}
          onMouseUp={() => {
            if (groupRef.current) {
              const pos = groupRef.current.position;
              const rot = groupRef.current.rotation;
              const sc = groupRef.current.scale;

              updateObject(
                object.id,
                {
                  position: {
                    x: Number(pos.x.toFixed(2)),
                    y: Math.max(0, Number(pos.y.toFixed(2))),
                    z: Number(pos.z.toFixed(2)),
                  },
                  rotation: {
                    x: Number(((rot.x * 180) / Math.PI).toFixed(1)),
                    y: Number(((rot.y * 180) / Math.PI).toFixed(1)),
                    z: Number(((rot.z * 180) / Math.PI).toFixed(1)),
                  },
                  scale: { x: Number(sc.x.toFixed(2)), y: Number(sc.y.toFixed(2)), z: Number(sc.z.toFixed(2)) },
                },
                true // Record history for undo/redo
              );
            }
          }}
        />
      )}
    </>
  );
};
