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

## 2. Daftar Koleksi Asset 3D GLB Resmi (Total 78 Model GLB)

Seluruh asset fisik telah tersimpan secara **100% lokal** di folder:
- **`f:\AUDIRA-3D-SIMULATOR\assets\models\`** (Berkas model 3D biner `.glb` murni)
- **`f:\AUDIRA-3D-SIMULATOR\assets\thumbs\`** (Berkas gambar thumbnail preview)
- Serta termirror otomatis di **`apps/web/public/models/`** dan **`apps/web/public/thumbs/`** untuk runtime WebGL.

### A. Peta, Arena & Prefab Circuits (20 Peta & Sirkuit GLB)
1. **Sirkuit F1 Albert Park Melbourne (`map-albert-park-f1`)**: `/models/bangpay/albert-park-circuit-melbourne-2018-layout.glb` (300m)
2. **Peta Alam Terbuka (`map-big-environment`)**: `/models/bangpay/big-environment-map.glb` (300m)
3. **Desa Kartun Terpadu (`map-cartoon-village`)**: `/models/bangpay/cartoon-village-combined.glb` (260m)
4. **Peta Kawasan Industri & Jalan QMS (`map-qms-complex`)**: `/models/bangpay/map-qms.glb` (200m)
5. **Area Ladang Pertanian & Parkir (`map-farming-parking`)**: `/models/bangpay/farming-parking-complete.glb` (180m)
6. **Taman Bermain & Garasi Mobil (`map-kidspark-garage`)**: `/models/bangpay/kidspark-car-garage.glb` (160m)
7. **Plaza Bundaran Air Mancur (`map-crossing-fountain`)**: `/models/bangpay/crossing-fountain.glb` (120m)
8. **Arena Sirkuit Kolam Warna (`map-kolam-warna`)**: `/models/bangpay/kolam-warna.glb` (120m)
9. **Sirkuit Jalan Raya Berkelok (`map-road-circuit`)**: `/models/bangpay/road.glb` (180m)
10. **Pulau Petualangan Bajak Laut (`map-pirate-island`)**: `/models/pirate-adventure-map.glb` (260m)
11. **Peta Kota Pegunungan Taiwan (`map-taiwan`)**: `/models/taiwan-map.glb` (260m)
12. **Stasiun Trem Modern (`map-tram-station`)**: `/models/tram-station-map.glb` (260m)
13. **Lumbung & Bangunan Barn Warna (`map-colored-barn`)**: `/models/bangpay/colored-barn-reference.glb` (35m)
14. **Kompleks Garasi Warna-Warni (`map-garage-colors`)**: `/models/bangpay/garage-of-colors.glb` (28m)
15. **Gedung Parkir Bertingkat (`map-doubleparking`)**: `/models/bangpay/doubleparking.glb` (35m)
16. **Sirkuit Cincin Torus Melingkar 360° (`map-torus-circuit`)**: `/models/bangpay/torus.glb` (25m)
17. **Lintasan Rintangan Balok Hancur (`map-balok-track`)**: `/models/bangpay/lintasan-balok-hancur.glb` (35m)
18. **Arena Sirkuit Lantai Lava Membara (`map-lava-arena`)**: `/models/bangpay/lava-floor-animated.glb` (24m)
19. **Jembatan Penghubung Baja FS22 (`map-fs22-bridge`)**: `/models/bangpay/professional-bridge-complete-textured.glb` (22m)
20. **Sirkuit Jalan Bebas Hambatan (`map-highway-03`)**: `/models/road-03.glb` (24m)

### B. Mobil & Kendaraan Super/Kota (19 Model GLB)
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
14. **Mercedes-Benz AMG C63 C-Coupe DTM (`veh-mercedes-amg`)**: `/models/bangpay/mercedes-benz-amg-c63-c-coupe-dtm.glb`
15. **Truk Pemadam Kebakaran (`veh-firetruck`)**: `/models/bangpay/firetruck.glb`
16. **Truk Scania 113H Mata Berkedip (`veh-scania-113h`)**: `/models/bangpay/scania-113h-blinking-eyes.glb`
17. **Truk Scania R440 Merah Mata Berkedip (`veh-scania-r440-eyes`)**: `/models/bangpay/scania-r440-red-auto-eyes-v2.glb`
18. **Truk Scania Complete Edition (`veh-scania-complete`)**: `/models/bangpay/scania-truck-complete.glb`
19. **Jeep Wrangler Off-Road Mata Hidup (`veh-jeep-wrangler`)**: `/models/bangpay/jeep-wrangler-eyes.glb`

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

### E. Dekorasi, Wahana, Jalan & Karakter (35 Model GLB)
**Wahana & Bola (10 Model GLB):**
1. **Menara Seluncuran Taman (`dec-wahana-slide`)**: `/models/slide-playground.glb`
2. **Kolam Mandi Bola 3D (`dec-ball-pool`)**: `/models/ball-ball-pool.glb`
3. **Gapura Balon Karnaval (`dec-ball-arch`)**: `/models/ball-balloon-arch.glb`
4. **Balon Udara Warna-Warni (`dec-ball-balloons`)**: `/models/ball-colorful-balloons.glb`
5. **Bola-Bola Raksasa Mainan (`dec-ball-balls`)**: `/models/ball-balls.glb`
6. **Kompleks Wahana Bermain Playground (`dec-wahana-playground-complex`)**: `/models/bangpay/playground-no-white-base.glb`
7. **Platform Wahana Bebek Raksasa (`dec-wahana-duck-platform`)**: `/models/bangpay/duck-standing-platform-complete-textured.glb`
8. **Gapura Balon Festival Warna-Warni (`dec-wahana-ballon-gate`)**: `/models/bangpay/ballon-gate.glb`
9. **Pin Bowling Raksasa Warna-Warni (`dec-bola-bowling-pin`)**: `/models/bangpay/colorful-bowling-pin.glb`
10. **Balon Udara Panas Terbang (`dec-wahana-hot-air-balloon`)**: `/models/bangpay/hot-air-ballon.glb`

**Pohon & Alam (6 Model GLB):**
11. **Pohon Kartun Stylized (`dec-pohon-cartoon`)**: `/models/cartoon-trees.glb`
12. **Koleksi Pohon Polygon (`dec-pohon-polygon`)**: `/models/polygon-tree-pack.glb`
13. **Pohon Tua Rindang Old Oak (`dec-pohon-old`)**: `/models/old-tree.glb`
14. **Gugusan Hutan Low-Poly (`dec-pohon-scene`)**: `/models/low-poly-tree-scene.glb`
15. **Set Batu Karang Alam Stylized (`dec-pohon-rocks-pack`)**: `/models/bangpay/free-pack-rocks-stylized.glb`
16. **Komposisi Bebatuan & Pepohonan (`dec-pohon-rocks-trees`)**: `/models/bangpay/rocks-and-trees.glb`

**Jalan & Ramp Stunt (12 Model GLB):**
17. **Ramp Stunt Melompat (`dec-jalan-football`)**: `/models/football-ramp.glb`
18. **Ramp Akrobatik Kayu (`dec-jalan-wooden`)**: `/models/road-wooden-ramp.glb`
19. **Ramp Baja Industri (`dec-jalan-industrial`)**: `/models/road-industrial-ramp.glb`
20. **Jalan Looping 360° (`dec-jalan-stunt`)**: `/models/road-stunt.glb`
21. **Jalan Tol Modern Road 03 (`dec-jalan-highway`)**: `/models/road-03.glb`
22. **Jalan Aspal Standard (`dec-jalan-standard`)**: `/models/road-standard.glb`
23. **Sirkuit Cincin Torus Melingkar (`dec-jalan-torus`)**: `/models/bangpay/torus.glb`
24. **Lintasan Rintangan Balok Hancur (`dec-jalan-balok-hancur`)**: `/models/bangpay/lintasan-balok-hancur.glb`
25. **Ramp Modifikasi Baru FS22 Textured (`dec-jalan-ramp-fs22-new`)**: `/models/bangpay/new-ramp-mods-fs22-textured.glb`
26. **Ramp Akrobatik FS22 Mod Textured (`dec-jalan-ramp-fs22-mod`)**: `/models/bangpay/ramp-fs22-mod-textured.glb`
27. **Jembatan Baja Profesional FS22 (`dec-jalan-bridge-pro`)**: `/models/bangpay/professional-bridge-complete-textured.glb`
28. **Lantai Lava Animasi Membara (`dec-jalan-lava-floor`)**: `/models/bangpay/lava-floor-animated.glb`

**Karakter & Superhero (7 Model GLB):**
29. **Superhero Spiderman Low-Poly (`dec-kar-spider-lp`)**: `/models/spiderman-low-poly.glb`
30. **Spiderman Brand New Day (`dec-kar-spider-new`)**: `/models/spiderman-new-day.glb`
31. **Spiderman Future Fight (`dec-kar-spider-mff`)**: `/models/spiderman-mff.glb`
32. **Superhero Iron Man (`dec-kar-ironman`)**: `/models/iron-man.glb`
33. **Patung Raksasa Hulk (`dec-kar-hulk`)**: `/models/hulk.glb`
34. **Bumblebee Transformers Run Animated (`dec-kar-bumblebee`)**: `/models/bangpay/bumblebee-run-optimized.glb`
35. **Optimus Prime Transformers Run Animated (`dec-kar-optimus`)**: `/models/bangpay/optimus-prime-run.glb`
36. **N-Gen Mech Robot Transformer (`dec-kar-mech-transformer`)**: `/models/bangpay/n-gen-mech-tranformer.glb`
37. **Koleksi Karakter Telur Superhero (`dec-kar-super-eggs`)**: `/models/bangpay/super-heroes-eggs-model.glb`

---

## 3. Alur Menambahkan Model GLB Baru

1. Masukkan berkas model `.glb` ke folder `apps/web/public/models/`.
2. Masukkan berkas thumbnail ke folder `apps/web/public/thumbs/`.
3. Daftarkan definisi baru di [`packages/shared/src/constants/index.ts`](file:///f:/AUDIRA-3D-SIMULATOR/packages/shared/src/constants/index.ts).
4. Jalankan `pnpm build` untuk validasi tipe dan integritas bundler.

---

## 4. Checklist Verifikasi Mandatori

- [x] **1. Integritas Build:** `pnpm build` exit code 0.
- [x] **2. 100% Asset Bersih Ber-GLB:** Total 78 model berkas 3D lengkap di katalog.
- [x] **3. 100% Thumbnail:** Seluruh asset memiliki thumbnail gambar asli di Asset Library.
- [x] **4. Raycast Placement & Driving:** Semua model GLB dapat ditempatkan, digerakkan, dan dikendarai di scene 3D.
- [x] **5. Ground Level Alignment (Objek di Atas Lantai):** Seluruh objek bertumpu di atas lantai (`y >= 0`). Dilarang tenggelam ke dalam tanah. Normalisasi otomatis oleh `ModelRenderer`.
- [x] **6. Rule Urutan Asset Baru & Badge NEW:** Setiap asset baru yang diintegrasikan wajib memiliki properti `isNew: true`. Di Asset Library, asset baru otomatis disortir ke urutan paling depan (`sort: isNew first`) dan dilengkapi badge visual `✨ NEW` bergradien menyala serta aksen border gold/amber.
- [x] **7. Perekaman Video & Multi-Angle Tracking Sinematik:** Perekaman video langsung dari kanvas WebGL (MediaRecorder 60 FPS, Bitrate HD/Ultra, auto-download .webm). Dilengkapi kontrol kamera multi-sudut dinamis (Chase, Front/Hood, Samping Kiri/Kanan, Drone Atas, Orbit 360° Sinematik, Low Stunt) yang otomatis melacak objek/kendaraan terpilih dengan pengaturan slider jarak dan ketinggian.

