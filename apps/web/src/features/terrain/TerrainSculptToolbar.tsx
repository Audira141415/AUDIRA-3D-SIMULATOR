import React from 'react';
import {
  Mountain,
  ChevronUp,
  ChevronDown,
  Minus,
  TrendingUp,
  Waves,
  RotateCcw,
  X,
  Sliders,
  Check,
} from 'lucide-react';
import { useTerrainSculptStore, SculptTool } from '../../stores/useTerrainSculptStore';
import { soundEngine } from '../audio/soundEngine';

export const TerrainSculptToolbar: React.FC = () => {
  const isSculptActive = useTerrainSculptStore((s) => s.isSculptActive);
  const tool = useTerrainSculptStore((s) => s.tool);
  const radius = useTerrainSculptStore((s) => s.radius);
  const strength = useTerrainSculptStore((s) => s.strength);
  const targetHeight = useTerrainSculptStore((s) => s.targetHeight);
  const setTool = useTerrainSculptStore((s) => s.setTool);
  const setRadius = useTerrainSculptStore((s) => s.setRadius);
  const setStrength = useTerrainSculptStore((s) => s.setStrength);
  const setTargetHeight = useTerrainSculptStore((s) => s.setTargetHeight);
  const toggleSculptActive = useTerrainSculptStore((s) => s.toggleSculptActive);
  const clearHeightMap = useTerrainSculptStore((s) => s.clearHeightMap);

  if (!isSculptActive) return null;

  const tools: { id: SculptTool; label: string; icon: any; color: string }[] = [
    { id: 'raise', label: 'Tinggikan', icon: ChevronUp, color: 'text-emerald-400 border-emerald-500/50' },
    { id: 'lower', label: 'Turunkan', icon: ChevronDown, color: 'text-rose-400 border-rose-500/50' },
    { id: 'flatten', label: 'Ratakan', icon: Minus, color: 'text-amber-400 border-amber-500/50' },
    { id: 'slope', label: 'Lereng', icon: TrendingUp, color: 'text-purple-400 border-purple-500/50' },
    { id: 'smooth', label: 'Haluskan', icon: Waves, color: 'text-cyan-400 border-cyan-500/50' },
  ];

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-40 bg-[#09151c]/95 border border-cyan-500/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-3 flex flex-col gap-2.5 min-w-[340px] text-slate-100 select-none animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black tracking-wider uppercase text-cyan-300">
            BENTUK TANAH (3D SCULPTOR)
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            soundEngine.playUIClick();
            toggleSculptActive(false);
          }}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Panel Bentuk Tanah"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tools Selector */}
      <div className="grid grid-cols-5 gap-1.5">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = tool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                soundEngine.playUIClick();
                setTool(t.id);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${
                isActive
                  ? `bg-cyan-500/25 ${t.color} shadow-[0_0_12px_rgba(6,182,212,0.4)]`
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sliders: Radius & Strength */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-2.5 rounded-xl border border-white/5 text-xs">
        {/* Radius */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">Luas Area</span>
            <span className="text-cyan-400 font-mono">{radius} m</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Strength */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">Kekuatan</span>
            <span className="text-cyan-400 font-mono">{strength.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.1}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Target Height for Flatten / Slope */}
      {(tool === 'flatten' || tool === 'slope') && (
        <div className="flex items-center justify-between bg-slate-950/70 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
          <span className="text-[11px] font-bold text-slate-400">Target Ketinggian</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={-10}
              max={25}
              step={0.5}
              value={targetHeight}
              onChange={(e) => setTargetHeight(Number(e.target.value))}
              className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-cyan-300 font-bold min-w-8 text-right">
              {targetHeight} m
            </span>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset seluruh kontur bukit tanah ke datar (Y = 0)?')) {
              soundEngine.playUIClick();
              clearHeightMap();
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10 text-[11px] font-bold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tanah Datar</span>
        </button>

        <span className="text-[10px] text-slate-500 italic">
          Klik & tahan mouse di tanah untuk membentuk
        </span>
      </div>
    </div>
  );
};

