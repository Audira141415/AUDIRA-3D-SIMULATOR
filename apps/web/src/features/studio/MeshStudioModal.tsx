import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  Upload,
  Sparkles,
  Download,
  RotateCw,
  Box,
  Image as ImageIcon,
  Check,
  Plus,
  Loader2,
  Wand2,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useAssetStore } from '../../stores/useAssetStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { generateReliefMesh, exportSceneToGLB } from './meshGenerator';
import { generateFullAI3D } from './cloud3d';
import { AssetDefinition, GameObject } from '@audira/shared';

// Pre-packaged high quality sample templates
const TEMPLATE_PRESETS = [
  { name: 'Mobil Balap GT', icon: '🏎️', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop&q=80' },
  { name: 'Pohon Pinus Hutan', icon: '🌲', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Kastil Kerajaan', icon: '🏰', url: 'https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=400&auto=format&fit=crop&q=80' },
  { name: 'Robot Cyber', icon: '🤖', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
  { name: 'Batu Karang Purba', icon: '🪨', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop&q=80' },
];

// Inner 3D Preview Turntable Renderer for Relief
const ReliefPreviewMesh: React.FC<{
  geometry: THREE.BufferGeometry;
  texture: THREE.CanvasTexture;
  shading: 'photo' | 'resin';
  wireframe: boolean;
  autoRotate: boolean;
  groupRef: React.RefObject<THREE.Group>;
}> = ({ geometry, texture, shading, wireframe, autoRotate, groupRef }) => {
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        {shading === 'photo' ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.55}
            metalness={0.15}
            wireframe={wireframe}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial
            color="#9fd8e6"
            roughness={0.25}
            metalness={0.4}
            wireframe={wireframe}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>
    </group>
  );
};

// Inner 3D Preview Renderer for External GLB
const GLBPreviewMesh: React.FC<{
  url: string;
  shading: 'photo' | 'resin';
  wireframe: boolean;
  autoRotate: boolean;
  groupRef: React.RefObject<THREE.Group>;
}> = ({ url, shading, wireframe, autoRotate, groupRef }) => {
  const gltf = useGLTF(url);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.wireframe = wireframe;
            if (shading === 'resin') {
              child.material.color = new THREE.Color('#9fd8e6');
            }
          }
        }
      });
    }
  }, [gltf, shading, wireframe]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={1.5} />
    </group>
  );
};

