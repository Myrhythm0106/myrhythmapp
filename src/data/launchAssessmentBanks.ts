// Shared, plain-language assessment for /launch/assessment.
// Part 1 reflects everyday brain-health habits. Part 2 captures user-owned planning preferences.
// Source codes map only to the internal reference log; no practitioner or programme names appear here.

import type { PillarId } from '@/launch/framework/cognitiveCapital';
import type { YesId } from '@/launch/framework/yes';

export const ASSESSMENT_SCHEMA_VERSION = 7;
export type PersonaKey = 'brain-injury' | 'caregiver' | 'executive' | 'student' | 'general';
export type LetterId =
  | 'mindset' | 'yesReality' | 'rhythm' | 'harnessSupport'
  | 'yourVictories' | 'transform' | 'heal' | 'multiply';
export type HabitId =
  | 'habitSleep' | 'habitMove' | 'habitFuel' | 'habitProtect'
  | 'habitExposure' | 'habitCalm' | 'habitLearnConnect' | 'habitPurpose';
export type PlanningId = 'rhythmDetail' | 'planningRhythm' | 'planningSupport' | 'planningGoal'
  | 'memorySlips' | 'memoryMethod' | 'memoryRecall' | 'dayStart' | 'energyDip'
  | 'mindsetTalk' | 'hardSituations' | 'weekFixed' | 'circleHelp' | 'winsStyle'
  | 'reminderStyle' | 'reminderLead' | 'hardDays' | 'visionAreas'
  | 'findAgain' | 'mindsetSlip' | 'startHard' | 'reminderStop' | 'harderToKeep' | 'dayGoesWell'
  | 'interrupts' | 'progressLooks' | 'pauseSigns' | 'healthChanges' | 'stepsEasy' | 'decideFirst'
  | 'planOverload' | 'distractions' | 'returnAfter' | 'shareComfort' | 'checkInStyle' | 'oneChoice'
  | 'controlStyle';
export type QuestionId = LetterId | 'followThrough' | HabitId | PlanningId;

export interface AssessmentOption {
  value: string;
  label: string;
  description?: string;
  score: 0 | 1 | 2 | 3;
  /** Instant first-person reply shown after choosing this answer. */
  reply?: string;
}

export interface RhythmDetailRow {
  id: 'focusLength' | 'energyDrain';
  label: string;
  options: { value: string; label: string }[];
}

export interface AssessmentQuestion {
  id: QuestionId;
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  word: string;
  slot?: LetterId;
  pillar: PillarId;
  brainHealthLens: string;
  title: string;
  subtitle?: string;
  multiSelect?: boolean;
  /** YES part (Quick Start only). */
  yes?: YesId;
  /** quick = YES assessment; full = MYRHYTHM Full Picture. */
  tier: 'quick' | 'full';
  kind?: 'default' | 'rhythm-detail' | 'day-strip';
  /** Promise group shown above Quick Start questions. */
  promise?: string;
  /** Answered inside another step (e.g. the day-strip); never shown on its own. */
  hidden?: boolean;
  rows?: RhythmDetailRow[];
  options: AssessmentOption[];
  section: 'brain-health' | 'planning';
  scored: boolean;
}

export const RHYTHM_DETAIL_ROWS: RhythmDetailRow[] = [
  {
    id: 'focusLength',
    label: 'How long can I comfortably focus at one time?',
    options: [
      { value: '20', label: 'About 20 minutes' },
      { value: '45', label: 'About 45 minutes' },
      { value: '90', label: 'An hour or longer' },
    ],
  },
  {
    id: 'energyDrain',
    label: 'What drains my energy fastest?',
    options: [
      { value: 'back-to-back', label: 'Too many things together' },
      { value: 'noise-crowds', label: 'Noise or busy places' },
      { value: 'decisions', label: 'Too many decisions' },
    ],
  },
];

export interface AssessmentBank {
  persona: PersonaKey;
  intro: string;
  preQuestion: { title: string; subtitle: string };
  /** Every question (used for lookups and history). */
  questions: AssessmentQuestion[];
  quickQuestions: AssessmentQuestion[];
  fullQuestions: AssessmentQuestion[];
}

const NO_SUPPORT_VALUES = new Set(['solo', 'none-yet', 'on-my-own', 'not-yet', 'just-me']);
export function resolveHasSupport(answerValue: string | undefined): boolean {
  return Boolean(answerValue && !NO_SUPPORT_VALUES.has(answerValue));
}


