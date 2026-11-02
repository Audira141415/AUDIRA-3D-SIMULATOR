import React, { useEffect, useRef } from 'react';
import {
  Lightbulb,
  SunMedium,
  ArrowLeft,
  ArrowRight,
  Megaphone,
  Music,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { useVehicleAudioStore } from '../../stores/useVehicleAudioStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { soundEngine } from '../audio/soundEngine';

export const VehicleQuickControls: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const isObsMode = useVehicleAudioStore((s) => s.isObsMode);

  // States
  const headlights = useVehicleAudioStore((s) => s.headlights);
  const toggleHeadlights = useVehicleAudioStore((s) => s.toggleHeadlights);

  const highBeam = useVehicleAudioStore((s) => s.highBeam);
  const toggleHighBeam = useVehicleAudioStore((s) => s.toggleHighBeam);

  const blinkerLeft = useVehicleAudioStore((s) => s.blinkerLeft);
  const toggleBlinkerLeft = useVehicleAudioStore((s) => s.toggleBlinkerLeft);

  const blinkerRight = useVehicleAudioStore((s) => s.blinkerRight);
  const toggleBlinkerRight = useVehicleAudioStore((s) => s.toggleBlinkerRight);

  const toggleAudioModal = useVehicleAudioStore((s) => s.toggleAudioModal);
  const isAudioModalOpen = useVehicleAudioStore((s) => s.isAudioModalOpen);

  const nitro = useVehicleAudioStore((s) => s.nitro);
  const isNitroActive = useVehicleAudioStore((s) => s.isNitroActive);
  const setIsNitroActive = useVehicleAudioStore((s) => s.setIsNitroActive);

  // Blinker audio tick-tok loop
  const tickRef = useRef(true);
  useEffect(() => {
    let interval: any;
    if (blinkerLeft || blinkerRight) {
      interval = setInterval(() => {
        soundEngine.playBlinker(tickRef.current);
        tickRef.current = !tickRef.current;
      }, 350);
    }
    return () => clearInterval(interval);
  }, [blinkerLeft, blinkerRight]);

  // If not driving or in OBS mode, don't show
  if (!isPlaying || isObsMode) return null;

  return (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 z-40 p-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col gap-2 pointer-events-auto select-none animate-fadeIn">
      {/* 0. Turbo Nitro Button */}
      <button
        type="button"
        onMouseDown={() => {
          if (nitro > 5) {
            setIsNitroActive(true);
            soundEngine.playNitroBoost();
          }
        }}
        onMouseUp={() => {
          setIsNitroActive(false);
          soundEngine.stopNitroBoost();
        }}
        onTouchStart={() => {
          if (nitro > 5) {
            setIsNitroActive(true);
            soundEngine.playNitroBoost();
          }
        }}
        onTouchEnd={() => {
          setIsNitroActive(false);
          soundEngine.stopNitroBoost();
        }}
        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-md active:scale-90 cursor-pointer ${
          isNitroActive
            ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse'
            : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border-cyan-500/30 hover:border-cyan-400'
        }`}
        title="Tahan untuk Turbo Nitro Boost (Shift)"
      >
        <Zap className={`w-3.5 h-3.5 ${isNitroActive ? 'fill-current' : ''}`} />
        <span className="text-[7px] font-black tracking-tight">NITRO</span>
      </button>
      {/* 1. Lampu Depan (Headlights) */}
      <button
        type="button"
        onClick={() => {
          toggleHeadlights();
          soundEngine.playUIClick();
        }}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-lg active:scale-95 cursor-pointer ${
          headlights
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
            : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-white/10 hover:border-cyan-500/40'
        }`}
        title="Lampu Depan (L)"
      >
        <Lightbulb className={`w-4 h-4 ${headlights ? 'fill-current' : ''}`} />
        <span className="text-[8px] font-bold tracking-tight">Lampu</span>
      </button>

      {/* 2. Lampu Jauh (High Beam) */}
      <button
        type="button"
        onClick={() => {
          toggleHighBeam();
          soundEngine.playUIClick();
        }}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-lg active:scale-95 cursor-pointer ${
          highBeam
            ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
            : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-white/10 hover:border-cyan-500/40'
        }`}
        title="Lampu Jauh (K)"
      >
        <SunMedium className="w-4 h-4" />
        <span className="text-[8px] font-bold tracking-tight">Jauh</span>
      </button>

      {/* 3. Sein Kiri */}
      <button
        type="button"
        onClick={() => {
          toggleBlinkerLeft();
          soundEngine.playUIClick();
        }}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-lg active:scale-95 cursor-pointer ${
          blinkerLeft
            ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.7)]'
            : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-white/10 hover:border-cyan-500/40'
        }`}
        title="Sein Kiri (Q / ,)"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[8px] font-bold tracking-tight">Sein Ki</span>
      </button>

      {/* 4. Sein Kanan */}
      <button
        type="button"
        onClick={() => {
          toggleBlinkerRight();
          soundEngine.playUIClick();
        }}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-lg active:scale-95 cursor-pointer ${
          blinkerRight
            ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.7)]'
            : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-white/10 hover:border-cyan-500/40'
        }`}
        title="Sein Kanan (E / .)"
      >
        <ArrowRight className="w-4 h-4" />
        <span className="text-[8px] font-bold tracking-tight">Sein Ka</span>
      </button>

      {/* 5. Klakson Virtual Button */}
      <button
        type="button"
        onMouseDown={() => soundEngine.playHorn()}
        className="w-11 h-11 rounded-xl bg-slate-950/80 hover:bg-cyan-500/30 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/60 flex flex-col items-center justify-center gap-0.5 transition-all shadow-lg active:scale-95 cursor-pointer"
        title="Bunyikan Klakson (B / H)"
      >
        <Megaphone className="w-4 h-4 text-cyan-400" />
        <span className="text-[8px] font-bold tracking-tight">Klakson</span>
      </button>

      {/* 6. Audio Kendaraan & Musik Modal Trigger */}
      <button
        type="button"
        onClick={toggleAudioModal}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all shadow-lg active:scale-95 cursor-pointer ${
          isAudioModalOpen
            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
            : 'bg-slate-950/85 hover:bg-slate-900 text-cyan-400 border-cyan-500/40 hover:border-cyan-400'
        }`}
        title="Buka Audio Kendaraan & Pemutar Musik"
      >
        <Music className="w-4 h-4" />
        <span className="text-[8px] font-bold tracking-tight">Musik</span>
      </button>
    </div>
  );
};
