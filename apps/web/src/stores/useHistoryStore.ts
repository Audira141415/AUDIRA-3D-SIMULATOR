import { create } from 'zustand';
import { GameObject } from '@audira/shared';

interface HistoryState {
  past: GameObject[][];
  future: GameObject[][];
  canUndo: boolean;
  canRedo: boolean;

  pushState: (currentState: GameObject[]) => void;
  undo: (currentState: GameObject[]) => GameObject[] | null;
  redo: (currentState: GameObject[]) => GameObject[] | null;
  clearHistory: () => void;
}

const MAX_HISTORY = 30;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  pushState: (currentState) => {
    // Clone state deeply
    const cloned = JSON.parse(JSON.stringify(currentState));
    set((state) => {
      const newPast = [...state.past, cloned];
      if (newPast.length > MAX_HISTORY) newPast.shift();
      return {
        past: newPast,
        future: [], // New action resets redo stack
        canUndo: true,
        canRedo: false,
      };
    });
  },

  undo: (currentState) => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    const newFuture = [JSON.parse(JSON.stringify(currentState)), ...future];

    set({
      past: newPast,
      future: newFuture,
      canUndo: newPast.length > 0,
      canRedo: true,
    });

    return previous;
  },

  redo: (currentState) => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);
    const newPast = [...past, JSON.parse(JSON.stringify(currentState))];

    set({
      past: newPast,
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });

    return next;
  },

  clearHistory: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}));
