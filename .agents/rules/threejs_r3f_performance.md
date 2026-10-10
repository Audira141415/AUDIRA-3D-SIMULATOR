# THREE.JS & R3F WEBGL PERFORMANCE RULES
> **Rule ID**: `R3F-PERF-01`  
> **Target**: Seluruh AI Agent, R3F Komponen, Hook Animasi, dan Renderer.  
> **Level**: MANDATORY (Kinerja WebGL dan Stabilitas Tab Browser).

---

## 1. Target Kinerja Utama

Aplikasi wajib mempertahankan kestabilan:
- **Framerate Target**: 60 FPS pada layar standar desktop / laptop.
- **Batas Draw Calls**: $\le 100$ draw calls untuk scene 3D dengan puluhan objek.
- **Budget VRAM**: $< 1.5$ GB memori GPU untuk mencegah Crash WebGL Context Lost.

---

## 2. Aturan Wajib Siklus Hidup Memori (Disposal Protocol)

Setiap komponen yang membuat atau memuat objek 3D wajib menyertakan pembersihan saat komponen unmount:

```typescript
useEffect(() => {
  return () => {
    // Traverse dan bersihkan memori GPU saat objek dihapus dari scene
    sceneObject.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  };
}, [sceneObject]);
```

---

## 3. Aturan `useFrame` Render Loop

Dalam loop render `useFrame((state, delta) => { ... })`:
1. **Dilarang Alokasi Objek Baru**:
   - ⛔ JANGAN pernah membuat `new THREE.Vector3()` atau `new THREE.Matrix4()` di dalam `useFrame`.
   - ✅ Gunakan reusable scratch vector di luar loop (*module-level scratch objects*).
2. **Dilarang Pemanggilan State React / Zustand Berlebihan**:
   - ⛔ JANGAN memicu `setState()` yang memicu re-render seluruh komponen React setiap frame ($60\times$ per detik).
   - ✅ Mutasikan langsung nilai ref Three.js (`ref.current.position.x += speed * delta`).

---

## 4. Pengaturan Bayangan (Shadow Mapping)

- Batasi resolusi shadow map directional light pada maksimum `2048x2048`.
- Atur frustum kamera bayangan (`shadow-camera-left`, `right`, `top`, `bottom`) secukupnya meliputi area kerja terrain (misal: $\pm 60$ meter), jangan terlalu luas agar bayangan tetap tajam tanpa artefak aliasing.
