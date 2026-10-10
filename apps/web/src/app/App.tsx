import React from 'react';
import { Header } from '../components/layout/Header';
import { Toolbar } from '../components/layout/Toolbar';
import { PropertiesPanel } from '../components/layout/PropertiesPanel';
import { AssetLibrary } from '../components/layout/AssetLibrary';
import { Viewport3D } from '../features/world/Viewport3D';
import { NavigationControls } from '../features/camera/NavigationControls';
import { ContextMenu } from '../features/editor/ContextMenu';
import { MeshStudioModal } from '../features/studio/MeshStudioModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const App: React.FC = () => {
  // Activate global keyboard shortcuts (Q, W, E, R, Delete, Ctrl+Z, Ctrl+Y, F, G, S, Esc, Arrows)
  useKeyboardShortcuts();

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070a12] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Center Area: Viewport 3D + Floating Overlays + Properties Dock */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* 3D R3F Canvas Viewport */}
        <main className="flex-1 relative h-full overflow-hidden">
          <Viewport3D />
          <Toolbar />
          <NavigationControls />
          <ContextMenu />
        </main>

        {/* Right Properties & Scene Outliner Panel */}
        <PropertiesPanel />
      </div>

      {/* Bottom Asset Library Drawer */}
      <AssetLibrary />

      {/* AI 3D Mesh Studio Modal (Forge3D Model Maker from Image) */}
      <MeshStudioModal />
    </div>
  );
};
