/**
 * Turn the rhythm-related assessment answers into a concrete, plain-English
 * productivity window that the scheduler can act on.
 */

export interface ProductivityWindow {
  /** e.g. 'morning', 'afternoon', 'evening', 'varies' */
  peak: 'morning' | 'afternoon' | 'evening' | 'varies';
  /** Start of the best window, HH:mm */
  productiveStart: string;
  /** End of the best window, HH:mm */
  productiveEnd: string;
  /** Best focus block length in minutes */
  focusBlockMinutes: number;
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

export function deriveProductivityWindow(answers: {
  rhythm?: string;
  focusLength?: string;
  energyDrain?: string;
}): ProductivityWindow {
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

  const window = RHYTHM_WINDOWS[rhythm] || RHYTHM_WINDOWS['varies'];
  const focusBlockMinutes = FOCUS_LENGTH_MINUTES[focusLength] ?? FOCUS_LENGTH_MINUTES['varies'];
  const drainGuide = DRAIN_PROTECT[drain] || DRAIN_PROTECT['varies'];

  const startHour = parseInt(window.start.split(':')[0], 10);
  const endHour = parseInt(window.end.split(':')[0], 10);
  const startLabel = startHour < 12 ? `${startHour}am` : `${startHour - 12 || 12}pm`;
  const endLabel = endHour < 12 ? `${endHour}am` : `${endHour - 12 || 12}pm`;
  const peakWord = rawPeak === 'varies' ? 'varies' : `${rawPeak}s`;

  return {
    peak: rawPeak,
    productiveStart: window.start,
    productiveEnd: window.end,
    focusBlockMinutes,
    protectHours: drainGuide.protect,
    meetingHours: drainGuide.meeting,
    summary: `${peakWord === 'varies' ? 'My best window varies' : `My best window is the ${peakWord}`}, roughly ${startLabel}–${endLabel}. Best focus block: about ${focusBlockMinutes} minutes.`,
  };
}

export function isTimeInWindow(time: string, window: ProductivityWindow): boolean {
  const t = time.slice(0, 5);
  return t >= window.productiveStart && t < window.productiveEnd;
}
