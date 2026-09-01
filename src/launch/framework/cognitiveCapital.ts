/**
 * Cognitive Capital Framework — the four-pillar lens used to group the eight
 * MYRHYTHM letters in reports and scheduling.
 *
 * The mapping is sourced from MYRHYTHM_LETTERS so the framework and the report
 * can never drift apart. No named practitioner or programme appears here.
 */

import { MYRHYTHM_LETTERS, type MyRhythmLetterId } from './myrhythm';

export type PillarId = 'biological' | 'psychological' | 'social' | 'spiritual';

export interface CognitivePillar {
  id: PillarId;
  label: string;
  shortLabel: string;
  meaning: string;
  reportLine: string;
}

export const COGNITIVE_PILLARS: readonly CognitivePillar[] = [
  {
    id: 'biological',
    label: 'Biological',
    shortLabel: 'Body & energy',
    meaning: 'Sleep, energy, daily rhythm and the physical foundation of a clear mind.',
    reportLine: 'My body and energy set the boundaries for what I can take on.',
  },
  {
    id: 'psychological',
    label: 'Psychological',
    shortLabel: 'Mind & habits',
    meaning: 'Self-talk, honest baselines, and the mental habits that turn plans into action.',
    reportLine: 'My mindset and mental habits shape how I follow through.',
  },
  {
    id: 'social',
    label: 'Social',
    shortLabel: 'People & support',
    meaning: 'The people around me and the support that turns private intentions into shared ones.',
    reportLine: 'My people make my plans more likely to happen.',
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    shortLabel: 'Purpose & momentum',
    meaning: 'Purpose, values, and the small wins that keep a plan going when motivation dips.',
    reportLine: 'My sense of purpose and progress keeps me moving.',
  },
] as const;

export const PILLAR_BY_ID: Record<PillarId, CognitivePillar> =
  COGNITIVE_PILLARS.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {} as Record<PillarId, CognitivePillar>);

export const LETTER_TO_PILLAR: Record<MyRhythmLetterId, PillarId> = {
  mindset: 'psychological',
  yesReality: 'psychological',
  rhythm: 'biological',
  harnessSupport: 'social',
  yourVictories: 'spiritual',
  transform: 'psychological',
  heal: 'biological',
  meaning: 'spiritual',
} as const;

export function pillarForLetter(letterId: MyRhythmLetterId): PillarId {
  return LETTER_TO_PILLAR[letterId];
}

export function pillarLabelForLetter(letterId: MyRhythmLetterId): string {
  return PILLAR_BY_ID[pillarForLetter(letterId)].shortLabel;
}

export function lettersForPillar(pillarId: PillarId): MyRhythmLetterId[] {
  return MYRHYTHM_LETTERS.filter((l) => LETTER_TO_PILLAR[l.id] === pillarId).map((l) => l.id);
}
