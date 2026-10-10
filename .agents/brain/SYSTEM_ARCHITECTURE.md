# SYSTEM ARCHITECTURE — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Technical Architecture, R3F Scene Topology, and Reactive State Pipeline**  
> *Spesifikasi Lengkap Arsitektur Grafis 3D WebGL/WebGPU, Monorepo Layers, dan State Management.*

---

## 1. System Topology Overview

AUDIRA 3D CONSTRUCTION SIMULATOR menggunakan pendekatan arsitektur hibrida: **React Tree untuk UI & Komponen Deklaratif** dan **Three.js Render Loop untuk Scene Graph 3D Berkinerja Tinggi**.

```
+-----------------------------------------------------------------------------------+
|                                 Browser Window                                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                            Header / Toolbar UI                              |  |
|  |    - Mode Selector (Move W, Rotate E, Scale R) | Snap Toggle | Undo/Redo    |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +--------------------------------------------------+  +-----------------------+  |
|  |           3D Viewport (@react-three/fiber)       |  |   Properties Panel    |  |
|  |                                                  |  | (Tailwind Modern Dark)|  |
|  |  +--------------------------------------------+  |  |                       |  |
|  |  |              R3F Canvas Scene              |  |  |  - Selected Object ID |  |
|  |  |  - Directional Sunlight + Shadow Maps      |  |  |  - Position X / Y / Z |  |
|  |  |  - Procedural Sky & Ambient Light          |  |  |  - Rotation X / Y / Z |  |
|  |  |  - Ground Plane 100x100m + 1m Grid Snap    |  |  |  - Scale X / Y / Z    |  |
|  |  |  - ModelRenderer (52 GLB Models with y>=0) |  |  |  - Visibility / Lock |  |
|  |  |  - TransformControls (Drei Gizmo)          |  |  |  - Delete / Duplicate |  |
|  |  |  - OrbitControls / Isometric Camera        |  |  |                       |  |
|  |  +--------------------------------------------+  |  +-----------------------+  |
|  +--------------------------------------------------+                             |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        Asset Library Bar (Bottom Dock)                      |  |
|  |    - Categories: Vehicles | Tractors | Maps | Decorations | Aircraft        |  |
|  |    - 52 GLB Assets with WebP Thumbnails & Click-to-Place Raycaster          |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |        Zustand Modular Stores         |
                     |  - useEditorStore (Tools, Snapping)   |
                     |  - useWorldStore (GameObjects Array)  |
                     |  - useSelectionStore (Selected ID)    |
                     |  - useHistoryStore (Undo/Redo 30 ops) |
                     +---------------------------------------+
                                         |
                                         v
                     +---------------------------------------+
                     |    Storage & Network Persistence      |
                     |  - LocalStorage Auto-Sync             |
                     |  - JSON File Import / Export          |
                     |  - Target Fastify REST API (Port 3000)|
                     +---------------------------------------+
```

---

## 2. Monorepo Package Layers (pnpm workspaces)

```text
audira-3d-simulator/
├── apps/
│   ├── web/                     # Frontend 3D Game Editor
│   │   ├── src/
│   │   │   ├── app/             # App layout, root context providers
│   │   │   ├── components/      # UI components (Header, PropertiesPanel, AssetLibraryBar)
│   │   │   ├── features/
│   │   │   │   ├── editor/      # Selection logic, TransformControls, ContextMenu
│   │   │   │   ├── world/       # R3F Canvas scene, lighting, skybox, ground plane
│   │   │   │   ├── objects/     # ModelRenderer, procedural fallback, material optimizer
│   │   │   │   ├── camera/      # Camera presets (Isometric, Top-Down, Perspective)
│   │   │   │   ├── vehicles/    # Vehicle logic, wheel kinematics, controllers
│   │   │   │   └── save/        # JSON world serializer/deserializer & localStorage
│   │   │   ├── stores/          # Zustand: useEditorStore, useWorldStore, useHistoryStore
│   │   │   ├── types/           # GameObject, AssetDefinition, TransformMode
│   │   │   └── main.tsx         # React root
│   │   ├── public/              # 52 .glb models in /models & .webp in /thumbs
│   │   └── package.json
│   │
│   └── api/                     # Backend Fastify Service (Port 3000 / 4000)
│       ├── src/
│       │   ├── modules/         # World save slots, project manager, user auth
│       │   └── server.ts        # Fastify HTTP server entry point
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared TypeScript types, Zod schemas, Vector3DTO
│   └── game-core/               # Shared math calculations, grid snapping, spatial hashing
│
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

---

## 3. Reactive Data Flow & Scene Graph Mutation

Data berpindah melalui siklus searah yang terisolasi untuk mencegah re-render canvas yang tidak diperlukan:

1. **User Interaction**: Pengguna mengklik tombol tool (misal: `W` untuk Translate) atau memilih objek di viewport.
2. **Action Dispatch**: Action dipanggil pada Zustand store tertentu (misal: `useEditorStore.getState().setTransformMode('translate')`).
3. **Selective Subscriptions**: Komponen UI (Properties Panel) hanya berlangganan ke ID objek terpilih via selector `(s) => s.selectedId`, sehingga mutasi posisi objek tidak memicu re-render seluruh daftar asset.
4. **TransformControls Direct Mutation**: Saat gizmo digeser di 3D canvas, koordinat sementara diperbarui secara langsung pada Three.js object, dan saat tarikan selesai (`onMouseUp`), snapshot perubahan dikirimkan ke `useHistoryStore` untuk mendukung Undo (`Ctrl+Z`).
5. **Ground Level Clamping**: Setiap mutasi posisi vertikal diverifikasi agar titik terendah objek selalu berada pada $Y \ge 0$.

---

## 4. Camera & Projection Pipeline

Editor mendukung tiga sudut pandang kamera:
- **Isometric View**: Orthographic / angled perspective (Posisi default: `[30, 30, 30]`, target `[0, 0, 0]`) memberikan sudut pandang taktis ala simulasi city builder klasik.
- **Top-Down View**: Posisi `[0, 50, 0]`, kamera tegak lurus melihat ke bawah, ideal untuk penataan jalan dan grid kavling.
- **Perspective Free Orbit**: OrbitControls bebas untuk inspeksi detail 360 derajat di sekitar model.
