# DATABASE & DATA FLOW — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Data Schemas, Spatial Serialization, Reactive Loops, and Database Persistence**  
> *Spesifikasi Struktur Data In-Memory, Skema File JSON Save, dan Model PostgreSQL Prisma.*

---

## 1. Siklus Alur Data (Data Flow Cycle)

```
[ User Input / Mouse Event ]
           |
           v
[ Zustand Store Mutation (useWorldStore / useEditorStore) ]
           |
           +------------------------------+
           |                              |
           v                              v
[ R3F Scene Graph Re-render ]    [ History Stack Push (Snapshot) ]
(ModelRenderer & TransformGizmo) (useHistoryStore - max 30 ops)
           |
           v
[ Debounced LocalStorage Auto-Sync (500ms) ]
           |
           +------------------------------+
           |                              |
           v                              v
[ Export .json File (Client Blob) ]  [ Target Fastify REST API ]
                                     (PostgreSQL via Prisma ORM)
```

---

## 2. In-Memory Data Model (Zustand State)

Objek 3D diatur dengan interface standar `GameObject`:

```typescript
export type AssetCategory = 'maps' | 'vehicles' | 'tractors' | 'aircraft' | 'decoration' | 'nature';

export interface Vector3DTO {
  x: number;
  y: number;
  z: number;
}

export interface GameObject {
  id: string;               // UUID unik atau timestamp id
  assetId: string;          // ID referensi model (contoh: 'veh-scania-heavy')
  name: string;             // Nama display (contoh: 'Scania R440 Heavy Truck')
  category: AssetCategory;  // Kategori asset
  modelUrl: string;         // URL berkas GLB (contoh: '/models/scania.glb')
  thumbnailUrl?: string;    // URL berkas WebP (contoh: '/thumbs/scania.webp')
  position: Vector3DTO;     // Koordinat dunia (y >= 0)
  rotation: Vector3DTO;     // Sudut rotasi Euler (dalam radians)
  scale: Vector3DTO;        // Skala proporsional
  visible: boolean;         // Flag visibilitas objek
  locked: boolean;          // Pengunci objek agar tidak sengaja bergeser
  metadata?: Record<string, unknown>;
}
```

---

## 3. Skema Serialisasi File Simpanan Proyek (`.json`)

Struktur data saat diekspor menjadi berkas format JSON untuk dibagikan atau dimuat kembali:

```json
{
  "$schema": "https://audira.online/schemas/world-v1.json",
  "version": "1.0.0",
  "name": "Proyek Konstruksi Pelabuhan & Kota",
  "createdAt": "2026-10-10T12:00:00Z",
  "updatedAt": "2026-10-10T12:30:00Z",
  "terrain": {
    "size": [100, 100],
    "type": "stylized_grass",
    "gridStep": 1.0,
    "snapEnabled": true
  },
  "camera": {
    "mode": "isometric",
    "position": [30, 30, 30],
    "target": [0, 0, 0]
  },
  "objects": [
    {
      "id": "obj-1728551234-a8f",
      "assetId": "veh-scania-heavy",
      "name": "Truk Scania R440 Heavy Duty",
      "category": "vehicles",
      "modelUrl": "/models/scania.glb",
      "position": { "x": 12.0, "y": 0.0, "z": -4.0 },
      "rotation": { "x": 0.0, "y": 1.5708, "z": 0.0 },
      "scale": { "x": 1.0, "y": 1.0, "z": 1.0 },
      "visible": true,
      "locked": false
    }
  ]
}
```

---

## 4. Skema Database Target Fastify API (Prisma ORM)

Untuk sinkronisasi cloud akun pengguna dan katalog asset resmi:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String         @id @default(uuid())
  email     String         @unique
  name      String
  role      String         @default("USER") // USER, BUILDER, ADMIN
  worlds    ProjectWorld[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model ProjectWorld {
  id          String   @id @default(uuid())
  title       String
  description String?
  thumbnail   String?
  worldData   Json     // Skema JSON World di atas
  isPublic    Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model AssetCatalog {
  id          String   @id // Contoh: 'veh-scania-heavy'
  name        String
  category    String
  modelUrl    String
  thumbUrl    String
  fileSizeKb  Int
  dimensionsX Float
  dimensionsY Float
  dimensionsZ Float
  isActive    Boolean  @default(true)
}
```
