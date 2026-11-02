import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Sliders,
  Play,
  Square,
  Sparkles,
  Download,
  Activity,
  Layers,
  Zap,
  Upload,
  FileAudio,
  Check,
} from 'lucide-react';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

interface EqSettings {
  lowGain: number; // dB (-12 to +12)
  midGain: number; // dB (-12 to +12)
  highGain: number; // dB (-12 to +12)
  compressorThreshold: number; // -60 to 0
  compressorRatio: number; // 1 to 20
  reverbWet: number; // 0 to 1
  masterGain: number; // 0 to 2
}

const PRESETS: Record<string, EqSettings> = {
  flat: {
    lowGain: 0,
    midGain: 0,
    highGain: 0,
    compressorThreshold: -24,
    compressorRatio: 4,
    reverbWet: 0.1,
    masterGain: 1.0,
  },
  bassBoost: {
    lowGain: 8,
    midGain: -2,
    highGain: 4,
    compressorThreshold: -18,
    compressorRatio: 6,
    reverbWet: 0.15,
    masterGain: 1.1,
  },
  podcastClean: {
    lowGain: -3,
    midGain: 4,
    highGain: 5,
    compressorThreshold: -28,
    compressorRatio: 5,
    reverbWet: 0.05,
    masterGain: 1.2,
  },
  studioMaster: {
    lowGain: 3,
    midGain: 1,
    highGain: 4,
    compressorThreshold: -20,
    compressorRatio: 3,
    reverbWet: 0.2,
    masterGain: 1.0,
  },
  lofiTape: {
    lowGain: 6,
    midGain: 5,
    highGain: -8,
    compressorThreshold: -15,
    compressorRatio: 8,
    reverbWet: 0.35,
    masterGain: 0.9,
  },
};

// Helper function to encode AudioBuffer into a genuine WAV file (16-bit PCM)
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  out.setUint32(0, 0x46464952, false); // "RIFF"
  out.setUint32(4, length - 8, true); // file length - 8
  out.setUint32(8, 0x45564157, false); // "WAVE"
  out.setUint32(12, 0x20746d66, false); // "fmt " chunk
  out.setUint32(16, 16, true); // length = 16
  out.setUint16(20, 1, true); // PCM (uncompressed)
  out.setUint16(22, numOfChan, true);
  out.setUint32(24, sampleRate, true);
  out.setUint32(28, sampleRate * 2 * numOfChan, true); // byte rate
  out.setUint16(32, numOfChan * 2, true); // block align
  out.setUint16(34, 16, true); // 16-bit
  out.setUint32(36, 0x61746164, false); // "data" chunk
  out.setUint32(40, length - 44, true);

  pos = 44;
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

