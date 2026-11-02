import React, { useState } from 'react';
import {
  Disc,
  Play,
  Pause,
  Plus,
  Trash2,
  Download,
  ListOrdered,
  Sparkles,
  Music,
  Share2,
} from 'lucide-react';

interface TrackItem {
  id: string;
  title: string;
  duration: string;
  seconds: number;
}

const INITIAL_TRACKS: TrackItem[] = [
  { id: 't1', title: '01. Fajar di Sirkuit Albert Park', duration: '03:15', seconds: 195 },
  { id: 't2', title: '02. Deru Mesin Scania R440', duration: '04:20', seconds: 260 },
  { id: 't3', title: '03. Melintasi Jembatan Baja FS22', duration: '03:45', seconds: 225 },
  { id: 't4', title: '04. Akrobatik di Atas Tanjakan', duration: '02:50', seconds: 170 },
  { id: 't5', title: '05. Senja Keemasan Kota Taiwan', duration: '04:10', seconds: 250 },
  { id: 't6', title: '06. Malam Tenang di Pelabuhan', duration: '03:30', seconds: 210 },
];

export const AlbumGenTool: React.FC = () => {
  const [albumTitle, setAlbumTitle] = useState('AUDIRA 3D SOUNDTRACK VOL. 1');
  const [artistName, setArtistName] = useState('Agus Dwi Rianto');
  const [tracks, setTracks] = useState<TrackItem[]>(INITIAL_TRACKS);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');

  const totalSeconds = tracks.reduce((acc, t) => acc + t.seconds, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSecs = totalSeconds % 60;

  const handleAddTrack = () => {
    if (!newTrackTitle.trim()) return;
    const newTrack: TrackItem = {
      id: `t_${Date.now()}`,
      title: `${tracks.length + 1 < 10 ? '0' : ''}${tracks.length + 1}. ${newTrackTitle}`,
      duration: '03:30',
      seconds: 210,
    };
    setTracks([...tracks, newTrack]);
    setNewTrackTitle('');
  };

  const handleRemoveTrack = (id: string) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  const handleTogglePlay = (idx: number) => {
    if (activeTrackIndex === idx && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveTrackIndex(idx);
      setIsPlaying(true);
    }
  };

  const handleExportCue = () => {
    let cue = `PERFORMER "${artistName}"\nTITLE "${albumTitle}"\nFILE "${albumTitle}.wav" WAVE\n`;
    tracks.forEach((t, i) => {
      cue += `  TRACK ${i + 1 < 10 ? '0' : ''}${i + 1} AUDIO\n    TITLE "${t.title}"\n    PERFORMER "${artistName}"\n`;
    });

    const blob = new Blob([cue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${albumTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.cue`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Disc className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">Album Gen &amp; Kompilasi Vinyl 3D</h3>
            <p className="text-[10px] text-slate-400">Penyusun album musik, pemutar piringan hitam interaktif &amp; master cue</p>
          </div>
        </div>

        <button
          onClick={handleExportCue}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(99,102,241,0.4)] active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor CUE &amp; Tracklist</span>
        </button>
      </div>

      {/* Main Container: Vinyl Turntable Animation & Tracklist */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 items-center justify-center">
        {/* Left: Turntable Vinyl 3D Animation */}
        <div className="w-full lg:w-80 p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          {/* Vinyl Disc Container */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Spinning Vinyl Record */}
            <div
              className={`w-48 h-48 rounded-full bg-[#0a0a0d] border-4 border-[#181822] shadow-[0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center relative ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
              style={{
                backgroundImage:
                  'repeating-radial-gradient(circle, #0e0e13 0, #0e0e13 2px, #050508 3px, #050508 4px)',
              }}
            >
              {/* Inner Center Label */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-amber-400/80 flex flex-col items-center justify-center text-center p-1 shadow-inner">
                <span className="text-[7px] font-black uppercase text-white tracking-tighter leading-none">
                  AUDIRA
                </span>
                <span className="text-[5px] text-amber-200 uppercase font-mono mt-0.5">33⅓ RPM</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0d] border border-white/40 mt-1" />
              </div>
            </div>

            {/* Tonearm Simulation */}
            <div
              className={`absolute top-2 right-2 w-2 h-20 bg-slate-400 origin-top rounded transition-transform duration-700 shadow-md ${
                isPlaying ? 'rotate-[32deg]' : 'rotate-0'
              }`}
            >
              <div className="w-3.5 h-5 bg-amber-400 rounded-sm absolute -bottom-1 -left-1 shadow" />
            </div>
          </div>

          {/* Album Title & Artist */}
          <div className="text-center w-full">
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="w-full text-center font-black text-sm text-slate-100 bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-400 focus:outline-none"
            />
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full text-center text-xs text-indigo-400 bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-400 focus:outline-none mt-0.5"
            />
          </div>

          {/* Stats Bar */}
          <div className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex justify-between text-[11px] font-mono text-slate-300">
            <span>Total Trek: <strong className="text-indigo-400">{tracks.length}</strong></span>
            <span>Durasi: <strong className="text-emerald-400">{totalMinutes}:{remainingSecs.toString().padStart(2, '0')}</strong></span>
          </div>
        </div>

        {/* Right: Tracklist Manager */}
        <div className="flex-1 flex flex-col gap-3 w-full h-full min-h-[300px]">
          {/* Add Track Input */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex gap-2">
            <input
              type="text"
              value={newTrackTitle}
              onChange={(e) => setNewTrackTitle(e.target.value)}
              placeholder="Tambahkan judul trek lagu baru..."
              className="flex-1 bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTrack()}
            />
            <button
              onClick={handleAddTrack}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Trek</span>
            </button>
          </div>

          {/* Tracks List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-white/10">
            {tracks.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => handleTogglePlay(idx)}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition cursor-pointer ${
                  activeTrackIndex === idx && isPlaying
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                    {activeTrackIndex === idx && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                  <span className="text-xs font-semibold truncate">{t.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-slate-400">{t.duration}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(t.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Hapus Trek"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
