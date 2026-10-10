# SECURITY — AUDIRA 3D CONSTRUCTION SIMULATOR

> Security Protocols, Threat Modeling, WebGL Memory Safety, and Data Protection Standards.  
> **Version:** v1.0.0-dev  
> **Last Updated:** 2026-10-10  
> **Author:** Agus Dwi Rianto (AUDIRA)  

---

## 1. Security Architecture & Threat Model

AUDIRA 3D CONSTRUCTION SIMULATOR menerapkan strategi pertahanan mendalam (*Defense-in-Depth*) yang mencakup lapisan grafis WebGL pada peramban klien hingga lapisan backend API:

```
Incoming User Interaction / Save File
                |
                v
+-------------------------------+
|   Input & Schema Sanitizer    |  (Zod validation: Cegah Prototype Pollution)
+---------------+---------------+
                |
                v
+-------------------------------+
|  WebGL Memory Guard & Disposal|  (Cegah VRAM exhaustion & Tab Crash)
+---------------+---------------+
                |
                v
+-------------------------------+
|   GLB Binary Parser Boundary  |  (Hanya terima Khronos GLB valid, max 50MB)
+---------------+---------------+
                |
                v
+-------------------------------+
|  Fastify Rate Limit & CORS    |  (Perlindungan Endpoint API & Cloud Sync)
+-------------------------------+
```

---

## 2. WebGL & GPU Memory Safety (Client-Side Defense)

Aplikasi WebGL berjalan di dalam batas memori peramban yang ketat. Kebocoran memori pada objek 3D dapat mengakibatkan crash seluruh tab browser (*Context Lost*):

1. **Disposal Mandat**: Setiap mesh, material, dan tekstur yang dilepas dari scene harus memanggil fungsi pembersihan Three.js (`.dispose()`).
2. **Shadow Map Frustum Restraint**: Resolusi shadow map directional light dibatasi pada `2048x2048` agar kartu grafis tidak mengalami beban VRAM berlebihan.
3. **Vertex & Triangle Limits**: Peringatkan pengguna jika jumlah poligon total melebihi 2.000.000 segitiga dalam satu scene.

---

## 3. Sanitasi File Save JSON & GLB Import

1. **Sanitasi File JSON**:
   - File JSON yang diunggah oleh pengguna melalui fitur "Import Project" divalidasi dengan Zod schema sebelum disuntikkan ke Zustand store.
   - Properti berbahaya seperti `__proto__`, `prototype`, dan `constructor` dibuang secara otomatis.
2. **Sanitasi Model GLB**:
   - File berkas 3D yang dimuat diverifikasi memiliki magic header GLTF/GLB biner `0x46546C67` (`glTF`).
   - Ukuran maksimal dibatasi 50 MB per berkas model.

---

## 4. Multi-Project Isolation & Server Safety

Workstation pengembang mengelola beberapa proyek berdampingan (`AUDIRA-KOMIK-MDA`, `AudiraGenerateAI`, dll).
- Dilarang keras mengeksekusi perintah penghapusan container global (`docker system prune -a`).
- Deployment ke server produksi Linux `192.168.100.168` wajib mendapatkan izin tertulis terlebih dahulu.
