import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMultiLayerRecordStore, FrameData } from '../../stores/useMultiLayerRecordStore';
import { ModelRenderer } from '../objects/ModelRenderer';

export const MultiLayerGhostEngine: React.FC = () => {
  const isPlaying = useMultiLayerRecordStore((s) => s.isPlaying);
  const isPaused = useMultiLayerRecordStore((s) => s.isPaused);
  const isRecording = useMultiLayerRecordStore((s) => s.isRecording);
  const recordingLayerId = useMultiLayerRecordStore((s) => s.recordingLayerId);
  const layers = useMultiLayerRecordStore((s) => s.layers);
  const playbackTime = useMultiLayerRecordStore((s) => s.playbackTime);
  const advancePlayback = useMultiLayerRecordStore((s) => s.advancePlayback);
  const cameraFollow = useMultiLayerRecordStore((s) => s.cameraFollow);
  const focusedLayerId = useMultiLayerRecordStore((s) => s.focusedLayerId);

  const { camera } = useThree();

  // Advance clock every frame
    // Advance clock and handle smooth camera follow every frame
  useFrame((_, delta) => {
    if (isPlaying && !isPaused) {
      advancePlayback(delta);
    }

    // Camera follow focused ghost vehicle during playback
    if (cameraFollow && isPlaying && !isRecording && layers.length > 0) {
      const activeLayer = layers.find((l) => l.id === focusedLayerId) || layers[0];
      if (activeLayer && activeLayer.frames.length > 0 && !activeLayer.muted) {
        const f = getInterpolatedFrame(activeLayer.frames, playbackTime);
        if (f) {
          const rotRad = (f.rotY * Math.PI) / 180;
          const camDist = 13;
          const camHeight = 5.5;
          const targetCam = new THREE.Vector3(
            f.x - Math.sin(rotRad) * camDist,
            f.y + camHeight,
            f.z - Math.cos(rotRad) * camDist
          );
          camera.position.lerp(targetCam, Math.min(1, delta * 3.5));
          camera.lookAt(f.x, f.y + 1.2, f.z);
        }
      }
    }
  });

  // Calculate interpolated frame for a given layer
  const getInterpolatedFrame = (frames: FrameData[], time: number): FrameData | null => {
    if (!frames || frames.length === 0) return null;
    if (frames.length === 1) return frames[0];
    if (time <= frames[0].time) return frames[0];
    if (time >= frames[frames.length - 1].time) return frames[frames.length - 1];

    // Binary search or linear search for adjacent frames
    let idx = 0;
    while (idx < frames.length - 1 && frames[idx + 1].time < time) {
      idx++;
    }

    const f0 = frames[idx];
    const f1 = frames[idx + 1];
    const range = f1.time - f0.time;
    const alpha = range > 0 ? (time - f0.time) / range : 0;

    return {
      time,
      x: THREE.MathUtils.lerp(f0.x, f1.x, alpha),
      y: Math.max(0, THREE.MathUtils.lerp(f0.y, f1.y, alpha)),
      z: THREE.MathUtils.lerp(f0.z, f1.z, alpha),
      rotY: THREE.MathUtils.lerp(f0.rotY, f1.rotY, alpha),
      speed: THREE.MathUtils.lerp(f0.speed, f1.speed, alpha),
      brake: alpha > 0.5 ? f1.brake : f0.brake,
      lights: f0.lights,
    };
  };

  if (!isPlaying && !isRecording) return null;

  return (
    <group>
      {layers.map((layer) => {
        // If this layer is currently being recorded live, don't render its ghost
        if (isRecording && layer.id === recordingLayerId) return null;
        if (layer.muted) return null;
        if (layer.frames.length === 0) return null;

        const currentFrame = getInterpolatedFrame(layer.frames, playbackTime);
        if (!currentFrame) return null;

        const isFocused = focusedLayerId === layer.id;

        return (
          <group
            key={layer.id}
            position={[currentFrame.x, currentFrame.y, currentFrame.z]}
            rotation={[0, (currentFrame.rotY * Math.PI) / 180, 0]}
          >
            {/* 3D Model Renderer with ground level alignment */}
            <ModelRenderer
              type="car-sport"
              color={layer.color}
              modelUrl={layer.modelUrl}
              category="kendaraan"
              targetSize={5.5}
            />

            {/* Subtle Ghost Neon Ring on Ground */}
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.35, 32]} />
              <meshBasicMaterial
                color={layer.color}
                side={THREE.DoubleSide}
                transparent
                opacity={isFocused ? 0.85 : 0.45}
              />
            </mesh>

            {/* Brake Lights when braking */}
            {currentFrame.brake && (
              <pointLight position={[0, 0.8, -2.2]} color="#ff0044" intensity={2.5} distance={6} />
            )}
          </group>
        );
      })}
    </group>
  );
};

