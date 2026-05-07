// Demo fixtures — single source of truth for Quiet Power POC.
// All consumers read via useDemoOrLive(); flip ONE constant to swap to live data.

export type DemoTier = 'free' | 'plus' | 'pro' | 'family';

export interface DemoSupporter {
  name: string;
  relationship: string;
  status: 'active' | 'invited';
}

export interface DemoFixtures {
  name: string;
  tier: DemoTier;
  lastVisitHoursAgo: number;
  wins: { id: string; text: string; time: string }[];
  capturesToday: number;
  cognitiveLoad: number; // 0-100
  supportCircle: DemoSupporter[];
}

const BASE: DemoFixtures = {
  name: 'Alex',
  tier: 'free',
  lastVisitHoursAgo: 30, // shows re-entry card
  wins: [
    { id: 'w1', text: 'Drank water before coffee', time: '8:12 am' },
    { id: 'w2', text: 'Replied to Mum', time: '9:40 am' },
    { id: 'w3', text: '10-min walk in the garden', time: '11:05 am' },
  ],
  capturesToday: 2,
  cognitiveLoad: 42,
  supportCircle: [
    { name: 'Sarah', relationship: 'Sister', status: 'active' },
  ],
};

const TIER_OVERRIDES: Record<DemoTier, Partial<DemoFixtures>> = {
  free: { tier: 'free', supportCircle: [{ name: 'Sarah', relationship: 'Sister', status: 'active' }] },
  plus: {
    tier: 'plus',
    supportCircle: [
      { name: 'Sarah', relationship: 'Sister', status: 'active' },
      { name: 'Tom', relationship: 'Friend', status: 'active' },
      { name: 'Dr. Patel', relationship: 'GP', status: 'invited' },
    ],
  },
  pro: {
    tier: 'pro',
    supportCircle: [
      { name: 'Sarah', relationship: 'Sister', status: 'active' },
      { name: 'Tom', relationship: 'Friend', status: 'active' },
      { name: 'Dr. Patel', relationship: 'GP', status: 'active' },
      { name: 'Nina', relationship: 'OT', status: 'active' },
      { name: 'James', relationship: 'Coach', status: 'invited' },
    ],
  },
  family: {
    tier: 'family',
    supportCircle: [
      { name: 'Sarah', relationship: 'Sister', status: 'active' },
      { name: 'Mum', relationship: 'Family', status: 'active' },
      { name: 'Dad', relationship: 'Family', status: 'active' },
      { name: 'Tom', relationship: 'Friend', status: 'active' },
      { name: 'Dr. Patel', relationship: 'GP', status: 'active' },
      { name: 'Nina', relationship: 'OT', status: 'active' },
      { name: 'James', relationship: 'Coach', status: 'active' },
    ],
  },
};

export function getDemoFixtures(tier: DemoTier): DemoFixtures {
  return { ...BASE, ...TIER_OVERRIDES[tier] };
}

// Tier feature limits (soft caps for the POC)
export const TIER_LIMITS = {
  free: { supporters: 1, label: 'Free' },
  plus: { supporters: 3, label: 'Plus' },
  pro: { supporters: 7, label: 'Pro' },
  family: { supporters: Infinity, label: 'Family' },
} as const;
