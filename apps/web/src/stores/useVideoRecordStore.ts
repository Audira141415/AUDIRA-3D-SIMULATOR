import { create } from 'zustand';
import { soundEngine } from '../features/audio/soundEngine';

interface VideoRecordState {
  isRecording: boolean;
  recordDuration: number; // in seconds
  recordedBlobUrl: string | null;
  targetFPS: 60 | 30;
  videoQuality: 'high' | 'ultra';
  autoRecordOnRun: boolean;
  autoRecordOnDrive: boolean;

  startRecording: () => boolean;
  stopRecording: () => void;
  setTargetFPS: (fps: 60 | 30) => void;
  setVideoQuality: (q: 'high' | 'ultra') => void;
  setAutoRecordOnRun: (enabled: boolean) => void;
  setAutoRecordOnDrive: (enabled: boolean) => void;
}

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let timerInterval: any = null;

export const useVideoRecordStore = create<VideoRecordState>((set, get) => ({
  isRecording: false,
  recordDuration: 0,
  recordedBlobUrl: null,
  targetFPS: 60,
  videoQuality: 'high',
  autoRecordOnRun: false,
  autoRecordOnDrive: false,

  setTargetFPS: (fps) => set({ targetFPS: fps }),
  setVideoQuality: (q) => set({ videoQuality: q }),
  setAutoRecordOnRun: (enabled) => set({ autoRecordOnRun: enabled }),
  setAutoRecordOnDrive: (enabled) => set({ autoRecordOnDrive: enabled }),

  startRecording: () => {
    if (get().isRecording) return true; // Already recording

    // 1. Find the WebGL Canvas
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      console.warn('Canvas 3D tidak ditemukan untuk perekaman!');
      return false;
    }

    try {
      const { targetFPS, videoQuality } = get();
      // Capture canvas stream at desired FPS
      const stream = canvas.captureStream(targetFPS);

      // Supported mimeTypes
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const bitrate = videoQuality === 'ultra' ? 12000000 : 6000000; // 12 Mbps vs 6 Mbps

      mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrate,
      });

      recordedChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        set({ recordedBlobUrl: url, isRecording: false });

        // Auto download the recorded video
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.href = url;
        a.download = `audira-3d-cinematic-${timestamp}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        soundEngine.playSuccess();
      };

      // Request data in chunks every 1000ms
      mediaRecorder.start(1000);

      // Start duration counter
      clearInterval(timerInterval);
      set({ isRecording: true, recordDuration: 0, recordedBlobUrl: null });

      timerInterval = setInterval(() => {
        set((state) => ({ recordDuration: state.recordDuration + 1 }));
      }, 1000);

      soundEngine.playUIClick();
      return true;
    } catch (err: any) {
      console.error('Failed to start MediaRecorder:', err);
      return false;
    }
  },

  stopRecording: () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    clearInterval(timerInterval);
    set({ isRecording: false });
    soundEngine.playUIClick();
  },
}));
