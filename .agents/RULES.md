# RULES.md - AUDIRA 3D SIMULATOR ARCHITECTURE & CODING RULES

> **Aturan Wajib & Standar Baku Proyek AUDIRA 3D CONSTRUCTION SIMULATOR**  
> Mengikat seluruh AI Co-Pilot, Agent, dan Developer tanpa pengecualian.

---

## 1. Aturan Mutlak: Ground Level Alignment (Objek Wajib di Atas Lantai)

> **ATURAN UTAMA:**  
> **SELURUH OBJEK 3D (KENDARAAN, TRUK, TRAKTOR, POHON, WAHANA, DEKORASI, KARAKTER) WAJIB BERADA PERSIS DI ATAS LANTAI (`y >= 0`). DILARANG KERAS MEMBIARKAN OBJEK TENGGELAM, TERPOTONG, ATAU TEMBUS KE DALAM TANAH/LANTAI SEPERTI PADA SUMBU `y < 0`.**

### Latar Belakang & Masalah
Banyak model 3D pihak ketiga (GLB/GLTF) dari Blender, 3ds Max, atau Sketchfab yang diekspor dengan *pivot point* / titik origin di tengah-tengah geometri objek (center pivot). Akibatnya, saat objek ditaruh pada posisi `y = 0`, separuh bawah model (seperti ban truk, roda mobil, fondasi, atau batang bawah) akan menembus ke dalam lantai tanah.

### Spesifikasi Teknis yang Wajib Diterapkan:
1. **Normalisasi Bounding Box di `ModelRenderer`:**
   Setiap kali model GLB dimuat, renderer wajib mengukur `THREE.Box3().setFromObject(clone)`.
   Jika `box.min.y < -0.005` (titik terbawah model berada di bawah tanah), model wajib secara otomatis dinaikkan:
   ```ts
   if (category !== 'peta' && !url.includes('map') && box.min.y < -0.005) {
     clone.position.y = -box.min.y;
   }
   ```
   Hal ini menjamin titik kontak terbawah objek (roda/alas) akan persis menempel di atas permukaan lantai (`y = 0.0`).

2. **Proteksi Sumbu Y pada Transform Controls:**
   Saat pengguna menggeser objek menggunakan 3D gizmo panah (`TransformControls`), nilai `position.y` wajib di-*clamp* agar tidak dapat ditarik menembus ke bawah tanah:
   ```ts
   position: {
     x: Number(pos.x.toFixed(2)),
     y: Math.max(0, Number(pos.y.toFixed(2))), // Minimal 0 (tidak boleh negatif)
     z: Number(pos.z.toFixed(2)),
   }
   ```

3. **Proteksi Sumbu Y pada Nudge & Keyboard Shortcuts:**
   Pada fungsi `nudgeObject`, pergerakan elevasi tombol panah / `PageDown` wajib dibatasi minimal `0`:
   ```ts
   y: Math.max(0, Number((obj.position.y + dy).toFixed(2)))
   ```

4. **Fitur "Ratakan ke Lantai" (Drop to Floor):**
   Tombol drop to floor (shortcut `End`) harus selalu tersedia pada bilah mengambang 3D, Properties Panel, dan Context Menu klik-kanan untuk mereset ketinggian objek langsung ke `y = 0`.

5. **Pengecualian:**
   Hanya model kategori `peta` (Pulau Bajak Laut, Stasiun Trem, Peta Taiwan) yang diperbolehkan memiliki topografi seabed (bawah laut). Seluruh objek lain WAJIB di atas lantai.

---

## 2. Aturan Format Asset: 100% GLB Murni

1. Semua aset yang terdaftar di `INITIAL_ASSET_LIBRARY` wajib memiliki berkas 3D `.glb` asli di folder `apps/web/public/models/`.
2. Dilarang mendaftarkan aset prosedural pura-pura atau model kosong tanpa file 3D nyata.
3. Seluruh aset wajib memiliki thumbnail gambar `.webp` beresolusi tinggi di `apps/web/public/thumbs/`.

---

## 3. Aturan State Awal (Default Canvas Clean Slate)

1. Kanvas simulator secara default saat pertama kali dibuka **WAJIB 100% KOSONG / BERSIH (`objects: []`, Total Objek: 0)**.
2. Dilarang memuat objek demo bawaan ke kanvas default yang membingungkan pengguna.
3. Objek demo hanya boleh dimuat jika pengguna secara sengaja menekan tombol "Reset ke Showcase World" di Header.

---

## 4. Checklist Kepatuhan Sebelum Commit

- [ ] Apakah objek baru yang ditempatkan rodanya/alasnya menempel di atas lantai (`y = 0`)?
- [ ] Apakah objek tidak tenggelam saat diskalakan (`0.5x`, `1.5x`, `2x`)?
- [ ] Apakah kanvas baru terbuka dalam keadaan kosong dan bersih?
- [ ] Apakah `pnpm --filter @audira/web build` berhasil dengan exit code 0?