const QUESTIONS: AssessmentQuestion[] = [
  /* ================= Quick Start · CAPTURES IT ================= */
  {
    id: 'memorySlips', yes: 'Y', tier: 'quick', promise: 'Captures it', letter: 'R', word: 'Remember what matters', slot: 'rhythm', pillar: 'psychological',
    brainHealthLens: 'What I most want help remembering', // ref BH-09
    title: 'Which of these has caught me out lately?',
    subtitle: 'This is what I most want help remembering.',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'appointments', label: 'A date or appointment I completely missed', score: 0, reply: "Got it. I'll guard your appointments first, with a reminder the evening before." },
      { value: 'half-done', label: 'Something I started and never finished', score: 0, reply: "Got it. I'll gently bring unfinished things back to you, so they don't get lost." },
      { value: 'what-was-said', label: 'What someone told me, gone by the next day', score: 0, reply: "Got it. I'll turn conversations into a short note you can check any time." },
      { value: 'where-things-are', label: 'Searching for my keys, phone or papers', score: 0, reply: "Got it. I'll help you keep track of the things that matter." },
    ],
  },
  {
    id: 'memoryRecall', yes: 'Y', tier: 'quick', promise: 'Captures it', letter: 'R', word: 'Remember what matters', slot: 'rhythm', pillar: 'psychological',
    brainHealthLens: 'Remembering what was agreed', // ref BH-09
    title: 'I’ve just left an important appointment. By the time I’m home, what’s left?',
    section: 'planning', scored: false,
    options: [
      { value: 'most', label: 'Most of it. I’m fine for now.', score: 0, reply: "Good. I'll still keep a copy, so nothing fades by next week." },
      { value: 'main-points', label: 'The gist, but the details have gone.', score: 0, reply: "Then I'll keep the details for you, word for word." },
      { value: 'little', label: 'Hardly anything. I’ll have to ask someone.', score: 0, reply: "Then I'll listen for you. Every word is kept and every next step is pulled out." },
      { value: 'unsure', label: 'I’m not even sure what was decided.', score: 0, reply: "Then I'll show you exactly what was agreed, in plain words." },
    ],
  },

  /* ================= Quick Start · PLANS IT ================= */
  {
    id: 'planningRhythm', yes: 'S', tier: 'quick', promise: 'Plans it', kind: 'day-strip', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'When my thinking is clearest and when energy drops',
    title: 'Tap when I’m sharp, and when I’m running on empty.',
    subtitle: 'Important things go in my sharp times. My empty times stay light.',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'morning', label: 'Morning', score: 0, reply: "I'll put important things in your mornings." },
      { value: 'afternoon', label: 'Afternoon', score: 0, reply: "I'll put important things in your afternoons." },
      { value: 'evening', label: 'Evening', score: 0, reply: "I'll put important things in your evenings." },
      { value: 'varies', label: 'It changes day to day', score: 0, reply: "I'll check in and adjust, day by day." },
    ],
  },
  {
    id: 'energyDip', yes: 'S', tier: 'quick', hidden: true, letter: 'Y', word: 'Your pace, your capacity', slot: 'yourVictories', pillar: 'biological',
    brainHealthLens: 'When energy usually drops',
    title: 'And when am I running on empty?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'mid-morning', label: 'Mid-morning', score: 0, reply: 'Mid-mornings stay light.' },
      { value: 'after-lunch', label: 'After lunch', score: 0, reply: 'After lunch stays light.' },
      { value: 'late-afternoon', label: 'Late afternoon', score: 0, reply: 'Late afternoons stay light.' },
      { value: 'evening', label: 'Evening', score: 0, reply: 'Evenings stay light.' },
    ],
  },

  /* ================= Quick Start · KEEPS IT ================= */
  {
    id: 'findAgain', yes: 'Y', tier: 'quick', promise: 'Keeps it', letter: 'R', word: 'Remember what matters', slot: 'rhythm', pillar: 'psychological',
    brainHealthLens: 'Keeping what was agreed',
    title: 'A week after an appointment, someone asks what was agreed. I…',
    section: 'planning', scored: false,
    options: [
      { value: 'rarely', label: 'Know exactly, and can show them', score: 0, reply: "Great. I'll keep it that way, with the note and every step ready to show." },
      { value: 'sometimes', label: 'Remember roughly', score: 0, reply: "I'll keep the note and every step, so roughly becomes exactly." },
      { value: 'often', label: 'Have to guess, or ask someone else', score: 0, reply: "Not any more. I'll keep the note and every step, ready to show anyone you choose." },
    ],
  },

  /* ================= Quick Start · FOLLOWS IT THROUGH ================= */
  {
    id: 'startHard', yes: 'S', tier: 'quick', promise: 'Follows it through', letter: 'H', word: 'Help me begin', slot: 'harnessSupport', pillar: 'psychological',
    brainHealthLens: 'What makes starting hard',
    title: 'When I know what I need to do, what stops me starting?',
    section: 'planning', scored: false,
    options: [
      { value: 'too-big', label: 'It feels too big', score: 0, reply: "I'll break it into one small first step." },
      { value: 'where-start', label: 'I don’t know where to begin', score: 0, reply: "I'll show you the first step, so you don't have to work it out." },
      { value: 'energy', label: 'I don’t have the energy', score: 0, reply: "I'll place it when your energy is highest." },
      { value: 'forget', label: 'I forget I meant to', score: 0, reply: "I'll remind you at the right moment." },
    ],
  },
  {
    id: 'reminderStop', yes: 'S', tier: 'quick', promise: 'Follows it through', letter: 'T', word: 'Turn intention into follow-through', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'What gets between a reminder and action',
    title: 'When a reminder goes off, what stops me acting on it?',
    section: 'planning', scored: false,
    options: [
      { value: 'wrong-time', label: 'It comes at the wrong time', score: 0, reply: "I'll time reminders around your day, not the clock." },
      { value: 'dismiss', label: 'I swipe it away and forget', score: 0, reply: "I'll come back once, gently, until it's done." },
      { value: 'unclear', label: 'I’m not sure what it’s for any more', score: 0, reply: "Every reminder I send will say what it's for and where it came from." },
      { value: 'acts', label: 'Usually nothing. I act on it.', score: 0, reply: "Great. I'll keep the reminders that work for you." },
    ],
  },

  /* ================= Quick Start · YOU STAY IN CONTROL ================= */
  {
    id: 'controlStyle', yes: 'S', tier: 'quick', promise: 'You stay in control', letter: 'T', word: 'Turn intention into follow-through', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'How much I decide before steps are placed',
    title: 'When MyRhythm spots a next step, I’d like it to…',
    subtitle: 'Nothing happens without my say. I can change this any time.',
    section: 'planning', scored: false,
    options: [
      { value: 'ask', label: 'Ask me before anything goes in my day', score: 0, reply: "Understood. I'll always ask first. You decide." },
      { value: 'suggest', label: 'Suggest a time, and I just say yes', score: 0, reply: "Understood. I'll suggest, and you say yes, change it or say no." },
      { value: 'place', label: 'Put it in, and I can change it any time', score: 0, reply: "Understood. I'll place it, and you can move or remove it any time." },
    ],
  },

  /* ================= Quick Start · RESILIENT ================= */
  {
    id: 'habitSleep', yes: 'E', tier: 'quick', promise: 'Resilient', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Rest and recharge', // ref BH-01
    title: 'Most mornings, I wake up feeling…',
    section: 'brain-health', scored: true,
    options: [
      { value: 'under-6', label: 'Like I haven’t slept at all', score: 0, reply: "I'll go easier on the mornings that start heavy." },
      { value: 'patchy', label: 'Okay, once I get moving', score: 1, reply: "I'll keep your first hour gentle." },
      { value: 'rested', label: 'Rested and ready to go', score: 3, reply: "Good. I'll protect that." },
    ],
  },
  {
    id: 'habitCalm', yes: 'E', tier: 'quick', promise: 'Resilient', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'psychological',
    brainHealthLens: 'Stress, worry and low mood', // ref BH-06
    title: 'How much are stress, worry or low mood getting in the way of my days?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'spiral', label: 'A lot. My thoughts race and it’s hard to settle.', score: 0, reply: "I'll keep your days lighter and build in pauses. You're not on your own with this." },
      { value: 'push-through', label: 'Some. I push through and feel it later.', score: 1, reply: "I'll spot the busy days and add breathing space." },
      { value: 'some-tools', label: 'Not much. I have ways to settle myself.', score: 3, reply: "Good. I'll make room for what already works." },
    ],
  },
  {
    id: 'mindsetSlip', yes: 'E', tier: 'quick', promise: 'Resilient', letter: 'T', word: 'Turn intention into follow-through', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'How I talk to myself after a slip', // ref BH-10
    title: 'Honestly, when I forget something, the voice in my head says…',
    section: 'planning', scored: false,
    options: [
      { value: 'kind', label: '“No harm done. I’ll sort it.”', score: 0, reply: "That kindness is a strength. I'll build on it." },
      { value: 'harsh', label: '“Not again. What is wrong with me?”', score: 0, reply: 'That voice is about to have a lot less to say. I’ve got it.' },
      { value: 'give-up', label: '“Forget it. What’s the point?”', score: 0, reply: "I'll keep it safe, so you can pick it back up when you're ready." },
      { value: 'others', label: '“Someone else will catch it.”', score: 0, reply: "I'll help you catch it yourself, with help only if you want it." },
    ],
  },

  /* ================= Quick Start · MY FIRST FOCUS ================= */
  {
    id: 'planningGoal', yes: 'S', tier: 'quick', promise: 'My first focus', letter: 'M', word: 'What matters to me', slot: 'mindset', pillar: 'spiritual',
    brainHealthLens: 'What I want to feel in control of',
    title: 'If one thing changed this week, I’d want it to be…',
    subtitle: 'This becomes my first focus.',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'remember', label: 'Nothing important slips', score: 0, reply: "That's where I'll start." },
      { value: 'pace', label: 'My days feel calmer', score: 0, reply: "That's where I'll start." },
      { value: 'complete', label: 'I finally finish what matters', score: 0, reply: "That's where I'll start." },
    ],
  },

  /* ================= Full Picture · M — What matters to me ================= */
  {
    id: 'harderToKeep', tier: 'full', letter: 'M', word: 'What matters to me', slot: 'mindset', pillar: 'spiritual',
    brainHealthLens: 'What has become harder to keep up with',
    title: 'What matters to me that has become harder to keep up with?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'people', label: 'Keeping in touch with people I love', score: 0 },
      { value: 'home', label: 'Running my home and paperwork', score: 0 },
      { value: 'work', label: 'Work, study or volunteering', score: 0 },
      { value: 'me', label: 'Time for the things I enjoy', score: 0 },
    ],
  },
  {
    id: 'dayGoesWell', tier: 'full', letter: 'M', word: 'What matters to me', slot: 'mindset', pillar: 'psychological',
    brainHealthLens: 'What makes a good day work',
    title: 'When my day goes well, what made it work?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'slept', label: 'I slept well', score: 0 },
      { value: 'plan', label: 'I knew what was coming', score: 0 },
      { value: 'one-thing', label: 'I only had a few things to do', score: 0 },
      { value: 'people', label: 'Someone was there for me', score: 0 },
    ],
  },
  {
    id: 'interrupts', tier: 'full', letter: 'M', word: 'What matters to me', slot: 'mindset', pillar: 'psychological',
    brainHealthLens: 'What interrupts my rhythm',
    title: 'What usually knocks my day off course?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'surprises', label: 'Surprises and last-minute changes', score: 0 },
      { value: 'tired', label: 'Running out of energy', score: 0 },
      { value: 'too-much', label: 'Too much at once', score: 0 },
      { value: 'mood', label: 'A low or anxious mood', score: 0 },
    ],
  },
  {
    id: 'progressLooks', tier: 'full', letter: 'M', word: 'What matters to me', slot: 'mindset', pillar: 'spiritual',
    brainHealthLens: 'What meaningful progress looks like',
    title: 'Real progress for me right now would look like…',
    section: 'planning', scored: false,
    options: [
      { value: 'independent', label: 'Doing more on my own again', score: 0 },
      { value: 'calmer', label: 'Feeling calmer and less behind', score: 0 },
      { value: 'trusted', label: 'People trusting me to remember', score: 0 },
      { value: 'purpose', label: 'Getting back to something I love', score: 0 },
    ],
  },

  /* ================= Full Picture · Y — Your brain, your starting point ================= */
  {
    id: 'pauseSigns', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Signs my brain needs a pause',
    title: 'What tells me my brain needs a pause?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'words', label: 'I lose my words or my thread', score: 0 },
      { value: 'irritable', label: 'I get short with people', score: 0 },
      { value: 'headache', label: 'My head aches or feels foggy', score: 0 },
      { value: 'slow', label: 'Everything takes twice as long', score: 0 },
    ],
  },
  {
    id: 'habitMove', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Movement and circulation', // ref BH-02
    title: 'How easy is it to move my body in a way that suits me?',
    subtitle: 'Walking, gardening and gentle stretching all count.', section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Hard. It doesn’t happen much right now.', score: 0 },
      { value: 'once-twice', label: 'Once or twice most weeks', score: 1 },
      { value: 'most-days', label: 'Easy. I move on most days.', score: 3 },
    ],
  },
  {
    id: 'habitFuel', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Everyday food and hydration', // ref BH-03
    title: 'How easy is it to eat regular meals and drink enough water?',
    subtitle: 'No counting and no judgement.', section: 'brain-health', scored: true,
    options: [
      { value: 'on-the-go', label: 'Hard. I skip meals or grab what’s quick.', score: 0 },
      { value: 'mixed', label: 'It depends on the day', score: 1 },
      { value: 'mostly-fresh', label: 'Easy. Proper meals and plenty of water.', score: 3 },
    ],
  },
  {
    id: 'habitExposure', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Reducing avoidable exposures', // ref BH-05
    title: 'How often do I smoke or drink alcohol?',
    subtitle: 'Not about being perfect, just what’s usual.', section: 'brain-health', scored: true,
    options: [
      { value: 'often', label: 'Often', score: 0 },
      { value: 'sometimes', label: 'Sometimes', score: 1 },
      { value: 'rarely-never', label: 'Rarely or never', score: 3 },
    ],
  },
  {
    id: 'healthChanges', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'Health changes that affect my day (optional)',
    title: 'Has a brain injury, stroke, illness or other health change affected how I remember or plan?',
    subtitle: 'Optional. This only helps MyRhythm pace things. It never labels me.', section: 'planning', scored: false,
    options: [
      { value: 'yes', label: 'Yes, it has', score: 0 },
      { value: 'a-little', label: 'A little', score: 0 },
      { value: 'no', label: 'No', score: 0 },
      { value: 'rather-not', label: 'I’d rather not say', score: 0 },
    ],
  },
  {
    id: 'dayStart', tier: 'full', letter: 'Y', word: 'Your brain, your starting point', slot: 'yesReality', pillar: 'biological',
    brainHealthLens: 'When my day starts and winds down',
    title: 'When does my day usually start and wind down?',
    section: 'planning', scored: false,
    options: [
      { value: 'early', label: 'Early: up before 7am, winding down by 9pm', score: 0 },
      { value: 'middle', label: 'Middle: up 7 to 9am, winding down by 10 or 11pm', score: 0 },
      { value: 'late', label: 'Late: up after 9am, winding down after 11pm', score: 0 },
    ],
  },

  /* ================= Full Picture · R — Remember what matters ================= */
  {
    id: 'memoryMethod', tier: 'full', letter: 'R', word: 'Remember what matters', slot: 'rhythm', pillar: 'social',
    brainHealthLens: 'How I capture important information', // ref BH-09
    title: 'Right now, my memory is held together by…',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'phone', label: 'My phone, buzzing at me', score: 0 },
      { value: 'paper', label: 'Sticky notes and lists everywhere', score: 0 },
      { value: 'someone', label: 'Someone who reminds me', score: 0 },
      { value: 'nothing', label: 'My head, and hoping for the best', score: 0 },
    ],
  },
  {
    id: 'reminderStyle', tier: 'full', letter: 'R', word: 'Remember what matters', slot: 'rhythm', pillar: 'psychological',
    brainHealthLens: 'Reminders I notice and act on',
    title: 'Which reminders do I actually notice and act on?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'text', label: 'A short written message', score: 0 },
      { value: 'voice', label: 'A spoken reminder', score: 0 },
      { value: 'picture', label: 'A picture or icon', score: 0 },
      { value: 'mix', label: 'A mix of these', score: 0 },
    ],
  },

  /* ================= Full Picture · H — Help me begin ================= */
  {
    id: 'stepsEasy', tier: 'full', letter: 'H', word: 'Help me begin', slot: 'harnessSupport', pillar: 'psychological',
    brainHealthLens: 'Breaking big tasks into steps',
    title: 'How easy is it to turn a big task into small, clear steps?',
    section: 'planning', scored: false,
    options: [
      { value: 'hard', label: 'Hard. It all blurs into one big thing.', score: 0 },
      { value: 'sometimes', label: 'I can, on a good day', score: 0 },
      { value: 'easy', label: 'Easy. I do it naturally.', score: 0 },
    ],
  },
  {
    id: 'decideFirst', tier: 'full', letter: 'H', word: 'Help me begin', slot: 'harnessSupport', pillar: 'psychological',
    brainHealthLens: 'Deciding what comes first',
    title: 'What helps me decide what needs my attention first?',
    section: 'planning', scored: false,
    options: [
      { value: 'deadline', label: 'Whatever is due soonest', score: 0 },
      { value: 'someone', label: 'Someone tells me', score: 0 },
      { value: 'list', label: 'A list in front of me', score: 0 },
      { value: 'stuck', label: 'Nothing. I often get stuck choosing.', score: 0 },
    ],
  },

  /* ================= Full Picture · Y — Your pace, your capacity ================= */
  {
    id: 'planOverload', tier: 'full', letter: 'Y', word: 'Your pace, your capacity', slot: 'yourVictories', pillar: 'biological',
    brainHealthLens: 'Plans versus energy',
    title: 'How often do my plans ask more of me than my energy allows?',
    section: 'planning', scored: false,
    options: [
      { value: 'most-days', label: 'Most days', score: 0 },
      { value: 'some-days', label: 'Some days', score: 0 },
      { value: 'rarely', label: 'Rarely', score: 0 },
    ],
  },
  {
    id: 'rhythmDetail', tier: 'full', letter: 'Y', word: 'Your pace, your capacity', slot: 'yourVictories', pillar: 'biological',
    brainHealthLens: 'My focus length and energy drains',
    title: 'How do I work best?',
    subtitle: 'These choices shape suggested breaks, never rules.', kind: 'rhythm-detail', rows: RHYTHM_DETAIL_ROWS,
    options: [], section: 'planning', scored: false,
  },
  {
    id: 'distractions', tier: 'full', letter: 'Y', word: 'Your pace, your capacity', slot: 'yourVictories', pillar: 'psychological',
    brainHealthLens: 'Staying with a task',
    title: 'What helps me stay with a task when distractions appear?',
    section: 'planning', scored: false,
    options: [
      { value: 'quiet', label: 'A quiet space', score: 0 },
      { value: 'timer', label: 'A short timer', score: 0 },
      { value: 'one-thing', label: 'Only one thing in front of me', score: 0 },
      { value: 'nothing-yet', label: 'I haven’t found what works yet', score: 0 },
    ],
  },

  /* ================= Full Picture · T — Turn intention into follow-through ================= */
  {
    id: 'returnAfter', tier: 'full', letter: 'T', word: 'Turn intention into follow-through', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'Getting back on track after interruptions',
    title: 'When life interrupts, what would help me get back to what matters?',
    section: 'planning', scored: false,
    options: [
      { value: 'where-left', label: 'Seeing exactly where I left off', score: 0 },
      { value: 'one-step', label: 'Just one small step to restart', score: 0 },
      { value: 'nudge', label: 'A kind nudge from someone I trust', score: 0 },
      { value: 'no-guilt', label: 'No guilt about the days I missed', score: 0 },
    ],
  },
  {
    id: 'reminderLead', tier: 'full', letter: 'T', word: 'Turn intention into follow-through', slot: 'transform', pillar: 'psychological',
    brainHealthLens: 'When reminders should arrive',
    title: 'When do I want reminders to arrive?',
    section: 'planning', scored: false,
    options: [
      { value: 'evening-before', label: 'The evening before', score: 0 },
      { value: 'morning', label: 'That morning', score: 0 },
      { value: 'hour-before', label: 'An hour before', score: 0 },
    ],
  },

  /* ================= Full Picture · H — Help that works for me ================= */
  {
    id: 'planningSupport', tier: 'full', letter: 'H', word: 'Help that works for me', slot: 'heal', pillar: 'social',
    brainHealthLens: 'Support I choose',
    title: 'When something really matters, who do I want in my corner?',
    subtitle: 'Nobody sees anything unless I give permission.', multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'family', label: 'Family or my partner', score: 0 },
      { value: 'friend', label: 'A friend', score: 0 },
      { value: 'professional', label: 'A carer or professional', score: 0 },
      { value: 'solo', label: 'Just me for now', score: 0 },
    ],
  },
  {
    id: 'circleHelp', tier: 'full', letter: 'H', word: 'Help that works for me', slot: 'heal', pillar: 'social',
    brainHealthLens: 'What I would like help with',
    title: 'What would I like them to help with?',
    multiSelect: true, section: 'planning', scored: false,
    options: [
      { value: 'appointments', label: 'Keeping track of appointments', score: 0 },
      { value: 'record', label: 'Recording a conversation if I forget', score: 0 },
      { value: 'encourage', label: 'Sending me encouragement', score: 0 },
      { value: 'nothing', label: 'Nothing for now', score: 0 },
    ],
  },
  {
    id: 'shareComfort', tier: 'full', letter: 'H', word: 'Help that works for me', slot: 'heal', pillar: 'social',
    brainHealthLens: 'What I am comfortable sharing',
    title: 'What would I feel comfortable sharing?',
    section: 'planning', scored: false,
    options: [
      { value: 'calendar', label: 'My calendar only', score: 0 },
      { value: 'actions', label: 'My calendar and next steps', score: 0 },
      { value: 'more', label: 'Recordings too, when I choose', score: 0 },
      { value: 'private', label: 'Nothing yet. I’ll keep it private.', score: 0 },
    ],
  },
  {
    id: 'checkInStyle', tier: 'full', letter: 'H', word: 'Help that works for me', slot: 'heal', pillar: 'social',
    brainHealthLens: 'How I like to be checked in on',
    title: 'How would I like someone to check in, so I feel supported and still in control?',
    section: 'planning', scored: false,
    options: [
      { value: 'message', label: 'A short message', score: 0 },
      { value: 'call', label: 'A quick call', score: 0 },
      { value: 'only-ask', label: 'Only when I ask', score: 0 },
    ],
  },

  /* ================= Full Picture · M — My progress, my next choice ================= */
  {
    id: 'winsStyle', tier: 'full', letter: 'M', word: 'My progress, my next choice', slot: 'multiply', pillar: 'psychological',
    brainHealthLens: 'Recognising what I have managed',
    title: 'What have I managed recently that deserves recognising?',
    section: 'planning', scored: false,
    options: [
      { value: 'appointment', label: 'I got to an appointment', score: 0 },
      { value: 'finished', label: 'I finished something I started', score: 0 },
      { value: 'asked', label: 'I asked for help when I needed it', score: 0 },
      { value: 'kept-going', label: 'I kept going on a hard day', score: 0 },
    ],
  },
  {
    id: 'habitLearnConnect', tier: 'full', letter: 'M', word: 'My progress, my next choice', slot: 'multiply', pillar: 'social',
    brainHealthLens: 'New learning and connection', // ref BH-07
    title: 'How often do I learn something new or spend time with people?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Rarely at the moment', score: 0 },
      { value: 'sometimes', label: 'Now and then', score: 1 },
      { value: 'often', label: 'Most weeks', score: 3 },
    ],
  },
  {
    id: 'habitPurpose', tier: 'full', letter: 'M', word: 'My progress, my next choice', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'Purpose in the week', // ref BH-08
    title: 'How often does my week include something that feels meaningful to me?',
    section: 'brain-health', scored: true,
    options: [
      { value: 'rarely', label: 'Rarely', score: 0 },
      { value: 'sometimes', label: 'Sometimes', score: 1 },
      { value: 'often', label: 'Most weeks', score: 3 },
    ],
  },
  {
    id: 'oneChoice', tier: 'full', letter: 'M', word: 'My progress, my next choice', slot: 'multiply', pillar: 'spiritual',
    brainHealthLens: 'One choice for today',
    title: 'One choice I want to make today is…',
    section: 'planning', scored: false,
    options: [
      { value: 'rest', label: 'Rest without guilt', score: 0 },
      { value: 'one-task', label: 'Finish one small task', score: 0 },
      { value: 'reach-out', label: 'Reach out to someone', score: 0 },
      { value: 'move', label: 'Move my body', score: 0 },
    ],
  },
];

