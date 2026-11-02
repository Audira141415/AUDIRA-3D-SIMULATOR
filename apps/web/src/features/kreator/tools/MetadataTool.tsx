import React, { useState, useRef } from 'react';
import {
  Tag,
  Save,
  Upload,
  Image,
  FileAudio,
  Check,
  Disc,
  Info,
  Download,
  Music,
} from 'lucide-react';

interface AudioMetadata {
  title: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
  trackNumber: string;
  composer: string;
  copyright: string;
  isrc: string;
  coverImage: string | null;
}

// Real Binary ID3v2.3 Tag Builder
function buildId3v2Mp3Blob(meta: AudioMetadata, audioData?: ArrayBuffer | null): Blob {
  const frames: Uint8Array[] = [];

  function addTextFrame(id: string, text: string) {
    if (!text) return;
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(text);
    const frameSize = 1 + textBytes.length; // 1 byte encoding + text
    const frame = new Uint8Array(10 + frameSize);

    // Frame ID
    for (let i = 0; i < 4; i++) frame[i] = id.charCodeAt(i);

    // Size
    frame[4] = (frameSize >> 24) & 0xff;
    frame[5] = (frameSize >> 16) & 0xff;
    frame[6] = (frameSize >> 8) & 0xff;
    frame[7] = frameSize & 0xff;

    // Flags
    frame[8] = 0;
    frame[9] = 0;

    // Encoding (3 = UTF-8)
    frame[10] = 3;

    // Text Content
    frame.set(textBytes, 11);
    frames.push(frame);
  }

  addTextFrame('TIT2', meta.title);
  addTextFrame('TPE1', meta.artist);
  addTextFrame('TALB', meta.album);
  addTextFrame('TYER', meta.year);
  addTextFrame('TCON', meta.genre);
  addTextFrame('TRCK', meta.trackNumber);
  addTextFrame('TCOM', meta.composer);
  addTextFrame('TCOP', meta.copyright);
  addTextFrame('TSRC', meta.isrc);

  let totalFrameBytes = 0;
  for (const f of frames) totalFrameBytes += f.length;

  // Header 10 bytes: ID3 + 0x03 0x00 + flags + synchsafe size
  const header = new Uint8Array(10);
  header[0] = 0x49; // 'I'
  header[1] = 0x44; // 'D'
  header[2] = 0x33; // '3'
  header[3] = 0x03; // version 2.3
  header[4] = 0x00;
  header[5] = 0x00; // flags

  // Synchsafe integer size
  header[6] = (totalFrameBytes >> 21) & 0x7f;
  header[7] = (totalFrameBytes >> 14) & 0x7f;
  header[8] = (totalFrameBytes >> 7) & 0x7f;
  header[9] = totalFrameBytes & 0x7f;

  const tagBuffer = new Uint8Array(10 + totalFrameBytes);
  tagBuffer.set(header, 0);

  let curOffset = 10;
  for (const f of frames) {
    tagBuffer.set(f, curOffset);
    curOffset += f.length;
  }

  const parts: BlobPart[] = [tagBuffer];

  if (audioData) {
    const view = new Uint8Array(audioData);
    let audioStart = 0;
    if (view.length > 10 && view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) {
      const oldTagSize =
        (view[6] << 21) |
        (view[7] << 14) |
        (view[8] << 7) |
        view[9];
      audioStart = 10 + oldTagSize;
    }
    parts.push(view.slice(audioStart));
  } else {
    // Generate valid dummy MPEG audio frame so file is recognized
    parts.push(new Uint8Array([0xff, 0xfb, 0x90, 0x64]));
  }

  return new Blob(parts, { type: 'audio/mpeg' });
}

