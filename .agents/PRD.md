# PRD — AUDIRA 3D CONSTRUCTION SIMULATOR

> Product Requirements Document: Browser-Based 3D World Builder & Construction Simulator.  
> **Version:** v1.0.0-dev  
> **Last Updated:** 2026-10-10  
> **Status:** Active / V1 Core Implementation Ready & Asset Enriched  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA) & Antigravity AI  

---

## 1. Executive Summary

**AUDIRA 3D CONSTRUCTION SIMULATOR** adalah game simulator 3D dan world builder berbasis web modern yang berjalan langsung di WebGL/WebGPU menggunakan ekosistem React, TypeScript, Three.js, React Three Fiber (R3F), dan Zustand.

Game ini mengintegrasikan 4 pilar pengalaman:
1. **3D World Builder**: Editor spasial bebas dengan terrain 100x100m, snapping grid 1m, dan manipulasi transform instan (W/E/R).
2. **Construction Simulator**: Simulasi proyek konstruksi fisik, tahapan pembangunan (land prep, foundation, structure, roof, finishing), dan penataan infrastruktur jalan.
3. **Vehicle & Equipment Simulator**: Interaksi alat berat dan kendaraan ikonik (Truk Scania R440, Traktor DT-75 Crawler & MTZ-80, Supercar, Bus, Pesawat).
4. **Sandbox City & Park Builder**: Penataan lingkungan hidup, pulau petualangan, stasiun trem, rumah, perancah konstruksi, dan wahana taman bermain.

- **Vision Statement**: Menjadi world builder konstruksi 3D berbasis web paling responsif, estetis, dan ekspansif tanpa perlu install game engine eksternal.
- **Target Users**: Gamers simulator, pecinta konstruksi & city builder, arsitek/desainer level, dan kreator sandbox virtual.

---

## 2. Fitur Utama V1 (Core Implementation)

### 2.1 3D Sandbox World & Terrain
- Padang rumput stylized 100m x 100m dengan ground bounds yang jelas.
- Grid visual 1 meter dengan fungsi Snapping otomatis (`S`) dan toggle grid (`G`).
- Pencahayaan Directional Sunlight dengan soft shadow mapping (`2048x2048`) dan langit procedural.
- Multi-preset kamera: Isometric (`[30, 30, 30]`), Top-Down (`[0, 50, 0]`), dan Free Orbit.

### 2.2 Sistem Transformasi Objek (TransformControls)
- Dukungan mode: Translate / Move (`W`), Rotate (`E`), Scale (`R`), dan Select (`Q`).
- Sinkronisasi dua arah real-time dengan Properties Panel di sisi kanan.
- Penguncian batas ketinggian alas objek agar selalu berada di atas permukaan tanah (`y >= 0`).

### 2.3 Raycast Placement System
- Klik asset di library bawah -> Arahkan kursor ke tanah -> Preview penempatan dinamis -> Klik untuk menempatkan objek dengan snap koordinat otomatis.
- Tekan `Esc` untuk membatalkan penempatan aktif.

### 2.4 Properties Panel (Sisi Kanan)
- Inspeksi nama objek, ID unik, dan kategori.
- Kontrol numerik langsung untuk koordinat Posisi X/Y/Z, Rotasi X/Y/Z, dan Skala X/Y/Z.
- Toggle Visibilitas dan Penguncian Objek (Lock).
- Aksi instan: Duplicate (`Ctrl+D`), Delete (`Delete` / `Backspace`), dan Reset Transform.

### 2.5 Asset Library (Drawer Bawah)
- 6 Kategori terstruktur: Peta (Maps), Kendaraan (Vehicles), Traktor & Alat Berat (Tractors), Pesawat (Aircraft), Dekorasi (Decoration), Alam (Nature).
- Koleksi 52 Model GLB biner murni dengan thumbnail WebP resolusi tajam.
- Filter pencarian nama asset instan dan navigasi kategori interaktif.

### 2.6 Sistem Undo & Redo (Command Pattern)
- Riwayat snapshot mutasi dunia hingga 30 langkah terakhir.
- Pintasan `Ctrl+Z` (Undo) dan `Ctrl+Y` (Redo).

### 2.7 Penyimpanan Proyek (JSON & LocalStorage)
- Ekspor konfigurasi dunia ke file format `.json` untuk backup dan sharing.
- Impor file `.json` dengan validasi skema Zod untuk melanjutkan proyek.
- Auto-save debounced (500ms) ke browser LocalStorage.

---

## 3. Roadmap Rilis

- **V1 (Saat Ini - Selesai & Stabil):** Core Editor 3D Sandbox, R3F Viewport, 52 GLB Asset Library dengan WebP Thumbs, TransformControls, Properties Panel, Grid Snap, Ground Alignment (`y >= 0`), Undo/Redo, JSON Save/Load.
- **V2 (Planned):** Mode Mengemudi WASD, Dynamic Wheel Rotation, Integrasi Physics RigidBody `@react-three/rapier`, Terrain Sculpting (raise/lower/flatten), dan Spline Road Builder modular.
- **V3 (Planned):** Fastify REST API backend persistence dengan PostgreSQL & Prisma ORM, Career Mode Misi Bertahap, dan Online Multiplayer world synchronization via WebSocket.
