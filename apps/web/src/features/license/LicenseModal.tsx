import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Lock,
  X,
  Laptop,
  Check,
} from 'lucide-react';
import { useLicenseStore } from '../../stores/useLicenseStore';
import { soundEngine } from '../audio/soundEngine';

export const LicenseModal: React.FC = () => {
  const isModalOpen = useLicenseStore((s) => s.isModalOpen);
  const setModalOpen = useLicenseStore((s) => s.setModalOpen);
  const isLicensed = useLicenseStore((s) => s.isLicensed);
  const licenseKey = useLicenseStore((s) => s.licenseKey);
  const deviceId = useLicenseStore((s) => s.deviceId);
  const activateLicense = useLicenseStore((s) => s.activateLicense);
  const deactivateLicense = useLicenseStore((s) => s.deactivateLicense);

  const [inputKey, setInputKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isModalOpen) return null;

  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    soundEngine.playUIClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputKey(text.trim().toUpperCase());
        soundEngine.playUIClick();
      }
    } catch {
      // Fallback
    }
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = activateLicense(inputKey);
    if (res.success) {
      soundEngine.playSuccess();
      setSuccessMsg(res.message);
      setInputKey('');
    } else {
      soundEngine.playError();
      setErrorMsg(res.message);
    }
  };

  const openWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Halo Mas Agus Dwi Rianto (AUDIRA),\n\nSaya ingin memesan/mengaktifkan Kunci Lisensi Creator AUDIRA 3D CONSTRUCTION SIMULATOR.\n\n- ID Perangkat: ${deviceId}\n- Platform: Web & Desktop Native\n\nMohon info nomor rekening dan pengiriman kunci lisensi 6 digit. Terima kasih!`
    );
    window.open(`https://wa.me/6285743454790?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header Glow Bar */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500" />

        {/* Modal Header */}
        <div className="p-5 pb-3 flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  LISENSI KREATOR AUDIRA 3D
                </h3>
                {isLicensed ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VIP AKTIF
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> FREE EDITION
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Biar makin enjoy bikin kontennya, aktifkan LISENSI dulu yuk bang!
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Device ID Display */}
          <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  ID Perangkat Anda (1 Lisensi per Perangkat)
                </div>
                <div className="font-mono font-bold text-cyan-300 text-sm">{deviceId}</div>
              </div>
            </div>
            <button
              onClick={handleCopyDeviceId}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 text-xs font-medium"
              title="Salin ID Perangkat"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          {/* Active Status or Activation Form */}
          {isLicensed ? (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Lisensi Terverifikasi Seumur Hidup (Permanent)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Kunci Lisensi aktif: <span className="font-mono font-bold text-emerald-300">{licenseKey}</span>.
                Anda memiliki akses komersial penuh untuk pembuatan video YouTube, TikTok, live streaming, dan ekspor 4K tanpa batasan.
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin menonaktifkan lisensi pada perangkat ini?')) {
                      deactivateLicense();
                    }
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                >
                  Nonaktifkan Lisensi Perangkat
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Kunci Lisensi (6 Digit Alfanumerik)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                    placeholder="Contoh: AUD999 atau VIP777"
                    maxLength={16}
                    className="flex-1 bg-slate-950 border border-cyan-500/40 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-mono text-sm tracking-wider placeholder:text-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePasteKey}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-medium transition-all"
                  >
                    Tempel
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="text-rose-400 text-[11px] bg-rose-950/40 border border-rose-500/30 rounded-lg p-2">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="text-emerald-400 text-[11px] bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>AKTIFKAN LISENSI KREATOR</span>
              </button>
            </form>
          )}

          {/* Benefits Grid */}
          <div className="border-t border-white/10 pt-3">
            <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Keunggulan Paket VIP Creator AUDIRA:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>94+ Model GLB & Sirkuit Lengkap</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Perekam Kanvas 60 FPS Tanpa Watermark</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Multi-Layer Ghost Car Recording</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Hak Komersial Konten YouTube/TikTok</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer / WhatsApp Contact */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Belum punya kunci lisensi?
          </div>
          <button
            onClick={openWhatsAppOrder}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 transition-all font-bold text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>ORDER VIA WHATSAPP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

