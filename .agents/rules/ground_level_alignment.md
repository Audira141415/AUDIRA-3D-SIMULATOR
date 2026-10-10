# GROUND LEVEL ALIGNMENT RULE (`y >= 0`)
> **Rule ID**: `R3F-GROUND-01`  
> **Target**: Seluruh AI Agent, Pair Programmer, ModelRenderer, dan Transform System.  
> **Level**: MANDATORY & CRITICAL (DILARANG DILANGGAR TANPA PENGECUALIAN).

---

## 1. Pernyataan Kebijakan Mutlak

Setiap objek 3D (kendaraan, truk Scania, traktor sawah, pesawat, bangunan, wahana bermain, pohon, dan dekorasi) **WAJIB SELALU BERADA DI ATAS LANTAI** dengan koordinat ketinggian vertikal minimum $Y \ge 0$.

### ⛔ Pantangan Mutlak:
- **DILARANG** membiarkan roda mobil, rantai crawler traktor, bumper, atau alas bangunan tenggelam / tembus ke dalam bidang tanah (`y < 0`).
- **DILARANG** berasumsi bahwa origin `(0, 0, 0)` dari file model `.glb` pihak ketiga berada di bagian alas. Mayoritas model 3D memiliki pivot point di tengah geometri (*center of geometry*).

---

## 2. Rumus Normalisasi Bounding Box Wajib

Setiap kali model GLB di-render atau diinstansiasi ke dalam scene, algoritma normalisasi berikut **WAJIB** dieksekusi:

```typescript
import * as THREE from 'three';

export function normalizeModelGroundLevel(modelScene: THREE.Object3D): THREE.Object3D {
  // 1. Gandakan scene agar tidak mengotori cache loader asli
  const clone = modelScene.clone(true);

  // 2. Hitung Bounding Box aktual secara rekursif
  const box = new THREE.Box3().setFromObject(clone);

  // 3. Titik terbawah model adalah box.min.y
  // Angkat posisi y model tepat sebesar selisihnya
  clone.position.y = -box.min.y;

  return clone;
}
```

---

## 3. Penegakan pada Sistem Transformasi (TransformControls)

1. **Mode Translasi (Move - W)**:
   - Nilai sumbu $Y$ dari objek tidak boleh bernilai negatif:
     ```typescript
     const clampedY = Math.max(0, newPosition.y);
     ```
2. **Mode Penempatan Raycaster (Click-to-Place)**:
   - Raycast kursor menabrak bidang tanah di $Y = 0$.
   - Objek instan diletakkan dengan koordinat $Y = 0$ (karena bagian bawah mesh sudah dinormalkan ke $Y = 0$ relatif terhadap parent container).

---

## 4. Konsekuensi Pelanggaran

Kelalaian menerapkan normalisasi ini akan mengakibatkan kendaraan terlihat seperti amblas ke dalam tanah, merusak estetika visual, dan menyebabkan kegagalan physics saat sistem deteksi tabrakan Rapier diaktifkan.
