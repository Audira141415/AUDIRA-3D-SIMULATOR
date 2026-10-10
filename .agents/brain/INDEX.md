# BRAIN MANIFEST — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Central Knowledge Repository & Persistent Project Intelligence**  
> *Single Source of Truth (SSOT) for 3D R3F Architecture, State Stores, Spatial Memory, Physics Engines, Asset Matrix, and Long-Term Intelligence.*

---

## 1. Executive Overview & Filosofi Brain

**AUDIRA 3D CONSTRUCTION SIMULATOR** adalah game simulasi konstruksi dan world builder 3D generasi baru yang berjalan langsung di browser tanpa instalasi engine pihak ketiga (*Zero-Install WebGL/WebGPU*). Platform ini menggabungkan:
- **High-Performance 3D Viewport**: Dibangun menggunakan Three.js, React Three Fiber (R3F), dan `@react-three/drei` dengan framerate target stabil 60 FPS.
- **Precision Spatial World Editor**: Sistem manipulasi objek real-time (Translate, Rotate, Scale) dengan snapping grid presisi dan visual raycasting.
- **Engine Asset Kaya (52 Model GLB)**: Koleksi model 3D berkas `.glb` berkualitas tinggi yang mencakup kendaraan super, truk berat Scania, traktor pertanian, pesawat, dan wahana taman lengkap dengan preview WebP.
- **Ground Alignment Guarantee**: Standar kalkulasi posisi otomatis yang menjamin seluruh objek berpijak mulus di atas permukaan tanah (`y >= 0`).
- **Reactive State Management**: Zustand modular stores untuk editor tools, world scene graph, selection, dan undo/redo command stack.
- **Scalable Monorepo Ecosystem**: Arsitektur pnpm monorepo yang memisahkan frontend Web, Fastify REST API, dan shared packages.

---

## 2. Mengapa Proyek 3D Simulator Membutuhkan Memory & Brain?

> 💡 **FILOSOFI INTI MEMORY:**  
> *"AI Assistant tanpa memory adalah asisten yang mengalami amnesia spasial dan arsitektural setiap kali sesi chat berganti. Direktori `.agents/brain/` dan file `MEMORY.md` adalah **hippocampus** (pusat memori jangka panjang) yang menjamin seluruh koordinat, normalisasi bounding box, store Zustand, dan pipeline 3D tetap konsisten tanpa regresi."*

Aplikasi 3D berbasis WebGL memiliki tingkat kompleksitas tinggi (koordinat 3D, memori GPU, matriks transformasi, normalisasi mesh). Tanpa memory terstruktur, AI Agent akan rentan melakukan kesalahan berulang:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        5 FUNGSI UTAMA MEMORY SISTEM                    │
├───────────────────┬────────────────────────────────────────────────────┤
│ 1. Anti-Amnesia   │ Menjaga pemahaman scene graph, pivot, dan ground y0│
│ 2. Anti-Redundansi│ Mencegah duplikasi stores, math helper, dan types  │
│ 3. Governance     │ Memastikan aturan bounding box & disposal dipatuhi │
│ 4. Evolution Track│ Mencatat progres fitur V1 sandbox menuju V2 physics│
│ 5. Multi-Agent Hub│ Sinkronisasi antar AI (Antigravity, Copilot, dsb)  │
└───────────────────┴────────────────────────────────────────────────────┘
```

1. **Preservasi Logika Spasial (Anti-Amnesia)**: AI langsung mengingat bahwa model GLB wajib dinormalkan titik terbawahnya (`y >= 0`), sehingga roda atau bumper tidak tenggelam ke dalam terrain.
2. **Pencegahan Redundansi State (Anti-Redundansi)**: Menjaga pemisahan tegas antara `useEditorStore` (tool mode, snap) dan `useWorldStore` (array objek di scene).
3. **Penjaga Kinerja GPU (Governance & Performance)**: Memastikan agent mematuhi pembersihan memory WebGL (`geometry.dispose()`, `material.dispose()`) untuk mencegah crash tab browser.
4. **Pelacak Evolusi Fitur (Evolution Tracker)**: Memastikan transisi dari V1 Procedural/GLB Sandbox ke V2 Rapier Physics berjalan bertahap tanpa merusak fitur editor yang sudah berjalan.
5. **Jembatan Antar Sesi (Cross-Session Bridge)**: Memungkinkan pengembang dan AI melanjutkan pengembangan kapan saja tanpa kehilangan konteks teknis.

---

## 3. Peta Dokumen Brain (Brain Knowledge Map)

Brain diorganisir secara modular agar dapat dikonsultasikan dengan cepat oleh AI Agent maupun pengembang:

| Modul Brain | Lokasi File | Deskripsi & Fokus Konten |
| :--- | :--- | :--- |
| **00. Panduan Memory** | [MEMORY_FUNCTION_AND_PURPOSE.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/MEMORY_FUNCTION_AND_PURPOSE.md) | Filosofi memory, siklus Read-Act-Update, dan pencegahan amnesia spasial. |
| **01. Arsitektur Sistem** | [SYSTEM_ARCHITECTURE.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/SYSTEM_ARCHITECTURE.md) | WebGL render loop, R3F scene graph, Zustand reactive loop, dan monorepo layers. |
| **02. Katalog Fitur Lengkap** | [FEATURE_CATALOG.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/FEATURE_CATALOG.md) | Detail 10+ fitur editor, viewport controls, properties panel, dan JSON save system. |
| **03. Keamanan & Tata Kelola**| [SECURITY_AND_GOVERNANCE.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/SECURITY_AND_GOVERNANCE.md) | WebGL memory leak defense, GLB sanitization, isolation container, dan deployment gates. |
| **04. Matriks Asset & Simulasi**| [ASSET_AND_SIMULATION_MATRIX.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/ASSET_AND_SIMULATION_MATRIX.md) | Katalog lengkap 52 model GLB, bounding box offset, skala normal, dan klasifikasi kendaraan. |
| **05. Database & Alur Data** | [DATABASE_AND_DATA_FLOW.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/DATABASE_AND_DATA_FLOW.md) | Mutasi state scene graph, serialisasi JSON, skema Prisma API, dan autosave flow. |
| **06. Log & Roadmap** | [UPDATE_HISTORY_AND_ROADMAP.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md) | Riwayat rilis v1.0.0, backlog V2 Rapier Physics, dan integrasi career mode V3. |

---

## 4. Protokol Sinkronisasi Brain

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS & DEVELOPERS:**  
> Setiap kali terjadi penambahan asset model baru, penyesuaian store Zustand, modifikasi kontrol transformasi, atau integrasi physics:
> 1. Buka dan perbarui file terkait di [`.agents/brain/`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain).
> 2. Catat entri perubahan pada [UPDATE_HISTORY_AND_ROADMAP.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md) dan [MEMORY.md](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md).
> 3. Jalankan validasi `pnpm build` untuk memastikan tidak ada kesalahan kompilasi TypeScript atau bundle.
