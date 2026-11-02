import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useVehicleAudioStore } from '../../stores/useVehicleAudioStore';
import { Terrain } from '../terrain/Terrain';
import { WorldObject } from '../objects/WorldObject';
import { CameraController } from '../camera/CameraController';
import { VehicleController, VehicleHUD } from '../vehicles/VehicleSimulator';
import { CameraModePills } from '../vehicles/CameraModePills';
import { VehicleQuickControls } from '../vehicles/VehicleQuickControls';
import { RunPathRenderer } from '../vehicles/RunPathRenderer';
import { MultiVehicleRunEngine } from '../vehicles/MultiVehicleRunEngine';
import { VehicleRunModal } from '../vehicles/VehicleRunModal';
import { TerrainSculptRenderer } from '../terrain/TerrainSculptRenderer';
import { TerrainSculptToolbar } from '../terrain/TerrainSculptToolbar';
import { MultiLayerGhostEngine } from '../vehicles/MultiLayerGhostEngine';
import { MultiLayerModal } from '../vehicles/MultiLayerModal';
import { VehicleFxModal } from '../vehicles/VehicleFxModal';
import { VisualCameraStudioModal } from '../camera/VisualCameraStudioModal';
import { AspectRatioOverlay } from '../camera/AspectRatioOverlay';
import { useDeviceProfileStore } from '../../stores/useDeviceProfileStore';
import { MobileTouchControls } from '../vehicles/MobileTouchControls';
import { EnvironmentLighting } from './EnvironmentLighting';
import { EyeOff } from 'lucide-react';

export const Viewport3D: React.FC = () => {
  const objects = useWorldStore((s) => s.objects);
  const showShadows = useEditorStore((s) => s.showShadows);
  const enableShadows = useDeviceProfileStore((s) => s.enableShadows);
  const pixelRatio = useDeviceProfileStore((s) => s.pixelRatio);
  const isObsMode = useVehicleAudioStore((s) => s.isObsMode);
  const toggleObsMode = useVehicleAudioStore((s) => s.toggleObsMode);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas
        shadows={showShadows && enableShadows}
        dpr={pixelRatio}
        camera={{ position: [65, 55, 65], fov: 45, near: 0.5, far: 3500 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          logarithmicDepthBuffer: true,
        }}
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

        {/* 3D Terrain Sculptor Brush Cursor */}
        <TerrainSculptRenderer />

        {/* Multi-Layer Activity Recording Ghost Vehicles Engine */}
        <MultiLayerGhostEngine />

        {/* Multi-Vehicle Autonomous RUN Simulation & Waypoint Paths */}
        <RunPathRenderer />
        <MultiVehicleRunEngine />

        {/* Orbit Camera and Preset Controller */}
        <CameraController />
      </Canvas>

      {/* Simulator HUD (Speedometer & Controls Overlay) */}
      <VehicleHUD />

      {/* Camera Mode Pills Quick Switcher (Top pill bar) */}
      <CameraModePills />

      {/* Vehicle Quick Controls (Lights, High Beam, Blinkers, Horn, Audio Modal) */}
      <VehicleQuickControls />

      {/* Mobile Touch Controls & Virtual Steering/Pedals */}
      <MobileTouchControls />

      {/* 3D Terrain Sculptor Brush Toolbar */}
      <TerrainSculptToolbar />

      {/* Multi-Layer Activity Recording & Ghost Player Modal */}
      <MultiLayerModal />

      {/* Vehicle Hydraulics & Destruction FX Modal */}
      <VehicleFxModal />

      {/* Camera & Visual Studio Modal */}
      <VisualCameraStudioModal />

      {/* Camera Aspect Ratio Guide Overlay (16:9, 9:16 Shorts) */}
      <AspectRatioOverlay />

      {/* Floating RUN Controller Modal (Multi-Vehicle Path Simulator) */}
      <VehicleRunModal />

      {/* Floating Exit Button when in Clean OBS Mode */}
      {isObsMode && (
        <button
          type="button"
          onClick={toggleObsMode}
          className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-cyan-500/80 text-slate-300 hover:text-slate-950 border border-white/20 hover:border-cyan-400 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-md cursor-pointer pointer-events-auto"
          title="Tampilkan Kembali Seluruh Menu UI"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Keluar Mode OBS</span>
        </button>
      )}
    </div>
  );
};
