import React from 'react';
import {
  Video,
  Square,
  Sparkles,
  Camera,
  X,
  Compass,
  ArrowUp,
  RotateCw,
  Eye,
  Sliders,
  Maximize2,
  Film,
} from 'lucide-react';
import { useCameraStore, CameraTrackingAngle } from '../../stores/useCameraStore';
import { useVideoRecordStore } from '../../stores/useVideoRecordStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';

const TRACKING_ANGLES: { id: CameraTrackingAngle; label: string; icon: string; desc: string }[] = [
  { id: 'chase', label: 'Belakang', icon: '🎬', desc: 'Mengikuti dari belakang objek' },
  { id: 'front', label: 'Depan / Kap', icon: '🚘', desc: 'Menatap dari arah depan objek' },
  { id: 'side-left', label: 'Samping Kiri', icon: '◀', desc: 'Sudut samping kiri sinematik' },
  { id: 'side-right', label: 'Samping Kanan', icon: '▶', desc: 'Sudut samping kanan dinamis' },
  { id: 'drone', label: 'Atas / Drone', icon: '🚁', desc: 'Pandangan udara dari atas' },
  { id: 'orbit-360', label: 'Orbit 360°', icon: '🔄', desc: 'Putaran sinematik otomatis 360°' },
  { id: 'low-stunt', label: 'Sudut Rendah', icon: '🛹', desc: 'Sudut rendah dekat roda & tanah' },
  { id: 'director', label: 'AI Director', icon: '🎬', desc: 'Sutradara cerdas otomatis cut sudut' },
  { id: 'free', label: 'Bebas', icon: '🌐', desc: 'Kamera manual orbit controls' },
];

