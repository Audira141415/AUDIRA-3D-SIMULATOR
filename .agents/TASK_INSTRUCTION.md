# TASK INSTRUCTION — AUDIRA 3D CONSTRUCTION SIMULATOR

> Panduan Implementasi Step-by-Step, Standard Operating Procedure (SOP), dan Checklist Tugas untuk AI Assistant dan Developer.  
> **Purpose:** Siklus hidup pengembangan fitur, katalog lengkap 52 asset 3D GLB, dan checklist verifikasi kestabilan.  
> **Last Updated:** 2026-10-10  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 0. Prerequisite Reading (WAJIB BACA SEBELUM CODING)

Sebelum menambahkan modul baru atau mengubah kode yang ada, Anda **WAJIB** membaca dan memahami:
1. `AGENTS.md` (Aturan koding, pantangan arsitektur, tech stack, optimasi Three.js)
2. `MEMORY.md` (Status sprint aktif, gotchas, catatan mutasi terkini)
3. `.agents/brain/INDEX.md` (Peta otak memori proyek & filosofi anti-amnesia)
4. `.agents/ARCHITECTURE.md` (Struktur komponen spasial 3D, monorepo, & Zustand stores)
5. `.agents/DESIGN.md` (Design system tokens, warna UI editor, layout grid)
6. `.agents/PRD.md` (Spesifikasi fitur, use case, dan roadmap)

---

## 1. SOP Siklus Hidup Tugas (Task Execution SOP)

```
[ Terima Tugas ] 
       |
       v
[ 1. Context Orient ] -> Baca MEMORY.md & .agents/brain/INDEX.md
       |
       v
[ 2. Anti-Redundancy Check ] -> Cek .agents/brain/FEATURE_CATALOG.md
       |
       v
[ 3. Implementation Guard ] -> Patuhi y >= 0 & disposal WebGL
       |
       v
[ 4. Pre-Flight Validation ] -> pnpm build
       |
       v
[ 5. Brain Sync & Update ] -> Catat hasil di MEMORY.md & brain/
```

---

## 2. Daftar Koleksi Asset 3D GLB Resmi (Total 52 Model GLB dengan Thumbnail WebP)

Sistem telah disterilkan untuk **hanya menggunakan asset berkas 3D `.glb` murni** (total 52 model) dengan pratinjau gambar `.webp` beresolusi tinggi di folder `apps/web/public/thumbs/`:

### A. Peta & Prefab Maps (3 Model GLB)
1. **Pulau Petualangan Bajak Laut (`map-pirate-island`)**: `/models/pirate-adventure-map.glb`
2. **Peta Kota Pegunungan Taiwan (`map-taiwan`)**: `/models/taiwan-map.glb`
3. **Stasiun Trem Modern (`map-tram-station`)**: `/models/tram-station-map.glb`

### B. Mobil & Kendaraan Super/Kota (13 Model GLB)
1. **Lightning McQueen (`veh-mcqueen`)**: `/models/lightning-mcqueen.glb`
2. **Tokyo Mater Derek Truk (`veh-tokyo-mater`)**: `/models/tokyo-mater.glb`
3. **Toyota Supra GT Sport (`veh-supra`)**: `/models/toyota-supra.glb`
4. **Lamborghini Fenomeno Hyper (`veh-lambo`)**: `/models/lamborghini-fenomeno.glb`
5. **McLaren W1 Track Monster (`veh-mclaren`)**: `/models/mclaren-w1.glb`
6. **Volvo C30 Sport Hatchback (`veh-volvo-c30`)**: `/models/volvo-c30.glb`
7. **Mobil Polisi Patroli Interceptor (`veh-police-glb`)**: `/models/police-car.glb`
8. **Pack Mobil Penumpang Kota (`veh-passenger-pack`)**: `/models/passenger-car-pack.glb`
9. **Pack Kendaraan Lalu Lintas (`veh-traffic-pack`)**: `/models/traffic-vehicles.glb`
10. **Mobil Mainan Toy Car (`veh-toy-car`)**: `/models/ToyCar.glb`
11. **Truk Scania R440 Heavy Duty (`veh-scania-heavy`)**: `/models/scania.glb`
12. **Truk Scania Hauler R440 (`veh-scania-r440`)**: `/models/scania-r440.glb`
13. **Bus Scania Pariwisata & Kota (`veh-scania-bus`)**: `/models/scania-bus-pack.glb`

### C. Pesawat Terbang (2 Model GLB)
1. **Pesawat Penumpang Bandara (`air-airport-plane`)**: `/models/airport-airplane.glb`
2. **Pesawat Ringan Baling-Baling Cessna (`air-light-aircraft`)**: `/models/light-aircraft.glb`

### D. Traktor Pertanian & Alat Berat (7 Model GLB)
1. **Pack Traktor Pertanian Modern (`trac-farm-pack`)**: `/models/farm-tractors.glb`
2. **Traktor MTZ-80 Belarus Sawah (`trac-mtz80-lp`)**: `/models/tractor-mtz80-lowpoly.glb`
3. **Traktor MTZ-80 Heavy Duty (`trac-mtz80-heavy`)**: `/models/tractor-mtz80.glb`
4. **Traktor Rantai DT-75 Crawler (`trac-dt75`)**: `/models/tractor-dt75.glb`
5. **Traktor Hill Climb HCR2 (`trac-hcr2`)**: `/models/tractor-hcr2.glb`
6. **Traktor David Brown 25D Classic (`trac-david-brown`)**: `/models/tractor-david-brown.glb`
7. **Traktor Kerja Ladang Serbaguna (`trac-work-field`)**: `/models/tractor-tracktor.glb`

