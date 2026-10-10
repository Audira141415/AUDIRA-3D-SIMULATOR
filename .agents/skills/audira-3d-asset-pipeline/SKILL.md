---
name: audira-3d-asset-pipeline
description: >-
  Use this skill when adding, optimizing, or inspecting 3D GLB/GLTF models, calculating bounding boxes,
  ensuring ground level alignment (y >= 0), setting up WebP thumbnails, or configuring procedural fallbacks.
---

# Audira 3D Asset Pipeline & Model Normalization Runbook

Petunjuk operasional untuk mengintegrasikan model berkas 3D (`.glb`), normalisasi geometri, penyesuaian skala model, dan pembuatan thumbnail WebP di AUDIRA 3D CONSTRUCTION SIMULATOR.

---

## 1. Aturan Wajib Bounding Box & Ground Alignment (`y >= 0`)

Model dari internet atau pemodel pihak ketiga sering kali memiliki titik origin `(0, 0, 0)` di bagian tengah atau di sudut sembarang.

### Prosedur Normalisasi Model:
1. Hitung kotak pembatas model aktual menggunakan Three.js `Box3`:
   ```typescript
   import * as THREE from 'three';

   export function normalizeModelGround(clonedScene: THREE.Object3D) {
     const box = new THREE.Box3().setFromObject(clonedScene);
     const minY = box.min.y;
     // Angkat posisi model sehingga titik terendah tepat menempel di y = 0
     clonedScene.position.y = -minY;
     return clonedScene;
   }
   ```
2. Pastikan bayangan objek terhitung benar dengan mengaktifkan `castShadow` dan `receiveShadow` pada seluruh mesh anak:
   ```typescript
   clonedScene.traverse((child) => {
     if ((child as THREE.Mesh).isMesh) {
       child.castShadow = true;
       child.receiveShadow = true;
     }
   });
   ```

---

## 2. Struktur Penyimpanan Asset Fisik

- **Model GLB**: Simpan file berkas biner `.glb` di:
  `apps/web/public/models/<asset-name>.glb`
- **Thumbnail WebP**: Simpan gambar preview format `.webp` rasio 1:1 di:
  `apps/web/public/thumbs/<asset-name>.webp`

---

## 3. Checklist Registrasi Asset Baru

Sebelum asset dapat muncul di Asset Library:
1. Pastikan model biner `.glb` dan thumbnail `.webp` sudah berada di direktori `public/`.
2. Tambahkan entri asset ke dalam file `apps/web/src/features/assets/assetCatalog.ts`.
3. Daftarkan entri pada tabel [ASSET_AND_SIMULATION_MATRIX.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/ASSET_AND_SIMULATION_MATRIX.md) dan [TASK_INSTRUCTION.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/TASK_INSTRUCTION.md).
4. Jalankan aplikasi via `pnpm dev` dan tempatkan objek di viewport untuk menguji apakah alas menempel sempurna di tanah (`y >= 0`).
