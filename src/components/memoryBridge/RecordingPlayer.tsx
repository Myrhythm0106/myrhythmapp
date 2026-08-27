import React, { useCallback } from 'react';
import { Play, Pause, Loader2, RotateCcw, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  seekTo,
  setPlaybackRate,
  skipBy,
  useAudioPlayerFor,
  type PlayFailure,
} from '@/hooks/useAudioPlayer';

interface RecordingPlayerProps {
  id: string;
  /** Resolves a playable (signed) URL for this recording. */
  getUrl: () => Promise<string | null>;
  /** Stored duration, used until the real one is known. */
  fallbackDuration?: number | null;
  /** True when the audio has been purged by the retention policy. */
  audioDeleted?: boolean;
  className?: string;
}

const RATES = [1, 1.5, 2];

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function RecordingPlayer({
  id,
  getUrl,
  fallbackDuration,
  audioDeleted,
  className,
}: RecordingPlayerProps) {
  const { isCurrent, isPlaying, isLoading, currentTime, duration, rate, toggle } =
    useAudioPlayerFor(id);

  const total = duration || fallbackDuration || 0;

  const onFailure = useCallback((reason: PlayFailure) => {
    if (reason === 'blocked') {
      toast.info('Tap play again to start the audio');
    } else if (reason === 'unavailable') {
      toast.error("That recording couldn't be loaded");
    } else {
      toast.error("Something stopped the audio — please try again");
    }
  }, []);

  if (audioDeleted) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground',
          className,
        )}
      >
        <VolumeX className="h-4 w-4" />
        Audio no longer stored — summary and reference code kept
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      <button
        type="button"
        onClick={() => toggle({ getUrl, onFailure })}
        aria-label={isPlaying ? 'Pause recording' : 'Play recording'}
        className={cn(
          'h-14 w-14 shrink-0 rounded-full flex items-center justify-center transition-all',
          isPlaying
            ? 'bg-primary text-primary-foreground'
            : 'bg-background border border-border text-foreground hover:bg-muted',
        )}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-[160px]">
        <input
          type="range"
          min={0}
          max={Math.max(total, 1)}
          step={1}
          value={Math.min(currentTime, total || 0)}
          disabled={!isCurrent || !total}
          onChange={(e) => seekTo(Number(e.target.value))}
          aria-label="Playback position"
          className="w-full h-2 accent-primary cursor-pointer disabled:cursor-default"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1 tabular-nums">
          <span>{formatClock(currentTime)}</span>
          <span>{formatClock(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => skipBy(-15)}
        disabled={!isCurrent}
        aria-label="Skip back 15 seconds"
        className="h-11 px-3 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 inline-flex items-center gap-1"
      >
        <RotateCcw className="h-4 w-4" />
        15s
      </button>

      <button
        type="button"
        onClick={() => {
          const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
          setPlaybackRate(next);
        }}
        aria-label="Change playback speed"
        className="h-11 px-3 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted tabular-nums"
      >
        {rate}x
      </button>
    </div>
  );
}
