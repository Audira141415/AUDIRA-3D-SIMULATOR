import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  Boxes,
  Sun,
  Loader2,
  Bot,
  Terminal,
} from 'lucide-react';
import { useEditorStore } from '../../../stores/useEditorStore';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

interface StylePreset {
  id: string;
  name: string;
  tags: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: '3d-isometric',
    name: '3D Isometric Low-Poly Game',
    tags: 'isometric view, 3d game asset, blender 3d render, vibrant colors, clean geometry, smooth lighting, ambient occlusion',
  },
  {
    id: 'unreal-8k',
    name: 'Unreal Engine 5 Hyperrealism',
    tags: 'hyperrealistic 8k octane render, unreal engine 5 nanite, ray tracing reflections, cinematic depth of field, photorealistic textures',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon Metropolis',
    tags: 'cyberpunk aesthetic, neon cyan and magenta lights, rainy asphalt reflections, futuristic heavy vehicle, volumetric fog, dramatic night',
  },
  {
    id: 'anime',
    name: 'Makoto Shinkai Anime Aesthetic',
    tags: 'makoto shinkai style, hand-drawn anime background, golden sunset clouds, lush green meadow, nostalgic emotional lighting, detailed scenery',
  },
  {
    id: 'concept-art',
    name: 'Cinematic Concept Art',
    tags: 'epic cinematic concept art, wide angle perspective, atmospheric haze, industrial construction landscape, matte painting, masterpiece',
  },
];

const LIGHTING_PRESETS = [
  'Golden Hour Sunset (Warm Glow)',
  'Volumetric Fog & Dramatic Rim Light',
  'Studio Softbox Clean Daylight',
  'Moody Night with Neon Lights',
];

export const AiBangPayTool: React.FC = () => {
  const [subject, setSubject] = useState('Truk Scania R440 warna merah melaju di jalan tol pegunungan');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [lighting, setLighting] = useState(LIGHTING_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Qwen 3.5 3D-Coder state
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [ai3DAnalysis, setAi3DAnalysis] = useState<string | null>(null);

  const setIsStudioOpen = useEditorStore((s) => s.setIsStudioOpen);
  const closeKreator = useKreatorStudioStore((s) => s.closeStudio);

  // Full crafted prompt
  const fullPrompt = `${subject}, ${selectedStyle.tags}, lighting: ${lighting}, aspect ratio --ar ${aspectRatio.replace(':', ':')}, high quality, trending on artstation`;
  const negativePrompt = 'blurry, distorted, low quality, artifacts, watermark, signature, ugly geometry';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = () => {
    if (!ai3DAnalysis) return;
    navigator.clipboard.writeText(ai3DAnalysis);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendTo3DForge = () => {
    closeKreator();
    setIsStudioOpen(true);
  };

  // Call Ollama Qwen3.5-4B-3D-Coder directly or via API
  const handleEnhanceWith3DCoder = async () => {
    setIsAiThinking(true);
    setAi3DAnalysis(null);

    const promptText = `Sebagai pakar 3D Coder (Three.js, WebGL & Blender), optimasi subjek dan rencana spasial 3D berikut:\n"${subject}"\n\nBerikan:\n1. Prompt visual 3D yang sangat terperinci (framing kamera, material PBR, lighting).\n2. Saran parameter spasial Three.js (Camera FOV, Position [X,Y,Z], Target [X,Y,Z]).\nJawab ringkas dalam bahasa Indonesia.`;

    try {
      // 1. Coba hubungi Ollama langsung (port 11434)
      let responseText = '';
      try {
        const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'hf.co/ccore/Qwen3.5-4B-3D-Coder:Q4_K_M',
            prompt: promptText,
            stream: false,
          }),
        });
        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          responseText = data.response || '';
        }
      } catch {
        // 2. Fallback melalui API server backend port 3000
        const apiRes = await fetch('http://localhost:3000/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptText,
          }),
        });
        if (apiRes.ok) {
          const data = await apiRes.json();
          responseText = data.response || '';
        }
      }

      if (!responseText) {
        throw new Error('Tidak ada respon dari Ollama 3D Coder. Pastikan Ollama aktif di port 11434.');
      }

      const cleanText = responseText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      setAi3DAnalysis(cleanText);
    } catch (err: any) {
      setAi3DAnalysis(`[Error] ${err.message || 'Gagal memanggil Ollama 3D Coder.'}`);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-200">AI Studio — Prompt &amp; 3D Coder Lab</h3>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                Qwen3.5 3D-Coder Lokal
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Generator prompt 3D &amp; arsitek spasial terintegrasi Ollama port 11434</p>
          </div>
        </div>

        <button
          onClick={handleSendTo3DForge}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(168,85,247,0.5)] active:scale-95"
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Buka AI 3D Mesh Maker (Forge3D)</span>
        </button>
      </div>

      {/* Main Grid: Prompter & Styles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Style, Lighting & Aspect Ratio */}
        <div className="flex flex-col gap-3">
          {/* Style Presets */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gaya Visual AI (Style)</span>
            </span>
            <div className="space-y-1.5">
              {STYLE_PRESETS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-semibold transition ${
                    selectedStyle.id === st.id
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950/60 text-slate-400 hover:bg-slate-800 border border-white/5'
                  }`}
                >
                  <div className="font-bold">{st.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Lighting & Camera */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>Pencahayaan &amp; Atmosfer</span>
            </span>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {LIGHTING_PRESETS.map((lp, i) => (
                <option key={i} value={lp}>
                  {lp}
                </option>
              ))}
            </select>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block mb-1">Rasio Aspek</span>
              <div className="grid grid-cols-3 gap-1">
                {['16:9', '9:16', '1:1'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`py-1 rounded text-xs font-mono font-bold transition ${
                      aspectRatio === r
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border border-white/5'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Crafter & Output */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Prompt Input & 3D Coder Trigger */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Deskripsi Subjek Utama (Prompt Dasar)</span>
              </span>
              <button
                type="button"
                onClick={handleEnhanceWith3DCoder}
                disabled={isAiThinking || !subject.trim()}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95"
              >
                {isAiThinking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>3D Coder Berpikir...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>⚡ Analisis 3D Coder (Qwen 3.5)</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={3}
              placeholder="Deskripsikan objek, kendaraan, atau adegan..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
          </div>

          {/* AI 3D Analysis Card if available */}
          {ai3DAnalysis && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Terminal className="w-4 h-4" />
                  <span>Rekomendasi Spasial 3D Coder (Three.js &amp; Visual)</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 flex items-center gap-1 transition"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-emerald-100 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {ai3DAnalysis}
              </pre>
            </div>
          )}

          {/* Resulting Full Prompt Ready to Copy */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompt Lengkap (Midjourney / Stable Diffusion / Kling / Runway)</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-xs font-bold flex items-center gap-1 transition"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/90 border border-white/5 text-xs font-mono text-purple-200/90 leading-relaxed select-all">
                {fullPrompt}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">Negative Prompt</span>
              <div className="p-2 rounded bg-slate-950/60 text-[10px] font-mono text-rose-400/80">
                {negativePrompt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
