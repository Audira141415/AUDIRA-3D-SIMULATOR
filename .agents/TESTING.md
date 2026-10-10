# TESTING — AUDIRA 3D CONSTRUCTION SIMULATOR

> Quality Assurance, Automated Test Strategy, and Test Execution Guide.  
> **Version:** v1.0.0-dev  
> **Last Updated:** 2026-10-10  
> **Frameworks:** Vitest 3.x / 4.x, React Testing Library, JSDOM, Three.js Mocks  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. Testing Strategy & Philosophy

AUDIRA 3D CONSTRUCTION SIMULATOR menerapkan strategi pengujian berlapis untuk memastikan kestabilan simulasi 3D dan manipulasi data spasial:

```
┌────────────────────────────────────────────────────────┐
│                   PIRAMIDA PENGUJIAN 3D                │
├────────────────────────────────────────────────────────┤
│ 1. E2E & Visual Regression (Playwright / Canvas Smoke) │
│    - Verifikasi render canvas WebGL dan respons gizmo  │
├────────────────────────────────────────────────────────┤
│ 2. Component & UI Integration Tests (RTL + JSDOM)      │
│    - Properties Panel, Header Toolbar, Asset Drawer    │
├────────────────────────────────────────────────────────┤
│ 3. State & Math Unit Tests (Vitest)                    │
│    - Zustand Stores: useWorldStore, useHistoryStore    │
│    - Math Utils: Grid snapping, Bounding box y >= 0    │
│    - Serialization: JSON World Schema validator (Zod) │
└────────────────────────────────────────────────────────┘
```

---

## 2. Test Execution Commands

```bash
# Menjalankan seluruh test suite di Monorepo
pnpm test

# Menjalankan test khusus Frontend Web
pnpm --filter web test

# Menjalankan test dalam mode watch interaktif
pnpm --filter web test:watch

# Memeriksa cakupan kode (coverage report)
pnpm --filter web test:coverage
```

---

## 3. Standar Pengujian Matematika & State Spasial

Unit test untuk memastikan logika normalisasi bounding box dan snapping grid selalu akurat:

```typescript
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { normalizeModelGround } from '../features/objects/modelUtils';

describe('Ground Level Alignment & Bounding Box', () => {
  it('harus menormalkan titik terbawah objek tepat ke y = 0', () => {
    // Buat mesh kubus dengan pivot di tengah: y dari -1 sampai +1
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    const normalized = normalizeModelGround(mesh);
    const box = new THREE.Box3().setFromObject(normalized);

    // Titik terbawah (min.y) harus bernilai 0
    expect(box.min.y).toBeCloseTo(0, 5);
  });
});
```

---

## 4. Mocking WebGL Context untuk Headless Testing

Karena JSDOM tidak menyediakan WebGL konteks perangkat keras secara bawaan:
- Gunakan mock HTMLCanvasElement `getContext('webgl')` atau `getContext('webgl2')`.
- Gunakan `@react-three/test-renderer` untuk memvalidasi scene tree deklaratif R3F tanpa memerlukan GPU fisik.

---

## 5. Pre-Release Build Gate

Sebelum melakukan commit atau rilis produksi, pastikan kedua perintah berikut lulus tanpa error:
```bash
pnpm lint
pnpm build
```
