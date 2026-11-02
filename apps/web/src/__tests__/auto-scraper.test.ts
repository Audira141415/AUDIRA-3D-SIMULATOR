import { describe, it, expect, beforeEach } from 'vitest';
import { useScraperStore } from '../stores/useScraperStore';
import { AssetDefinition } from '@audira/shared';

describe('Auto-Scraper Store & Logic', () => {
  beforeEach(() => {
    useScraperStore.setState({
      isAutoScrapeEnabled: true,
      isScraping: false,
      lastSyncTime: null,
      discoveredCount: 0,
      syncLogs: [],
      isModalOpen: false,
      scrapedAssets: [],
    });
  });

  it('should initialize with auto-scrape enabled by default', () => {
    const store = useScraperStore.getState();
    expect(store.isAutoScrapeEnabled).toBe(true);
    expect(store.isScraping).toBe(false);
    expect(store.isModalOpen).toBe(false);
  });

  it('should toggle auto-scrape setting properly', () => {
    useScraperStore.getState().toggleAutoScrape(false);
    expect(useScraperStore.getState().isAutoScrapeEnabled).toBe(false);

    useScraperStore.getState().toggleAutoScrape(true);
    expect(useScraperStore.getState().isAutoScrapeEnabled).toBe(true);
  });

  it('should record timestamped logs and clear them', () => {
    useScraperStore.getState().addLog('Memulai inspeksi aset ke remote CDN...');
    useScraperStore.getState().addLog('✨ Ditemukan 4 model 3D baru!');

    const logs = useScraperStore.getState().syncLogs;
    expect(logs).toHaveLength(2);
    expect(logs[0]).toContain('Memulai inspeksi');
    expect(logs[1]).toContain('✨ Ditemukan 4 model 3D baru!');

    useScraperStore.getState().clearLogs();
    expect(useScraperStore.getState().syncLogs).toHaveLength(0);
  });

  it('should record sync completion with updated asset definitions and timestamp', () => {
    const mockScraped: AssetDefinition[] = [
      {
        id: 'scraped-animal-trex-rideable',
        name: 'Trex Rideable (BangPay Live)',
        category: 'dekorasi',
        subCategory: 'wahana',
        type: 'character',
        color: '#16a34a',
        modelUrl: 'https://bangpaysimulator.lovable.app/__l5e/assets-v1/.../animal-trex-rideable.glb',
        thumbnailUrl: '/thumbs/lightning.webp',
        targetSize: 4.5,
        isNew: true,
      },
    ];

    useScraperStore.getState().recordSyncFinished(1, mockScraped);

    const state = useScraperStore.getState();
    expect(state.isScraping).toBe(false);
    expect(state.discoveredCount).toBe(1);
    expect(state.scrapedAssets).toHaveLength(1);
    expect(state.lastSyncTime).not.toBeNull();
  });
});

