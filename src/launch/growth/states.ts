// MyRHYTHM-G — the daily growth-mindset lens over MYRHYTHM.
// 8 states, 1:1 with the MYRHYTHM letters. See mem://brand/myrhythm-g.

export const MYRHYTHM_G_BRAND = 'MyRHYTHM-G' as const;

export type GrowthLetter =
  | 'M1' | 'Y1' | 'R' | 'H1' | 'Y2' | 'T' | 'H2' | 'M2';

export interface GrowthState {
  key: GrowthLetter;
  /** Big letter shown in the chip */
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  /** Short chip label, e.g. "Mindset set" */
  name: string;
  /** One-line first-person prompt */
  prompt: string;
  /** Tailwind color token from the MYRHYTHM palette */
  tone: 'memory' | 'clarity' | 'brain-health' | 'sunrise-amber' | 'beacon';
}

export const GROWTH_STATES: readonly GrowthState[] = [
  { key: 'M1', letter: 'M', name: 'Mindset set',            prompt: "I've decided this matters.",              tone: 'memory' },
  { key: 'Y1', letter: 'Y', name: 'Yes, begun',             prompt: "I've said yes and started.",              tone: 'sunrise-amber' },
  { key: 'R',  letter: 'R', name: 'Rhythm wobble',          prompt: "My rhythm's off — I'm rethinking.",       tone: 'clarity' },
  { key: 'H1', letter: 'H', name: 'Harnessing support',     prompt: "Leaning on my circle to keep going.",     tone: 'brain-health' },
  { key: 'Y2', letter: 'Y', name: 'Yearning for a win',     prompt: "Feeling lost — I need one small win.",    tone: 'sunrise-amber' },
  { key: 'T',  letter: 'T', name: 'Transforming',           prompt: "Turning what happened into what's next.", tone: 'beacon' },
  { key: 'H2', letter: 'H', name: 'Healing through habit',  prompt: "Practising — repetition is doing the work.", tone: 'brain-health' },
  { key: 'M2', letter: 'M', name: 'Mastered & multiplying', prompt: "I've got this — ready to pass it on.",    tone: 'memory' },
] as const;

export const GROWTH_STATE_BY_KEY: Record<GrowthLetter, GrowthState> =
  GROWTH_STATES.reduce((acc, s) => { acc[s.key] = s; return acc; },
    {} as Record<GrowthLetter, GrowthState>);

/** Tailwind classes per tone for chip surfaces. Uses design tokens. */
export const TONE_CLASSES: Record<GrowthState['tone'], { bg: string; ring: string; text: string; activeBg: string }> = {
  'memory':          { bg: 'bg-memory-emerald-50',    ring: 'ring-memory-emerald-200',    text: 'text-memory-emerald-700',    activeBg: 'bg-memory-emerald-100' },
  'clarity':         { bg: 'bg-clarity-teal-50',      ring: 'ring-clarity-teal-200',      text: 'text-clarity-teal-700',      activeBg: 'bg-clarity-teal-100' },
  'brain-health':    { bg: 'bg-brain-health-50',      ring: 'ring-brain-health-200',      text: 'text-brain-health-700',      activeBg: 'bg-brain-health-100' },
  'sunrise-amber':   { bg: 'bg-sunrise-amber-50',     ring: 'ring-sunrise-amber-200',     text: 'text-sunrise-amber-700',     activeBg: 'bg-sunrise-amber-100' },
  'beacon':          { bg: 'bg-beacon-50',            ring: 'ring-beacon-200',            text: 'text-beacon-700',            activeBg: 'bg-beacon-100' },
};
