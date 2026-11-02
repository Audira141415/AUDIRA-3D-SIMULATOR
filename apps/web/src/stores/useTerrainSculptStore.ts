import { create } from 'zustand';

export type SculptTool = 'raise' | 'lower' | 'flatten' | 'slope' | 'smooth' | null;

interface TerrainSculptState {
  isSculptActive: boolean;
  tool: SculptTool;
  radius: number; // 1 to 40 meters
  strength: number; // 0.1 to 2.0
  targetHeight: number; // For flatten / slope
  cursorPosition: { x: number; y: number; z: number } | null;
  heightMap: Record<string, number>; // key: "x_z" (1m grid cells)

  // Actions
  toggleSculptActive: (active?: boolean) => void;
  setTool: (tool: SculptTool) => void;
  setRadius: (radius: number) => void;
  setStrength: (strength: number) => void;
  setTargetHeight: (height: number) => void;
  setCursorPosition: (pos: { x: number; y: number; z: number } | null) => void;
  applySculptAtPoint: (centerX: number, centerZ: number, delta?: number) => void;
  clearHeightMap: () => void;
  getTerrainHeight: (x: number, z: number) => number;
}

export const useTerrainSculptStore = create<TerrainSculptState>((set, get) => ({
  isSculptActive: false,
  tool: null,
  radius: 8,
  strength: 0.6,
  targetHeight: 0,
  cursorPosition: null,
  heightMap: {},

  toggleSculptActive: (active) =>
    set((s) => ({
      isSculptActive: active !== undefined ? active : !s.isSculptActive,
      tool: active === false ? null : s.tool || 'raise',
    })),

  setTool: (tool) => set({ tool, isSculptActive: tool !== null }),
  setRadius: (radius) => set({ radius: Math.max(1, Math.min(40, radius)) }),
  setStrength: (strength) => set({ strength: Math.max(0.05, Math.min(2.0, strength)) }),
  setTargetHeight: (targetHeight) => set({ targetHeight }),
  setCursorPosition: (cursorPosition) => set({ cursorPosition }),

  applySculptAtPoint: (centerX, centerZ, delta = 0.05) => {
    const { tool, radius, strength, targetHeight, heightMap } = get();
    if (!tool) return;

    const newMap = { ...heightMap };
    const rInt = Math.ceil(radius);
    const minX = Math.floor(centerX - rInt);
    const maxX = Math.ceil(centerX + rInt);
    const minZ = Math.floor(centerZ - rInt);
    const maxZ = Math.ceil(centerZ + rInt);

    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        // Respect 300m world bounds
        if (Math.abs(x) > 150 || Math.abs(z) > 150) continue;

        const dist = Math.hypot(x - centerX, z - centerZ);
        if (dist > radius) continue;

        // Smooth cosine falloff (1 at center, 0 at radius boundary)
        const factor = Math.cos((dist / radius) * (Math.PI / 2)) * strength * delta;
        const key = `${x}_${z}`;
        const currentH = newMap[key] || 0;

        let newH = currentH;
        if (tool === 'raise') {
          newH = currentH + factor * 4.0;
        } else if (tool === 'lower') {
          newH = currentH - factor * 4.0;
        } else if (tool === 'flatten') {
          newH = currentH + (targetHeight - currentH) * Math.min(1, factor * 3.0);
        } else if (tool === 'slope') {
          const slopeDist = (x - centerX) / radius;
          const targetSlope = targetHeight + slopeDist * 2.0;
          newH = currentH + (targetSlope - currentH) * Math.min(1, factor * 2.5);
        } else if (tool === 'smooth') {
          // Average surrounding 4 neighbors
          const hL = newMap[`${x - 1}_${z}`] || 0;
          const hR = newMap[`${x + 1}_${z}`] || 0;
          const hT = newMap[`${x}_${z - 1}`] || 0;
          const hB = newMap[`${x}_${z + 1}`] || 0;
          const avg = (hL + hR + hT + hB) / 4;
          newH = currentH + (avg - currentH) * Math.min(1, factor * 2.0);
        }

        // Clamp height between -15m (trenches/lakes) and +35m (mountains/hills)
        newH = Math.max(-15, Math.min(35, Math.round(newH * 100) / 100));

        if (Math.abs(newH) < 0.01) {
          delete newMap[key];
        } else {
          newMap[key] = newH;
        }
      }
    }

    set({ heightMap: newMap });
  },

  clearHeightMap: () => set({ heightMap: {} }),

  getTerrainHeight: (x, z) => {
    const { heightMap } = get();
    // Bilinear interpolation between 4 nearest heightmap cells
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const z0 = Math.floor(z);
    const z1 = z0 + 1;

    const h00 = heightMap[`${x0}_${z0}`] || 0;
    const h10 = heightMap[`${x1}_${z0}`] || 0;
    const h01 = heightMap[`${x0}_${z1}`] || 0;
    const h11 = heightMap[`${x1}_${z1}`] || 0;

    const tx = x - x0;
    const tz = z - z0;

    const h0 = h00 * (1 - tx) + h10 * tx;
    const h1 = h01 * (1 - tx) + h11 * tx;

    return h0 * (1 - tz) + h1 * tz;
  },
}));

