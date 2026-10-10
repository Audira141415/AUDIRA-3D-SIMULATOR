# 🏗️ AUDIRA 3D CONSTRUCTION SIMULATOR

> **3D World Builder + Construction Simulator** berbasis browser modern yang berjalan langsung di WebGL / WebGPU menggunakan React, TypeScript, Three.js, React Three Fiber (R3F), dan Zustand.

---

## 🌟 Fitur Utama (V1 Core)

- **3D Sandbox World & Terrain**:
  - Padang rumput stylized 100m x 100m dengan koordinat grid 1 meter.
  - Pencahayaan matahari dinamis dengan soft shadows & atmosfer langit procedural.
  - Toggle Grid (`G`), Toggle Snap (`S`), dan Toggle Soft Shadows.
- **Sistem Penempatan Objek (Raycast Placement)**:
  - Klik asset di perpustakaan bawah, lalu klik di atas tanah untuk langsung membuat objek.
  - Snap otomatis ke grid terdekat.
- **Sistem Transformasi Lengkap (TransformControls)**:
  - Translate (Move - `W`), Rotate (`E`), Scale (`R`), dan Select (`Q`).
  - Pembaruan koordinat real-time pada Properties Panel di sisi kanan.
- **Properties Panel Interaktif (Sisi Kanan)**:
  - Mengubah Nama, Kategori, Posisi X/Y/Z, Rotasi X/Y/Z, dan Skala objek secara langsung.
  - Toggle Visibilitas objek & Penguncian posisi (Lock).
  - Aksi 1-klik: Duplicate (`Ctrl+D`), Delete (`Delete`), dan Reset Transform.
- **Perpustakaan Asset 6 Kategori (Asset Library Bawah)**:
  - 🚜 **Kendaraan**: Excavator, Heavy Truck, Bulldozer, Mobile Crane, Site Car.
  - 🏢 **Bangunan**: Small House, Large House, Warehouse, Audira Data Center, Office.
  - 🛣️ **Jalan**: Straight Road, Road Intersection, Sidewalk.
  - 🌲 **Alam**: Pine Tree, Oak Tree, Rock Boulder, Bush.
  - 🚧 **Dekorasi**: Street Lamp, Traffic Barrier, Shipping Container, Traffic Cone.
  - ⚡ **Infrastruktur**: Power Pole, High-Voltage Transformer, Generator, Water Tank.
- **Sistem Undo & Redo (Command Pattern)**:
  - `Ctrl+Z` untuk Undo tindakan sebelumnya.
  - `Ctrl+Y` untuk Redo tindakan.
- **Penyimpanan Proyek (Save & Load System)**:
  - Ekspor struktur dunia ke file format JSON.
  - Impor dan muat file proyek secara instan.
  - Sinkronisasi otomatis ke LocalStorage.
- **Kamera Isometrik & Preset Views**:
  - Kontrol Orbit 360°, Pan, Zoom dengan batasan sudut polar agar tidak tembus ke bawah tanah.
  - Preset kamera 1-klik: Isometric, Top-Down, Front, Side, dan Free Cam.
  - Tombol pintas `F` untuk memusatkan kamera pada objek terpilih.

---

## ⌨️ Shortcut Keyboard

| Tombol | Aksi |
|---|---|
| `Q` | Select Mode (Pilih Objek) |
| `W` | Move / Translate Mode |
| `E` | Rotate Mode |
| `R` | Scale Mode |
| `Delete` / `Backspace` | Hapus Objek Terpilih |
| `Ctrl + D` | Duplikasi Objek Terpilih |
| `Ctrl + Z` | Undo Tindakan |
| `Ctrl + Y` | Redo Tindakan |
| `F` | Fokus Kamera ke Objek Terpilih |
| `G` | Toggle Tampilan Grid ON / OFF |
| `S` | Toggle Snap Grid ON / OFF |
| `Esc` | Batalkan Penempatan Asset / Batal Pilih |

