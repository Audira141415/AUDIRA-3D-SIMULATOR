import React, { useMemo } from 'react';
import {
  Route,
  Undo2,
  Trash2,
  Play,
  Square,
  RotateCcw,
  Pause,
  Target,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  X,
  HelpCircle,
} from 'lucide-react';
import { useVehicleRunStore, RunMode } from '../../stores/useVehicleRunStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { getVehicleColor } from './RunPathRenderer';
import { soundEngine } from '../audio/soundEngine';

export const VehicleRunModal: React.FC = () => {
  const isOpen = useVehicleRunStore((s) => s.isOpen);
  const toggleOpen = useVehicleRunStore((s) => s.toggleOpen);
  const isRunning = useVehicleRunStore((s) => s.isRunning);
  const setRunning = useVehicleRunStore((s) => s.setRunning);
  const isPaused = useVehicleRunStore((s) => s.isPaused);
  const setRunPaused = useVehicleRunStore((s) => s.setRunPaused);
  const runSpeed = useVehicleRunStore((s) => s.runSpeed);
  const setRunSpeed = useVehicleRunStore((s) => s.setRunSpeed);
  const runMode = useVehicleRunStore((s) => s.runMode);
  const setRunMode = useVehicleRunStore((s) => s.setRunMode);
  const runSet = useVehicleRunStore((s) => s.runSet);
  const toggleVehicleInRun = useVehicleRunStore((s) => s.toggleVehicleInRun);
  const selectAllVehicles = useVehicleRunStore((s) => s.selectAllVehicles);
  const clearRunSet = useVehicleRunStore((s) => s.clearRunSet);
  const runDisabled = useVehicleRunStore((s) => s.runDisabled);
  const toggleVehicleDisabled = useVehicleRunStore((s) => s.toggleVehicleDisabled);
  const manualGo = useVehicleRunStore((s) => s.manualGo);
  const toggleManualVehicle = useVehicleRunStore((s) => s.toggleManualVehicle);
  const setManualAll = useVehicleRunStore((s) => s.setManualAll);
  const setManualNone = useVehicleRunStore((s) => s.setManualNone);

  const pathEdit = useVehicleRunStore((s) => s.pathEdit);
  const pathOwner = useVehicleRunStore((s) => s.pathOwner);
  const setPathEdit = useVehicleRunStore((s) => s.setPathEdit);
  const addPathPoint = useVehicleRunStore((s) => s.addPathPoint);
  const undoPathPoint = useVehicleRunStore((s) => s.undoPathPoint);
  const clearPath = useVehicleRunStore((s) => s.clearPath);
  const paths = useVehicleRunStore((s) => s.paths);
  const hiddenPaths = useVehicleRunStore((s) => s.hiddenPaths);
  const togglePathVisibility = useVehicleRunStore((s) => s.togglePathVisibility);

  const initialPositions = useVehicleRunStore((s) => s.initialPositions);
  const followCam = useVehicleRunStore((s) => s.followCam);
  const setFollowCam = useVehicleRunStore((s) => s.setFollowCam);
  const smoothCam = useVehicleRunStore((s) => s.smoothCam);
  const setSmoothCam = useVehicleRunStore((s) => s.setSmoothCam);
  const focusedVehicleId = useVehicleRunStore((s) => s.focusedVehicleId);
  const setFocusedVehicleId = useVehicleRunStore((s) => s.setFocusedVehicleId);
  const autoRecord = useVehicleRunStore((s) => s.autoRecord);
  const setAutoRecord = useVehicleRunStore((s) => s.setAutoRecord);
  const smartDirector = useVehicleRunStore((s) => s.smartDirector);
  const setSmartDirector = useVehicleRunStore((s) => s.setSmartDirector);
  const cycleFocusCam = useVehicleRunStore((s) => s.cycleFocusCam);
  const setCycleFocusCam = useVehicleRunStore((s) => s.setCycleFocusCam);

  const objects = useWorldStore((s) => s.objects);
  const updateObject = useWorldStore((s) => s.updateObject);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  // Filter vehicles from scene objects
  const vehicles = useMemo(() => {
    return objects.filter((o) => {
      const cat = o.category?.toLowerCase() || '';
      return cat === 'kendaraan' || cat === 'tractor' || cat === 'pesawat' || cat === 'vehicles';
    });
  }, [objects]);

  if (!isOpen) return null;

  // Toggle route editing and auto-seed vehicle starting point if empty
  const handleTogglePathEdit = (targetId?: string) => {
    soundEngine.playUIClick();
    const id = targetId || pathOwner || vehicles[0]?.id;
    if (!id) return;
    const isCurrentlyEditing = pathEdit && pathOwner === id;
    const nextEdit = !isCurrentlyEditing;
    setPathEdit(nextEdit, id);

    if (nextEdit) {
      if (!runSet.includes(id)) {
        toggleVehicleInRun(id);
      }
      const vehicle = vehicles.find((v) => v.id === id);
      const currentPts = paths[id];
      if (vehicle && (!currentPts || currentPts.length === 0)) {
        addPathPoint({ x: vehicle.position.x, y: 0.1, z: vehicle.position.z });
      }
    }
  };

  // Active path stats
  const activePathCount = pathOwner && paths[pathOwner] ? paths[pathOwner].length : 0;

  // Reset to initial positions ("Susun Ulang")
  const handleSusunUlang = () => {
    soundEngine.playUIClick();
    let restoredCount = 0;
    vehicles.forEach((v) => {
      const init = initialPositions[v.id];
      if (init) {
        updateObject(v.id, {
          position: { ...init.position },
          rotation: { ...init.rotation },
        });
        restoredCount++;
      } else if (paths[v.id] && paths[v.id].length > 0) {
        // Fallback to waypoint 0 (start line)
        const startPt = paths[v.id][0];
        updateObject(v.id, {
          position: { x: startPt.x, y: 0, z: startPt.z },
        });
        restoredCount++;
      }
    });
    if (restoredCount > 0) {
      soundEngine.playSuccess();
    }
  };

  // Camera cycle prev/next vehicle
  const handleCycleVehicle = (dir: -1 | 1) => {
    if (!vehicles.length) return;
    const vIds = vehicles.map((v) => v.id);
    const currIdx = focusedVehicleId ? vIds.indexOf(focusedVehicleId) : -1;
    const nextIdx = (currIdx + dir + vIds.length) % vIds.length;
    const nextVehicle = vehicles[nextIdx];
    if (nextVehicle) {
      setFocusedVehicleId(nextVehicle.id);
      setFocusTarget(nextVehicle.position);
      soundEngine.playUIClick();
    }
  };

  const speedKmH = Math.round(runSpeed * 3.6);

  return (
    <div className="absolute left-6 top-20 z-40 w-84 rounded-2xl bg-[#09151c]/95 border border-cyan-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl text-slate-100 flex flex-col overflow-hidden select-none animate-fadeIn font-sans">
      {/* 1. HEADER */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
          <span className="font-mono text-xs font-black tracking-wider text-cyan-400">RUN</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Drive Mode Indicator Badge (D) */}
          <span
            className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400"
            title="Drive Mode Controller"
          >
            D
          </span>
          <button
            type="button"
            onClick={() => toggleOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup / Sembunyikan Panel RUN"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        {/* 2. TOP ACTION BUTTONS */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* [Lintasan] Toggle */}
          <button
            type="button"
            onClick={() => handleTogglePathEdit()}
            className={`col-span-1 h-9 px-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all border ${
              pathEdit
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
            }`}
            title="Klik tanah untuk menggambar titik lintasan"
          >
            <Route className="w-3.5 h-3.5" />
            <span className="text-[11px]">{pathEdit ? 'Selesai' : 'Lintasan'}</span>
          </button>

          {/* [Undo] */}
          <button
            type="button"
            disabled={activePathCount === 0}
            onClick={() => {
              soundEngine.playUIClick();
              undoPathPoint();
            }}
            className="h-9 rounded-xl flex items-center justify-center border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Hapus titik terakhir lintasan"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* [Clear/Trash] */}
          <button
            type="button"
            disabled={activePathCount === 0}
            onClick={() => {
              if (window.confirm('Hapus seluruh lintasan kendaraan ini?')) {
                soundEngine.playUIClick();
                clearPath();
              }
            }}
            className="h-9 rounded-xl flex items-center justify-center border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-rose-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Hapus lintasan saat ini"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* [▶ RUN] Prominent Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              setRunning(!isRunning);
            }}
            className={`h-9 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black tracking-wide transition-all shadow-md active:scale-95 ${
              isRunning
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
            }`}
            title={isRunning ? 'Hentikan RUN' : 'Jalankan semua kendaraan di lintasannya'}
          >
            {isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RUN</span>
              </>
            )}
          </button>
        </div>

        {/* 3. ROW 2: SUSUN ULANG & JEDA */}
        <div className="grid grid-cols-2 gap-2">
          {/* Susun Ulang */}
          <button
            type="button"
            onClick={handleSusunUlang}
            disabled={isRunning}
            className="h-8 px-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-200 disabled:opacity-40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            title="Kembalikan semua kendaraan ke posisi awal / garis start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Susun Ulang</span>
          </button>

          {/* Jeda / Lanjut */}
          <button
            type="button"
            disabled={!isRunning}
            onClick={() => {
              soundEngine.playUIClick();
              setRunPaused(!isPaused);
            }}
            className={`h-8 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 ${
              isPaused
                ? 'bg-amber-500/30 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
                : 'border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
            }`}
            title={isPaused ? 'Lanjutkan RUN' : 'Jeda sementara (kendaraan berhenti di tempat)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Lanjut' : 'Jeda'}</span>
          </button>
        </div>

        {/* 4. SPEED SLIDER: Kecepatan RUN */}
        <div className="flex items-center gap-3 bg-slate-950/60 px-3 py-2 rounded-xl border border-white/5">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Kecepatan RUN</span>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={Math.round(runSpeed)}
            onChange={(e) => setRunSpeed(Number(e.target.value))}
            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="font-mono text-xs font-black text-cyan-300 whitespace-nowrap min-w-12 text-right">
            {speedKmH} km/j
          </span>
        </div>

        {/* 5. SECTION HEADER: KENDARAAN RUN · X/Y DIPILIH */}
        <div className="pt-1 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider uppercase text-cyan-400 font-mono">
              KENDARAAN RUN · {runSet.length}/{vehicles.length} DIPILIH
            </span>
          </div>

          {/* Sub-bar: Pilih semua | Batal | < | > */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUIClick();
                  selectAllVehicles(vehicles.map((v) => v.id));
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-cyan-300 transition-colors"
              >
                Pilih semua
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playUIClick();
                  clearRunSet();
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-400 transition-colors"
              >
                Batal
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => handleCycleVehicle(-1)}
                className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                title="Kamera ke kendaraan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleCycleVehicle(1)}
                className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
                title="Kamera ke kendaraan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Segment Pills: Bersamaan | Bergantian | Manual */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 text-[11px] font-bold text-center">
            {(['together', 'sequence', 'manual'] as RunMode[]).map((mode) => {
              const label = mode === 'together' ? 'Bersamaan' : mode === 'sequence' ? 'Bergantian' : 'Manual';
              const isActive = runMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    soundEngine.playUIClick();
                    setRunMode(mode);
                  }}
                  className={`py-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Manual Mode Quick Actions */}
          {isRunning && runMode === 'manual' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualAll(runSet)}
                className="flex-1 py-1 rounded-lg border border-cyan-500/30 text-cyan-300 bg-cyan-950/40 text-[10px] font-bold"
              >
                Jalankan semua
              </button>
              <button
                type="button"
                onClick={setManualNone}
                className="flex-1 py-1 rounded-lg border border-slate-700 text-slate-300 bg-slate-900/60 text-[10px] font-bold"
              >
                Hentikan semua
              </button>
            </div>
          )}

          {/* 6. VEHICLES LIST (Scrollable) */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {vehicles.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                Belum ada kendaraan di peta. Tempatkan mobil atau truk dari Asset Library.
              </div>
            ) : (
              vehicles.map((v, idx) => {
                const isSelected = runSet.includes(v.id);
                const isDisabled = runDisabled.includes(v.id);
                const vColor = getVehicleColor(idx);
                const hasPath = paths[v.id] && paths[v.id].length >= 2;
                const pathCount = paths[v.id]?.length || 0;
                const isHidden = hiddenPaths.includes(v.id);
                const isEditingThisPath = pathEdit && pathOwner === v.id;
                const isFocused = focusedVehicleId === v.id;

                // Status text matching screenshot
                const statusText = isDisabled
                  ? 'Nonaktif'
                  : !isSelected
                  ? 'Diam'
                  : isRunning && !isPaused
                  ? runMode === 'manual' && !manualGo.includes(v.id)
                    ? 'Diam'
                    : 'Berjalan'
                  : !hasPath
                  ? 'Tanpa lintasan'
                  : 'Diam';

                return (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-all text-xs relative ${
                      isDisabled
                        ? 'opacity-40 bg-slate-950/40 border-transparent'
                        : isSelected
                        ? 'bg-slate-900/80 border-cyan-500/30'
                        : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                    } ${isFocused ? 'border-b-2 border-b-blue-500 shadow-[0_2px_10px_rgba(59,130,246,0.3)]' : ''}`}
                  >
                    {/* Left: Checkbox + Dot + Name + Status */}
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleVehicleInRun(v.id)}
                        className="rounded border-slate-700 accent-cyan-400 cursor-pointer"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: vColor, boxShadow: `0 0 8px ${vColor}88` }}
                      />
                      <span
                        className="font-bold text-slate-200 truncate cursor-pointer hover:text-cyan-300"
                        onClick={() => {
                          setFocusedVehicleId(v.id);
                          setFocusTarget(v.position);
                        }}
                        title={v.name}
                      >
                        {v.name}
                      </span>
                      <span className="text-[10px] text-cyan-400/80 font-mono whitespace-nowrap">
                        {statusText}
                      </span>
                    </div>

                    {/* Right Action Icons: Focus | Path | Eye | Trash | On/Off */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Focus camera */}
                      <button
                        type="button"
                        onClick={() => {
                          setFocusedVehicleId(v.id);
                          setFocusTarget(v.position);
                          soundEngine.playUIClick();
                        }}
                        className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                        title="Fokus kamera ke kendaraan ini"
                      >
                        <Target className="w-3.5 h-3.5" />
                      </button>

                      {/* Route Path Edit button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePathEdit(v.id)}
                        className={`p-1 rounded transition-colors ${
                          isEditingThisPath
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        title={`Gambar lintasan kendaraan ini (${pathCount} titik)`}
                      >
                        <Route className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Path Visibility */}
                      <button
                        type="button"
                        disabled={pathCount === 0}
                        onClick={() => togglePathVisibility(v.id)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                        title={isHidden ? 'Tampilkan lintasan' : 'Sembunyikan lintasan'}
                      >
                        {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete this vehicle's path */}
                      <button
                        type="button"
                        disabled={pathCount === 0}
                        onClick={() => {
                          if (window.confirm(`Hapus lintasan ${v.name}?`)) {
                            clearPath(v.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5 disabled:opacity-30 transition-colors"
                        title="Hapus lintasan kendaraan ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* On/Off Switch */}
                      <button
                        type="button"
                        onClick={() => toggleVehicleDisabled(v.id)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                          isDisabled
                            ? 'bg-slate-800 text-slate-500 hover:text-slate-300'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        }`}
                        title="Aktifkan/Nonaktifkan untuk RUN"
                      >
                        {isDisabled ? 'Off' : 'On'}
                      </button>

                      {/* Manual Mode Go/Stop Single Vehicle */}
                      {isRunning && runMode === 'manual' && isSelected && !isDisabled && (
                        <button
                          type="button"
                          onClick={() => toggleManualVehicle(v.id)}
                          className={`p-1 rounded text-[10px] font-bold ${
                            manualGo.includes(v.id)
                              ? 'text-rose-400 hover:bg-rose-500/20'
                              : 'text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title={manualGo.includes(v.id) ? 'Hentikan' : 'Jalankan'}
                        >
                          {manualGo.includes(v.id) ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 7. FOOTER CHECKBOXES */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={followCam}
              onChange={(e) => setFollowCam(e.target.checked)}
              className="rounded border-slate-700 accent-cyan-400"
            />
            <span className="text-[11px] font-bold">Kamera ikuti</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={smoothCam}
              onChange={(e) => setSmoothCam(e.target.checked)}
              className="rounded border-slate-700 accent-cyan-400"
            />
            <span className="text-[11px] font-bold">Transisi halus</span>
          </label>
        </div>

        {/* SMART DIRECTOR & AUTO RECORD FOOTER TOGGLES */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-1.5 text-[10px] text-slate-300">
          <label className="flex items-center gap-1 cursor-pointer hover:text-cyan-300">
            <input
              type="checkbox"
              checked={autoRecord}
              onChange={(e) => setAutoRecord(e.target.checked)}
              className="rounded border-slate-700 accent-rose-500"
            />
            <span className="font-bold truncate">Auto-Rekam</span>
          </label>

          <label className="flex items-center gap-1 cursor-pointer hover:text-cyan-300">
            <input
              type="checkbox"
              checked={smartDirector}
              onChange={(e) => setSmartDirector(e.target.checked)}
              className="rounded border-slate-700 accent-cyan-400"
            />
            <span className="font-bold truncate">AI Sutradara</span>
          </label>

          <label className="flex items-center gap-1 cursor-pointer hover:text-cyan-300">
            <input
              type="checkbox"
              checked={cycleFocusCam}
              onChange={(e) => setCycleFocusCam(e.target.checked)}
              className="rounded border-slate-700 accent-blue-400"
            />
            <span className="font-bold truncate">Gilir Mobil</span>
          </label>
        </div>

        {/* 8. DYNAMIC HINTS */}
        <div className="p-2 rounded-xl bg-slate-950/70 border border-white/5 text-[10.5px] text-slate-400 flex items-start gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            {pathEdit && pathOwner ? (
              <>
                <span className="text-cyan-300 font-bold">Mode Lintasan Aktif:</span> Klik tanah untuk menambah titik ({activePathCount} titik). Titik hijau = garis start.
              </>
            ) : runSet.length > 0 ? (
              'Tiap kendaraan berjalan di lintasannya sendiri; klik [▶ RUN] untuk memulai simulasi.'
            ) : (
              'Centang kendaraan di atas lalu klik [Lintasan] untuk menggambar jalur lintasan.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
