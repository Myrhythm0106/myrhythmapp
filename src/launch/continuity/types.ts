import type { Persona } from '@/launch/persona/usePersona';

export type EnergyBand = 'low' | 'steady' | 'strong' | 'unknown';

export interface CarryForwardItem {
  id: string;
  label: string;
  source: 'capture' | 'commit' | 'note';
  addedAt: string; // ISO
}

export interface ContinuitySnapshot {
  energyBand: EnergyBand;
  symptomFlag?: boolean;
  cognitiveLoad?: number; // 0-100
  openCommits: number;
  lastWins: string[]; // up to 3
  lastMisses: string[]; // up to 3
  nextAnchor?: { title: string; whenISO: string } | null;
  note?: string;
}

export interface ContinuityThreadRow {
  id: string;
  user_id: string;
  thread_date: string; // yyyy-mm-dd
  persona: Persona;
  snapshot: ContinuitySnapshot;
  carry_forward: CarryForwardItem[];
  created_at: string;
  updated_at: string;
}

export type ReentryKind = 'none' | 'soft' | 'reset' | 'anchor-missed';

export interface ReentryDecision {
  kind: ReentryKind;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  daysSinceLastActivity: number;
}
