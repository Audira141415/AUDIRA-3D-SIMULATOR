import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCameraStore } from '../../stores/useCameraStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useEditorStore } from '../../stores/useEditorStore';

const PRESET_VECTORS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  isometric: { pos: [65, 55, 65], target: [0, 0, 0] },
  top: { pos: [0, 160, 0.1], target: [0, 0, 0] },
  front: { pos: [0, 30, 80], target: [0, 0, 0] },
  side: { pos: [80, 30, 0], target: [0, 0, 0] },
  free: { pos: [45, 35, 45], target: [0, 0, 0] },
};

export const CameraController: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const preset = useCameraStore((s) => s.preset);
  const focusTarget = useCameraStore((s) => s.focusTarget);
  const setFocusTarget = useCameraStore((s) => s.setFocusTarget);

  const selectedObjectId = useSelectionStore((s) => s.selectedObjectId);
  const objects = useWorldStore((s) => s.objects);
  const isPlaying = useEditorStore((s) => s.isPlaying);

  const zoomAction = useCameraStore((s) => s.zoomAction);
  const resetTrigger = useCameraStore((s) => s.resetTrigger);
  const panDelta = useCameraStore((s) => s.panDelta);

  // Target transition vectors for smooth camera moves
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  const lastHeadingRef = useRef<number>(0);
  const prevPresetRef = useRef<string>(preset);

  // Cancel any ongoing transition as soon as the user starts interacting manually (scroll wheel, mouse drag, touch)
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleUserInteractionStart = () => {
      targetCamPos.current = null;
      targetLookAt.current = null;
    };

    controls.addEventListener('start', handleUserInteractionStart);
    return () => {
      controls.removeEventListener('start', handleUserInteractionStart);
    };
  }, []);

  // Apply preset changes only when preset explicitly changes (not on initial mount)
  useEffect(() => {
    if (prevPresetRef.current !== preset) {
      prevPresetRef.current = preset;
      const targetConfig = PRESET_VECTORS[preset] || PRESET_VECTORS.isometric;
      targetCamPos.current = new THREE.Vector3(...targetConfig.pos);
      targetLookAt.current = new THREE.Vector3(...targetConfig.target);
    }
  }, [preset]);

  // Handle zoom in / out button action triggers using OrbitControls native dolly
  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;
    // Cancel any active lerp transition so zoom doesn't get pulled back
    targetCamPos.current = null;
    targetLookAt.current = null;

    const controls = controlsRef.current;
    if (zoomAction.type === 'in') {
      controls.dollyIn(1.25);
    } else {
      controls.dollyOut(1.25);
    }
    controls.update();
  }, [zoomAction]);

  // Handle pan delta triggers
  useEffect(() => {
    if (!panDelta || !controlsRef.current) return;
    targetCamPos.current = null;
    targetLookAt.current = null;

    controlsRef.current.target.x += panDelta.dx;
    controlsRef.current.target.z += panDelta.dz;
    camera.position.x += panDelta.dx;
    camera.position.z += panDelta.dz;
    controlsRef.current.update();
  }, [panDelta, camera]);

  // Handle reset camera view trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      targetCamPos.current = new THREE.Vector3(65, 55, 65);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
    }
  }, [resetTrigger]);

  // Handle focus target (e.g. from 'F' shortcut or context menu)
  useEffect(() => {
    if (focusTarget && controlsRef.current) {
      targetLookAt.current = new THREE.Vector3(focusTarget.x, focusTarget.y, focusTarget.z);
      targetCamPos.current = new THREE.Vector3(focusTarget.x + 15, focusTarget.y + 12, focusTarget.z + 15);
      setFocusTarget(null);
    }
  }, [focusTarget, setFocusTarget]);

  // Keyboard shortcut 'F' to focus selected object
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'f' && selectedObjectId) {
        const obj = objects.find((o) => o.id === selectedObjectId);
        if (obj) {
          setFocusTarget(obj.position);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, objects, setFocusTarget]);

  // When exiting simulation, smoothly re-sync OrbitControls target to look direction so camera doesn't jump
  const prevIsPlaying = useRef(isPlaying);
  useEffect(() => {
    if (prevIsPlaying.current && !isPlaying && controlsRef.current) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const newTarget = camera.position.clone().add(dir.multiplyScalar(20));
      newTarget.y = Math.max(0, newTarget.y);
      controlsRef.current.target.copy(newTarget);
      controlsRef.current.update();
    }
    prevIsPlaying.current = isPlaying;
  }, [isPlaying, camera]);

  useFrame(() => {
    // Sync camera azimuthal heading for the HUD compass
    if (controlsRef.current) {
      const heading = controlsRef.current.getAzimuthalAngle();
      if (Math.abs(heading - lastHeadingRef.current) > 0.02) {
        lastHeadingRef.current = heading;
        useCameraStore.getState().setCameraHeading(heading);
      }
    }

    // Smoothly animate towards target preset or focus target if active
    if (targetCamPos.current && targetLookAt.current && controlsRef.current) {
      camera.position.lerp(targetCamPos.current, 0.12);
      controlsRef.current.target.lerp(targetLookAt.current, 0.12);

      const distCam = camera.position.distanceTo(targetCamPos.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

      if (distCam < 0.4 && distTarget < 0.2) {
        camera.position.copy(targetCamPos.current);
        controlsRef.current.target.copy(targetLookAt.current);
        targetCamPos.current = null;
        targetLookAt.current = null;
        controlsRef.current.update();
      }
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      makeDefault
      enabled={!isPlaying}
      enableDamping={true}
      dampingFactor={0.08}
      screenSpacePanning={true}
      panSpeed={1.2}
      rotateSpeed={0.8}
      zoomSpeed={1.2}
      maxPolarAngle={Math.PI / 2 - 0.02} // Don't go below ground
      minDistance={1.0} // Allow close-up inspection
      maxDistance={1500} // Allow viewing full expansive world
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
};
