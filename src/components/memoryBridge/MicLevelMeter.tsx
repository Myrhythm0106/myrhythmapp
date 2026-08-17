import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import type { MicLevelState } from '@/hooks/useMicLevel';

interface MicLevelMeterProps {
  state: MicLevelState;
  paused?: boolean;
  className?: string;
}

const STATUS_TEXT: Record<string, string> = {
  idle: 'Waiting for the microphone…',
  good: 'Picking you up clearly',
  quiet: 'Very quiet — move closer or speak up',
  silent: 'No sound reaching the mic',
  loud: "That's a bit loud — back off slightly",
};

export const MicLevelMeter: React.FC<MicLevelMeterProps> = ({ state, paused, className }) => {
  const { level, peak, quality, silentSeconds } = state;

  const barColour =
    quality === 'silent'
      ? 'bg-launch-ember'
      : quality === 'quiet'
      ? 'bg-launch-gold'
      : quality === 'loud'
      ? 'bg-launch-ember'
      : 'bg-launch-moss';

  const textColour =
    quality === 'silent' || quality === 'loud'
      ? 'text-launch-ember'
      : quality === 'quiet'
      ? 'text-launch-gold'
      : 'text-launch-ink/70';

  return (
    <div className={cn('mx-auto w-full max-w-xs', className)}>
      <div
        aria-hidden="true"
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-launch-ink/10"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-75', barColour)}
          style={{ width: `${Math.round((paused ? 0 : level) * 100)}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-launch-ink/50 transition-[left] duration-150"
          style={{ left: `${Math.min(99, Math.round((paused ? 0 : peak) * 100))}%` }}
        />
      </div>

      <p className={cn('mt-2 text-xs font-medium', textColour)} aria-live="polite" role="status">
        {paused ? 'Paused — nothing is being recorded right now' : STATUS_TEXT[quality]}
      </p>

      {!paused && quality === 'silent' && silentSeconds >= 8 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-launch-ember/30 bg-launch-ember/5 p-3 text-left">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-launch-ember" />
          <p className="text-xs leading-snug text-launch-ember">
            Still recording, but nothing has been heard for {Math.floor(silentSeconds)} seconds.
            Check your microphone is on and not blocked, or stop and start again.
          </p>
        </div>
      )}
    </div>
  );
};

export default MicLevelMeter;