---

## 📂 Struktur Monorepo (pnpm)

```text
audira-3d-simulator/
├── apps/
│   ├── web/                    # Frontend React 18 + R3F + Tailwind
│   │   ├── src/
│   │   │   ├── app/            # App Container & Viewport
│   │   │   ├── components/     # Header, Toolbar, PropertiesPanel, AssetLibrary
│   │   │   ├── features/       # Camera, Terrain, Objects, Save
│   │   │   ├── stores/         # Zustand Stores (useEditorStore, useWorldStore, etc)
│   │   │   └── main.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api/                    # Backend Fastify + TypeScript (Ready for DB)
│       ├── src/server.ts
│       └── package.json
│
├── packages/
│   ├── shared/                 # Shared Types, Zod Schemas & Constants
│   └── game-core/              # Grid Math, Initial World State & Logic
│
├── .agents/                    # Single Source of Truth AI Rules & Architecture
├── prisma/schema.prisma        # Database Schema PostgreSQL
├── pnpm-workspace.yaml         # Workspace Monorepo
├── save.bat                    # 1-Click Quick Save & Push ke GitHub
├── start.bat                   # 1-Click Launcher (Windows)
├── stop.bat                    # 1-Click Stopper (Windows)
└── README.md
```

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Script 1-Klik (Windows)
- **Menjalankan Simulator**:
  ```cmd
  ./start.bat
  ```
  Otomatis menginstal dependensi (jika belum), menjalankan server Vite 3D R3F, dan membuka browser di `http://localhost:5173/`.

- **Menyimpan & Push ke GitHub**:
  ```cmd
  ./save.bat
  ```
  Otomatis melakukan staging, commit, dan push perubahan langsung ke repositori GitHub.

- **Menghentikan Simulator**:
  ```cmd
  ./stop.bat
  ```

### Cara 2: Manual Terminal
```bash
# 1. Install semua dependensi monorepo
pnpm install

# 2. Jalankan frontend 3D editor
pnpm dev

# Akses di browser:
# http://localhost:5173/
```

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, Zustand, Tailwind CSS, Lucide React, Vite.
- **Backend Ready**: Fastify, TypeScript, Prisma ORM, PostgreSQL, Zod.

---

## 👥 Developer & Official Contact

### Founder & Organization
- **Author & Founder**: Agus Dwi Rianto (AUDIRA)
- **Organization**: Audira Multimedia Digital / Audira Sukses Mandiri
- **Official Production Domain**: [https://audira.my.id](https://audira.my.id)

### 📧 Official Contact
- **Official Email**: [agusdwirianto@gmail.com](mailto:agusdwirianto@gmail.com)
- **Business Partnership**: Contact the official email above.
- **General Support**: Contact the official email above.
- **Security & Vulnerability Reports**: Contact the official email above.
- **WhatsApp Hotline**: [+62 821-1200-1600](https://wa.me/6282112001600)
- **Telegram Community**: To be announced
- **Discord Server**: To be announced

---

## 🔐 Security & Responsible Disclosure

For business inquiries, technical support, partnership opportunities, and security vulnerability reports, please use the official email address listed above.

For security reports, include a clear description of the vulnerability, its potential impact, and reproduction steps where applicable. Do not include passwords, API keys, or other sensitive credentials.

---

## © Project Ownership & Attribution

AUDIRA is an ecosystem of digital products, AI-powered applications, automation systems, and technology solutions developed under the AUDIRA brand.

All product names, source code, designs, and associated intellectual property are subject to their respective ownership rights and applicable licenses.

- **Official Brand**: AUDIRA
- **Founder**: Agus Dwi Rianto
- **Organization**: Audira Multimedia Digital / Audira Sukses Mandiri
- **Website**: [https://audira.my.id](https://audira.my.id)
- **Official Email**: [agusdwirianto@gmail.com](mailto:agusdwirianto@gmail.com)