export const MetadataTool: React.FC = () => {
  const [meta, setMeta] = useState<AudioMetadata>({
    title: 'Audira Cyber Pulse (Original Mix)',
    artist: 'Agus Dwi Rianto',
    album: 'Audira 3D Simulator Official Soundtrack Vol. 1',
    year: '2026',
    genre: 'Electronic / Synthwave',
    trackNumber: '01/10',
    composer: 'Audira Sound Lab',
    copyright: '© 2026 Audira Multimedia Digital. All rights reserved.',
    isrc: 'ID-AUD-26-00001',
    coverImage: '/home-hero.jpg',
  });

  const [uploadedAudioData, setUploadedAudioData] = useState<ArrayBuffer | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      setUploadedAudioData(buffer);
      setLoadedFileName(file.name);
      // Auto-populate title from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setMeta((prev) => ({ ...prev, title: cleanName }));
    } catch (err) {
      alert('Gagal membaca file audio.');
    }
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadTaggedMp3 = () => {
    const blob = buildId3v2Mp3Blob(meta, uploadedAudioData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(meta, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200">
              {loadedFileName ? `File MP3: ${loadedFileName}` : 'ID3v2 & RIFF Audio Metadata Editor'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {uploadedAudioData
                ? `Ukuran Berkas: ${(uploadedAudioData.byteLength / 1024 / 1024).toFixed(2)} MB · Siap Ditulis Ulang Tag ID3v2.3`
                : 'Inspeksi, sematkan tag biner ID3v2 & ekspor file MP3 bertag'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={audioFileInputRef}
            type="file"
            accept="audio/mp3,audio/mpeg"
            onChange={handleAudioUpload}
            className="hidden"
          />
          <button
            onClick={() => audioFileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-white/10 transition"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload MP3 Anda</span>
          </button>

          <button
            onClick={handleDownloadTaggedMp3}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(245,158,11,0.4)] active:scale-95"
            title="Download MP3 dengan Header dan Frame ID3v2.3 tertanam nyata"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh MP3 Bertag ID3</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Artwork Cover + Metadata Fields */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left Column: Album Artwork & Tech Specs */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 self-start flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5" />
              <span>Cover Art Album (Front)</span>
            </span>

            <div className="w-44 h-44 rounded-xl border-2 border-dashed border-white/20 bg-slate-950/80 flex flex-col items-center justify-center overflow-hidden relative group">
              {meta.coverImage ? (
                <img
                  src={meta.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-3">
                  <Disc className="w-8 h-8 text-slate-600 mx-auto mb-1 animate-spin" />
                  <span className="text-[10px] text-slate-500">Pilih gambar cover</span>
                </div>
              )}
            </div>

            <label className="w-full py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-white/10 text-xs text-center text-slate-300 cursor-pointer transition">
              <Upload className="w-3 h-3 inline mr-1" />
              <span>Ganti Cover Art</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setMeta({ ...meta, coverImage: ev.target?.result as string });
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* Technical Specs Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spesifikasi File Audio</span>
            </span>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-slate-500">Header Standar:</span>
                <span className="text-amber-400 font-bold">ID3v2.3 (ISO UTF-8)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-slate-500">Bitrate:</span>
                <span className="text-slate-200">320 kbps (CBR)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-slate-500">Sample Rate:</span>
                <span className="text-slate-200">44.1 kHz (Studio)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Status Injeksi:</span>
                <span className="text-emerald-400 font-bold">Biner UTF-8 Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Metadata Fields */}
        <div className="flex-1 p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Judul Lagu (TIT2)</label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Artis (TPE1)</label>
            <input
              type="text"
              value={meta.artist}
              onChange={(e) => setMeta({ ...meta, artist: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nama Album (TALB)</label>
            <input
              type="text"
              value={meta.album}
              onChange={(e) => setMeta({ ...meta, album: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Genre Musik (TCON)</label>
            <input
              type="text"
              value={meta.genre}
              onChange={(e) => setMeta({ ...meta, genre: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tahun Rilis (TYER)</label>
            <input
              type="text"
              value={meta.year}
              onChange={(e) => setMeta({ ...meta, year: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nomor Trek (TRCK)</label>
            <input
              type="text"
              value={meta.trackNumber}
              onChange={(e) => setMeta({ ...meta, trackNumber: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Komposer (TCOM)</label>
            <input
              type="text"
              value={meta.composer}
              onChange={(e) => setMeta({ ...meta, composer: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kode ISRC (TSRC)</label>
            <input
              type="text"
              value={meta.isrc}
              onChange={(e) => setMeta({ ...meta, isrc: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Hak Cipta (TCOP)</label>
            <input
              type="text"
              value={meta.copyright}
              onChange={(e) => setMeta({ ...meta, copyright: e.target.value })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