/** Full Picture letter order (M-Y-R-H-Y-T-H-M). */
export const FULL_PICTURE_LETTERS: { slot: LetterId; word: string }[] = [
  { slot: 'mindset', word: 'What matters to me' },
  { slot: 'yesReality', word: 'Your brain, your starting point' },
  { slot: 'rhythm', word: 'Remember what matters' },
  { slot: 'harnessSupport', word: 'Help me begin' },
  { slot: 'yourVictories', word: 'Your pace, your capacity' },
  { slot: 'transform', word: 'Turn intention into follow-through' },
  { slot: 'heal', word: 'Help that works for me' },
  { slot: 'multiply', word: 'My progress, my next choice' },
];

const QUICK = QUESTIONS.filter((q) => q.tier === 'quick' && !q.hidden);
const FULL = FULL_PICTURE_LETTERS.flatMap((l) => QUESTIONS.filter((q) => q.tier === 'full' && q.slot === l.slot));

const PERSONAS: PersonaKey[] = ['brain-injury', 'caregiver', 'executive', 'student', 'general'];
const banks = Object.fromEntries(PERSONAS.map((persona) => [persona, {
  persona,
  intro: 'Remembered, Resilient, Reliable: a few moments from everyday life.',
  preQuestion: { title: 'A few questions about everyday life', subtitle: 'There are no right or wrong answers.' },
  questions: QUESTIONS,
  quickQuestions: QUICK,
  fullQuestions: FULL,
}])) as Record<PersonaKey, AssessmentBank>;



