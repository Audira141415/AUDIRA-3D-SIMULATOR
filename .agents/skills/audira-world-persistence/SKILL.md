---
name: audira-world-persistence
description: >-
  Use this skill when modifying, debugging, or migrating world save/load operations,
  JSON serialization schemas, localStorage autosave synchronization, or Undo/Redo stack states.
---

# Audira World Persistence & Serialization Runbook

Petunjuk operasional untuk ekspor, impor, validasi skema JSON, dan sinkronisasi penyimpanan dunia 3D di AUDIRA 3D CONSTRUCTION SIMULATOR.

---

## 1. Skema Validasi Save File JSON

Setiap file simpanan proyek yang diimpor wajib divalidasi strukturnya menggunakan Zod:

```typescript
import { z } from 'zod';

export const Vector3Schema = z.object({
  x: z.number(),
  y: z.number().min(0), // Memastikan ground level y >= 0
  z: z.number(),
});

export const GameObjectSaveSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  name: z.string(),
  category: z.string(),
  modelUrl: z.string(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  visible: z.boolean(),
  locked: z.boolean(),
});

export const WorldSaveSchema = z.object({
  version: z.string(),
  name: z.string(),
  createdAt: z.string(),
  objects: z.array(GameObjectSaveSchema),
});
```

---

## 2. Alur Ekspor Berkas JSON (File Download)

Fungsi untuk mengunduh tata letak dunia secara instan tanpa server backend:

```typescript
export function exportWorldToFile(worldData: unknown, filename = 'audira-world-save.json') {
  const jsonString = JSON.stringify(worldData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

---

## 3. Strategi Autosave LocalStorage

- **Debounce Interval**: Simpan perubahan secara otomatis dengan penundaan 500ms setelah interaksi mouse terakhir.
- **Key Storage**: Simpan dengan key terisolasi `audira_3d_simulator_active_world_v1`.
- **Handling Quota Exceeded**: Jika kuota LocalStorage penuh (5MB), beri peringatan kepada pengguna untuk mengekspor ke file `.json`.
