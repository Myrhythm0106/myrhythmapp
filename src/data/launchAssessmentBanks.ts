// Persona-specific assessment banks for /launch/assessment.
// Persona comes from localStorage('myrhythm_user_type'), written by /launch/user-type.

export type PersonaKey = 'brain-injury' | 'caregiver' | 'executive' | 'student';

export interface AssessmentOption {
  value: string;
  label: string;
  description?: string;
}

export interface AssessmentQuestion {
  id: 'rhythmPreference' | 'keyStruggles' | 'goals' | 'hasSupport';
  title: string;
  subtitle?: string;
  multiSelect?: boolean;
  options: AssessmentOption[];
}

export interface AssessmentBank {
  persona: PersonaKey;
  intro: string; // short line shown above progress bar
  questions: AssessmentQuestion[];
}

/** Values for Q4 (hasSupport) that should resolve to `hasSupport: false`. */
const NO_SUPPORT_VALUES = new Set(['solo', 'on-my-own', 'not-yet', 'just-me']);

export function resolveHasSupport(answerValue: string | undefined): boolean {
  if (!answerValue) return false;
  return !NO_SUPPORT_VALUES.has(answerValue);
}

const brainInjury: AssessmentBank = {
  persona: 'brain-injury',
  intro: 'A few gentle questions so we can shape your rhythm.',
  questions: [
    {
      id: 'rhythmPreference',
      title: 'When does your brain feel clearest?',
      subtitle: "We'll suggest the important things in that window.",
      options: [
        { value: 'morning', label: 'Morning', description: 'Clearest before noon' },
        { value: 'afternoon', label: 'Afternoon', description: 'Mid-day is best' },
        { value: 'evening', label: 'Evening', description: 'Later in the day' },
        { value: 'varies', label: 'It varies', description: 'Different every day' },
      ],
    },
    {
      id: 'keyStruggles',
      title: "What's hardest right now?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'memory', label: 'Remembering appointments', description: 'Things slip past me' },
        { value: 'fatigue', label: 'Fatigue and overwhelm', description: 'Energy runs out fast' },
        { value: 'starting', label: 'Starting tasks', description: 'I freeze before I begin' },
        { value: 'conversations', label: 'Following conversations', description: 'Hard to keep up live' },
      ],
    },
    {
      id: 'goals',
      title: 'What would a good week look like?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'steadier-routine', label: 'A steadier routine' },
        { value: 'fewer-missed', label: 'Fewer missed things' },
        { value: 'more-energy', label: 'More energy left over' },
        { value: 'feel-like-me', label: 'Feeling more like myself' },
      ],
    },
    {
      id: 'hasSupport',
      title: "Who's in your corner?",
      subtitle: 'Just so we know how much to lean on them.',
      options: [
        { value: 'few-people', label: 'A few people', description: 'Family and friends nearby' },
        { value: 'one-person', label: 'One key person', description: 'My anchor' },
        { value: 'building', label: 'Building it', description: 'Working on my circle' },
        { value: 'solo', label: 'Prefer solo for now', description: 'Just me for the moment' },
      ],
    },
  ],
};

const caregiver: AssessmentBank = {
  persona: 'caregiver',
  intro: "A few quick questions so we can match your reality.",
  questions: [
    {
      id: 'rhythmPreference',
      title: 'When do you have your own bandwidth?',
      subtitle: "We'll protect that window for you.",
      options: [
        { value: 'morning', label: 'Early morning' },
        { value: 'afternoon', label: 'Nap windows / mid-day' },
        { value: 'evening', label: 'Evening' },
        { value: 'varies', label: 'Rarely — it varies' },
      ],
    },
    {
      id: 'keyStruggles',
      title: 'What drains you most?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'appointments', label: 'Appointment juggling' },
        { value: 'repeating', label: 'Repeating myself' },
        { value: 'sleep', label: 'My own sleep' },
        { value: 'no-me-time', label: 'No time for me' },
      ],
    },
    {
      id: 'goals',
      title: 'What would help most?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'shared-calendar', label: 'Shared calendar with them' },
        { value: 'capture-events', label: 'Quick capture of what happened' },
        { value: 'gentler-reminders', label: 'Gentler reminders for them' },
        { value: 'clinician-record', label: 'A record I can show the clinician' },
      ],
    },
    {
      id: 'hasSupport',
      title: 'Are other people helping?',
      subtitle: 'Family, friends or paid support.',
      options: [
        { value: 'regularly', label: 'Yes, regularly' },
        { value: 'occasionally', label: 'Occasionally' },
        { value: 'not-yet', label: 'Not yet' },
        { value: 'want-to-ask', label: 'I want to ask but haven\'t' },
      ],
    },
  ],
};

