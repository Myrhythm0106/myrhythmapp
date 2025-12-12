// 5 Life Pillars for the Vision Board

export interface VisionPillar {
  id: string;
  name: string;
  icon: string;
  question: string;
  suggestions: string[];
  gradientFrom: string;
  gradientTo: string;
  lightBg: string;
}

export interface UserVision {
  id: string;
  pillarId: string;
  title: string;
  why?: string;
  emoji?: string;
  imageUrl?: string;
  progress: number;
  linkedGoalId?: string;
  linkedGoalTitle?: string;
  createdAt: string;
}

export const visionPillars: VisionPillar[] = [
  {
    id: 'mind-growth',
    name: 'Mind & Growth',
    icon: '🧠',
    question: 'What would make you proud to learn or achieve?',
    suggestions: [
      'Learn a new language',
      'Master a professional skill',
      'Read more books',
      'Expand my knowledge'
    ],
    gradientFrom: 'from-neural-purple-500',
    gradientTo: 'to-neural-blue-500',
    lightBg: 'bg-neural-purple-50'
  },
  {
    id: 'health-body',
    name: 'Health & Body',
    icon: '💪',
    question: 'How do you want to feel in your body?',
    suggestions: [
      'Stronger and more energetic',
      'Pain-free and flexible',
      'Healthier and fitter',
      'More rested and calm'
    ],
    gradientFrom: 'from-brand-teal-500',
    gradientTo: 'to-brand-emerald-500',
    lightBg: 'bg-brand-teal-50'
  },
  {
    id: 'relationships',
    name: 'Relationships',
    icon: '❤️',
    question: 'Who do you want to be for the people you love?',
    suggestions: [
      'Be more present with family',
      'Reconnect with old friends',
      'Build deeper connections',
      'Support my loved ones'
    ],
    gradientFrom: 'from-neural-magenta-500',
    gradientTo: 'to-neural-magenta-300',
    lightBg: 'bg-neural-magenta-50'
  },
  {
    id: 'financial',
    name: 'Financial Security',
    icon: '💰',
    question: 'What would you do with financial freedom?',
    suggestions: [
      'Build an emergency fund',
      'Pay off all debt',
      'Save for my dream home',
      'Achieve financial independence'
    ],
    gradientFrom: 'from-brand-orange-500',
    gradientTo: 'to-brand-orange-300',
    lightBg: 'bg-brand-orange-50'
  },
  {
    id: 'purpose-joy',
    name: 'Purpose & Joy',
    icon: '🌟',
    question: 'What brings you deep fulfillment?',
    suggestions: [
      'Start a creative project',
      'Find my purpose',
      'Practice gratitude daily',
      'Explore what makes me happy'
    ],
    gradientFrom: 'from-neural-blue-500',
    gradientTo: 'to-brand-teal-500',
    lightBg: 'bg-neural-blue-50'
  }
];

export const defaultVisions: Record<string, UserVision> = {
  'mind-growth': {
    id: 'default-mind',
    pillarId: 'mind-growth',
    title: '',
    progress: 0,
    createdAt: new Date().toISOString()
  },
  'health-body': {
    id: 'default-health',
    pillarId: 'health-body',
    title: '',
    progress: 0,
    createdAt: new Date().toISOString()
  },
  'relationships': {
    id: 'default-relationships',
    pillarId: 'relationships',
    title: '',
    progress: 0,
    createdAt: new Date().toISOString()
  },
  'financial': {
    id: 'default-financial',
    pillarId: 'financial',
    title: '',
    progress: 0,
    createdAt: new Date().toISOString()
  },
  'purpose-joy': {
    id: 'default-purpose',
    pillarId: 'purpose-joy',
    title: '',
    progress: 0,
    createdAt: new Date().toISOString()
  }
};

export const pillarEmojis: Record<string, string[]> = {
  'mind-growth': ['🧠', '📚', '🎓', '💡', '🧩', '🎯', '📖', '✍️'],
  'health-body': ['💪', '🏃', '🧘', '🥗', '💚', '🌱', '😴', '❤️‍🩹'],
  'relationships': ['❤️', '👨‍👩‍👧', '🤝', '💕', '👥', '🫂', '💝', '🏠'],
  'financial': ['💰', '📈', '🏦', '💎', '🎯', '🏡', '💳', '📊'],
  'purpose-joy': ['🌟', '✨', '🎨', '🎭', '🙏', '🌈', '🦋', '🌻']
};
