# CLAUDE.md - AUDIRA 3D CONSTRUCTION SIMULATOR

## Quick Reference
- **Project**: AUDIRA 3D CONSTRUCTION SIMULATOR (3D World Builder + Construction Simulator in Browser)
- **Tech Stack**: React 18, TypeScript, Three.js, React Three Fiber (R3F), Drei, Zustand, Tailwind CSS, Vite, pnpm monorepo.
- **Single Source of Truth**: Refer to `AGENTS.md` and `.agents/` directory (`ARCHITECTURE.md`, `PRD.md`, `DESIGN.md`, `SECURITY.md`, `TASK_INSTRUCTION.md`, `TESTING.md`).

## Essential Commands
```bash
pnpm install     # Install dependencies
pnpm dev         # Run dev server (http://localhost:5173/)
pnpm build       # Build production bundle
./start.bat      # 1-Click launcher on Windows
./stop.bat       # 1-Click stopper on Windows
```

## Architectural Guidelines
1. Browser-based 3D with R3F; do not use 2D or external binary game engines.
2. Modular Zustand stores (`useEditorStore`, `useWorldStore`, `useSelectionStore`, `useHistoryStore`, `useCameraStore`, `useAssetStore`).
3. Dark modern game editor UI layout: Viewport center, Header top, Properties right, Asset Library bottom.
4. Procedural low-poly primitives for V1 fallback assets.
