import { z } from 'zod';

export const Vector3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const AssetCategorySchema = z.enum([
  'vehicles',
  'buildings',
  'roads',
  'nature',
  'decoration',
  'infrastructure',
  'playground',
]);

export const GameObjectSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  category: AssetCategorySchema,
  assetId: z.string(),
  position: Vector3DSchema,
  rotation: Vector3DSchema,
  scale: Vector3DSchema,
  visible: z.boolean(),
  locked: z.boolean(),
  castShadow: z.boolean().optional(),
  receiveShadow: z.boolean().optional(),
  color: z.string().optional(),
});

export const WorldConfigSchema = z.object({
  name: z.string().min(1),
  size: z.number().positive(),
  gridSize: z.number().positive(),
  snapToGrid: z.boolean(),
  showGrid: z.boolean(),
  showShadows: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const WorldSaveDataSchema = z.object({
  version: z.number(),
  world: WorldConfigSchema,
  objects: z.array(GameObjectSchema),
});
