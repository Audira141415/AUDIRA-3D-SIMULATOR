import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Megaphone,
  Cloud,
  CircleDot,
  Music,
  Volume2,
  VolumeX,
  Clock,
  Play,
  Pause,
  Square,
  SkipForward,
  Plus,
  Check,
  Disc3,
} from 'lucide-react';
import { useVehicleAudioStore, EngineProfile } from '../../stores/useVehicleAudioStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { soundEngine } from '../audio/soundEngine';

export const VehicleAudioModal: React.FC = () => {
  const isAudioModalOpen = useVehicleAudioStore((s) => s.isAudioModalOpen);
  const closeAudioModal = useVehicleAudioStore((s) => s.closeAudioModal);
  const simVehicleName = useEditorStore((s) => s.simVehicleName);

  // Engine profile
  const engineProfile = useVehicleAudioStore((s) => s.engineProfile);
  const setEngineProfile = useVehicleAudioStore((s) => s.setEngineProfile);

  // Custom audio files
  const customEngineFileName = useVehicleAudioStore((s) => s.customEngineFileName);
  const customHornFileName = useVehicleAudioStore((s) => s.customHornFileName);
  const setCustomEngineFile = useVehicleAudioStore((s) => s.setCustomEngineFile);
  const setCustomHornFile = useVehicleAudioStore((s) => s.setCustomHornFile);

  // Mixer
  const engineVolume = useVehicleAudioStore((s) => s.engineVolume);
  const engineMuted = useVehicleAudioStore((s) => s.engineMuted);
  const setEngineVolume = useVehicleAudioStore((s) => s.setEngineVolume);
  const toggleEngineMute = useVehicleAudioStore((s) => s.toggleEngineMute);

  const hornVolume = useVehicleAudioStore((s) => s.hornVolume);
  const hornMuted = useVehicleAudioStore((s) => s.hornMuted);
  const setHornVolume = useVehicleAudioStore((s) => s.setHornVolume);
  const toggleHornMute = useVehicleAudioStore((s) => s.toggleHornMute);

  const brakeVolume = useVehicleAudioStore((s) => s.brakeVolume);
  const brakeMuted = useVehicleAudioStore((s) => s.brakeMuted);
  const setBrakeVolume = useVehicleAudioStore((s) => s.setBrakeVolume);
  const toggleBrakeMute = useVehicleAudioStore((s) => s.toggleBrakeMute);

  const musicVolume = useVehicleAudioStore((s) => s.musicVolume);
  const musicMuted = useVehicleAudioStore((s) => s.musicMuted);
  const setMusicVolume = useVehicleAudioStore((s) => s.setMusicVolume);
  const toggleMusicMute = useVehicleAudioStore((s) => s.toggleMusicMute);

  const ambientVolume = useVehicleAudioStore((s) => s.ambientVolume);
  const ambientMuted = useVehicleAudioStore((s) => s.ambientMuted);
  const setAmbientVolume = useVehicleAudioStore((s) => s.setAmbientVolume);
  const toggleAmbientMute = useVehicleAudioStore((s) => s.toggleAmbientMute);

  const blinkerVolume = useVehicleAudioStore((s) => s.blinkerVolume);
  const blinkerMuted = useVehicleAudioStore((s) => s.blinkerMuted);
  const setBlinkerVolume = useVehicleAudioStore((s) => s.setBlinkerVolume);
  const toggleBlinkerMute = useVehicleAudioStore((s) => s.toggleBlinkerMute);

  // Music Player
  const playlist = useVehicleAudioStore((s) => s.playlist);
  const currentTrackIndex = useVehicleAudioStore((s) => s.currentTrackIndex);
  const isPlayingMusic = useVehicleAudioStore((s) => s.isPlayingMusic);
  const currentTime = useVehicleAudioStore((s) => s.currentTime);
  const setCurrentTime = useVehicleAudioStore((s) => s.setCurrentTime);
  const togglePlayMusic = useVehicleAudioStore((s) => s.togglePlayMusic);
  const stopMusic = useVehicleAudioStore((s) => s.stopMusic);
  const nextTrack = useVehicleAudioStore((s) => s.nextTrack);
  const addCustomTrack = useVehicleAudioStore((s) => s.addCustomTrack);
  const removeTrack = useVehicleAudioStore((s) => s.removeTrack);

  // File input refs
  const engineFileRef = useRef<HTMLInputElement>(null);
  const hornFileRef = useRef<HTMLInputElement>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);

  // Active track
  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Live timer tick for music progress
  useEffect(() => {
    let timer: any;
    if (isPlayingMusic && currentTrack) {
      timer = setInterval(() => {
        const nextTime = currentTime + 1;
        if (nextTime >= currentTrack.duration) {
          nextTrack();
        } else {
          setCurrentTime(nextTime);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingMusic, currentTime, currentTrack, nextTrack, setCurrentTime]);

  if (!isAudioModalOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEngineUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomEngineFile(url, file.name);
      soundEngine.playSuccess();
    }
  };

  const handleHornUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomHornFile(url, file.name);
      soundEngine.playSuccess();
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addCustomTrack({
        id: `custom-track-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Pengguna',
        url: url,
        duration: 240, // 4:00 default
        isCustom: true,
      });
      soundEngine.playSuccess();
    }
  };

  const handleTestHorn = () => {
    soundEngine.playHorn();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pr-6 select-none pointer-events-auto bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={engineFileRef}
        accept="audio/*"
        className="hidden"
        onChange={handleEngineUpload}
      />
      <input
        type="file"
        ref={hornFileRef}
        accept="audio/*"
        className="hidden"
        onChange={handleHornUpload}
      />
      <input
        type="file"
        ref={musicFileRef}
        accept="audio/*"
        className="hidden"
        onChange={handleMusicUpload}
      />

      {/* Main Vehicle Audio Panel matching Screenshot */}
      <div className="w-[370px] max-h-[92vh] flex flex-col bg-[#07131e]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.3)] text-slate-100 overflow-hidden text-xs">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <h3 className="font-extrabold uppercase tracking-wider text-cyan-300 text-[11px]">
              AUDIO KENDARAAN
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAudioModal}
            className="w-6 h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Active Vehicle Slug Badge */}
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold truncate">
            {simVehicleName || 'scania_r440_red_auto_eyes_v2'}
          </div>

          {/* Section: Profil Mesin */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Profil mesin</span>
              <select
                value={engineProfile}
                onChange={(e) => setEngineProfile(e.target.value as EngineProfile)}
                className="bg-slate-900 border border-cyan-500/40 text-cyan-300 font-semibold rounded-md px-2.5 py-1 text-[11px] outline-none cursor-pointer focus:border-cyan-400"
              >
                <option value="truck">Truk / Bus</option>
                <option value="sport">Mobil Sport</option>
                <option value="supercar">Supercar / Hyper</option>
                <option value="sedan">Mobil Kota / Sedan</option>
                <option value="tractor">Traktor / Alat Berat</option>
                <option value="plane">Pesawat Terbang</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Suara sintesis sesuai kelas, bukan rekaman mesin asli. Unggah file untuk suara sendiri.
            </p>
          </div>

          {/* Section: Custom Engine File */}
          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 truncate max-w-[190px]">
                File mesin:{' '}
                <strong className="text-cyan-300 font-mono">
                  {customEngineFileName || 'mesin scania.mp3'}
                </strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => engineFileRef.current?.click()}
                  className="p-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 transition-colors"
                  title="Upload MP3 Suara Mesin"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                {customEngineFileName && (
                  <button
                    type="button"
                    onClick={() => setCustomEngineFile(null, null)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Suara Kustom"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Custom Horn File */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 truncate max-w-[190px]">
                File klakson:{' '}
                <strong className="text-cyan-300 font-mono">
                  {customHornFileName || 'Jokowi.mp3'}
                </strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => hornFileRef.current?.click()}
                  className="p-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 transition-colors"
                  title="Upload MP3 Klakson Kustom (Telolet / Spoke)"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                {customHornFileName && (
                  <button
                    type="button"
                    onClick={() => setCustomHornFile(null, null)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Klakson Kustom"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Test Horn Button */}
            <button
              type="button"
              onClick={handleTestHorn}
              className="w-full py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Klakson (B)</span>
            </button>
          </div>

          {/* Section: PENGATURAN AUDIO (Mixer Sliders) */}
          <div className="space-y-2.5 border-t border-slate-800/80 pt-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400/90">
              PENGATURAN AUDIO
            </h4>

            {/* 1. Suara Mesin */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!engineMuted}
                    onChange={toggleEngineMute}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <Cloud className="w-3 h-3 text-cyan-400" />
                  <span>Suara Mesin</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{engineVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={engineVolume}
                onChange={(e) => setEngineVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 2. Suara Klakson */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!hornMuted}
                    onChange={toggleHornMute}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <Megaphone className="w-3 h-3 text-cyan-400" />
                  <span>Suara Klakson</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{hornVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hornVolume}
                onChange={(e) => setHornVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 3. Suara Rem */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!brakeMuted}
                    onChange={toggleBrakeMute}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <CircleDot className="w-3 h-3 text-cyan-400" />
                  <span>Suara Rem</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{brakeVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brakeVolume}
                onChange={(e) => setBrakeVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 4. Musik */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!musicMuted}
                    onChange={toggleMusicMute}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <Music className="w-3 h-3 text-cyan-400" />
                  <span>Musik</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMusicVolume(val);
                  soundEngine.setMusicVolume(val);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 5. Suara Lingkungan */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!ambientMuted}
                    onChange={() => {
                      toggleAmbientMute();
                      if (ambientMuted) {
                        soundEngine.startAmbience();
                      } else {
                        soundEngine.stopAmbience();
                      }
                    }}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                  <span>Suara Lingkungan {ambientMuted && '(bisu)'}</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{ambientVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 6. Suara Sein */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={!blinkerMuted}
                    onChange={toggleBlinkerMute}
                    className="accent-cyan-400 w-3.5 h-3.5 rounded"
                  />
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Suara Sein</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold">{blinkerVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blinkerVolume}
                onChange={(e) => setBlinkerVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Section: PEMUTAR MUSIK */}
          <div className="space-y-2.5 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400/90 flex items-center gap-1.5">
                <Music className="w-3 h-3" />
                PEMUTAR MUSIK
              </h4>
            </div>

            {/* Add Custom Track Button */}
            <button
              type="button"
              onClick={() => musicFileRef.current?.click()}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-[11px] font-bold transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tambah lagu (MP3/WAV/OGG)</span>
            </button>

            {/* Active Track Player Container */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 truncate text-[11px]">
                  {currentTrack ? currentTrack.title : 'Mardua Holong'}
                </span>
                {currentTrack?.isCustom && (
                  <button
                    type="button"
                    onClick={() => removeTrack(currentTrack.id)}
                    className="text-slate-500 hover:text-rose-400"
                    title="Hapus Lagu Ini"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Timeline Slider */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={currentTrack?.duration || 298}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span>{formatTime(currentTrack?.duration || 298)}</span>
              </div>

              {/* Player Buttons */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={togglePlayMusic}
                  className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all active:scale-95 cursor-pointer"
                  title={isPlayingMusic ? 'Jeda' : 'Putar'}
                >
                  {isPlayingMusic ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={stopMusic}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Hentikan Musik"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={nextTrack}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Lagu Berikutnya"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
