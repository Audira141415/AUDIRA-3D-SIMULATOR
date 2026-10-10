import { useState, useRef, useCallback } from 'react';
import { soundEngine } from '../audio/soundEngine';

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('Canvas 3D tidak ditemukan untuk direkam.');
      return;
    }

    try {
      // Capture 60 FPS stream directly from WebGL canvas
      const canvasStream = canvas.captureStream(60);

      // Try combining Web Audio output stream if supported
      let combinedStream = canvasStream;
      try {
        const audioCtx = (soundEngine as any).ctx as AudioContext | undefined;
        if (audioCtx && audioCtx.state === 'running') {
          const dest = audioCtx.createMediaStreamDestination();
          const master = (soundEngine as any).masterGain as GainNode | undefined;
          if (master) {
            master.connect(dest);
            const audioTrack = dest.stream.getAudioTracks()[0];
            if (audioTrack) {
              combinedStream.addTrack(audioTrack);
            }
          }
        }
      } catch {}

      // Select mime type
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 6000000, // 6 Mbps high bitrate
      });

      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audira-gameplay-${Date.now()}.webm`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      };

      recorder.start(500); // chunk every 500ms
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      alert('Gagal memulai perekaman layar: ' + (err.message || err));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    recordSeconds,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}
