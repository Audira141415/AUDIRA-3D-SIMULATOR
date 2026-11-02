import { create } from 'zustand';

export type VehicleFxType = 'none' | 'shatter' | 'explode' | 'crush';

export interface VehicleFxStateItem {
  hydraulicActive: boolean;
  hydraulicMode: 'auto' | 'manual';
  hydraulicProgress: number; // 0 to 1
  hydraulicSpeed: number; // 0.25 to 3.0
  fxType: VehicleFxType;
  explodedOffset?: { x: number; y: number; z: number };
}

interface VehicleFxStore {
  isOpen: boolean;
  selectedVehicleId: string | null;
  vehicleFxMap: Record<string, VehicleFxStateItem>;

  // Actions
  toggleOpen: (open?: boolean) => void;
  setSelectedVehicleId: (id: string | null) => void;
  getVehicleFx: (id: string) => VehicleFxStateItem;
  setHydraulicActive: (id: string, active: boolean) => void;
  setHydraulicMode: (id: string, mode: 'auto' | 'manual') => void;
  setHydraulicSpeed: (id: string, speed: number) => void;
  stepHydraulicProgress: (id: string, deltaProgress: number) => void;
  triggerFx: (id: string, fx: VehicleFxType) => void;
  restoreVehicleFx: (id: string) => void;
  restoreAllFx: () => void;
}

const DEFAULT_FX_ITEM: VehicleFxStateItem = {
  hydraulicActive: false,
  hydraulicMode: 'auto',
  hydraulicProgress: 0,
  hydraulicSpeed: 1.0,
  fxType: 'none',
};

export const useVehicleFxStore = create<VehicleFxStore>((set, get) => ({
  isOpen: false,
  selectedVehicleId: null,
  vehicleFxMap: {},

  toggleOpen: (open) => set((s) => ({ isOpen: open !== undefined ? open : !s.isOpen })),
  setSelectedVehicleId: (selectedVehicleId) => set({ selectedVehicleId, isOpen: selectedVehicleId !== null }),

  getVehicleFx: (id) => {
    return get().vehicleFxMap[id] || DEFAULT_FX_ITEM;
  },

  setHydraulicActive: (id, active) =>
    set((s) => ({
      vehicleFxMap: {
        ...s.vehicleFxMap,
        [id]: {
          ...(s.vehicleFxMap[id] || DEFAULT_FX_ITEM),
          hydraulicActive: active,
        },
      },
    })),

  setHydraulicMode: (id, mode) =>
    set((s) => ({
      vehicleFxMap: {
        ...s.vehicleFxMap,
        [id]: {
          ...(s.vehicleFxMap[id] || DEFAULT_FX_ITEM),
          hydraulicMode: mode,
        },
      },
    })),

  setHydraulicSpeed: (id, speed) =>
    set((s) => ({
      vehicleFxMap: {
        ...s.vehicleFxMap,
        [id]: {
          ...(s.vehicleFxMap[id] || DEFAULT_FX_ITEM),
          hydraulicSpeed: Math.max(0.2, Math.min(3.0, speed)),
        },
      },
    })),

  stepHydraulicProgress: (id, delta) =>
    set((s) => {
      const current = s.vehicleFxMap[id] || DEFAULT_FX_ITEM;
      let next = current.hydraulicProgress + delta * current.hydraulicSpeed;
      if (current.hydraulicMode === 'auto') {
        if (next > 1) next = 0; // Loop
      } else {
        next = Math.max(0, Math.min(1, next));
      }
      return {
        vehicleFxMap: {
          ...s.vehicleFxMap,
          [id]: {
            ...current,
            hydraulicProgress: next,
          },
        },
      };
    }),

  triggerFx: (id, fxType) =>
    set((s) => ({
      vehicleFxMap: {
        ...s.vehicleFxMap,
        [id]: {
          ...(s.vehicleFxMap[id] || DEFAULT_FX_ITEM),
          fxType,
          explodedOffset:
            fxType === 'explode'
              ? {
                  x: (Math.random() - 0.5) * 4,
                  y: 3 + Math.random() * 2,
                  z: (Math.random() - 0.5) * 4,
                }
              : undefined,
        },
      },
    })),

  restoreVehicleFx: (id) =>
    set((s) => {
      const updated = { ...s.vehicleFxMap };
      delete updated[id];
      return { vehicleFxMap: updated };
    }),

  restoreAllFx: () => set({ vehicleFxMap: {} }),
}));

