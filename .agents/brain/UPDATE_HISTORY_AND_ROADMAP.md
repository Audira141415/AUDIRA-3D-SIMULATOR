# UPDATE HISTORY & ROADMAP — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Changelog, Active Sprints, and Future Architecture Roadmap**  
> *Catatan Evolusi Versi dan Rencana Pengembangan Jangka Menengah/Panjang.*

---

## 1. Version Changelog

### v1.5.0 — Full BangPay Feature Parity & Multi-Layer Autonomous Ecosystem (Current Release)
- **FEAT-36: Multi-Layer Activity Recording & Ghost Car Replay (`MultiLayerGhostEngine.tsx` & `MultiLayerModal.tsx`)**:
  - Perekaman aksi kendaraan secara berlapis (*layer-by-layer*). Saat merekam mobil berikutnya, mobil dari layer sebelumnya diputar ulang secara simultan sebagai mobil bayangan (*ghost car*) dengan ring neon pendar tanpa tabrakan fisik.
  - Timeline scrubbing presisi tinggi, pengaturan mute layer, rekam ulang per-layer, kamera otomatis ikuti kendaraan aktif, dan loop playback.
- **FEAT-37: 3D Terrain Sculptor & Brush Tools (`useTerrainSculptStore.ts`, `TerrainSculptToolbar.tsx`, `TerrainSculptRenderer.tsx`)**:
  - Deformasi dan pembentukan kontur tanah 3D secara interaktif langsung di kanvas WebGL.
  - 5 alat kuas pahat: `raise` (tinggikan bukit), `lower` (cekungkan lembah), `flatten` (ratakan tanah), `slope` (lereng tanjakan), dan `smooth` (haluskan permukaan).
  - Pengaturan radius area kuas (1m - 40m), kekuatan (*strength* 0.1x - 2.0x), dan target ketinggian.
- **FEAT-38: Kontrol Hidrolik & Efek Kerusakan Kendaraan (`useVehicleFxStore.ts` & `VehicleFxModal.tsx`)**:
  - Kontrol hidrolik bak dump truck dan lengan alat berat: mode `ON / OFF / LOOP` dengan kecepatan animasi dinamis (0.25x - 3.0x).
  - Efek benturan fisik: `shatter` (retak bodi), `explode` (ledakan partikel melayang), dan `crush` (penyok/remuk vertikal) dengan tombol pemulihan instan *"Pulihkan Semua Objek"*.
- **FEAT-39: Camera & Visual Studio (`useVisualStyleStore.ts`, `VisualCameraStudioModal.tsx`, `AspectRatioOverlay.tsx`)**:
  - Efek sinematik *Slow-motion 0.25x* untuk pengambilan gambar sinematik.
  - Garis panduan rasio aspek rekam video: `16:9` (YouTube Landscape), `9:16` (Shorts / TikTok / Reels Vertical), `1:1` (Instagram), dan `21:9` (Cinematic Ultrawide).
  - 5 filter pencahayaan atmosfer: Alami Cerah, Senja Keemasan (*Golden Sunset*), Cyberpunk Neon, Kabut Pegunungan (*Moody Fog*), dan Film Retro Klasik.
- **FEAT-40: Backup & Restore Peta (`WorldBackupModal.tsx`)**:
  - Sistem pencadangan terstruktur (.json) menyimpan seluruh objek, kendaraan, jalan, dan kontur ketinggian tanah.
  - Validasi berkas pra-pemulihan dan integrasi impor 1-klik dengan notifikasi status visual.
- **FEAT-41: Adaptive Graphic Quality Profile (`useDeviceProfileStore.ts` & `QualityToggle.tsx`)**:
  - Sakelar cepat 1-klik untuk 3 profil grafis: `HEMAT (60 FPS)`, `STANDAR`, dan `ULTRA HD` yang menyesuaikan pixel ratio, shadow mapping, dan antialiasing secara adaptif.
- **Aset Baru Diadopsi**:
  - Model 3D: `map-desert-world-v2.glb` (Peta Dunia Gurun Pasir V2 skala 260m) dan thumbnail `desert-map.webp`.
  - Paket Tekstur PBR: Normal & Roughness map untuk rumput dan aspal (`grass_ground_normal.jpg`, `grass_ground_rough.jpg`, `asphalt_02_color.jpg`, `asphalt_02_normal.jpg`, `asphalt_02_rough.jpg`).

