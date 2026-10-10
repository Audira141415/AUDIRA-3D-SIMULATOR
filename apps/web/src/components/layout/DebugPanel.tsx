import React, { useState, useEffect } from 'react';
import { Terminal, Activity } from 'lucide-react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { useEditorStore } from '../../stores/useEditorStore';

export const DebugPanel: React.FC = () => {
  const [fps, setFps] = useState(60);
  const [isOpen, setIsOpen] = useState(false);

  const objects = useWorldStore((s) => s.objects);
  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const preset = useCameraStore((s) => s.preset);
  const transformMode = useEditorStore((s) => s.transformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);

  // Simple FPS estimation
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const frame = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(frame);
    };

    const handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div className="absolute top-16 right-84 z-10 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 rounded-md glass-panel border border-white/10 text-[11px] font-mono text-cyan-400 hover:text-white flex items-center gap-1.5 transition-all shadow-md"
      >
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>{fps} FPS</span>
      </button>

      {isOpen && (
        <div className="mt-2 w-64 glass-panel-elevated p-3 rounded-xl border border-cyan-500/30 text-[11px] font-mono flex flex-col gap-1.5 shadow-2xl">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-white/10 pb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>DEV DEBUG TELEMETRY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Objects:</span>
            <span className="text-white font-bold">{objects.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Selected ID:</span>
            <span className="text-cyan-400 truncate max-w-[120px]">{selectedObjectId || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera Preset:</span>
            <span className="text-amber-400 uppercase">{preset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transform Mode:</span>
            <span className="text-emerald-400 uppercase">{transformMode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Snap to Grid:</span>
            <span className="text-white">{gridSnap ? 'ENABLED (1m)' : 'DISABLED'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
