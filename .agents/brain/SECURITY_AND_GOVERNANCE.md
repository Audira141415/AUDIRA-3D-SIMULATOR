# SECURITY & GOVERNANCE — AUDIRA 3D CONSTRUCTION SIMULATOR
> **WebGL Memory Safety, Multi-Project Boundaries, and Operational Guardrails**  
> *Kebijakan Proteksi Memori GPU, Isolasi Container, dan Integritas Sistem.*

---

## 1. Multi-Project Isolation (Isolasi Lingkungan)

Pengembang mengelola sejumlah proyek aktif dalam satu lingkungan kerja:
- `AUDIRA-3D-SIMULATOR` (Proyek ini - WebGL 3D Builder)
- `AUDIRA-KOMIK-MDA` (Platform Streaming Anime & Komik)
- `AudiraGenerateAI`, `Audira-YT`, `AUDIRA-CLIP-AI`, `AUDIRA-KIDS-STUDIO`

### ⛔ Batasan Mutlak AI Agent:
1. **Dilarang Menjalankan Perintah Global Docker**: Jangan pernah mengeksekusi `docker system prune -a` atau `docker stop $(docker ps -aq)`. Operasi Docker hanya boleh menggunakan flag proyek lokal:
   ```bash
   docker compose -p audira-3d-simulator down
   ```
2. **Isolasi Port Monorepo**: Port default dev adalah `5173` (Web) dan `3000` (API). Jangan mengubah port ke port yang sedang digunakan proyek lain (seperti `3224`, `4000`, `5433`).

---

## 2. WebGL & GPU Memory Safety (Pencegahan Kebocoran VRAM)

Aplikasi 3D berbasis browser berjalan di dalam sandbox memori tab yang terbatas (sering kali dibatasi hingga 2GB-4GB VRAM oleh browser Chromium/Firefox):

```
Komponen Objek Dihapus (Unmount)
               |
               v
+-------------------------------+
|  ModelRenderer Unmount Hook   |
+---------------+---------------+
                |
                v
+-------------------------------+
|  Traversal: obj.traverse()    |
+---------------+---------------+
                |
        +-------+-------+
        |               |
        v               v
+---------------+ +---------------+
| geom.dispose()| | mat.dispose() |
+---------------+ +-------+-------+
                          |
                          v
                  +---------------+
                  |  tex.dispose()|
                  +---------------+
```

### Aturan Wajib di Kode:
1. **Pembersihan Geometri & Material**: Setiap kali objek 3D dihapus dari `useWorldStore`, seluruh mesh buffer geometry dan Three.js texture harus dibersihkan secara eksplisit:
   ```typescript
   object.traverse((child) => {
     if ((child as THREE.Mesh).isMesh) {
       const mesh = child as THREE.Mesh;
       mesh.geometry?.dispose();
       if (Array.isArray(mesh.material)) {
         mesh.material.forEach((m) => m.dispose());
       } else {
         mesh.material?.dispose();
       }
     }
   });
   ```
2. **Kamera & Shadow Map Limits**: Batasi resolusi shadow map directional light pada maksimal `2048x2048` untuk mencegah degradasi kinerja drastis.

---

## 3. Sanitasi File Import & Skema Keamanan

1. **Validasi File JSON Dunia**:
   - File `.json` yang diimpor oleh pengguna harus divalidasi menggunakan skema Zod sebelum dimasukkan ke dalam store.
   - Cegah Prototype Pollution dan abaikan properti berbahaya (`__proto__`, `constructor`).
2. **Sanitasi File Model GLB**:
   - Parser hanya memproses berkas biner `.glb` valid dengan format Khronos Group.
   - Batasi ukuran berkas upload maksimal 50 MB per model.

---

## 4. Deployment Safety Gate (Gerbang Rilis)

1. **Local Pre-Flight Validation**:
   - Sebelum menyarankan build atau rilis produksi, jalankan:
     ```bash
     pnpm build
     ```
   - Build TypeScript dan bundler Vite harus lulus 0 error.
2. **Persetujuan Tertulis**: Dilarang memicu deployment ke server tanpa persetujuan eksplisit dari pengembang.
