import { create } from 'zustand';
import { CameraPreset, Vector3D } from '@audira/shared';

export type CameraTrackingAngle =
  | 'free'        // Manual Orbit
  | 'chase'       // Belakang (Chase Cam)
  | 'front'       // Depan / Hood Cam
  | 'side-left'   // Samping Kiri
  | 'side-right'  // Samping Kanan
  | 'drone'       // Pandangan Atas / Drone
  | 'orbit-360'   // Putaran Sinematik 360 derajat Otomatis
  | 'low-stunt'   // Sudut Rendah / Roda
  | 'director';   // AI Smart Director (Auto Dynamic Cuts)

interface CameraState {
  preset: CameraPreset;
  focusTarget: Vector3D | null;
  cameraHeading: number; // yaw angle in radians
  zoomAction: { type: 'in' | 'out'; timestamp: number } | null;
  resetTrigger: number;
  panDelta: { dx: number; dz: number; timestamp: number } | null;

  // Cinematic Tracking Angle States
  trackingAngle: CameraTrackingAngle;
  trackingDistance: number;
  trackingHeight: number;
  orbitSpeed: number;
  isCinematicPanelOpen: boolean;
  smartDirectorCutInterval: number;

  setPreset: (preset: CameraPreset) => void;
  setFocusTarget: (target: Vector3D | null) => void;
  setCameraHeading: (heading: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  panView: (dx: number, dz: number) => void;

  setTrackingAngle: (angle: CameraTrackingAngle) => void;
  setTrackingDistance: (dist: number) => void;
  setTrackingHeight: (height: number) => void;
  setOrbitSpeed: (speed: number) => void;
  setSmartDirectorCutInterval: (interval: number) => void;
  toggleCinematicPanel: () => void;
  setCinematicPanelOpen: (open: boolean) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  preset: 'isometric',
  focusTarget: null,
  cameraHeading: 0,
  zoomAction: null,
  resetTrigger: 0,
  panDelta: null,

  trackingAngle: 'free',
  trackingDistance: 12,
  trackingHeight: 5,
  orbitSpeed: 0.5,
  isCinematicPanelOpen: false,
  smartDirectorCutInterval: 5,

  setPreset: (preset) => set({ preset, trackingAngle: 'free' }),
  setFocusTarget: (target) => set({ focusTarget: target }),
  setCameraHeading: (heading) => set({ cameraHeading: heading }),
  zoomIn: () => set({ zoomAction: { type: 'in', timestamp: Date.now() } }),
  zoomOut: () => set({ zoomAction: { type: 'out', timestamp: Date.now() } }),
  resetView: () =>
    set((state) => ({
      preset: 'isometric',
      trackingAngle: 'free',
      resetTrigger: state.resetTrigger + 1,
      focusTarget: { x: 0, y: 0, z: 0 },
    })),
  panView: (dx, dz) => set({ panDelta: { dx, dz, timestamp: Date.now() } }),

  setTrackingAngle: (angle) => set({ trackingAngle: angle }),
  setTrackingDistance: (dist) => set({ trackingDistance: dist }),
  setTrackingHeight: (height) => set({ trackingHeight: height }),
  setOrbitSpeed: (speed) => set({ orbitSpeed: speed }),
  setSmartDirectorCutInterval: (interval) => set({ smartDirectorCutInterval: interval }),
  toggleCinematicPanel: () => set((state) => ({ isCinematicPanelOpen: !state.isCinematicPanelOpen })),
  setCinematicPanelOpen: (open) => set({ isCinematicPanelOpen: open }),
}));
