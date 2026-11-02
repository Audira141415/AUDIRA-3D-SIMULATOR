import { create } from 'zustand';

export interface FrameData {
  time: number;
  x: number;
  y: number;
  z: number;
  rotY: number;
  speed: number;
  brake: boolean;
  lights: boolean;
}

export interface ActivityLayer {
  id: string;
  vehicleId: string;
  vehicleName: string;
  modelUrl: string;
  color: string;
  duration: number;
  frames: FrameData[];
  muted: boolean;
  solo: boolean;
}

interface MultiLayerRecordState {
  isOpen: boolean;
  layers: ActivityLayer[];
  isRecording: boolean;
  recordingLayerId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  playbackTime: number;
  maxDuration: number;
  loopPlayback: boolean;
  cameraFollow: boolean;
  focusedLayerId: string | null;

  // Actions
  toggleOpen: (open?: boolean) => void;
  createLayer: (vehicle: { id: string; name: string; modelUrl?: string; color?: string }) => string;
  startRecording: (layerId: string) => void;
  stopRecording: () => void;
  appendFrame: (frame: FrameData) => void;
  startPlayback: () => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  seekPlayback: (time: number) => void;
  advancePlayback: (delta: number) => void;
  toggleMute: (layerId: string) => void;
  deleteLayer: (layerId: string) => void;
  clearAllLayers: () => void;
  setLoopPlayback: (loop: boolean) => void;
  setCameraFollow: (follow: boolean) => void;
  setFocusedLayerId: (id: string | null) => void;
}

export const useMultiLayerRecordStore = create<MultiLayerRecordState>((set, get) => ({
  isOpen: false,
  layers: [],
  isRecording: false,
  recordingLayerId: null,
  isPlaying: false,
  isPaused: false,
  playbackTime: 0,
  maxDuration: 0,
  loopPlayback: true,
  cameraFollow: true,
  focusedLayerId: null,

  toggleOpen: (open) => set((s) => ({ isOpen: open !== undefined ? open : !s.isOpen })),

  createLayer: (vehicle) => {
    const id = `layer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newLayer: ActivityLayer = {
      id,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      modelUrl: vehicle.modelUrl || '/models/scania.glb',
      color: vehicle.color || '#00d2ff',
      duration: 0,
      frames: [],
      muted: false,
      solo: false,
    };
    set((s) => ({
      layers: [...s.layers, newLayer],
      focusedLayerId: s.focusedLayerId || id,
    }));
    return id;
  },

  startRecording: (layerId) => {
    // Reset frames for this layer
    set((s) => ({
      isRecording: true,
      recordingLayerId: layerId,
      isPlaying: true, // Also play existing other layers simultaneously as ghosts!
      isPaused: false,
      playbackTime: 0,
      layers: s.layers.map((l) => (l.id === layerId ? { ...l, frames: [], duration: 0 } : l)),
      focusedLayerId: layerId,
    }));
  },

  stopRecording: () => {
    const { recordingLayerId, layers } = get();
    if (recordingLayerId) {
      const target = layers.find((l) => l.id === recordingLayerId);
      const dur = target && target.frames.length > 0 ? target.frames[target.frames.length - 1].time : 0;
      set((s) => {
        const updated = s.layers.map((l) => (l.id === recordingLayerId ? { ...l, duration: dur } : l));
        const newMax = Math.max(...updated.map((l) => l.duration), 0);
        return {
          isRecording: false,
          recordingLayerId: null,
          layers: updated,
          maxDuration: newMax,
        };
      });
    } else {
      set({ isRecording: false, recordingLayerId: null });
    }
  },

  appendFrame: (frame) => {
    const { isRecording, recordingLayerId } = get();
    if (!isRecording || !recordingLayerId) return;

    set((s) => {
      const updatedLayers = s.layers.map((l) => {
        if (l.id === recordingLayerId) {
          return {
            ...l,
            duration: frame.time,
            frames: [...l.frames, frame],
          };
        }
        return l;
      });
      const newMax = Math.max(...updatedLayers.map((l) => l.duration), s.maxDuration);
      return {
        layers: updatedLayers,
        playbackTime: frame.time,
        maxDuration: newMax,
      };
    });
  },

  startPlayback: () => set({ isPlaying: true, isPaused: false }),
  pausePlayback: () => set({ isPaused: true }),
  stopPlayback: () => set({ isPlaying: false, isPaused: false, playbackTime: 0 }),
  seekPlayback: (time) => set({ playbackTime: Math.max(0, time) }),

  advancePlayback: (delta) => {
    const { isPlaying, isPaused, playbackTime, maxDuration, loopPlayback, isRecording } = get();
    if (!isPlaying || isPaused) return;

    // During recording, playbackTime is driven by appendFrame
    if (isRecording) return;

    if (maxDuration <= 0) return;

    let nextTime = playbackTime + delta;
    if (nextTime >= maxDuration) {
      if (loopPlayback) {
        nextTime = 0;
      } else {
        nextTime = maxDuration;
        set({ isPlaying: false });
      }
    }
    set({ playbackTime: nextTime });
  },

  toggleMute: (layerId) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === layerId ? { ...l, muted: !l.muted } : l)),
    })),

  deleteLayer: (layerId) =>
    set((s) => {
      const filtered = s.layers.filter((l) => l.id !== layerId);
      return {
        layers: filtered,
        maxDuration: Math.max(...filtered.map((l) => l.duration), 0),
        focusedLayerId: s.focusedLayerId === layerId ? filtered[0]?.id || null : s.focusedLayerId,
      };
    }),

  clearAllLayers: () =>
    set({
      layers: [],
      isRecording: false,
      recordingLayerId: null,
      isPlaying: false,
      playbackTime: 0,
      maxDuration: 0,
    }),

  setLoopPlayback: (loopPlayback) => set({ loopPlayback }),
  setCameraFollow: (cameraFollow) => set({ cameraFollow }),
  setFocusedLayerId: (focusedLayerId) => set({ focusedLayerId }),
}));

