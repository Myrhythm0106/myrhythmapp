// MYRHYTHM Framework Questions
// Each letter represents a core aspect of cognitive and emotional wellness

export interface MyrhythmQuestion {
  id: string;
  letter: string;
  letterName: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'scale' | 'primary_secondary';
  options?: Array<{ value: string; label: string; insight?: string }>;
  min?: number;
  max?: number;
  labels?: Record<number, string>;
  quickStartQuestion?: boolean;
  allowSecondaryAnswers?: boolean;
  secondaryPrompt?: string;
  insight: string;
  nextStepPreview: string;
}

// Quick Start Assessment - 7 MYRHYTHM questions (one per letter)
export const quickStartQuestions: MyrhythmQuestion[] = [
  {
    id: 'mindset_challenge',
    letter: 'M',
    letterName: 'MINDSET',
    question: "What's your biggest daily challenge with memory or focus?",
    type: 'primary_secondary',
    allowSecondaryAnswers: true,
    secondaryPrompt: "Any other challenges that also apply?",
    options: [
      { 
        value: 'attention_drift', 
        label: 'Staying focused on tasks for extended periods',
        insight: 'You may benefit from structured focus techniques and attention training.'
      },
      { 
        value: 'memory_gaps', 
        label: 'Remembering important information and details',
        insight: 'Memory enhancement strategies and external memory aids could be powerful for you.'
      },
      { 
        value: 'mental_fatigue', 
        label: 'Mental energy and avoiding brain fog',
        insight: 'Energy management and cognitive load balancing will be key areas for you.'
      },
      { 
        value: 'task_switching', 
        label: 'Managing multiple tasks and priorities',
        insight: 'You\'ll benefit from systems that help organize and prioritize cognitive demands.'
      },
      { 
        value: 'professional_performance', 
        label: 'Optimizing cognitive performance for professional excellence',
        insight: 'Professional cognitive optimization strategies will enhance your workplace effectiveness and decision-making speed.'
      },
      { 
        value: 'strategic_thinking', 
        label: 'Enhancing strategic thinking and problem-solving speed',
        insight: 'Advanced cognitive strategies for faster analysis and more effective problem-solving approaches.'
      }
    ],
    quickStartQuestion: true,
    insight: "Understanding your primary cognitive challenge helps us tailor your MYRHYTHM plan to address your most pressing needs first.",
    nextStepPreview: "Next, we'll explore how you handle overwhelming moments..."
  },
  {
    id: 'overwhelm_handling',
    letter: 'Y',
    letterName: 'YIELD & ACKNOWLEDGE',
    question: "How do you currently handle overwhelming moments?",
    type: 'primary_secondary',
    allowSecondaryAnswers: true,
    secondaryPrompt: "Other approaches you sometimes use?",
    options: [
      { 
        value: 'push_through', 
        label: 'Push through and try to power past it',
        insight: 'Learning to recognize and honor your limits could prevent burnout and improve performance.'
      },
      { 
        value: 'take_breaks', 
        label: 'Take breaks and step away temporarily',
        insight: 'You already have good instincts - we can help you optimize these recovery strategies.'
      },
      { 
        value: 'feel_stuck', 
        label: 'Feel stuck and don\'t know what to do',
        insight: 'We\'ll provide you with specific techniques for managing cognitive overload when it happens.'
      },
      { 
        value: 'avoid_situations', 
        label: 'Try to avoid overwhelming situations',
        insight: 'Building confidence through gradual exposure and support systems will be important for you.'
      }
    ],
    quickStartQuestion: true,
    insight: "How you handle overwhelm reveals a lot about your current coping strategies and where we can build resilience.",
    nextStepPreview: "Let's discover when your energy peaks during the day..."
  },
  {
    id: 'energy_peak',
    letter: 'R',
    letterName: 'RESTORE ENERGY',
    question: "When do you feel most energized during the day?",
    type: 'multiple_choice',
    options: [
      { 
        value: 'early_morning', 
        label: 'Early morning (6-9 AM)',
        insight: 'You\'re a natural morning person - we\'ll help you maximize this peak energy window.'
      },
      { 
        value: 'mid_morning', 
        label: 'Mid-morning (9 AM-12 PM)',
        insight: 'Your energy builds gradually - we\'ll create routines that honor this natural rhythm.'
      },
      { 
        value: 'afternoon', 
        label: 'Afternoon (12-5 PM)',
        insight: 'You hit your stride after lunch - we\'ll design your schedule around this afternoon peak.'
      },
      { 
        value: 'evening', 
        label: 'Evening (5-8 PM)',
        insight: 'You\'re an evening person - we\'ll help you protect and optimize your evening energy.'
      },
      { 
        value: 'varies_daily', 
        label: 'It varies day to day',
        insight: 'Your rhythm is flexible - we\'ll help you track patterns and adapt accordingly.'
      }
    ],
    quickStartQuestion: true,
    insight: "Knowing your natural energy rhythm is crucial for scheduling important tasks when your brain performs best.",
    nextStepPreview: "Now let's identify what kind of support works best for you..."
  },
  {
    id: 'support_preference',
    letter: 'H',
    letterName: 'HARNESS SUPPORT',
    question: "What type of support helps you most?",
    type: 'primary_secondary',
    allowSecondaryAnswers: true,
    secondaryPrompt: "Additional support that helps?",
    options: [
      { 
        value: 'gentle_reminders', 
        label: 'Gentle reminders and prompts',
        insight: 'You respond well to structured support - we\'ll design smart reminder systems for you.'
      },
      { 
        value: 'encouragement', 
        label: 'Encouragement and motivation',
        insight: 'Positive reinforcement energizes you - we\'ll build celebration into your daily rhythm.'
      },
      { 
        value: 'practical_help', 
        label: 'Practical tools and step-by-step guidance',
        insight: 'You\'re action-oriented - we\'ll focus on concrete tools and clear implementation strategies.'
      },
      { 
        value: 'understanding', 
        label: 'Understanding and emotional support',
        insight: 'Connection and empathy fuel your progress - we\'ll emphasize community and understanding.'
      },
      { 
        value: 'independence', 
        label: 'Information to figure things out myself',
        insight: 'You value autonomy - we\'ll provide knowledge and frameworks for self-directed growth.'
      }
    ],
    quickStartQuestion: true,
    insight: "Understanding your support style helps us design interventions that feel natural and effective for you.",
    nextStepPreview: "Let's explore how you like to celebrate progress..."
  },
  {
    id: 'progress_celebration',
    letter: 'Y',
    letterName: 'YIELD PROGRESS',
    question: "How do you prefer to celebrate small wins?",
    type: 'multiple_choice',
    options: [
      { 
        value: 'private_moment', 
        label: 'Quietly acknowledge it to myself',
        insight: 'Internal recognition is meaningful to you - we\'ll help you build powerful self-acknowledgment practices.'
      },
      { 
        value: 'share_others', 
        label: 'Share the achievement with others',
        insight: 'Community celebration energizes you - we\'ll create opportunities for sharing your progress.'
      },
      { 
        value: 'treat_myself', 
        label: 'Treat myself to something special',
        insight: 'Tangible rewards motivate you - we\'ll help you design meaningful reward systems.'
      },
      { 
        value: 'track_progress', 
        label: 'Add it to my progress tracking',
        insight: 'You\'re motivated by visible progress - we\'ll create compelling ways to visualize your growth.'
      },
      { 
        value: 'rarely_celebrate', 
        label: 'I rarely stop to celebrate',
        insight: 'Learning to pause and acknowledge progress will be a game-changer for your motivation.'
      }
    ],
    quickStartQuestion: true,
    insight: "How you celebrate reveals what motivates you and helps us design reward systems that keep you engaged.",
    nextStepPreview: "What daily task would you most like to improve?"
  },
  {
    id: 'control_priority',
    letter: 'T',
    letterName: 'TAKE CONTROL',
    question: "What daily task would you most like to improve?",
    type: 'primary_secondary',
    allowSecondaryAnswers: true,
    secondaryPrompt: "Other areas you'd also like to work on?",
    options: [
      { 
        value: 'morning_routine', 
        label: 'Getting my morning routine smooth and consistent',
        insight: 'A strong morning routine can transform your entire day - we\'ll help you design one that sticks.'
      },
      { 
        value: 'work_focus', 
        label: 'Staying focused and productive during work',
        insight: 'Professional performance is key for you - we\'ll optimize your work-focused cognitive strategies.'
      },
      { 
        value: 'strategic_effectiveness', 
        label: 'Enhancing strategic thinking and decision-making speed',
        insight: 'Professional cognitive optimization will boost your strategic capabilities and analytical efficiency.'
      },
      { 
        value: 'memory_sharpness', 
        label: 'Sharpening memory for professional information retention',
        insight: 'Memory enhancement techniques will improve your ability to retain and recall critical professional information.'
      },
      { 
        value: 'task_completion', 
        label: 'Following through and completing tasks',
        insight: 'Execution is your growth edge - we\'ll build systems that support consistent follow-through.'
      },
      { 
        value: 'daily_planning', 
        label: 'Planning and organizing my day effectively',
        insight: 'Structure creates freedom - we\'ll help you build planning systems that feel natural and effective.'
      },
      { 
        value: 'energy_management', 
        label: 'Managing my energy throughout the day',
        insight: 'Energy is your most precious resource - we\'ll teach you advanced energy optimization techniques.'
      }
    ],
    quickStartQuestion: true,
    insight: "The area you want to improve most shows us where to focus first for maximum impact on your daily life.",
    nextStepPreview: "Finally, let's understand what keeps you motivated..."
  },
  {
    id: 'healing_motivation',
    letter: 'H',
    letterName: 'HEAL FORWARD',
    question: "What motivates you to keep trying when things get tough?",
    type: 'multiple_choice',
    options: [
      { 
        value: 'future_vision', 
        label: 'A clear vision of who I want to become',
        insight: 'You\'re vision-driven - we\'ll help you connect daily actions to your bigger purpose.'
      },
      { 
        value: 'loved_ones', 
        label: 'The people I care about and want to support',
        insight: 'Relationships fuel your persistence - we\'ll help you harness this powerful motivation source.'
      },
      { 
        value: 'prove_possible', 
        label: 'Wanting to prove that improvement is possible',
        insight: 'You\'re driven by possibility - we\'ll help you document and share your progress story.'
      },
      { 
        value: 'better_life', 
        label: 'Knowing life can be better with the right tools',
        insight: 'You believe in solutions - we\'ll provide evidence-based tools that validate your optimism.'
      },
      { 
        value: 'help_others', 
        label: 'Eventually being able to help others with similar challenges',
        insight: 'Service motivates you - we\'ll prepare you to share your journey and support others.'
      }
    ],
    quickStartQuestion: true,
    insight: "Understanding your deeper motivation helps us design a program that connects to what truly matters to you.",
    nextStepPreview: "Great! We now have your MYRHYTHM foundation. Based on your answers, we're preparing personalized strategies for..."
  }
];

