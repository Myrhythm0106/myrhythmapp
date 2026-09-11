/**
 * Turn the rhythm-related assessment answers *and* the brain-health snapshot into a
 * concrete, plain-English productivity window that the scheduler can act on.
 *
 * The window is always advisory. Nothing here blocks a choice — it only shapes the
 * suggestion and explains itself in `reasons`.
 */

import type { BrainHealthScore } from '@/data/launchAssessmentBanks';

export interface ProductivityWindow {
  /** e.g. 'morning', 'afternoon', 'evening', 'varies' */
  peak: 'morning' | 'afternoon' | 'evening' | 'varies';
  /** Start of the best window, HH:mm */
  productiveStart: string;
  /** End of the best window, HH:mm */
  productiveEnd: string;
  /** Best focus block length in minutes */
  focusBlockMinutes: number;
  /** Length of the protected window in minutes */
  windowMinutes: number;
  /** Recovery gap suggested after a demanding commitment, in minutes */
  bufferMinutes: number;
  /** Gentle ceiling on demanding items suggested in one day */
  maxDemandingPerDay: number;
  /** Plain-English drivers behind the numbers above */
  reasons: string[];
  /** One-line guidance for hours to protect */
  protectHours: string;
  /** One-line guidance for safe meeting windows */
  meetingHours: string;
  /** Plain-English summary for the report */
  summary: string;
}

const RHYTHM_WINDOWS: Record<string, { start: string; end: string }> = {
  morning: { start: '08:00', end: '11:30' },
  'early-morning': { start: '07:00', end: '10:30' },
  'late-morning': { start: '09:30', end: '12:30' },
  afternoon: { start: '13:00', end: '16:30' },
  'mid-day': { start: '11:00', end: '14:00' },
  evening: { start: '17:00', end: '20:30' },
  'late-night': { start: '20:00', end: '23:00' },
  varies: { start: '09:00', end: '12:00' },
};

const FOCUS_LENGTH_MINUTES: Record<string, number> = {
  '20': 20,
  '45': 45,
  '90': 90,
  varies: 45,
};

const DRAIN_PROTECT: Record<string, { protect: string; meeting: string }> = {
  'long-meetings': {
    protect: 'Keep my clearest morning hours free for deep work.',
    meeting: 'Schedule meetings after my focus window when possible.',
  },
  'back-to-back': {
    protect: 'Block a 20-minute reset between consecutive commitments.',
    meeting: 'Avoid stacking meetings without a short break.',
  },
  'noise-crowds': {
    protect: 'Protect quieter hours for anything that needs real attention.',
    meeting: 'Choose calmer locations or smaller groups for key meetings.',
  },
  'decisions': {
    protect: 'Put big decisions inside my best window, not at the end of the day.',
    meeting: 'Keep decision-heavy meetings short and inside my peak hours.',
  },
  varies: {
    protect: 'Watch for the days when my energy drops and keep them lighter.',
    meeting: 'Place important meetings on days that already feel steadier.',
  },
};

