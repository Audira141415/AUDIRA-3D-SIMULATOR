import React, { useState } from 'react';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  Crosshair,
  RotateCcw,
  HelpCircle,
  X,
} from 'lucide-react';
import { useCameraStore } from '../../stores/useCameraStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { soundEngine } from '../../features/audio/soundEngine';

export const NavigationControls: React.FC = () => {
  const preset = useCameraStore((s) => s.preset);
  const setPreset = useCameraStore((s) => s.setPreset);
  const cameraHeading = useCameraStore((s) => s.cameraHeading);
  const zoomIn = useCameraStore((s) => s.zoomIn);
  const zoomOut = useCameraStore((s) => s.zoomOut);
  const resetView = useCameraStore((s) => s.resetView);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const objects = useWorldStore((s) => s.objects);

  const [showHelp, setShowHelp] = useState<boolean>(false);

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  // Convert camera heading angle (radians) to CSS rotation degrees
  const compassDegrees = (-cameraHeading * 180) / Math.PI;
  const normalizedDegrees = Math.round(((compassDegrees % 360) + 360) % 360);

  const handleZoomIn = () => {
    soundEngine.playUIClick();
    zoomIn();
  };

  const handleZoomOut = () => {
    soundEngine.playUIClick();
    zoomOut();
  };

  const handleReset = () => {
    soundEngine.playUIClick();
    resetView();
  };

  const handleFocus = () => {
    if (selectedObject) {
      soundEngine.playUIClick();
      setFocusTarget(selectedObject.position);
    }
  };

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2 pointer-events-auto select-none">
      {/* Sleek Compact Camera HUD Rail */}
      <div className="glass-panel p-1.5 rounded-xl border border-white/10 bg-[#0a0f18]/85 backdrop-blur-md flex flex-col items-center gap-1.5 shadow-2xl">
        {/* Mini Rotating Compass */}
        <div
          onClick={() => {
            soundEngine.playUIClick();
            setPreset('isometric');
          }}
          className="relative w-10 h-10 rounded-full border border-cyan-500/40 bg-slate-950/80 flex items-center justify-center cursor-pointer hover:border-cyan-400 group transition-all shadow-inner"
          title={`Arah Kamera: ${normalizedDegrees}° (Klik untuk Reset ke ISO)`}
        >
          {/* Rotating Needle */}
          <div
            className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out pointer-events-none"
            style={{ transform: `rotate(${compassDegrees}deg)` }}
          >
            <div className="absolute top-0.5 text-[8px] font-black text-rose-500">N</div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-rose-500 via-white to-cyan-500 rounded-full opacity-80" />
          </div>

          {/* Compass Icon center badge */}
          <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform opacity-70" />
        </div>

        {/* View Angle Pill Selector (Compact 2x2 grid) */}
        <div className="grid grid-cols-2 gap-1 w-20 pt-1 border-t border-white/10">
          {(
            [
              { id: 'isometric', label: 'ISO' },
              { id: 'top', label: 'TOP' },
              { id: 'front', label: 'FRNT' },
              { id: 'side', label: 'SIDE' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playUIClick();
                setPreset(item.id);
              }}
              className={`py-1 text-[9px] font-mono font-bold rounded transition-all text-center ${
                preset === item.id
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/60 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-full h-[1px] bg-white/10 my-0.5" />

        {/* Action Controls Stack */}
        <div className="flex flex-col gap-1 w-full items-center">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/25 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 group relative w-full flex items-center justify-center"
            title="Perbesar Kamera (Zoom In) [+]"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              Zoom In [+]
            </span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/25 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 group relative w-full flex items-center justify-center"
            title="Perkecil Kamera (Zoom Out) [-]"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              Zoom Out [-]
            </span>
          </button>

          {/* Focus Selected Object [F] */}
          <button
            onClick={handleFocus}
            disabled={!selectedObject}
            className={`p-1.5 rounded-lg transition-all active:scale-95 group relative w-full flex items-center justify-center ${
              selectedObject
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.35)] animate-pulse'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
            title="Fokuskan Kamera ke Objek Terpilih [F]"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              Fokus Objek [F]
            </span>
          </button>

          {/* Reset Camera View */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all active:scale-95 group relative w-full flex items-center justify-center"
            title="Reset Posisi Kamera"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              Reset Kamera
            </span>
          </button>

          {/* Navigation Guide Popover Toggle */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-1.5 rounded-lg transition-all active:scale-95 group relative w-full flex items-center justify-center ${
              showHelp
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
            title="Petunjuk Navigasi & Shortcut"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="absolute right-full mr-2 px-2 py-0.5 bg-slate-900 border border-white/15 text-[10px] rounded text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono z-30 shadow-lg">
              Bantuan
            </span>
          </button>
        </div>
      </div>

      {/* Floating Compact Help Guide Popover */}
      {showHelp && (
        <div className="glass-panel p-3 rounded-xl border border-amber-500/40 bg-[#0a0f18]/95 backdrop-blur-md w-60 text-xs flex flex-col gap-2 shadow-2xl animate-in fade-in slide-in-from-right-2 duration-150">
          <div className="font-bold text-amber-400 flex items-center justify-between pb-1 border-b border-white/10">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <HelpCircle className="w-3.5 h-3.5" /> Petunjuk Kontrol
            </span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Klik Kiri + Tarik:</span>
              <span className="text-cyan-300 font-bold">Putar Kamera</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Klik Kanan + Tarik:</span>
              <span className="text-cyan-300 font-bold">Pan Geser</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scroll Roda:</span>
              <span className="text-cyan-300 font-bold">Zoom In / Out</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Q / W / E / R:</span>
              <span className="text-cyan-300 font-bold">Select/Move/Rot/Sc</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tombol Panah:</span>
              <span className="text-cyan-300 font-bold">Geser Objek</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tombol F:</span>
              <span className="text-cyan-300 font-bold">Fokus Objek</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ctrl + Z / Y:</span>
              <span className="text-cyan-300 font-bold">Undo / Redo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
