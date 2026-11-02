import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sliders,
  Type,
  Maximize2,
  Tv,
  Layers,
  Sparkles,
  Music,
  Share2,
} from 'lucide-react';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

type AspectRatio = '16:9' | '9:16' | '1:1';
type SpectrumStyle = 'bars' | 'wave' | 'radial';

export const VideoEditorTool: React.FC = () => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60); // 60 seconds
  const [spectrumStyle, setSpectrumStyle] = useState<SpectrumStyle>('bars');
  const [overlayText, setOverlayText] = useState('AUDIRA 3D SIMULATOR — GAMEPLAY RESMI');
  const [textColor, setTextColor] = useState('#00d2ff');
  const [fontSize, setFontSize] = useState(24);
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [audioVolume, setAudioVolume] = useState(80);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const sharedAudioTitle = useKreatorStudioStore((s) => s.sharedAudioTitle);

  // Canvas drawing animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick += isPlaying ? 0.05 : 0.01;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background dark gradient / gameplay simulation
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(1, '#030712');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid perspective simulation
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.45;
      for (let i = -width; i < width * 2; i += 40) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // 2. Audio Spectrum Visualizer
      if (spectrumStyle === 'bars') {
        const barCount = 48;
        const barWidth = width / barCount;
        ctx.fillStyle = textColor;
        for (let i = 0; i < barCount; i++) {
          const wave = Math.sin(tick * 2 + i * 0.3) * 0.5 + 0.5;
          const barHeight = wave * (height * 0.28);
          const x = i * barWidth;
          const y = height - barHeight - 40;

          const barGrad = ctx.createLinearGradient(0, y, 0, height - 40);
          barGrad.addColorStop(0, textColor);
          barGrad.addColorStop(1, 'rgba(6, 182, 212, 0.1)');
          ctx.fillStyle = barGrad;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
      } else if (spectrumStyle === 'wave') {
        ctx.beginPath();
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = textColor;
        for (let x = 0; x < width; x += 4) {
          const y =
            height * 0.6 +
            Math.sin(tick * 3 + x * 0.03) * 35 * Math.sin(tick + x * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (spectrumStyle === 'radial') {
        const centerX = width / 2;
        const centerY = height * 0.48;
        const radius = Math.min(width, height) * 0.2;
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        const points = 64;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const amp = Math.sin(tick * 4 + i * 0.5) * 20;
          const r = radius + amp;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 3. Text Overlay
      if (overlayText) {
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        let textY = height - 60;
        if (textPosition === 'top') textY = 60;
        if (textPosition === 'center') textY = height / 2;

        const textMetrics = ctx.measureText(overlayText);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(
          width / 2 - textMetrics.width / 2 - 16,
          textY - fontSize,
          textMetrics.width + 32,
          fontSize + 16
        );

        ctx.fillStyle = textColor;
        ctx.fillText(overlayText, width / 2, textY);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, spectrumStyle, overlayText, textColor, fontSize, textPosition]);

  // Timeline progress simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordVideoSeconds, setRecordVideoSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Real WebM Video Recording via MediaRecorder
  const handleToggleVideoRecord = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecordingVideo) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingVideo(false);
    } else {
      recordedChunksRef.current = [];
      try {
        const stream = canvas.captureStream(30);
        const mr = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        mr.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `audira_video_${aspectRatio.replace(':', 'x')}_${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
          setIsRecordingVideo(false);
          setRecordVideoSeconds(0);
        };
        mr.start();
        mediaRecorderRef.current = mr;
        setIsRecordingVideo(true);
        setRecordVideoSeconds(0);
      } catch (err) {
        alert('Browser tidak mendukung MediaRecorder untuk canvas.');
      }
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecordingVideo) {
      interval = setInterval(() => {
        setRecordVideoSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingVideo]);

  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `video-cover-${Date.now()}.png`;
    a.click();
  };

  const getCanvasDimensions = () => {
    if (aspectRatio === '16:9') return { width: 640, height: 360 };
    if (aspectRatio === '9:16') return { width: 360, height: 640 };
    return { width: 480, height: 480 };
  };

  const { width, height } = getCanvasDimensions();

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Controls: Aspect Ratio, Mode, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Format Rasio:</span>
          {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((r) => (
            <button
              key={r}
              onClick={() => setAspectRatio(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                aspectRatio === r
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {r === '16:9' ? '16:9 (YouTube)' : r === '9:16' ? '9:16 (Shorts/TikTok)' : '1:1 (Square)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpectrumStyle(spectrumStyle === 'bars' ? 'wave' : spectrumStyle === 'wave' ? 'radial' : 'bars')}
            className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spectrum: {spectrumStyle.toUpperCase()}</span>
          </button>

          <button
            onClick={handleToggleVideoRecord}
            className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isRecordingVideo
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-rose-600/25 hover:bg-rose-600/40 text-rose-300 border-rose-500/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isRecordingVideo ? 'bg-white animate-ping' : 'bg-rose-500'}`} />
            <span>{isRecordingVideo ? `Stop & Unduh (${recordVideoSeconds}s)` : 'Rekam Video WebM'}</span>
          </button>

          <button
            onClick={handleDownloadSnapshot}
            className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Ambil foto frame canvas saat ini"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cover PNG</span>
          </button>
        </div>
      </div>

      {/* Main Preview & Sidebar Controls */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 items-center justify-center">
        {/* Canvas Display */}
        <div className="flex-1 flex items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-white/10 overflow-hidden w-full max-h-[420px]">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="rounded-lg shadow-2xl border border-white/10 max-h-[380px] max-w-full object-contain"
          />
        </div>

        {/* Text & Style Inspector Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Overlay Teks &amp; Judul</span>
            </span>
            <input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="Tulis caption teks..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Warna Aksen</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 bg-slate-950 rounded cursor-pointer border border-white/10"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">Ukuran Font ({fontSize}px)</label>
                <input
                  type="range"
                  min="14"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded appearance-none cursor-pointer accent-cyan-400 mt-2"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Posisi Teks</label>
              <div className="grid grid-cols-3 gap-1">
                {(['top', 'center', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setTextPosition(pos)}
                    className={`py-1 rounded text-[11px] font-bold uppercase transition-all ${
                      textPosition === pos
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border border-white/5'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Layer Info */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Track Audio Pengiring</span>
            </span>
            <div className="text-xs text-slate-300 truncate">
              {sharedAudioTitle || 'AUDIRA Synthesizer Soundtrack 01'}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[10px]">Volume ({audioVolume}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="flex-1 h-1.5 bg-slate-950 rounded appearance-none accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Track Timeline Dock */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col gap-2">
        {/* Transport Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.4)] active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-white/10"
              title="Reset ke Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-cyan-400 font-bold ml-2">
              {Math.floor(currentTime / 60).toString().padStart(2, '0')}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            Rasio Video Aktif: <span className="text-cyan-300 font-bold">{aspectRatio}</span>
          </div>
        </div>

        {/* Tracks representation */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          {/* Track 1: Video */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-16 text-slate-400 shrink-0">TRACK 1 [VID]</span>
            <div className="flex-1 h-6 bg-blue-950/50 border border-blue-500/30 rounded flex items-center px-2 text-blue-300 relative overflow-hidden">
              <span className="relative z-10 font-bold truncate">3D Gameplay &amp; World Simulation Footage</span>
              <div
                className="absolute top-0 bottom-0 left-0 bg-blue-500/20"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Track 2: Audio */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-16 text-slate-400 shrink-0">TRACK 2 [AUD]</span>
            <div className="flex-1 h-6 bg-amber-950/50 border border-amber-500/30 rounded flex items-center px-2 text-amber-300 relative overflow-hidden">
              <span className="relative z-10 font-bold truncate">BGM Audio &amp; Sound FX</span>
              <div
                className="absolute top-0 bottom-0 left-0 bg-amber-500/20"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Track 3: Subtitles */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="w-16 text-slate-400 shrink-0">TRACK 3 [TXT]</span>
            <div className="flex-1 h-6 bg-cyan-950/50 border border-cyan-500/30 rounded flex items-center px-2 text-cyan-300 relative overflow-hidden">
              <span className="relative z-10 font-bold truncate">{overlayText || 'Teks Subtitle'}</span>
              <div
                className="absolute top-0 bottom-0 left-0 bg-cyan-500/20"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
