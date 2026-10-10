import { create } from 'zustand';

export interface ConstructionProject {
  id: string;
  name: string;
  budget: number;
  progress: number;
  duration: string;
  currentStage: string;
  materials: { name: string; amount: number; unit: string }[];
}

interface GameState {
  gameMode: 'sandbox' | 'construction' | 'city-builder';
  budget: number;
  workers: number;
  activeProject: ConstructionProject | null;
  projects: ConstructionProject[];

  setGameMode: (mode: 'sandbox' | 'construction' | 'city-builder') => void;
  setBudget: (budget: number) => void;
  setWorkers: (workers: number) => void;
  setActiveProject: (project: ConstructionProject | null) => void;
  advanceProjectProgress: (projectId: string, amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameMode: 'sandbox',
  budget: 1500000,
  workers: 24,
  activeProject: {
    id: 'proj-01',
    name: 'Audira Logistics Park Phase 1',
    budget: 650000,
    progress: 25,
    duration: '6 Months',
    currentStage: '2. Foundation & Earthwork',
    materials: [
      { name: 'Structural Steel', amount: 140, unit: 'Tons' },
      { name: 'Reinforced Concrete', amount: 480, unit: 'm³' },
      { name: 'Aggregate Sand', amount: 220, unit: 'Tons' },
    ],
  },
  projects: [],

  setGameMode: (gameMode) => set({ gameMode }),
  setBudget: (budget) => set({ budget }),
  setWorkers: (workers) => set({ workers }),
  setActiveProject: (activeProject) => set({ activeProject }),
  advanceProjectProgress: (projectId, amount) =>
    set((state) => ({
      activeProject:
        state.activeProject?.id === projectId
          ? { ...state.activeProject, progress: Math.min(100, state.activeProject.progress + amount) }
          : state.activeProject,
    })),
}));
