import { Client, handle_file } from '@gradio/client';

export interface Cloud3DResult {
  blob: Blob;
  url: string;
  engine: 'TRELLIS' | 'TripoSR';
}

function cleanToken(token?: string) {
  const t = token?.trim();
  return t && t.startsWith('hf_') ? t : undefined;
}

export async function generateFullAI3D(
  imageFile: File | Blob,
  onProgress: (status: string) => void,
  hfToken?: string
): Promise<Cloud3DResult> {
  const token = cleanToken(hfToken);
  const options = token ? { hf_token: token } : {};

  // Try TRELLIS first
  try {
    onProgress('Menghubungkan ke server TRELLIS AI (Free GPU)...');
    const client = await Client.connect('trellis-community/TRELLIS', options as any);

    onProgress('Memproses segmentasi gambar...');
    const prepResult = await client.predict('/preprocess_image', {
      image: handle_file(imageFile),
    } as any);

    const prepImage = (prepResult.data as any)[0];

    onProgress('AI sedang membentuk geometri 3D & tekstur...');
    const result = await client.predict('/generate_and_extract_glb', {
      image: prepImage,
      multiimages: [],
      seed: Math.floor(Math.random() * 100000),
      ss_guidance_strength: 7.5,
      ss_sampling_steps: 12,
      slat_guidance_strength: 3,
      slat_sampling_steps: 12,
      multiimage_algo: 'stochastic',
      mesh_simplify: 0.95,
      texture_size: 1024,
    } as any);

    const glbUrlObj = (result.data as any)[1] || (result.data as any)[2];
    const rawUrl = glbUrlObj?.url;
    if (!rawUrl) throw new Error('TRELLIS tidak mengembalikan berkas GLB.');

    onProgress('Mengunduh model 3D hasil AI...');
    const response = await fetch(rawUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    const blob = await response.blob();

    return {
      blob,
      url: URL.createObjectURL(blob),
      engine: 'TRELLIS',
    };
  } catch (err: any) {
    console.warn('TRELLIS attempt failed, trying TripoSR fallback:', err);
    onProgress('TRELLIS sibuk, mencoba mesin TripoSR...');
  }

  // Try TripoSR fallback
  try {
    const client = await Client.connect('VAST-AI/TripoSG', options as any);
    onProgress('TripoSR: Menjalankan segmentasi gambar...');

    const seg = await client.predict('/run_segmentation', {
      image: handle_file(imageFile),
    } as any);
    const segImg = (seg.data as any)[0];

    onProgress('TripoSR: AI membangun volume 3D...');
    const res3d = await client.predict('/image_to_3d', {
      image: segImg,
      seed: 0,
      num_inference_steps: 50,
      guidance_scale: 7,
      simplify: true,
      target_face_num: 80000,
    } as any);

    let meshPath = (res3d.data as any)[0];

    try {
      onProgress('TripoSR: AI membakar warna tekstur...');
      const texRes = await client.predict('/run_texture', {
        image: segImg,
        mesh_path: meshPath,
        seed: 0,
      } as any);
      if ((texRes.data as any)?.[0]) {
        meshPath = (texRes.data as any)[0];
      }
    } catch {}

    const rawUrl = meshPath?.url;
    if (!rawUrl) throw new Error('TripoSR tidak mengembalikan berkas GLB.');

    onProgress('Mengunduh model 3D...');
    const response = await fetch(rawUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    const blob = await response.blob();

    return {
      blob,
      url: URL.createObjectURL(blob),
      engine: 'TripoSR',
    };
  } catch (err: any) {
    console.error('All Cloud AI options failed:', err);
    throw new Error(
      err?.message || 'Server GPU AI sedang sibuk. Silakan gunakan mesin "Relief Cepat" atau coba lagi.'
    );
  }
}
