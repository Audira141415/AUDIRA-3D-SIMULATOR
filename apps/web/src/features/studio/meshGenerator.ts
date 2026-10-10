import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export interface ReliefOptions {
  resolution?: number; // e.g. 128
  depth?: number;      // e.g. 0.35
  smoothness?: number; // e.g. 1
  cutout?: boolean;
}

// Generate client-side volumetric 3D mesh from an HTML Image
export function generateReliefMesh(
  img: HTMLImageElement,
  options: ReliefOptions = {}
): { geometry: THREE.BufferGeometry; texture: THREE.CanvasTexture } {
  const targetRes = options.resolution || 140;
  const depthScale = options.depth || 0.35;

  const aspect = img.naturalWidth / img.naturalHeight;
  const gridW = Math.max(16, Math.round(targetRes * (aspect >= 1 ? 1 : aspect)));
  const gridH = Math.max(16, Math.round(targetRes * (aspect >= 1 ? 1 / aspect : 1)));

  // Offscreen canvas to sample pixels
  const canvas = document.createElement('canvas');
  canvas.width = gridW;
  canvas.height = gridH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D Canvas tidak didukung di browser ini.');

  ctx.drawImage(img, 0, 0, gridW, gridH);
  const imgData = ctx.getImageData(0, 0, gridW, gridH);
  const data = imgData.data;

  // Compute luminance heightmap and alpha mask
  const total = gridW * gridH;
  const heightmap = new Float32Array(total);
  const alphaMask = new Uint8Array(total);

  for (let i = 0; i < total; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    const a = data[i * 4 + 3] / 255;

    // Luminance standard
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    heightmap[i] = lum * depthScale;
    alphaMask[i] = a > 0.15 ? 1 : 0;
  }

  // Construct 3D BufferGeometry
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const worldW = aspect >= 1 ? 2.5 : 2.5 * aspect;
  const worldH = aspect >= 1 ? 2.5 / aspect : 2.5;

  const posX = (x: number) => (x / (gridW - 1) - 0.5) * worldW;
  const posY = (y: number) => (0.5 - y / (gridH - 1)) * worldH;
  const getUVX = (x: number) => x / (gridW - 1);
  const getUVY = (y: number) => 1 - y / (gridH - 1);

  const frontIndexMap = new Int32Array(total).fill(-1);
  const backIndexMap = new Int32Array(total).fill(-1);

  // Helper to add vertex
  const addVertex = (x: number, y: number, isBack: boolean) => {
    const idx = y * gridW + x;
    const targetMap = isBack ? backIndexMap : frontIndexMap;
    if (targetMap[idx] >= 0) return targetMap[idx];

    const z = isBack ? -heightmap[idx] * 0.4 - 0.04 : heightmap[idx] + 0.04;
    const vertIndex = positions.length / 3;

    positions.push(posX(x), posY(y), z);
    uvs.push(getUVX(x), getUVY(y));
    targetMap[idx] = vertIndex;
    return vertIndex;
  };

  // Build Front and Back Quads
  for (let y = 0; y < gridH - 1; y++) {
    for (let x = 0; x < gridW - 1; x++) {
      const idx = y * gridW + x;
      // Skip transparent cells
      if (!alphaMask[idx] || !alphaMask[idx + 1] || !alphaMask[(y + 1) * gridW + x]) continue;

      // Front Face
      const fTL = addVertex(x, y, false);
      const fTR = addVertex(x + 1, y, false);
      const fBL = addVertex(x, y + 1, false);
      const fBR = addVertex(x + 1, y + 1, false);

      indices.push(fTL, fBL, fTR);
      indices.push(fTR, fBL, fBR);

      // Back Face (Reversed winding)
      const bTL = addVertex(x, y, true);
      const bTR = addVertex(x + 1, y, true);
      const bBL = addVertex(x, y + 1, true);
      const bBR = addVertex(x + 1, y + 1, true);

      indices.push(bTL, bTR, bBL);
      indices.push(bTR, bBR, bBL);
    }
  }

  // Build Side Walls (Border extrusion)
  for (let y = 0; y < gridH - 1; y++) {
    for (let x = 0; x < gridW - 1; x++) {
      const currentMask = alphaMask[y * gridW + x];
      if (!currentMask) continue;

      // Check Top boundary
      if (y === 0 || !alphaMask[(y - 1) * gridW + x]) {
        const f1 = addVertex(x, y, false);
        const f2 = addVertex(x + 1, y, false);
        const b1 = addVertex(x, y, true);
        const b2 = addVertex(x + 1, y, true);
        indices.push(f1, f2, b1);
        indices.push(f2, b2, b1);
      }
      // Check Bottom boundary
      if (y === gridH - 2 || !alphaMask[(y + 1) * gridW + x]) {
        const f1 = addVertex(x, y + 1, false);
        const f2 = addVertex(x + 1, y + 1, false);
        const b1 = addVertex(x, y + 1, true);
        const b2 = addVertex(x + 1, y + 1, true);
        indices.push(f1, b1, f2);
        indices.push(f2, b1, b2);
      }
      // Check Left boundary
      if (x === 0 || !alphaMask[y * gridW + (x - 1)]) {
        const f1 = addVertex(x, y, false);
        const f2 = addVertex(x, y + 1, false);
        const b1 = addVertex(x, y, true);
        const b2 = addVertex(x, y + 1, true);
        indices.push(f1, b1, f2);
        indices.push(f2, b1, b2);
      }
      // Check Right boundary
      if (x === gridW - 2 || !alphaMask[y * gridW + (x + 1)]) {
        const f1 = addVertex(x + 1, y, false);
        const f2 = addVertex(x + 1, y + 1, false);
        const b1 = addVertex(x + 1, y, true);
        const b2 = addVertex(x + 1, y + 1, true);
        indices.push(f1, f2, b1);
        indices.push(f2, b2, b1);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();

  // Create High-Res texture for model
  const texCanvas = document.createElement('canvas');
  texCanvas.width = img.naturalWidth || 512;
  texCanvas.height = img.naturalHeight || 512;
  const texCtx = texCanvas.getContext('2d');
  if (texCtx) {
    texCtx.drawImage(img, 0, 0, texCanvas.width, texCanvas.height);
  }
  const texture = new THREE.CanvasTexture(texCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return { geometry, texture };
}

// Export 3D Object/Group to Binary GLB
export function exportSceneToGLB(object: THREE.Object3D, filename: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          const blob = new Blob([gltf], { type: 'model/gltf-binary' });
          resolve(blob);
        } else {
          const json = JSON.stringify(gltf, null, 2);
          const blob = new Blob([json], { type: 'model/gltf+json' });
          resolve(blob);
        }
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
}
