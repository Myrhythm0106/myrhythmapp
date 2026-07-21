import React from 'react';
import { Link } from 'react-router-dom';
import { useGrowthStates } from '@/hooks/useGrowthStates';
import { GROWTH_STATE_BY_KEY, TONE_CLASSES, MYRHYTHM_G_BRAND } from './states';
import { cn } from '@/lib/utils';

/** Compact home-screen chip near the greeting. Taps through to Calibrate. */
export function MyRhythmGHomeChip() {
  const { today, loading } = useGrowthStates();

  if (loading) return null;

  if (!today) {
    return (
      <Link
        to="/launch/calibrate"
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/70 border border-brain-health-200 text-[12px] text-brain-health-700 hover:bg-white transition"
      >
        <span className="font-semibold">{MYRHYTHM_G_BRAND}</span>
        <span className="text-brain-health-500">· Log yours today ›</span>
      </Link>
    );
  }

  const s = GROWTH_STATE_BY_KEY[today.letter];
  const tone = TONE_CLASSES[s.tone];
  return (
    <Link
      to="/launch/calibrate"
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 border text-[12px] transition',
        tone.bg, tone.ring, tone.text, 'hover:shadow-sm'
      )}
    >
      <span
        className="w-5 h-5 rounded flex items-center justify-center bg-white/70 font-bold text-[12px]"
        aria-hidden
      >
        {s.letter}
      </span>
      <span className="font-semibold">{MYRHYTHM_G_BRAND}</span>
      <span className="opacity-80">· {s.name}</span>
    </Link>
  );
}