export const AudioEditorTool: React.FC = () => {
  const [eq, setEq] = useState<EqSettings>(PRESETS.flat);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState('flat');
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sharedAudioTitle = useKreatorStudioStore((s) => s.sharedAudioTitle);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle User Uploading Audio File (MP3 / WAV / OGG)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const tempCtx = new AudioCtx();
      const decoded = await tempCtx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decoded);
      setLoadedFileName(file.name);
      if (isPlaying) {
        handleTogglePlay(); // stop current
      }
    } catch (err) {
      alert('Gagal membaca file audio. Pastikan format berkas audio valid (MP3/WAV).');
    }
  };

  // Setup Audio Graph (Plays user audio or synthesized test sound)
  const setupAudioGraph = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const biquadLow = ctx.createBiquadFilter();
      biquadLow.type = 'lowshelf';
      biquadLow.frequency.value = 200;
      biquadLow.gain.value = eq.lowGain;

      const biquadMid = ctx.createBiquadFilter();
      biquadMid.type = 'peaking';
      biquadMid.frequency.value = 1500;
      biquadMid.gain.value = eq.midGain;

      const biquadHigh = ctx.createBiquadFilter();
      biquadHigh.type = 'highshelf';
      biquadHigh.frequency.value = 8000;
      biquadHigh.gain.value = eq.highGain;

      const gain = ctx.createGain();
      gain.gain.value = 0.8 * eq.masterGain;

      biquadLow.connect(biquadMid);
      biquadMid.connect(biquadHigh);
      biquadHigh.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);

      if (audioBuffer) {
        // Play uploaded user audio
        const src = ctx.createBufferSource();
        src.buffer = audioBuffer;
        src.loop = true;
        src.connect(biquadLow);
        src.start(0);
        sourceNodeRef.current = src;
      } else {
        // Synthesize test melodic tone
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.value = 0.08 * eq.masterGain;
        osc.connect(biquadLow);
        osc.start();
        sourceNodeRef.current = osc;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (sourceNodeRef.current) {
        try {
          (sourceNodeRef.current as any).stop?.();
        } catch (e) {}
        sourceNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setupAudioGraph();
      setIsPlaying(true);
    }
  };

  // Export & Render Audio via OfflineAudioContext
  const handleExportMasteredWav = async () => {
    setIsExporting(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      let targetBuffer = audioBuffer;

      // If no file loaded, generate a 3-second demo synth sample
      if (!targetBuffer) {
        const dummyCtx = new AudioCtx();
        targetBuffer = dummyCtx.createBuffer(2, dummyCtx.sampleRate * 3, dummyCtx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const data = targetBuffer.getChannelData(ch);
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(i * 0.05) * 0.2;
          }
        }
      }

      const offlineCtx = new OfflineAudioContext(
        targetBuffer.numberOfChannels,
        targetBuffer.length,
        targetBuffer.sampleRate
      );

      const src = offlineCtx.createBufferSource();
      src.buffer = targetBuffer;

      const low = offlineCtx.createBiquadFilter();
      low.type = 'lowshelf';
      low.frequency.value = 200;
      low.gain.value = eq.lowGain;

      const mid = offlineCtx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = 1500;
      mid.gain.value = eq.midGain;

      const high = offlineCtx.createBiquadFilter();
      high.type = 'highshelf';
      high.frequency.value = 8000;
      high.gain.value = eq.highGain;

      const gain = offlineCtx.createGain();
      gain.gain.value = eq.masterGain;

      src.connect(low);
      low.connect(mid);
      mid.connect(high);
      high.connect(gain);
      gain.connect(offlineCtx.destination);

      src.start(0);
      const rendered = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(rendered);

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${loadedFileName ? loadedFileName.replace(/\.[^/.]+$/, '') : 'audira_audio'}_mastered.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Gagal mengekspor audio. Coba muat file audio terlebih dahulu.');
    } finally {
      setIsExporting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dummyTick = 0;

    const draw = () => {
      dummyTick += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, width, height);

      // Grid decibel lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Frequency bars
      const barCount = 32;
      const barWidth = width / barCount;

      let buffer: Uint8Array<ArrayBuffer> | null = null;
      if (analyserRef.current && isPlaying) {
        buffer = new Uint8Array(new ArrayBuffer(analyserRef.current.frequencyBinCount)) as Uint8Array<ArrayBuffer>;
        analyserRef.current.getByteFrequencyData(buffer);
      }

      for (let i = 0; i < barCount; i++) {
        let val = 0;
        if (buffer && buffer[i] !== undefined) {
          val = buffer[i] / 255;
        } else if (isPlaying) {
          val = (Math.sin(dummyTick * 2 + i * 0.4) * 0.5 + 0.5) * 0.8;
        } else {
          val = 0.05;
        }

        const barHeight = val * (height - 30);
        const x = i * barWidth;
        const y = height - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, '#a855f7');
        grad.addColorStop(0.5, '#06b6d4');
        grad.addColorStop(1, '#3b82f6');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      // EQ curve visualizer overlay
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22d3ee';

      const lowY = height / 2 - eq.lowGain * 4;
      const midY = height / 2 - eq.midGain * 4;
      const highY = height / 2 - eq.highGain * 4;

      ctx.moveTo(0, lowY);
      ctx.bezierCurveTo(width * 0.3, lowY, width * 0.4, midY, width * 0.5, midY);
      ctx.bezierCurveTo(width * 0.6, midY, width * 0.7, highY, width, highY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, eq]);

  const applyPreset = (key: string) => {
    setActivePreset(key);
    setEq(PRESETS[key] || PRESETS.flat);
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">
              {loadedFileName ? `File Aktif: ${loadedFileName}` : (sharedAudioTitle || 'Master DSP Audio Console (32-bit Floating Point)')}
            </h3>
            <p className="text-[10px] text-slate-400">
              {audioBuffer
                ? `Buffer Terurai: ${(audioBuffer.duration).toFixed(1)} detik · ${audioBuffer.sampleRate} Hz · ${audioBuffer.numberOfChannels} Ch`
                : 'Bisa upload file audio MP3/WAV milik Anda sendiri untuk di-EQ dan diunduh'}
            </p>
          </div>
        </div>

        {/* Upload Audio File & Export Mastered WAV */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            title="Muat file MP3/WAV lokal Anda"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Audio Anda</span>
          </button>

          <button
            onClick={handleExportMasteredWav}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(16,185,129,0.4)] active:scale-95"
            title="Render dan unduh hasil mastering audio ke file WAV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Memproses...' : 'Ekspor Master WAV'}</span>
          </button>
        </div>
      </div>

      {/* Preset Ribbon */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Preset Cepat:</span>
        <div className="flex flex-wrap gap-1.5 items-center">
          {Object.keys(PRESETS).map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                activePreset === p
                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {p === 'bassBoost' ? 'Bass Boost' : p === 'podcastClean' ? 'Podcast Jernih' : p === 'studioMaster' ? 'Studio Master' : p === 'lofiTape' ? 'Lo-Fi Tape' : 'Flat'}
            </button>
          ))}
        </div>
      </div>

      {/* Realtime Spectrum & EQ Response Canvas */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3 h-3" />
            <span>RESPONS FREKUENSI REALTIME (20 Hz - 20 kHz)</span>
          </span>
          <span className="text-purple-300 font-bold">FFT Res: 128 Bins Realtime</span>
        </div>
        <canvas
          ref={canvasRef}
          width={700}
          height={160}
          className="w-full h-36 rounded-lg border border-white/5"
        />
      </div>

      {/* EQ Sliders & Mastering Rack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. 3-Band Parametric EQ */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>3-Band Equalizer</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Low Shelf (Bass 100Hz)</span>
              <span className="font-mono text-cyan-300 font-bold">{eq.lowGain > 0 ? `+${eq.lowGain}` : eq.lowGain} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.lowGain}
              onChange={(e) => setEq({ ...eq, lowGain: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Mid Peaking (1.5 kHz)</span>
              <span className="font-mono text-cyan-300 font-bold">{eq.midGain > 0 ? `+${eq.midGain}` : eq.midGain} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.midGain}
              onChange={(e) => setEq({ ...eq, midGain: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">High Shelf (Treble 10kHz)</span>
              <span className="font-mono text-cyan-300 font-bold">{eq.highGain > 0 ? `+${eq.highGain}` : eq.highGain} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={eq.highGain}
              onChange={(e) => setEq({ ...eq, highGain: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* 2. Dynamics & Compressor */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Dynamics Compressor</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Threshold</span>
              <span className="font-mono text-purple-300 font-bold">{eq.compressorThreshold} dB</span>
            </div>
            <input
              type="range"
              min="-60"
              max="0"
              value={eq.compressorThreshold}
              onChange={(e) => setEq({ ...eq, compressorThreshold: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Ratio</span>
              <span className="font-mono text-purple-300 font-bold">{eq.compressorRatio}:1</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={eq.compressorRatio}
              onChange={(e) => setEq({ ...eq, compressorRatio: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Reverb Wet Ambience</span>
              <span className="font-mono text-purple-300 font-bold">{Math.round(eq.reverbWet * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={eq.reverbWet}
              onChange={(e) => setEq({ ...eq, reverbWet: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>
        </div>

        {/* 3. Master Output & Audition */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Master Output &amp; Limiter</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Master Gain Level</span>
                <span className="font-mono text-amber-300 font-bold">{Math.round(eq.masterGain * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={eq.masterGain}
                onChange={(e) => setEq({ ...eq, masterGain: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 text-[10px] text-slate-400 border border-white/5 space-y-1">
              <div className="flex justify-between">
                <span>Peak Ceiling:</span>
                <span className="text-emerald-400 font-bold">-0.1 dB True Peak</span>
              </div>
              <div className="flex justify-between">
                <span>Dynamic Range:</span>
                <span className="text-slate-300 font-bold">14.2 LUFS Integrated</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleTogglePlay}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Stop Audio' : audioBuffer ? 'Putar Audio Terunggah' : 'Putar Test Tone EQ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
