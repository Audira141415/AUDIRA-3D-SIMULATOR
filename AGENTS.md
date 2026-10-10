# AGENTS.md - AUDIRA 3D CONSTRUCTION SIMULATOR

> System Prompt & Panduan Tata Kelola Permanen untuk AI Assistant & Developer.
> Mengatur standar kode, arsitektur 3D React Three Fiber (R3F), Zustand stores, monorepo pnpm, dan batas operasional sistem.

---

## 0. Mandatory AI Co-Pilot & Assistant Directives (WAJIB DIPATUHI)

> **PERINGATAN UNTUK SEMUA AI AGENTS & GITHUB COPILOT:**
> File ini (`AGENTS.md`) bersama seluruh dokumen di dalam folder `.agents/` adalah **Single Source of Truth** untuk proyek AUDIRA 3D CONSTRUCTION SIMULATOR.
> 
> 1. **Selalu Baca Dokumen Ini**: Setiap kali Co-Pilot / AI Assistant mengusulkan kode, refactoring, atau membuat file baru, Anda **WAJIB** membaca dan mematuhi batasan di file ini dan `.agents/`.
> 2. **Dilarang Menghapus Fitur Eksis**: Jangan pernah menghapus sistem penempatan objek, kontrol transform, undo/redo, kamera isometrik, atau store yang sudah berjalan. Lakukan **enhancement** secara modular dan bertahap.
> 3. **Pertahankan Standar 100% 3D Browser**: Game ini adalah 3D World Builder + Construction Simulator berbasis WebGL/WebGPU (@react-three/fiber). DILARANG membuat game 2D, dan DILARANG menggunakan Unity, Godot, atau Unreal Engine.
> 4. **Konsistensi UI Dark Modern**: Desain UI editor profesional: 3D viewport di tengah, Header di atas, Properties Panel di kanan, Asset Library di bawah, warna dark charcoal & cyan/blue accent.
> 5. **Ground Level Alignment (Objek Wajib di Atas Lantai)**: Setiap objek 3D (kendaraan, truk, traktor, wahana, pohon, dekorasi) WAJIB selalu berada **DI ATAS LANTAI** (`y >= 0`). DILARANG membiarkan roda, bumper, atau bagian bawah objek tenggelam/tembus ke dalam lantai. Normalisasi posisi bounding box model (`clone.position.y = -box.min.y`) harus selalu diterapkan sehingga titik terbawah objek menempel sempurna di atas permukaan tanah.

---

## 1. Project Overview

