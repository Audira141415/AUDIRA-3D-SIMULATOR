/**
 * AUDIRA 3D SIMULATOR - FS22 Trucks Batch Downloader
 * Script to download raw truck mod packages from fs22.com into local assets folder
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../assets/fs22_mods_raw/trucks');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function getHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getHtml(res.headers.location).then(resolve).catch(reject);
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function getModDirectDownload(postUrl) {
  const html = await getHtml(postUrl);
  const match = html.match(/href=["'](https:\/\/fs22\.com\/download-mod\/\d+)["']/);
  if (!match) return null;
  const dlPageUrl = match[1];

  return new Promise((resolve, reject) => {
    https.get(dlPageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve(res.headers.location || null);
    }).on('error', reject);
  });
}

function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      console.log(`[SKIP] Already exists: ${path.basename(destPath)}`);
      return resolve();
    }

    console.log(`[DOWNLOADING] ${path.basename(destPath)}...`);
    const file = fs.createWriteStream(destPath);
    https.get(fileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r2 => {
          r2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Scanning https://fs22.com/category/farming-simulator-22-mods/trucks/ ...');
  const catHtml = await getHtml('https://fs22.com/category/farming-simulator-22-mods/trucks/');

  const matches = [...catHtml.matchAll(/<a[^>]*href=["'](https:\/\/fs22\.com\/farming-simulator-22-mods\/trucks\/[^"']+)["'][^>]*>([^<]+)<\/a>/g)]
    .map(m => ({ url: m[1], title: m[2].trim() }))
    .filter(item => item.title.length > 3 && !item.url.includes('/page/'));

  const unique = [];
  const seen = new Set();
  for (const m of matches) {
    if (!seen.has(m.url)) {
      seen.add(m.url);
      unique.push(m);
    }
  }

  console.log(`Found ${unique.length} truck mods. Starting download into: ${targetDir}`);

  for (const item of unique) {
    try {
      console.log(`\nProcessing: ${item.title}`);
      const directUrl = await getModDirectDownload(item.url);
      if (!directUrl) {
        console.log(`  [NO LINK] Could not find direct download link.`);
        continue;
      }
      const filename = path.basename(directUrl);
      const destFile = path.join(targetDir, filename);
      await downloadFile(directUrl, destFile);
      console.log(`  [DONE] Saved to: ${filename}`);
    } catch (err) {
      console.error(`  [ERROR] Failed to download ${item.title}:`, err.message);
    }
  }

  console.log('\nAll available truck mods downloaded successfully!');
}

main().catch(console.error);
