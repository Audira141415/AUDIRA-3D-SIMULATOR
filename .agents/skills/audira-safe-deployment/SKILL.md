---
name: audira-safe-deployment
description: >-
  Use this skill when preparing, validating, or executing builds and production deployments
  for AUDIRA 3D CONSTRUCTION SIMULATOR, checking container isolation, or testing Docker Compose.
---

# Audira Safe Deployment & Production Operations Runbook

Petunjuk operasional dan standar keselamatan untuk memvalidasi kompilasi kode (`pnpm build`), membundel asset 3D, dan menjalankan deployment Docker Compose untuk AUDIRA 3D CONSTRUCTION SIMULATOR.

---

## 1. Safety Gates & Critical Directives (MUST READ)

1. **NO AUTOMATIC DEPLOYMENT:**
   - AI Assistant **DILARANG KERAS** memicu rilis produksi ke server tanpa konfirmasi tertulis eksplisit dari pengguna.
2. **MULTI-PROJECT ISOLATION:**
   - Lingkungan server dan workstation meng-host beberapa proyek Audira (`AUDIRA-KOMIK-MDA`, `AudiraGenerateAI`, `Audira-YT`).
   - DILARANG menjalankan perintah global seperti `docker system prune -a` atau `docker stop $(docker ps -aq)`.
   - Hanya operasikan container dalam konteks proyek: `audira-3d-simulator`.
3. **PRE-FLIGHT VALIDATION:**
   - Setiap rilis wajib lulus kompilasi lokal (`pnpm build`) dengan 0 kesalahan TypeScript.

---

## 2. Checklist Validasi Pre-Flight (Local Machine)

Jalankan perintah berikut di terminal sebelum membuat commit atau rilis:

```bash
# 1. Periksa status git
git status

# 2. Kompilasi TypeScript & bundel Vite
pnpm build

# 3. Verifikasi apakah seluruh 52 model GLB dan WebP tersedia di public/
# Pastikan tidak ada file yang hilang
ls apps/web/public/models/
```

---

## 3. Eksekusi Docker Compose

Untuk menjalankan lingkungan terisolasi penuh secara lokal atau di server produksi:

```bash
# Menjalankan kontainer di latar belakang
docker compose up -d --build

# Memeriksa log layanan
docker compose logs -f web

# Menghentikan kontainer tanpa menghapus data volume
docker compose down
```

---

## 4. Rollback Plan (Pemulihan Bencana)

Jika build produksi mengalami runtime error:
1. Kembalikan branch ke tag/commit stabil sebelumnya (`git checkout <tag>`).
2. Jalankan ulang `pnpm build` dan restart container via `docker compose up -d --build`.
