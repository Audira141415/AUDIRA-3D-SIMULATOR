import { useEffect } from 'react';
import { useEditorStore } from '../stores/useEditorStore';
import { useWorldStore } from '../stores/useWorldStore';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useCameraStore } from '../stores/useCameraStore';
import { soundEngine } from '../features/audio/soundEngine';

export const useKeyboardShortcuts = () => {
  const setTransformMode = useEditorStore((s) => s.setTransformMode);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const toggleGridSnap = useEditorStore((s) => s.toggleGridSnap);
  const setPlacingAsset = useEditorStore((s) => s.setPlacingAsset);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const selectObject = useSelectionStore((s) => s.selectObject);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const objects = useWorldStore((s) => s.objects);
  const updateObject = useWorldStore((s) => s.updateObject);
  const deleteObject = useWorldStore((s) => s.deleteObject);
  const duplicateObject = useWorldStore((s) => s.duplicateObject);
  const cutObject = useWorldStore((s) => s.cutObject);
  const copyObject = useWorldStore((s) => s.copyObject);
  const pasteObject = useWorldStore((s) => s.pasteObject);
  const dropToGround = useWorldStore((s) => s.dropToGround);
  const nudgeObject = useWorldStore((s) => s.nudgeObject);
  const undo = useWorldStore((s) => s.undo);
  const redo = useWorldStore((s) => s.redo);

  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);
  const panView = useCameraStore((s) => s.panView);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo / Redo / Cut / Copy / Paste / Duplicate
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          undo();
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
          return;
        }
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          if (selectedObjectId) {
            const copy = duplicateObject(selectedObjectId);
            if (copy) selectObject(copy.id);
          }
          return;
        }
        if (e.key.toLowerCase() === 'x') {
          e.preventDefault();
          if (selectedObjectId) {
            cutObject(selectedObjectId);
            clearSelection();
          }
          return;
        }
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          if (selectedObjectId) {
            copyObject(selectedObjectId);
          }
          return;
        }
        if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          const pasted = pasteObject();
          if (pasted) selectObject(pasted.id);
          return;
        }
      }

      // Single keys
      switch (e.key.toLowerCase()) {
        case 'q':
          setTransformMode('select');
          break;
        case 'w':
          setTransformMode('translate');
          break;
        case 'e':
          setTransformMode('rotate');
          break;
        case 'r':
          setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          if (selectedObjectId) {
            deleteObject(selectedObjectId);
            clearSelection();
          }
          break;
        case 'g':
          toggleGrid();
          break;
        case 's':
          toggleGridSnap();
          break;
        case 'f':
          if (selectedObjectId) {
            const obj = objects.find((o) => o.id === selectedObjectId);
            if (obj) setFocusTarget(obj.position);
          }
          break;
        case 'escape':
          if (useEditorStore.getState().isPlaying) {
            soundEngine.stopEngine();
            useEditorStore.getState().setIsPlaying(false);
            break;
          }
          setPlacingAsset(null);
          clearSelection();
          break;
        case '+':
        case '=':
          if (selectedObjectId) {
            e.preventDefault();
            const targetObj = objects.find((o) => o.id === selectedObjectId);
            if (targetObj) {
              const sc = targetObj.scale || { x: 1, y: 1, z: 1 };
              updateObject(targetObj.id, {
                scale: {
                  x: Number((sc.x * 1.2).toFixed(2)),
                  y: Number((sc.y * 1.2).toFixed(2)),
                  z: Number((sc.z * 1.2).toFixed(2)),
                }
              }, true);
            }
          }
          break;
        case '-':
        case '_':
          if (selectedObjectId) {
            e.preventDefault();
            const targetObj = objects.find((o) => o.id === selectedObjectId);
            if (targetObj) {
              const sc = targetObj.scale || { x: 1, y: 1, z: 1 };
              updateObject(targetObj.id, {
                scale: {
                  x: Math.max(0.1, Number((sc.x * 0.8).toFixed(2))),
                  y: Math.max(0.1, Number((sc.y * 0.8).toFixed(2))),
                  z: Math.max(0.1, Number((sc.z * 0.8).toFixed(2))),
                }
              }, true);
            }
          }
          break;
        case 'arrowup':
          e.preventDefault();
          if (selectedObjectId) {
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, 0, -step);
          } else {
            const step = e.shiftKey ? 8 : 3;
            panView(0, -step);
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (selectedObjectId) {
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, 0, step);
          } else {
            const step = e.shiftKey ? 8 : 3;
            panView(0, step);
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          if (selectedObjectId) {
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, -step, 0);
          } else {
            const step = e.shiftKey ? 8 : 3;
            panView(-step, 0);
          }
          break;
        case 'arrowright':
          e.preventDefault();
          if (selectedObjectId) {
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, step, 0);
          } else {
            const step = e.shiftKey ? 8 : 3;
            panView(step, 0);
          }
          break;
        case 'pageup':
          if (selectedObjectId) {
            e.preventDefault();
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, 0, 0, step);
          }
          break;
        case 'pagedown':
          if (selectedObjectId) {
            e.preventDefault();
            const step = e.shiftKey ? 5 : 1;
            nudgeObject(selectedObjectId, 0, 0, -step);
          }
          break;
        case 'end':
          if (selectedObjectId) {
            e.preventDefault();
            dropToGround(selectedObjectId);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setTransformMode,
    toggleGrid,
    toggleGridSnap,
    setPlacingAsset,
    selectedObjectId,
    selectObject,
    clearSelection,
    objects,
    updateObject,
    deleteObject,
    duplicateObject,
    cutObject,
    copyObject,
    pasteObject,
    dropToGround,
    nudgeObject,
    undo,
    redo,
    setFocusTarget,
  ]);
};

