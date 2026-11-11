import { AssetDefinition, AssetCategory } from '@audira/shared';
import { useScraperStore } from '../../stores/useScraperStore';
import { useAssetStore } from '../../stores/useAssetStore';
import { soundEngine } from '../audio/soundEngine';

export interface ScrapeResult {
  success: boolean;
  totalRemoteModels: number;
  newAssetsCount: number;
  newAssets: AssetDefinition[];
  error?: string;
}

/**
 * Infer asset category based on filename and keywords
 */
function inferCategory(fileName: string): { category: AssetCategory; subCategory?: string; type: string; targetSize: number } {
  const lower = fileName.toLowerCase();

  if (lower.includes('tractor') || lower.includes('dt75') || lower.includes('mtz80')) {
    return { category: 'tractor', subCategory: 'semua', type: 'bulldozer', targetSize: 6.0 };
  }
  if (lower.includes('airplane') || lower.includes('aircraft') || lower.includes('plane')) {
    return { category: 'pesawat', subCategory: 'semua', type: 'airplane', targetSize: 12.0 };
  }
  if (
    lower.includes('map') ||
    lower.includes('circuit') ||
    lower.includes('village') ||
    lower.includes('station') ||
    lower.includes('environment') ||
    lower.includes('taiwan') ||
    lower.includes('pirate')
  ) {
    return { category: 'peta', subCategory: 'bangunan', type: 'warehouse', targetSize: 260.0 };
  }
  if (
    lower.includes('car') ||
    lower.includes('scania') ||
    lower.includes('truck') ||
    lower.includes('police') ||
    lower.includes('mater') ||
    lower.includes('mcqueen') ||
    lower.includes('supra') ||
    lower.includes('lambo') ||
    lower.includes('mclaren') ||
    lower.includes('jeep') ||
    lower.includes('toyota') ||
    lower.includes('volvo') ||
    lower.includes('mercedes') ||
    lower.includes('firetruck')
  ) {
    return { category: 'kendaraan', subCategory: 'semua', type: 'car-sport', targetSize: 5.5 };
  }
  if (lower.includes('tree') || lower.includes('pohon')) {
    return { category: 'dekorasi', subCategory: 'pohon', type: 'tree', targetSize: 6.0 };
  }
  if (lower.includes('road') || lower.includes('ramp') || lower.includes('jalan')) {
    return { category: 'dekorasi', subCategory: 'jalan', type: 'road', targetSize: 15.0 };
  }
  if (lower.includes('ball') || lower.includes('bola')) {
    return { category: 'dekorasi', subCategory: 'bola', type: 'sphere', targetSize: 4.0 };
  }
  if (lower.includes('spiderman') || lower.includes('iron-man') || lower.includes('hulk') || lower.includes('animal')) {
    return { category: 'dekorasi', subCategory: 'karakter', type: 'character', targetSize: 3.5 };
  }
  return { category: 'dekorasi', subCategory: 'wahana', type: 'monument', targetSize: 5.0 };
}

/**
 * Format raw filename into a neat display title
 */
function humanizeTitle(fileName: string): string {
  const base = fileName.replace(/\.(glb|gltf)$/i, '').replace(/[-_]+/g, ' ');
  return base
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim();
}

/**
 * Core scraping engine that queries BangPay remote bundle
 */