export const MeshStudioModal: React.FC = () => {
  const isStudioOpen = useEditorStore((s) => s.isStudioOpen);
  const setIsStudioOpen = useEditorStore((s) => s.setIsStudioOpen);
  const addCustomAsset = useAssetStore((s) => s.addCustomAsset);
  const setActiveCategory = useEditorStore((s) => s.setActiveCategory);
  const addObject = useWorldStore((s) => s.addObject);

  // Studio states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | Blob | null>(null);
  const [imageName, setImageName] = useState<string>('Custom 3D Mesh');
  const [engineMode, setEngineMode] = useState<'relief' | 'full'>('relief');
  const [hfToken, setHfToken] = useState<string>('');
  const [shading, setShading] = useState<'photo' | 'resin'>('photo');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Model Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const [errorText, setErrorText] = useState<string | null>(null);

  // Generated Mesh Data
  const [generatedRelief, setGeneratedRelief] = useState<{
    geometry: THREE.BufferGeometry;
    texture: THREE.CanvasTexture;
  } | null>(null);
  const [generatedGLBUrl, setGeneratedGLBUrl] = useState<string | null>(null);
  const [generatedGLBBlob, setGeneratedGLBBlob] = useState<Blob | null>(null);
  const [triangleCount, setTriangleCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('audira-hf-token');
    if (savedToken) setHfToken(savedToken);
  }, []);

  const handleTokenChange = (val: string) => {
    setHfToken(val);
    localStorage.setItem('audira-hf-token', val);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Pilih berkas gambar yang valid (PNG, JPG, atau WebP).');
      return;
    }
    const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    setImageName(cleanName || 'Custom 3D Mesh');
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setErrorText(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (preset: typeof TEMPLATE_PRESETS[0]) => {
    setImageName(preset.name);
    try {
      const resp = await fetch(preset.url);
      const blob = await resp.blob();
      setImageFile(blob);
      setImageSrc(preset.url);
      setErrorText(null);
    } catch {
      setImageSrc(preset.url);
    }
  };

  // Build 3D Model
  const handleGenerate3D = async () => {
    if (!imageSrc) return;
    setIsGenerating(true);
    setErrorText(null);
    setStatusText('Mempersiapkan gambar...');

    try {
      if (engineMode === 'full' && imageFile) {
        // AI 3D Cloud
        const result = await generateFullAI3D(imageFile, setStatusText, hfToken);
        setGeneratedGLBUrl(result.url);
        setGeneratedGLBBlob(result.blob);
        setGeneratedRelief(null);
        setTriangleCount(45000);
        setStatusText(`Selesai via ${result.engine}!`);
      } else {
        // Relief Cepat (Lokal Peramban Instant)
        setStatusText('Menganalisis pencahayaan & kedalaman...');
        await new Promise((r) => setTimeout(r, 60));

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Gagal memuat gambar untuk dianalisis.'));
        });

        setStatusText('Mengekstrusi bentuk 3D volumetrik...');
        const relief = generateReliefMesh(img, { resolution: 140, depth: 0.38 });

        const indexCount = relief.geometry.getIndex()?.count || 0;
        setTriangleCount(Math.round(indexCount / 3));

        setGeneratedRelief(relief);
        setGeneratedGLBUrl(null);
        setGeneratedGLBBlob(null);
        setStatusText('Model 3D siap!');
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Gagal membuat model 3D.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download GLB file to disk
  const handleDownloadGLB = async () => {
    try {
      let blob = generatedGLBBlob;
      if (!blob && groupRef.current) {
        blob = await exportSceneToGLB(groupRef.current, `${imageName}.glb`);
      }
      if (!blob) throw new Error('Tidak ada model 3D yang aktif untuk diunduh.');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageName.toLowerCase().replace(/\s+/g, '-')}.glb`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunduh file GLB.');
    }
  };

  // Add into AUDIRA Simulator
  const handleAddToSimulator = async () => {
    try {
      let modelUrl = generatedGLBUrl;
      if (!modelUrl && groupRef.current) {
        const blob = await exportSceneToGLB(groupRef.current, `${imageName}.glb`);
        modelUrl = URL.createObjectURL(blob);
      }
      if (!modelUrl) throw new Error('Buat model 3D terlebih dahulu.');

      const newAssetId = `custom-${Date.now()}`;
      const newAsset: AssetDefinition = {
        id: newAssetId,
        name: imageName,
        category: 'custom',
        type: 'container',
        color: '#00d2ff',
        modelUrl: modelUrl,
        thumbnailUrl: imageSrc || undefined,
        isCustom: true,
      };

      addCustomAsset(newAsset);
      setActiveCategory('custom');

      // Also spawn right on terrain in front of camera
      const newObj: GameObject = {
        id: `obj-${Date.now()}`,
        name: imageName,
        type: 'container',
        category: 'custom',
        assetId: newAssetId,
        position: { x: (Math.random() - 0.5) * 6, y: 0.5, z: (Math.random() - 0.5) * 6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 1.5, z: 1.5 },
        visible: true,
        locked: false,
        castShadow: true,
        receiveShadow: true,
        color: '#00d2ff',
        modelUrl: modelUrl,
        thumbnailUrl: imageSrc || undefined,
      };
      addObject(newObj);

      setIsStudioOpen(false);
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan model ke simulator.');
    }
  };

  if (!isStudioOpen) return null;

  const hasModel = !!(generatedRelief || generatedGLBUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-[#0c141d] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,210,255,0.15)] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-[#080d14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,210,255,0.3)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                AUDIRA MESH STUDIO <span className="text-cyan-400 font-mono text-xs">V1.0</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Ubah Foto & Gambar Menjadi Aset 3D Langsung di Browser
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsStudioOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            title="Tutup Studio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Left Control Panel + Right 3D Viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] overflow-hidden">
          {/* LEFT COLUMN: Controls & Settings matching Image 2 */}
          <div className="border-r border-white/10 p-5 overflow-y-auto scrollbar-thin flex flex-col gap-5 bg-[#091118]/80">
            {/* 1 — Unggah gambar */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>1 — Unggah gambar</span>
              </h3>

              {/* Drag & drop upload box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  imageSrc
                    ? 'border-cyan-500/50 bg-cyan-950/20'
                    : 'border-white/15 hover:border-cyan-400/40 bg-slate-950/40 hover:bg-slate-900/60'
                }`}
              >
                {imageSrc ? (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden flex items-center justify-center bg-black/40">
                    <img src={imageSrc} alt="Preview" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-cyan-300 font-mono">
                      Ganti Gambar
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-300 font-medium text-center">
                      Tarik gambar ke sini atau pilih berkas
                    </span>
                    <button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition-all">
                      Pilih gambar
                    </button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Sample Quick Presets */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  Atau pilih contoh template cepat:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {TEMPLATE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => handleSelectPreset(p)}
                      className="px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/40 text-[10px] text-slate-300 font-medium flex items-center gap-1.5 transition-all truncate"
                      title={p.name}
                    >
                      <span>{p.icon}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2 — Pilih mesin */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>2 — Pilih mesin</span>
              </h3>

              {/* Segmented Mode Button */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-white/10">
                <button
                  onClick={() => setEngineMode('full')}
                  className={`py-1.5 rounded-md text-xs font-bold transition-all ${
                    engineMode === 'full'
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI 3D penuh
                </button>
                <button
                  onClick={() => setEngineMode('relief')}
                  className={`py-1.5 rounded-md text-xs font-bold transition-all ${
                    engineMode === 'relief'
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Relief cepat
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate3D}
                disabled={!imageSrc || isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{statusText || 'Sedang memproses...'}</span>
                  </>
                ) : (
                  <>
                    <Box className="w-4 h-4" />
                    <span>Buat model 3D</span>
                  </>
                )}
              </button>

              {/* Token Hugging Face input */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="text-[10px] text-slate-400 font-mono">
                  Token Hugging Face (opsional, gratis — menambah kuota harian)
                </label>
                <input
                  type="password"
                  placeholder="hf_..."
                  value={hfToken}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline font-mono"
                >
                  Buat token gratis di huggingface.co ↗
                </a>
              </div>

              {errorText && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {errorText}
                </div>
              )}
            </div>

            {/* 3 — Tampilan & unduhan */}
            <div className="flex flex-col gap-2.5 pt-1 border-t border-white/10">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 — Tampilan & unduhan</span>
              </h3>

              {/* Shading toggle (Warna foto vs Resin polos) */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-white/10">
                <button
                  onClick={() => setShading('photo')}
                  className={`py-1.5 rounded-md text-xs font-bold transition-all ${
                    shading === 'photo'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Warna foto
                </button>
                <button
                  onClick={() => setShading('resin')}
                  className={`py-1.5 rounded-md text-xs font-bold transition-all ${
                    shading === 'resin'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resin polos
                </button>
              </div>

              {/* Wireframe & Auto-rotate Switches */}
              <div className="flex flex-col gap-2 text-xs text-slate-300">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span>Tampilkan rangka (Wireframe)</span>
                  <input
                    type="checkbox"
                    checked={wireframe}
                    onChange={(e) => setWireframe(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span>Putar otomatis (Auto-rotate)</span>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Actions: Download GLB & Add to Simulator */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleDownloadGLB}
                  disabled={!hasModel}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Unduh model GLB</span>
                </button>

                <button
                  onClick={handleAddToSimulator}
                  disabled={!hasModel}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,210,255,0.3)] transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Tambahkan ke Simulator</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRATINJAU 3D matching Image 2 */}
          <div className="relative w-full h-full bg-[#070d14] flex flex-col items-center justify-center overflow-hidden">
            {/* Top Left Badge: PRATINJAU 3D */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                PRATINJAU 3D
              </span>
            </div>

            {/* Polygon count badge when model is loaded */}
            {hasModel && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1 rounded-md text-[11px] font-mono text-cyan-400">
                <span>{triangleCount.toLocaleString()} Segitiga</span>
              </div>
            )}

            {/* If no model loaded: exact empty placeholder from Image 2 */}
            {!hasModel ? (
              <div className="flex flex-col items-center justify-center gap-3.5 text-center px-4 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_24px_rgba(0,210,255,0.2)]">
                  <Box className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-white">
                  Belum ada model
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unggah gambar di panel kiri, lalu tekan <strong className="text-cyan-400 font-semibold">"Buat model 3D"</strong>.
                </p>
              </div>
            ) : (
              <div className="w-full h-full">
                <Canvas
                  shadows
                  camera={{ position: [0, 0.8, 3.8], fov: 45 }}
                  gl={{ antialias: true, preserveDrawingBuffer: true }}
                >
                  <color attach="background" args={['#080e16']} />
                  <fog attach="fog" args={['#080e16', 5, 14]} />

                  <ambientLight intensity={0.6} />
                  <directionalLight position={[4, 5, 5]} intensity={2.2} castShadow />
                  <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#67e8f9" />

                  {/* Ground grid circle */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
                    <circleGeometry args={[2.5, 32]} />
                    <meshStandardMaterial color="#0e1724" roughness={0.8} />
                  </mesh>

                  {/* 3D Model Renderer */}
                  {generatedRelief && (
                    <ReliefPreviewMesh
                      geometry={generatedRelief.geometry}
                      texture={generatedRelief.texture}
                      shading={shading}
                      wireframe={wireframe}
                      autoRotate={autoRotate}
                      groupRef={groupRef as any}
                    />
                  )}

                  {generatedGLBUrl && (
                    <Suspense fallback={null}>
                      <GLBPreviewMesh
                        url={generatedGLBUrl}
                        shading={shading}
                        wireframe={wireframe}
                        autoRotate={autoRotate}
                        groupRef={groupRef as any}
                      />
                    </Suspense>
                  )}

                  <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={1.2}
                    maxDistance={8}
                  />
                </Canvas>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
