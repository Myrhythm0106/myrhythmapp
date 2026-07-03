// Per-cluster copy for the MYRHYTHM snapshot on /launch/welcome.
// Not a clinical score — plain-English meaning + suggestions per score band (0..3).

import type { LetterId } from './launchAssessmentBanks';

export type ScoreBand = 0 | 1 | 2 | 3;

export interface LetterInsight {
  id: LetterId;
  letter: 'M' | 'Y' | 'R' | 'H' | 'T';
  word: string;
  lens: string;
  short: string;
  bands: [string, string, string, string]; // meaning for scores 0..3
  suggestions: [string[], string[], string[], string[]]; // suggestions for scores 0..3
}

const LETTER_INSIGHTS: Record<LetterId, LetterInsight> = {
  mindset: {
    id: 'mindset',
    letter: 'M',
    word: 'Mindset',
    lens: 'Cognitive confidence & self-talk',
    short: 'How you speak to yourself about your brain right now.',
    bands: [
      'You feel fragile or frustrated with your brain. That is honest data — not a verdict.',
      'You are cautious but curious. A workable place to start.',
      'You are actively rebuilding and starting to trust yourself again.',
      'You feel capable — different, maybe, but capable. Keep this footing.',
    ],
    suggestions: [
      [
        'Do one Capture a day — voice or text — so you can see effort you would otherwise forget.',
        'Read your last three Celebrations on Home before you plan anything new.',
        'Name one Support Circle person you can text on a hard day.',
      ],
      [
        'Add a short "what went well" note to each Calibrate.',
        'Choose one recurring task that used to feel hard, and Commit to it this week.',
        'Ask your Support Circle to reflect one strength back to you.',
      ],
      [
        'Stretch: pick one task just outside your comfort and Commit to it.',
        'Keep a running list of proof-points in Captures for the next Calibrate.',
      ],
      [
        'Mentor forward: share one thing that helped you with someone in your circle.',
        'Protect this — schedule the rest & recovery that keeps confidence steady.',
      ],
    ],
  },
  yesReality: {
    id: 'yesReality',
    letter: 'Y',
    word: 'Yes to Reality',
    lens: 'Honest baseline of current state',
    short: 'How honestly you can meet where you actually are today.',
    bands: [
      'Early days. Ground can shift hour to hour — that is normal, not failure.',
      'You are stitching routine back together. Expect gaps.',
      'Most days work. You are noticing patterns.',
      'You are on your own terms and adjusting deliberately.',
    ],
    suggestions: [
      [
        'Use the Energy Check when you open the app so plans match today, not yesterday.',
        'Keep goals to one Commit per day for now.',
        'Let your Support Circle see your today — no need to perform.',
      ],
      [
        'Do a 60-second Calibrate at the end of the day: what fit, what did not.',
        'Move one recurring commitment to your best window.',
      ],
      [
        'Look back at a full week in Calibrate and mark two patterns.',
        'Retire one task that no longer earns its place.',
      ],
      [
        'Set a quarterly review — protect what is working from drift.',
      ],
    ],
  },
  rhythm: {
    id: 'rhythm',
    letter: 'R',
    word: 'Rhythm',
    lens: 'Energy & cognitive peak window',
    short: 'When your brain is clearest — the window we plan around.',
    bands: [
      'Your clear window varies day to day. That is a real constraint — we will plan for flex.',
      'You have a rough sense of when you are sharpest.',
      'You know your peak window and can usually protect it.',
      'You know your peak and defend it well.',
    ],
    suggestions: [
      [
        'Do the Energy Check daily for a week — patterns emerge fast.',
        'Only Commit to important thinking after an Energy Check.',
      ],
      [
        'Anchor one recurring task to your best window.',
        'Leave a 15-minute buffer either side of important commitments.',
      ],
      [
        'Move admin out of your peak window.',
        'Block deep-work time on your synced calendar so it is visible to others.',
      ],
      [
        'Audit peak-window drift once a quarter.',
      ],
    ],
  },
  harnessSupport: {
    id: 'harnessSupport',
    letter: 'H',
    word: 'Harness Support',
    lens: 'Social scaffolding',
    short: 'Who is close enough to help when it counts.',
    bands: [
      'Solo for now. That is a valid choice — and a fragile one on hard days.',
      'You are building your circle. Even one person changes the maths.',
      'One key person is in your corner.',
      'A few trusted people are in your corner.',
    ],
    suggestions: [
      [
        'Invite one person to your Support Circle this week — start with the lowest-stakes person.',
        'Share one appointment via Memory Bridge so someone else has the record too.',
      ],
      [
        'Give your one person a specific role (e.g. appointment note-taker).',
        'Practise asking for help on something small before you need it big.',
      ],
      [
        'Add a second person for redundancy on a hard week.',
        'Set boundaries in writing — who sees what.',
      ],
      [
        'Review circle roles quarterly — needs change.',
      ],
    ],
  },
  yourVictories: {
    id: 'yourVictories',
    letter: 'Y',
    word: 'Your Victories',
    lens: 'Noticing progress that would otherwise vanish',
    short: 'How well you notice and hold onto wins — small ones count most.',
    bands: [
      'Wins are slipping past unnoticed. Not because they are not there.',
      'You catch the big ones. The small ones still evaporate.',
      'You are collecting wins deliberately.',
      'You use past wins as fuel for the next thing.',
    ],
    suggestions: [
      [
        'End the day with one Celebrate — even "I got out of bed" counts.',
        'Ask your Support Circle to point out one thing they saw you do this week.',
      ],
      [
        'Photograph or voice-note wins so they survive tomorrow.',
        'Re-read the last week of Celebrations every Sunday.',
      ],
      [
        'Tag Celebrations by theme to see where momentum is real.',
      ],
      [
        'Share one Celebration outward — it doubles for the receiver.',
      ],
    ],
  },
  transform: {
    id: 'transform',
    letter: 'T',
    word: 'Transform',
    lens: 'Willingness to change one small thing',
    short: 'Your appetite for changing one small thing this week.',
    bands: [
      'Change feels like too much right now. Hold steady — that is allowed.',
      'Open to one small experiment.',
      'You are running experiments and keeping what works.',
      'You change things deliberately, on your terms.',
    ],
    suggestions: [
      [
        'Skip transformation this week. Rest is data too.',
        'Pick one thing to keep exactly the same as an anchor.',
      ],
      [
        'Choose one 1% change — a smaller portion, an earlier bedtime, a shorter walk.',
        'Calibrate it after 7 days: keep, adjust, or drop.',
      ],
      [
        'Stack a second change on top of one that already stuck.',
      ],
      [
        'Retire changes that stopped serving you — evolution, not accumulation.',
      ],
    ],
  },
  heal: {
    id: 'heal',
    letter: 'H',
    word: 'Heal',
    lens: 'Recovery, rest, and repair',
    short: 'How well rest and recovery are protected in your week.',
    bands: [
      'Recovery is not landing. Sleep and rest are patchy.',
      'You get some recovery, but it is inconsistent.',
      'Recovery is mostly protected.',
      'Rest is non-negotiable and it shows.',
    ],
    suggestions: [
      [
        'Commit to one non-negotiable wind-down step tonight (screens off, lights low).',
        'Block a 20-minute rest window in your day and honour it once.',
      ],
      [
        'Move one high-demand task off your worst-sleep day.',
        'Ask your Support Circle to protect one rest window this week.',
      ],
      [
        'Track a week of sleep in Captures and Calibrate against energy.',
      ],
      [
        'Guard rest through busy weeks — the point is it holds under pressure.',
      ],
    ],
  },
  multiply: {
    id: 'multiply',
    letter: 'M',
    word: 'Multiply',
    lens: 'Meaning, purpose, and giving forward',
    short: 'How much of your effort connects to something that matters to you.',
    bands: [
      'Days feel like survival, not purpose. Fair — and worth naming.',
      'You catch glimpses of meaning in the week.',
      'Purpose shows up in most weeks.',
      'Meaning is compounding — what you do is landing for others too.',
    ],
    suggestions: [
      [
        'Write one sentence: "If today counted, it would be because…" — no need to act on it yet.',
        'Focus on Heal and Rhythm first; meaning needs a floor under it.',
      ],
      [
        'Pick one recurring action and connect it to a "why".',
        'Tell one person in your circle what you are working toward.',
      ],
      [
        'Set a quarterly intention and let Commits ladder up to it.',
      ],
      [
        'Mentor forward — teach one thing you have learned to someone earlier on the path.',
      ],
    ],
  },
};

export function getLetterInsight(id: LetterId): LetterInsight {
  return LETTER_INSIGHTS[id];
}

export function bandFor(score: number): ScoreBand {
  const clamped = Math.max(0, Math.min(3, Math.round(score)));
  return clamped as ScoreBand;
}
