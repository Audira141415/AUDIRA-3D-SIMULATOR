import Fastify from 'fastify';
import cors from '@fastify/cors';
import { INITIAL_ASSET_LIBRARY } from '@audira/shared';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*',
});

// In-memory project / world storage for development
let projects = [
  {
    id: 'proj-001',
    name: 'Audira Site 001 - Greenfield Hub',
    createdAt: new Date().toISOString(),
  },
];

// Health Check
fastify.get('/api/health', async () => {
  return { status: 'ok', service: 'AUDIRA 3D SIMULATOR API', timestamp: new Date() };
});

// Projects API
fastify.get('/api/projects', async () => {
  return projects;
});

fastify.post('/api/projects', async (request, reply) => {
  const body = request.body as any;
  const newProj = {
    id: `proj-${Date.now()}`,
    name: body?.name || 'New Project',
    createdAt: new Date().toISOString(),
  };
  projects.push(newProj);
  return reply.status(201).send(newProj);
});

// Asset Library API
fastify.get('/api/assets', async () => {
  return INITIAL_ASSET_LIBRARY;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 AUDIRA 3D API Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