export async function scrapeBangPayAssets(options: { force?: boolean } = {}): Promise<ScrapeResult> {
  const { addLog, setScraping, recordSyncFinished, scrapedAssets } = useScraperStore.getState();
  setScraping(true);

  // Determine base URL: use proxy in browser dev, or direct if Tauri/production
  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/bangpay-proxy' : 'https://bangpaysimulator.lovable.app';

  try {
    addLog(`Memulai inspeksi aset ke ${baseUrl}...`);

    // 1. Fetch live HTML of BangPay Simulator
    const htmlRes = await fetch(baseUrl, {
      headers: { Accept: 'text/html' },
      cache: options.force ? 'reload' : 'default',
    });

    if (!htmlRes.ok) {
      throw new Error(`Gagal menghubungi server BangPay (HTTP ${htmlRes.status})`);
    }

    const htmlText = await htmlRes.text();
    addLog(`HTML berhasil dimuat (${(htmlText.length / 1024).toFixed(1)} KB)`);

    // 2. Discover script and module links
    const scriptMatches = [
      ...htmlText.matchAll(/<script[^>]+src=["']([^"']+)["']/g),
      ...htmlText.matchAll(/<link[^>]+href=["']([^"']+\.js)["']/g),
    ].map((m) => m[1]);

    // Find routes bundle
    const routesScript = scriptMatches.find((s) => s.includes('routes-')) || '/assets/routes-C_xwdxkw.js';
    addLog(`Menganalisis bundle rute: ${routesScript}...`);

    // 3. Fetch routes bundle to find active Simulator bundle
    const routesRes = await fetch(`${baseUrl}${routesScript.startsWith('/') ? '' : '/'}${routesScript}`);
    let simulatorBundle = '/assets/Simulator-EIeMPERm.js';

    if (routesRes.ok) {
      const routesText = await routesRes.text();
      const simMatch = routesText.match(/assets\/(Simulator-[a-zA-Z0-9_\-]+\.js)/);
      if (simMatch && simMatch[1]) {
        simulatorBundle = `/assets/${simMatch[1]}`;
      }
    }
    addLog(`Target bundle 3D aktif: ${simulatorBundle}`);

    // 4. Fetch Simulator bundle
    const simRes = await fetch(`${baseUrl}${simulatorBundle.startsWith('/') ? '' : '/'}${simulatorBundle}`);
    if (!simRes.ok) {
      throw new Error(`Gagal memuat bundle Simulator ${simulatorBundle}`);
    }

    const simCode = await simRes.text();
    addLog(`Bundle Simulator berhasil dianalisis (${(simCode.length / 1024 / 1024).toFixed(2)} MB)`);

    // 5. Extract all __l5e/assets-v1 paths (.glb / .gltf)
    const cdnMatches = [...simCode.matchAll(/__l5e\/assets-v1\/[a-zA-Z0-9_\-\.\/]+/g)].map((m) => m[0]);
    const uniqueCdn = Array.from(new Set(cdnMatches));

    const glbPaths = uniqueCdn.filter((c) => c.endsWith('.glb') || c.endsWith('.gltf'));
    const imgPaths = uniqueCdn.filter((c) => c.endsWith('.webp') || c.endsWith('.png') || c.endsWith('.jpg'));

    addLog(`Ditemukan ${glbPaths.length} model 3D GLB & ${imgPaths.length} tekstur/thumbnail di Cloudflare R2.`);

    // 6. Compare with existing assets in useAssetStore and local scraped cache
    const currentAssetLibrary = useAssetStore.getState().assets;
    const existingModelFiles = new Set(
      currentAssetLibrary.map((a) => {
        const parts = (a.modelUrl || '').split('/');
        return parts[parts.length - 1];
      })
    );

    const newAssets: AssetDefinition[] = [];
    const allScrapedMap = new Map<string, AssetDefinition>();

    // Seed with previously scraped
    scrapedAssets.forEach((a) => allScrapedMap.set(a.id, a));

    glbPaths.forEach((cdnPath) => {
      const parts = cdnPath.split('/');
      const fileName = parts[parts.length - 1];
      const baseId = `scraped-${fileName.replace(/\.(glb|gltf)$/i, '')}`;

      const { category, subCategory, type, targetSize } = inferCategory(fileName);
      const title = humanizeTitle(fileName);

      // Check for matching thumbnail
      const thumbMatch = imgPaths.find((img) => img.includes(fileName.replace(/\.(glb|gltf)$/i, '')));
      const thumbnailUrl = thumbMatch
        ? `https://bangpaysimulator.lovable.app/${thumbMatch}`
        : '/thumbs/lightning.webp';

      const modelUrl = `https://bangpaysimulator.lovable.app/${cdnPath}`;

      const assetDef: AssetDefinition = {
        id: baseId,
        name: `${title} (BangPay Live)`,
        category,
        subCategory,
        type,
        color: category === 'kendaraan' ? '#00d2ff' : category === 'peta' ? '#f59e0b' : '#10b981',
        modelUrl,
        thumbnailUrl,
        targetSize,
        isNew: true,
      };

      allScrapedMap.set(baseId, assetDef);

      if (!existingModelFiles.has(fileName)) {
        newAssets.push(assetDef);
        existingModelFiles.add(fileName);
      }
    });

    // 7. Inject new assets into useAssetStore so they appear in Asset Library immediately
    if (newAssets.length > 0) {
      newAssets.forEach((asset) => {
        useAssetStore.getState().addCustomAsset(asset);
      });
      addLog(`✨ Berhasil menambahkan ${newAssets.length} model 3D baru ke Asset Library!`);
      soundEngine.playSuccess();
    } else {
      addLog(`Semua ${glbPaths.length} model 3D remote sudah tersinkronisasi secara lokal.`);
    }

    const updatedScrapedList = Array.from(allScrapedMap.values());
    recordSyncFinished(newAssets.length, updatedScrapedList);

    return {
      success: true,
      totalRemoteModels: glbPaths.length,
      newAssetsCount: newAssets.length,
      newAssets,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Terjadi kesalahan saat scraping';
    addLog(`❌ Error Scraper: ${errorMsg}`);
    setScraping(false);
    return {
      success: false,
      totalRemoteModels: 0,
      newAssetsCount: 0,
      newAssets: [],
      error: errorMsg,
    };
  }
}
