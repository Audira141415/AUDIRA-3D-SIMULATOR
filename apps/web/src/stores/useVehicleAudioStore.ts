import { create } from 'zustand';

export type EngineProfile = 'truck' | 'sport' | 'sedan' | 'supercar' | 'tractor' | 'plane';

export type CameraPillMode =
  | 'off'
  | 'chase'
  | '3p-orbit'
  | 'orbit'
  | 'ikuti'
  | 'flow'
  | 'cinematic'
  | 'tracking'
  | 'drone'
  | 'cockpit'
  | 'director';

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration: number; // in seconds
  isCustom?: boolean;
}

// Built-in synthetic/lo-fi tracks for immediate out-of-the-box playback
const DEFAULT_PLAYLIST: MusicTrack[] = [
  {
    id: 'track-mardua-holong',
    title: 'Mardua Holong (Chill Mix)',
    artist: 'BangPay Radio',
    url: '', // Synthesized or user-uploaded
    duration: 298, // 4:58
  },
  {
    id: 'track-synthwave-highway',
    title: 'Neon Highway Drive',
    artist: 'Audira Synth',
    url: '',
    duration: 215, // 3:35
  },
  {
    id: 'track-lofi-sunset',
    title: 'Sunset Construction Lo-Fi',
    artist: 'Audira Beats',
    url: '',
    duration: 180, // 3:00
  },
];

interface VehicleAudioState {
  // Modal visibility
  isAudioModalOpen: boolean;
  openAudioModal: () => void;
  closeAudioModal: () => void;
  toggleAudioModal: () => void;

  // Engine profile
  engineProfile: EngineProfile;
  setEngineProfile: (profile: EngineProfile) => void;

  // Custom audio files
  customEngineUrl: string | null;
  customEngineFileName: string | null;
  customHornUrl: string | null;
  customHornFileName: string | null;
  setCustomEngineFile: (url: string | null, name: string | null) => void;
  setCustomHornFile: (url: string | null, name: string | null) => void;

  // Audio Mixer Channels (volume: 0 - 100, muted: boolean)
  engineVolume: number;
  engineMuted: boolean;
  setEngineVolume: (vol: number) => void;
  toggleEngineMute: () => void;

  hornVolume: number;
  hornMuted: boolean;
  setHornVolume: (vol: number) => void;
  toggleHornMute: () => void;

  brakeVolume: number;
  brakeMuted: boolean;
  setBrakeVolume: (vol: number) => void;
  toggleBrakeMute: () => void;

  musicVolume: number;
  musicMuted: boolean;
  setMusicVolume: (vol: number) => void;
  toggleMusicMute: () => void;

  ambientVolume: number;
  ambientMuted: boolean;
  setAmbientVolume: (vol: number) => void;
  toggleAmbientMute: () => void;

  blinkerVolume: number;
  blinkerMuted: boolean;
  setBlinkerVolume: (vol: number) => void;
  toggleBlinkerMute: () => void;

  // Music Player
  playlist: MusicTrack[];
  currentTrackIndex: number;
  isPlayingMusic: boolean;
  currentTime: number;
  addCustomTrack: (track: MusicTrack) => void;
  removeTrack: (id: string) => void;
  setIsPlayingMusic: (playing: boolean) => void;
  togglePlayMusic: () => void;
  stopMusic: () => void;
  nextTrack: () => void;
  setCurrentTime: (time: number) => void;

  // Vehicle Quick Controls
  headlights: boolean;
  toggleHeadlights: () => void;
  highBeam: boolean;
  toggleHighBeam: () => void;
  blinkerLeft: boolean;
  toggleBlinkerLeft: () => void;
  blinkerRight: boolean;
  toggleBlinkerRight: () => void;

  // Camera Mode Pills & OBS
  cameraModePill: CameraPillMode;
  setCameraModePill: (mode: CameraPillMode) => void;
  isObsMode: boolean;
  toggleObsMode: () => void;
  setObsMode: (val: boolean) => void;

  // Graphics Quality
  graphicsQuality: 'low' | 'medium' | 'high';
  setGraphicsQuality: (q: 'low' | 'medium' | 'high') => void;

  // Turbo Nitro Boost
  nitro: number;
  setNitro: (n: number) => void;
  isNitroActive: boolean;
  setIsNitroActive: (val: boolean) => void;
}

