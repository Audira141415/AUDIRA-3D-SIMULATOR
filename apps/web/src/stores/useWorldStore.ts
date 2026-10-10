import { create } from 'zustand';
import { GameObject, WorldSaveData } from '@audira/shared';
import { INITIAL_WORLD_DATA, INITIAL_WORLD_OBJECTS, SHOWCASE_DEMO_OBJECTS } from '@audira/game-core';
import { useHistoryStore } from './useHistoryStore';

interface WorldState {
  projectName: string;
  worldSize: number;
  objects: GameObject[];
  clipboard: GameObject | null;

  setProjectName: (name: string) => void;
  setWorldSize: (size: number) => void;
  addObject: (object: GameObject) => void;
  updateObject: (id: string, updates: Partial<GameObject>, recordHistory?: boolean) => void;
  deleteObject: (id: string) => void;
  duplicateObject: (id: string) => GameObject | null;
  cutObject: (id: string) => GameObject | null;
  copyObject: (id: string) => GameObject | null;
  pasteObject: (targetPos?: { x: number; y: number; z: number }) => GameObject | null;
  dropToGround: (id: string) => void;
  nudgeObject: (id: string, dx: number, dz: number, dy?: number) => void;
  resetTransform: (id: string) => void;
  undo: () => void;
  redo: () => void;
  newWorld: () => void;
  clearAllObjects: () => void;
  resetDefaultWorld: () => void;
  loadWorldData: (data: WorldSaveData) => void;
  getWorldSaveData: () => WorldSaveData;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  projectName: 'AUDIRA 3D / PROJECT 001',
  worldSize: 300,
  objects: [], // Canvas default bersih / kosong (clean slate)
  clipboard: null,

  setProjectName: (name) => set({ projectName: name }),
  setWorldSize: (size) => set({ worldSize: size }),

  addObject: (object) => {
    const current = get().objects;
    useHistoryStore.getState().pushState(current);
    set({ objects: [...current, object] });
  },

  updateObject: (id, updates, recordHistory = false) => {
    const current = get().objects;
    if (recordHistory) {
      useHistoryStore.getState().pushState(current);
    }
    set({
      objects: current.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    });
  },

  deleteObject: (id) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target || target.locked) return;

    useHistoryStore.getState().pushState(current);
    set({ objects: current.filter((obj) => obj.id !== id) });
  },

  duplicateObject: (id) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target) return null;

    useHistoryStore.getState().pushState(current);

    const duplicated: GameObject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${target.name} (Copy)`,
      position: {
        x: Number((target.position.x + 2).toFixed(2)),
        y: target.position.y,
        z: Number((target.position.z + 2).toFixed(2)),
      },
    };

    set({ objects: [...current, duplicated] });
    return duplicated;
  },

  cutObject: (id) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target || target.locked) return null;

    useHistoryStore.getState().pushState(current);
    const cloned = JSON.parse(JSON.stringify(target));
    set({
      clipboard: cloned,
      objects: current.filter((o) => o.id !== id),
    });
    return cloned;
  },

  copyObject: (id) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target) return null;

    const cloned = JSON.parse(JSON.stringify(target));
    set({ clipboard: cloned });
    return cloned;
  },

  pasteObject: (targetPos) => {
    const clip = get().clipboard;
    if (!clip) return null;

    const current = get().objects;
    useHistoryStore.getState().pushState(current);

    const newPos = targetPos
      ? { x: targetPos.x, y: targetPos.y, z: targetPos.z }
      : {
          x: Number((clip.position.x + 2).toFixed(2)),
          y: clip.position.y,
          z: Number((clip.position.z + 2).toFixed(2)),
        };

    const pasted: GameObject = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `obj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${clip.name} (Pasted)`,
      position: newPos,
    };

    // Keep updated clipboard so repeated pastes step forward nicely
    set({
      objects: [...current, pasted],
      clipboard: {
        ...clip,
        position: { ...newPos },
      },
    });

    return pasted;
  },

  dropToGround: (id) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target || target.locked) return;

    useHistoryStore.getState().pushState(current);
    set({
      objects: current.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              position: { ...obj.position, y: 0 },
            }
          : obj
      ),
    });
  },

  nudgeObject: (id, dx, dz, dy = 0) => {
    const current = get().objects;
    const target = current.find((o) => o.id === id);
    if (!target || target.locked) return;

    useHistoryStore.getState().pushState(current);
    set({
      objects: current.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              position: {
                x: Number((obj.position.x + dx).toFixed(2)),
                y: Math.max(0, Number((obj.position.y + dy).toFixed(2))),
                z: Number((obj.position.z + dz).toFixed(2)),
              },
            }
          : obj
      ),
    });
  },

  resetTransform: (id) => {
    const current = get().objects;
    useHistoryStore.getState().pushState(current);
    set({
      objects: current.map((obj) =>
        obj.id === id
          ? {
              ...obj,
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
            }
          : obj
      ),
    });
  },

  undo: () => {
    const current = get().objects;
    const prev = useHistoryStore.getState().undo(current);
    if (prev) {
      set({ objects: prev });
    }
  },

  redo: () => {
    const current = get().objects;
    const next = useHistoryStore.getState().redo(current);
    if (next) {
      set({ objects: next });
    }
  },

  newWorld: () => {
    const current = get().objects;
    useHistoryStore.getState().pushState(current);
    set({
      projectName: 'AUDIRA 3D / NEW PROJECT',
      objects: [],
    });
  },

  clearAllObjects: () => {
    const current = get().objects;
    if (current.length === 0) return;
    useHistoryStore.getState().pushState(current);
    set({ objects: [] });
    try {
      localStorage.removeItem('audira_world_save');
    } catch (_) {}
  },

  resetDefaultWorld: () => {
    const current = get().objects;
    useHistoryStore.getState().pushState(current);
    set({
      projectName: 'AUDIRA 3D / SHOWCASE WORLD',
      objects: SHOWCASE_DEMO_OBJECTS,
    });
  },

  loadWorldData: (data) => {
    const current = get().objects;
    useHistoryStore.getState().pushState(current);
    set({
      projectName: data.world.name || 'AUDIRA 3D / LOADED PROJECT',
      worldSize: data.world.size || 100,
      objects: data.objects || [],
    });
  },

  getWorldSaveData: () => {
    const state = get();
    return {
      version: 1,
      world: {
        name: state.projectName,
        size: state.worldSize,
        gridSize: 1,
        snapToGrid: true,
        showGrid: true,
        showShadows: true,
        updatedAt: new Date().toISOString(),
      },
      objects: state.objects,
    };
  },
}));
