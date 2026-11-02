import React, { useState } from 'react';
import {
  Music,
  Sparkles,
  Play,
  Square,
  Copy,
  Check,
  Send,
  Sliders,
  Volume2,
  RefreshCw,
  FileText,
  ListMusic,
} from 'lucide-react';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

const GENRES = [
  { id: 'pop', label: 'Indonesian Pop', bpm: 110, key: 'C Major', mood: 'Ceria & Catchy' },
  { id: 'koplo', label: 'Dangdut Koplo Modern', bpm: 138, key: 'A Minor', mood: 'Goyang Asyik' },
  { id: 'lofi', label: 'Lo-Fi Chill Hop', bpm: 82, key: 'F Major', mood: 'Santai & Tenang' },
  { id: 'rock', label: 'Pop Rock Alternatif', bpm: 128, key: 'E Minor', mood: 'Bertenaga & Emosional' },
  { id: 'edm', label: 'EDM Synthwave', bpm: 126, key: 'D Minor', mood: 'Elektronik Masa Depan' },
  { id: 'religi', label: 'Akustik Religi / Nasyid', bpm: 95, key: 'G Major', mood: 'Menyentuh Hati' },
  { id: 'cinematic', label: 'Cinematic Trailer', bpm: 90, key: 'D Minor', mood: 'Epik Menggelegar' },
];

const CHORD_PROGRESSIONS: Record<string, string[]> = {
  pop: ['C', 'G', 'Am', 'F'],
  koplo: ['Am', 'Dm', 'G', 'C', 'F', 'Bdim', 'E'],
  lofi: ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
  rock: ['Em', 'C', 'G', 'D'],
  edm: ['Dm', 'Bb', 'F', 'C'],
  religi: ['G', 'D', 'Em', 'C', 'G', 'D', 'G'],
  cinematic: ['Dm', 'F', 'C', 'G'],
};

const CHORD_FREQS: Record<string, number[]> = {
  C: [261.63, 329.63, 392.0],
  G: [196.0, 246.94, 293.66],
  Am: [220.0, 261.63, 329.63],
  F: [174.61, 220.0, 261.63],
  Dm: [146.83, 220.0, 261.63],
  Bb: [233.08, 293.66, 349.23],
  Em: [164.81, 196.0, 246.94],
  D: [146.83, 220.0, 293.66],
  Fmaj7: [174.61, 220.0, 261.63, 329.63],
  Em7: [164.81, 196.0, 246.94, 293.66],
  Dm7: [146.83, 174.61, 220.0, 261.63],
  Cmaj7: [261.63, 329.63, 392.0, 493.88],
  Bdim: [246.94, 293.66, 349.23],
  E: [164.81, 207.65, 246.94],
};

