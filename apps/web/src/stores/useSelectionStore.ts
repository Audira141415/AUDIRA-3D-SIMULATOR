import { create } from 'zustand';

interface SelectionState {
  selectedObjectId: string | null;
  lastSelectedAt: number;
  selectObject: (id: string | null) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedObjectId: null,
  lastSelectedAt: 0,
  selectObject: (id) =>
    set({
      selectedObjectId: id,
      lastSelectedAt: id ? Date.now() : 0,
    }),
  clearSelection: () => set({ selectedObjectId: null, lastSelectedAt: 0 }),
}));
