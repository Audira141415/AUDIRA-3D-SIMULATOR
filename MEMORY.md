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

### Sprint V2: Physics & Vehicle Kinematics (Status: Next / Planned)
- [ ] Integrasi `@react-three/rapier` untuk physical rigid bodies
- [ ] Sistem kendali kemudi kendaraan & putaran roda real-time (WASD)
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
