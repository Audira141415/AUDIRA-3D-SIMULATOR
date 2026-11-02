import React from 'react';
import {
  Layers,
  Play,
  Pause,
  Square,
  Circle,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Plus,
  X,
  Target,
  Repeat,
  Camera,
} from 'lucide-react';
import { useMultiLayerRecordStore } from '../../stores/useMultiLayerRecordStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { soundEngine } from '../audio/soundEngine';

export const MultiLayerModal: React.FC = () => {
  const isOpen = useMultiLayerRecordStore((s) => s.isOpen);
  const toggleOpen = useMultiLayerRecordStore((s) => s.toggleOpen);
  const layers = useMultiLayerRecordStore((s) => s.layers);
  const isRecording = useMultiLayerRecordStore((s) => s.isRecording);
  const recordingLayerId = useMultiLayerRecordStore((s) => s.recordingLayerId);
  const isPlaying = useMultiLayerRecordStore((s) => s.isPlaying);
  const isPaused = useMultiLayerRecordStore((s) => s.isPaused);
  const playbackTime = useMultiLayerRecordStore((s) => s.playbackTime);
  const maxDuration = useMultiLayerRecordStore((s) => s.maxDuration);
  const loopPlayback = useMultiLayerRecordStore((s) => s.loopPlayback);
  const cameraFollow = useMultiLayerRecordStore((s) => s.cameraFollow);
  const focusedLayerId = useMultiLayerRecordStore((s) => s.focusedLayerId);

  const createLayer = useMultiLayerRecordStore((s) => s.createLayer);
  const startRecording = useMultiLayerRecordStore((s) => s.startRecording);
  const stopRecording = useMultiLayerRecordStore((s) => s.stopRecording);
  const startPlayback = useMultiLayerRecordStore((s) => s.startPlayback);
  const pausePlayback = useMultiLayerRecordStore((s) => s.pausePlayback);
  const stopPlayback = useMultiLayerRecordStore((s) => s.stopPlayback);
  const seekPlayback = useMultiLayerRecordStore((s) => s.seekPlayback);
  const toggleMute = useMultiLayerRecordStore((s) => s.toggleMute);
  const deleteLayer = useMultiLayerRecordStore((s) => s.deleteLayer);
  const clearAllLayers = useMultiLayerRecordStore((s) => s.clearAllLayers);
  const setLoopPlayback = useMultiLayerRecordStore((s) => s.setLoopPlayback);
  const setCameraFollow = useMultiLayerRecordStore((s) => s.setCameraFollow);
  const setFocusedLayerId = useMultiLayerRecordStore((s) => s.setFocusedLayerId);

  const objects = useWorldStore((s) => s.objects);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);

  if (!isOpen) return null;

  // Filter vehicles on scene
  const sceneVehicles = objects.filter((o) => {
    const c = o.category?.toLowerCase() || '';
    return c === 'kendaraan' || c === 'tractor' || c === 'pesawat' || c === 'vehicles';
  });

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="absolute right-6 top-20 z-40 w-96 rounded-2xl bg-[#09151c]/95 border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl text-slate-100 flex flex-col overflow-hidden select-none animate-fadeIn font-sans">
      {/* Header */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-black tracking-wider text-cyan-300">
            MULTI-LAYER RECORDING
          </span>
          {layers.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 border border-cyan-400/30 text-cyan-300 rounded-md">
              {layers.length} Layer
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Panel Multi-Layer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        {/* Layer List */}
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {layers.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-400">
              Belum ada layer aksi tersimpan. Tambahkan kendaraan di bawah untuk merekam aksinya.
            </div>
          ) : (
            layers.map((layer, idx) => {
              const isRecThis = isRecording && recordingLayerId === layer.id;
              const isFocused = focusedLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all text-xs ${
                    isRecThis
                      ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
                      : isFocused
                      ? 'bg-slate-900/90 border-cyan-500/40'
                      : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Left: Color Dot + Name + Duration */}
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-200 truncate">{layer.vehicleName}</span>
                      <span className="text-[10px] font-mono text-cyan-400/80">
                        {isRecThis ? 'Merekam...' : `${formatTime(layer.duration)} • ${layer.frames.length} pts`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Record / Re-record button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playUIClick();
                        if (isRecThis) {
                          stopRecording();
                        } else {
                          // Select vehicle and start driving simulator
                          selectObject(layer.vehicleId);
                          setIsPlaying(true);
                          startRecording(layer.id);
                        }
                      }}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                        isRecThis
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                          : 'bg-slate-900 text-rose-400 border-white/10 hover:border-rose-400/40'
                      }`}
                      title={isRecThis ? 'Hentikan Rekam' : 'Rekam Aksi Kendaraan Ini'}
                    >
                      {isRecThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Circle className="w-3.5 h-3.5 fill-current" />}
                    </button>

                    {/* Focus Camera */}
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playUIClick();
                        setFocusedLayerId(layer.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFocused ? 'text-cyan-300 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Fokus Kamera ke Layer Ini"
                    >
                      <Target className="w-3.5 h-3.5" />
                    </button>

                    {/* Mute toggle */}
                    <button
                      type="button"
                      onClick={() => toggleMute(layer.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title={layer.muted ? 'Tampilkan Layer' : 'Sembunyikan Layer'}
                    >
                      {layer.muted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Hapus rekaman layer ${layer.vehicleName}?`)) {
                          deleteLayer(layer.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Hapus Layer Rekaman"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Layer From Placed Vehicles Dropdown */}
        {sceneVehicles.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const v = sceneVehicles.find((x) => x.id === e.target.value);
                if (v) {
                  soundEngine.playUIClick();
                  createLayer({ id: v.id, name: v.name, modelUrl: v.modelUrl, color: v.color });
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-400"
            >
              <option value="" disabled>
                + Tambah Layer dari Kendaraan Peta...
              </option>
              {sceneVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timeline Scrubber */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 flex flex-col gap-2">
          {/* Time & Scrubber */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 min-w-14">
              {formatTime(playbackTime)}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(1, maxDuration)}
              step={0.05}
              value={playbackTime}
              onChange={(e) => seekPlayback(Number(e.target.value))}
              className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-xs text-slate-400 min-w-14 text-right">
              {formatTime(maxDuration)}
            </span>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUIClick();
                  if (isPlaying && !isPaused) {
                    pausePlayback();
                  } else {
                    startPlayback();
                  }
                }}
                disabled={layers.length === 0}
                className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1 disabled:opacity-40"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Semua</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playUIClick();
                  stopPlayback();
                }}
                disabled={!isPlaying}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 disabled:opacity-40"
                title="Hentikan & Reset ke Awal"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={loopPlayback}
                  onChange={(e) => setLoopPlayback(e.target.checked)}
                  className="rounded border-slate-700 accent-cyan-400"
                />
                <span className="text-[11px] font-bold">Loop</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={cameraFollow}
                  onChange={(e) => setCameraFollow(e.target.checked)}
                  className="rounded border-slate-700 accent-cyan-400"
                />
                <span className="text-[11px] font-bold">Ikuti Kamera</span>
              </label>
            </div>
          </div>
        </div>

        {/* Note / Hint */}
        <p className="text-[10px] text-slate-500 leading-snug">
          Saat merekam layer baru, kendaraan dari layer lain otomatis diputar kembali sebagai mobil bayangan (*ghost vehicle*) tanpa saling bertabrakan!
        </p>
      </div>
    </div>
  );
};

