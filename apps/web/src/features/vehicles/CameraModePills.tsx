import React from 'react';
import {
  Video,
  Eye,
  Camera,
  Compass,
  Radio,
  Flame,
  Plane,
  Monitor,
  User,
} from 'lucide-react';
import { useVehicleAudioStore, CameraPillMode } from '../../stores/useVehicleAudioStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { soundEngine } from '../audio/soundEngine';

export const CameraModePills: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const isObsMode = useVehicleAudioStore((s) => s.isObsMode);
  const cameraModePill = useVehicleAudioStore((s) => s.cameraModePill);
  const setCameraModePill = useVehicleAudioStore((s) => s.setCameraModePill);
  const setTrackingAngle = useCameraStore((s) => s.setTrackingAngle);

  if (!isPlaying || isObsMode) return null;

  const PILL_MODES: { id: CameraPillMode; label: string; icon?: React.ReactNode }[] = [
    { id: 'off', label: 'OFF' },
    { id: 'chase', label: 'Chase' },
    { id: '3p-orbit', label: '3P Orbit' },
    { id: 'orbit', label: 'Orbit' },
    { id: 'ikuti', label: 'Ikuti' },
    { id: 'flow', label: 'Flow' },
    { id: 'cinematic', label: 'Sinematik' },
    { id: 'tracking', label: 'Tracking' },
    { id: 'drone', label: 'Drone' },
    { id: 'cockpit', label: 'Kabin' },
    { id: 'director', label: 'AI Director' },
  ];

  const handleSelect = (mode: CameraPillMode) => {
    setCameraModePill(mode);
    soundEngine.playUIClick();

    // Map to camera tracking angles
    if (mode === 'director') {
      setTrackingAngle('director');
    } else if (mode === 'cockpit') {
      setTrackingAngle('front');
    } else if (mode === 'drone') {
      setTrackingAngle('drone');
    } else if (mode === 'cinematic' || mode === 'orbit' || mode === '3p-orbit') {
      setTrackingAngle('orbit-360');
    } else if (mode === 'flow') {
      setTrackingAngle('low-stunt');
    } else if (mode === 'chase' || mode === 'ikuti') {
      setTrackingAngle('chase');
    } else if (mode === 'off') {
      setTrackingAngle('free');
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none animate-fadeIn">
      {/* Sleek Floating Camera Mode Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {PILL_MODES.map((item) => {
          const isActive = cameraModePill === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-[1.04]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
