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

// AI 3D Coder & Co-Pilot (Ollama Qwen3.5-4B-3D-Coder Integration)
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_3D_MODEL = 'hf.co/ccore/Qwen3.5-4B-3D-Coder:Q4_K_M';

fastify.get('/api/ai/status', async () => {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`);
    if (!res.ok) throw new Error(`Ollama returned status ${res.status}`);
    const data = (await res.json()) as { models?: { name: string }[] };
    const models = data.models?.map((m) => m.name) || [];
    const has3dModel = models.some((m) => m.includes('Qwen3.5-4B-3D-Coder') || m.includes('3D-Coder'));
    return {
      connected: true,
      activeModel: DEFAULT_3D_MODEL,
      modelReady: has3dModel,
      availableModels: models,
    };
  } catch (err: any) {
    return {
      connected: false,
      activeModel: DEFAULT_3D_MODEL,
      modelReady: false,
      error: err.message,
    };
  }
});

fastify.post('/api/ai/generate', async (request, reply) => {
  const { prompt, systemPrompt, model = DEFAULT_3D_MODEL } = (request.body as any) || {};
  if (!prompt) {
    return reply.status(400).send({ error: 'Prompt wajib diisi.' });
  }

  const sys =
    systemPrompt ||
    'You are the expert 3D AI Assistant for AUDIRA 3D SIMULATOR. You specialize in 3D WebGL, Three.js coordinates, camera choreography, and heavy construction equipment simulation. Reply concisely in Indonesian.';

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${sys}\n\nUser: ${prompt}`,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama request failed with status ${res.status}`);
    }

    const data = (await res.json()) as { response: string };
    const cleanResponse = data.response.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    return {
      success: true,
      model,
      response: cleanResponse,
    };
  } catch (err: any) {
    fastify.log.error(err);
    return reply.status(500).send({
      success: false,
      error: err.message || 'Gagal memanggil Ollama 3D Coder.',
    });
  }
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
