# FEATURE CATALOG — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Master Catalog of Capabilities, 3D Editor Tools, and Simulation Systems**  
> *Single Source of Truth untuk Seluruh Modul Fitur (Anti-Redundansi).*

---

## 1. Katalog Fitur Inti (Core Sandbox Editor)

| ID Fitur | Modul | Deskripsi Teknis | Status | Shortcut |
| :--- | :--- | :--- | :--- | :--- |
| **FEAT-01** | **3D Viewport & Canvas** | Canvas R3F dengan Antialias, ACESFilmicToneMapping, Directional Sunlight + Soft Shadows, dan Ground Plane 100x100m. | ✅ Selesai | Mouse Drag |
| **FEAT-02** | **Kamera Multi-Preset** | Tiga mode kamera: Isometric (`[30, 30, 30]`), Top-Down (`[0, 50, 0]`), dan Free Perspective dengan OrbitControls halus. | ✅ Selesai | Toolbar / F |
| **FEAT-03** | **Grid & Snapping Presisi** | Grid visual 1 meter dengan snapping otomatis titik koordinat integer atau kelipatan 0.5m. | ✅ Selesai | `G` (Grid), `S` (Snap) |
| **FEAT-04** | **TransformControls Gizmo** | Manipulasi interaktif sumbu $X, Y, Z$ untuk Translasi (Move), Rotasi, dan Skala langsung pada objek 3D. | ✅ Selesai | `W`, `E`, `R`, `Q` |
| **FEAT-05** | **Raycast Placement System** | Sistem penempatan objek via raycasting kursor ke permukaan tanah dengan visual placement ghost & snap alignment. | ✅ Selesai | Click -> Place / `Esc` |
| **FEAT-06** | **Properties Panel (Sidebar)** | Panel inspeksi numerik real-time di sisi kanan: posisi $X/Y/Z$, rotasi derajat, skala, toggle visibility, lock, clone, dan delete. | ✅ Selesai | Klik Objek |
| **FEAT-07** | **Asset Library Bar (Dock Bawah)**| Drawer dock bawah berisi 52 Model GLB terklasifikasi dalam 6 kategori: Maps, Vehicles, Tractors, Aircraft, Decoration, Nature. | ✅ Selesai | Klik Kartu Asset |
| **FEAT-08** | **Ground Level Normalization** | Algoritma pengunci alas objek: Bounding box dihitung otomatis (`clone.position.y = -box.min.y`) sehingga objek tidak tenggelam (`y >= 0`). | ✅ Selesai | Otomatis |
| **FEAT-09** | **Undo / Redo History** | Command pattern snapshot state (maksimum 30 langkah) untuk membatalkan atau mengulang mutasi penempatan/transformasi. | ✅ Selesai | `Ctrl+Z`, `Ctrl+Y` |
| **FEAT-10** | **Proyek Save / Load JSON** | Ekspor seluruh tata letak dunia ke file `.json`, impor kembali berkas save file, serta auto-save ke browser LocalStorage. | ✅ Selesai | Header Menu |

---

## 2. Fitur Kendaraan & Simulasi Fisika (Vehicle & Physics)

| ID Fitur | Modul | Deskripsi Teknis | Status |
| :--- | :--- | :--- | :--- |
| **FEAT-11** | **Koleksi Kendaraan GLB** | 13 Model mobil & truk (Scania R440, Tokyo Mater, Lightning McQueen, Supra GT, Volvo C30, Polisi, Bus). | ✅ Aktif (Visual) |
| **FEAT-12** | **Koleksi Alat Berat & Traktor** | 7 Model traktor (MTZ-80 Lowpoly & Heavy, DT-75 Crawler, Hill Climb HCR2, David Brown, Modern Farm Pack). | ✅ Aktif (Visual) |
| **FEAT-13** | **Mode Berkendara (Drive Mode)** | Sistem kontrol interaktif WASD untuk mengemudikan kendaraan terpilih di atas tanah dengan animasi putaran roda. | 🟡 Sprint V2 |
| **FEAT-14** | **RigidBody Physics (@react-three/rapier)** | Integrasi collider fisik nyata (cuboid/capsule/convex hull) untuk gravitasi dan tabrakan antar kendaraan. | 🟡 Sprint V2 |

