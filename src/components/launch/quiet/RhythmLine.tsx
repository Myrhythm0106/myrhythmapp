import React, { useEffect, useState } from 'react';
import { Sunrise } from 'lucide-react';
import type { ProductivityWindow } from '@/launch/assessment/productivityWindow';

const KEY = 'myrhythm_launch_mode';

function readWindow(): ProductivityWindow | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const score = data?.brainHealthScore ?? data?.assessmentResults?.brainHealthScore;
    const w =
      data?.assessmentResults?.productivityWindow ??
      score?.productivityWindow ??
      data?.productivityWindow;
    return w && typeof w.productiveStart === 'string' ? (w as ProductivityWindow) : null;
  } catch {
    return null;
  }
}

function pretty(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'am' : 'pm';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/**
 * One line that proves the app listened: what the person told me about their
 * best hours, said back to them in their own terms.
 */
export function RhythmLine() {
  const [win, setWin] = useState<ProductivityWindow | null>(null);

  useEffect(() => {
    setWin(readWindow());
  }, []);

  if (!win) return null;

  const when =
    win.peak === 'varies'
      ? 'your best hours move around'
      : `${win.peak}s are your strongest`;

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-launch-cream-light border border-launch-gold/30 px-4 py-3">
      <Sunrise className="h-4 w-4 mt-0.5 shrink-0 text-launch-ember" />
      <p className="text-sm text-launch-ink/80">
        You told me {when} — I'll keep{' '}
        <span className="font-semibold text-launch-ink">
          {pretty(win.productiveStart)}–{pretty(win.productiveEnd)}
        </span>{' '}
        for whatever matters most, in blocks of about {win.focusBlockMinutes} minutes.
      </p>
    </div>
  );
}
