'use client';

import React from 'react';
import { Film, CheckCircle2, AlertCircle, RefreshCw, Search, Info } from 'lucide-react';

export default function Sidebar({ videos, activeVideo, onSelectVideo, onRefresh, search, setSearch, isLoading = false, width = 288 }) {
  const filteredVideos = videos.filter(v => 
    v.filename.toLowerCase().includes(search.toLowerCase())
  );

  const completedVideosCount = videos.filter((v) => v.is_completed).length;
  const totalJumpsCount = videos.reduce((acc, v) => acc + (v.jump_count || 0), 0);
  const totalVideosCount = videos.length;

  return (
    <aside
      style={{ width: `${width}px` }}
      className="panel-pro p-3.5 flex flex-col h-full gap-3 shrink-0 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-[#8b949e]" />
          <h2 className="text-sm font-semibold text-[#f0f6fc]">Fichiers Vidéo</h2>
          
          <div className="relative group flex items-center">
            <button
              type="button"
              className="w-5 h-5 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] hover:text-white border border-[#30363d] flex items-center justify-center transition-colors cursor-help"
              aria-label="Statistiques"
            >
              <Info size={12} />
            </button>

            {/* Hover Tooltip Popover */}
            <div className="absolute left-0 top-full mt-1.5 hidden group-hover:flex flex-col gap-1.5 bg-[#161b22] border border-[#30363d] rounded-md p-2.5 shadow-xl text-xs z-50 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
              <div className="font-semibold text-[#f0f6fc] border-b border-[#30363d] pb-1 flex items-center gap-1.5">
                <Info size={13} className="text-[#58a6ff]" />
                <span>Statistiques</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[#c9d1d9] font-mono text-[11px]">
                <span>Vidéos terminées :</span>
                <span className="font-bold text-emerald-400">{completedVideosCount} / {totalVideosCount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[#c9d1d9] font-mono text-[11px]">
                <span>Total sauts annotés :</span>
                <span className="font-bold text-[#58a6ff]">{totalJumpsCount}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onRefresh}
          className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] transition-colors"
          title="Actualiser la liste"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b949e]" />
        <input
          type="text"
          placeholder="Filtrer les vidéos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-8 pr-2.5 py-1.5 text-xs text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff]"
        />
      </div>

      {/* Video List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-3 py-6 px-1">
            <div className="flex items-center justify-between text-xs text-[#58a6ff] font-medium">
              <span className="flex items-center gap-1.5">
                <RefreshCw size={13} className="animate-spin text-[#58a6ff]" />
                Chargement des vidéos...
              </span>
            </div>
            
            {/* Animated Loading Bar */}
            <div className="w-full bg-[#21262d] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#1f6feb] via-[#388bfd] to-[#58a6ff] h-full w-full animate-pulse" />
            </div>

            {/* Skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-md bg-[#161b22] border border-[#30363d]/60 flex flex-col gap-2 animate-pulse">
                <div className="h-3.5 bg-[#21262d] rounded w-3/4" />
                <div className="h-2.5 bg-[#21262d] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-8 text-[#8b949e] text-xs">
            Aucun fichier trouvé dans <code>./Data</code>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const isActive = activeVideo?.filename === video.filename;
            const isAnnotated = video.has_annotations && video.jump_count > 0;
            const isCompleted = video.is_completed;

            let cardStyles = 'bg-[#161b22] border-[#30363d] hover:bg-[#21262d] text-[#c9d1d9]';
            if (isCompleted) {
              if (isActive) {
                cardStyles = 'bg-emerald-950/40 border-[#3fb950] ring-1 ring-[#3fb950] text-[#f0f6fc] border-l-4 border-l-emerald-400 shadow-sm';
              } else {
                cardStyles = 'bg-emerald-950/20 border-emerald-600/70 hover:bg-emerald-950/30 text-[#f0f6fc] border-l-4 border-l-emerald-500/80';
              }
            } else if (isActive) {
              cardStyles = 'bg-[#1f242d] border-[#58a6ff] text-[#f0f6fc] border-l-4 border-l-[#58a6ff]';
            }

            return (
              <div
                key={video.filename}
                onClick={() => onSelectVideo(video)}
                className={`p-2.5 rounded-md cursor-pointer transition-all border text-xs ${cardStyles}`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="font-semibold truncate break-all" title={video.filename}>
                    {video.filename}
                  </span>
                  {isCompleted ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full shrink-0 font-bold flex items-center gap-1 shadow-xs">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      TERMINÉE
                    </span>
                  ) : isAnnotated ? (
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={15} className="text-[#484f58] shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
                  <span>{(video.size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : isAnnotated 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'
                  }`}>
                    {video.jump_count} saut{video.jump_count === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
