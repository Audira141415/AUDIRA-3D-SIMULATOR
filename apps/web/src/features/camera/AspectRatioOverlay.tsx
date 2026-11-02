import React from 'react';
import { useVisualStyleStore } from '../../stores/useVisualStyleStore';

export const AspectRatioOverlay: React.FC = () => {
  const showOverlay = useVisualStyleStore((s) => s.showAspectRatioOverlay);
  const aspectRatio = useVisualStyleStore((s) => s.aspectRatio);

  if (!showOverlay) return null;

  // Compute aspect ratio CSS
  let aspectStyle: React.CSSProperties = {};
  if (aspectRatio === '9:16') {
    aspectStyle = { aspectRatio: '9 / 16', maxHeight: '100%' };
  } else if (aspectRatio === '1:1') {
    aspectStyle = { aspectRatio: '1 / 1', maxHeight: '100%' };
  } else if (aspectRatio === '21:9') {
    aspectStyle = { aspectRatio: '21 / 9', maxWidth: '100%' };
  } else {
    // 16:9
    aspectStyle = { aspectRatio: '16 / 9', maxWidth: '100%', maxHeight: '100%' };
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
      {/* Semi-transparent Dark Letterbox/Pillarbox Frame */}
      <div
        className="relative border-2 border-dashed border-cyan-400/60 shadow-[0_0_0_9999px_rgba(3,7,18,0.65)] rounded-lg transition-all"
        style={aspectStyle}
      >
        {/* Top-Right Aspect Badge */}
        <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono font-black text-cyan-300 border border-cyan-400/40">
          FRAME {aspectRatio}
        </div>
      </div>
    </div>
  );
};

