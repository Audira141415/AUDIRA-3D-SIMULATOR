import { create } from 'zustand';
import { TransformMode, AssetCategory, AssetDefinition } from '@audira/shared';

interface EditorState {
  transformMode: TransformMode;
  activeTool: 'select' | 'move' | 'rotate' | 'scale' | 'terrain' | 'road' | 'building';
  gridSnap: boolean;
  gridSize: number;
  showGrid: boolean;
  showShadows: boolean;
  isPlaying: boolean;
  activeCategory: AssetCategory;
  placingAsset: AssetDefinition | null;

  // 3D Asset Creator Studio Modal
  isStudioOpen: boolean;

  // Simulator HUD info
  simSpeed: number;
  simVehicleName: string;

  // UI Panels Drawer / Collapse State
  isPropertiesPanelOpen: boolean;
  isAssetLibraryOpen: boolean;
  activePropertiesTab: 'inspector' | 'outliner';

  setTransformMode: (mode: TransformMode) => void;
  setActiveTool: (tool: 'select' | 'move' | 'rotate' | 'scale' | 'terrain' | 'road' | 'building') => void;
  toggleGridSnap: () => void;
  setGridSize: (size: number) => void;
  toggleGrid: () => void;
  toggleShadows: () => void;
  setIsPlaying: (playing: boolean) => void;
  setActiveCategory: (cat: AssetCategory) => void;
  setPlacingAsset: (asset: AssetDefinition | null) => void;
  setIsStudioOpen: (open: boolean) => void;
  setSimState: (speed: number, vehicleName: string) => void;
  togglePropertiesPanel: () => void;
  setPropertiesPanelOpen: (open: boolean) => void;
  toggleAssetLibrary: () => void;
  setAssetLibraryOpen: (open: boolean) => void;
  setActivePropertiesTab: (tab: 'inspector' | 'outliner') => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  transformMode: 'select',
  activeTool: 'select',
  gridSnap: true,
  gridSize: 1,
  showGrid: true,
  showShadows: true,
  isPlaying: false,
  activeCategory: 'dekorasi',
  placingAsset: null,

  isStudioOpen: false,

  simSpeed: 0,
  simVehicleName: '',

  isPropertiesPanelOpen: true,
  isAssetLibraryOpen: true,
  activePropertiesTab: 'inspector',

  setTransformMode: (mode) =>
    set({
      transformMode: mode,
      activeTool: mode === 'translate' ? 'move' : mode === 'rotate' ? 'rotate' : mode === 'scale' ? 'scale' : 'select',
    }),
  setActiveTool: (tool) => {
    const transformMode: TransformMode =
      tool === 'move' ? 'translate' : tool === 'rotate' ? 'rotate' : tool === 'scale' ? 'scale' : 'select';
    set({ activeTool: tool, transformMode });
  },
  toggleGridSnap: () => set((state) => ({ gridSnap: !state.gridSnap })),
  setGridSize: (size) => set({ gridSize: size }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleShadows: () => set((state) => ({ showShadows: !state.showShadows })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setPlacingAsset: (asset) => set({ placingAsset: asset }),
  setIsStudioOpen: (open) => set({ isStudioOpen: open }),
  setSimState: (speed, vehicleName) => set({ simSpeed: speed, simVehicleName: vehicleName }),
  togglePropertiesPanel: () => set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen })),
  setPropertiesPanelOpen: (open) => set({ isPropertiesPanelOpen: open }),
  toggleAssetLibrary: () => set((state) => ({ isAssetLibraryOpen: !state.isAssetLibraryOpen })),
  setAssetLibraryOpen: (open) => set({ isAssetLibraryOpen: open }),
  setActivePropertiesTab: (tab) => set({ activePropertiesTab: tab }),
}));
