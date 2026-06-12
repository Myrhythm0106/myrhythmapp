import type { ContinuityThreadRow } from './types';
import { PERSONA_LABEL } from '@/launch/persona/usePersona';

export interface ContinuitySummary {
  generatedAt: string;
  userName: string;
  periodLabel: string;
  vision?: string;
  topPriorities: string[];
  energyPattern: { date: string; band: string }[];
  commitCompletionRate?: number; // 0-1
  topWins: string[];
  supportCircle: { name: string; role: string }[];
  personaMix: { label: string; pct: number }[];
  carryForward: string[];
  includeContactDetails: boolean;
}

export interface BuildInput {
  userName: string;
  threads: ContinuityThreadRow[];
  vision?: string;
  topPriorities?: string[];
  commitCompletionRate?: number;
  supportCircle?: { name: string; role: string }[];
  includeContactDetails?: boolean;
}

export function buildContinuitySummary(input: BuildInput): ContinuitySummary {
  const { threads } = input;
  const last14 = threads.slice(0, 14);

  // Persona mix
  const counts: Record<string, number> = {};
  for (const t of last14) counts[t.persona] = (counts[t.persona] ?? 0) + 1;
  const total = Math.max(1, last14.length);
  const personaMix = Object.entries(counts)
    .map(([p, n]) => ({
      label: PERSONA_LABEL[p as keyof typeof PERSONA_LABEL] ?? p,
      pct: Math.round((n / total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  const energyPattern = last14.map(t => ({
    date: t.thread_date,
    band: t.snapshot?.energyBand ?? 'unknown',
  }));

  const wins = new Set<string>();
  for (const t of last14) (t.snapshot?.lastWins ?? []).forEach(w => wins.add(w));
  const carry = new Set<string>();
  for (const t of last14) (t.carry_forward ?? []).forEach(c => carry.add(c.label));

  const periodLabel = last14.length
    ? `${last14[last14.length - 1].thread_date} → ${last14[0].thread_date}`
    : 'No activity recorded';

  return {
    generatedAt: new Date().toISOString(),
    userName: input.userName,
    periodLabel,
    vision: input.vision,
    topPriorities: input.topPriorities ?? [],
    energyPattern,
    commitCompletionRate: input.commitCompletionRate,
    topWins: Array.from(wins).slice(0, 5),
    supportCircle: input.supportCircle ?? [],
    personaMix,
    carryForward: Array.from(carry).slice(0, 8),
    includeContactDetails: input.includeContactDetails ?? false,
  };
}
