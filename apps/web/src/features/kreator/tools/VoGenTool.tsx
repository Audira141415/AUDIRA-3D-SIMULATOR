import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Square,
  Sliders,
  Sparkles,
  Users,
  Plus,
  Trash2,
  Volume2,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface ScriptLine {
  id: string;
  actor: 'Narator' | 'Komentator' | 'Pengemudi';
  text: string;
}

export const VoGenTool: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);

  const [script, setScript] = useState<ScriptLine[]>([
    {
      id: 'l1',
      actor: 'Narator',
      text: 'Selamat datang di Audira 3D Simulator. Hari ini kita akan menguji ketangguhan truk Scania R440 di medan ekstrem.',
    },
    {
      id: 'l2',
      actor: 'Komentator',
      text: 'Lihat bagaimana suspensi kendaraan ini menahan guncangan saat mendarat dari tanjakan akrobatik!',
    },
    {
      id: 'l3',
      actor: 'Pengemudi',
      text: 'Tenaga mesin terasa sangat responsif, dan kendali kemudi di kecepatan tinggi tetap sangat stabil.',
    },
  ]);

  // Load available browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const avail = window.speechSynthesis.getVoices();
        setVoices(avail);
        // Find Indonesian voice if exists
        const idIdx = avail.findIndex((v) => v.lang.includes('id') || v.lang.includes('ID'));
        if (idIdx !== -1) setSelectedVoiceIndex(idIdx);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakLine = (index: number) => {
    if (index >= script.length) {
      setIsPlaying(false);
      setCurrentLineIndex(null);
      return;
    }

    setCurrentLineIndex(index);
    const line = script[index];
    const utterance = new SpeechSynthesisUtterance(line.text);

    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    // Modulate pitch slightly per actor
    let actPitch = pitch;
    if (line.actor === 'Komentator') actPitch *= 1.15;
    if (line.actor === 'Pengemudi') actPitch *= 0.9;

    utterance.pitch = Math.max(0.5, Math.min(2, actPitch));
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onend = () => {
      speakLine(index + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentLineIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentLineIndex(null);
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(true);
      speakLine(0);
    }
  };

  const handleAddLine = () => {
    const newLine: ScriptLine = {
      id: `line_${Date.now()}`,
      actor: 'Narator',
      text: 'Ketik naskah baru di sini...',
    };
    setScript([...script, newLine]);
  };

  const handleRemoveLine = (id: string) => {
    setScript(script.filter((l) => l.id !== id));
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">VO GEN — AI Voice Over &amp; Dialogue Director</h3>
            <p className="text-[10px] text-slate-400">Generator narasi suara Text-to-Speech multi-karakter dan naskah percakapan</p>
          </div>
        </div>

        <button
          onClick={handleTogglePlay}
          className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            isPlaying
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
              : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-[0_0_12px_rgba(20,184,166,0.4)]'
          }`}
        >
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'Hentikan VO' : 'Putar Naskah AI'}</span>
        </button>
      </div>

      {/* Main Grid: Voice Tuning Sidebar + Script Editor */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left: Voice Profile Tuning */}
        <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Karakter &amp; Profil Suara</span>
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Pilih Mesin Suara (TTS Engine)</label>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                {voices.length === 0 && <option value={0}>Memuat suara peramban...</option>}
                {voices.map((v, i) => (
                  <option key={i} value={i}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Kecepatan Suara (Rate)</span>
                <span className="font-mono text-teal-300 font-bold">{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Tinggi Nada (Pitch)</span>
                <span className="font-mono text-teal-300 font-bold">{pitch.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Volume</span>
                <span className="font-mono text-teal-300 font-bold">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded appearance-none cursor-pointer accent-teal-400"
              />
            </div>
          </div>
        </div>

        {/* Right: Multi-Actor Dialogue Script */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Naskah Percakapan ({script.length} Babak)</span>
            </span>
            <button
              onClick={handleAddLine}
              className="px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/35 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dialog</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {script.map((line, idx) => (
              <div
                key={line.id}
                className={`p-3 rounded-xl border transition-all ${
                  currentLineIndex === idx
                    ? 'bg-teal-950/40 border-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.3)] scale-[1.01]'
                    : 'bg-slate-900/80 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        line.actor === 'Narator'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : line.actor === 'Komentator'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {line.actor}
                    </span>
                    <select
                      value={line.actor}
                      onChange={(e) => {
                        const updated = [...script];
                        updated[idx].actor = e.target.value as any;
                        setScript(updated);
                      }}
                      className="bg-slate-950 text-[10px] text-slate-400 rounded px-1.5 py-0.5 border border-white/5 outline-none"
                    >
                      <option value="Narator">Narator</option>
                      <option value="Komentator">Komentator</option>
                      <option value="Pengemudi">Pengemudi</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleRemoveLine(line.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={line.text}
                  onChange={(e) => {
                    const updated = [...script];
                    updated[idx].text = e.target.value;
                    setScript(updated);
                  }}
                  className="w-full bg-slate-950/70 border border-white/5 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none leading-relaxed"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
