import { create } from 'zustand';

export type KreatorToolId =
  | 'songmaker'
  | 'video-editor'
  | 'audio'
  | 'murotal'
  | 'metadata'
  | 'suno-downloader'
  | 'album-gen'
  | 'smart-yt'
  | 'vo-gen'
  | 'ai-bang-pay';

export interface KreatorToolMeta {
  id: KreatorToolId;
  label: string;
  badge?: string;
  tagline: string;
  category: 'music' | 'video' | 'audio' | 'quran' | 'ai' | 'youtube';
  color: string;
}

export const KREATOR_TOOLS: KreatorToolMeta[] = [
  {
    id: 'songmaker',
    label: 'Song Maker',
    badge: 'AI LYRIC',
    tagline: 'Lirik lagu, progresi akor & aransemen instan',
    category: 'music',
    color: '#3b82f6',
  },
  {
    id: 'video-editor',
    label: 'Video Editor',
    badge: '16:9 & 9:16',
    tagline: 'Timeline multi-track, spectrum audio & teks animasi',
    category: 'video',
    color: '#06b6d4',
  },
  {
    id: 'audio',
    label: 'Audio Editor',
    badge: 'MASTER DSP',
    tagline: 'Mixing, parametric EQ, compressor & spectrum FFT',
    category: 'audio',
    color: '#8b5cf6',
  },
  {
    id: 'murotal',
    label: 'Murotal Quran',
    badge: 'ARABIC KHAT',
    tagline: 'Caption ayat Arab otomatis, terjemah & audio qari',
    category: 'quran',
    color: '#10b981',
  },
  {
    id: 'metadata',
    label: 'Metadata Editor',
    badge: 'ID3v2 TAG',
    tagline: 'Inspeksi & edit tag audio, artis, album & artwork',
    category: 'audio',
    color: '#f59e0b',
  },
  {
    id: 'suno-downloader',
    label: 'Suno Downloader',
    badge: 'MP3 / MP4',
    tagline: 'Ekstrak & unduh lagu Suno AI langsung dari tautan',
    category: 'music',
    color: '#f43f5e',
  },
  {
    id: 'album-gen',
    label: 'Album Gen',
    badge: 'VINYL 3D',
    tagline: 'Susun kompilasi lagu, cover art & piringan hitam',
    category: 'music',
    color: '#6366f1',
  },
  {
    id: 'smart-yt',
    label: 'Smart YT',
    badge: 'SEO OPTIMIZE',
    tagline: 'Judul viral CTR tinggi, tag YouTube & deskripsi',
    category: 'youtube',
    color: '#ef4444',
  },
  {
    id: 'vo-gen',
    label: 'VO GEN',
    badge: 'AI VOICE',
    tagline: 'Voice over AI multi-bahasa, script naskah percakapan',
    category: 'audio',
    color: '#14b8a6',
  },
  {
    id: 'ai-bang-pay',
    label: 'AI Studio',
    badge: 'IMAGE & 3D',
    tagline: 'Prompt lab AI gambar/video & transfer langsung ke 3D',
    category: 'ai',
    color: '#a855f7',
  },
];

interface KreatorStudioState {
  isOpen: boolean;
  activeTool: KreatorToolId;
  openStudio: (toolId?: KreatorToolId) => void;
  closeStudio: () => void;
  setActiveTool: (toolId: KreatorToolId) => void;

  // Cross-tool data passing (e.g. from Suno Downloader to Audio/Video Editor, or from AI Studio to 3D Forge)
  sharedAudioUrl: string | null;
  sharedAudioTitle: string | null;
  setSharedAudio: (url: string | null, title?: string | null) => void;

  sharedVideoSource: string | null;
  setSharedVideoSource: (src: string | null) => void;

  sharedAiPrompt: string;
  setSharedAiPrompt: (prompt: string) => void;
}

export const useKreatorStudioStore = create<KreatorStudioState>((set) => ({
  isOpen: false,
  activeTool: 'songmaker',
  openStudio: (toolId) =>
    set((state) => ({
      isOpen: true,
      activeTool: toolId || state.activeTool,
    })),
  closeStudio: () => set({ isOpen: false }),
  setActiveTool: (toolId) => set({ activeTool: toolId }),

  sharedAudioUrl: null,
  sharedAudioTitle: null,
  setSharedAudio: (url, title = null) => set({ sharedAudioUrl: url, sharedAudioTitle: title }),

  sharedVideoSource: null,
  setSharedVideoSource: (src) => set({ sharedVideoSource: src }),

  sharedAiPrompt: '',
  setSharedAiPrompt: (prompt) => set({ sharedAiPrompt: prompt }),
}));
