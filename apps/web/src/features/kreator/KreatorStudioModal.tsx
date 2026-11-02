import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  Music,
  Video,
  Sliders,
  BookOpen,
  Tag,
  Download,
  Disc,
  Youtube,
  Mic,
  Wand2,
  Tv,
} from 'lucide-react';
import { useKreatorStudioStore, KREATOR_TOOLS, KreatorToolId } from '../../stores/useKreatorStudioStore';
import { SongmakerTool } from './tools/SongmakerTool';
import { VideoEditorTool } from './tools/VideoEditorTool';
import { AudioEditorTool } from './tools/AudioEditorTool';
import { MurotalTool } from './tools/MurotalTool';
import { MetadataTool } from './tools/MetadataTool';
import { SunoDownloaderTool } from './tools/SunoDownloaderTool';
import { AlbumGenTool } from './tools/AlbumGenTool';
import { SmartYtTool } from './tools/SmartYtTool';
import { VoGenTool } from './tools/VoGenTool';
import { AiBangPayTool } from './tools/AiBangPayTool';

export const KreatorStudioModal: React.FC = () => {
  const isOpen = useKreatorStudioStore((s) => s.isOpen);
  const closeStudio = useKreatorStudioStore((s) => s.closeStudio);
  const activeTool = useKreatorStudioStore((s) => s.activeTool);
  const setActiveTool = useKreatorStudioStore((s) => s.setActiveTool);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeStudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeStudio]);

  if (!isOpen) return null;

  const getToolIcon = (id: KreatorToolId) => {
    switch (id) {
      case 'songmaker':
        return <Music className="w-3.5 h-3.5" />;
      case 'video-editor':
        return <Video className="w-3.5 h-3.5" />;
      case 'audio':
        return <Sliders className="w-3.5 h-3.5" />;
      case 'murotal':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'metadata':
        return <Tag className="w-3.5 h-3.5" />;
      case 'suno-downloader':
        return <Download className="w-3.5 h-3.5" />;
      case 'album-gen':
        return <Disc className="w-3.5 h-3.5" />;
      case 'smart-yt':
        return <Youtube className="w-3.5 h-3.5" />;
      case 'vo-gen':
        return <Mic className="w-3.5 h-3.5" />;
      case 'ai-bang-pay':
        return <Wand2 className="w-3.5 h-3.5" />;
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'songmaker':
        return <SongmakerTool />;
      case 'video-editor':
        return <VideoEditorTool />;
      case 'audio':
        return <AudioEditorTool />;
      case 'murotal':
        return <MurotalTool />;
      case 'metadata':
        return <MetadataTool />;
      case 'suno-downloader':
        return <SunoDownloaderTool />;
      case 'album-gen':
        return <AlbumGenTool />;
      case 'smart-yt':
        return <SmartYtTool />;
      case 'vo-gen':
        return <VoGenTool />;
      case 'ai-bang-pay':
        return <AiBangPayTool />;
      default:
        return <SongmakerTool />;
    }
  };

  const currentToolMeta = KREATOR_TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in duration-150">
      {/* Main Studio Modal Window */}
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col bg-[#070b14] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="h-14 px-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <h2 className="text-xs font-black tracking-wider text-white">BANG PAY MAGIC PRO</h2>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  KREATOR SUITE 10 TOOLS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{currentToolMeta?.tagline}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={closeStudio}
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition active:scale-95"
              title="Tutup Kreator Studio (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10 Tool Navigation Ribbon */}
        <div className="h-11 px-3 bg-slate-950/60 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {KREATOR_TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/50 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                <span style={{ color: isActive ? tool.color : undefined }}>{getToolIcon(tool.id)}</span>
                <span>{tool.label}</span>
                {tool.badge && (
                  <span
                    className={`text-[8px] font-black uppercase px-1 py-0.2 rounded ${
                      isActive ? 'bg-cyan-400/20 text-cyan-200' : 'bg-black/40 text-slate-400'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tool Viewport */}
        <div className="flex-1 min-h-0 bg-[#060a12] relative overflow-hidden">
          {renderActiveTool()}
        </div>
      </div>
    </div>
  );
};
