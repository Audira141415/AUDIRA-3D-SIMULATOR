import React, { Suspense, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { ProceduralModel } from './ProceduralModel';
import { ASSET_TARGET_SIZES, DEFAULT_CATEGORY_TARGET_SIZES } from '@audira/shared';

interface ModelRendererProps {
  type: string;
  color?: string;
  modelUrl?: string;
  category?: string;
  targetSize?: number;
}

export function getResolvedTargetSize(url?: string, category?: string, targetSize?: number): number {
  if (targetSize && targetSize > 0) return targetSize;
  if (url) {
    const filename = url.split('/').pop() || '';
    if (ASSET_TARGET_SIZES[filename]) {
      return ASSET_TARGET_SIZES[filename];
    }
  }
  if (category && DEFAULT_CATEGORY_TARGET_SIZES[category.toLowerCase()]) {
    return DEFAULT_CATEGORY_TARGET_SIZES[category.toLowerCase()];
  }
  return 5.5;
}

// Error Boundary for GLTF loading
class GLBErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('GLB Load Error, falling back to procedural model:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Sub-component to load, normalize metric scale, and clone GLTF models
const GLBModel: React.FC<{
  url: string;
  fallbackType: string;
  fallbackColor?: string;
  category?: string;
  targetSize?: number;
}> = ({ url, fallbackType, fallbackColor, category, targetSize }) => {
  const gltf = useGLTF(url);

  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    const clone = SkeletonUtils.clone(gltf.scene);

    // Compute raw unscaled bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const isPrefabMap = category === 'peta' || url.toLowerCase().includes('map');
    const isVehicle = category === 'kendaraan' || category === 'tractor' || category === 'pesawat';
    const isCharacter =
      category === 'karakter' ||
      (category === 'dekorasi' &&
        (url.includes('spider') || url.includes('iron') || url.includes('hulk') || url.includes('knight')));
    const isRoad = category === 'road' || url.includes('road') || url.includes('ramp');

    // Target size in real-world metric meters
    const target = getResolvedTargetSize(url, category, targetSize);

    // Determine primary dimension for normalization:
    // Vehicles, tractors, roads: footprint max(size.x, size.z)
    // Characters: height size.y
    // General (trees, ramps, maps, decorations): max(size.x, size.y, size.z)
    const primaryDim = (
      isVehicle || isRoad
        ? Math.max(size.x, size.z)
        : isCharacter
          ? size.y
          : Math.max(size.x, size.y, size.z)
    ) || 1;

    const normScale = target / primaryDim;
    clone.scale.setScalar(normScale);

    // Center horizontally on pivot
    clone.position.x = -center.x * normScale;
    clone.position.z = -center.z * normScale;

    // Ground Level Alignment: Titik terbawah model tepat berada di y = 0
    // Kecualikan prefab map yang memiliki elemen air / bawah tanah
    if (!isPrefabMap && Number.isFinite(box.min.y)) {
      clone.position.y = -box.min.y * normScale;
    }

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [gltf, url, category, targetSize]);

  if (!clonedScene) {
    return <ProceduralModel type={fallbackType} color={fallbackColor} />;
  }

  return <primitive object={clonedScene} />;
};

export const ModelRenderer: React.FC<ModelRendererProps> = ({
  type,
  color,
  modelUrl,
  category,
  targetSize,
}) => {
  if (modelUrl) {
    return (
      <GLBErrorBoundary fallback={<ProceduralModel type={type} color={color} />}>
        <Suspense fallback={<ProceduralModel type={type} color={color} />}>
          <GLBModel
            url={modelUrl}
            fallbackType={type}
            fallbackColor={color}
            category={category}
            targetSize={targetSize}
          />
        </Suspense>
      </GLBErrorBoundary>
    );
  }

  return <ProceduralModel type={type} color={color} />;
};
