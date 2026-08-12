'use client';

import React from 'react';
import { Video, Check, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Header({
  saveStatus = 'saved',
  jumpCount,
  isCompleted = false,
  onToggleCompleted
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
      </div>

      {/* Auto-Save & Completion Actions */}
      <div className="flex items-center gap-3">
        {/* Auto-Save Status Indicator */}
        {saveStatus === 'saving' && (
          <div className="px-3 py-1 rounded bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/30 text-xs font-medium flex items-center gap-1.5">
            <RefreshCw size={13} className="animate-spin text-[#58a6ff]" />
            <span>Enregistrement...</span>
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="px-3 py-1 rounded bg-[#238636]/10 text-emerald-400 border border-[#238636]/30 text-xs font-medium flex items-center gap-1.5">
            <Check size={14} className="text-emerald-400" />
            <span>Enregistré</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-medium flex items-center gap-1.5">
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
