# STATE & ZUSTAND STORE INTEGRITY RULES
> **Rule ID**: `ZUSTAND-STORE-01`  
> **Target**: Seluruh AI Agent, State Management, Custom Hooks, dan Store Slices.  
> **Level**: MANDATORY (Integritas Arsitektur State).

---

## 1. Pemisahan Modular Store (Strict Store Isolation)

State aplikasi **DILARANG DIGABUNGKAN** ke dalam satu file tunggal raksasa. Wajib dipisahkan ke modul-modul berikut:

```
src/stores/
├── useEditorStore.ts      # Active Tool (Select/Move/Rotate/Scale), Snapping (ON/OFF), Grid (ON/OFF)
├── useWorldStore.ts       # Array GameObject, Terrain Config, Lighting Mode
├── useSelectionStore.ts   # selectedObjectId, hoverObjectId, multiSelectIds
└── useHistoryStore.ts     # Command Stack Snapshot (Undo & Redo max 30)
```

---

## 2. Selektor Reaktif Bersih (Prevent Unnecessary Re-renders)

Saat menggunakan store di dalam komponen UI, selalu gunakan selektor spesifik:

```typescript
// ⛔ SALAH: Memicu re-render komponen setiap kali ada objek yang berpindah
const { objects, selectedId } = useWorldStore();

// ✅ BENAR: Komponen hanya re-render saat selectedId berubah
const selectedId = useSelectionStore((state) => state.selectedId);
```

---

## 3. Protokol Mutasi Undo / Redo

1. Setiap mutasi yang mengubah dunia (menambah objek, menghapus objek, mengubah posisi/rotasi/skala via gizmo):
   - Wajib mencatat snapshot kondisi sebelum atau sesudah mutasi ke `useHistoryStore`.
2. Penggeseran Transform Gizmo interaktif:
   - Gunakan `onMouseDown` untuk mencatat posisi awal.
   - Perbarui mesh Three.js secara langsung saat digeser (*drag*).
   - Catat snapshot ke `useHistoryStore` hanya pada `onMouseUp` (saat mouse dilepas).

---

## 4. Larangan Tipe `any`

- Seluruh payload state wajib memiliki interface TypeScript terdefinisi secara ketat (`strict: true`).
- Dilarang keras menulis `any`. Gunakan interface `GameObject`, `TransformMode`, `Vector3DTO`, atau generic type guard yang sesuai.
