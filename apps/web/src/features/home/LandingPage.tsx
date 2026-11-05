import React, { useRef, useState, useEffect } from 'react';
import {
  Boxes,
  Play,
  Wrench,
  Sparkles,
  KeyRound,
  DownloadCloud,
  Volume2,
  VolumeX,
  Compass,
  Trophy,
  Truck,
  Car,
  Layers,
  Camera,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useLicenseStore } from '../../stores/useLicenseStore';
import { useKreatorStudioStore } from '../../stores/useKreatorStudioStore';
import { useScraperStore } from '../../stores/useScraperStore';
import { soundEngine } from '../audio/soundEngine';

interface LandingPageProps {
  onEnterSimulator: (mode?: 'drive' | 'edit') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterSimulator }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const isLicensed = useLicenseStore((s) => s.isLicensed);
  const setLicenseModalOpen = useLicenseStore((s) => s.setModalOpen);
  const openKreatorStudio = useKreatorStudioStore((s) => s.openStudio);
  const setScraperModalOpen = useScraperStore((s) => s.setModalOpen);

  useEffect(() => {
    // Attempt auto-play with muted background video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback handled by poster
      });
    }
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playCarnivalMusic();
    }
  };

  const handlePlayClick = () => {
    soundEngine.playUIClick();
    onEnterSimulator('drive');
  };

  const handleEditClick = () => {
    soundEngine.playUIClick();
    onEnterSimulator('edit');
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto overflow-x-hidden bg-[#070b14] text-slate-100 font-sans select-none scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* 1. CINEMATIC VIDEO / POSTER BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/media/kids-home-720.webm"
          poster="/media/kids-home-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-105 transition-opacity duration-1000"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/75 to-[#070b14]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,11,20,0.85)_100%)]" />
      </div>

      {/* 2. TOP FLOATING NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 px-6 z-40 flex items-center justify-between backdrop-blur-md bg-[#070b14]/80 border-b border-white/10">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Boxes className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-sm tracking-wider text-white">AUDIRA</span>
              <span className="font-extrabold text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                3D
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Construction Simulator
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => handlePlayClick()}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulator</span>
          </button>

          <button
            onClick={() => handleEditClick()}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 font-bold transition-all flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>World Editor</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUIClick();
              openKreatorStudio();
            }}
            className="px-3 py-1.5 rounded-lg text-amber-300 hover:bg-amber-500/10 font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kreator Studio</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playUIClick();
              setScraperModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 font-bold transition-all flex items-center gap-1.5"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Aset GLB</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-900 border-white/10 text-slate-500 hover:text-slate-300'
                : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}
            title={isMuted ? 'Nyalakan Musik & Audio' : 'Matikan Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* License Status Badge */}
          <button
            onClick={() => {
              soundEngine.playUIClick();
              setLicenseModalOpen(true);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              isLicensed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            }`}
          >
            {isLicensed ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIP CREATOR</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>LISENSI</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 3. HERO CONTENT SECTION */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 max-w-6xl mx-auto">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-wider uppercase font-mono text-[11px]">
              v1.0.0 WebGL &amp; Desktop Native Ready
            </span>
          </div>

          {/* Big Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-2xl">
            AUDIRA 3D <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
              CONSTRUCTION SIMULATOR
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium drop-shadow-md">
            World builder 3D generasi baru, vehicle simulator, dan creator studio profesional langsung di browser WebGL
            maupun versi Desktop GPU 144Hz. Bangun sirkuit impian, kemudikan supercar &amp; alat berat, serta rekam konten
            sinematik tanpa batas.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handlePlayClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>MULAI SIMULATOR</span>
            </button>

            <button
              onClick={handleEditClick}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-sm tracking-wider border border-white/20 hover:border-cyan-400/60 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>3D WORLD BUILDER</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playUIClick();
                openKreatorStudio();
              }}
              className="px-5 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-sm tracking-wider border border-amber-400/50 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>KREATOR STUDIO (10 TOOLS)</span>
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-2xl border-t border-white/10">
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <div className="text-xl font-black text-cyan-400 font-mono">94+</div>
              <div className="text-[11px] text-slate-400">Model GLB Lengkap</div>
            </div>
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <div className="text-xl font-black text-amber-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-400">Ground Snapping (y&ge;0)</div>
            </div>
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <div className="text-xl font-black text-emerald-400 font-mono">144 Hz</div>
              <div className="text-[11px] text-slate-400">Desktop GPU Uncapped</div>
            </div>
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <div className="text-xl font-black text-purple-400 font-mono">60 FPS</div>
              <div className="text-[11px] text-slate-400">4K WebM Recorder</div>
            </div>
          </div>
        </div>

        {/* 4. GAME MODES PRESETS CARDS */}
        <div className="mt-20 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                PILIH PRESET DUNIA &amp; SIMULASI
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pilih salah satu mode untuk langsung terjun ke dalam aksi atau rancang duniamu sendiri
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Sirkuit Balap */}
            <div
              onClick={() => handlePlayClick()}
              className="group bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-cyan-400/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_rgba(6,182,212,0.2)] cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                    Sirkuit Balap &amp; Drifting
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Sirkuit Albert Park F1, McLaren W1, Supra GT, dan jalanan looping torus 360° berkecepatan tinggi.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-400 font-bold">
                <span>Mainkan Mode Balap</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Zona Konstruksi */}
            <div
              onClick={() => handlePlayClick()}
              className="group bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-amber-400/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                    Konstruksi &amp; Alat Berat
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Simulasi truk pengangkut Scania R440, traktor MTZ-80, perataan tanah, dan pembangunan jembatan baja.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Mulai Konstruksi</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Taman Wahana */}
            <div
              onClick={() => handlePlayClick()}
              className="group bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-emerald-400/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                    Kids Playground &amp; Wahana
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Dinosaurus T-Rex rideable, bebek kuning, arena mandi bola, balon udara, dan seluncuran warna-warni.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Jelajahi Playground</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Kreator Studio */}
            <div
              onClick={() => {
                soundEngine.playUIClick();
                openKreatorStudio();
              }}
              className="group bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-purple-400/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_25px_rgba(168,85,247,0.2)] cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base group-hover:text-purple-300 transition-colors">
                    Kreator Studio Magic Pro
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    10 tools kreasi lengkap: rigging karakter, modifikasi mobil, efek partikel, dan AI image-to-3D.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-400 font-bold">
                <span>Buka Kreator Studio</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 5. FOOTER */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AUDIRA 3D SIMULATOR</span>
            <span>&bull;</span>
            <span>Created by Agus Dwi Rianto (AUDIRA)</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://audira.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <span>audira.my.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <span>Fastify API Port 3000 Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

