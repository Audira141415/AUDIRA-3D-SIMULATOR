import React, { useRef, useState, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Play,
  Square,
  PlusCircle,
  Boxes,
  RotateCcw,
  Volume2,
  VolumeX,
  Megaphone,
  Camera,
  Wand2,
  Trash2,
  Activity,
  Terminal,
  PanelBottom,
  PanelRight,
} from 'lucide-react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { exportWorldToJSON, saveWorldToLocalStorage, loadWorldFromLocalStorage } from '../../features/save/saveManager';
import { soundEngine } from '../../features/audio/soundEngine';
import { useScreenRecorder } from '../../features/recording/useScreenRecorder';

export const Header: React.FC = () => {
  const projectName = useWorldStore((s) => s.projectName);
  const setProjectName = useWorldStore((s) => s.setProjectName);
  const undo = useWorldStore((s) => s.undo);
  const redo = useWorldStore((s) => s.redo);
  const newWorld = useWorldStore((s) => s.newWorld);
  const resetDefaultWorld = useWorldStore((s) => s.resetDefaultWorld);
  const loadWorldData = useWorldStore((s) => s.loadWorldData);
  const getWorldSaveData = useWorldStore((s) => s.getWorldSaveData);

  const objects = useWorldStore((s) => s.objects);
  const clearAllObjects = useWorldStore((s) => s.clearAllObjects);
  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const setIsStudioOpen = useEditorStore((s) => s.setIsStudioOpen);
  const transformMode = useEditorStore((s) => s.transformMode);
  const gridSnap = useEditorStore((s) => s.gridSnap);

  const isPropertiesPanelOpen = useEditorStore((s) => s.isPropertiesPanelOpen);
  const togglePropertiesPanel = useEditorStore((s) => s.togglePropertiesPanel);
  const isAssetLibraryOpen = useEditorStore((s) => s.isAssetLibraryOpen);
  const toggleAssetLibrary = useEditorStore((s) => s.toggleAssetLibrary);

  const preset = useCameraStore((s) => s.preset);

  const timeOfDay = useWeatherStore((s) => s.timeOfDay);
  const setTimeOfDay = useWeatherStore((s) => s.setTimeOfDay);
  const autoCycle = useWeatherStore((s) => s.autoCycle);
  const toggleAutoCycle = useWeatherStore((s) => s.toggleAutoCycle);

  const { isRecording, recordSeconds, toggleRecording } = useScreenRecorder();

  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [fps, setFps] = useState(60);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const frame = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(frame);
    };

    const handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleHonk = () => {
    soundEngine.playHorn();
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `audira-snapshot-${Date.now()}.png`;
    a.click();
  };

  const handleExportJSON = () => {
    const data = getWorldSaveData();
    exportWorldToJSON(data);
    saveWorldToLocalStorage(data);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        loadWorldData(parsed);
      } catch (err) {
        alert('Format file JSON tidak valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (objects.length === 0) return;
    if (window.confirm(`Kosongkan semua objek di kanvas? (${objects.length} objek akan dihapus, dapat di-Undo dengan Ctrl+Z)`)) {
      soundEngine.playUIClick();
      clearSelection();
      clearAllObjects();
    }
  };

  return (
    <header className="h-12 glass-panel border-b border-white/10 px-3 flex items-center justify-between relative z-50 pointer-events-auto select-none bg-[#070b12]/95 backdrop-blur-md">
      {/* 1. BRAND & PROJECT INFO */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xs tracking-wider text-white">AUDIRA</span>
              <span className="font-extrabold text-[10px] text-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-500/30">
                3D
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Project Name Editable Pill */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-slate-950/60 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 text-xs font-mono text-slate-200 px-2.5 py-1 rounded-md focus:outline-none transition-all w-44"
          title="Klik untuk mengubah nama proyek"
        />
      </div>

      {/* 2. CENTER TOOL CLUSTERS */}
      <div className="flex items-center gap-2">
        {/* History Group (Undo / Redo) */}
        <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => {
              soundEngine.playUndo();
              undo();
            }}
            disabled={!canUndo}
            className="p-1 px-2 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Batal Perubahan (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Undo</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playRedo();
              redo();
            }}
            disabled={!canRedo}
            className="p-1 px-2 rounded text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Ulangi Perubahan (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Redo</span>
          </button>
        </div>

        {/* File & Scene Group */}
        <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={handleExportJSON}
            className="p-1 px-2 rounded text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Simpan Proyek ke File JSON & LocalStorage"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 px-2 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Buka Proyek dari File JSON"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Load</span>
          </button>

          <button
            onClick={newWorld}
            className="p-1 px-2 rounded text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Buat Kanvas Dunia Baru"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>New</span>
          </button>

          <button
            onClick={resetDefaultWorld}
            className="p-1 px-2 rounded text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Muat Ulang Peta Showcase Lengkap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Map</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={objects.length === 0}
            className="p-1 px-2 rounded text-rose-300 hover:text-white hover:bg-rose-500/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center gap-1 text-[11px] font-medium"
            title="Hapus Semua Objek dari Kanvas"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear</span>
          </button>
        </div>

        {/* AI 3D Forge Studio Button */}
        <button
          onClick={() => setIsStudioOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-purple-500/25 hover:from-cyan-500/40 hover:to-purple-500/40 text-cyan-200 border border-cyan-400/50 transition-all flex items-center gap-1.5 text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95"
          title="Buka Forge3D Studio (Buat Model 3D dari Gambar)"
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
          <span>AI 3D Maker</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>

      {/* 3. RIGHT UTILITIES (SIMULATION, SUN, MEDIA, TELEMETRY, PANELS) */}
      <div className="flex items-center gap-2">
        {/* Play/Stop Drive Simulation Mode */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isPlaying) {
              soundEngine.stopEngine();
              setIsPlaying(false);
            } else {
              soundEngine.playUIClick();
              setIsPlaying(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer pointer-events-auto ${
            isPlaying
              ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          }`}
          title={isPlaying ? 'Hentikan Mode Simulasi (Esc)' : 'Mulai Simulasi Mengemudi Kendaraan'}
        >
          {isPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>STOP SIM</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>DRIVE</span>
            </>
          )}
        </button>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* 24-Hour Time of Day Slider */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-lg border border-white/10 text-xs">
          <span className="text-xs" title={`Waktu: ${timeOfDay.toFixed(1)}:00`}>
            {timeOfDay >= 6 && timeOfDay < 18 ? '☀️' : '🌙'}
          </span>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
            className="w-14 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            title={`Waktu: ${Math.floor(timeOfDay)}:${Math.floor((timeOfDay % 1) * 60).toString().padStart(2, '0')}`}
          />
          <button
            onClick={toggleAutoCycle}
            className={`px-1 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
              autoCycle
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={autoCycle ? 'Siklus Otomatis Aktif' : 'Aktifkan Siklus 24 Jam Otomatis'}
          >
            24H
          </button>
        </div>

        {/* Media Tools (REC, Screenshot, Horn, Mute) */}
        <div className="flex items-center bg-slate-950/70 p-0.5 rounded-lg border border-white/10">
          {/* 60 FPS Video Recorder */}
          <button
            onClick={toggleRecording}
            className={`p-1 px-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
              isRecording
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
            }`}
            title={isRecording ? 'Hentikan Rekaman Layar (60FPS WebM)' : 'Rekam Video Layar 60 FPS'}
          >
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-mono">
              {isRecording
                ? `${Math.floor(recordSeconds / 60)}:${(recordSeconds % 60).toString().padStart(2, '0')}`
                : 'REC'}
            </span>
          </button>

          {/* Screenshot */}
          <button
            onClick={handleScreenshot}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Ambil Foto Screenshot 3D"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Horn */}
          <button
            onClick={handleHonk}
            className="p-1 rounded text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all"
            title="Bunyikan Klakson (H)"
          >
            <Megaphone className="w-3.5 h-3.5" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`p-1 rounded transition-all ${
              isMuted ? 'text-slate-600 hover:text-slate-400' : 'text-cyan-400 hover:text-cyan-300'
            }`}
            title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Live FPS & Telemetry Popover Button */}
        <div className="relative">
          <button
            onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
              isTelemetryOpen
                ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300'
                : 'bg-slate-950/70 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Statistik FPS & Telemetry Engine"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">{fps}</span>
            <span className="text-[9px] text-slate-500">FPS</span>
          </button>

          {/* Telemetry Popover */}
          {isTelemetryOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 glass-panel-elevated p-3 rounded-xl border border-cyan-500/30 text-[11px] font-mono flex flex-col gap-1.5 shadow-2xl z-50 bg-[#0a0f18]/95 backdrop-blur-md">
              <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-white/10 pb-1">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> DEV TELEMETRY
                </span>
                <button
                  onClick={() => setIsTelemetryOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Objek:</span>
                <span className="text-white font-bold">{objects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected ID:</span>
                <span className="text-cyan-400 truncate max-w-[110px]">
                  {selectedObjectId || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Camera Preset:</span>
                <span className="text-amber-400 uppercase">{preset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transform Mode:</span>
                <span className="text-emerald-400 uppercase">{transformMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grid Snap:</span>
                <span className="text-white">{gridSnap ? '1m (Active)' : 'OFF'}</span>
              </div>
            </div>
          )}
        </div>

        {/* View Layout Drawer Toggles */}
        <div className="flex items-center bg-slate-950/70 p-0.5 rounded-lg border border-white/10">
          {/* Toggle Asset Library */}
          <button
            onClick={toggleAssetLibrary}
            className={`p-1 rounded transition-all ${
              isAssetLibraryOpen
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isAssetLibraryOpen ? 'Sembunyikan Asset Library' : 'Buka Asset Library'}
          >
            <PanelBottom className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Properties Panel */}
          <button
            onClick={togglePropertiesPanel}
            className={`p-1 rounded transition-all ${
              isPropertiesPanelOpen
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isPropertiesPanelOpen ? 'Sembunyikan Properties Panel' : 'Buka Properties Panel'}
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