### E. Dekorasi, Wahana, Jalan & Karakter (27 Model GLB)
1. **Menara Seluncuran Taman (`dec-wahana-slide`)**: `/models/slide-playground.glb`
2. **Kolam Mandi Bola 3D (`dec-ball-pool`)**: `/models/ball-ball-pool.glb`
3. **Gapura Balon Karnaval (`dec-ball-arch`)**: `/models/ball-balloon-arch.glb`
4. **Balon Udara Warna-Warni (`dec-ball-balloons`)**: `/models/ball-colorful-balloons.glb`
5. **Bola-Bola Raksasa Mainan (`dec-ball-balls`)**: `/models/ball-balls.glb`
6. **Pohon Kartun Stylized (`dec-pohon-cartoon`)**: `/models/cartoon-trees.glb`
7. **Koleksi Pohon Polygon (`dec-pohon-polygon`)**: `/models/polygon-tree-pack.glb`
8. **Pohon Tua Rindang Old Oak (`dec-pohon-old`)**: `/models/old-tree.glb`
9. **Gugusan Hutan Low-Poly (`dec-pohon-scene`)**: `/models/low-poly-tree-scene.glb`
10. **Ramp Stunt Melompat (`dec-jalan-football`)**: `/models/football-ramp.glb`
11. **Ramp Akrobatik Kayu (`dec-jalan-wooden`)**: `/models/road-wooden-ramp.glb`
12. **Ramp Baja Industri (`dec-jalan-industrial`)**: `/models/road-industrial-ramp.glb`
13. **Jalan Looping 360° (`dec-jalan-stunt`)**: `/models/road-stunt.glb`
14. **Jalan Tol Modern Road 03 (`dec-jalan-highway`)**: `/models/road-03.glb`
15. **Jalan Aspal Standard (`dec-jalan-standard`)**: `/models/road-standard.glb`
16. **Superhero Spiderman Low-Poly (`dec-kar-spider-lp`)**: `/models/spiderman-low-poly.glb`
17. **Spiderman Brand New Day (`dec-kar-spider-new`)**: `/models/spiderman-new-day.glb`
18. **Spiderman Future Fight (`dec-kar-spider-mff`)**: `/models/spiderman-mff.glb`
19. **Superhero Iron Man (`dec-kar-ironman`)**: `/models/iron-man.glb`
20. **Patung Raksasa Hulk (`dec-kar-hulk`)**: `/models/hulk.glb`
21. **Palu Raksasa Akatosh (`dec-kar-akatosh`)**: `/models/akatosh-hammer.glb`
22. **Palu Mainan Raksasa (`dec-kar-toy-hammer`)**: `/models/toy-hammer.glb`
23. **Set Ornamen Mini (`dec-ornamen-small`)**: `/models/decoration-small.glb`
24. **Set Ornamen Taman 9827 (`dec-ornamen-9827`)**: `/models/decoration-9827.glb`
25. **Set Ornamen Modern F25 (`dec-ornamen-f25`)**: `/models/decoration-f25.glb`
26. **Set Dekorasi Khusus 9567 (`dec-ornamen-9567`)**: `/models/decoration-9567.glb`
27. **Set Dekorasi Area 64F (`dec-ornamen-64f`)**: `/models/decoration-64f.glb`

---

## 3. Alur Menambahkan Model GLB Baru

1. Masukkan berkas model `.glb` ke folder `apps/web/public/models/`.
2. Masukkan berkas thumbnail `.webp` ke folder `apps/web/public/thumbs/`.
3. Daftarkan definisi baru di [`packages/shared/src/constants/index.ts`](file:///f:/AUDIRA-3D-SIMULATOR/packages/shared/src/constants/index.ts) dan `apps/web/src/features/assets/assetCatalog.ts`.
4. Tambahkan entri ke [ASSET_AND_SIMULATION_MATRIX.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/ASSET_AND_SIMULATION_MATRIX.md).
5. Jalankan `pnpm build` untuk validasi tipe dan integritas bundler.

---

## 4. Checklist Verifikasi Mandatori

- [x] **1. Integritas Build:** `pnpm build` exit code 0.
- [x] **2. 100% Asset Bersih Ber-GLB:** Tidak ada lagi asset tanpa berkas model 3D di katalog.
- [x] **3. 100% Thumbnail WebP:** Seluruh asset memiliki thumbnail gambar asli di Asset Library.
- [x] **4. Raycast Placement & Driving:** Semua 52 model GLB dapat ditempatkan, digerakkan, dan dikendarai di scene 3D.
- [x] **5. Ground Level Alignment (Objek di Atas Lantai):** Seluruh objek wajib bertumpu di atas lantai (`y >= 0`). Dilarang tenggelam atau tembus ke dalam tanah/lantai. Model GLB dengan center pivot dinormalisasi otomatis oleh `ModelRenderer`.
