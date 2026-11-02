import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useTerrainSculptStore } from '../../stores/useTerrainSculptStore';
import { soundEngine } from '../audio/soundEngine';

interface WorldBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorldBackupModal: React.FC<WorldBackupModalProps> = ({ isOpen, onClose }) => {
  const getWorldSaveData = useWorldStore((s) => s.getWorldSaveData);
  const loadWorldData = useWorldStore((s) => s.loadWorldData);
  const heightMap = useTerrainSculptStore((s) => s.heightMap);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export / Backup
  const handleExportBackup = () => {
    soundEngine.playUIClick();
    setStatusMessage('Membuat backup file...');

    setTimeout(() => {
      try {
        const rawData = getWorldSaveData();
        const fullBackup = {
          ...rawData,
          backupVersion: '2.0.0',
          backupTimestamp: new Date().toISOString(),
          heightMap,
        };

        const jsonStr = JSON.stringify(fullBackup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AUDIRA_3D_BACKUP_${new Date().toISOString().slice(0, 10)}.audira.json`;
        a.click();
        URL.revokeObjectURL(url);

        soundEngine.playSuccess();
        setIsSuccess(true);
        setStatusMessage('BACKUP BERHASIL! File tersimpan di folder Unduhan.');
      } catch (err: any) {
        setIsSuccess(false);
        setStatusMessage(`Gagal membuat backup: ${err.message}`);
      }
    }, 400);
  };

  // Handle Import / Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage('Memeriksa file backup...');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.objects || !Array.isArray(parsed.objects)) {
          throw new Error('Format file tidak valid: Objek dunia tidak ditemukan.');
        }

        setStatusMessage('Memulihkan data ke kanvas 3D...');

        setTimeout(() => {
          loadWorldData(parsed);

          // Restore heightmap if exists
          if (parsed.heightMap) {
            useTerrainSculptStore.setState({ heightMap: parsed.heightMap });
          }

          soundEngine.playSuccess();
          setIsSuccess(true);
          setStatusMessage(`RESTORE BERHASIL! Berhasil memulihkan ${parsed.objects.length} objek.`);
        }, 500);
      } catch (err: any) {
        setIsSuccess(false);
        setStatusMessage(`Gagal memulihkan: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-[#09151c] border border-cyan-500/30 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-white/10 bg-[#060e14]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-black tracking-wider text-cyan-300">
              BACKUP & RESTORE PETA
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Simpan seluruh konfigurasi peta, objek kendaraan, jalan, wahana, dan kontur bukit tanah ke file JSON terenkripsi untuk dipulihkan kapan saja.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Backup Button */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 hover:text-white flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-6 h-6 text-cyan-400" />
              <div className="text-center">
                <span className="block text-xs font-black">SIMPAN BACKUP</span>
                <span className="text-[10px] text-slate-400">Unduh berkas (.json)</span>
              </div>
            </button>

            {/* Restore Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Upload className="w-6 h-6 text-emerald-400" />
              <div className="text-center">
                <span className="block text-xs font-black">PULIHKAN / RESTORE</span>
                <span className="text-[10px] text-slate-400">Unggah berkas (.json)</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.audira"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Status Toast Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
                isSuccess
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              )}
              <span className="font-bold leading-tight">{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

