import React from 'react';
import {
  Wrench,
  Activity,
  Flame,
  ShieldAlert,
  RotateCcw,
  X,
  Play,
  Square,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { useVehicleFxStore, VehicleFxType } from '../../stores/useVehicleFxStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { soundEngine } from '../audio/soundEngine';

export const VehicleFxModal: React.FC = () => {
  const isOpen = useVehicleFxStore((s) => s.isOpen);
  const toggleOpen = useVehicleFxStore((s) => s.toggleOpen);
  const selectedVehicleId = useVehicleFxStore((s) => s.selectedVehicleId);
  const setSelectedVehicleId = useVehicleFxStore((s) => s.setSelectedVehicleId);
  const vehicleFxMap = useVehicleFxStore((s) => s.vehicleFxMap);

  const setHydraulicActive = useVehicleFxStore((s) => s.setHydraulicActive);
  const setHydraulicMode = useVehicleFxStore((s) => s.setHydraulicMode);
  const setHydraulicSpeed = useVehicleFxStore((s) => s.setHydraulicSpeed);
  const triggerFx = useVehicleFxStore((s) => s.triggerFx);
  const restoreVehicleFx = useVehicleFxStore((s) => s.restoreVehicleFx);
  const restoreAllFx = useVehicleFxStore((s) => s.restoreAllFx);

  const objects = useWorldStore((s) => s.objects);

  if (!isOpen) return null;

  // Find target vehicle
  const targetVehicle = objects.find((o) => o.id === selectedVehicleId);
  const targetFx = (selectedVehicleId && vehicleFxMap[selectedVehicleId]) || {
    hydraulicActive: false,
    hydraulicMode: 'auto',
    hydraulicProgress: 0,
    hydraulicSpeed: 1.0,
    fxType: 'none',
  };

  const isTruckOrHeavy =
    targetVehicle?.name?.toLowerCase().includes('scania') ||
    targetVehicle?.name?.toLowerCase().includes('truk') ||
    targetVehicle?.name?.toLowerCase().includes('truck') ||
    targetVehicle?.category === 'tractor';

  return (
    <div className="absolute left-6 bottom-24 z-40 w-88 rounded-2xl bg-[#09151c]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl text-slate-100 flex flex-col overflow-hidden select-none animate-fadeIn font-sans">
      {/* Header */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-black tracking-wider text-cyan-300">
            {isTruckOrHeavy ? 'HIDROLIK & EFEK' : 'EFEK KERUSAKAN'}
          </span>
          {targetVehicle && (
            <span className="text-[10px] text-slate-400 truncate max-w-32">
              · {targetVehicle.name}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Panel FX"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        {/* If no vehicle selected */}
        {!targetVehicle ? (
          <div className="p-3 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-400">
            Pilih kendaraan di peta terlebih dahulu untuk mengatur hidrolik atau efek kerusakan.
          </div>
        ) : (
          <>
            {/* 1. HIDROLIK SECTION (If truck / tractor / heavy equipment) */}
            {isTruckOrHeavy && (
              <div className="flex flex-col gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-black tracking-wider text-cyan-400 uppercase font-mono">
                  HIDROLIK NAIK / TURUN
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playUIClick();
                      setHydraulicActive(targetVehicle.id, !targetFx.hydraulicActive);
                    }}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      targetFx.hydraulicActive
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {targetFx.hydraulicActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>OFF</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>ON</span>
                      </>
                    )}
                  </button>

                  <label className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-bold cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={targetFx.hydraulicMode === 'auto'}
                      onChange={(e) =>
                        setHydraulicMode(targetVehicle.id, e.target.checked ? 'auto' : 'manual')
                      }
                      className="rounded border-slate-700 accent-cyan-400"
                    />
                    <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px]">LOOP</span>
                  </label>
                </div>

                {/* Speed Slider */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400">Kecepatan Hidrolik</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0.25}
                      max={3.0}
                      step={0.1}
                      value={targetFx.hydraulicSpeed}
                      onChange={(e) => setHydraulicSpeed(targetVehicle.id, Number(e.target.value))}
                      className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <span className="font-mono text-cyan-300 text-[11px] font-bold min-w-8 text-right">
                      {targetFx.hydraulicSpeed.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DESTRUCTION EFFECTS (SHATTER, EXPLODE, CRUSH) */}
            <div className="flex flex-col gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-black tracking-wider text-rose-400 uppercase font-mono">
                EFEK BENTURAN & KERUSAKAN
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                {/* Shatter */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCrash();
                    triggerFx(targetVehicle.id, 'shatter');
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center transition-all ${
                    targetFx.fxType === 'shatter'
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-amber-400/30'
                  }`}
                  title="Retakkan kaca & panel bodi"
                >
                  <ShieldAlert className="w-4 h-4 mb-1 text-amber-400" />
                  <span>Retak / Pecah</span>
                </button>

                {/* Explode */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCrash();
                    triggerFx(targetVehicle.id, 'explode');
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center transition-all ${
                    targetFx.fxType === 'explode'
                      ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-md animate-pulse'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-rose-400/30'
                  }`}
                  title="Ledakan terpental ke udara"
                >
                  <Flame className="w-4 h-4 mb-1 text-rose-400" />
                  <span>Ledakan</span>
                </button>

                {/* Crush */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCrashBump();
                    triggerFx(targetVehicle.id, 'crush');
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center transition-all ${
                    targetFx.fxType === 'crush'
                      ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-md'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-purple-400/30'
                  }`}
                  title="Gepeng / Remuk vertikal"
                >
                  <Activity className="w-4 h-4 mb-1 text-purple-400" />
                  <span>Remuk / Gepeng</span>
                </button>
              </div>

              {/* Restore Vehicle Single */}
              {targetFx.fxType !== 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSuccess();
                    restoreVehicleFx(targetVehicle.id);
                  }}
                  className="mt-1 py-1 px-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pulihkan Kendaraan Ini</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Global Action: Pulihkan Semua Objek */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playSuccess();
            restoreAllFx();
          }}
          className="py-1.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          title="Kembalikan semua kendaraan ke kondisi utuh tanpa kerusakan"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pulihkan Semua Objek</span>
        </button>
      </div>
    </div>
  );
};