- **Name** : AUDIRA 3D CONSTRUCTION SIMULATOR
- **Description** : 3D World Builder + Construction Simulator berbasis browser yang berjalan langsung di WebGL/WebGPU. Menggabungkan konsep world editor, sandbox builder, vehicle simulator, dan construction project management.
- **Goal** : Memberikan pengalaman simulasi konstruksi dan pembangunan dunia 3D interaktif yang fleksibel, responsif, dan kaya fitur langsung di browser tanpa instalasi engine eksternal.
- **Target Users** : Game players, 3D world builders, virtual city planners, dan construction enthusiasts.
- **Version** : v1.0.0-dev
- **Status** : Active Development (V1 Core Sandbox Implementation)
- **Author & Founder** : Agus Dwi Rianto (AUDIRA)
- **Organization** : Audira Multimedia Digital / Audira Sukses Mandiri
- **Official Domain** : [https://audira.my.id](https://audira.my.id)
- **Official Email** : [agusdwirianto@gmail.com](mailto:agusdwirianto@gmail.com)

---

## 2. Tech Stack

- **Monorepo Manager** : pnpm workspaces
- **Frontend Framework** : React 18 / 19, TypeScript (Strict Mode), Vite 6
- **3D Graphics Engine** : Three.js, `@react-three/fiber` (R3F), `@react-three/drei`
- **State Management** : Zustand (modular stores: editor, world, selection, asset, camera, history)
- **Styling** : Tailwind CSS, CSS Custom Properties, Dark Modern Theme
- **Icons** : Lucide React
- **Backend (Target API)** : Node.js, Fastify, TypeScript, Prisma ORM, PostgreSQL, Zod
- **3D Assets** : Procedural low-poly primitives (V1) & GLB/GLTF models (public/models/)
- **Testing** : Vitest, React Testing Library

---

## 3. Commands

```bash
# Package Management & Setup
pnpm install          # Install semua dependensi monorepo

# Development
pnpm dev              # Menjalankan dev server (Web di http://localhost:5173, API di port 3000)
pnpm dev:web          # Menjalankan hanya Frontend Web 3D Editor
pnpm dev:api          # Menjalankan backend Fastify API

# Build & Validation
pnpm build            # Type-check TypeScript & build bundle production
pnpm lint             # Linter kode
```

---

## 4. Project Structure (PNPM Monorepo)

```text
audira-3d-simulator/
├── apps/
│   ├── web/                     # Frontend 3D Game & Editor
│   │   ├── src/
│   │   │   ├── app/             # Main App layout & provider
│   │   │   ├── components/      # UI primitives & layout (Header, Toolbar, Panels)
│   │   │   ├── features/        # Feature modules:
│   │   │   │   ├── editor/      # Selection, TransformControls, ContextMenu
│   │   │   │   ├── world/       # 3D Scene canvas, lighting, sky, shadows
│   │   │   │   ├── terrain/     # 100x100m grass terrain, grid, snapping
│   │   │   │   ├── camera/      # Isometric, Top-Down, OrbitControls, presets
│   │   │   │   ├── objects/     # GameObject renderer, procedural low-poly assets
│   │   │   │   ├── assets/      # Asset Library bar & category filters
│   │   │   │   ├── vehicles/    # Vehicle logic & controls
│   │   │   │   ├── construction/# Construction stage & project logic
│   │   │   │   └── save/        # JSON export/import & localStorage
│   │   │   ├── stores/          # Zustand: useEditorStore, useWorldStore, etc.
│   │   │   ├── types/           # GameObject, Asset, Transform interfaces
│   │   │   └── main.tsx         # React entry point
│   │   ├── public/              # Static models (GLB), textures, audio
│   │   ├── index.html           # HTML container
│   │   ├── vite.config.ts       # Vite bundler config
│   │   └── package.json
│   │
│   └── api/                     # Backend Fastify REST API
│       ├── src/
│       │   ├── modules/         # Auth, Projects, Worlds, Assets
│       │   └── server.ts
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared TypeScript interfaces & Zod schemas
│   └── game-core/               # Shared physics, math & world logic
│
├── .agents/                     # AI Guidelines & Architecture
├── pnpm-workspace.yaml          # Monorepo configuration
├── package.json                 # Root script definitions
├── tsconfig.json                # Base TypeScript configuration
└── README.md
```

---

## 5. Naming Conventions

```
# File & Folder
- Komponen React: PascalCase (contoh: Viewport3D.tsx, PropertiesPanel.tsx)
- Hooks         : camelCase prefix 'use' (contoh: useKeyboardShortcuts.ts)
- Stores        : camelCase (contoh: useWorldStore.ts, useEditorStore.ts)
- Types         : PascalCase (contoh: GameObject.ts, Asset.ts)
- Utilities     : camelCase (contoh: mathUtils.ts, gridSnap.ts)

# Di Dalam Kode
- State/Props   : camelCase (contoh: selectedObjectId, isGridVisible)
- Actions       : camelCase (contoh: addObject, selectObject, undo, redo)
- Konstanta     : UPPER_SNAKE (contoh: DEFAULT_GRID_SIZE, MAX_HISTORY_STEPS)
- Types         : PascalCase (contoh: GameObject, AssetCategory, TransformMode)
```

---

## 6. Code Conventions

- Terapkan TypeScript `strict: true`. HINDARI tipe `any`.
- Pisahkan logic ke dalam modular Zustand stores. Jangan gabungkan semua state ke satu file raksasa.
- Gunakan procedural low-poly 3D models untuk V1 jika asset GLB belum tersedia (Tree, House, Truck, Excavator, Road, Rocks) agar aplikasi langsung dapat dijalankan secara instan tanpa missing asset 404.
- Setiap objek harus memiliki interface `GameObject` standar (`id`, `name`, `type`, `category`, `position`, `rotation`, `scale`, `visible`, `locked`).
- Simpan perubahan objek ke `useHistoryStore` untuk mendukung Undo (`Ctrl+Z`) dan Redo (`Ctrl+Y`).
- Seluruh objek 3D wajib memiliki posisi vertikal di atas lantai (`y >= 0`). Pastikan `ModelRenderer` menormalkan bounding box objek (`clone.position.y = -box.min.y`) sehingga roda/alas objek menempel di permukaan lantai (`y = 0`).

---

## 7. Controls & Keyboard Shortcuts

- `Q` = Select Tool
- `W` = Translate (Move) Mode
- `E` = Rotate Mode
- `R` = Scale Mode
- `Delete` / `Backspace` = Delete Selected Object
- `Ctrl+D` = Duplicate Selected Object
- `Ctrl+Z` = Undo
- `Ctrl+Y` = Redo
- `F` = Focus Camera on Selected Object
- `G` = Toggle Grid ON/OFF
- `S` = Toggle Snap ON/OFF
- `Esc` = Cancel Active Placement / Deselect

---

## 8. Do Not (PANTANGAN MUTLAK)

- DILARANG membuat game 2D.
- DILARANG menggunakan engine biner seperti Unity, Godot, Unreal. Gunakan browser-based Three.js / React Three Fiber.
- DILARANG membiarkan objek 3D tenggelam atau terpotong ke dalam permukaan lantai/tanah (`y < 0`). Posisi terbawah mesh (roda, bumper, alas) wajib berada persis di atas permukaan tanah (`y = 0`).
- DILARANG menulis pseudocode atau kode separuh jadi. Kode harus lengkap, bebas error import, dan runnable.
- DILARANG memuat dependensi berat yang tidak relevan.
