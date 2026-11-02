import React from 'react';
import {
  Camera,
  Film,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  CloudFog,
  Tv,
  X,
  Gauge,
  Maximize2,
  Check,
} from 'lucide-react';
import { useVisualStyleStore, AspectRatioType, VisualFilterType } from '../../stores/useVisualStyleStore';
import { soundEngine } from '../audio/soundEngine';

export const VisualCameraStudioModal: React.FC = () => {
  const isOpen = useVisualStyleStore((s) => s.isOpen);
  const toggleOpen = useVisualStyleStore((s) => s.toggleOpen);
  const slowmoActive = useVisualStyleStore((s) => s.slowmoActive);
  const toggleSlowmo = useVisualStyleStore((s) => s.toggleSlowmo);
  const aspectRatio = useVisualStyleStore((s) => s.aspectRatio);
  const setAspectRatio = useVisualStyleStore((s) => s.setAspectRatio);
  const visualFilter = useVisualStyleStore((s) => s.visualFilter);
  const setVisualFilter = useVisualStyleStore((s) => s.setVisualFilter);
  const showOverlay = useVisualStyleStore((s) => s.showAspectRatioOverlay);
  const toggleOverlay = useVisualStyleStore((s) => s.toggleAspectRatioOverlay);

  if (!isOpen) return null;

  const ratios: { id: AspectRatioType; label: string; desc: string }[] = [
    { id: '16:9', label: '16:9', desc: 'YouTube / Widescreen' },
    { id: '9:16', label: '9:16', desc: 'Shorts / TikTok / Reels' },
    { id: '1:1', label: '1:1', desc: 'Instagram Square' },
    { id: '21:9', label: '21:9', desc: 'Cinematic Ultrawide' },
  ];

  const filters: { id: VisualFilterType; label: string; icon: any; color: string }[] = [
    { id: 'default', label: 'Alami (Cerah)', icon: Sun, color: 'text-amber-400' },
    { id: 'golden-sunset', label: 'Senja Keemasan', icon: Sunset, color: 'text-orange-400' },
    { id: 'cyberpunk-neon', label: 'Cyberpunk Neon', icon: Moon, color: 'text-cyan-400' },
    { id: 'moody-fog', label: 'Kabut Pegunungan', icon: CloudFog, color: 'text-slate-400' },
    { id: 'retro-sepia', label: 'Film Retro Klasik', icon: Tv, color: 'text-amber-600' },
  ];

  return (
    <div className="absolute right-6 bottom-24 z-40 w-88 rounded-2xl bg-[#09151c]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl text-slate-100 flex flex-col overflow-hidden select-none animate-fadeIn font-sans">
      {/* Header */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-black tracking-wider text-cyan-300">
            CAMERA & VISUAL STUDIO
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Visual Studio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        {/* 1. Slowmo 0.25x Toggle */}
        <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">Slow-Motion 0.25x</span>
            <span className="text-[10px] text-slate-400">Efek gerakan lambat sinematik</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playUIClick();
              toggleSlowmo();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              slowmoActive
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse'
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {slowmoActive ? 'AKTIF (0.25x)' : 'NORMAL (1.0x)'}
          </button>
        </div>

        {/* 2. Recording Aspect Ratio Switcher */}
        <div className="flex flex-col gap-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-cyan-400 uppercase font-mono">
              RASIO BINGKAI KAMERA REKAMAN
            </span>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-400 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showOverlay}
                onChange={(e) => toggleOverlay(e.target.checked)}
                className="rounded border-slate-700 accent-cyan-400"
              />
              <span>Garis Panduan</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {ratios.map((r) => {
              const isActive = aspectRatio === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playUIClick();
                    setAspectRatio(r.id);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black">{r.label}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Visual Grading Filters */}
        <div className="flex flex-col gap-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
          <span className="text-[10px] font-black tracking-wider text-cyan-400 uppercase font-mono">
            FILTER ATMOSFER & PENCAHAYAAN
          </span>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {filters.map((f) => {
              const Icon = f.icon;
              const isActive = visualFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playUIClick();
                    setVisualFilter(f.id);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-sm'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${f.color}`} />
                    <span>{f.label}</span>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

