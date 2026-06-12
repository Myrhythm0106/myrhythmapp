import type { ContinuityThreadRow, ReentryDecision } from './types';

export interface ReentryInput {
  latestThread?: ContinuityThreadRow | null;
  daysSinceLastActivity: number; // 0 if active today
  missedAnchorTitle?: string | null;
}

/**
 * Pure, deterministic re-entry rules. Never throws.
 *
 *   0–1 days  → none (normal day)
 *   2–4 days  → soft re-entry  (one tiny step)
 *   ≥ 5 days  → reset re-entry (offer archive of stale commits)
 *   missed key anchor → context-specific re-entry overrides soft/reset
 */
export function detectReentry({
  daysSinceLastActivity,
  missedAnchorTitle,
}: ReentryInput): ReentryDecision {
  if (missedAnchorTitle) {
    return {
      kind: 'anchor-missed',
      title: `Let's gently reschedule ${missedAnchorTitle}`,
      body: 'No catching up needed — just pick a window that fits your energy today.',
      ctaLabel: 'Pick a new window',
      ctaHref: '/launch/calendar',
      daysSinceLastActivity,
    };
  }

  if (daysSinceLastActivity <= 1) {
    return {
      kind: 'none',
      title: '',
      body: '',
      ctaLabel: '',
      daysSinceLastActivity,
    };
  }

  if (daysSinceLastActivity < 5) {
    return {
      kind: 'soft',
      title: 'Welcome back — start small',
      body: `It's been ${daysSinceLastActivity} days. One gentle step is enough today. Nothing to catch up on.`,
      ctaLabel: 'Choose one small thing',
      ctaHref: '/launch/commit',
      daysSinceLastActivity,
    };
  }

  return {
    kind: 'reset',
    title: 'Fresh start, on your terms',
    body: `It's been ${daysSinceLastActivity} days. We can quietly park older commitments so today feels light.`,
    ctaLabel: 'Reset & pick one thing',
    ctaHref: '/launch/commit',
    daysSinceLastActivity,
  };
}
