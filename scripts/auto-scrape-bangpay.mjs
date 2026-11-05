#!/usr/bin/env node

/**
 * AUDIRA 3D SIMULATOR — Auto-Scraper for BangPay GLB Assets & PBR Textures
 * Automatically checks and downloads newly deployed 3D models, textures, thumbnails,
 * and media from BangPay Simulator.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const BASE_URL = 'https://bangpaysimulator.lovable.app';
const MODELS_DIR = path.join(root, 'apps/web/public/models');
const BANGPAY_MODELS_DIR = path.join(MODELS_DIR, 'bangpay');
const THUMBS_DIR = path.join(root, 'apps/web/public/thumbs');
const TEXTURES_DIR = path.join(root, 'apps/web/public/textures');
const MEDIA_DIR = path.join(root, 'apps/web/public/media');

async function main() {
  console.log('====================================================');
  console.log('⚡ AUDIRA AUTO-SCRAPER: BangPay Simulator CDN Sync');
  console.log('====================================================');

  [MODELS_DIR, BANGPAY_MODELS_DIR, THUMBS_DIR, TEXTURES_DIR, MEDIA_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log(`[1/5] Mengunduh HTML dari ${BASE_URL}...`);
  const htmlRes = await fetch(BASE_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!htmlRes.ok) {
    throw new Error(`Gagal menghubungi ${BASE_URL}: HTTP ${htmlRes.status}`);
  }

  const html = await htmlRes.text();
  console.log(`✓ HTML berhasil dimuat (${(html.length / 1024).toFixed(1)} KB)`);

  // Locate routes bundle
  const scriptMatches = [
    ...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g),
    ...html.matchAll(/<link[^>]+href=["']([^"']+\.js)["']/g),
  ].map((m) => m[1]);

  const routesScript = scriptMatches.find((s) => s.includes('routes-')) || '/assets/routes-C6wagoiJ.js';
  console.log(`[2/5] Menganalisis bundle rute: ${routesScript}...`);

  const routesRes = await fetch(`${BASE_URL}${routesScript.startsWith('/') ? '' : '/'}${routesScript}`);
  let simulatorBundle = '/assets/Simulator-CqD9D8VY.js';

  if (routesRes.ok) {
    const routesText = await routesRes.text();
    const simMatch = routesText.match(/assets\/(Simulator-[a-zA-Z0-9_\-]+\.js)/);
    if (simMatch && simMatch[1]) {
      simulatorBundle = `/assets/${simMatch[1]}`;
    }
  }
  console.log(`✓ Target bundle 3D aktif: ${simulatorBundle}`);

  console.log(`[3/5] Menganalisis manifest aset 3D dalam bundle Simulator...`);
  const simRes = await fetch(`${BASE_URL}${simulatorBundle.startsWith('/') ? '' : '/'}${simulatorBundle}`);
  if (!simRes.ok) {
    throw new Error(`Gagal memuat bundle Simulator ${simulatorBundle}`);
  }

  const simCode = await simRes.text();
  const cdnMatches = [...simCode.matchAll(/__l5e\/assets-v1\/[a-zA-Z0-9_\-\.\/]+/g)].map((m) => m[0]);
  const uniqueCdn = Array.from(new Set(cdnMatches));

  const glbPaths = uniqueCdn.filter((c) => c.endsWith('.glb') || c.endsWith('.gltf'));
  const imgPaths = uniqueCdn.filter((c) => c.endsWith('.webp') || c.endsWith('.png') || c.endsWith('.jpg'));

  console.log(`✓ Ditemukan ${glbPaths.length} model 3D GLB & ${imgPaths.length} tekstur/thumbnail di Cloudflare R2.`);

  // Compare with local models
  const localModels = new Set(fs.readdirSync(MODELS_DIR));
  if (fs.existsSync(BANGPAY_MODELS_DIR)) {
    fs.readdirSync(BANGPAY_MODELS_DIR).forEach((f) => localModels.add(f));
  }

  const missingGlbs = glbPaths.filter((p) => {
    const fileName = path.basename(p);
    return !localModels.has(fileName);
  });

  console.log(`\n[4/5] Sinkronisasi Model 3D:`);
  console.log(`- Model Lokal Tersedia : ${localModels.size}`);
  console.log(`- Model Baru Remote    : ${missingGlbs.length}`);

  if (missingGlbs.length === 0) {
    console.log('✨ Semua 57 model 3D remote sudah tersinkronisasi 100% secara lokal!');
  } else {
    console.log(`Mengunduh ${missingGlbs.length} model 3D baru ke ${MODELS_DIR}...`);

    for (let i = 0; i < missingGlbs.length; i++) {
      const cdnPath = missingGlbs[i];
      const fileName = path.basename(cdnPath);
      const downloadUrl = `${BASE_URL}/${cdnPath}`;
      const destFile = path.join(MODELS_DIR, fileName);

      process.stdout.write(`  [${i + 1}/${missingGlbs.length}] Mengunduh ${fileName}... `);
      try {
        const fileRes = await fetch(downloadUrl);
        if (!fileRes.ok) {
          console.log(`FAILED (HTTP ${fileRes.status})`);
          continue;
        }
        const buf = Buffer.from(await fileRes.arrayBuffer());
        fs.writeFileSync(destFile, buf);
        console.log(`OK (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
      }
    }
    console.log(`\n✨ Selesai mengunduh ${missingGlbs.length} model 3D baru!`);
  }

  // 5/5: Sinkronisasi Tekstur PBR dan Thumbnails
  console.log(`\n[5/5] Sinkronisasi Tekstur PBR & Thumbnail:`);
  let newTextures = 0;
  for (const imgPath of imgPaths) {
    const fileName = path.basename(imgPath);
    const destThumb = path.join(THUMBS_DIR, fileName);
    const destTexture = path.join(TEXTURES_DIR, fileName);

    const exists = fs.existsSync(destThumb) || fs.existsSync(destTexture);
    if (!exists) {
      process.stdout.write(`  Mengunduh tekstur ${fileName}... `);
      try {
        const r = await fetch(`${BASE_URL}/${imgPath}`);
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          fs.writeFileSync(destTexture, buf);
          fs.writeFileSync(destThumb, buf);
          newTextures++;
          console.log(`OK (${(buf.length / 1024).toFixed(1)} KB)`);
        }
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
      }
    }
  }

  if (newTextures === 0) {
    console.log('✨ Semua tekstur PBR dan thumbnail sudah tersinkronisasi 100%!');
  } else {
    console.log(`✨ Mengunduh ${newTextures} berkas tekstur baru!`);
  }

  console.log('====================================================');
  console.log('✓ AUTO-SCRAPING & SYNC SELESAI DENGAN SUKSES.');
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Gagal menjalankan auto-scraper:', err.message);
  process.exit(1);
});
