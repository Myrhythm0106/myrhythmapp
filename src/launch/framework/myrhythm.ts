/**
 * MYRHYTHM — the canonical framework definition.
 *
 * Single source of truth for the eight letters, their words, plain-English meaning
 * and the published research domain each one is anchored to.
 *
 * Positioning: MyRhythm's framework is compatible with, and informed by, established
 * brain-health programmes and public behavioural-science literature. The wording,
 * sequence and application are MyRhythm's own. No named individual or third-party
 * programme is cited in-app.
 *
 * Claims discipline (docs/claims-policy.md): every line below stays inside
 * confidence, identity, behaviour and quality of life. No clinical outcome verb is
 * attached to a medical noun. No effect sizes, no outcome promises.
 */

export type MyRhythmLetterId =
  | 'mindset'
  | 'yesReality'
  | 'rhythm'
  | 'harnessSupport'
  | 'yourVictories'
  | 'transform'
  | 'heal'
  | 'meaning';

export interface MyRhythmLetter {
  id: MyRhythmLetterId;
  /** The letter as it appears in M-Y-R-H-Y-T-H-M */
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  /** Canonical word. Never reworded per-surface. */
  word: string;
  /** One line of plain English: what this lever actually is. */
  meaning: string;
  /** One line on why it earns a place in the framework. */
  why: string;
  /** Short, neutral label for the research domain behind it. */
  evidence: string;
  /** Matching MyRHYTHM-G growth-state key. */
  growthKey: 'M1' | 'Y1' | 'R' | 'H1' | 'Y2' | 'T' | 'H2' | 'M2';
}

export const MYRHYTHM_LETTERS: readonly MyRhythmLetter[] = [
  {
    id: 'mindset',
    letter: 'M',
    word: 'Mindset',
    meaning: 'How you talk to yourself about your own mind sets the tone for everything after it.',
    why: 'Believing effort changes outcomes is what makes anyone try a second time.',
    evidence: 'Growth-mindset and self-efficacy research',
    growthKey: 'M1',
  },
  {
    id: 'yesReality',
    letter: 'Y',
    word: 'Yes to Reality',
    meaning: 'An honest starting point beats an optimistic one. We plan from where you actually are.',
    why: 'Plans built on a truthful baseline are the ones that survive a bad day.',
    evidence: 'Acceptance-based behaviour change and honest baselining',
    growthKey: 'Y1',
  },
  {
    id: 'rhythm',
    letter: 'R',
    word: 'Rhythm',
    meaning: 'Attention rises and falls through the day. Important things belong in your clearest window.',
    why: 'Matching the task to the window removes effort you would otherwise have to find.',
    evidence: 'Circadian and ultradian variation in alertness',
    growthKey: 'R',
  },
  {
    id: 'harnessSupport',
    letter: 'H',
    word: 'Harness Support',
    meaning: 'People who know your plan make it far more likely to happen.',
    why: 'Being seen turns a private intention into a shared one.',
    evidence: 'Social connection and follow-through research',
    growthKey: 'H1',
  },
  {
    id: 'yourVictories',
    letter: 'Y',
    word: 'Your Victories',
    meaning: 'Noticing what went well is how momentum is built and kept.',
    why: 'Small, visible progress is the strongest everyday motivator there is.',
    evidence: 'The progress principle and small-win reinforcement',
    growthKey: 'Y2',
  },
  {
    id: 'transform',
    letter: 'T',
    word: 'Transform',
    meaning: 'Shrink the friction. Fewer things to hold in your head, more things that happen.',
    why: 'Deciding when and where in advance closes the gap between intention and action.',
    evidence: 'Implementation intentions and friction reduction',
    growthKey: 'T',
  },
  {
    id: 'heal',
    letter: 'H',
    word: 'Heal',
    meaning: 'Sleep, movement, food and rest are the quiet infrastructure of a good day.',
    why: 'Everything above works better when the basics are not running on empty.',
    evidence: 'Sleep, movement, nutrition and rest as daily performance inputs',
    growthKey: 'H2',
  },
  {
    id: 'meaning',
    letter: 'M',
    word: 'Meaning',
    meaning: 'A reason that matters to you is what keeps a plan going when motivation dips.',
    why: 'Purpose is what people reach for when discipline runs out.',
    evidence: 'Purpose and values-based goal persistence',
    growthKey: 'M2',
  },
] as const;

export const MYRHYTHM_BY_ID: Record<MyRhythmLetterId, MyRhythmLetter> =
  MYRHYTHM_LETTERS.reduce((acc, l) => {
    acc[l.id] = l;
    return acc;
  }, {} as Record<MyRhythmLetterId, MyRhythmLetter>);

export const MYRHYTHM_BY_GROWTH_KEY: Record<MyRhythmLetter['growthKey'], MyRhythmLetter> =
  MYRHYTHM_LETTERS.reduce((acc, l) => {
    acc[l.growthKey] = l;
    return acc;
  }, {} as Record<MyRhythmLetter['growthKey'], MyRhythmLetter>);

/** Word for a growth-state key, so MyRHYTHM-G never drifts from the framework. */
export const wordForGrowthKey = (key: MyRhythmLetter['growthKey']): string =>
  MYRHYTHM_BY_GROWTH_KEY[key].word;

/** How the framework's basis is described in-app. No named person or programme. */
export const FRAMEWORK_BASIS =
  'Each letter is anchored to a well-established idea in behavioural and brain-health research. ' +
  'The framework is compatible with, and informed by, established brain-health programmes — ' +
  'the wording, order and the way MyRhythm uses it are our own.';

/** Standard non-clinical disclaimer for framework surfaces. */
export const FRAMEWORK_DISCLAIMER =
  'MyRhythm is a planning and follow-through companion. It does not diagnose, treat or fix ' +
  'any condition, and it is not a substitute for medical or rehabilitation advice.';
