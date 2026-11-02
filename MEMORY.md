# MEMORY.md — AUDIRA 3D CONSTRUCTION SIMULATOR

> **Persistent Long-Term Memory (LTM) & Project Knowledge Hub**  
> Single Source of Truth for Architecture, Active Sprints, Ground Alignment Rules, 3D Assets, and Technical Decisions.  
> **Last Synchronized:** 2026-10-10  
> **Status:** Active / V1 Core Sandbox & GLB Asset Integration  
> **Author & Founder:** Agus Dwi Rianto (AUDIRA)  
> **Organization:** Audira Multimedia Digital / Audira Sukses Mandiri  
> **Official Domain:** https://audira.my.id  
> **Official Email:** agusdwirianto@gmail.com  

---

## 1. Project Snapshot & System Status

- **Project Name:** AUDIRA 3D CONSTRUCTION SIMULATOR
- **Core Technology:** React 18/19, TypeScript (Strict Mode), Vite 6, Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, Tailwind CSS, Zustand, Fastify 4.x
- **Active Monorepo Structure (pnpm workspaces):**
  - `apps/web`: 3D Viewport Editor, R3F Scene, UI Overlay, Properties Panel, Asset Library (Port 5173 dev / 3000 prod)
  - `apps/api`: Fastify REST API, World Persistence, Project Save Slots (Port 3000 dev / 4000 prod)
  - `packages/shared`: Shared Types, GameObject schemas, Vector3/Transform interfaces
  - `packages/game-core`: Math utils, grid snap algorithms, raycast intersection helpers
- **Current Active Assets:** 52 High-Quality GLB 3D models with WebP thumbnails in `apps/web/public/`

---

## 2. Core Non-Negotiable Directives (Recap)

1. **Ground Level Alignment (`y >= 0`):**
   - Setiap objek 3D WAJIB berada tepat di atas lantai (`y = 0`).
   - Bounding box model harus dinormalkan secara otomatis menggunakan `box.setFromObject(clone); clone.position.y = -box.min.y;` sehingga titik terbawah objek (roda mobil, crawler traktor, pondasi bangunan) menempel mulus di tanah tanpa tembus/tenggelam.
2. **100% 3D WebGL Browser Execution:**
   - Tidak ada engine eksternal biner (No Unity, Godot, Unreal).
   - Terapkan Three.js & R3F secara optimal dengan target stabil 60 FPS.
3. **Modular Zustand Stores:**
   - Pisahkan state editor: `useEditorStore` (active tool, snapping, grid), `useWorldStore` (game objects list), `useSelectionStore` (selected ID), `useHistoryStore` (undo/redo command stack).
4. **Strict TypeScript Standards:**
   - Dilarang keras memakai tipe `any`. Gunakan types eksplisit dari `packages/shared` atau `src/types/`.

---

## 3. Active Task Board & Roadmap

### Sprint V1: Core Sandbox & 3D Editor (Status: Selesai / Stabil)
- [x] R3F Viewport dengan OrbitControls dan kamera isometrik / top-down
- [x] Padang rumput stylized 100m x 100m dengan grid snapping sistem 1 meter
- [x] TransformControls (Translate, Rotate, Scale)
- [x] Properties Panel sisi kanan dengan koordinat numerik real-time
- [x] Asset Library bawah dengan filter kategori & 52 Model GLB
- [x] Undo (`Ctrl+Z`) & Redo (`Ctrl+Y`) command pattern
- [x] JSON World Save/Load & LocalStorage sync

