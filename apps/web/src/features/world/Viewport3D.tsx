import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { Terrain } from '../terrain/Terrain';
import { WorldObject } from '../objects/WorldObject';
import { CameraController } from '../camera/CameraController';
import { VehicleController, VehicleHUD } from '../vehicles/VehicleSimulator';
import { MobileTouchControls } from '../vehicles/MobileTouchControls';
import { EnvironmentLighting } from './EnvironmentLighting';

export const Viewport3D: React.FC = () => {
  const objects = useWorldStore((s) => s.objects);
  const showShadows = useEditorStore((s) => s.showShadows);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas
        shadows={showShadows}
        camera={{ position: [65, 55, 65], fov: 45, near: 0.1, far: 5000 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Dynamic 24-Hour Environment, Sun, Sky & Night Atmosphere */}
        <EnvironmentLighting />

        {/* 100x100m PBR Meadow Grass Terrain & Grid */}
        <Terrain />

        {/* Render All Active Game Objects in World */}
        {objects.map((obj) => (
          <WorldObject key={obj.id} object={obj} />
        ))}

        {/* Vehicle Simulator Physics & Driving Controller */}
        <VehicleController />

        {/* Orbit Camera and Preset Controller */}
        <CameraController />
      </Canvas>

      {/* Simulator HUD (Speedometer & Controls Overlay) */}
      <VehicleHUD />

      {/* Mobile Touch Controls & Virtual Steering/Pedals */}
      <MobileTouchControls />
    </div>
  );
};
