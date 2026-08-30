// Persona-specific MYRHYTHM assessment banks for /launch/assessment.
// 8 questions, one per letter of M-Y-R-H-Y-T-H-M, each framed around brain health.
// Persona comes from localStorage('myrhythm_user_type'), written by /launch/user-type.

export type PersonaKey = 'brain-injury' | 'caregiver' | 'executive' | 'student';

export type LetterId =
  | 'mindset'        // M  — Mindset
  | 'yesReality'     // Y  — Yes to Reality
  | 'rhythm'         // R  — Rhythm
  | 'harnessSupport' // H  — Harness Support
  | 'yourVictories'  // Y  — Your Victories
  | 'transform'      // T  — Transform
  | 'heal'           // H  — Heal
  | 'multiply';      // M  — Multiply / Meaning

/** Question ids: the 8 MYRHYTHM letters plus the follow-through probe (sits under T). */
export type QuestionId = LetterId | 'followThrough';



export interface AssessmentOption {
  value: string;
  label: string;
  description?: string;
  /** 0 = high friction, 3 = strong brain-health alignment. */
  score: 0 | 1 | 2 | 3;
}

export interface AssessmentQuestion {
  id: QuestionId;
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  word: string;
  /** Which MYRHYTHM letter slot this question belongs to (defaults to its own id). */
  slot?: LetterId;
  brainHealthLens: string;
  title: string;
  subtitle?: string;
  multiSelect?: boolean;
  options: AssessmentOption[];
}

export interface AssessmentBank {
  persona: PersonaKey;
  intro: string;
  /** The "before we begin" step — framed per persona so nobody is asked recovery questions by mistake. */
  preQuestion: {
    title: string;
    subtitle: string;
  };
  questions: AssessmentQuestion[]; // 8 MYRHYTHM letters + follow-through, in order
}


/** Legacy derivation: which harnessSupport values mean "no support". */
const NO_SUPPORT_VALUES = new Set(['solo', 'on-my-own', 'not-yet', 'just-me']);
export function resolveHasSupport(answerValue: string | undefined): boolean {
  if (!answerValue) return false;
  return !NO_SUPPORT_VALUES.has(answerValue);
}

