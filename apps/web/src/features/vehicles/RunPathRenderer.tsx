import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useVehicleRunStore, Waypoint } from '../../stores/useVehicleRunStore';
import { useWorldStore } from '../../stores/useWorldStore';

const PALETTE = [
  '#00d2ff', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#ef4444', // Red
];

export function getVehicleColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

interface SinglePathProps {
  ownerId: string;
  points: Waypoint[];
  color: string;
  isEditing: boolean;
}

const SinglePath: React.FC<SinglePathProps> = ({ points, color, isEditing }) => {
  // Generate curve and points geometry
  const curvePoints = useMemo(() => {
    if (points.length < 2) return null;
    const vectors = points.map((p) => new THREE.Vector3(p.x, 0.08, p.z));
    if (points.length === 2) {
      return vectors;
    }
    const curve = new THREE.CatmullRomCurve3(vectors, false, 'centripetal', 0.5);
    return curve.getPoints(Math.max(20, points.length * 15));
  }, [points]);

  const lineGeometry = useMemo(() => {
    if (!curvePoints || curvePoints.length < 2) return null;
    const geo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    return geo;
  }, [curvePoints]);

  const lineMesh = useMemo(() => {
    if (!lineGeometry) return null;
    const mat = new THREE.LineBasicMaterial({
      color,
      linewidth: 2,
      transparent: true,
      opacity: isEditing ? 0.95 : 0.75,
    });
    return new THREE.Line(lineGeometry, mat);
  }, [lineGeometry, color, isEditing]);

  if (!points || points.length === 0) return null;

  return (
    <group>
      {/* 1. Spline / Line connecting waypoints */}
      {lineMesh && <primitive object={lineMesh} />}

      {/* 2. Waypoint Spheres / Markers */}
      {points.map((p, idx) => {
        const isStart = idx === 0;
        const isEnd = idx === points.length - 1 && points.length > 1;

        const markerColor = isStart ? '#22c55e' : isEnd ? '#f59e0b' : color;
        const radius = isStart ? 0.35 : isEnd ? 0.28 : 0.18;

        return (
          <group key={`${p.x}-${p.z}-${idx}`} position={[p.x, 0.12, p.z]}>
            {/* Ground Ring Marker */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 0.9, radius * 1.35, 16]} />
              <meshBasicMaterial
                color={markerColor}
                transparent
                opacity={isStart ? 0.9 : 0.6}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Waypoint Sphere Beacon */}
            <mesh position={[0, radius, 0]}>
              <sphereGeometry args={[radius, 16, 16]} />
              <meshStandardMaterial
                color={markerColor}
                emissive={markerColor}
                emissiveIntensity={isStart ? 0.8 : 0.4}
                roughness={0.3}
              />
            </mesh>

            {/* Start Beacon Halo Pole */}
            {isStart && (
              <mesh position={[0, 1.0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export const RunPathRenderer: React.FC = () => {
  const paths = useVehicleRunStore((s) => s.paths);
  const hiddenPaths = useVehicleRunStore((s) => s.hiddenPaths);
  const pathOwner = useVehicleRunStore((s) => s.pathOwner);
  const pathEdit = useVehicleRunStore((s) => s.pathEdit);
  const objects = useWorldStore((s) => s.objects);

  // Filter vehicles
  const vehicles = useMemo(() => {
    return objects.filter((o) => {
      const cat = o.category?.toLowerCase() || '';
      return cat === 'kendaraan' || cat === 'tractor' || cat === 'pesawat' || cat === 'vehicles';
    });
  }, [objects]);

  return (
    <group name="run-path-renderer">
      {vehicles.map((v, idx) => {
        const vPoints = paths[v.id];
        if (!vPoints || vPoints.length === 0) return null;
        if (hiddenPaths.includes(v.id)) return null;

        const isEditing = pathEdit && pathOwner === v.id;
        const color = getVehicleColor(idx);

        return (
          <SinglePath
            key={`path-${v.id}`}
            ownerId={v.id}
            points={vPoints}
            color={color}
            isEditing={isEditing}
          />
        );
      })}
    </group>
  );
};
