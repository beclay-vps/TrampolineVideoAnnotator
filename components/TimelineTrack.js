'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Trash2, GripVertical, Plus } from 'lucide-react';
import JumpPopover from './JumpPopover';

export default function TimelineTrack({
  duration,
  currentTime,
  jumps,
  setJumps,
  onSeek,
  selectedJumpId,
  setSelectedJumpId,
  figPresets = [],
  onAddJump,
  setIsPlaying
}) {
  const containerRef = useRef(null);
  const didDragRef = useRef(false);
  const [activePopoverJump, setActivePopoverJump] = useState(null);

  // Drag State: { type: 'resize-start' | 'resize-end' | 'move' | 'scrub', jumpId: number, startX: number, initialStart: number, initialEnd: number }
  const [dragState, setDragState] = useState(null);

  const timeToX = (t) => {
    if (!containerRef.current || !duration || duration <= 0) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return (t / duration) * rect.width;
  };

  const xToTime = (x) => {
    if (!containerRef.current || !duration || duration <= 0) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    return ratio * duration;
  };

  // Drag listeners
  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current || !duration) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentTimeAtCursor = xToTime(currentX);

      const deltaX = currentX - dragState.startX;
      const deltaTime = (deltaX / rect.width) * duration;

      if (Math.abs(deltaX) > 3) {
        didDragRef.current = true;
      }

      if (dragState.type === 'scrub') {
        onSeek(currentTimeAtCursor);
        return;
      }

      setJumps((prevJumps) =>
        prevJumps.map((j) => {
          if (j.id !== dragState.jumpId) return j;

          let newStart = j.start_time;
          let newEnd = j.end_time;

          if (dragState.type === 'resize-start') {
            newStart = Math.max(0, Math.min(j.end_time - 0.1, dragState.initialStart + deltaTime));
          } else if (dragState.type === 'resize-end') {
            newEnd = Math.max(j.start_time + 0.1, Math.min(duration, dragState.initialEnd + deltaTime));
          } else if (dragState.type === 'move') {
            const clipLength = dragState.initialEnd - dragState.initialStart;
            newStart = Math.max(0, Math.min(duration - clipLength, dragState.initialStart + deltaTime));
            newEnd = newStart + clipLength;
          }

          newStart = Math.round(newStart * 1000) / 1000;
          newEnd = Math.round(newEnd * 1000) / 1000;
          const flightTime = Math.round(Math.max(0, newEnd - newStart) * 1000) / 1000;

          return {
            ...j,
            start_time: newStart,
            end_time: newEnd,
            flight_time: flightTime
          };
        })
      );
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, duration, onSeek, setJumps]);

  // Start ruler scrub
  const handleRulerMouseDown = (e) => {
    if (!containerRef.current || !duration) return;
    if (setIsPlaying) setIsPlaying(false);
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickTime = xToTime(clickX);
    didDragRef.current = false;
    onSeek(clickTime);
    setDragState({ type: 'scrub', startX: clickX });
  };

  // Start resize or move clip
  const handleClipMouseDown = (e, jump, type) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    didDragRef.current = false;
    setSelectedJumpId(jump.id);

    setDragState({
      type,
      jumpId: jump.id,
      startX,
      initialStart: jump.start_time,
      initialEnd: jump.end_time
    });
  };

  const handleUpdateJump = (updatedJump) => {
    setJumps((prev) => prev.map((j) => (j.id === updatedJump.id ? updatedJump : j)));
  };

  const handleDeleteJump = (id) => {
    setJumps((prev) => prev.filter((j) => j.id !== id));
  };

  const playheadPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate ruler tick marks
  const tickInterval = duration > 30 ? 5 : 1;
  const ticks = [];
  if (duration > 0) {
    for (let t = 0; t <= duration; t += tickInterval) {
      ticks.push(t);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-0">
      {/* Header bar with + Saut button */}
      <div className="flex items-center justify-between px-1 text-xs text-[#8b949e] shrink-0">
        <div className="flex items-center gap-2 font-semibold">
          <span>Chronologie des Sauts</span>
          <span className="text-[11px] font-mono text-[#58a6ff]">({jumps.length} saut{jumps.length === 1 ? '' : 's'})</span>
        </div>

        <button
          onClick={onAddJump}
          className="px-3 py-1 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          title="Ajouter un saut au niveau du curseur (Touche Entrée ou J)"
        >
          <Plus size={14} />
          <span>Saut</span>
        </button>
      </div>

      {/* Main Track Viewport */}
      <div
        ref={containerRef}
        className="relative w-full bg-[#060913] border border-[#30363d] rounded-lg select-none overflow-hidden flex-1 min-h-0 flex flex-col"
      >
        {/* Top Ruler Header (Clickable for scrub) */}
        <div
          onMouseDown={handleRulerMouseDown}
          className="h-7 bg-[#161b22] border-b border-[#30363d] relative cursor-pointer flex items-center"
        >
          {ticks.map((t) => {
            const pct = (t / (duration || 1)) * 100;
            return (
              <div
                key={t}
                className="absolute top-0 bottom-0 flex flex-col justify-between"
                style={{ left: `${pct}%` }}
              >
                <div className="h-2 w-px bg-[#484f58]" />
                <span className="text-[10px] font-mono text-[#8b949e] -translate-x-1/2 select-none mb-0.5">
                  {t}s
                </span>
              </div>
            );
          })}
        </div>

        {/* Track Area for Jump Clips */}
        <div
          onMouseDown={handleRulerMouseDown}
          className="flex-1 relative bg-[#090d16] p-2 cursor-pointer"
        >
          {jumps.map((jump, idx) => {
            const startPct = (jump.start_time / (duration || 1)) * 100;
            const endPct = (jump.end_time / (duration || 1)) * 100;
            const widthPct = Math.max(0.5, endPct - startPct);
            const isSelected = selectedJumpId === jump.id;

            return (
              <div
                key={jump.id}
                onMouseDown={(e) => handleClipMouseDown(e, jump, 'move')}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedJumpId(jump.id);
                  if (!didDragRef.current) {
                    setActivePopoverJump(jump);
                  }
                }}
                className={`absolute top-2 bottom-2 rounded-md border flex items-center justify-between px-2 cursor-grab active:cursor-grabbing shadow-md group ${
                  isSelected
                    ? 'bg-[#1f242d] border-[#58a6ff] text-white ring-2 ring-[#58a6ff]/40 z-20'
                    : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]/60 hover:bg-[#21262d] z-10'
                }`}
                style={{
                  left: `${startPct}%`,
                  width: `${widthPct}%`
                }}
                title={`Saut #${idx + 1}: ${jump.fig_code || '40 o'} (${jump.flight_time}s) - Cliquez pour éditer`}
              >
                {/* Left Resize Handle */}
                <div
                  onMouseDown={(e) => handleClipMouseDown(e, jump, 'resize-start')}
                  className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#30363d] hover:bg-[#58a6ff] cursor-ew-resize rounded-l-md flex items-center justify-center opacity-70 group-hover:opacity-100 transition-colors"
                  title="Déplacer le début du saut"
                >
                  <div className="w-0.5 h-4 bg-white/60 rounded-full" />
                </div>

                {/* Clip Label Content */}
                <div className="flex items-center gap-2 overflow-hidden mx-2 pointer-events-none">
                  <span className="font-mono font-bold text-xs text-[#58a6ff] shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] truncate">
                    {jump.fig_code || 'Saut'}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400 font-semibold shrink-0">
                    {jump.flight_time?.toFixed(2)}s
                  </span>
                </div>

                {/* Right Resize Handle */}
                <div
                  onMouseDown={(e) => handleClipMouseDown(e, jump, 'resize-end')}
                  className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#30363d] hover:bg-[#58a6ff] cursor-ew-resize rounded-r-md flex items-center justify-center opacity-70 group-hover:opacity-100 transition-colors"
                  title="Déplacer la fin du saut"
                >
                  <div className="w-0.5 h-4 bg-white/60 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Playhead Indicator Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none shadow-md shadow-red-500/50"
          style={{ left: `${playheadPercent}%` }}
        >
          <div className="w-3 h-3 bg-red-500 rotate-45 -translate-x-[5px] -translate-y-1.5 rounded-xs" />
        </div>
      </div>

      {/* Popover Modal on Click */}
      {activePopoverJump && (
        <JumpPopover
          jump={activePopoverJump}
          onUpdate={handleUpdateJump}
          onDelete={handleDeleteJump}
          onClose={() => setActivePopoverJump(null)}
          figPresets={figPresets}
        />
      )}
    </div>
  );
}
