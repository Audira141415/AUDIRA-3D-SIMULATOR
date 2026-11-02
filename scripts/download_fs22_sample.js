const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'f:/AUDIRA-3D-SIMULATOR/assets/fs22_mods_raw/trucks';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileUrl = 'https://fs22.com/wp-content/uploads/2026/09/FS22_Mercedes_Benz_Atego_Laweta.zip';
const destPath = path.join(targetDir, 'FS22_Mercedes_Benz_Atego_Laweta.zip');

console.log('Downloading FS22 Truck Mod to:', destPath);

const file = fs.createWriteStream(destPath);
https.get(fileUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirecting to:', res.headers.location);
    https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r2 => {
      r2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete!');
      });
    });
    return;
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete!');
  });
}).on('error', err => {
  fs.unlink(destPath, () => {});
  console.error('Download error:', err.message);
});