export function getAssessmentBank(persona: string | null | undefined): AssessmentBank | null {
  if (!persona) return banks.general;
  const legacyMap: Record<string, PersonaKey> = {
    recovery: 'brain-injury', 'goal-achiever': 'executive', productivity: 'executive', wellness: 'brain-injury',
  };
  const key = (persona in banks ? persona : legacyMap[persona]) as PersonaKey | undefined;
  return key && key in banks ? banks[key] : null;
}

export const PERSONA_LABEL: Record<PersonaKey, string> = {
  general: 'My own starting point',
  'brain-injury': 'Rebuilding after a brain change', caregiver: 'Caring for someone I love',
  executive: 'Protecting my focus at work', student: 'Studying and learning',
};

export type LetterScores = Record<LetterId, number> & Partial<Record<QuestionId, number>>;
export interface AssessmentAnswer { primary: string; alsoFits: string[]; }
export interface BrainHealthScore {
  total: number;
  letters: LetterScores;
  pillars: Record<PillarId, number>;
  version: number;
  /** How many of the eight brain-health areas were answered. */
  answeredAreas?: number;
}

export function normalizeAnswer(raw: unknown): AssessmentAnswer | null {
  if (!raw) return null;
  if (typeof raw === 'string') return { primary: raw, alsoFits: [] };
  if (Array.isArray(raw)) return raw.length ? { primary: raw[0], alsoFits: raw.slice(1) } : null;
  if (typeof raw === 'object' && 'primary' in (raw as Record<string, unknown>)) {
    const r = raw as AssessmentAnswer;
    return { primary: r.primary, alsoFits: Array.isArray(r.alsoFits) ? r.alsoFits : [] };
  }
  return null;
}

