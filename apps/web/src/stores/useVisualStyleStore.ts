import { create } from 'zustand';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '21:9';
export type VisualFilterType = 'default' | 'golden-sunset' | 'cyberpunk-neon' | 'moody-fog' | 'retro-sepia';

interface VisualStyleState {
  isOpen: boolean;
  slowmoActive: boolean;
  slowmoSpeed: number; // e.g. 0.25
  aspectRatio: AspectRatioType;
  visualFilter: VisualFilterType;
  showAspectRatioOverlay: boolean;

  // Actions
  toggleOpen: (open?: boolean) => void;
  toggleSlowmo: () => void;
  setSlowmoSpeed: (speed: number) => void;
  setAspectRatio: (ratio: AspectRatioType) => void;
  setVisualFilter: (filter: VisualFilterType) => void;
  toggleAspectRatioOverlay: (show?: boolean) => void;
}

export const useVisualStyleStore = create<VisualStyleState>((set) => ({
  isOpen: false,
  slowmoActive: false,
  slowmoSpeed: 0.25,
  aspectRatio: '16:9',
  visualFilter: 'default',
  showAspectRatioOverlay: false,

  toggleOpen: (open) => set((s) => ({ isOpen: open !== undefined ? open : !s.isOpen })),
  toggleSlowmo: () => set((s) => ({ slowmoActive: !s.slowmoActive })),
  setSlowmoSpeed: (slowmoSpeed) => set({ slowmoSpeed }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio, showAspectRatioOverlay: true }),
  setVisualFilter: (visualFilter) => set({ visualFilter }),
  toggleAspectRatioOverlay: (show) =>
    set((s) => ({ showAspectRatioOverlay: show !== undefined ? show : !s.showAspectRatioOverlay })),
}));

