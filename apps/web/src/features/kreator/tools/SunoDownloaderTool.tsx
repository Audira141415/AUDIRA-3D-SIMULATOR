import React, { useState } from 'react';
import {
  Download,
  Link,
  Music,
  Video,
  Play,
  Pause,
  Send,
  Sparkles,
  ExternalLink,
  Check,
  Disc,
} from 'lucide-react';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

interface ParsedSunoSong {
  id: string;
  title: string;
  tags: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
  videoUrl: string;
}

const SAMPLE_SUNO_PRESETS: ParsedSunoSong[] = [
  {
    id: 'suno-audira-01',
    title: 'Neon Asphalt Drifter',
    tags: 'Synthwave, Eurobeat, Fast BPM, Electric Guitar Solo, Tokyo Night',
    duration: '02:45',
    coverUrl: '/home-hero.jpg',
    audioUrl: 'https://actions.google.com/sounds/v1/sports/car_accelerating_away.ogg',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 'suno-audira-02',
    title: 'Heavy Diesel Engine Anthem',
    tags: 'Industrial Rock, Scania Trucker, Heavy Bass, Powerful Male Vocals',
    duration: '03:12',
    coverUrl: '/home-hero.jpg',
    audioUrl: 'https://actions.google.com/sounds/v1/transportation/truck_horn.ogg',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

export const SunoDownloaderTool: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [currentSong, setCurrentSong] = useState<ParsedSunoSong>(SAMPLE_SUNO_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const setActiveTool = useKreatorStudioStore((s) => s.setActiveTool);
  const setSharedAudio = useKreatorStudioStore((s) => s.setSharedAudio);

  const handleParseUrl = () => {
    if (!inputUrl.trim()) return;
    // Extract ID or create entry
    const id = inputUrl.split('/').pop() || 'custom-suno-track';
    setCurrentSong({
      id,
      title: 'Suno AI Generated Masterpiece',
      tags: 'Electronic, Cinematic Future, Uplifting Vocals, High Energy',
      duration: '02:50',
      coverUrl: '/home-hero.jpg',
      audioUrl: 'https://actions.google.com/sounds/v1/sports/car_accelerating_away.ogg',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    });
  };

  const handleSendToAudio = () => {
    setSharedAudio(currentSong.audioUrl, currentSong.title);
    setActiveTool('audio');
  };

  const handleSendToVideo = () => {
    setSharedAudio(currentSong.audioUrl, currentSong.title);
    setActiveTool('video-editor');
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Search Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex-1 w-full relative">
          <Link className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Tempel tautan lagu Suno (contoh: https://suno.com/song/b82f0...)..."
            className="w-full bg-slate-950/80 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-400 transition font-sans"
          />
        </div>
        <button
          onClick={handleParseUrl}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center justify-center gap-1.5 transition shadow-[0_0_12px_rgba(244,63,94,0.4)] shrink-0 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ambil Lagu Suno</span>
        </button>
      </div>

      {/* Main Track Card */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 items-center justify-center">
        {/* Cover Art & Player */}
        <div className="w-full lg:w-80 p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col items-center gap-3">
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
            <img src={currentSong.coverUrl} alt="Cover" className="w-full h-full object-cover" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg transition transform group-hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="text-center w-full">
            <h3 className="font-bold text-sm text-slate-200 truncate">{currentSong.title}</h3>
            <p className="text-[10px] text-rose-400 font-mono mt-0.5">Suno AI V3.5 · Durasi {currentSong.duration}</p>
          </div>

          <div className="w-full p-2 rounded-lg bg-slate-950/70 border border-white/5 text-[10px] font-mono text-slate-400 text-center">
            {currentSong.tags}
          </div>
        </div>

        {/* Download & Studio Integration Actions */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          {/* Download Options */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Opsi Pengunduhan Berkas</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={currentSong.audioUrl}
                download={`${currentSong.title}.mp3`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Unduh Audio MP3</div>
                    <div className="text-[10px] text-slate-400 font-normal">Kualitas 320 kbps High</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-blue-400 group-hover:translate-y-0.5 transition" />
              </a>

              <a
                href={currentSong.videoUrl}
                download={`${currentSong.title}.mp4`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Unduh Video MP4</div>
                    <div className="text-[10px] text-slate-400 font-normal">Visualizer 1080p HD</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-purple-400 group-hover:translate-y-0.5 transition" />
              </a>
            </div>
          </div>

          {/* Quick Bridge to Other Studio Tools */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kirim ke Alat Produksi Lainnya</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSendToAudio}
                className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Olah di Audio Editor (EQ &amp; DSP)</span>
              </button>

              <button
                onClick={handleSendToVideo}
                className="p-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pasang di Video Editor (Timeline)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