export const SongmakerTool: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [bpm, setBpm] = useState(110);
  const [topic, setTopic] = useState('Perjuangan membangun masa depan dan simulator 3D');
  const [lyrics, setLyrics] = useState(`[Verse 1]
Langkah kaki melangkah di tanah harapan
Setiap detik merangkai karya impian
Di balik layar dunia tercipta
Gagah berdiri kota bercahaya

[Chorus]
Terus melaju, takkan pernah ragu
Membangun mimpi bersama waktu
Suara mesin berbisik lantang
Masa depan kini kita genggam!

[Verse 2]
Roda berputar menyusuri jalanan
Menembus batas semua rintangan
Kita arsitek zaman modern
Karya ini abadi selamanya

[Outro]
Melangkah pasti, dunia kita bangun hari ini.`);

  const [isPlayingProgression, setIsPlayingProgression] = useState(false);
  const [activeChordIndex, setActiveChordIndex] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const setActiveTool = useKreatorStudioStore((s) => s.setActiveTool);
  const setSharedAudio = useKreatorStudioStore((s) => s.setSharedAudio);

  // Play a single chord using Web Audio API synthesized harmonics
  const playChordNotes = (notes: number[]) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Play entire chord progression
  const handleTogglePlayProgression = () => {
    if (isPlayingProgression) {
      setIsPlayingProgression(false);
      setActiveChordIndex(null);
      return;
    }

    setIsPlayingProgression(true);
    const chords = CHORD_PROGRESSIONS[selectedGenre.id] || CHORD_PROGRESSIONS.pop;
    const intervalMs = (60 / bpm) * 1000 * 2; // 2 beats per chord

    let step = 0;
    const playStep = () => {
      if (step >= chords.length) step = 0;
      setActiveChordIndex(step);
      const chordName = chords[step];
      const freqs = CHORD_FREQS[chordName] || [261.63, 329.63, 392.0];
      playChordNotes(freqs);
      step++;
    };

    playStep();
    const interval = setInterval(() => {
      playStep();
    }, intervalMs);

    setTimeout(() => {
      clearInterval(interval);
      setIsPlayingProgression(false);
      setActiveChordIndex(null);
    }, intervalMs * chords.length * 2);
  };

  // Generate lyrics with AI Template
  const handleGenerateLyrics = () => {
    const templates = [
      `[Verse 1]\nDari titik nol di atas tanah datar\nSebuah mimpi mulai kita pugar\nMesin traktor bersuara di kejauhan\nMenyambut fajar penuh harapan\n\n[Chorus]\nBangun dunia ini bersama!\nTiada kata lelah di dalam jiwa\nDari pondasi hingga mahkota\nInilah mahakarya cinta kita!\n\n[Bridge]\nKetika senja menyapa langit keemasan\nSemua jerih payah terbayar tuntas kawan\n\n[Outro]\nTetap melaju, takkan henti.`,
    ];
    setLyrics(templates[0]);
  };

  // Suno / Udio AI Prompt string
  const aiPrompt = `[Genre: ${selectedGenre.label}], [BPM: ${bpm}], [Mood: ${selectedGenre.mood}], [Key: ${selectedGenre.key}], [Instruments: Electric Guitar, Synth Arp, Acoustic Drums, Vocal Harmonies], [Structure: Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro]`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt + '\n\n' + lyrics);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSendToAudioEditor = () => {
    setSharedAudio('/assets/sample-song.mp3', `${selectedGenre.label} - Track 01`);
    setActiveTool('audio');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto text-slate-100">
      {/* Left Column: Style, Chords & Settings */}
      <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
        {/* Genre Selector */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
          <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2.5">
            <Music className="w-3.5 h-3.5" />
            <span>Pilih Genre &amp; Karakter</span>
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setSelectedGenre(g);
                  setBpm(g.bpm);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedGenre.id === g.id
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800/60 border border-white/5'
                }`}
              >
                <div>
                  <div className="font-bold">{g.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{g.mood}</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                  {g.bpm} BPM
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* BPM & Key Tuning */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Tempo (BPM):</span>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {bpm}
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
            <span className="text-slate-300 font-medium">Nada Dasar:</span>
            <span className="font-mono font-bold text-amber-400">{selectedGenre.key}</span>
          </div>
        </div>

        {/* Chord Progression Interactive Visualizer */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ListMusic className="w-3.5 h-3.5" />
              <span>Progresi Akor ({selectedGenre.id})</span>
            </span>
            <button
              onClick={handleTogglePlayProgression}
              className={`p-1.5 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                isPlayingProgression
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
              }`}
            >
              {isPlayingProgression ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlayingProgression ? 'Stop' : 'Play Akor'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {(CHORD_PROGRESSIONS[selectedGenre.id] || CHORD_PROGRESSIONS.pop).map((chord, i) => (
              <button
                key={i}
                onClick={() => playChordNotes(CHORD_FREQS[chord] || [261.63, 329.63, 392.0])}
                className={`flex-1 min-w-[44px] py-2 rounded-lg font-mono font-black text-center text-xs transition-all border ${
                  activeChordIndex === i
                    ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
                    : 'bg-slate-950/70 text-slate-200 border-white/10 hover:border-amber-400/50 hover:bg-slate-800'
                }`}
                title="Klik untuk bunyikan akor ini"
              >
                {chord}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <button
          onClick={handleSendToAudioEditor}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 border border-blue-400/50 text-blue-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Buka di Audio Editor (Mixing)</span>
        </button>
      </div>

      {/* Right Column: AI Lyricist & Suno/Udio Prompter */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Topic Input & Generate Button */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ketik tema lagu (contoh: Membangun kota impian bersama sahabat)..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            />
          </div>
          <button
            onClick={handleGenerateLyrics}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] shrink-0 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Lirik</span>
          </button>
        </div>

        {/* Lyrics Editor Area */}
        <div className="flex-1 min-h-[260px] p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Struktur Lirik Lagu</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {lyrics.split('\n').filter((l) => l.trim().length > 0).length} baris
            </span>
          </div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="flex-1 w-full bg-slate-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            placeholder="Tulis atau hasilkan lirik lagu Anda di sini..."
          />
        </div>

        {/* AI Generator Prompt Card for Suno / Udio */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Siap Pakai Suno &amp; Udio AI</span>
            </span>
            <button
              onClick={handleCopyPrompt}
              className="px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-[10px] font-bold flex items-center gap-1 transition-all"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt & Lirik'}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-white/5 text-[11px] font-mono text-purple-300/90 leading-relaxed overflow-x-auto select-all">
            {aiPrompt}
          </div>
        </div>
      </div>
    </div>
  );
};
