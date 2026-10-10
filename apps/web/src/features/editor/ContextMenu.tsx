import React, { useState, useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  CopyPlus,
  Trash2,
  Move,
  RotateCw,
  Maximize2,
  Crosshair,
  ArrowDownToLine,
  Grid,
  Magnet,
  RotateCcw,
  Camera,
} from 'lucide-react';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useCameraStore } from '../../stores/useCameraStore';
import { soundEngine } from '../../features/audio/soundEngine';

interface ContextMenuPosition {
  x: number;
  y: number;
}

export const ContextMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const objects = useWorldStore((s) => s.objects);
  const clipboard = useWorldStore((s) => s.clipboard);
  const cutObject = useWorldStore((s) => s.cutObject);
  const copyObject = useWorldStore((s) => s.copyObject);
  const pasteObject = useWorldStore((s) => s.pasteObject);
  const duplicateObject = useWorldStore((s) => s.duplicateObject);
  const deleteObject = useWorldStore((s) => s.deleteObject);
  const dropToGround = useWorldStore((s) => s.dropToGround);

  const setTransformMode = useEditorStore((s) => s.setTransformMode);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const toggleGridSnap = useEditorStore((s) => s.toggleGridSnap);

  const setPreset = useCameraStore((s) => s.setPreset);
  const resetView = useCameraStore((s) => s.resetView);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  const selectedObj = objects.find((o) => o.id === selectedObjectId);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Ignore during driving simulation
      if (useEditorStore.getState().isPlaying) return;

      // If right click was inside an input or form, let default browser menu work
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check if click was in main viewport area
      const target = e.target as HTMLElement;
      if (!target.closest('canvas') && !target.closest('.cursor-crosshair')) {
        return;
      }

      e.preventDefault();

      // Ensure menu doesn't overflow screen
      const menuWidth = 220;
      const menuHeight = 320;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setPos({ x, y });
      setIsOpen(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('pointerdown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('pointerdown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    soundEngine.playUIClick();
    callback();
    setIsOpen(false);
  };

  return (
    <div
      ref={menuRef}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      className="fixed z-50 w-52 bg-[#0c121d]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] py-1.5 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100 font-sans"
    >
      {selectedObj ? (
        <>
          {/* Object Header Info */}
          <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
            <span className="truncate max-w-[130px]">{selectedObj.name}</span>
            <span className="text-[9px] font-mono text-slate-400">OBJ</span>
          </div>

          {/* Transform Modes */}
          <button
            onClick={() => handleAction(() => setTransformMode('translate'))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-cyan-400" /> Geser (Move)
            </span>
            <span className="text-[10px] font-mono text-slate-500">W</span>
          </button>

          <button
            onClick={() => handleAction(() => setTransformMode('rotate'))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Putar (Rotate)
            </span>
            <span className="text-[10px] font-mono text-slate-500">E</span>
          </button>

          <button
            onClick={() => handleAction(() => setTransformMode('scale'))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Skala (Scale)
            </span>
            <span className="text-[10px] font-mono text-slate-500">R</span>
          </button>

          <div className="h-[1px] bg-white/10 my-1 mx-2" />

          {/* Cut */}
          <button
            onClick={() =>
              handleAction(() => {
                cutObject(selectedObj.id);
                clearSelection();
              })
            }
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5 text-cyan-400" /> Potong (Cut)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Ctrl+X</span>
          </button>

          {/* Copy */}
          <button
            onClick={() => handleAction(() => copyObject(selectedObj.id))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 text-cyan-400" /> Salin (Copy)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Ctrl+C</span>
          </button>

          {/* Paste */}
          <button
            onClick={() =>
              handleAction(() => {
                const pasted = pasteObject();
                if (pasted) selectObject(pasted.id);
              })
            }
            disabled={!clipboard}
            className={`w-full px-3 py-1.5 flex items-center justify-between transition-colors ${
              clipboard
                ? 'hover:bg-cyan-500/20 hover:text-cyan-300'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clipboard className="w-3.5 h-3.5 text-cyan-400" /> Tempel (Paste)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Ctrl+V</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={() =>
              handleAction(() => {
                const copy = duplicateObject(selectedObj.id);
                if (copy) selectObject(copy.id);
              })
            }
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CopyPlus className="w-3.5 h-3.5 text-cyan-400" /> Duplikat
            </span>
            <span className="text-[10px] font-mono text-slate-500">Ctrl+D</span>
          </button>

          {/* Drop to Ground */}
          <button
            onClick={() => handleAction(() => dropToGround(selectedObj.id))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-400" /> Ke Lantai (Y=0)
            </span>
            <span className="text-[10px] font-mono text-slate-500">End</span>
          </button>

          {/* Focus Target */}
          <button
            onClick={() => handleAction(() => setFocusTarget(selectedObj.position))}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Fokus Kamera
            </span>
            <span className="text-[10px] font-mono text-slate-500">F</span>
          </button>

          <div className="h-[1px] bg-white/10 my-1 mx-2" />

          {/* Delete */}
          <button
            onClick={() =>
              handleAction(() => {
                deleteObject(selectedObj.id);
                clearSelection();
              })
            }
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Hapus (Delete)
            </span>
            <span className="text-[10px] font-mono text-rose-400/60">Del</span>
          </button>
        </>
      ) : (
        <>
          {/* Empty Space Context Menu */}
          <div className="px-3 py-1.5 border-b border-white/10 mb-1 text-[11px] text-slate-400 font-semibold">
            Menu Viewport
          </div>

          {/* Paste in Place if clipboard exists */}
          {clipboard && (
            <>
              <button
                onClick={() =>
                  handleAction(() => {
                    const pasted = pasteObject();
                    if (pasted) selectObject(pasted.id);
                  })
                }
                className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Clipboard className="w-3.5 h-3.5 text-cyan-400" /> Tempel {clipboard.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500">Ctrl+V</span>
              </button>
              <div className="h-[1px] bg-white/10 my-1 mx-2" />
            </>
          )}

          {/* Camera Angles */}
          <button
            onClick={() => handleAction(() => setPreset('isometric'))}
            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" /> Kamera Isometrik
          </button>

          <button
            onClick={() => handleAction(() => setPreset('top'))}
            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" /> Tampak Atas (Top)
          </button>

          <button
            onClick={() => handleAction(() => setPreset('front'))}
            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" /> Tampak Depan (Front)
          </button>

          <button
            onClick={() => handleAction(() => resetView())}
            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Posisi Kamera
          </button>

          <div className="h-[1px] bg-white/10 my-1 mx-2" />

          {/* Environment Toggles */}
          <button
            onClick={() => handleAction(() => toggleGrid())}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Grid className="w-3.5 h-3.5 text-slate-400" /> Grid: {showGrid ? 'ON' : 'OFF'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">G</span>
          </button>

          <button
            onClick={() => handleAction(() => toggleGridSnap())}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Magnet className="w-3.5 h-3.5 text-slate-400" /> Snap Grid: {gridSnap ? 'ON' : 'OFF'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">S</span>
          </button>
        </>
      )}
    </div>
  );
};
