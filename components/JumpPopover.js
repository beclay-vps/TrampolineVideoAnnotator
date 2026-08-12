'use client';

import React, { useState, useEffect } from 'react';
import { Search, Trash2, Check, X } from 'lucide-react';

export default function JumpPopover({ jump, onUpdate, onDelete, onClose, figPresets = [] }) {
  const [value, setValue] = useState(jump.fig_code || '');

  const cleanQuery = value.toLowerCase().replace(/\s+/g, '');
  const filteredPresets = figPresets.filter(
    (item) =>
      item.code.toLowerCase().replace(/\s+/g, '').includes(cleanQuery) ||
      item.name.toLowerCase().includes(value.toLowerCase().trim())
  );

  const handleApply = (selectedCode = value) => {
    onUpdate({
      ...jump,
      fig_code: selectedCode
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply(value);
    }
  };

  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm panel-pro p-4 flex flex-col gap-3 shadow-2xl border border-[#58a6ff]/50 animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-2.5">
          <h3 className="text-sm font-semibold text-[#f0f6fc] flex items-center gap-2">
            <span>Identifier le Saut</span>
            <span className="text-xs bg-[#21262d] text-[#58a6ff] border border-[#30363d] px-2 py-0.5 rounded font-mono">
              {jump.start_time.toFixed(2)}s - {jump.end_time.toFixed(2)}s
            </span>
          </h3>
        </div>

        {/* Input Field with Auto-complete */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#8b949e]">
            Entrez le nom ou code FIG du saut :
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b949e]" />
              <input
                type="text"
                autoFocus
                placeholder="ex: 8 01 o, Double Back, Half Out..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded pl-8 pr-2.5 py-1.5 text-xs text-[#f0f6fc] font-mono font-bold focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
            <button
              onClick={() => handleApply(value)}
              className="px-3 py-1.5 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Check size={14} />
              <span>Valider</span>
            </button>
          </div>
        </div>

        {/* Auto-complete List */}
        <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1 border border-[#30363d] rounded bg-[#0d1117] p-1">
          {filteredPresets.length > 0 ? (
            filteredPresets.map((item, idx) => (
              <div
                key={`${item.code}-${idx}`}
                onClick={() => handleApply(item.code)}
                className="p-2 rounded hover:bg-[#21262d] cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#58a6ff]">{item.code}</span>
                  <span className="text-xs text-[#c9d1d9]">{item.name}</span>
                </div>
                {item.points > 0 && (
                  <span className="text-[10px] bg-[#21262d] text-[#8b949e] px-1.5 py-0.5 rounded font-mono">
                    {item.points} pt
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-[#8b949e] italic">
              Appuyez sur Valider pour utiliser "{value}"
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#30363d] pt-2.5">
          <button
            onClick={() => {
              onDelete(jump.id);
              onClose();
            }}
            className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>Supprimer</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