// Comprehensive Assessment Questions organized by MYRHYTHM clusters
export const comprehensiveQuestions: MyrhythmQuestion[] = [
  // CLUSTER 1: MINDSET + YIELD & ACKNOWLEDGE (Cognitive Patterns)
  {
    id: 'mindset_self_talk',
    letter: 'M',
    letterName: 'MINDSET',
    question: "How would you describe your inner dialogue when facing cognitive challenges?",
    type: 'multiple_choice',
    options: [
      { value: 'encouraging', label: 'Generally encouraging and patient with myself' },
      { value: 'critical', label: 'Often critical and frustrated with my limitations' },
      { value: 'analytical', label: 'Focused on problem-solving and finding solutions' },
      { value: 'defeated', label: 'Sometimes defeated or hopeless about improvement' }
    ],
    insight: "Your inner dialogue shapes your cognitive performance more than you might realize.",
    nextStepPreview: "This reveals important patterns about how you approach challenges..."
  },
  {
    id: 'mindset_beliefs',
    letter: 'M',
    letterName: 'MINDSET',
    question: "What do you believe about your brain's ability to change and improve?",
    type: 'scale',
    min: 1,
    max: 5,
    labels: {
      1: 'My brain is fixed - I have to work with what I have',
      3: 'Some improvement is possible with effort',
      5: 'My brain can significantly change and improve with the right approach'
    },
    insight: "Your beliefs about neuroplasticity directly impact your potential for cognitive growth.",
    nextStepPreview: "This mindset foundation influences everything else we'll build together..."
  },
  // Continue with remaining questions...
];

// Preference integration questions
export const preferenceQuestions: MyrhythmQuestion[] = [
  {
    id: 'notification_style',
    letter: 'H',
    letterName: 'HARNESS SUPPORT',
    question: "How do you prefer to receive reminders and notifications?",
    type: 'multiple_select',
    options: [
      { value: 'gentle_chimes', label: 'Gentle audio chimes' },
      { value: 'visual_popups', label: 'Visual pop-up reminders' },
      { value: 'vibration', label: 'Vibration alerts' },
      { value: 'scheduled_times', label: 'At specific scheduled times' },
      { value: 'context_based', label: 'Based on my location or activity' }
    ],
    insight: "The right notification style helps support without overwhelming.",
    nextStepPreview: "We'll customize your reminder system to feel natural and helpful..."
  }
  // Add more preference questions...
];

export const scaleLabels = [
  "Not at all",
  "Rarely", 
  "Sometimes",
  "Often",
  "Very much"
];