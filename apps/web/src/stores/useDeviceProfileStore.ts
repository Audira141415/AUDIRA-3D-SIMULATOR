import { create } from 'zustand';

export type GraphicQuality = 'low' | 'medium' | 'high';

interface DeviceProfileState {
  quality: GraphicQuality;
  pixelRatio: number;
  enableShadows: boolean;
  enableAntialias: boolean;
  setQuality: (quality: GraphicQuality) => void;
  cycleQuality: () => void;
}

export const useDeviceProfileStore = create<DeviceProfileState>((set, get) => ({
  quality: 'high',
  pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
  enableShadows: true,
  enableAntialias: true,

  setQuality: (quality) => {
    let pr = 1.0;
    let shadows = false;
    let antialias = false;

    if (quality === 'low') {
      pr = 1.0;
      shadows = false;
      antialias = false;
    } else if (quality === 'medium') {
      pr = 1.25;
      shadows = true;
      antialias = true;
    } else {
      pr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1.5;
      shadows = true;
      antialias = true;
    }

    set({ quality, pixelRatio: pr, enableShadows: shadows, enableAntialias: antialias });
  },

  cycleQuality: () => {
    const current = get().quality;
    const next: GraphicQuality = current === 'low' ? 'medium' : current === 'medium' ? 'high' : 'low';
    get().setQuality(next);
  },
}));

