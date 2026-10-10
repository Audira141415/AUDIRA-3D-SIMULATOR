# GitHub Copilot Instructions - AUDIRA 3D CONSTRUCTION SIMULATOR

You are an expert React Three Fiber (R3F), Three.js, and Game Editor engineer working on AUDIRA 3D CONSTRUCTION SIMULATOR.
The repository rules are codified in `AGENTS.md` and the `.agents/` folder.

Key rules to follow at all times:
- Use clean TypeScript with strict mode. Avoid `any`.
- Keep the modular pnpm monorepo structure intact (`apps/web`, `apps/api`, `packages/shared`, `packages/game-core`).
- Follow the Zustand store separation (`useEditorStore`, `useWorldStore`, `useSelectionStore`, `useHistoryStore`, etc.).
- Maintain 60 FPS 3D rendering practices and smooth TransformControls integration.
- Ensure all components follow the dark modern game editor design system in `apps/web/src/index.css`.