export const useVehicleAudioStore = create<VehicleAudioState>((set, get) => ({
  nitro: 100,
  setNitro: (nitro) => set({ nitro: Math.max(0, Math.min(100, nitro)) }),
  isNitroActive: false,
  setIsNitroActive: (isNitroActive) => set({ isNitroActive }),
  isAudioModalOpen: false,
  openAudioModal: () => set({ isAudioModalOpen: true }),
  closeAudioModal: () => set({ isAudioModalOpen: false }),
  toggleAudioModal: () => set((s) => ({ isAudioModalOpen: !s.isAudioModalOpen })),

  engineProfile: 'truck',
  setEngineProfile: (profile) => set({ engineProfile: profile }),

  customEngineUrl: null,
  customEngineFileName: null,
  customHornUrl: null,
  customHornFileName: null,
  setCustomEngineFile: (url, name) => set({ customEngineUrl: url, customEngineFileName: name }),
  setCustomHornFile: (url, name) => set({ customHornUrl: url, customHornFileName: name }),

  // Initial mixer levels matching image
  engineVolume: 69,
  engineMuted: false,
  setEngineVolume: (vol) => set({ engineVolume: vol }),
  toggleEngineMute: () => set((s) => ({ engineMuted: !s.engineMuted })),

  hornVolume: 96,
  hornMuted: false,
  setHornVolume: (vol) => set({ hornVolume: vol }),
  toggleHornMute: () => set((s) => ({ hornMuted: !s.hornMuted })),

  brakeVolume: 93,
  brakeMuted: false,
  setBrakeVolume: (vol) => set({ brakeVolume: vol }),
  toggleBrakeMute: () => set((s) => ({ brakeMuted: !s.brakeMuted })),

  musicVolume: 24,
  musicMuted: false,
  setMusicVolume: (vol) => set({ musicVolume: vol }),
  toggleMusicMute: () => set((s) => ({ musicMuted: !s.musicMuted })),

  ambientVolume: 40,
  ambientMuted: true,
  setAmbientVolume: (vol) => set({ ambientVolume: vol }),
  toggleAmbientMute: () => set((s) => ({ ambientMuted: !s.ambientMuted })),

  blinkerVolume: 60,
  blinkerMuted: false,
  setBlinkerVolume: (vol) => set({ blinkerVolume: vol }),
  toggleBlinkerMute: () => set((s) => ({ blinkerMuted: !s.blinkerMuted })),

  // Music Player
  playlist: DEFAULT_PLAYLIST,
  currentTrackIndex: 0,
  isPlayingMusic: false,
  currentTime: 13, // 0:13 default preview
  addCustomTrack: (track) => set((s) => ({ playlist: [...s.playlist, track] })),
  removeTrack: (id) =>
    set((s) => ({
      playlist: s.playlist.filter((t) => t.id !== id),
      currentTrackIndex: 0,
    })),
  setIsPlayingMusic: (playing) => set({ isPlayingMusic: playing }),
  togglePlayMusic: () => set((s) => ({ isPlayingMusic: !s.isPlayingMusic })),
  stopMusic: () => set({ isPlayingMusic: false, currentTime: 0 }),
  nextTrack: () =>
    set((s) => ({
      currentTrackIndex: (s.currentTrackIndex + 1) % s.playlist.length,
      currentTime: 0,
      isPlayingMusic: true,
    })),
  setCurrentTime: (time) => set({ currentTime: time }),

  // Vehicle Quick Controls
  headlights: false,
  toggleHeadlights: () => set((s) => ({ headlights: !s.headlights })),
  highBeam: false,
  toggleHighBeam: () => set((s) => ({ highBeam: !s.highBeam })),
  blinkerLeft: false,
  toggleBlinkerLeft: () =>
    set((s) => ({ blinkerLeft: !s.blinkerLeft, blinkerRight: false })),
  blinkerRight: false,
  toggleBlinkerRight: () =>
    set((s) => ({ blinkerRight: !s.blinkerRight, blinkerLeft: false })),

  // Camera Mode Pills & OBS
  cameraModePill: 'chase',
  setCameraModePill: (mode) => set({ cameraModePill: mode }),
  isObsMode: false,
  toggleObsMode: () => set((s) => ({ isObsMode: !s.isObsMode })),
  setObsMode: (val) => set({ isObsMode: val }),

  graphicsQuality: 'medium',
  setGraphicsQuality: (q) => set({ graphicsQuality: q }),
}));