---

## 3. Fitur Konstruksi & Manajemen Proyek (Construction Pipeline)

| ID Fitur | Modul | Deskripsi Teknis | Status |
| :--- | :--- | :--- | :--- |
| **FEAT-15** | **Tahapan Konstruksi Bangunan** | Sistem penahapan bangunan: Land Prep -> Foundation -> Structure -> Walls -> Roof -> Finishing Interior. | 🟡 Prototype V2 |
| **FEAT-16** | **Prefab Maps & Environment** | 3 Peta lingkungan siap pakai: Pulau Bajak Laut, Kota Pegunungan Taiwan, dan Stasiun Trem Modern. | ✅ Aktif |
| **FEAT-17** | **Penyimpanan Cloud (Fastify API)** | Backend persistence dengan PostgreSQL & Prisma ORM untuk menyimpan slot dunia multi-pengguna. | 🔵 Sprint V3 |

---

## 4. Kreator Studio Suite — 10 Fitur Adopsi Bang Pay Magic Pro (Creator Suite)

| ID Fitur | Modul | Deskripsi Teknis | Status | Akses |
| :--- | :--- | :--- | :--- | :--- |
| **FEAT-18** | **Songmaker Studio** | Pembuat lagu & lirik cerdas: generator progresi akor, pemilih genre/mood/BPM, prompt Suno/Udio, dan preview synthesizer Web Audio. | ✅ Selesai | Kreator Studio |
| **FEAT-19** | **Video Editor & Visualizer** | Timeline multi-track video simulasi 3D + audio, rasio 16:9 & 9:16 (Shorts/TikTok), overlay teks dinamis, dan spectrum visualizer realtime. | ✅ Selesai | Kreator Studio |
| **FEAT-20** | **Audio Editor & Mastering DSP** | Multi-band Parametric EQ (Low/Mid/High), compressor, reverb convolution, limiter, dan FFT frequency visualizer Web Audio API. | ✅ Selesai | Kreator Studio |
| **FEAT-21** | **Murotal & Caption Quran** | Generator caption ayat Arab khat kaligrafi, terjemahan Indonesia, transliterasi Latin, pemilihan Qari internasional, dan auto-sync audio. | ✅ Selesai | Kreator Studio |
| **FEAT-22** | **Audio Metadata & ID3 Editor** | Tag inspector ID3v2/RIFF: Title, Artist, Album, Year, Genre, Track#, Cover Art album uploader & file tagger. | ✅ Selesai | Kreator Studio |
| **FEAT-23** | **Suno Track Downloader** | Parser link lagu Suno AI, ekstraksi audio MP3 & video MP4, streaming preview player, serta export langsung ke Audio/Video Editor. | ✅ Selesai | Kreator Studio |
| **FEAT-24** | **Album Gen & Vinyl Player** | Generator kompilasi album musik dengan animasi piringan hitam vinyl 3D, kalkulator kapasitas LP, tracklist manager, dan continuous player. | ✅ Selesai | Kreator Studio |
| **FEAT-25** | **Smart YT Creator Optimizer** | Generator judul video viral berskor CTR tinggi, Tag & Keyword extractor YouTube Studio, dan template deskripsi teroptimasi SEO. | ✅ Selesai | Kreator Studio |
| **FEAT-26** | **VO GEN (AI Voice Over)** | Generator narasi suara Text-to-Speech multi-karakter via Web Speech API, kontrol pitch/speed/volume, dan teleprompter reader. | ✅ Selesai | Kreator Studio |
| **FEAT-27** | **AI Bang Pay (Prompt Lab & 3D Link)** | Studio prompt AI Text-to-Image & Image-to-Video dengan preset gaya 3D/Anime/Cinematic, langsung terhubung ke AI 3D Mesh Maker (Forge3D). | ✅ Selesai | Kreator Studio |

