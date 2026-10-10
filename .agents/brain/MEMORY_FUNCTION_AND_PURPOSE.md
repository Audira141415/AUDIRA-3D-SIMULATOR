# MEMORY FUNCTION & PURPOSE — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Definitive Guide on Project Memory, Spatial State Preservation, and AI Agent Cognition**  
> *Mengapa Proyek 3D Simulator Membutuhkan Memori Permanen dan Bagaimana Mempertahankan Integritasnya.*

---

## 1. Latar Belakang: Problem Amnesia Spasial pada AI Coding Assistant

Pengembangan simulator 3D berbasis web berbeda secara fundamental dengan website CRUD standar. Pada simulator 3D:
- Setiap objek memiliki **posisi 3D ($X, Y, Z$)**, **rotasi**, **skala**, serta relasi terhadap permukaan tanah (`y = 0`).
- Model 3D eksternal (`.glb`) memiliki origin/pivot point yang bervariasi dari pembuat aslinya (ada yang di tengah objek, ada yang di pojok, ada yang di bawah).
- Pipeline WebGL menuntut pengelolaan siklus hidup memori GPU (`dispose()`) yang ketat.

Ketika AI Assistant kehilangan ingatan kontekstual (*Context Reset / Session Reset*), kesalahan klasik yang selalu terulang adalah:
1. **Menghapus Normalisasi Pivot:** Lupa bahwa model GLB memerlukan kalkulasi bounding box `clone.position.y = -box.min.y`, sehingga objek tiba-tiba kembali tenggelam ke dalam lantai.
2. **Merusak Store Zustand:** Menggabungkan semua store menjadi satu objek monster yang memicu re-render canvas Three.js secara masif dan menjatuhkan FPS dari 60 ke 15.
3. **Mengusulkan Engine Biner:** Menyarankan penggunaan Unity WebGL exporter atau Godot, padahal proyek ini 100% dirancang di atas React Three Fiber murni.
4. **Mengubah Format Penyimpanan JSON:** Mengubah field objek tanpa backward compatibility, sehingga file save proyek pengguna tidak dapat dimuat kembali.

---

## 2. Struktur Hierarki Memori Proyek

AUDIRA 3D CONSTRUCTION SIMULATOR membagi memori menjadi tiga lapisan terstruktur:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIGA LAPISAN MEMORI SISTEM                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. MEMORY.md (Root)                                                    │
│    - Status harian, sprint board aktif, gotchas cepat, port monorepo   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. .agents/brain/ (Deep Long-Term Memory / LTM)                        │
│    - Spesifikasi arsitektur detail, katalog 52 asset GLB, state loops, │
│      keamanan WebGL, skema data, dan roadmap jangka panjang            │
├────────────────────────────────────────────────────────────────────────┤
│ 3. .agents/rules/ (Context Guardrails)                                 │
│    - Aturan mutlak yang selalu aktif (y >= 0, memory disposal, dsb)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Siklus Hidup Standar Operasional: Read -> Act -> Update

Setiap AI Agent yang membuka proyek ini wajib mengikuti siklus 3 langkah berikut:

```
   +-------------------+
   | 1. READ FIRST     | -> Baca MEMORY.md & brain/INDEX.md
   +---------+---------+
             |
             v
   +-------------------+
   | 2. ACT WITH GUARD | -> Patuhi batasan ground level & WebGL disposal
   +---------+---------+
             |
             v
   +-------------------+
   | 3. UPDATE ON DONE | -> Catat perubahan di brain/ & MEMORY.md
   +-------------------+
```

### Tahap 1: READ FIRST (Orientasi Konteks)
- Pahami fitur apa yang sedang aktif dan file mana yang memegang kendali state.
- Cek katalog asset di `brain/ASSET_AND_SIMULATION_MATRIX.md` sebelum merekayasa model baru.

### Tahap 2: ACT WITH GUARD (Implementasi Aman)
- Pastikan setiap komponen visual 3D yang ditambahkan memiliki normalisasi posisi vertikal (`y >= 0`).
- Pastikan pemanggilan listener keyboard (`W`, `E`, `R`, `Q`, `Ctrl+Z`) tidak bertabrakan dengan input teks di form Properties Panel.
- Jangan pernah menggunakan tipe `any` pada TypeScript.

### Tahap 3: UPDATE ON DONE (Sinkronisasi Akhir)
- Jika menambahkan model GLB baru, tambahkan ke katalog `TASK_INSTRUCTION.md` dan `ASSET_AND_SIMULATION_MATRIX.md`.
- Jika membuat store atau fungsi transform baru, dokumentasikan di `SYSTEM_ARCHITECTURE.md`.
- Perbarui sprint board di `MEMORY.md`.
