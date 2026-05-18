import { Users, HeartHandshake, Activity, TrendingUp, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tone = 'teal' | 'emerald' | 'orange' | 'purple' | 'neutral';

export interface FivePrompt {
  id: 'family' | 'friends' | 'fitness' | 'finances' | 'future';
  label: string;
  /** Editable label options for the 5th F */
  labelOptions?: string[];
  icon: LucideIcon;
  tone: Tone;
  question: string;
  /** Sentence stems — sparks, not finished answers. Max 3 per Core memory. */
  sparks: string[];
  /** Used when stitching the final paragraph */
  stitch: (answer: string) => string;
}

export const fivePrompts: FivePrompt[] = [
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    tone: 'purple',
    question: 'Who do you want to be for the people closest to you?',
    sparks: [
      'Present at dinner, not just at the table.',
      'Patient on the hard days.',
      'The one who listens first.',
    ],
    stitch: (a) => `For my family, ${a.trim().replace(/\.$/, '')}.`,
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: HeartHandshake,
    tone: 'teal',
    question: 'What kind of friend do you want to be — and to be near?',
    sparks: [
      'Easy to call, even after a long gap.',
      'Quietly loyal.',
      'First to show up when it matters.',
    ],
    stitch: (a) => `With my friends, ${a.trim().replace(/\.$/, '')}.`,
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: Activity,
    tone: 'emerald',
    question: 'How do you want your body and brain to feel a year from now?',
    sparks: [
      'Steady energy through the afternoon.',
      'Sleep that actually restores.',
      'Strong enough to keep up with the people I love.',
    ],
    stitch: (a) => `In my body and mind, ${a.trim().replace(/\.$/, '')}.`,
  },
  {
    id: 'finances',
    label: 'Finances',
    icon: TrendingUp,
    tone: 'orange',
    question: "What would 'enough' look like — and what would it free you to do?",
    sparks: [
      'No quiet money worry in the background.',
      'Choices, not pressure.',
      'Generous without strain.',
    ],
    stitch: (a) => `Around money, ${a.trim().replace(/\.$/, '')}.`,
  },
  {
    id: 'future',
    label: 'Future',
    labelOptions: ['Future', 'Faith', 'Fulfilment', 'Purpose'],
    icon: Compass,
    tone: 'neutral',
    question: 'When you look back in ten years, what would make you proud?',
    sparks: [
      'I kept showing up.',
      'I left things a little better than I found them.',
      'I lived on purpose, not on autopilot.',
    ],
    stitch: (a) => `Looking ahead, ${a.trim().replace(/\.$/, '')}.`,
  },
];
