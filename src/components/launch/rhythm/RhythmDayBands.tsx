import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bandsForDate, onRhythmConsentChange, readRhythmConsent, saveRhythmConsent } from '@/launch/calendar/rhythmConsent';

/** Soft labelled bands for one day: my agreed rhythm + regular appointments. */
export function RhythmDayBands({ date }: { date: Date }) {
  const navigate = useNavigate();
  const [, force] = useState(0);
  const [explain, setExplain] = useState(false);
  useEffect(() => onRhythmConsentChange(() => force((n) => n + 1)), []);

  const bands = bandsForDate(date);
  const consent = readRhythmConsent();
  if (!bands.length) return null;

  return (
    <div className="mb-4 rounded-xl border border-dashed border-launch-teal/40 bg-launch-cream-light p-4" aria-label="My rhythm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => setExplain((e) => !e)} className="min-h-11 rounded-full bg-launch-gold/15 px-3 text-xs font-bold uppercase tracking-wider text-launch-ink-deep">
          From my answers
        </button>
        {consent.status === 'yes' && (
          <button
            onClick={() => saveRhythmConsent({ ...consent, status: 'no' })}
            className="min-h-11 px-2 text-sm font-semibold text-launch-ink-deep/70 underline"
          >
            Hide my rhythm
          </button>
        )}
      </div>
      {explain && (
        <p className="mt-2 text-sm text-launch-ink-deep/80">
          These suggestions come from my snapshot answers and the regular appointments I added. They are not appointments. I can change them in{' '}
          <button className="font-semibold text-launch-teal underline" onClick={() => navigate('/launch/settings#rhythm')}>Settings</button>.
        </p>
      )}
      <ul className="mt-3 space-y-2">
        {bands.map((b, i) => (
          <li
            key={i}
            className={`flex min-h-[48px] items-center justify-between rounded-lg px-4 text-base ${
              b.kind === 'appointment'
                ? 'border border-launch-ink/20 bg-launch-ivory font-semibold text-launch-ink-deep'
                : b.kind === 'breaks'
                  ? 'bg-launch-gold/15 text-launch-ink-deep'
                  : 'bg-launch-teal/10 text-launch-ink-deep'
            }`}
          >
            <span>{b.label}</span>
            <span className="tabular-nums">{b.start}–{b.end}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