export const CinematicVideoPanel: React.FC = () => {
  const isCinematicPanelOpen = useCameraStore((s) => s.isCinematicPanelOpen);
  const toggleCinematicPanel = useCameraStore((s) => s.toggleCinematicPanel);
  const trackingAngle = useCameraStore((s) => s.trackingAngle);
  const setTrackingAngle = useCameraStore((s) => s.setTrackingAngle);
  const trackingDistance = useCameraStore((s) => s.trackingDistance);
  const setTrackingDistance = useCameraStore((s) => s.setTrackingDistance);
  const trackingHeight = useCameraStore((s) => s.trackingHeight);
  const setTrackingHeight = useCameraStore((s) => s.setTrackingHeight);
  const orbitSpeed = useCameraStore((s) => s.orbitSpeed);
  const setOrbitSpeed = useCameraStore((s) => s.setOrbitSpeed);

  const isRecording = useVideoRecordStore((s) => s.isRecording);
  const recordDuration = useVideoRecordStore((s) => s.recordDuration);
  const startRecording = useVideoRecordStore((s) => s.startRecording);
  const stopRecording = useVideoRecordStore((s) => s.stopRecording);
  const targetFPS = useVideoRecordStore((s) => s.targetFPS);
  const setTargetFPS = useVideoRecordStore((s) => s.setTargetFPS);
  const videoQuality = useVideoRecordStore((s) => s.videoQuality);
  const setVideoQuality = useVideoRecordStore((s) => s.setVideoQuality);
  const autoRecordOnRun = useVideoRecordStore((s) => s.autoRecordOnRun);
  const setAutoRecordOnRun = useVideoRecordStore((s) => s.setAutoRecordOnRun);
  const autoRecordOnDrive = useVideoRecordStore((s) => s.autoRecordOnDrive);
  const setAutoRecordOnDrive = useVideoRecordStore((s) => s.setAutoRecordOnDrive);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const objects = useWorldStore((s) => s.objects);
  const isPlaying = useEditorStore((s) => s.isPlaying);

  if (!isCinematicPanelOpen) return null;

  // Format record duration as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Find target object name
  const activeObj = selectedObjectId ? objects.find((o) => o.id === selectedObjectId) : null;
  const targetName = isPlaying
    ? 'Kendaraan Simulasi Aktif'
    : activeObj
    ? activeObj.name
    : objects.length > 0
    ? 'Objek Terakhir (Default)'
    : 'Pusat Scene (0,0,0)';

  return (
    <div className="fixed top-16 right-4 z-40 w-80 bg-[#091118]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(0,210,255,0.2)] text-white p-4 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-rose-500 flex items-center justify-center shadow-lg">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wider uppercase text-cyan-300">
              Kamera Sinematik &amp; Perekam
            </h3>
            <p className="text-[10px] font-mono text-slate-400">Multi-Angle &amp; Screen Capture</p>
          </div>
        </div>
        <button
          onClick={toggleCinematicPanel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 1. VIDEO RECORDER SECTION */}
      <div className="bg-slate-950/70 border border-white/10 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-rose-400" />
            Perekam Video (WebM / HD)
          </span>
          {isRecording ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[10px] font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              REC {formatTime(recordDuration)}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-500">SIAP REKAM</span>
          )}
        </div>

        {/* Record Button */}
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>BERHENTI &amp; UNDUH VIDEO ({formatTime(recordDuration)})</span>
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all"
          >
            <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span>MULAI REKAM VIDEO (60 FPS)</span>
          </button>
        )}

        {/* FPS & Quality Switcher */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-500">FPS:</span>
            <button
              onClick={() => setTargetFPS(60)}
              className={`px-1.5 py-0.5 rounded ${
                targetFPS === 60 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              60
            </button>
            <button
              onClick={() => setTargetFPS(30)}
              className={`px-1.5 py-0.5 rounded ${
                targetFPS === 30 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              30
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500">Bitrate:</span>
            <button
              onClick={() => setVideoQuality('high')}
              className={`px-1.5 py-0.5 rounded ${
                videoQuality === 'high' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              HD (6M)
            </button>
            <button
              onClick={() => setVideoQuality('ultra')}
              className={`px-1.5 py-0.5 rounded ${
                videoQuality === 'ultra' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-white'
              }`}
            >
              Ultra (12M)
            </button>
          </div>
        </div>
      
        {/* Auto Record Toggles */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-1.5 text-[10px]">
          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Auto-Record saat ▶ RUN
            </span>
            <input
              type="checkbox"
              checked={autoRecordOnRun}
              onChange={(e) => setAutoRecordOnRun(e.target.checked)}
              className="rounded border-slate-700 accent-cyan-400 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Auto-Record saat Menyetir
            </span>
            <input
              type="checkbox"
              checked={autoRecordOnDrive}
              onChange={(e) => setAutoRecordOnDrive(e.target.checked)}
              className="rounded border-slate-700 accent-amber-400 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 2. TARGET OBJECT INFO */}
      <div className="bg-slate-950/40 border border-white/5 rounded-lg px-2.5 py-1.5 mb-3 flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-400">Target Mengikuti:</span>
        <span className="text-cyan-300 font-bold truncate max-w-[150px]">{targetName}</span>
      </div>

      {/* 3. MULTI-ANGLE TRACKING SELECTOR */}
      <div className="mb-3">
        <label className="text-[11px] font-bold text-slate-300 mb-1.5 block flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          Sudut Pandang Kamera (Angles)
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {TRACKING_ANGLES.map((angle) => {
            const isActive = trackingAngle === angle.id;
            return (
              <button
                key={angle.id}
                onClick={() => setTrackingAngle(angle.id)}
                className={`p-2 rounded-lg text-left transition-all border flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold'
                    : 'bg-slate-950/60 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-white/20'
                }`}
                title={angle.desc}
              >
                <span className="text-base">{angle.icon}</span>
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold truncate">{angle.label}</div>
                  <div className="text-[8px] font-mono text-slate-400 truncate">{angle.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SLIDERS (DISTANCE, HEIGHT, SPEED) */}
      <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 space-y-2 text-[10px]">
        {/* Distance Slider */}
        <div>
          <div className="flex justify-between font-mono text-slate-400 mb-0.5">
            <span>Jarak Kamera (Distance):</span>
            <span className="text-cyan-300 font-bold">{trackingDistance}m</span>
          </div>
          <input
            type="range"
            min="3"
            max="45"
            step="1"
            value={trackingDistance}
            onChange={(e) => setTrackingDistance(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Height Slider */}
        <div>
          <div className="flex justify-between font-mono text-slate-400 mb-0.5">
            <span>Ketinggian Kamera (Height):</span>
            <span className="text-cyan-300 font-bold">{trackingHeight}m</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="0.5"
            value={trackingHeight}
            onChange={(e) => setTrackingHeight(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Orbit Speed (Visible when Orbit 360 is active) */}
        {trackingAngle === 'orbit-360' && (
          <div>
            <div className="flex justify-between font-mono text-slate-400 mb-0.5">
              <span>Kecepatan Putaran (Orbit):</span>
              <span className="text-amber-300 font-bold">{orbitSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              value={orbitSpeed}
              onChange={(e) => setOrbitSpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};
