# .agents — AUDIRA 3D CONSTRUCTION SIMULATOR AI Agent Hub

> Central configuration, behavioral rules, 3D architectural standards, system specifications, and workflow skills for AI Agents (Antigravity, Copilot, Cursor, Windsurf) working on **AUDIRA 3D CONSTRUCTION SIMULATOR**.

---

## 0. Maintainer & Official Contact Information

### Founder & Organization
- **Author & Founder**: Agus Dwi Rianto (AUDIRA)
- **Organization**: Audira Multimedia Digital / Audira Sukses Mandiri
- **Official Production Domain**: [https://audira.my.id](https://audira.my.id)

### 📧 Official Contact
- **Official Email**: [agusdwirianto@gmail.com](mailto:agusdwirianto@gmail.com)
- **Business Partnership**: Contact the official email above.
- **General Support**: Contact the official email above.
- **Security & Vulnerability Reports**: Contact the official email above.
- **WhatsApp Hotline**: [+62 821-1200-1600](https://wa.me/6282112001600)
- **Telegram Community**: To be announced
- **Discord Server**: To be announced

### 🔐 Security & Responsible Disclosure
For business inquiries, technical support, partnership opportunities, and security vulnerability reports, please use the official email address listed above.
For security reports, include a clear description of the vulnerability, its potential impact, and reproduction steps where applicable. Do not include passwords, API keys, or other sensitive credentials.

### © Project Ownership & Attribution
AUDIRA is an ecosystem of digital products, AI-powered applications, automation systems, and technology solutions developed under the AUDIRA brand.
All product names, source code, designs, and associated intellectual property are subject to their respective ownership rights and applicable licenses.
- **Official Brand**: AUDIRA
- **Founder**: Agus Dwi Rianto
- **Organization**: Audira Multimedia Digital / Audira Sukses Mandiri
- **Website**: [https://audira.my.id](https://audira.my.id)
- **Official Email**: [agusdwirianto@gmail.com](mailto:agusdwirianto@gmail.com)

---

## 1. Directory Structure

```text
.agents/
├── README.md                      # Master directory guide & system hub
├── ARCHITECTURE.md                # 3D R3F viewport, state stores, monorepo layers
├── DEPLOYMENT.md                  # Docker Compose, production build, container orchestration
├── DESIGN.md                      # Dark Modern Studio UI, HUD overlay, 3D transform gizmo
├── PRD.md                         # Product requirements, 3D sandbox, vehicle & physics specs
├── SECURITY.md                    # WebGL memory safety, model sanitization, API defense
├── TASK_INSTRUCTION.md            # SOP lifecycle, 52 GLB model catalog, validation checklist
├── TESTING.md                     # Vitest, R3F WebGL mocking, canvas test execution
│
├── brain/                         # Deep Knowledge Repository & Long-Term Memory (LTM)
│   ├── INDEX.md                   # Brain Manifest, Memory Philosophy & Knowledge Map
│   ├── MEMORY_FUNCTION_AND_PURPOSE.md # Definitive guide on spatial & architectural memory
│   ├── SYSTEM_ARCHITECTURE.md     # WebGL/WebGPU pipeline, R3F tree, Zustand stores
│   ├── FEATURE_CATALOG.md         # Comprehensive 3D editor & simulation feature catalog
│   ├── DATABASE_AND_DATA_FLOW.md  # State loop, scene graph mutation, JSON schema, Prisma
│   ├── SECURITY_AND_GOVERNANCE.md # Multi-project isolation, memory leak disposal, safety gates
│   ├── ASSET_AND_SIMULATION_MATRIX.md # 52 GLB assets, dimensions, ground alignment, physics
│   └── UPDATE_HISTORY_AND_ROADMAP.md # Version roadmap, sprint logs, backlog
│
├── rules/                         # Enforced Contextual Rules (Always Loaded)
│   ├── brain_sync_protocol.md     # Mandatory memory reading & sync protocol
│   ├── ground_level_alignment.md  # Strict y >= 0 bounding box ground alignment rule
│   ├── threejs_r3f_performance.md # WebGL disposal, instancing, draw call budget
│   └── state_and_store_integrity.md # Zustand store isolation, history undo/redo integrity
│
└── skills/                        # On-Demand Operational Skills (Progressive Disclosure)
    ├── audira-3d-asset-pipeline/  # GLB/GLTF model import, normalization & WebP thumbnails
    │   └── SKILL.md
    ├── audira-3d-scene-debugger/  # WebGL draw calls, shader compilation, memory leak profiling
    │   └── SKILL.md
    ├── audira-world-persistence/  # JSON save/load schema, localStorage sync & versioning
    │   └── SKILL.md
    ├── audira-vehicle-physics/    # Vehicle kinematics, ground raycast, wheel rotation
    │   └── SKILL.md
    └── audira-safe-deployment/    # Pre-flight build validation, Docker compose, release runbook
        └── SKILL.md
```

---

## 2. Workspace Skills Quick Reference

| Skill Name | Path | Trigger Condition |
| :--- | :--- | :--- |
| **`audira-3d-asset-pipeline`** | [SKILL.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/skills/audira-3d-asset-pipeline/SKILL.md) | Menambah/memperbaiki model 3D GLB, normalisasi bounding box (`y >= 0`), penyesuaian skala, atau pembuatan thumbnail WebP. |
| **`audira-3d-scene-debugger`** | [SKILL.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/skills/audira-3d-scene-debugger/SKILL.md) | Mengoptimasi FPS (target 60 FPS), menganalisis draw calls, mendeteksi memory leak WebGL, atau memperbaiki lighting/shadows. |
| **`audira-world-persistence`** | [SKILL.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/skills/audira-world-persistence/SKILL.md) | Memperbaiki serialisasi JSON dunia, autosave localStorage, migrasi format data save slot, atau debug Undo/Redo stack. |
| **`audira-vehicle-physics`** | [SKILL.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/skills/audira-vehicle-physics/SKILL.md) | Mengimplementasikan atau memperbaiki kendali kendaraan, simulasi roda, physics collider, traktor, atau alat berat. |
| **`audira-safe-deployment`** | [SKILL.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/skills/audira-safe-deployment/SKILL.md) | Mempersiapkan release produksi, validasi `pnpm build`, deploy Docker Compose, dan verifikasi runtime web server. |

---

## 3. Mandatory Safety Directives (Recap)

1. **GROUND LEVEL ALIGNMENT (`y >= 0`):** Seluruh objek 3D (kendaraan, bangunan, dekorasi) WAJIB berdiri tegak di atas permukaan tanah. Dilarang membiarkan roda atau bagian bawah objek tenggelam ke dalam lantai (`y < 0`). Normalisasi bounding box `clone.position.y = -box.min.y` harus selalu diterapkan.
2. **100% 3D BROWSER WEBGL/WEBGPU:** Game ini adalah simulator 3D berbasis web (@react-three/fiber). DILARANG membuat game 2D dan DILARANG mengusulkan Unity, Godot, atau Unreal Engine.
3. **MODULAR STATE ARCHITECTURE:** Pisahkan logic ke Zustand stores modular (`useEditorStore`, `useWorldStore`, `useHistoryStore`, `useSelectionStore`). Dilarang mencampur semua state ke satu file raksasa.
4. **NO UNSANCTIONED REMOTE DEPLOYMENT:** Eksekusi deployment ke server hanya dilakukan atas perintah tertulis pengguna.
5. **CONSULT & UPDATE MEMORY.MD:** Selalu baca [MEMORY.md](file:///f:/AUDIRA-3D-SIMULATOR/MEMORY.md) dan [brain/INDEX.md](file:///f:/AUDIRA-3D-SIMULATOR/.agents/brain/INDEX.md) di awal setiap sesi, serta perbarui catatan saat task selesai.
