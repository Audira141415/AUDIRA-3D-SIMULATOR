import { create } from 'zustand';
import { AssetDefinition } from '@audira/shared';

interface ScraperState {
  isAutoScrapeEnabled: boolean;
  isScraping: boolean;
  lastSyncTime: number | null;
  discoveredCount: number;
  syncLogs: string[];
  isModalOpen: boolean;
  scrapedAssets: AssetDefinition[];

  toggleAutoScrape: (enabled?: boolean) => void;
  setModalOpen: (open: boolean) => void;
  addLog: (log: string) => void;
  clearLogs: () => void;
  setScraping: (scraping: boolean) => void;
  setScrapedAssets: (assets: AssetDefinition[]) => void;
  recordSyncFinished: (newCount: number, assets: AssetDefinition[]) => void;
}

const STORAGE_KEY_AUTO = 'audira_auto_scrape_enabled';
const STORAGE_KEY_TIME = 'audira_scraper_last_sync';
const STORAGE_KEY_ASSETS = 'audira_scraped_assets_catalog';

function getInitialAutoScrape(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEY_AUTO);
    return val !== null ? val === 'true' : true; // Default true: auto scrape on start
  } catch {
    return true;
  }
}

function getInitialLastSync(): number | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY_TIME);
    return val ? Number(val) : null;
  } catch {
    return null;
  }
}

function getInitialScrapedAssets(): AssetDefinition[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY_ASSETS);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export const useScraperStore = create<ScraperState>((set, get) => ({
  isAutoScrapeEnabled: getInitialAutoScrape(),
  isScraping: false,
  lastSyncTime: getInitialLastSync(),
  discoveredCount: getInitialScrapedAssets().length,
  syncLogs: [],
  isModalOpen: false,
  scrapedAssets: getInitialScrapedAssets(),

  toggleAutoScrape: (enabled) => {
    const next = enabled !== undefined ? enabled : !get().isAutoScrapeEnabled;
    try {
      localStorage.setItem(STORAGE_KEY_AUTO, String(next));
    } catch {}
    set({ isAutoScrapeEnabled: next });
  },

  setModalOpen: (open) => set({ isModalOpen: open }),

  addLog: (log) => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const formatted = `[${timestamp}] ${log}`;
    set((state) => ({
      syncLogs: [...state.syncLogs.slice(-99), formatted],
    }));
  },

  clearLogs: () => set({ syncLogs: [] }),

  setScraping: (scraping) => set({ isScraping: scraping }),

  setScrapedAssets: (assets) => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch {}
    set({ scrapedAssets: assets, discoveredCount: assets.length });
  },

  recordSyncFinished: (newCount, assets) => {
    const now = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY_TIME, String(now));
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch {}
    set({
      isScraping: false,
      lastSyncTime: now,
      discoveredCount: assets.length,
      scrapedAssets: assets,
    });
  },
}));

