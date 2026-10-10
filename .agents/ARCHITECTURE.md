# ARCHITECTURE — AUDIRA 3D CONSTRUCTION SIMULATOR

> Technical Architecture, 3D WebGL Pipeline, and System Design for the Audira Monorepo.  
> **Version:** v1.0.0-dev  
> **Last Updated:** 2026-10-10  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. System Topology Overview

AUDIRA 3D CONSTRUCTION SIMULATOR dirancang sebagai monorepo modular berkinerja tinggi yang dikelola oleh **pnpm workspaces**. Proyek ini menggabungkan render loop 3D Three.js berbasis WebGL/WebGPU, UI reaktif modern dengan React 18/19, dan state management modular Zustand:

```
                           +----------------------------------------+
                           |           User Web Browser             |
                           |   (Three.js, R3F, React 18, Vite 6)    |
                           +-------------------+--------------------+
                                               |
                          Port 5173 (dev) / 3000 (prod Nginx)
                                               v
+-----------------------------------------------------------------------------------+
|                           apps/web (Frontend 3D Application)                      |
|                                                                                   |
|  +------------------+  +------------------+  +------------------+  +-----------+  |
|  |   Scene Canvas   |  |  ModelRenderer   |  | TransformControls|  | Properties|  |
|  |  (R3F Viewport)  |  |  (52 GLB Assets) |  |  (Move/Rot/Scale)|  |  Panel UI |  |
|  +------------------+  +------------------+  +------------------+  +-----------+  |
|                                     ^                     ^                       |
|                                     | Selective State     | History Push          |
|                                     v                     v                       |
|  +-----------------------------------------------------------------------------+  |
|  |                          Zustand Modular Stores                             |  |
|  |   - useEditorStore (Tool mode, Snap toggle, Grid visibility)                |  |
|  |   - useWorldStore (GameObjects list, Ground terrain specs)                  |  |
|  |   - useSelectionStore (Selected ObjectId, Hover state)                      |  |
|  |   - useHistoryStore (Command stack Undo/Redo max 30 ops)                    |  |
|  +-----------------------------------------------------------------------------+  |
+--------------------------+--------------------------------------------------------+
                           |
                           v
               +-----------------------+  +---------------------+
               | LocalStorage Auto-Sync|  | Target Fastify API  |
               | (Debounced 500ms)     |  | (Port 3000 / 4000)  |
               | JSON Import / Export  |  | PostgreSQL + Prisma |
               +-----------------------+  +---------------------+
```

---

## 2. Workspace & Monorepo Layers

```text
AUDIRA-3D-SIMULATOR/
├── apps/
│   ├── web/                     # Frontend 3D Game & Editor
│   │   ├── src/
│   │   │   ├── app/             # Main App layout & provider
│   │   │   ├── components/      # UI primitives & layout (Header, Toolbar, Panels)
│   │   │   ├── features/
│   │   │   │   ├── editor/      # Selection, TransformControls, ContextMenu
│   │   │   │   ├── world/       # 3D Scene canvas, lighting, sky, shadows
│   │   │   │   ├── terrain/     # 100x100m grass terrain, grid, snapping
│   │   │   │   ├── camera/      # Isometric, Top-Down, OrbitControls, presets
│   │   │   │   ├── objects/     # GameObject renderer, 52 GLB assets, y>=0 normalization
│   │   │   │   ├── assets/      # Asset Library bar & category filters
│   │   │   │   ├── vehicles/    # Vehicle logic & controls
│   │   │   │   ├── construction/# Construction stage & project logic
│   │   │   │   └── save/        # JSON export/import & localStorage
│   │   │   ├── stores/          # Zustand: useEditorStore, useWorldStore, etc.
│   │   │   ├── types/           # GameObject, Asset, Transform interfaces
│   │   │   └── main.tsx         # React entry point
│   │   ├── public/              # Static models (52 GLB) and thumbs (WebP)
│   │   └── package.json
│   │
│   └── api/                     # Backend Fastify REST API (Future Cloud Sync)
│       ├── src/
│       │   ├── modules/         # Auth, Projects, Worlds, Assets
│       │   └── server.ts
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared TypeScript interfaces & Zod schemas
│   └── game-core/               # Shared physics, math & world logic
│
├── .agents/                     # AI Guidelines, Rules, Skills & Architecture
├── pnpm-workspace.yaml          # Monorepo configuration
├── package.json                 # Root script definitions
├── tsconfig.json                # Base TypeScript configuration
└── README.md
```

---

## 3. R3F Scene Graph & Component Tree

Struktur hirarki komponen dalam kanvas 3D:

```tsx
<Canvas shadows camera={{ position: [30, 30, 30], fov: 45 }}>
  {/* Pencahayaan & Lingkungan */}
  <ambientLight intensity={0.4} />
  <directionalLight 
    castShadow 
    position={[20, 40, 20]} 
    shadow-mapSize={[2048, 2048]} 
    shadow-camera-left={-50} 
    shadow-camera-right={50} 
    shadow-camera-top={50} 
    shadow-camera-bottom={-50} 
  />
  <Sky sunPosition={[100, 40, 100]} />

  {/* Kontrol Kamera */}
  <CameraController mode={cameraMode} />

  {/* Alas Tanah & Grid */}
  <TerrainGround size={100} />
  {isGridVisible && <GridInfinite snapStep={1} position={[0, 0.01, 0]} />}

  {/* Daftar Objek 3D Dunia */}
  {objects.map((obj) => (
    <ModelRenderer key={obj.id} data={obj} />
  ))}

  {/* Transform Gizmo (Translasi/Rotasi/Skala) */}
  {selectedObject && (
    <TransformGizmo objectId={selectedObject.id} mode={transformMode} />
  )}
</Canvas>
```

---

## 4. Ground Level Alignment Engine (`y >= 0`)

Untuk menggaransi bahwa tidak ada satupun model yang roda atau dasarnya tenggelam ke dalam lantai:
1. `ModelRenderer` mengeksekusi `THREE.Box3().setFromObject(clonedScene)`.
2. Posisi mesh di-offset vertikal sebesar `-box.min.y`.
3. Transform Gizmo mengunci koordinat $Y$ minimum pada $0$.
