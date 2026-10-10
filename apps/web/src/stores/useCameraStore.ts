import { create } from 'zustand';
import { CameraPreset, Vector3D } from '@audira/shared';

interface CameraState {
  preset: CameraPreset;
  focusTarget: Vector3D | null;
  cameraHeading: number; // yaw angle in radians
  zoomAction: { type: 'in' | 'out'; timestamp: number } | null;
  resetTrigger: number;
  panDelta: { dx: number; dz: number; timestamp: number } | null;

  setPreset: (preset: CameraPreset) => void;
  setFocusTarget: (target: Vector3D | null) => void;
  setCameraHeading: (heading: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  panView: (dx: number, dz: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  preset: 'isometric',
  focusTarget: null,
  cameraHeading: 0,
  zoomAction: null,
  resetTrigger: 0,
  panDelta: null,

  setPreset: (preset) => set({ preset }),
  setFocusTarget: (target) => set({ focusTarget: target }),
  setCameraHeading: (heading) => set({ cameraHeading: heading }),
  zoomIn: () => set({ zoomAction: { type: 'in', timestamp: Date.now() } }),
  zoomOut: () => set({ zoomAction: { type: 'out', timestamp: Date.now() } }),
  resetView: () =>
    set((state) => ({
      preset: 'isometric',
      resetTrigger: state.resetTrigger + 1,
      focusTarget: { x: 0, y: 0, z: 0 },
    })),
  panView: (dx, dz) => set({ panDelta: { dx, dz, timestamp: Date.now() } }),
}));
