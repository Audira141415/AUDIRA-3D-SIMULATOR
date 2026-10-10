---
name: audira-3d-scene-debugger
description: >-
  Use this skill when diagnosing 3D WebGL performance issues, frame drops below 60 FPS,
  excessive draw calls, WebGL context loss, memory leaks, or lighting and shadow map artifacts.
---

# Audira 3D Scene Debugger & Performance Runbook

Petunjuk operasional untuk mendiagnosis, memprofiling, dan mengatasi isu performa rendering 3D, kebocoran memori WebGL, dan artefak grafis di AUDIRA 3D CONSTRUCTION SIMULATOR.

---

## 1. Quick Telemetry & Diagnostics Inspection

Gunakan Drei `<Stats />` atau Three.js renderer info untuk memeriksa beban rendering:

```typescript
// Di dalam R3F Canvas atau hook useFrame
useFrame(({ gl }) => {
  const info = gl.info;
  console.log({
    drawCalls: info.render.calls,
    triangles: info.render.triangles,
    geometries: info.memory.geometries,
    textures: info.memory.textures,
  });
});
```

### Ambang Batas Sehat (Health Benchmarks):
- **Draw Calls**: $\le 100$ calls per frame.
- **Triangles Count**: $\le 1.000.000$ triangles per frame.
- **Framerate**: Stabil di 60 FPS.

---

## 2. Prosedur Investigasi Kebocoran Memori (Memory Leak Audit)

Jika memory tab browser terus membengkak saat objek dihapus dan dibuat kembali:

1. **Periksa Jumlah Geometri & Tekstur**:
   - Bandingkan `gl.info.memory.geometries` sebelum objek dihapus dan sesudah dihapus.
   - Jika angka tidak berkurang, pastikan hook pembersihan `.dispose()` dipanggil pada mesh.
2. **Eksekusi Pembersihan Manual**:
   ```typescript
   export function disposeHierarchy(root: THREE.Object3D) {
     root.traverse((node) => {
       if ((node as THREE.Mesh).isMesh) {
         const mesh = node as THREE.Mesh;
         mesh.geometry?.dispose();
         if (Array.isArray(mesh.material)) {
           mesh.material.forEach((m) => m.dispose());
         } else {
           mesh.material?.dispose();
         }
       }
     });
   }
   ```

---

## 3. Menangani Artefak Bayangan (Shadow Acne & Peter Panning)

- **Shadow Acne (Garis-garis hitam belang di permukaan)**:
  Tingkatkan nilai `shadow-bias` pada directional light ke `-0.0001` atau `-0.0005`.
- **Peter Panning (Bayangan melayang terpisah dari alas objek)**:
  Turunkan nilai `shadow-bias` dan sesuaikan `shadow-normalBias` ke `0.02`.
- **Shadow Map Cutoff (Bayangan terpotong di tepi pandangan)**:
  Perluas jangkauan kamera bayangan (`shadow-camera-left = -50`, `right = 50`, `top = 50`, `bottom = -50`).