### v1.4.1 — Clean UI Overhaul & WebGL Performance Optimization (Current Release)
- **Penghapusan Efek Air Laut yang Berat**: Mengeliminasi kalkulasi gelombang CPU multi-oktaf dari scene 3D sehingga WebGL kembali berjalan mulus stabil pada 60 FPS tanpa lag atau frame drop.
- **De-cluttering UI Mode Mengemudi**: Panel editor yang memenuhi layar (Properties Panel di kanan selebar 320px, Asset Library bawah 192px, Toolbar, Navigation Cube, Video Panel, Context Menu) kini secara otomatis disembunyikan saat simulasi/mengemudi aktif (`isPlaying`), memberikan sudut pandang berkendara 100% immersive dan bebas distraksi.
- **Top-Centered Camera Mode Bar**: Kamera pill selector dipindahkan ke posisi atas tengah (`top-4 left-1/2 -translate-x-1/2`) dengan desain floating pill kapsul kaca gelap (`bg-slate-950/80 backdrop-blur-xl border-white/15`) yang rapi, modern, dan tidak lagi bertumpuk dengan HUD lainnya.
- **Supercar Digital Cockpit Dashboard**: Panel instrumen kendaraan didesain ulang bergaya kokpit digital supercar di pojok kiri bawah (`bottom-6 left-6`) lengkap dengan speedometer dial melingkar beranimasi, indikator pulse status aktif, meteran Turbo Nitro bercahaya cyan, dan keycap kontrol minimalis.
- **Floating Quick Dock Sisi Kanan**: Kontrol instan (Nitro, Lampu Utama, Lampu Jauh, Sein Kiri/Kanan, Klakson, Audio) ditata rapi dalam 1 dock vertikal transparan di sisi kanan tengah dengan efek hover glow.
- **Header Minimalis Saat Driving**: Saat mengemudi, tombol-tombol editor di Header atas otomatis digantikan oleh badge status bersih `Mode Simulasi & Mengemudi`.

### v1.4.0 — Visual Spektakuler & Fisika Mengemudi Lanjutan (Previous Milestone)
- **FEAT-32: Cuaca Hujan Tropis Dinamis (`RainParticles.tsx`)**: Sistem 2000 partikel tetesan air hujan 3D Three.js yang tertiup angin dinamis, kabut badai kelabu lebat, kilatan petir acak bergradasi intensitas 4.5x, serta sintesis audio hujan lebat & gemuruh guntur Web Audio API.
- **FEAT-34: Deteksi Benturan Rintangan & Rebound Physics (`VehicleSimulator.tsx`)**: Pemeriksaan tabrakan kendaraan terhadap bangunan, pohon, dan tiang dengan efek pantulan elastis (*rebound bounce*), guncangan benturan kamera (*camera impact jolt*), dan efek suara hantaman logam (*crunch bump SFX*).
- **FEAT-35: Turbo Nitro Boost & Semburan Api Knalpot (`VehicleParticleTrail.tsx` & `VehicleQuickControls.tsx`)**: Mode pendorong akselerasi 2.2x dengan tombol `Shift` atau tombol sentuh HUD, semburan partikel api knalpot cyan berpendar (`#00f0ff`), efek hentakan kamera FOV (*speed punch 45° → 54°*), suara raungan turbin jet, dan indikator tangki Nitro real-time.
- **Header Weather Selector**: Tombol pergantian cuaca cepat 1-klik di panel atas (`☀️ Cerah` → `🌧️ Hujan` → `☁️ Mendung`).

