# BRAIN & MEMORY SYNCHRONIZATION PROTOCOL
> **Rule ID**: `BRAIN-SYNC-01`  
> **Target**: Seluruh AI Agent, Pair Programmer, dan Pengembang di AUDIRA 3D CONSTRUCTION SIMULATOR.  
> **Level**: MANDATORY (Wajib Dipatuhi Tanpa Pengecualian).

---

## 1. Tujuan Kebijakan

Dokumen [`.agents/brain/`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain) dan [`MEMORY.md`](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md) merupakan **Single Source of Truth (SSOT)** dan **otak memori jangka panjang (Long-Term Memory / LTM)** proyek AUDIRA 3D CONSTRUCTION SIMULATOR.

Kebijakan ini dibuat agar seluruh AI Assistant:
1. **Memahami konteks spasial dan arsitektural 3D**: Mencegah amnesia pivot model, duplikasi hook/store, dan regresi performa WebGL.
2. **Menjaga aktualitas memory**: Memastikan dokumentasi brain tidak pernah usang (*stale*).

---

## 2. Aturan Siklus Hidup: "READ FIRST, ACT SECOND, UPDATE ON FINISH"

Setiap kali Anda (AI Agent) berinteraksi dengan proyek ini:

### A. Awal Sesi (Wajib Membaca)
1. Baca [`MEMORY.md`](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md) dan [`.agents/brain/INDEX.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/INDEX.md).
2. Pahami status sprint terkini, daftar 52 asset GLB aktif, dan aturan ground level sebelum menulis atau memodifikasi kode.

### B. Selama Eksekusi (Wajib Mematuhi)
1. Periksa [`.agents/brain/FEATURE_CATALOG.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/FEATURE_CATALOG.md) sebelum membuat file/fungsi baru untuk mencegah redundansi kode.
2. Patuhi aturan normalisasi bounding box `clone.position.y = -box.min.y` (`y >= 0`) di [`.agents/rules/ground_level_alignment.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/rules/ground_level_alignment.md).
3. Patuhi batas pembersihan memori WebGL di [`.agents/rules/threejs_r3f_performance.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/rules/threejs_r3f_performance.md).

### C. Akhir Sesi / Milestone Selesai (Wajib Memperbarui)
1. **Jika Menambah / Mengubah Asset GLB**: Daftarkan di [`ASSET_AND_SIMULATION_MATRIX.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/ASSET_AND_SIMULATION_MATRIX.md) dan perbarui katalog di [`TASK_INSTRUCTION.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/TASK_INSTRUCTION.md).
2. **Jika Menambah / Mengubah Fitur Editor**: Catat di [`FEATURE_CATALOG.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/FEATURE_CATALOG.md) dan perbarui task board di [`MEMORY.md`](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md).
3. **Jika Menemukan / Memperbaiki Bug Kritis**: Tambahkan catatan ke seksi *Gotchas, Pitfalls & Solutions* di [`MEMORY.md`](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md).
4. **Catat Rilis**: Tambahkan ringkasan ke [`UPDATE_HISTORY_AND_ROADMAP.md`](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/UPDATE_HISTORY_AND_ROADMAP.md).