### Sprint Kreator: Adopsi 10 Fitur Bang Pay Magic Pro (Status: Active In-Progress)
- [x] FEAT-18: Songmaker Studio (Lirik, BPM, Genre, Progresi Akor & Audio Synth)
- [x] FEAT-19: Video Editor & Visualizer (Multi-track Timeline, 16:9 / 9:16 Shorts, Spectrum Overlay)
- [x] FEAT-20: Audio Editor & Mastering DSP (Real-time Parametric EQ, Compressor, Reverb, Limiter)
- [x] FEAT-21: Murotal & Caption Quran (Surah/Ayat Picker, Calligraphy Text, Qari Audio Stream)
- [x] FEAT-22: Audio Metadata & ID3 Editor (Tag Inspector, ID3v2 Editing, Artwork Preview)
- [x] FEAT-23: Suno Track Downloader (Parser URL Suno, Audio MP3 & Video MP4 Extractor)
- [x] FEAT-24: Album Gen & Vinyl Player (Piringan Hitam 3D, Tracklist Manager, Continuous Play)
- [x] FEAT-25: Smart YT Creator Optimizer (SEO Title Scorer, Tag Finder, Description Builder)
- [x] FEAT-26: VO GEN AI Text-to-Speech (Multi-Actor Script, Web Speech API Voiceover)
- [x] FEAT-27: AI Bang Pay Studio (Prompt Lab Text-to-Image/Video, Direct Link ke Forge3D Mesh)
- [x] Master UI Hub: `KreatorStudioModal.tsx` & Header Quick Launch Button

### Sprint V2: Physics & Vehicle Kinematics (Status: Active In-Progress)
- [x] FEAT-28: Sistem Pencahayaan Dinamis Kendaraan 3D (`VehicleDynamicLights.tsx`: Dual SpotLight Headlights, High Beam, Red Brake Glow, Reverse Light, Amber Blinking Turn Signals)
- [x] FEAT-29: Dynamic Tire Dust & Skid Particle Trail (`VehicleParticleTrail.tsx` partikel suspensi dan gesekan ban)
- [x] FEAT-30: Integrasi Shortcut Lampu & Sein (`L`, `K`, `Z`, `X`) serta HUD Controls Hint
- [x] FEAT-31: Integrasi Multi-Agent Agency Orchestration (`.agents/brain/MULTI_AGENT_AGENCY_ORCHESTRATION.md` & `.agents/skills/audira-multiagent-orchestrator/SKILL.md`)
- [x] FEAT-32: Cuaca Hujan Tropis 3D Dinamis (`RainParticles.tsx` 2000 partikel hujan, drift angin, kilatan petir, dan sound ambient hujan/guntur Web Audio)
- [x] FEAT-33: Optimalisasi Performa — Penghapusan kalkulasi CPU IslandWater untuk menjamin kestabilan 60 FPS tanpa lag di WebGL
- [x] FEAT-34: Deteksi Benturan Rintangan & Rebound Physics (`VehicleSimulator.tsx` deteksi tabrakan obstacle, pantulan elastis, camera impact jolt, dan audio crash bump)
- [x] FEAT-35: Turbo Nitro Boost (`Shift`) & Cyan Exhaust Flame (`VehicleParticleTrail.tsx` cyan flame particles, camera FOV speed punch, suara jet whine, dan HUD Nitro gauge)
- [x] FEAT-36: Modern UI/UX Overhaul & HUD De-cluttering (Auto-hide editor panels saat mode mengemudi, Supercar Cockpit Dashboard di bottom-left, Top-Centered Camera Pills, Floating Quick Dock di kanan, dan minimal status bar)
- [x] Sistem kendali kemudi kendaraan & kinematika real-time (WASD)
- [ ] Integrasi `@react-three/rapier` untuk physical rigid bodies
- [ ] Terrain sculpting (raise, lower, flatten)
- [ ] Spline road builder dengan penempatan modular

### Sprint V3: Career Mode & Cloud Sync (Status: Future)
- [ ] Fastify REST API cloud save slot persistence dengan PostgreSQL Prisma
- [ ] Misi konstruksi berjenjang (fondasi, struktur, atap, finishing)
- [ ] Multiplayer real-time room via WebSocket

---

## 4. Key Gotchas & Solutions

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Model Tenggelam ke Tanah** | Titik origin (pivot) model 3D berada di tengah (center) bounding box, bukan di alas (bottom). | Terapkan normalisasi otomatis `box.setFromObject(mesh); mesh.position.y = -box.min.y;` pada `ModelRenderer.tsx`. |
| **Memory Leak WebGL Canvas** | Geometri dan material GLB tidak dibersihkan saat objek dihapus dari scene. | Pastikan fungsi `dispose()` dipanggil pada Three.js buffer geometries dan textures saat unmount. |
| **Z-Fighting pada Grid** | Garis grid berada persis di bidang `y = 0` bersamaan dengan ground plane. | Angkat grid sedikit ke `y = 0.01` dengan `depthWrite={false}`. |
