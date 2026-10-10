import React from 'react';
import {
  MousePointer,
  Move,
  RotateCw,
  Maximize2,
  Grid,
  Magnet,
  Sun,
  Map,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { CameraPreset, TransformMode } from '@audira/shared';

export const Toolbar: React.FC = () => {
  const transformMode = useEditorStore((s) => s.transformMode);
  const setTransformMode = useEditorStore((s) => s.setTransformMode);

  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);

  const gridSnap = useEditorStore((s) => s.gridSnap);
  const toggleGridSnap = useEditorStore((s) => s.toggleGridSnap);

  const showShadows = useEditorStore((s) => s.showShadows);
  const toggleShadows = useEditorStore((s) => s.toggleShadows);

  const worldSize = useWorldStore((s) => s.worldSize) || 300;
  const setWorldSize = useWorldStore((s) => s.setWorldSize);

  const cycleWorldSize = () => {
    const SIZES = [150, 300, 500, 1000];
    const curIdx = SIZES.indexOf(worldSize);
    const nextIdx = (curIdx + 1) % SIZES.length;
    setWorldSize(SIZES[nextIdx]);
  };

  const preset = useCameraStore((s) => s.preset);
  const setPreset = useCameraStore((s) => s.setPreset);

  const transformTools: { mode: TransformMode; label: string; shortcut: string; icon: React.ReactNode }[] = [
    { mode: 'select', label: 'Pilih Objek', shortcut: 'Q', icon: <MousePointer className="w-4 h-4" /> },
    { mode: 'translate', label: 'Geser Posisi', shortcut: 'W', icon: <Move className="w-4 h-4" /> },
    { mode: 'rotate', label: 'Putar Objek', shortcut: 'E', icon: <RotateCw className="w-4 h-4" /> },
    { mode: 'scale', label: 'Skala Ukuran', shortcut: 'R', icon: <Maximize2 className="w-4 h-4" /> },
  ];

  const cameraPresets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: 'ISO' },
    { id: 'top', label: 'TOP' },
    { id: 'front', label: 'FRNT' },
    { id: 'side', label: 'SIDE' },
  ];

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-auto select-none">
      {/* 1. Transform Tools (Q, W, E, R) */}
      <div className="glass-panel p-1 rounded-xl flex flex-col gap-1 shadow-2xl border border-white/10 bg-[#0a0f18]/85 backdrop-blur-md">
        {transformTools.map((tool) => (
          <button
            key={tool.mode}
            onClick={() => setTransformMode(tool.mode)}
            className={`p-2 rounded-lg flex items-center justify-center transition-all relative group active:scale-95 ${
              transformMode === tool.mode
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
            <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              {tool.label} [{tool.shortcut}]
            </span>
          </button>
        ))}
      </div>

      {/* 2. Grid & Environment Helpers */}
      <div className="glass-panel p-1 rounded-xl flex flex-col gap-1 shadow-2xl border border-white/10 bg-[#0a0f18]/85 backdrop-blur-md">
        {/* Grid toggle [G] */}
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg flex items-center justify-center transition-all relative group active:scale-95 ${
            showGrid
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
          }`}
          title="Grid On/Off (G)"
        >
          <Grid className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
            Grid {showGrid ? 'ON' : 'OFF'} [G]
          </span>
        </button>

        {/* Snap toggle [S] */}
        <button
          onClick={toggleGridSnap}
          className={`p-2 rounded-lg flex items-center justify-center transition-all relative group active:scale-95 ${
            gridSnap
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
          }`}
          title="Grid Snap On/Off (S)"
        >
          <Magnet className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
            Snap {gridSnap ? 'ON' : 'OFF'} [S]
          </span>
        </button>

        {/* Soft Shadows */}
        <button
          onClick={toggleShadows}
          className={`p-2 rounded-lg flex items-center justify-center transition-all relative group active:scale-95 ${
            showShadows
              ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
          }`}
          title="Shadows Toggle"
        >
          <Sun className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
            Shadows {showShadows ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Map World Size Scale Toggle */}
        <button
          onClick={cycleWorldSize}
          className="p-1.5 rounded-lg flex flex-col items-center justify-center transition-all relative group active:scale-95 text-cyan-400 hover:text-cyan-200 hover:bg-white/10 border border-cyan-500/20"
          title={`Skala Grid: ${worldSize}m (Klik untuk ubah)`}
        >
          <Map className="w-3.5 h-3.5" />
          <span className="text-[7px] font-mono font-bold leading-none mt-0.5 text-cyan-300">
            {worldSize}m
          </span>
          <span className="absolute left-full ml-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
            Skala Area: {worldSize}x{worldSize}m (Klik untuk ubah 150/300/500/1000m)
          </span>
        </button>
      </div>

      {/* 3. Camera View Shortcuts */}
      <div className="glass-panel p-1 rounded-xl flex flex-col gap-0.5 shadow-2xl border border-white/10 bg-[#0a0f18]/85 backdrop-blur-md">
        <div className="p-0.5 text-center font-mono text-[8px] text-cyan-400 font-extrabold uppercase tracking-wider">
          CAM
        </div>
        {cameraPresets.map((cam) => (
          <button
            key={cam.id}
            onClick={() => setPreset(cam.id)}
            className={`px-1.5 py-1 rounded text-[9px] font-mono transition-all text-center ${
              preset === cam.id
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cam.label}
          </button>
        ))}
      </div>
    </div>
  );
};
