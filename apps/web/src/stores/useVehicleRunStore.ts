import { create } from 'zustand';

export type RunMode = 'together' | 'sequence' | 'manual';

export interface Waypoint {
  x: number;
  y: number;
  z: number;
}

export interface InitialTransform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface VehicleRunState {
  isOpen: boolean;
  isRunning: boolean;
  isPaused: boolean;
  runSpeed: number; // in meters/sec (e.g. 11.1 m/s = 40 km/h)
  runMode: RunMode;
  runSet: string[]; // Vehicle IDs participating in RUN
  runDisabled: string[]; // Vehicle IDs disabled (Off)
  manualGo: string[]; // Vehicle IDs running in manual mode
  
  // Waypoint Path Editing
  pathEdit: boolean;
  pathOwner: string | null;
  paths: Record<string, Waypoint[]>; // map vehicleId -> Waypoints
  hiddenPaths: string[]; // path IDs hidden from 3D viewport
  
  // Starting line positions for "Susun Ulang"
  initialPositions: Record<string, InitialTransform>;
  
  // Camera Follow & Smart Director
  followCam: boolean;
  smoothCam: boolean;
  focusedVehicleId: string | null;
  autoRecord: boolean;
  smartDirector: boolean;
  cycleFocusCam: boolean;

  // Actions
  toggleOpen: (open?: boolean) => void;
  setRunning: (running: boolean) => void;
  setRunPaused: (paused: boolean) => void;
  setRunSpeed: (speed: number) => void;
  setRunMode: (mode: RunMode) => void;
  
  // Vehicle Selection in RUN
  toggleVehicleInRun: (id: string) => void;
  selectAllVehicles: (ids: string[]) => void;
  clearRunSet: () => void;
  toggleVehicleDisabled: (id: string) => void;
  toggleManualVehicle: (id: string) => void;
  setManualAll: (ids: string[]) => void;
  setManualNone: () => void;
  
  // Path Editing
  setPathEdit: (edit: boolean, ownerId?: string | null) => void;
  addPathPoint: (point: Waypoint) => void;
  undoPathPoint: () => void;
  clearPath: (ownerId?: string | null) => void;
  togglePathVisibility: (ownerId: string) => void;
  
  // Initial Positions / Susun Ulang
  saveInitialPosition: (id: string, transform: InitialTransform) => void;
  setInitialPositions: (data: Record<string, InitialTransform>) => void;
  
  // Camera & Director
  setFollowCam: (follow: boolean) => void;
  setSmoothCam: (smooth: boolean) => void;
  setFocusedVehicleId: (id: string | null) => void;
  setAutoRecord: (auto: boolean) => void;
  setSmartDirector: (director: boolean) => void;
  setCycleFocusCam: (cycle: boolean) => void;
}

export const useVehicleRunStore = create<VehicleRunState>((set, get) => ({
  isOpen: false,
  isRunning: false,
  isPaused: false,
  runSpeed: 11.11, // ~40 km/h (40 / 3.6)
  runMode: 'together',
  runSet: [],
  runDisabled: [],
  manualGo: [],
  
  pathEdit: false,
  pathOwner: null,
  paths: {},
  hiddenPaths: [],
  
  initialPositions: {},
  
  followCam: false,
  smoothCam: true,
  focusedVehicleId: null,
  autoRecord: false,
  smartDirector: true,
  cycleFocusCam: true,

  toggleOpen: (open) => set((s) => ({ isOpen: open !== undefined ? open : !s.isOpen })),
  setRunning: (running) => set({ isRunning: running, isPaused: false }),
  setRunPaused: (paused) => set({ isPaused: paused }),
  setRunSpeed: (speed) => set({ runSpeed: speed }),
  setRunMode: (mode) => set({ runMode: mode }),

  toggleVehicleInRun: (id) =>
    set((s) => ({
      runSet: s.runSet.includes(id) ? s.runSet.filter((x) => x !== id) : [...s.runSet, id],
    })),

  selectAllVehicles: (ids) => set({ runSet: [...ids] }),
  clearRunSet: () => set({ runSet: [], pathOwner: null, pathEdit: false }),

  toggleVehicleDisabled: (id) =>
    set((s) => ({
      runDisabled: s.runDisabled.includes(id)
        ? s.runDisabled.filter((x) => x !== id)
        : [...s.runDisabled, id],
    })),

  toggleManualVehicle: (id) =>
    set((s) => ({
      manualGo: s.manualGo.includes(id)
        ? s.manualGo.filter((x) => x !== id)
        : [...s.manualGo, id],
    })),

  setManualAll: (ids) => set({ manualGo: [...ids] }),
  setManualNone: () => set({ manualGo: [] }),

  setPathEdit: (edit, ownerId) =>
    set((s) => ({
      pathEdit: edit,
      pathOwner: edit ? (ownerId || s.pathOwner || s.runSet[0] || null) : null,
    })),

  addPathPoint: (point) => {
    const { pathOwner, paths } = get();
    if (!pathOwner) return;
    const currentPath = paths[pathOwner] || [];
    set({
      paths: {
        ...paths,
        [pathOwner]: [...currentPath, point],
      },
    });
  },

  undoPathPoint: () => {
    const { pathOwner, paths } = get();
    if (!pathOwner || !paths[pathOwner]?.length) return;
    const currentPath = paths[pathOwner];
    set({
      paths: {
        ...paths,
        [pathOwner]: currentPath.slice(0, -1),
      },
    });
  },

  clearPath: (ownerId) => {
    const target = ownerId || get().pathOwner;
    if (!target) return;
    const { paths } = get();
    const updated = { ...paths };
    delete updated[target];
    set({ paths: updated });
  },

  togglePathVisibility: (ownerId) =>
    set((s) => ({
      hiddenPaths: s.hiddenPaths.includes(ownerId)
        ? s.hiddenPaths.filter((x) => x !== ownerId)
        : [...s.hiddenPaths, ownerId],
    })),

  saveInitialPosition: (id, transform) =>
    set((s) => ({
      initialPositions: {
        ...s.initialPositions,
        [id]: transform,
      },
    })),

  setInitialPositions: (data) => set({ initialPositions: data }),

  setFollowCam: (follow) => set({ followCam: follow }),
  setSmoothCam: (smooth) => set({ smoothCam: smooth }),
  setFocusedVehicleId: (id) => set({ focusedVehicleId: id }),
  setAutoRecord: (auto) => set({ autoRecord: auto }),
  setSmartDirector: (director) => set({ smartDirector: director }),
  setCycleFocusCam: (cycle) => set({ cycleFocusCam: cycle }),
}));

