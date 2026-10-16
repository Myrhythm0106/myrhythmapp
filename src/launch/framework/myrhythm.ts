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
    word: 'What matters to me',
    meaning: 'Start with what matters to me and the life I want support to be part of.',
    why: 'A plan built around what matters is the one I keep coming back to.',
    evidence: 'Values-based goal setting and self-determination research',
    growthKey: 'M1',
  },
  {
    id: 'yesReality',
    letter: 'Y',
    word: 'Your brain, your starting point',
    meaning: 'Notice my energy, rest, mood and everyday habits so support fits where I am today.',
    why: 'Plans built on an honest starting point survive a bad day.',
    evidence: 'Everyday brain-health habits and honest baselining',
    growthKey: 'Y1',
  },
  {
    id: 'rhythm',
    letter: 'R',
    word: 'Remember what matters',
    meaning: 'Capture important information once and find it again when I need it.',
    why: 'What is written down and easy to find no longer has to be held in my head.',
    evidence: 'External memory aids and prospective-memory research',
    growthKey: 'R',
  },
  {
    id: 'harnessSupport',
    letter: 'H',
    word: 'Help me begin',
    meaning: 'Find a clear first step that feels possible.',
    why: 'Starting is often the hardest part. One small step makes it easier.',
    evidence: 'Task initiation and goal-breakdown research',
    growthKey: 'H1',
  },
  {
    id: 'yourVictories',
    letter: 'Y',
    word: 'Your pace, your capacity',
    meaning: 'Make room for plans that fit my energy and attention. Important things go in my clearest hours.',
    why: 'Matching the task to my energy removes effort I would otherwise have to find.',
    evidence: 'Daily variation in alertness and energy pacing',
    growthKey: 'Y2',
  },
  {
    id: 'transform',
    letter: 'T',
    word: 'Turn intention into follow-through',
    meaning: 'Act on what I planned, return when life interrupts, and speak to myself kindly when something slips.',
    why: 'Deciding when and where in advance, with a kind inner voice, closes the gap between intention and action.',
    evidence: 'Implementation intentions, self-compassion and growth-mindset research',
    growthKey: 'T',
  },
  {
    id: 'heal',
    letter: 'H',
    word: 'Help that works for me',
    meaning: 'Choose who supports me, what they can see and how they can help.',
    why: 'Being supported, on my terms, turns a private intention into a shared one.',
    evidence: 'Social connection and follow-through research',
    growthKey: 'H2',
  },
  {
    id: 'meaning',
    letter: 'M',
    word: 'My progress, my next choice',
    meaning: 'Recognise what I have managed and choose my next step.',
    why: 'Small, visible progress is the strongest everyday motivator there is.',
    evidence: 'The progress principle and small-win reinforcement',
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
