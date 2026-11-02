import React from 'react';
import {
  DownloadCloud,
  CheckCircle2,
  RefreshCw,
  Terminal,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useScraperStore } from '../../stores/useScraperStore';
import { useAssetStore } from '../../stores/useAssetStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { scrapeBangPayAssets } from './assetScraperEngine';
import { soundEngine } from '../audio/soundEngine';

export const AssetScraperModal: React.FC = () => {
  const isModalOpen = useScraperStore((s) => s.isModalOpen);
  const setModalOpen = useScraperStore((s) => s.setModalOpen);
  const isAutoScrapeEnabled = useScraperStore((s) => s.isAutoScrapeEnabled);
  const toggleAutoScrape = useScraperStore((s) => s.toggleAutoScrape);
  const isScraping = useScraperStore((s) => s.isScraping);
  const lastSyncTime = useScraperStore((s) => s.lastSyncTime);
  const syncLogs = useScraperStore((s) => s.syncLogs);
  const clearLogs = useScraperStore((s) => s.clearLogs);
  const scrapedAssets = useScraperStore((s) => s.scrapedAssets);

  const localAssets = useAssetStore((s) => s.assets);
  const addObject = useWorldStore((s) => s.addObject);

  if (!isModalOpen) return null;

  const handleManualSync = () => {
    soundEngine.playUIClick();
    scrapeBangPayAssets({ force: true });
  };

  const handleSpawnScrapedAsset = (asset: any) => {
    soundEngine.playPlacement();
    addObject({
      id: `spawn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      assetId: asset.id,
      name: asset.name,
      category: asset.category,
      type: asset.type,
      position: { x: (Math.random() - 0.5) * 10, y: 0, z: (Math.random() - 0.5) * 10 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      locked: false,
    });
  };

  const lastSyncFormatted = lastSyncTime
    ? new Date(lastSyncTime).toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'medium',
      })
    : 'Belum pernah sinkron';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="w-full max-w-2xl bg-[#09151c]/95 border border-cyan-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-slate-100 max-h-[85vh]">
        {/* 1. Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <DownloadCloud className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-wider text-cyan-300">
                  AUTO-SCRAPER ASET 3D GLB
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  CLOUDFLARE R2 LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Sinkronisasi otomatis model 3D remote dari BangPay Simulator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Top Stats Bar */}
        <div className="grid grid-cols-3 gap-2 p-3.5 border-b border-white/5 bg-slate-950/40 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono">TOTAL ASET SISTEM</span>
            <span className="text-base font-black text-cyan-300 font-mono">{localAssets.length} Model</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono">MODEL SCRAPED DISK</span>
            <span className="text-base font-black text-amber-300 font-mono">{scrapedAssets.length} Terdeteksi</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-mono">SINKRONISASI TERAKHIR</span>
            <span className="text-[11px] font-bold text-slate-300 truncate">{lastSyncFormatted}</span>
          </div>
        </div>

        {/* 3. Action Bar & Automation Toggle */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-slate-950/60">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={isAutoScrapeEnabled}
              onChange={(e) => toggleAutoScrape(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 accent-cyan-400 cursor-pointer"
            />
            <span>Auto-Scrape setiap kali web/aplikasi dibuka</span>
          </label>

          <button
            type="button"
            disabled={isScraping}
            onClick={handleManualSync}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isScraping
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 cursor-wait'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Sedang Scraping...' : 'Jalankan Scraping Sekarang'}</span>
          </button>
        </div>

        {/* 4. Terminal Logs Section */}
        <div className="p-4 flex flex-col gap-1.5 flex-1 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              LIVE SCRAPER LOGS
            </span>
            <button
              type="button"
              onClick={clearLogs}
              className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Bersihkan Log
            </button>
          </div>

          <div className="h-32 bg-slate-950/90 border border-white/10 rounded-xl p-2.5 font-mono text-[10.5px] overflow-y-auto space-y-1 text-slate-300 scrollbar-thin">
            {syncLogs.length === 0 ? (
              <div className="text-slate-500 italic">
                Klik tombol &quot;Jalankan Scraping Sekarang&quot; di atas atau aktifkan auto-scrape untuk memeriksa pembaruan aset GLB dari server BangPay secara otomatis.
              </div>
            ) : (
              syncLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('✨')
                      ? 'text-cyan-300 font-bold'
                      : log.includes('❌')
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 5. Recently Scraped Assets Gallery */}
        {scrapedAssets.length > 0 && (
          <div className="px-4 pb-4 flex flex-col gap-2">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase font-mono">
              DAFTAR ASET REMOTE TERIDENTIFIKASI ({scrapedAssets.length})
            </span>

            <div className="max-h-36 overflow-y-auto grid grid-cols-2 gap-1.5 pr-1 scrollbar-thin">
              {scrapedAssets.slice(0, 30).map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      className="w-7 h-7 rounded-lg object-cover bg-slate-950 border border-white/10 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/thumbs/lightning.webp';
                      }}
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-200 truncate text-[11px]">{asset.name}</div>
                      <div className="text-[9px] font-mono text-cyan-400 uppercase">{asset.category}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSpawnScrapedAsset(asset)}
                    className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex-shrink-0 transition-all"
                    title="Tempatkan di Scene 3D"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

