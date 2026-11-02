import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  Youtube,
  Search,
  Hash,
  Eye,
  FileText,
  ThumbsUp,
} from 'lucide-react';

const VIRAL_TEMPLATES = [
  'RAHASIA {topic} Yang Belum Pernah Dibocorkan! (Hasilnya Mengejutkan)',
  'Jangan Coba {topic} Sebelum Tonton Video Ini!',
  'Saya Menguji {topic} Selama 24 Jam Non-Stop, Ternyata...',
  '1 Aplikasi Untuk Segala Kebutuhan: {topic} Paling Lengkap!',
  'Dari Pemula Sampai Mahir {topic} Hanya Dalam 10 Menit!',
];

export const SmartYtTool: React.FC = () => {
  const [topic, setTopic] = useState('Simulator Konstruksi Truk 3D');
  const [title, setTitle] = useState('Sebelum Di Hapus! Rahasia Bikin Game Simulator 3D Keren Cuma Dari Browser');
  const [tags, setTags] = useState(
    'audira 3d simulator, game konstruksi indonesia, simulator truk scania, game webgl 3d, react three fiber, tutorial bikin game, bang pay magic pro, game browser gratis, modifikasi truk, gameplay 60fps'
  );
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  // Calculate Title Score
  const calculateScore = (str: string) => {
    let score = 50;
    if (str.length >= 40 && str.length <= 70) score += 20;
    if (/rahasia|terbukti|gratis|tercepat|jangan|cara|gila/i.test(str)) score += 15;
    if (/[0-9]/.test(str)) score += 10;
    if (/!|\?/.test(str)) score += 5;
    return Math.min(100, score);
  };

  const seoScore = calculateScore(title);

  const description = `🔥 ${title}

Selamat datang di channel resmi! Pada video kali ini, kita membahas tuntas mengenai ${topic}. Simak sampai habis agar tidak ketinggalan trik dan fitur tersembunyi!

⏱️ TIMESTAMPS / BABAK VIDEO:
00:00 - Pembukaan & Teaser
01:15 - Eksplorasi Fitur Utama
03:40 - Uji Coba Simulasi & Tips Praktis
06:20 - Kesimpulan & Rekomendasi

🎮 MAINKAN GAME / AKSES APLIKASI:
👉 https://audira.my.id

📌 JANGAN LUPA:
Like, Komen pandangan kalian, dan Subscribe untuk update video kreatif berikutnya!

#Audira3D #${topic.replace(/\s+/g, '')} #SimulatorIndonesia #Gaming #TutorialKreator`;

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">Smart YT — Creator SEO &amp; Algorithm Optimizer</h3>
            <p className="text-[10px] text-slate-400">Tingkatkan CTR, judul viral, tag pencarian &amp; optimasi metadata YouTube</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-slate-950 border border-white/10 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Skor SEO Judul:</span>
            <span
              className={`font-mono font-black text-xs ${
                seoScore >= 80 ? 'text-emerald-400' : seoScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {seoScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Title Generator + SEO Tags + YouTube Feed Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Title Crafter & Templates */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Topic & Title Input */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Topik Video Utama</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topik video..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Judul Video YouTube (Optimal 50-70 Karakter)</label>
                <span className="text-[10px] font-mono text-slate-500">{title.length} karakter</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2.5 pr-20 text-xs text-slate-200 font-semibold focus:outline-none focus:border-red-400"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(title);
                    setCopiedTitle(true);
                    setTimeout(() => setCopiedTitle(false), 2000);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition"
                >
                  {copiedTitle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTitle ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Viral Headline Suggestions */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Rekomendasi Template Judul Viral</span>
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {VIRAL_TEMPLATES.map((tpl, i) => {
                  const rendered = tpl.replace('{topic}', topic);
                  return (
                    <button
                      key={i}
                      onClick={() => setTitle(rendered)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 border border-white/5 text-[11px] text-slate-300 truncate transition block"
                    >
                      {rendered}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* High Ranking Tag Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                <span>Tag &amp; Keyword YouTube Studio</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tags);
                  setCopiedTags(true);
                  setTimeout(() => setCopiedTags(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 text-[10px] font-bold flex items-center gap-1 transition"
              >
                {copiedTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTags ? 'Tersalin!' : 'Salin Semua Tag'}</span>
              </button>
            </div>
            <textarea
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full h-20 bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-cyan-300/90 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: YouTube Feed Preview & Description */}
        <div className="flex flex-col gap-3">
          {/* YouTube Video Card Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-red-500" />
              <span>Simulasi Feed YouTube Mobile</span>
            </span>

            <div className="rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
              <div className="aspect-video relative overflow-hidden bg-slate-950">
                <img src="/home-hero.jpg" alt="Thumb" className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] font-bold text-white">
                  08:45
                </span>
              </div>
              <div className="p-2.5 space-y-1">
                <p className="font-bold text-xs text-white line-clamp-2 leading-snug">{title}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>AUDIRA Official</span> · <span>120 rb x ditonton</span> · <span>2 jam yang lalu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Generator */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Deskripsi Terstruktur</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(description);
                  setCopiedDesc(true);
                  setTimeout(() => setCopiedDesc(false), 2000);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition"
              >
                {copiedDesc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDesc ? 'Disalin' : 'Salin'}</span>
              </button>
            </div>
            <textarea
              value={description}
              readOnly
              className="w-full flex-1 bg-slate-950/80 border border-white/5 rounded-lg p-2 text-[10px] font-mono text-slate-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
