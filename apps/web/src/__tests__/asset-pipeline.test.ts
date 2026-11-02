import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ASSET_LIBRARY } from '@audira/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Asset Pipeline & 3D Models Integrity', () => {
  const publicDir = path.resolve(__dirname, '../../public');

  it('should verify all 96 assets defined in INITIAL_ASSET_LIBRARY exist as physical 3D model files', () => {
    let missingModels = 0;
    let zeroByteModels = 0;

    expect(INITIAL_ASSET_LIBRARY.length).toBeGreaterThanOrEqual(96);

    INITIAL_ASSET_LIBRARY.forEach((asset) => {
      const url = asset.modelUrl || '';
      const modelPath = path.join(publicDir, url.replace(/^\//, ''));
      if (!fs.existsSync(modelPath)) {
        missingModels++;
      } else {
        const stats = fs.statSync(modelPath);
        if (stats.size === 0) {
          zeroByteModels++;
        }
      }
    });

    expect(missingModels).toBe(0);
    expect(zeroByteModels).toBe(0);
  });

  it('should verify all 96 thumbnails exist with non-zero file sizes', () => {
    let missingThumbs = 0;
    let zeroByteThumbs = 0;

    INITIAL_ASSET_LIBRARY.forEach((asset) => {
      const url = asset.thumbnailUrl || '';
      const thumbPath = path.join(publicDir, url.replace(/^\//, ''));
      if (!fs.existsSync(thumbPath)) {
        missingThumbs++;
      } else {
        const stats = fs.statSync(thumbPath);
        if (stats.size === 0) {
          zeroByteThumbs++;
        }
      }
    });

    expect(missingThumbs).toBe(0);
    expect(zeroByteThumbs).toBe(0);
  });

  it('should verify essential vehicles are present in library (trucks, tractors, sports cars, offroad)', () => {
    const vehicleNames = INITIAL_ASSET_LIBRARY.map((a) => a.name.toLowerCase());
    expect(vehicleNames.some((n) => n.includes('lightning') || n.includes('mcqueen'))).toBe(true);
    expect(vehicleNames.some((n) => n.includes('mater'))).toBe(true);
    expect(vehicleNames.some((n) => n.includes('scania'))).toBe(true);
    expect(vehicleNames.some((n) => n.includes('traktor') || n.includes('tractor'))).toBe(true);
    expect(vehicleNames.some((n) => n.includes('pemadam') || n.includes('fire'))).toBe(true);
    expect(vehicleNames.some((n) => n.includes('jeep') || n.includes('wrangler'))).toBe(true);
  });
});
