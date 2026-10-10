import React, { useState } from 'react';
import {
  Copy,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Sliders,
  Layers,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  RotateCw,
  Scissors,
  Clipboard,
  ArrowDownToLine,
  CopyPlus,
  Crosshair,
  Search,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { useGameStore } from '../../stores/useGameStore';
import { soundEngine } from '../../features/audio/soundEngine';

export const PropertiesPanel: React.FC = () => {
  const isPropertiesPanelOpen = useEditorStore((s) => s.isPropertiesPanelOpen);
  const togglePropertiesPanel = useEditorStore((s) => s.togglePropertiesPanel);
  const activeTab = useEditorStore((s) => s.activePropertiesTab);
  const setActiveTab = useEditorStore((s) => s.setActivePropertiesTab);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const objects = useWorldStore((s) => s.objects);
  const clipboard = useWorldStore((s) => s.clipboard);
  const updateObject = useWorldStore((s) => s.updateObject);
  const deleteObject = useWorldStore((s) => s.deleteObject);
  const duplicateObject = useWorldStore((s) => s.duplicateObject);
  const cutObject = useWorldStore((s) => s.cutObject);
  const copyObject = useWorldStore((s) => s.copyObject);
  const pasteObject = useWorldStore((s) => s.pasteObject);
  const dropToGround = useWorldStore((s) => s.dropToGround);
  const resetTransform = useWorldStore((s) => s.resetTransform);
  const clearAllObjects = useWorldStore((s) => s.clearAllObjects);

  const transformMode = useEditorStore((s) => s.transformMode);
  const setTransformMode = useEditorStore((s) => s.setTransformMode);

  const activeProject = useGameStore((s) => s.activeProject);

  const [outlinerSearch, setOutlinerSearch] = useState('');

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  // If panel is collapsed, show subtle right edge toggle button
  if (!isPropertiesPanelOpen) {
    return (
      <button
        onClick={togglePropertiesPanel}
        className="absolute top-20 right-0 z-20 py-3 px-1.5 bg-[#0a0f18]/90 hover:bg-cyan-500/20 border-l border-y border-white/10 hover:border-cyan-400/50 rounded-l-xl text-slate-400 hover:text-cyan-300 shadow-2xl transition-all flex flex-col items-center gap-2 group backdrop-blur-md"
        title="Buka Panel Properties & Outliner"
      >
        <ChevronLeft className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition-transform" />
        <span className="[writing-mode:vertical-lr] text-[9px] font-mono tracking-widest uppercase font-bold">
          PROPERTIES
        </span>
      </button>
    );
  }

  // Handle Transform inputs
  const handlePosChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      position: { ...selectedObject.position, [axis]: value },
    });
  };

  const handleRotChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      rotation: { ...selectedObject.rotation, [axis]: value },
    });
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      scale: { ...selectedObject.scale, [axis]: Math.max(0.1, value) },
    });
  };

  const handleUniformScale = (val: number) => {
    if (!selectedObject) return;
    const target = Math.max(0.1, val);
    const avg = (selectedObject.scale.x + selectedObject.scale.y + selectedObject.scale.z) / 3;
    const ratio = target / Math.max(0.01, avg);
    updateObject(selectedObject.id, {
      scale: {
        x: Math.max(0.1, Number((selectedObject.scale.x * ratio).toFixed(2))),
        y: Math.max(0.1, Number((selectedObject.scale.y * ratio).toFixed(2))),
        z: Math.max(0.1, Number((selectedObject.scale.z * ratio).toFixed(2))),
      },
    }, true);
  };

  const handleScaleMultiplier = (mult: number) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, {
      scale: {
        x: Math.max(0.1, Number((selectedObject.scale.x * mult).toFixed(2))),
        y: Math.max(0.1, Number((selectedObject.scale.y * mult).toFixed(2))),
        z: Math.max(0.1, Number((selectedObject.scale.z * mult).toFixed(2))),
      },
    }, true);
  };

  const filteredObjects = objects.filter((o) =>
    o.name.toLowerCase().includes(outlinerSearch.toLowerCase()) ||
    o.category.toLowerCase().includes(outlinerSearch.toLowerCase())
  );

  return (
    <aside className="w-80 glass-panel border-l border-white/10 flex flex-col z-20 select-none bg-[#09101a]/95 backdrop-blur-md text-xs">
      {/* 1. TOP TAB BAR & COLLAPSE BUTTON */}
      <div className="h-10 px-2 flex items-center justify-between border-b border-white/10 bg-[#060a10]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              activeTab === 'inspector'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('outliner')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              activeTab === 'outliner'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Outliner ({objects.length})</span>
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={togglePropertiesPanel}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Tutup Panel (Minimize)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. BODY CONTENT: INSPECTOR OR OUTLINER */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scrollbar-thin">
        {/* TAB 1: INSPECTOR */}
        {activeTab === 'inspector' && (
          <>
            {selectedObject ? (
              <>
                {/* Object Header Info */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      {selectedObject.category}
                    </span>
                    <button
                      onClick={clearSelection}
                      className="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 flex items-center gap-1 transition-all"
                      title="Batalkan Pilihan Objek (Esc)"
                    >
                      <X className="w-3 h-3" /> Deselect
                    </button>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={selectedObject.name}
                      onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 focus:border-cyan-400 rounded-lg px-2.5 py-1 text-slate-100 font-bold text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Transform Mode Gizmo Selector */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Transform Gizmo</span>
                    <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-white/10">
                      <button
                        onClick={() => setTransformMode('translate')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                          transformMode === 'translate' ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Geser Posisi (W)"
                      >
                        <Move className="w-3 h-3" /> Move
                      </button>
                      <button
                        onClick={() => setTransformMode('rotate')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                          transformMode === 'rotate' ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Putar Orientasi (E)"
                      >
                        <RotateCw className="w-3 h-3" /> Rot
                      </button>
                      <button
                        onClick={() => setTransformMode('scale')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                          transformMode === 'scale' ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Skala Ukuran (R)"
                      >
                        <Maximize2 className="w-3 h-3" /> Scale
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col gap-2.5">
                    {/* POSITION */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400">Position (XYZ)</span>
                        <button
                          onClick={() => {
                            soundEngine.playUIClick();
                            dropToGround(selectedObject.id);
                          }}
                          className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 transition-all"
                          title="Ratakan ke Lantai (Y = 0)"
                        >
                          <ArrowDownToLine className="w-3 h-3" /> Ke Lantai
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 font-mono">
                        {(['x', 'y', 'z'] as const).map((axis) => (
                          <div key={axis} className="flex items-center bg-slate-950 border border-white/10 rounded px-1.5 py-0.5">
                            <span className="text-[10px] font-bold text-cyan-400 mr-1 uppercase">{axis}</span>
                            <input
                              type="number"
                              step="0.5"
                              value={selectedObject.position[axis]}
                              onChange={(e) => handlePosChange(axis, parseFloat(e.target.value) || 0)}
                              className="w-full bg-transparent text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ROTATION */}
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">Rotation (deg)</span>
                      <div className="grid grid-cols-3 gap-1.5 font-mono">
                        {(['x', 'y', 'z'] as const).map((axis) => (
                          <div key={axis} className="flex items-center bg-slate-950 border border-white/10 rounded px-1.5 py-0.5">
                            <span className="text-[10px] font-bold text-amber-400 mr-1 uppercase">{axis}</span>
                            <input
                              type="number"
                              step="15"
                              value={selectedObject.rotation[axis]}
                              onChange={(e) => handleRotChange(axis, parseFloat(e.target.value) || 0)}
                              className="w-full bg-transparent text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SCALE */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400">Scale</span>
                        <span className="text-[10px] font-mono text-cyan-400 font-extrabold">
                          {selectedObject.scale.x.toFixed(2)}x
                        </span>
                      </div>

                      {/* Quick Scale Buttons */}
                      <div className="grid grid-cols-2 gap-1 mb-1.5">
                        <button
                          onClick={() => handleScaleMultiplier(0.8)}
                          className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/5 flex items-center justify-center gap-1 text-[11px] font-bold transition-all active:scale-95"
                          title="Perkecil Objek -20%"
                        >
                          <ZoomOut className="w-3 h-3 text-cyan-400" /> -20%
                        </button>
                        <button
                          onClick={() => handleScaleMultiplier(1.25)}
                          className="py-1 px-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/5 flex items-center justify-center gap-1 text-[11px] font-bold transition-all active:scale-95"
                          title="Perbesar Objek +25%"
                        >
                          <ZoomIn className="w-3 h-3 text-cyan-400" /> +25%
                        </button>
                      </div>

                      {/* Slider */}
                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-white/10 mb-1.5">
                        <span className="text-[9px] font-mono text-slate-500">0.2x</span>
                        <input
                          type="range"
                          min="0.2"
                          max="5.0"
                          step="0.05"
                          value={selectedObject.scale.x}
                          onChange={(e) => handleUniformScale(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                        />
                        <span className="text-[9px] font-mono text-slate-500">5.0x</span>
                      </div>

                      {/* Scale Presets */}
                      <div className="grid grid-cols-4 gap-1 mb-1.5">
                        {[
                          { label: '0.5x', val: 0.5 },
                          { label: '1.0x', val: 1.0 },
                          { label: '2.0x', val: 2.0 },
                          { label: '3.0x', val: 3.0 },
                        ].map((sc) => (
                          <button
                            key={sc.label}
                            onClick={() => handleUniformScale(sc.val)}
                            className={`py-0.5 text-[9px] font-mono rounded transition-all border text-center ${
                              Math.abs(selectedObject.scale.x - sc.val) < 0.05
                                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/50 font-bold'
                                : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                            }`}
                          >
                            {sc.label}
                          </button>
                        ))}
                      </div>

                      {/* Detailed XYZ Inputs */}
                      <div className="grid grid-cols-3 gap-1.5 font-mono">
                        {(['x', 'y', 'z'] as const).map((axis) => (
                          <div key={axis} className="flex items-center bg-slate-950 border border-white/10 rounded px-1.5 py-0.5">
                            <span className="text-[10px] font-bold text-emerald-400 mr-1 uppercase">{axis}</span>
                            <input
                              type="number"
                              step="0.1"
                              value={selectedObject.scale[axis]}
                              onChange={(e) => handleScaleChange(axis, parseFloat(e.target.value) || 1)}
                              className="w-full bg-transparent text-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visibility & Lock Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateObject(selectedObject.id, { visible: !selectedObject.visible })}
                    className="p-1.5 px-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-300 flex items-center justify-center gap-1.5 text-[11px] transition-all"
                  >
                    {selectedObject.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Hidden
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => updateObject(selectedObject.id, { locked: !selectedObject.locked })}
                    className={`p-1.5 px-2 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] transition-all ${
                      selectedObject.locked
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    {selectedObject.locked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Unlocked
                      </>
                    )}
                  </button>
                </div>

                {/* Actions & Clipboard */}
                <div className="flex flex-col gap-1.5 pt-1 mt-auto">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Aksi &amp; Clipboard</div>
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => {
                        soundEngine.playUIClick();
                        cutObject(selectedObject.id);
                        clearSelection();
                      }}
                      className="py-1 px-1 rounded-lg bg-slate-950 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-mono"
                      title="Potong Objek (Ctrl+X)"
                    >
                      <Scissors className="w-3 h-3 text-amber-400" />
                      <span>Cut</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playUIClick();
                        copyObject(selectedObject.id);
                      }}
                      className="py-1 px-1 rounded-lg bg-slate-950 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-mono"
                      title="Salin Objek (Ctrl+C)"
                    >
                      <Copy className="w-3 h-3 text-cyan-400" />
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playUIClick();
                        const pasted = pasteObject();
                        if (pasted) selectObject(pasted.id);
                      }}
                      disabled={!clipboard}
                      className={`py-1 px-1 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-mono ${
                        clipboard
                          ? 'bg-slate-950 hover:bg-emerald-500/20 border-white/10 hover:border-emerald-400/50 text-slate-300 hover:text-emerald-300'
                          : 'bg-slate-950/40 border-white/5 text-slate-600 cursor-not-allowed'
                      }`}
                      title={clipboard ? `Tempel: ${clipboard.name} (Ctrl+V)` : 'Clipboard Kosong'}
                    >
                      <Clipboard className="w-3 h-3 text-emerald-400" />
                      <span>Paste</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playUIClick();
                        const dup = duplicateObject(selectedObject.id);
                        if (dup) selectObject(dup.id);
                      }}
                      className="py-1 px-1 rounded-lg bg-slate-950 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 flex flex-col items-center justify-center gap-0.5 transition-all text-[9px] font-mono"
                      title="Gandakan Objek (Ctrl+D)"
                    >
                      <CopyPlus className="w-3 h-3 text-cyan-400" />
                      <span>Duplikat</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <button
                      onClick={() => {
                        soundEngine.playUIClick();
                        resetTransform(selectedObject.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center gap-1.5 transition-all text-[11px]"
                      title="Reset Posisi & Rotasi"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playDelete();
                        deleteObject(selectedObject.id);
                        clearSelection();
                      }}
                      disabled={selectedObject.locked}
                      className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 flex items-center justify-center gap-1.5 transition-all text-[11px] font-bold disabled:opacity-40"
                      title="Hapus Objek (Delete)"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" /> Hapus
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Object Selected State */
              <div className="flex flex-col gap-3 py-2">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    Statistik Scene
                  </div>
                  <div className="flex justify-between items-center text-slate-300 text-xs">
                    <span>Total Objek:</span>
                    <strong className="font-mono text-cyan-300">{objects.length}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 text-xs">
                    <span>Terrain:</span>
                    <span className="font-mono text-slate-400">100m x 100m</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 text-xs">
                    <span>Budget:</span>
                    <span className="font-mono text-emerald-400">$1,500,000</span>
                  </div>
                </div>

                {/* Active Mission */}
                {activeProject && (
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-cyan-500/20 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>MISI AKTIF</span>
                    </div>
                    <div className="font-semibold text-white">{activeProject.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{activeProject.currentStage}</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${activeProject.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Quick Hint */}
                <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 flex flex-col gap-1.5">
                  <span className="font-semibold text-slate-300">💡 Cara Memilih Objek:</span>
                  <p className="text-[10px] leading-relaxed text-slate-400">
                    Klik objek mana saja di 3D kanvas, atau buka tab <strong className="text-cyan-300">Outliner</strong> di atas untuk melihat daftar seluruh aset.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: OUTLINER (SCENE HIERARCHY) */}
        {activeTab === 'outliner' && (
          <div className="flex flex-col gap-2.5 h-full">
            {/* Search in Outliner */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari objek di scene..."
                value={outlinerSearch}
                onChange={(e) => setOutlinerSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* List of Objects */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-0.5 scrollbar-thin">
              {filteredObjects.map((obj) => {
                const isSelected = selectedObjectId === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => {
                      soundEngine.playUIClick();
                      selectObject(obj.id);
                      useCameraStore.getState().setFocusTarget(obj.position);
                    }}
                    className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all border group ${
                      isSelected
                        ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/70 hover:bg-slate-800 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: obj.color || '#00d2ff' }}
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-cyan-200' : 'text-slate-200 group-hover:text-cyan-300'}`}>
                          {obj.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {obj.category} • ({obj.position.x.toFixed(0)}, {obj.position.z.toFixed(0)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playUIClick();
                          selectObject(obj.id);
                          useCameraStore.getState().setFocusTarget(obj.position);
                        }}
                        className="p-1 rounded-md hover:bg-white/10 text-cyan-400 hover:text-white"
                        title="Fokuskan Kamera [F]"
                      >
                        <Crosshair className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playDelete();
                          deleteObject(obj.id);
                          if (selectedObjectId === obj.id) clearSelection();
                        }}
                        className="p-1 rounded-md hover:bg-red-500/20 text-slate-500 hover:text-red-400"
                        title="Hapus Objek"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredObjects.length === 0 && (
                <div className="text-center py-6 text-slate-500 font-mono text-[11px]">
                  {objects.length === 0 ? 'Belum ada objek di scene.' : 'Objek tidak ditemukan.'}
                </div>
              )}
            </div>

            {/* Clear All in Outliner */}
            {objects.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(`Hapus semua ${objects.length} objek di kanvas? (Dapat di-Undo dengan Ctrl+Z)`)) {
                    clearSelection();
                    clearAllObjects();
                  }
                }}
                className="w-full py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Kosongkan Seluruh Kanvas ({objects.length})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