/* ------------------------------------------------------------------ */
/*  Brain-injury persona                                              */
/* ------------------------------------------------------------------ */
const brainInjury: AssessmentBank = {
  persona: 'brain-injury',
  intro: 'Eight gentle questions, one per letter of MYRHYTHM.',
  preQuestion: {
    title: 'When did the experience happen?',
    subtitle: "This helps us calibrate today's questions to where you actually are — whether that's last month or fifteen years ago.",
  },
  questions: [
    {
      id: 'mindset', letter: 'M', word: 'Mindset',
      brainHealthLens: 'Cognitive confidence & self-talk',
      title: 'How do you feel about your brain right now?',
      subtitle: 'Honest is best — no wrong answer.',
      options: [
        { value: 'fragile', label: 'Fragile and frustrated', score: 0 },
        { value: 'cautious', label: 'Cautious but curious', score: 1 },
        { value: 'rebuilding', label: 'Actively rebuilding', score: 2 },
        { value: 'capable', label: 'Capable, just different', score: 3 },
      ],
    },
    {
      id: 'yesReality', letter: 'Y', word: 'Yes to Reality',
      brainHealthLens: 'Honest baseline of current state',
      title: 'Where are you in your recovery?',
      options: [
        { value: 'early', label: 'Early — finding my feet', score: 0 },
        { value: 'mid', label: 'Mid — stitching routine back together', score: 1 },
        { value: 'steady', label: 'Steady — most days work', score: 2 },
        { value: 'thriving', label: 'Thriving on my own terms', score: 3 },
      ],
    },
    {
      id: 'rhythm', letter: 'R', word: 'Rhythm',
      brainHealthLens: 'Energy / cognitive peak window',
      title: 'When does your brain feel clearest?',
      subtitle: "We'll suggest important things in that window.",
      options: [
        { value: 'varies', label: 'It varies day to day', score: 0 },
        { value: 'evening', label: 'Evening', score: 2 },
        { value: 'afternoon', label: 'Afternoon', score: 2 },
        { value: 'morning', label: 'Morning', score: 3 },
      ],
    },
    {
      id: 'harnessSupport', letter: 'H', word: 'Harness Support',
      brainHealthLens: 'Social scaffolding',
      title: "Who's in your corner?",
      options: [
        { value: 'solo', label: 'Prefer solo for now', score: 0 },
        { value: 'building', label: 'Building my circle', score: 1 },
        { value: 'one-person', label: 'One key person', score: 2 },
        { value: 'few-people', label: 'A few trusted people', score: 3 },
      ],
    },
    {
      id: 'yourVictories', letter: 'Y', word: 'Your Victories',
      brainHealthLens: 'Reward & momentum',
      title: 'What would a good week look like?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'steadier-routine', label: 'A steadier routine', score: 2 },
        { value: 'fewer-missed', label: 'Fewer missed things', score: 2 },
        { value: 'more-energy', label: 'More energy left over', score: 3 },
        { value: 'feel-like-me', label: 'Feeling more like myself', score: 3 },
      ],
    },
    {
      id: 'transform', letter: 'T', word: 'Transform',
      brainHealthLens: 'Cognitive load to reduce',
      title: "What's hardest right now?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'memory', label: 'Remembering appointments', score: 0 },
        { value: 'fatigue', label: 'Fatigue and overwhelm', score: 0 },
        { value: 'starting', label: 'Starting tasks', score: 1 },
        { value: 'conversations', label: 'Following conversations', score: 1 },
      ],
    },
    {
      id: 'heal', letter: 'H', word: 'Heal',
      brainHealthLens: 'Restorative habits',
      title: 'What helps your brain reset?',
      options: [
        { value: 'none-yet', label: "Haven't found it yet", score: 0 },
        { value: 'rest', label: 'Quiet rest / nap', score: 2 },
        { value: 'nature', label: 'Time outside / nature', score: 3 },
        { value: 'gentle-movement', label: 'Gentle movement', score: 3 },
      ],
    },
    {
      id: 'multiply', letter: 'M', word: 'Meaning',
      brainHealthLens: 'Purpose & long-term motivation',
      title: 'What would "feeling like yourself" unlock?',
      options: [
        { value: 'just-cope', label: 'Just to cope each day', score: 1 },
        { value: 'connect', label: 'Reconnect with people I love', score: 2 },
        { value: 'work', label: 'Get back to work or study', score: 2 },
        { value: 'help-others', label: 'Help others on this path', score: 3 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Caregiver persona                                                 */
/* ------------------------------------------------------------------ */
const caregiver: AssessmentBank = {
  persona: 'caregiver',
  intro: 'Eight questions shaped around your reality as a carer.',
  preQuestion: {
    title: 'When did this season of caring begin?',
    subtitle: "This helps us calibrate today's questions to where you actually are — whether that's last month or fifteen years ago.",
  },
  questions: [
    {
      id: 'mindset', letter: 'M', word: 'Mindset',
      brainHealthLens: 'Cognitive confidence & self-talk',
      title: 'How is your own headspace right now?',
      options: [
        { value: 'burnt-out', label: 'Burnt out', score: 0 },
        { value: 'stretched', label: 'Stretched but coping', score: 1 },
        { value: 'steady', label: 'Mostly steady', score: 2 },
        { value: 'resourced', label: 'Resourced and clear', score: 3 },
      ],
    },
    {
      id: 'yesReality', letter: 'Y', word: 'Yes to Reality',
      brainHealthLens: 'Honest baseline of current state',
      title: 'How intense is the caring load this season?',
      options: [
        { value: 'crisis', label: 'In crisis mode', score: 0 },
        { value: 'heavy', label: 'Heavy and constant', score: 1 },
        { value: 'manageable', label: 'Manageable most days', score: 2 },
        { value: 'settled', label: 'Settled into a rhythm', score: 3 },
      ],
    },
    {
      id: 'rhythm', letter: 'R', word: 'Rhythm',
      brainHealthLens: 'Your own peak window',
      title: 'When do you have your own bandwidth?',
      subtitle: "We'll protect that window for you.",
      options: [
        { value: 'varies', label: 'Rarely — it varies', score: 0 },
        { value: 'evening', label: 'Evening', score: 2 },
        { value: 'afternoon', label: 'Nap windows / mid-day', score: 2 },
        { value: 'morning', label: 'Early morning', score: 3 },
      ],
    },
    {
      id: 'harnessSupport', letter: 'H', word: 'Harness Support',
      brainHealthLens: 'Social scaffolding',
      title: 'Are other people helping?',
      options: [
        { value: 'not-yet', label: 'Not yet', score: 0 },
        { value: 'want-to-ask', label: "I want to ask but haven't", score: 1 },
        { value: 'occasionally', label: 'Occasionally', score: 2 },
        { value: 'regularly', label: 'Yes, regularly', score: 3 },
      ],
    },
    {
      id: 'yourVictories', letter: 'Y', word: 'Your Victories',
      brainHealthLens: 'Reward & momentum',
      title: 'What would help most this week?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'shared-calendar', label: 'A shared calendar with them', score: 2 },
        { value: 'capture-events', label: 'Quick capture of what happened', score: 2 },
        { value: 'gentler-reminders', label: 'Gentler reminders for them', score: 3 },
        { value: 'clinician-record', label: 'A record I can show the clinician', score: 3 },
      ],
    },
    {
      id: 'transform', letter: 'T', word: 'Transform',
      brainHealthLens: 'Cognitive load to reduce',
      title: 'What drains you most?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'appointments', label: 'Appointment juggling', score: 0 },
        { value: 'repeating', label: 'Repeating myself', score: 0 },
        { value: 'sleep', label: 'My own sleep', score: 0 },
        { value: 'no-me-time', label: 'No time for me', score: 1 },
      ],
    },
    {
      id: 'heal', letter: 'H', word: 'Heal',
      brainHealthLens: 'Restorative habits',
      title: 'What restores you?',
      options: [
        { value: 'none-yet', label: "Haven't found it yet", score: 0 },
        { value: 'solo-time', label: 'Solo quiet time', score: 2 },
        { value: 'friends', label: 'Time with friends', score: 3 },
        { value: 'movement', label: 'Exercise or movement', score: 3 },
      ],
    },
    {
      id: 'multiply', letter: 'M', word: 'Meaning',
      brainHealthLens: 'Purpose & long-term motivation',
      title: 'What keeps you going as a carer?',
      options: [
        { value: 'duty', label: "It's just duty right now", score: 1 },
        { value: 'love', label: 'Love for the person', score: 2 },
        { value: 'their-progress', label: 'Seeing them progress', score: 3 },
        { value: 'shared-purpose', label: 'Shared purpose with others', score: 3 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Executive persona                                                 */
/* ------------------------------------------------------------------ */
const executive: AssessmentBank = {
  persona: 'executive',
  intro: 'Eight questions to shape your focus and defend your best thinking.',
  preQuestion: {
    title: "How long has focus been the thing you're fighting?",
    subtitle: "This helps us calibrate today's questions to your season — a new role, a long grind, or a fresh start.",
  },
  questions: [
    {
      id: 'mindset', letter: 'M', word: 'Mindset',
      brainHealthLens: 'Cognitive confidence & self-talk',
      title: 'How is your cognitive sharpness lately?',
      options: [
        { value: 'foggy', label: 'Foggy and reactive', score: 0 },
        { value: 'inconsistent', label: 'Inconsistent', score: 1 },
        { value: 'mostly-sharp', label: 'Mostly sharp', score: 2 },
        { value: 'on-it', label: 'On it, deliberate', score: 3 },
      ],
    },
    {
      id: 'yesReality', letter: 'Y', word: 'Yes to Reality',
      brainHealthLens: 'Honest baseline of current state',
      title: 'How loaded is your week right now?',
      options: [
        { value: 'overloaded', label: 'Overloaded', score: 0 },
        { value: 'busy', label: 'Busy but moving', score: 1 },
        { value: 'demanding', label: 'Demanding, manageable', score: 2 },
        { value: 'paced', label: 'Well-paced', score: 3 },
      ],
    },
    {
      id: 'rhythm', letter: 'R', word: 'Rhythm',
      brainHealthLens: 'Deep-work window',
      title: 'When is your deep-work window?',
      subtitle: "We'll defend that block on your calendar.",
      options: [
        { value: 'evening', label: 'Evening', score: 2 },
        { value: 'afternoon', label: 'Afternoon', score: 2 },
        { value: 'late-morning', label: 'Late morning', score: 3 },
        { value: 'morning', label: 'Early morning', score: 3 },
      ],
    },
    {
      id: 'harnessSupport', letter: 'H', word: 'Harness Support',
      brainHealthLens: 'Social scaffolding',
      title: 'Who do you sync with?',
      options: [
        { value: 'just-me', label: 'Just me', score: 0 },
        { value: 'partner', label: 'Partner / spouse', score: 2 },
        { value: 'team', label: 'My team', score: 3 },
        { value: 'ea', label: 'EA or chief of staff', score: 3 },
      ],
    },
    {
      id: 'yourVictories', letter: 'Y', word: 'Your Victories',
      brainHealthLens: 'Reward & momentum',
      title: 'What would a winning week deliver?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'focus-blocks', label: 'Protected focus blocks', score: 3 },
        { value: 'fewer-dropped', label: 'Fewer dropped follow-ups', score: 2 },
        { value: 'daily-top-3', label: 'A clear daily top-3', score: 3 },
        { value: 'recovery-time', label: 'Real recovery time', score: 3 },
      ],
    },
    {
      id: 'transform', letter: 'T', word: 'Transform',
      brainHealthLens: 'Cognitive load to reduce',
      title: 'What erodes your focus?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'meetings', label: 'Meeting overload', score: 0 },
        { value: 'context-switch', label: 'Context-switching', score: 0 },
        { value: 'decision-fatigue', label: 'Decision fatigue', score: 0 },
        { value: 'after-hours', label: 'After-hours pings', score: 1 },
      ],
    },
    {
      id: 'heal', letter: 'H', word: 'Heal',
      brainHealthLens: 'Restorative habits',
      title: 'What actually recharges you?',
      options: [
        { value: 'nothing', label: "Nothing reliably yet", score: 0 },
        { value: 'screens-off', label: 'Screens off / quiet', score: 2 },
        { value: 'sleep', label: 'Proper sleep', score: 3 },
        { value: 'exercise', label: 'Hard exercise', score: 3 },
      ],
    },
    {
      id: 'multiply', letter: 'M', word: 'Meaning',
      brainHealthLens: 'Purpose & long-term motivation',
      title: 'What is this season of work really for?',
      options: [
        { value: 'survival', label: 'Survival mode', score: 1 },
        { value: 'ambition', label: 'Personal ambition', score: 2 },
        { value: 'team-impact', label: 'Building my team', score: 3 },
        { value: 'legacy', label: 'Long-term legacy', score: 3 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Student persona                                                   */
/* ------------------------------------------------------------------ */
const student: AssessmentBank = {
  persona: 'student',
  intro: 'Eight questions to pace your term.',
  preQuestion: {
    title: 'How long has this study season been running?',
    subtitle: "This helps us calibrate today's questions to where you actually are — first weeks of a course or deep into a long haul.",
  },
  questions: [
    {
      id: 'mindset', letter: 'M', word: 'Mindset',
      brainHealthLens: 'Cognitive confidence & self-talk',
      title: 'How confident do you feel about learning right now?',
      options: [
        { value: 'doubting', label: 'Doubting myself', score: 0 },
        { value: 'mixed', label: 'Mixed', score: 1 },
        { value: 'getting-there', label: 'Getting there', score: 2 },
        { value: 'capable', label: 'I know I can do this', score: 3 },
      ],
    },
    {
      id: 'yesReality', letter: 'Y', word: 'Yes to Reality',
      brainHealthLens: 'Honest baseline of current state',
      title: 'Where are you in the term?',
      options: [
        { value: 'behind', label: 'Behind and stressed', score: 0 },
        { value: 'catching-up', label: 'Catching up', score: 1 },
        { value: 'on-track', label: 'On track', score: 2 },
        { value: 'ahead', label: 'Ahead of schedule', score: 3 },
      ],
    },
    {
      id: 'rhythm', letter: 'R', word: 'Rhythm',
      brainHealthLens: 'When learning sticks best',
      title: 'When do you study best?',
      subtitle: "We'll suggest study blocks in that window.",
      options: [
        { value: 'late-night', label: 'Late night', score: 1 },
        { value: 'evening', label: 'Evening', score: 2 },
        { value: 'afternoon', label: 'Afternoon', score: 2 },
        { value: 'morning', label: 'Morning', score: 3 },
      ],
    },
    {
      id: 'harnessSupport', letter: 'H', word: 'Harness Support',
      brainHealthLens: 'Accountability scaffolding',
      title: 'Who keeps you accountable?',
      options: [
        { value: 'on-my-own', label: 'On my own', score: 0 },
        { value: 'family', label: 'Family', score: 2 },
        { value: 'study-group', label: 'Study group', score: 3 },
        { value: 'tutor', label: 'Tutor or mentor', score: 3 },
      ],
    },
    {
      id: 'yourVictories', letter: 'Y', word: 'Your Victories',
      brainHealthLens: 'Reward & momentum',
      title: "What's the goal this term?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'study-rhythm', label: 'Steadier study rhythm', score: 3 },
        { value: 'better-recall', label: 'Better recall', score: 3 },
        { value: 'finish-on-time', label: 'Finish on time', score: 2 },
        { value: 'reduce-stress', label: 'Reduce stress', score: 3 },
      ],
    },
    {
      id: 'transform', letter: 'T', word: 'Transform',
      brainHealthLens: 'Cognitive load to reduce',
      title: "What's getting in the way?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'procrastination', label: 'Procrastination', score: 0 },
        { value: 'recall', label: 'Recall under pressure', score: 0 },
        { value: 'volume', label: 'Overwhelm with volume', score: 0 },
        { value: 'energy', label: 'Sleep and energy', score: 1 },
      ],
    },
    {
      id: 'heal', letter: 'H', word: 'Heal',
      brainHealthLens: 'Restorative habits',
      title: 'What actually recharges your brain?',
      options: [
        { value: 'none-yet', label: "Haven't found it yet", score: 0 },
        { value: 'friends', label: 'Time with friends', score: 2 },
        { value: 'sleep', label: 'Proper sleep', score: 3 },
        { value: 'movement', label: 'Exercise / sport', score: 3 },
      ],
    },
    {
      id: 'multiply', letter: 'M', word: 'Meaning',
      brainHealthLens: 'Purpose & long-term motivation',
      title: 'Why does this study matter to you?',
      options: [
        { value: 'have-to', label: 'I just have to do it', score: 1 },
        { value: 'qualification', label: 'For the qualification', score: 2 },
        { value: 'career', label: 'For the career I want', score: 3 },
        { value: 'change-world', label: 'To change something I care about', score: 3 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Follow-through probe (sits under T — Transform)                    */
/*  Follow-through is the single strongest signal of whether a plan    */
/*  survives contact with real life, so every persona is asked.        */
/* ------------------------------------------------------------------ */
const FOLLOW_THROUGH: Record<PersonaKey, AssessmentQuestion> = {
  'brain-injury': {
    id: 'followThrough', letter: 'T', word: 'Transform', slot: 'transform',
    brainHealthLens: 'Follow-through — plan to done',
    title: 'When you plan something, what usually happens?',
    subtitle: 'This is the honest one. Most people lose things here.',
    options: [
      { value: 'forget', label: 'I often forget it entirely', score: 0 },
      { value: 'remember-not-do', label: 'I remember, but rarely get to it', score: 1 },
      { value: 'need-nudge', label: 'I do it if something reminds me', score: 2 },
      { value: 'mostly-follow', label: 'I mostly follow through', score: 3 },
    ],
  },
  caregiver: {
    id: 'followThrough', letter: 'T', word: 'Transform', slot: 'transform',
    brainHealthLens: 'Follow-through — plan to done',
    title: 'When you plan something for yourself, what usually happens?',
    subtitle: 'Not for them — for you.',
    options: [
      { value: 'never-happens', label: "It gets dropped for someone else's need", score: 0 },
      { value: 'sometimes', label: 'Sometimes, if the day is calm', score: 1 },
      { value: 'need-nudge', label: 'I do it if something reminds me', score: 2 },
      { value: 'mostly-follow', label: 'I mostly follow through', score: 3 },
    ],
  },
  executive: {
    id: 'followThrough', letter: 'T', word: 'Transform', slot: 'transform',
    brainHealthLens: 'Follow-through — commitment to done',
    title: 'What happens to the commitments you make in meetings?',
    options: [
      { value: 'lost', label: 'They get lost after the call ends', score: 0 },
      { value: 'late', label: 'They happen, but late and under pressure', score: 1 },
      { value: 'need-system', label: 'They happen when my system catches them', score: 2 },
      { value: 'reliable', label: 'I close them out reliably', score: 3 },
    ],
  },
  student: {
    id: 'followThrough', letter: 'T', word: 'Transform', slot: 'transform',
    brainHealthLens: 'Follow-through — intention to done',
    title: 'What happens to the study plan you set for yourself?',
    options: [
      { value: 'abandoned', label: 'It falls apart within a day or two', score: 0 },
      { value: 'cram', label: 'I drift, then cram at the end', score: 1 },
      { value: 'need-nudge', label: 'I keep it going if I get reminders', score: 2 },
      { value: 'stick', label: 'I stick to it most weeks', score: 3 },
    ],
  },
};

/** Insert the follow-through probe immediately after the Transform question. */
function withFollowThrough(bank: AssessmentBank): AssessmentBank {
  const questions = [...bank.questions];
  const idx = questions.findIndex((q) => q.id === 'transform');
  questions.splice(idx >= 0 ? idx + 1 : questions.length, 0, FOLLOW_THROUGH[bank.persona]);
  return { ...bank, questions };
}

const banks: Record<PersonaKey, AssessmentBank> = {
  'brain-injury': withFollowThrough(brainInjury),
  caregiver: withFollowThrough(caregiver),
  executive: withFollowThrough(executive),
  student: withFollowThrough(student),
};


export function getAssessmentBank(persona: string | null | undefined): AssessmentBank | null {
  if (!persona) return null;
  const legacyMap: Record<string, PersonaKey> = {
    recovery: 'brain-injury',
    'goal-achiever': 'executive',
    productivity: 'executive',
    wellness: 'brain-injury',
  };
  const key = (persona in banks ? persona : legacyMap[persona]) as PersonaKey | undefined;
  if (key && key in banks) return banks[key];
  return null;
}

export const PERSONA_LABEL: Record<PersonaKey, string> = {
  'brain-injury': 'Rebuilding after a brain change',
  caregiver: 'Caring for someone I love',
  executive: 'Protecting my focus at work',
  student: 'Studying and learning',
};

/* ------------------------------------------------------------------ */
/*  Scoring                                                           */
/* ------------------------------------------------------------------ */

export type LetterScores = Record<LetterId, number> & Partial<Record<QuestionId, number>>;

export interface AssessmentAnswer {
  primary: string;
  alsoFits: string[];
}

export interface BrainHealthScore {
  /** Normalised 0-100. */
  total: number;
  /** Raw per-letter score, 0-3 each. */
  letters: LetterScores;
  /** Snapshot version — bump when question banks or scoring change. */
  version: 2;
}

/** Accept legacy string/string[] answers and normalise to {primary, alsoFits}. */
export function normalizeAnswer(raw: unknown): AssessmentAnswer | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { primary: raw, alsoFits: [] };
  if (Array.isArray(raw)) {
    if (!raw.length) return null;
    return { primary: raw[0], alsoFits: raw.slice(1) };
  }
  if (typeof raw === 'object' && 'primary' in (raw as any)) {
    const r = raw as AssessmentAnswer;
    return { primary: r.primary, alsoFits: Array.isArray(r.alsoFits) ? r.alsoFits : [] };
  }
  return null;
}

/**
 * Compute the Brain Health Score.
 * Primary option contributes its full 0-3 score.
 * Each "also fits" option adds +0.5, capped at the letter max of 3.
 */
export function computeBrainHealthScore(
  bank: AssessmentBank,
  answers: Record<string, unknown>
): BrainHealthScore {
  const letters = {} as LetterScores;
  let raw = 0;
  for (const q of bank.questions) {
    const ans = normalizeAnswer(answers[q.id]);
    let score = 0;
    if (ans) {
      const primaryOpt = q.options.find((o) => o.value === ans.primary);
      score = primaryOpt?.score ?? 0;
      score = Math.min(3, score + 0.5 * ans.alsoFits.length);
    }
    letters[q.id] = Math.round(score * 10) / 10;
    raw += score;
  }
  const total = Math.round((raw / (bank.questions.length * 3)) * 100);
  return { total, letters, version: 2 };
}