export function computeBrainHealthScore(bank: AssessmentBank, answers: Record<string, unknown>): BrainHealthScore {
  const questionScores: Partial<Record<QuestionId, number>> = {};
  let raw = 0;
  let scoredCount = 0;
  for (const q of bank.questions) {
    if (!q.scored || q.kind === 'rhythm-detail') continue;
    const ans = normalizeAnswer(answers[q.id]);
    // Only answered questions count — Quick Start scores 5 of 8 areas.
    const opt = ans ? q.options.find((o) => o.value === ans.primary) : undefined;
    if (!opt) continue;
    const score = opt.score;
    questionScores[q.id] = score;
    raw += score;
    scoredCount++;
  }

  const letterIds: LetterId[] = ['mindset', 'yesReality', 'rhythm', 'harnessSupport', 'yourVictories', 'transform', 'heal', 'multiply'];
  const letters = { ...questionScores } as LetterScores;
  for (const id of letterIds) {
    const matching = bank.questions.filter((q) => q.scored && (q.slot ?? q.id) === id && questionScores[q.id] !== undefined);
    letters[id] = matching.length
      ? Math.round((matching.reduce((sum, q) => sum + (questionScores[q.id] ?? 0), 0) / matching.length) * 10) / 10
      : 0;
  }

  const pillars = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  const counts = { biological: 0, psychological: 0, social: 0, spiritual: 0 } as Record<PillarId, number>;
  for (const q of bank.questions.filter((item) => item.scored && questionScores[item.id] !== undefined)) {
    pillars[q.pillar] += questionScores[q.id] ?? 0;
    counts[q.pillar]++;
  }
  for (const p of Object.keys(pillars) as PillarId[]) {
    pillars[p] = counts[p] ? Math.round((pillars[p] / counts[p]) * 10) / 10 : 0;
  }
  return {
    total: scoredCount ? Math.round((raw / (scoredCount * 3)) * 100) : 0,
    letters,
    pillars,
    version: ASSESSMENT_SCHEMA_VERSION,
    answeredAreas: scoredCount,
  };
}
