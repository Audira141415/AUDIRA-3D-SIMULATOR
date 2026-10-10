import React, { useState, useEffect } from 'react';
import { Camera, Megaphone, Smartphone } from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { soundEngine } from '../audio/soundEngine';

export const MobileTouchControls: React.FC = () => {
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const [showTouch, setShowTouch] = useState<boolean>(false);

  // Auto-detect touch device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setShowTouch(isTouch);
    }
  }, []);

  if (!isPlaying) return null;

  const simulateKeyEvent = (code: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { code, bubbles: true }));
  };

  const handleCameraSwitch = () => {
    simulateKeyEvent('KeyC', true);
    setTimeout(() => simulateKeyEvent('KeyC', false), 50);
  };

  const handleHorn = () => {
    soundEngine.playHorn();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-4 pt-16">
      {/* Top Toggle Button for Touch Controls on Desktop */}
      <div className="flex justify-end pointer-events-none">
        <button
          type="button"
          onClick={() => setShowTouch(!showTouch)}
          className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md border text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
            showTouch
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
          }`}
          title="Aktifkan Kontrol Sentuh Layar (Virtual Pedals & Steering)"
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Kontrol Sentuh</span>
        </button>
      </div>

      {showTouch && (
        <div className="w-full flex items-end justify-between pointer-events-none">
          {/* Left Side: Steering D-Pad Buttons */}
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-lg p-2 rounded-2xl border border-white/10 shadow-2xl">
            <button
              type="button"
              onPointerDown={() => simulateKeyEvent('KeyA', true)}
              onPointerUp={() => simulateKeyEvent('KeyA', false)}
              onPointerLeave={() => simulateKeyEvent('KeyA', false)}
              className="w-16 h-16 rounded-xl bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 border border-white/10 flex items-center justify-center text-white text-lg font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              ◀
            </button>

            <button
              type="button"
              onPointerDown={() => simulateKeyEvent('KeyD', true)}
              onPointerUp={() => simulateKeyEvent('KeyD', false)}
              onPointerLeave={() => simulateKeyEvent('KeyD', false)}
              className="w-16 h-16 rounded-xl bg-slate-900/90 active:bg-cyan-500 active:text-slate-950 border border-white/10 flex items-center justify-center text-white text-lg font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              ▶
            </button>
          </div>

          {/* Right Side: Action Buttons & Pedals */}
          <div className="pointer-events-auto flex flex-col items-end gap-2.5">
            {/* Quick Action Mini Buttons (Horn & Camera) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHorn}
                className="w-12 h-12 rounded-xl bg-amber-500/20 active:bg-amber-500 active:text-slate-950 border border-amber-400/40 text-amber-300 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Klakson"
              >
                <Megaphone className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleCameraSwitch}
                className="w-12 h-12 rounded-xl bg-cyan-500/20 active:bg-cyan-500 active:text-slate-950 border border-cyan-400/40 text-cyan-300 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Ganti Sudut Pandang Kamera (Kokpit / Chase)"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Pedals: Brake & Gas */}
            <div className="flex items-center gap-2.5">
              {/* Brake / Reverse Pedal */}
              <button
                type="button"
                onPointerDown={() => simulateKeyEvent('KeyS', true)}
                onPointerUp={() => simulateKeyEvent('KeyS', false)}
                onPointerLeave={() => simulateKeyEvent('KeyS', false)}
                className="w-20 h-24 rounded-2xl bg-gradient-to-t from-red-600 to-rose-500 active:from-red-700 active:to-rose-600 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400/40 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-xl">▼</span>
                <span>REM</span>
              </button>

              {/* Gas / Throttle Pedal */}
              <button
                type="button"
                onPointerDown={() => simulateKeyEvent('KeyW', true)}
                onPointerUp={() => simulateKeyEvent('KeyW', false)}
                onPointerLeave={() => simulateKeyEvent('KeyW', false)}
                className="w-24 h-28 rounded-2xl bg-gradient-to-t from-emerald-600 to-teal-400 active:from-emerald-700 active:to-teal-500 text-slate-950 font-black text-sm flex flex-col items-center justify-center gap-1 shadow-[0_0_24px_rgba(16,185,129,0.5)] border border-emerald-300/40 active:scale-95 transition-all cursor-pointer"
              >
                <span className="text-2xl">▲</span>
                <span>GAS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
