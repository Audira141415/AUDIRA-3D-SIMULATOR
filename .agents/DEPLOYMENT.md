# DEPLOYMENT — AUDIRA 3D CONSTRUCTION SIMULATOR

> Comprehensive Infrastructure, Containerization, and Production Deployment Guide.  
> **Version:** v1.0.0-dev  
> **Last Updated:** 2026-10-10  
> **Target Production Server:** Linux Server (`192.168.100.168` / fallback `192.168.100.158`), User `audira`  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. Deployment Environments

AUDIRA 3D CONSTRUCTION SIMULATOR beroperasi dalam dua lingkungan utama:

### A. Local Development Environment (Windows Laptop)
- **Frontend 3D Web Editor**: Berjalan melalui Vite Dev Server HMR di port `5173`.
- **Target Backend API (Fastify)**: Berjalan via Node.js / `tsx watch` di port `3000`.
- **Database (Optional Cloud Sync)**: PostgreSQL di port `5432`.
- **1-Click Launchers**:
  - `.\start.bat`: Menjalankan pnpm dev server untuk frontend 3D.
  - `.\stop.bat`: Menghentikan proses node yang sedang berjalan.

### B. Production Server Environment (Linux Server `192.168.100.168`)
- **Docker Compose Stack**: `docker-compose.yml` (Project name: `audira-3d-simulator`) mengorkestrasi seluruh layanan:
  - `web`: Nginx Alpine serving React Three Fiber Production Bundle di port `3000` / `80`.
  - `api`: Fastify REST API Service di port `4000` internal.
  - `db`: PostgreSQL 15 Alpine dengan persistent storage volume `pgdata_3d`.
- **Volume Storage**:
  - Asset Cache GLB & WebP Thumbs: `apps/web/public/`
  - Database Volume: `pgdata_3d`

---

## 2. Environment Variables Matrix

### Local Development (`.env` di Root / Apps)
```ini
# Node Environment
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Frontend Configuration
VITE_APP_TITLE="AUDIRA 3D Construction Simulator"
VITE_API_URL="http://localhost:3000/api"
VITE_ENABLE_PERF_STATS="true"

# Backend Database (Jika mengaktifkan Cloud Sync)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/audira_3d_simulator?schema=public"
JWT_SECRET="audira_3d_super_secret_jwt_key_98765"
```

### Production Server (`.env.production` di `192.168.100.168`)
```ini
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

VITE_API_URL="https://audira.online/api/3d"
DATABASE_URL="postgresql://audira_user:StrongPasswordHere@db:5432/audira_3d_prod?schema=public"
JWT_SECRET="production_high_entropy_jwt_secret_audira_3d"
```

---

## 3. Production Build & Validation Steps

Sebelum merilis atau membundel:

```bash
# 1. Pastikan seluruh dependensi monorepo terpasang
pnpm install

# 2. Type-check TypeScript & bundel Vite
pnpm build

# 3. Hasil kompilasi web statis berada di:
# apps/web/dist/
```

---

## 4. Docker Compose Orchestration

Berkas `docker-compose.yml` proyek:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: audira_3d_web
    restart: unless-stopped
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    networks:
      - audira_3d_net

networks:
  audira_3d_net:
    driver: bridge
```

---

## 5. Strict Multi-Project Isolation Guidelines

Workstation dan server menjalankan beberapa proyek saudara (`AUDIRA-KOMIK-MDA`, `AudiraGenerateAI`, `Audira-YT`).
- ⛔ **JANGAN PERNAH** menjalankan perintah Docker destruktif global (`docker system prune -a` atau `docker stop $(docker ps -aq)`).
- ✅ Hanya gunakan container flags dengan nama proyek spesifik:
  ```bash
  docker compose -p audira-3d-simulator down
  ```
