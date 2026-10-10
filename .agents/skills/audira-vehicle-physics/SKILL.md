---
name: audira-vehicle-physics
description: >-
  Use this skill when developing, tuning, or debugging vehicle kinematics, driving controls (WASD),
  wheel rotation math, ground raycasting collisions, or construction heavy equipment mechanics.
---

# Audira Vehicle Physics & Kinematics Runbook

Petunjuk operasional untuk mengimplementasikan simulasi pergerakan kendaraan, kalkulasi putaran roda, dan sistem kemudi di AUDIRA 3D CONSTRUCTION SIMULATOR.

---

## 1. Rumus Kinematika Roda & Kecepatan

Agar roda kendaraan berputar realistis sesuai kecepatan maju kendaraan di atas tanah:

$$\theta_{\text{rotasi}} = \theta_{\text{sebelumnya}} + \frac{v \cdot \Delta t}{r}$$

- $v$ = Kecepatan maju kendaraan (meter / detik)
- $\Delta t$ = Delta waktu frame (`delta` dari `useFrame`)
- $r$ = Radius roda (default roda mobil $\approx 0.35\text{ m}$, roda truk Scania $\approx 0.55\text{ m}$)

```typescript
useFrame((state, delta) => {
  if (isDriving && wheelRef.current) {
    const wheelRadius = 0.4;
    const angularVelocity = speed / wheelRadius;
    wheelRef.current.rotation.x += angularVelocity * delta;
  }
});
```

---

## 2. Deteksi Tabrakan Tanah (Ground Raycasting)

Untuk menjaga kendaraan tidak terbang atau amblas saat melewati kontur tanah bergelombang:

```typescript
const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0);

export function alignVehicleToGround(vehiclePosition: THREE.Vector3, groundMesh: THREE.Object3D) {
  // Tembakkan ray dari ketinggian 10 meter di atas kendaraan
  const rayOrigin = vehiclePosition.clone().setY(vehiclePosition.y + 10);
  raycaster.set(rayOrigin, downVector);

  const intersects = raycaster.intersectObject(groundMesh);
  if (intersects.length > 0) {
    // Posisikan alas kendaraan tepat di titik kontak
    const groundHeight = intersects[0].point.y;
    vehiclePosition.y = Math.max(0, groundHeight);
  }
}
```

---

## 3. Integrasi Masa Depan: `@react-three/rapier`

Untuk implementasi rigid body sejati pada Milestone V2:
- Gunakan `<RigidBody colliders="hull" type="dynamic">` untuk badan mobil.
- Tambahkan `<CuboidCollider>` untuk sasis dan peredam guncangan suspensi.
- Pastikan friction roda diatur ke `0.8` untuk mencegah slip berlebihan di atas rumput.
