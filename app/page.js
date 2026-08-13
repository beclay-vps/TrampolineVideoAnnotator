'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoPlayer from '@/components/VideoPlayer';
import TimelineTrack from '@/components/TimelineTrack';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [rotation, setRotation] = useState(270);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [jumps, setJumps] = useState([]);
  const [selectedJumpId, setSelectedJumpId] = useState(null);
  const [figPresets, setFigPresets] = useState([]);
  const [search, setSearch] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const fetchVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      const loadedVideos = data.videos || [];
      setVideos(loadedVideos);

      if (!activeVideo && loadedVideos.length > 0) {
        await selectVideo(loadedVideos[0]);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const fetchFigCodes = async () => {
    try {
      const res = await fetch('/api/fig-codes');
      const data = await res.json();
      setFigPresets(data.fig_codes || []);
    } catch (err) {
      console.error('Error fetching FIG codes:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchFigCodes();
  }, []);

  const [saveStatus, setSaveStatus] = useState('saved');
  const isLoadedRef = React.useRef(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const selectVideo = async (video) => {
    isLoadedRef.current = false;
    setActiveVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedJumpId(null);

    try {
      const infoRes = await fetch(`/api/videos/${encodeURIComponent(video.filename)}/info`);
      const infoData = await infoRes.json();
      setVideoInfo(infoData);

      const annRes = await fetch(`/api/videos/${encodeURIComponent(video.filename)}/annotations`);
      const annData = await annRes.json();
      setJumps(annData.jumps || []);
      setRotation(270);
      setIsCompleted(Boolean(annData.is_completed));
      setSaveStatus('saved');

      setTimeout(() => {
        isLoadedRef.current = true;
      }, 150);
    } catch (err) {
      console.error('Error loading video details:', err);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleToggleCompleted = () => {
    const nextCompleted = !isCompleted;
    setIsCompleted(nextCompleted);
    showToast(
      nextCompleted ? 'Vidéo marquée comme terminée !' : 'Vidéo remise en cours d\'annotation',
      'success'
    );
  };

  // Automatic saving on jumps or completion modification
  useEffect(() => {
    if (!isLoadedRef.current || !activeVideo) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const payload = {
          video_filename: activeVideo.filename,
          is_completed: isCompleted,
          jumps: jumps
        };
        const res = await fetch(`/api/videos/${encodeURIComponent(activeVideo.filename)}/annotations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setSaveStatus('saved');
          setVideos((prev) =>
            prev.map((v) =>
              v.filename === activeVideo.filename
                ? { ...v, is_completed: isCompleted, jump_count: jumps.length, has_annotations: true }
                : v
            )
          );
          return;
        }
        setSaveStatus('error');
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('error');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [jumps, isCompleted, activeVideo]);

  // Add jump at playhead cursor without overlapping adjacent jumps (default max 2.0s)
  const handleAddDefaultJump = useCallback(() => {
    const maxDuration = videoInfo?.duration || 99999;
    const cTime = Math.round((currentTime || 0) * 1000) / 1000;
    let startT = cTime;

    // Shift startT past any overlapping or contiguous chain of existing jumps
    while (true) {
      const coveringJump = jumps.find((j) => startT >= j.start_time && startT < j.end_time);
      if (coveringJump) {
        startT = coveringJump.end_time;
      } else {
        break;
      }
    }

    if (startT >= maxDuration) {
      showToast('Impossible d\'ajouter un saut à la fin de la vidéo', 'error');
      return;
    }

    // Find the next jump starting after startT to avoid overlapping it
    const succeedingJumps = jumps.filter((j) => j.start_time > startT).sort((a, b) => a.start_time - b.start_time);
    const maxAllowedEnd = succeedingJumps.length > 0 ? succeedingJumps[0].start_time : maxDuration;

    const availableSpace = maxAllowedEnd - startT;
    if (availableSpace < 0.1) {
      showToast('Espace insuffisant entre les sauts pour en ajouter un nouveau', 'error');
      return;
    }

    const defaultDuration = Math.min(2.0, Math.round(availableSpace * 1000) / 1000);
    const endT = Math.round((startT + defaultDuration) * 1000) / 1000;
    const flightT = Math.round((endT - startT) * 1000) / 1000;

    const newJump = {
      id: Date.now(),
      start_time: startT,
      end_time: endT,
      flight_time: flightT,
      fig_code: '',
      fig_name: '',
      notes: ''
    };

    setJumps((prev) => [...prev, newJump].sort((a, b) => a.start_time - b.start_time));
    setSelectedJumpId(newJump.id);
    setCurrentTime(startT);
    showToast(`Saut à remplir ajouté à ${startT}s`);
  }, [jumps, currentTime, videoInfo]);

  // Export JSON file for ALL videos and all jumps in the dataset
  const handleExportAllJSON = useCallback(async () => {
    try {
      showToast('Préparation de l\'exportation de toutes les vidéos...');
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Erreur serveur lors de la récupération des annotations');
      const exportData = await res.json();

      // Ensure active video in state reflects the current unsaved/saved jumps
      if (activeVideo && Array.isArray(exportData.videos)) {
        exportData.videos = exportData.videos.map((v) => {
          if (v.video_filename === activeVideo.filename) {
            const cleanJumps = jumps.map((j) => {
              const preset = figPresets.find((p) => p.code === j.fig_code);
              const difficulty = preset ? Math.round((preset.points || 0) * 10) / 10 : 0;

              const cleanObj = {
                start_time: j.start_time,
                end_time: j.end_time,
                flight_time: j.flight_time,
                fig_code: j.fig_code || '',
                difficulty
              };

              const name = j.fig_name || preset?.name;
              if (name) cleanObj.fig_name = name;
              if (j.notes && j.notes.trim()) cleanObj.notes = j.notes.trim();

              return cleanObj;
            });

            const totalDifficulty = Math.round(cleanJumps.reduce((sum, j) => sum + (j.difficulty || 0), 0) * 10) / 10;

            const cleanVideo = {
              video_filename: activeVideo.filename,
              is_completed: isCompleted,
              total_difficulty: totalDifficulty,
              jumps: cleanJumps
            };

            return cleanVideo;
          }
          return v;
        });

        exportData.total_jumps = exportData.videos.reduce((acc, v) => acc + (v.jumps ? v.jumps.length : 0), 0);
      }

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trampoline_annotations_export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Export de toutes les vidéos réussi (${exportData.total_jumps} sauts) !`);
    } catch (err) {
      console.error('Export error:', err);
      showToast('Échec de l\'exportation JSON', 'error');
    }
  }, [activeVideo, jumps, isCompleted]);

  // Keyboard shortcut listener to add a jump (Enter, 'j', or '+')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'Enter' || e.key.toLowerCase() === 'j' || e.key === '+' || e.key === 'NumpadAdd') {
        e.preventDefault();
        handleAddDefaultJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAddDefaultJump]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-[#f0f6fc]">
      <Header
        saveStatus={saveStatus}
        jumpCount={jumps.length}
        isCompleted={isCompleted}
        onToggleCompleted={handleToggleCompleted}
        onExportJSON={handleExportAllJSON}
        activeVideo={activeVideo}
      />

      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        <Sidebar
          videos={videos}
          activeVideo={activeVideo}
          onSelectVideo={selectVideo}
          onRefresh={fetchVideos}
          search={search}
          setSearch={setSearch}
          isLoading={isLoadingVideos}
        />

        <main className="flex-1 flex flex-col gap-2.5 overflow-hidden min-w-0">
          {/* Main Video Viewport (Ratio 3/1) */}
          <div className="flex-[3] min-h-0 flex flex-col">
            <VideoPlayer
              videoFilename={activeVideo?.filename}
              videoInfo={videoInfo}
              rotation={rotation}
              onRotate={handleRotate}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

          {/* Expanded Video Editing Timeline Track (Ratio 1/3) */}
          <div className="panel-pro p-3 flex-[1] min-h-0 flex flex-col">
            <TimelineTrack
              duration={videoInfo?.duration || 0}
              currentTime={currentTime}
              jumps={jumps}
              setJumps={setJumps}
              onSeek={setCurrentTime}
              selectedJumpId={selectedJumpId}
              setSelectedJumpId={setSelectedJumpId}
              figPresets={figPresets}
              onAddJump={handleAddDefaultJump}
              setIsPlaying={setIsPlaying}
            />
          </div>
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-5 right-5 px-3.5 py-2 rounded-md shadow-xl flex items-center gap-0 border text-xs font-semibold z-50 ${
          toast.type === 'error'
            ? 'bg-[#2d1215] border-red-500/50 text-red-300'
            : 'bg-[#0d2218] border-emerald-500/50 text-emerald-300'
        }`}>
          <CheckCircle2 size={16} />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
