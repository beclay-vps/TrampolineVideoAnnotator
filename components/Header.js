'use client';

import React from 'react';
import { Video, RefreshCw, CheckCircle2, Download } from 'lucide-react';

export default function Header({
  saveStatus = 'saved',
  jumpCount,
  isCompleted = false,
  onToggleCompleted,
  onExportJSON,
  activeVideo
}) {
  return (
    <header className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between shrink-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
          <Video size={18} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#f0f6fc] leading-tight">
            Trampoline Video Annotator
          </h1>
          <p className="text-[11px] text-[#8b949e] font-mono">
            Codification FIG ({jumpCount || 0} saut{jumpCount === 1 ? '' : 's'})
          </p>
        </div>

        <div className="h-4 w-px bg-[#30363d] mx-1" />

        {/* Export All JSON Button on Top Left */}
        <button
          onClick={onExportJSON}
          className="px-3 py-1.5 rounded text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] hover:text-white border border-[#30363d] transition-all flex items-center gap-1.5 shadow-sm"
          title="Exporter les annotations de toutes les vidéos au format JSON"
        >
          <Download size={14} className="text-[#58a6ff]" />
          <span>Exporter (JSON)</span>
        </button>
      </div>

      {/* Auto-Save & Completion Actions */}
      <div className="flex items-center gap-3">
        {/* Auto-Save Status Indicator */}
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2 text-xs text-[#58a6ff] font-medium select-none px-1">
            <RefreshCw size={13} className="animate-spin text-[#58a6ff]" />
            <span>Enregistrement...</span>
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-2 text-xs text-[#8b949e] font-medium select-none px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-emerald-400 font-medium">Enregistré</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 text-xs text-red-400 font-medium select-none px-1">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <span>Erreur d'enregistrement</span>
          </div>
        )}

        <div className="h-4 w-px bg-[#30363d]" />

        {/* Completion Toggle Button */}
        <button
          onClick={onToggleCompleted}
          className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm ${
            isCompleted
              ? 'bg-[#238636] hover:bg-[#2ea043] text-white border-[#3fb950]/50'
              : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]'
          }`}
          title={isCompleted ? "Cliquer pour ré-ouvrir l'annotation de la vidéo" : "Marquer l'annotation de la vidéo comme terminée"}
        >
          <CheckCircle2 size={15} className={isCompleted ? 'text-white' : 'text-emerald-400'} />
          <span>{isCompleted ? 'Vidéo Annotée ✓' : 'Terminer'}</span>
        </button>
      </div>
    </header>
  );
}
