# MULTI-AGENT AGENCY ORCHESTRATION — AUDIRA 3D SIMULATOR

> **Arsitektur Tata Kelola Permanen Multi-Agent Agency**  
> Mengintegrasikan spesialis dari `agency-agents-main` ke dalam ekosistem `.agents/`, `brain/`, `skills/`, dan `MEMORY.md` untuk AUDIRA 3D CONSTRUCTION SIMULATOR.  
> **Status:** Active & Governed  
> **Author & Founder:** Agus Dwi Rianto (AUDIRA)  

---

## 1. Visi & Filosofi Integrasi

Sistem ini menggabungkan pustaka peran spesialis dari **The Agency** (`agency-agents-main`) dengan **Aturan Non-Negosiasi AUDIRA** (`AGENTS.md`).  
Setiap siklus pengerjaan fitur dijalankan oleh tim peran khusus (Role-based Specialists) yang saling memvalidasi melalui *Continuous Dev-QA Loops*.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PIPELINE ORKESTRASI MULTI-AGENT                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   v
             [ 1. Pipeline Lead: AgentsOrchestrator & PM ]
             - Membaca PRD.md, TASK_INSTRUCTION.md, MEMORY.md
             - Membagi roadmap menjadi milestone teknis terukur
                                   │
                                   v
        ┌──────────────────────────┴──────────────────────────┐
        │                                                     │
        v                                                     v
[ 2. 3D & Graphics Specialist ]              [ 3. Senior Fullstack Developer ]
- agency-3d-scene-developer                  - agency-senior-developer
- technical-artist                           - agency-frontend-developer
- audira-3d-asset-pipeline                   - audira-world-persistence
(Three.js, R3F, Canvas, Ground y0)           (Zustand Stores, UI, Hotkeys)
        │                                                     │
        └──────────────────────────┬──────────────────────────┘
                                   │
                                   v
             [ 4. Quality Gate & Zero-Bug Verification ]
             - agency-reality-checker ("No fantasy approvals")
             - audira-3d-scene-debugger (Audit 60 FPS & WebGL Leaks)
             - Evidence-based test & pnpm build verification
                                   │
                                   v
             [ 5. Memory Hub & Knowledge Persistence ]
             - Sinkronisasi MEMORY.md & .agents/brain/
             - Anti-amnesia spasial lintas sesi obrolan
```

---

## 2. Struktur 5 Divisi Spesialis

### Divisi 1: 3D Scene, World & Graphics Architecture
- **Spesialis Utama**: `agency-3d-scene-developer`, `technical-artist`
- **Fokus & Tanggung Jawab**:
  - Pengelolaan Three.js render loop, React Three Fiber (R3F), dan `@react-three/drei`.
  - Sistem pencahayaan dinamis 24 jam (Sun, Moon, Ambient, directional shadows).
  - Sistem pencahayaan kendaraan 3D (Headlights SpotLight, BrakeLights, Blinkers, Taillights).
  - PBR Terrain, texturing, grid snapping, dan optimasi draw calls.
  - **Aturan Wajib**: Seluruh objek harus berpijak di atas tanah (`y >= 0`) dengan normalisasi bounding box otomatis.

### Divisi 2: Vehicle Kinematics, Physics & Simulation
- **Spesialis Utama**: `agency-game-designer`, `audira-vehicle-physics`, `agency-xr-cockpit-interaction-specialist`
- **Fokus & Tanggung Jawab**:
  - Kontrol kemudi kendaraan darat (truk, traktor, mobil balap) dan simulasi pesawat terbang.
  - Suspensi, akselerasi, pengereman, redaman gesekan (friction), dan deteksi lompatan ramp.
  - Kamera multi-sudut teredam (Follow Chase, Cockpit kabin, Cinematic Track, Drone).
  - Sound synthesis terintegrasi (Web Audio API: engine revving, klakson, rem angin, turbo).

### Divisi 3: Engineering, State Stores & Responsive UI
- **Spesialis Utama**: `agency-senior-developer`, `agency-frontend-developer`, `audira-world-persistence`
- **Fokus & Tanggung Jawab**:
  - Arsitektur Zustand stores yang modular (`useWorldStore`, `useEditorStore`, `useSelectionStore`, `useVehicleAudioStore`, `useWeatherStore`).
  - Antarmuka pengguna Dark Modern (Glassmorphism, Tailwind CSS, aksen cyan/amber).
  - Penanganan event keyboard dan touch control virtual untuk mobile (D-Pad, Pedals).
  - Sinkronisasi persistensi JSON save/load dan riwayat mutasi Undo/Redo (30 langkah).

### Divisi 4: Quality Gate, Reality Verification & Debugging
- **Spesialis Utama**: `agency-reality-checker`, `agency-evidence-collector`, `audira-3d-scene-debugger`
- **Fokus & Tanggung Jawab**:
  - *No fantasy approvals*: Setiap fitur wajib diverifikasi dengan bukti nyata (`pnpm run build` sukses 0 error).
  - Memastikan tidak ada memori leak WebGL (geometri dan material di-dispose saat unmount).
  - Verifikasi bounding box model: tidak ada roda, bumper, atau pondasi bangunan yang tembus tanah.
  - Memastikan frame rate stabil pada 60 FPS tanpa jank atau freeze pada Canvas.

### Divisi 5: Autonomous Pipeline & Project Management
- **Spesialis Utama**: `agency-agents-orchestrator`, `agency-senior-project-manager`
- **Fokus & Tanggung Jawab**:
  - Menghubungkan instruksi pengguna dengan katalog fitur yang ada di `FEATURE_CATALOG.md`.
  - Mencegah penulisan ulang kode (anti-redundansi) dan memelihara dokumentasi Single Source of Truth.
  - Memperbarui catatan sprint dan log mutasi di `MEMORY.md` setelah setiap tugas selesai.

---

## 3. Protokol Eksekusi Tugas (SOP Multi-Agent)

Setiap kali tugas baru diinstruksikan:
1. **Fase Orientasi**: Baca `MEMORY.md`, `AGENTS.md`, dan `.agents/brain/INDEX.md`.
2. **Fase Perancangan**: Tentukan divisi yang bertanggung jawab dan pastikan tidak ada kode redundan.
3. **Fase Implementasi**: Tulis kode lengkap, bertipe ketat (`strict TypeScript`), dan modular.
4. **Fase Pengujian Kualitas**: Jalankan `pnpm run build` dan pastikan nol error kompilasi.
5. **Fase Sinkronisasi Memori**: Catat fitur baru, bugfix, atau perbaikan ke `MEMORY.md` dan arsipkan di `brain/`.
