/**
 * Single source of truth for recording length rules.
 *
 * The monthly pool is the hard limit; the weekly figure is pacing guidance
 * shown in the egg timer, never a gate.
 */

export type RecordingTier = 'free' | 'regular' | 'founding' | 'friends_family';

export interface RecordingTierLimits {
  /** Human label for the tier */
  label: string;
  /** Longest single recording, in minutes */
  perRecordingMinutes: number;
  /** Weekly pacing guidance, in minutes */
  weeklyMinutes: number;
  /** Hard monthly pool, in minutes */
  monthlyMinutes: number;
}

export const RECORDING_LIMITS: Record<RecordingTier, RecordingTierLimits> = {
  free: {
    label: 'Free',
    perRecordingMinutes: 20,
    weeklyMinutes: 60,
    monthlyMinutes: 240,
  },
  regular: {
    label: 'Regular',
    perRecordingMinutes: 120,
    weeklyMinutes: 600,
    monthlyMinutes: 2400,
  },
  founding: {
    label: 'Founding Member',
    perRecordingMinutes: 240,
    weeklyMinutes: 1200,
    monthlyMinutes: 4800,
  },
  friends_family: {
    label: 'Friends & Family',
    perRecordingMinutes: 240,
    weeklyMinutes: 1200,
    monthlyMinutes: 4800,
  },
};

/** The tier a free/regular user should be nudged towards when they run out. */
export const NEXT_TIER: Partial<Record<RecordingTier, RecordingTier>> = {
  free: 'regular',
  regular: 'founding',
};

/**
 * Map whatever the subscription layer reports (plan_type / context tier /
 * trial state) onto a recording tier. An active trial gets Regular so nobody
 * hits a 20-minute wall while evaluating.
 */
export function resolveRecordingTier(input?: {
  tier?: string | null;
  planType?: string | null;
  isTrialing?: boolean;
}): RecordingTier {
  const raw = (input?.planType || input?.tier || 'free').toLowerCase();

  if (raw.includes('friends') || raw.includes('family_smart') || raw === 'ff') {
    return 'friends_family';
  }
  if (raw.includes('founding') || raw === 'smart_pro' || raw === 'premium') {
    return 'founding';
  }
  if (raw === 'regular' || raw === 'starter' || raw === 'paid' || raw === 'pro') {
    return 'regular';
  }
  if (input?.isTrialing) return 'regular';
  return 'free';
}

export function getRecordingLimits(tier: RecordingTier): RecordingTierLimits {
  return RECORDING_LIMITS[tier] ?? RECORDING_LIMITS.free;
}

/** "2h 15m" / "45m" */
export function formatMinutes(totalMinutes: number): string {
  const mins = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "1:58:12" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = m.toString().padStart(2, '0');
  const ss = sec.toString().padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}
