'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCw, Clock, Gauge } from 'lucide-react';

export default function VideoPlayer({
  videoFilename,
  videoInfo,
  rotation = 270,
  onRotate,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying
}) {
  const videoRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const fps = videoInfo?.fps || 30.0;
  const frameTime = 1 / fps;
  const streamUrl = videoFilename ? `/api/videos/${encodeURIComponent(videoFilename)}/stream` : '';

  // Synchronize Play / Pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Synchronize Playback Rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Synchronize Seeking
  useEffect(() => {
    if (!videoRef.current) return;
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.01) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const stepFrames = (framesCount) => {
    if (!videoRef.current) return;
    setIsPlaying(false);
    const newTime = Math.max(0, Math.min(videoInfo?.duration || 0, videoRef.current.currentTime + framesCount * frameTime));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'arrowleft':
          e.preventDefault();
          stepFrames(e.shiftKey ? -Math.round(fps) : -1);
          break;
        case 'arrowright':
          e.preventDefault();
          stepFrames(e.shiftKey ? Math.round(fps) : 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fps, videoInfo]);

  const normDeg = ((rotation % 360) + 360) % 360;
  const isPortrait = normDeg === 90 || normDeg === 270;
  const transformStyle = {
    transform: `rotate(${rotation}deg)${isPortrait ? ' scale(0.68)' : ''}`
  };

  const formatTime = (sec) => {
    if (sec === null || sec === undefined || isNaN(sec)) return '--:--.--';
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(2);
    return `${m.toString().padStart(2, '0')}:${s.padStart(5, '0')}`;
  };

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      {/* Video Viewport Container */}
      <div className="video-container flex-1 min-h-0">
        {streamUrl ? (
          <video
            ref={videoRef}
            src={streamUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="video-element"
            style={transformStyle}
          />
        ) : (
          <div className="py-20 text-[#8b949e] text-xs font-mono">
            Sélectionnez un fichier vidéo dans le panneau de gauche
          </div>
        )}
      </div>

      {/* Main Playback Control Bar */}
      <div className="panel-pro p-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Frame Steps & Play/Pause */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => stepFrames(-5)}
            className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d] transition-colors"
            title="Reculer de 5 images (Shift+←)"
          >
            -5f
          </button>
          <button
            onClick={() => stepFrames(-1)}
            className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d] transition-colors"
            title="Reculer d'1 image (←)"
          >
            -1f
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs border border-[#3fb950]/30 transition-colors flex items-center gap-1.5"
            title="Lecture / Pause (Espace)"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
          </button>

          <button
            onClick={() => stepFrames(1)}
            className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d] transition-colors"
            title="Avancer d'1 image (→)"
          >
            +1f
          </button>
          <button
            onClick={() => stepFrames(5)}
            className="px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d] transition-colors"
            title="Avancer de 5 images (Shift+→)"
          >
            +5f
          </button>
        </div>

        {/* Timestamp Indicator */}
        <div className="flex items-center gap-2.5 font-mono text-xs bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          <Clock size={14} className="text-[#58a6ff]" />
          <span className="text-[#58a6ff] font-semibold">{formatTime(currentTime)}</span>
          <span className="text-[#30363d]">/</span>
          <span className="text-[#8b949e]">{formatTime(videoInfo?.duration)}</span>
          <span className="text-[11px] text-[#8b949e] border-l border-[#30363d] pl-2">
            Img: {Math.floor(currentTime * fps)} / {videoInfo?.total_frames || 0} ({fps} FPS)
          </span>
        </div>

        {/* Speed Controls & Video Rotation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded border border-[#30363d]">
            <Gauge size={13} className="text-[#8b949e] ml-1" />
            {[0.25, 0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-1.5 py-0.5 text-[11px] rounded font-mono ${
                  playbackRate === rate
                    ? 'bg-[#1f6feb] text-white font-semibold'
                    : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          <button
            onClick={onRotate}
            className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#f0f6fc] border border-[#30363d] transition-colors flex items-center gap-1"
            title="Pivoter la vidéo de 90°"
          >
            <RotateCw size={13} className="text-[#58a6ff]" />
            <span>{normDeg}°</span>
          </button>
        </div>
      </div>
    </div>
  );
}
