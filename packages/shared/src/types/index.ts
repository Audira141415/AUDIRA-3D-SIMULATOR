export type AssetCategory =
  | 'peta'
  | 'kendaraan'
  | 'pesawat'
  | 'tractor'
  | 'dekorasi'
  | 'objek'
  | 'lanskap'
  | 'custom'
  | 'vehicles'
  | 'buildings'
  | 'roads'
  | 'nature'
  | 'decoration'
  | 'infrastructure'
  | 'playground';

export type TransformMode = 'translate' | 'rotate' | 'scale' | 'select';

export type CameraPreset = 'isometric' | 'top' | 'front' | 'side' | 'free';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface GameObject {
  id: string;
  type: string;
  name: string;
  category: AssetCategory;
  assetId: string;
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
  visible: boolean;
  locked: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  color?: string;
  modelUrl?: string;
  thumbnailUrl?: string;
  subCategory?: string;
  targetSize?: number;
}

export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  subCategory?: string;
  type: string;
  iconName?: string;
  modelUrl?: string;
  defaultScale?: Vector3D;
  description?: string;
  color?: string;
  thumbnailUrl?: string;
  isCustom?: boolean;
  targetSize?: number;
}

export interface WorldConfig {
  name: string;
  size: number;
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  showShadows: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorldSaveData {
  version: number | string;
  name?: string;
  config?: WorldConfig;
  world: {
    name: string;
    size: number;
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    showShadows: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  objects: GameObject[];
}