const executive: AssessmentBank = {
  persona: 'executive',
  intro: 'Four questions to shape your focus.',
  questions: [
    {
      id: 'rhythmPreference',
      title: 'When is your deep-work window?',
      subtitle: "We'll defend that block on your calendar.",
      options: [
        { value: 'morning', label: 'Early morning' },
        { value: 'late-morning', label: 'Late morning' },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'evening', label: 'Evening' },
      ],
    },
    {
      id: 'keyStruggles',
      title: 'What erodes your focus?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'meetings', label: 'Meeting overload' },
        { value: 'context-switch', label: 'Context-switching' },
        { value: 'decision-fatigue', label: 'Decision fatigue' },
        { value: 'after-hours', label: 'After-hours pings' },
      ],
    },
    {
      id: 'goals',
      title: 'What would a winning week deliver?',
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'focus-blocks', label: 'Protected focus blocks' },
        { value: 'fewer-dropped', label: 'Fewer dropped follow-ups' },
        { value: 'daily-top-3', label: 'A clear daily top-3' },
        { value: 'recovery-time', label: 'Real recovery time' },
      ],
    },
    {
      id: 'hasSupport',
      title: 'Who do you sync with?',
      subtitle: 'So invites and digests land in the right place.',
      options: [
        { value: 'team', label: 'My team' },
        { value: 'ea', label: 'EA or chief of staff' },
        { value: 'partner', label: 'Partner / spouse' },
        { value: 'just-me', label: 'Just me' },
      ],
    },
  ],
};

const student: AssessmentBank = {
  persona: 'student',
  intro: 'Four questions to pace your term.',
  questions: [
    {
      id: 'rhythmPreference',
      title: 'When do you study best?',
      subtitle: "We'll suggest study blocks in that window.",
      options: [
        { value: 'morning', label: 'Morning' },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'evening', label: 'Evening' },
        { value: 'late-night', label: 'Late night' },
      ],
    },
    {
      id: 'keyStruggles',
      title: "What's getting in the way?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'procrastination', label: 'Procrastination' },
        { value: 'recall', label: 'Recall under pressure' },
        { value: 'volume', label: 'Overwhelm with volume' },
        { value: 'energy', label: 'Sleep and energy' },
      ],
    },
    {
      id: 'goals',
      title: "What's the goal this term?",
      subtitle: 'Pick anything that fits.',
      multiSelect: true,
      options: [
        { value: 'study-rhythm', label: 'Steadier study rhythm' },
        { value: 'better-recall', label: 'Better recall' },
        { value: 'finish-on-time', label: 'Finish on time' },
        { value: 'reduce-stress', label: 'Reduce stress' },
      ],
    },
    {
      id: 'hasSupport',
      title: 'Who keeps you accountable?',
      options: [
        { value: 'study-group', label: 'Study group' },
        { value: 'tutor', label: 'Tutor or mentor' },
        { value: 'family', label: 'Family' },
        { value: 'on-my-own', label: 'On my own' },
      ],
    },
  ],
};

const banks: Record<PersonaKey, AssessmentBank> = {
  'brain-injury': brainInjury,
  caregiver,
  executive,
  student,
};

export function getAssessmentBank(persona: string | null | undefined): AssessmentBank | null {
  if (!persona) return null;
  if (persona in banks) return banks[persona as PersonaKey];
  return null;
}

export const PERSONA_LABEL: Record<PersonaKey, string> = {
  'brain-injury': 'Rebuilding after a brain change',
  caregiver: 'Caring for someone I love',
  executive: 'Protecting my focus at work',
  student: 'Studying and learning',
};