/* ------------------------------------------------------------------ */
/*  Small time helpers (local, no timezone maths)                     */
/* ------------------------------------------------------------------ */

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function toHHMM(mins: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(mins)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function label(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'am' : 'pm';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/* ------------------------------------------------------------------ */

export function deriveProductivityWindow(
  answers: {
    rhythm?: string;
    focusLength?: string;
    energyDrain?: string;
    /** Optional raw answers, used for a few targeted, plain-English notes. */
    heal?: string;
    transform?: string[];
  },
  score?: BrainHealthScore | null
): ProductivityWindow {
  const rhythm = answers.rhythm || 'varies';
  const focusLength = answers.focusLength || 'varies';
  const drain = answers.energyDrain || 'varies';

  const rawPeak =
    rhythm === 'morning' || rhythm === 'early-morning' || rhythm === 'late-morning'
      ? 'morning'
      : rhythm === 'afternoon' || rhythm === 'mid-day'
      ? 'afternoon'
      : rhythm === 'evening' || rhythm === 'late-night'
      ? 'evening'
      : 'varies';

  const base = RHYTHM_WINDOWS[rhythm] || RHYTHM_WINDOWS['varies'];
  const drainGuide = DRAIN_PROTECT[drain] || DRAIN_PROTECT['varies'];

  let startMins = toMinutes(base.start);
  let endMins = toMinutes(base.end);
  let focusBlockMinutes = FOCUS_LENGTH_MINUTES[focusLength] ?? FOCUS_LENGTH_MINUTES['varies'];
  let bufferMinutes = 10;
  let maxDemandingPerDay = 3;
  const reasons: string[] = [];

  const bio = score?.pillars?.biological;
  const psych = score?.pillars?.psychological;
  const social = score?.pillars?.social;

  /* Body & energy shapes how long the window and the blocks can honestly be. */
  if (typeof bio === 'number') {
    if (bio <= 1) {
      endMins = Math.min(endMins, startMins + 120);
      focusBlockMinutes = Math.min(focusBlockMinutes, 25);
      reasons.push(
        'Your energy answers say the tank is low right now, so I keep the protected window to about two hours and the blocks short.'
      );
    } else if (bio <= 2) {
      focusBlockMinutes = Math.min(focusBlockMinutes, 45);
      reasons.push(
        'Your energy is steady but not endless, so I cap focus blocks at about 45 minutes.'
      );
    } else if (bio >= 2.5) {
      reasons.push('Your rest and energy answers are strong, so I keep your full window as you set it.');
    }
  }

  /* Mind & habits shapes how much demanding work lands in one day. */
  if (typeof psych === 'number') {
    if (psych <= 1) {
      maxDemandingPerDay = 1;
      bufferMinutes = 20;
      reasons.push('One demanding thing a day, with 20 minutes to recover after it.');
    } else if (psych <= 2) {
      maxDemandingPerDay = 2;
      bufferMinutes = 15;
      reasons.push('Up to two demanding things a day, with a 15-minute gap after each.');
    } else {
      maxDemandingPerDay = 3;
      bufferMinutes = 10;
      reasons.push('Up to three demanding things a day, with a short gap after each.');
    }
  }

  if (answers.heal === 'none-yet') {
    reasons.push("You haven't found your reset yet — I'll keep one quiet slot free each day to try one.");
  }
  const struggles = answers.transform ?? [];
  if (struggles.includes('fatigue')) {
    reasons.push('You told me fatigue and overwhelm bite, so I keep the back half of the day lighter.');
  }
  if (struggles.includes('memory')) {
    reasons.push('Remembering appointments is hard, so I lean on reminders rather than your memory.');
  }
  if (typeof social === 'number' && social <= 1) {
    reasons.push('Your circle is still small, so I keep suggestions light on people-heavy blocks.');
  }

  const productiveStart = toHHMM(startMins);
  const productiveEnd = toHHMM(endMins);
  const windowMinutes = Math.max(0, endMins - startMins);
  const peakWord = rawPeak === 'varies' ? 'varies' : `${rawPeak}s`;

  return {
    peak: rawPeak,
    productiveStart,
    productiveEnd,
    focusBlockMinutes,
    windowMinutes,
    bufferMinutes,
    maxDemandingPerDay,
    reasons,
    protectHours: drainGuide.protect,
    meetingHours: drainGuide.meeting,
    summary: `${
      peakWord === 'varies' ? 'My best window varies' : `My best window is the ${peakWord}`
    }, roughly ${label(productiveStart)}–${label(productiveEnd)}. Best focus block: about ${focusBlockMinutes} minutes.`,
  };
}

export function isTimeInWindow(time: string, window: ProductivityWindow): boolean {
  const t = time.slice(0, 5);
  return t >= window.productiveStart && t < window.productiveEnd;
}

/**
 * One soft sentence for a time outside the best window — or null when it fits.
 * Never used to block a choice: the user always has the final say.
 */
export function outsideWindowNote(
  time: string | undefined | null,
  window: ProductivityWindow | null | undefined
): string | null {
  if (!time || !window) return null;
  const t = time.slice(0, 5);
  if (!/^\d{2}:\d{2}$/.test(t)) return null;
  if (isTimeInWindow(t, window)) return null;
  const gap = window.bufferMinutes || 10;
  return `This sits outside your best hours (${label(window.productiveStart)}–${label(
    window.productiveEnd
  )}). That's completely fine — I'll keep the block shorter and leave ${gap} minutes to recover afterwards.`;
}

/** Read the window saved at the end of the assessment. Returns null when absent. */
export function readStoredProductivityWindow(): ProductivityWindow | null {
  try {
    const raw = localStorage.getItem('myrhythm_launch_mode');
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
