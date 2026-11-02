import { useEffect, useRef } from 'react';
import { useScraperStore } from '../../stores/useScraperStore';
import { scrapeBangPayAssets } from './assetScraperEngine';

/**
 * Hook that triggers automatic scraping of remote BangPay GLB assets upon app startup
 */
export function useAutoAssetScraper() {
  const isAutoScrapeEnabled = useScraperStore((s) => s.isAutoScrapeEnabled);
  const lastSyncTime = useScraperStore((s) => s.lastSyncTime);
  const isScraping = useScraperStore((s) => s.isScraping);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isAutoScrapeEnabled || hasTriggeredRef.current || isScraping) {
      return;
    }

    // Debounce: sync at most once every 10 minutes unless first time
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    if (lastSyncTime && now - lastSyncTime < tenMinutes) {
      return;
    }

    hasTriggeredRef.current = true;

    // Small delay (1.5s) to allow 3D canvas and audio context to initialize smoothly first
    const timer = setTimeout(() => {
      scrapeBangPayAssets().catch((err) => {
        console.warn('Background auto-scrape skipped/failed:', err);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAutoScrapeEnabled, lastSyncTime, isScraping]);
}

