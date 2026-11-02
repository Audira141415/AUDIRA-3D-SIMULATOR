import React from 'react';
import { Gauge } from 'lucide-react';
import { useDeviceProfileStore, GraphicQuality } from '../../stores/useDeviceProfileStore';
import { soundEngine } from '../../features/audio/soundEngine';

export const QualityToggle: React.FC = () => {
  const quality = useDeviceProfileStore((s) => s.quality);
  const cycleQuality = useDeviceProfileStore((s) => s.cycleQuality);

  const labels: Record<GraphicQuality, { text: string; color: string }> = {
    low: { text: 'HEMAT (60 FPS)', color: 'text-emerald-400 border-emerald-500/40' },
    medium: { text: 'STANDAR', color: 'text-cyan-400 border-cyan-500/40' },
    high: { text: 'ULTRA HD', color: 'text-amber-400 border-amber-500/40' },
  };

  return (
    <button
      type="button"
      onClick={() => {
        soundEngine.playUIClick();
        cycleQuality();
      }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-slate-900/80 hover:bg-slate-800 text-xs font-mono font-bold transition-all ${labels[quality].color}`}
      title="Ubah Kualitas Grafis (Low / Medium / High)"
    >
      <Gauge className="w-3.5 h-3.5" />
      <span>{labels[quality].text}</span>
    </button>
  );
};
