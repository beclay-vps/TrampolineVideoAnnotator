import fs from 'fs';
import path from 'path';
import { execFile, execFileSync, spawn } from 'child_process';
import { FIG_PRESETS } from './fig-codes.js';

const DATA_DIR = path.resolve(process.env.DATA_DIR || './Data');
const ANNOTATIONS_DIR = path.join(DATA_DIR, 'annotations');
const CACHE_DIR = path.join(DATA_DIR, '.cache_transcoded');

// Ensure directories exist
if (!fs.existsSync(ANNOTATIONS_DIR)) fs.mkdirSync(ANNOTATIONS_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const SUPPORTED_EXTENSIONS = new Set(['.mp4', '.avi', '.mov', '.mkv', '.webm']);

export function listVideos() {
  if (!fs.existsSync(DATA_DIR)) return [];

  const files = fs.readdirSync(DATA_DIR);
  const videos = [];

  for (const filename of files) {
    const ext = path.extname(filename).toLowerCase();
    const filePath = path.join(DATA_DIR, filename);

    if (SUPPORTED_EXTENSIONS.has(ext) && fs.statSync(filePath).isFile()) {
      const annotationFile = path.join(ANNOTATIONS_DIR, `${filename}.json`);
      const hasAnnotations = fs.existsSync(annotationFile);
      let jumpCount = 0;
      let isCompleted = false;

      if (hasAnnotations) {
        try {
          const annData = JSON.parse(fs.readFileSync(annotationFile, 'utf-8'));
          jumpCount = Array.isArray(annData.jumps) ? annData.jumps.length : 0;
          isCompleted = Boolean(annData.is_completed);
        } catch (e) {
          console.error(`Error reading annotation file for ${filename}:`, e);
        }
      }

      const stats = fs.statSync(filePath);

      videos.push({
        filename,
        size_bytes: stats.size,
        has_annotations: hasAnnotations,
        jump_count: jumpCount,
        is_completed: isCompleted
      });
    }
  }

  return videos.sort((a, b) => a.filename.localeCompare(b.filename));
}

export function getVideoPath(filename) {
  const safeName = path.basename(filename);
  const filePath = path.join(DATA_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Video file '${filename}' not found.`);
  }
  return filePath;
}

export function getPlayableVideoPath(filename) {
  const rawPath = getVideoPath(filename);
  const ext = path.extname(filename).toLowerCase();

  // If the file is already an MP4 in ./Data, stream it directly without re-transcoding!
  if (ext === '.mp4') {
    return rawPath;
  }

  const cachedMp4 = path.join(CACHE_DIR, `${path.parse(rawPath).name}_intra.mp4`);

  if (fs.existsSync(cachedMp4) && fs.statSync(cachedMp4).mtimeMs >= fs.statSync(rawPath).mtimeMs) {
    return cachedMp4;
  }

  console.log(`Transcoding ${filename} to Compressed Fast MP4...`);
  try {
    execFileSync('ffmpeg', [
      '-y',
      '-i', rawPath,
      '-vf', 'scale=-2:720',
      '-c:v', 'libx264',
      '-preset', 'faster',
      '-crf', '26',
      '-g', '15',
      '-bf', '0',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '96k',
      '-movflags', '+faststart',
      cachedMp4
    ], { stdio: 'pipe' });

    return cachedMp4;
  } catch (err) {
    console.error(`FFmpeg transcoding failed for ${filename}:`, err);
    return rawPath;
  }
}

const metadataCache = new Map();

export function getVideoInfo(filename) {
  if (metadataCache.has(filename)) {
    return metadataCache.get(filename);
  }

  const rawPath = getVideoPath(filename);

  try {
    const stdout = execFileSync('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=r_frame_rate,avg_frame_rate,width,height,duration,nb_frames',
      '-show_entries', 'format=duration',
      '-of', 'json',
      rawPath
    ], { encoding: 'utf-8' });

    const info = JSON.parse(stdout);
    const stream = info.streams?.[0] || {};
    const format = info.format || {};

    let fps = 30.0;
    const fpsStr = stream.r_frame_rate || stream.avg_frame_rate || '30/1';
    if (fpsStr.includes('/')) {
      const [num, den] = fpsStr.split('/').map(Number);
      if (den > 0) fps = num / den;
    } else {
      fps = parseFloat(fpsStr) || 30.0;
    }

    const duration = parseFloat(stream.duration || format.duration || 0.0);
    const width = parseInt(stream.width || 1920, 10);
    const height = parseInt(stream.height || 1080, 10);
    const total_frames = parseInt(stream.nb_frames || Math.round(duration * fps), 10);

    const result = {
      fps: Math.round(fps * 1000) / 1000,
      duration: Math.round(duration * 1000) / 1000,
      width,
      height,
      total_frames
    };

    metadataCache.set(filename, result);
    return result;
  } catch (err) {
    console.error(`ffprobe error for ${filename}:`, err);
    return { fps: 30.0, duration: 0.0, width: 1920, height: 1080, total_frames: 0 };
  }
}

export function getAnnotations(filename) {
  const annotationFile = path.join(ANNOTATIONS_DIR, `${filename}.json`);
  if (!fs.existsSync(annotationFile)) {
    return { video_filename: filename, rotation: 0, notes: '', jumps: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(annotationFile, 'utf-8'));
    return data;
  } catch (e) {
    console.error(`Error loading annotations for ${filename}:`, e);
    return { video_filename: filename, rotation: 0, notes: '', jumps: [] };
  }
}

export function saveAnnotations(filename, data) {
  const annotationFile = path.join(ANNOTATIONS_DIR, `${filename}.json`);
  data.video_filename = filename;

  if (Array.isArray(data.jumps)) {
    data.jumps = data.jumps.map((j, i) => ({
      ...j,
      id: j.id || i + 1,
      flight_time: Math.round(Math.max(0, (j.end_time || 0) - (j.start_time || 0)) * 1000) / 1000
    }));
  }

  fs.writeFileSync(annotationFile, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

function cleanJump(j) {
  const preset = FIG_PRESETS.find((p) => p.code === j.fig_code);
  const difficulty = preset ? Math.round((preset.points || 0) * 10) / 10 : 0;

  const cleanObj = {
    start_time: j.start_time,
    end_time: j.end_time,
    flight_time: j.flight_time,
    fig_code: j.fig_code || '',
    difficulty
  };

  const name = j.fig_name || preset?.name;
  if (name) {
    cleanObj.fig_name = name;
  }

  if (j.notes && j.notes.trim()) {
    cleanObj.notes = j.notes.trim();
  }

  return cleanObj;
}

export function getAllAnnotations() {
  const videos = listVideos();
  const allData = [];

  for (const video of videos) {
    const ann = getAnnotations(video.filename);
    const jumps = Array.isArray(ann.jumps) ? ann.jumps.map(cleanJump) : [];
    const totalDifficulty = Math.round(jumps.reduce((sum, j) => sum + (j.difficulty || 0), 0) * 10) / 10;

    const videoObj = {
      video_filename: video.filename,
      is_completed: Boolean(ann.is_completed || video.is_completed),
      total_difficulty: totalDifficulty,
      jumps
    };

    if (ann.notes && ann.notes.trim()) {
      videoObj.notes = ann.notes.trim();
    }

    allData.push(videoObj);
  }

  return {
    export_date: new Date().toISOString(),
    total_videos: videos.length,
    total_jumps: allData.reduce((acc, v) => acc + v.jumps.length, 0),
    videos: allData
  };
}
