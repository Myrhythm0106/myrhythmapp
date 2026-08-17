import { useEffect, useRef, useState } from 'react';

export type MicQuality = 'idle' | 'good' | 'quiet' | 'silent' | 'loud';

export interface MicLevelState {
  /** 0..1 smoothed RMS level */
  level: number;
  /** 0..1 slowly decaying peak marker */
  peak: number;
  quality: MicQuality;
  /** seconds of continuous near-silence */
  silentSeconds: number;
}

const SILENCE_THRESHOLD = 0.012;
const QUIET_THRESHOLD = 0.045;
const LOUD_THRESHOLD = 0.92;

/**
 * Read-only monitoring of a live mic stream. Does not touch what is recorded.
 */
export function useMicLevel(stream: MediaStream | null, active: boolean): MicLevelState {
  const [state, setState] = useState<MicLevelState>({
    level: 0,
    peak: 0,
    quality: 'idle',
    silentSeconds: 0,
  });

  const rafRef = useRef<number | null>(null);
  const peakRef = useRef(0);
  const smoothRef = useRef(0);
  const silentSinceRef = useRef<number | null>(null);
  const lastPublishRef = useRef(0);

  useEffect(() => {
    if (!stream || !active) {
      setState({ level: 0, peak: 0, quality: 'idle', silentSeconds: 0 });
      return;
    }

    let ctx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let cancelled = false;

    try {
      const Ctor: typeof AudioContext =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
      source = ctx.createMediaStreamSource(stream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
    } catch (err) {
      console.warn('useMicLevel: could not attach analyser', err);
      return;
    }

    const buffer = new Float32Array(analyser.fftSize);

    const tick = () => {
      if (cancelled || !analyser) return;
      analyser.getFloatTimeDomainData(buffer);

      let sumSquares = 0;
      let framePeak = 0;
      for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i];
        sumSquares += v * v;
        const abs = Math.abs(v);
        if (abs > framePeak) framePeak = abs;
      }
      const rms = Math.sqrt(sumSquares / buffer.length);

      // Smooth upward fast, downward slower, so quiet speech stays visible.
      smoothRef.current = rms > smoothRef.current
        ? smoothRef.current * 0.4 + rms * 0.6
        : smoothRef.current * 0.85 + rms * 0.15;

      peakRef.current = framePeak > peakRef.current
        ? framePeak
        : Math.max(0, peakRef.current - 0.008);

      const now = performance.now();
      const isSilent = smoothRef.current < SILENCE_THRESHOLD;
      if (isSilent) {
        if (silentSinceRef.current === null) silentSinceRef.current = now;
      } else {
        silentSinceRef.current = null;
      }
      const silentSeconds = silentSinceRef.current === null
        ? 0
        : (now - silentSinceRef.current) / 1000;

      // ~20 updates/sec
      if (now - lastPublishRef.current >= 50) {
        lastPublishRef.current = now;
        const level = Math.min(1, smoothRef.current * 6);
        const peak = Math.min(1, peakRef.current);

        let quality: MicQuality;
        if (silentSeconds >= 3) quality = 'silent';
        else if (peak >= LOUD_THRESHOLD) quality = 'loud';
        else if (smoothRef.current < QUIET_THRESHOLD) quality = 'quiet';
        else quality = 'good';

        setState({ level, peak, quality, silentSeconds });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      peakRef.current = 0;
      smoothRef.current = 0;
      silentSinceRef.current = null;
      try {
        source?.disconnect();
        analyser?.disconnect();
        ctx?.close();
      } catch {
        /* noop */
      }
    };
  }, [stream, active]);

  return state;
}
