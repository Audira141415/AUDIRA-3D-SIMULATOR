# UPDATE HISTORY & ROADMAP — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Changelog, Active Sprints, and Future Architecture Roadmap**  
> *Catatan Evolusi Versi dan Rencana Pengembangan Jangka Menengah/Panjang.*

---

## 1. Version Changelog

### v1.0.0-dev — Core 3D Sandbox & GLB Asset Engine (Current Milestone)
- **3D Viewport (@react-three/fiber)**: Inisialisasi canvas 3D dengan pencahayaan matahari terarah, soft shadows, dan kontrol kamera isometrik/orbit halus.
- **Katalog 52 Asset GLB Resmi**: Integrasi penuh berkas model `.glb` murni beserta thumbnail `.webp` resolusi tinggi di folder `public/`.
- **Ground Alignment Guarantee (`y >= 0`)**: Normalisasi otomatis bounding box mesh (`clone.position.y = -box.min.y`) sehingga semua roda, bumper, dan alas objek menempel sempurna di atas lantai.
- **Transform Gizmo**: Dukungan mode Translasi (`W`), Rotasi (`E`), dan Skala (`R`) dengan Drei TransformControls.
- **Grid Snapping System**: Snap otomatis koordinat 1m / 0.5m dengan pintasan toggle cepat (`S`) dan toggle grid (`G`).
- **Sidebar Properties Panel**: Inspeksi numerik interaktif dua arah dengan sinkronisasi posisi, rotasi, skala, kunci objek, dan duplikasi (`Ctrl+D`).
- **History Undo/Redo**: Command pattern snapshot state (maksimum 30 langkah) via `Ctrl+Z` dan `Ctrl+Y`.
- **World Persistence**: Ekspor dan impor berkas `.json` mandiri serta auto-sync ke browser LocalStorage.

---

## 2. Active Sprint (In-Progress)

- [ ] **Mode Mengemudi (Drive Mode WASD)**: Sistem seleksi kendaraan aktif untuk mengontrol mobil atau traktor secara langsung dengan kemudi roda depan dan akselerasi roda belakang.
- [ ] **Terrain Bounds & Visual Water**: Penambahan batasan tepi terrain 100x100m dengan shader air stylized di sekeliling pulau.
- [ ] **Sound Effects (Web Audio API)**: Efek suara mesin mobil, suara penempatan objek (*snap click*), dan audio latar atmosfer konstruksi.

---

## 3. Future Roadmap

### Milestone V2: Physics & Advanced World Building
- **RigidBody Physics (@react-three/rapier)**: Gravitasi nyata, deteksi tabrakan mesh-to-mesh, dan suspensi kendaraan dinamis.
- **Terrain Sculpting**: Modifikasi mesh tanah secara langsung (raise, lower, flatten, smooth) menggunakan brush radius raycast.
- **Procedural Spline Roads**: Penarikan garis jalan aspal fleksibel dengan kurva Bezier dan auto-connect persimpangan.

### Milestone V3: Construction Career Mode & Multiplayer Cloud
- **Fastify Backend REST API**: Penyimpanan slot dunia online dengan autentikasi JWT dan database PostgreSQL via Prisma ORM.
- **Tahapan Proyek Berjenjang (Career Mode)**: Misi konstruksi berhadiah budget virtual: Penggalian tanah -> Pengecoran fondasi -> Pemasangan rangka baja -> Pemasangan atap.
- **Multiplayer Synchronized Sandbox**: Sinkronisasi penempatan objek dan pergerakan kendaraan bersama pemain lain via WebSocket (Socket.io).