### v1.3.0 — Multi-Agent Agency Governance & 3D Dynamic Vehicle Simulation (Previous Release)
- **Multi-Agent Agency Architecture (`MULTI_AGENT_AGENCY_ORCHESTRATION.md`)**: Penggabungan repositori `agency-agents-main` ke dalam `.agents/` dan `.agents/skills/audira-multiagent-orchestrator` untuk eksekusi terkoordinasi 5 divisi spesialis (3D Scene, Physics, Senior Dev, Reality Checker QA, dan Orchestrator).
- **FEAT-28: Dynamic 3D Vehicle Lighting (`VehicleDynamicLights.tsx`)**: Sistem pencahayaan dinamis 3D yang berpijak pada kendaraan aktif: Dual SpotLight Headlights (`L`), High Beam penetrasi jauh (`K`), Red Brake & Taillight Glow, White Reverse Light, dan Amber Pulsing Turn Signals (`Z`/`X`).
- **FEAT-29: Dynamic Tire Dust & Skid Particle Trail (`VehicleParticleTrail.tsx`)**: Simulasi partikel debu suspensi ban Three.js BufferGeometry real-time saat akselerasi tinggi, drifting/manuver tajam, atau pengereman keras.
- **FEAT-30: Quick Hotkeys & Enhanced HUD**: Penambahan tombol pintasan langsung dan panduan HUD interaktif tanpa membuka menu tersembunyi.
- **Validasi Build 100% Bersih**: `pnpm run build` tervalidasi 0 error tipe TypeScript dan bundle produksi Vite 6.

### v1.2.0 — Adopsi 10 Fitur Kreator Suite Bang Pay Magic Pro (Previous Milestone)
- **Master UI Hub (`KreatorStudioModal.tsx`)**: Integrasi penuh 10 alat produksi konten multimedia dengan navigasi tab pita responsif, Dark Modern palette, dan modal glassmorphic.
- **FEAT-18: Songmaker Studio (`SongmakerTool.tsx`)**: Pembuat lirik berbasis tema, pemilih genre (Pop, Koplo, Lofi, Rock, EDM, Religi), tempo BPM tap, progresi akor interaktif dengan Web Audio synth, dan generator prompt Suno/Udio.
- **FEAT-19: Video Editor & Visualizer (`VideoEditorTool.tsx`)**: Timeline multi-track video simulasi 3D + audio + subtitle, rasio aspek 16:9 & 9:16 Shorts/TikTok, spectrum FFT bars/wave/radial, dan ekspor snapshot video.
- **FEAT-20: Audio Editor & Mastering DSP (`AudioEditorTool.tsx`)**: Equalizer Parametric 3-band, compressor gain, reverb ambience, limiter, FFT frequency response graph real-time 128 bins.
- **FEAT-21: Murotal & Caption Quran (`MurotalTool.tsx`)**: Teks khat kaligrafi Arab dengan harakat lengkap, transliterasi Latin & terjemahan Indonesia, streaming audio Qari Mishary Alafasy, sinkronisasi ayat, dan integrasi ke Video Editor.
- **FEAT-22: Audio Metadata & ID3 Editor (`MetadataTool.tsx`)**: Inspeksi & modifikasi tag ID3v2/RIFF (Title, Artist, Album, Year, Genre, Track#, ISRC, Composer), cover art uploader, dan ekspor JSON metadata.
- **FEAT-23: Suno Track Downloader (`SunoDownloaderTool.tsx`)**: Ekstraksi dan pengunduhan lagu Suno AI langsung via link, konversi MP3/MP4, audio streaming player, dan jembatan instan ke Audio/Video Editor.
- **FEAT-24: Album Gen & Vinyl Player (`AlbumGenTool.tsx`)**: Piringan hitam vinyl 3D berputar interaktif dengan tonearm, penyusun kompilasi lagu, kalkulator durasi LP, dan ekspor tracklist CUE sheet.
- **FEAT-25: Smart YT Creator Optimizer (`SmartYtTool.tsx`)**: Generator judul video ber-CTR tinggi berskor analitis, penemu tag & keyword YouTube Studio 1-klik salin, dan template deskripsi terstruktur dengan timestamps.
- **FEAT-26: VO GEN AI Text-to-Speech (`VoGenTool.tsx`)**: Sintesis suara peramban via Web Speech API (Narator, Komentator, Pengemudi), kontrol pitch/speed/volume, dan sutradara naskah multi-karakter.
- **FEAT-27: AI Bang Pay Studio (`AiBangPayTool.tsx`)**: Laboratorium prompt AI Text-to-Image & Video dengan gaya Isometric 3D / Unreal Engine 5 / Cyberpunk, serta transfer langsung ke AI 3D Mesh Maker (Forge3D).
- **Zustand State (`useKreatorStudioStore.ts`)**: Manajemen state terpusat untuk navigasi tool, transfer audio lintas alat, dan sinkronisasi modal.

### v1.0.0-dev — Core 3D Sandbox & GLB Asset Engine
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
