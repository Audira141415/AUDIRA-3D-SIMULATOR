import React from 'react';
import { Header } from '../components/layout/Header';
import { Toolbar } from '../components/layout/Toolbar';
import { PropertiesPanel } from '../components/layout/PropertiesPanel';
import { AssetLibrary } from '../components/layout/AssetLibrary';
import { Viewport3D } from '../features/world/Viewport3D';
import { NavigationControls } from '../features/camera/NavigationControls';
import { ContextMenu } from '../features/editor/ContextMenu';
import { MeshStudioModal } from '../features/studio/MeshStudioModal';
import { CinematicVideoPanel } from '../components/layout/CinematicVideoPanel';
import { VehicleAudioModal } from '../features/vehicles/VehicleAudioModal';
import { KreatorStudioModal } from '../features/kreator/KreatorStudioModal';
import { AssetScraperModal } from '../features/scraper/AssetScraperModal';
import { LicenseModal } from '../features/license/LicenseModal';
import { LandingPage } from '../features/home/LandingPage';
import { useVehicleAudioStore } from '../stores/useVehicleAudioStore';
import { useEditorStore } from '../stores/useEditorStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAutoAssetScraper } from '../features/scraper/useAutoAssetScraper';

export const App: React.FC = () => {
  // Activate global keyboard shortcuts (Q, W, E, R, Delete, Ctrl+Z, Ctrl+Y, F, G, S, Esc, Arrows)
  useKeyboardShortcuts();

  // Activate automatic background scraper on web/app startup
  useAutoAssetScraper();

  const currentView = useEditorStore((s) => s.currentView);
  const setCurrentView = useEditorStore((s) => s.setCurrentView);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);

  const isObsMode = useVehicleAudioStore((s) => s.isObsMode);

  // In Drive/Simulation mode or OBS mode, hide editor toolbars and drawers for a clean, immersive experience
  const showEditorPanels = !isObsMode && !isPlaying;

  const handleEnterSimulator = (mode?: 'drive' | 'edit') => {
    if (mode === 'drive') {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
    setCurrentView('editor');
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070a12] text-slate-100 overflow-hidden select-none font-sans">
      {currentView === 'home' ? (
        <LandingPage onEnterSimulator={handleEnterSimulator} />
      ) : (
        <>
          {/* Top Navigation Header (hidden in OBS Mode) */}
          {!isObsMode && <Header />}

          {/* Main Center Area: Viewport 3D + Floating Overlays + Properties Dock */}
          <div className="flex-1 flex relative overflow-hidden">
            {/* 3D R3F Canvas Viewport */}
            <main className="flex-1 relative h-full overflow-hidden">
              <Viewport3D />
              {showEditorPanels && <Toolbar />}
              {showEditorPanels && <NavigationControls />}
              {showEditorPanels && <ContextMenu />}
              {showEditorPanels && <CinematicVideoPanel />}
            </main>

            {/* Right Properties & Scene Outliner Panel (hidden during Drive / OBS mode) */}
            {showEditorPanels && <PropertiesPanel />}
          </div>

          {/* Bottom Asset Library Drawer (hidden during Drive / OBS mode) */}
          {showEditorPanels && <AssetLibrary />}
        </>
      )}

      {/* AI 3D Mesh Studio Modal (Forge3D Model Maker from Image) */}
      <MeshStudioModal />

      {/* Vehicle Audio Mixer & Music Player Modal */}
      <VehicleAudioModal />

      {/* BANG PAY MAGIC PRO — 10 Tools Kreator Studio Suite */}
      <KreatorStudioModal />

      {/* BangPay Remote GLB Auto-Scraper Modal */}
      <AssetScraperModal />

      {/* AUDIRA Creator License Modal */}
      <LicenseModal />
    </div>
  );
};
