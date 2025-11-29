// Persona-specific assessment questions that provide REAL value

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    feature: string;
    benefit: string;
  }[];
  category: 'cognitive' | 'emotional' | 'functional' | 'social';
}

// STUDENT QUESTIONS - Age-appropriate, school-focused
export const STUDENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'hardest-subject',
    question: "Which class is hardest to keep up with?",
    category: 'cognitive',
    options: [
      {
        value: 'math-science',
        label: 'Math or Science - lots of steps to remember',
        feature: 'Memory Bridge + Daily Actions',
        benefit: 'Break down complex problems into steps'
      },
      {
        value: 'reading-writing',
        label: 'Reading or Writing - hard to organize thoughts',
        feature: 'Memory Bridge + Calendar',
        benefit: 'Capture ideas and schedule writing time'
      },
      {
        value: 'history-social',
        label: 'History or Social Studies - too many facts',
        feature: 'Memory Bridge',
        benefit: 'Record lectures and create fact summaries'
      },
      {
        value: 'all-subjects',
        label: 'Everything feels hard right now',
        feature: 'Daily Actions + Calendar',
        benefit: 'Start small with one subject at a time'
      }
    ]
  },
  {
    id: 'homework-struggle',
    question: "What's the hardest part about homework?",
    category: 'functional',
    options: [
      {
        value: 'forgetting',
        label: 'Forgetting what was assigned',
        feature: 'Memory Bridge + Daily Actions',
        benefit: 'Capture assignments as you hear them'
      },
      {
        value: 'starting',
        label: 'Getting started - everything feels overwhelming',
        feature: 'Daily Actions',
        benefit: 'Break homework into tiny first steps'
      },
      {
        value: 'finishing',
        label: 'Finishing - I get distracted halfway through',
        feature: 'Calendar',
        benefit: 'Schedule focused time blocks with breaks'
      },
      {
        value: 'understanding',
        label: "Understanding what I'm supposed to do",
        feature: 'Memory Bridge',
        benefit: 'Record instructions and play them back'
      }
    ]
  },
  {
    id: 'best-time',
    question: "When do you feel most ready to focus?",
    category: 'functional',
    options: [
      {
        value: 'morning',
        label: 'Morning - I think better early',
        feature: 'Calendar',
        benefit: "We'll schedule hard stuff for mornings"
      },
      {
        value: 'afternoon',
        label: 'Afternoon - after I wake up more',
        feature: 'Calendar',
        benefit: "We'll protect your afternoon focus time"
      },
      {
        value: 'evening',
        label: 'Evening - after everything quiets down',
        feature: 'Calendar',
        benefit: "We'll plan your evening study sessions"
      },
      {
        value: 'varies',
        label: "It changes - I never know",
        feature: 'Daily Actions',
        benefit: "We'll help you notice your patterns"
      }
    ]
  },
  {
    id: 'reward-motivation',
    question: "What would make finishing homework feel awesome?",
    category: 'emotional',
    options: [
      {
        value: 'streaks',
        label: 'Building streaks - seeing my progress',
        feature: 'Daily Actions',
        benefit: 'Streak counter and progress badges'
      },
      {
        value: 'game-time',
        label: 'Earning free time for games or activities',
        feature: 'Calendar + Daily Actions',
        benefit: 'Auto-schedule reward time after tasks'
      },
      {
        value: 'less-stress',
        label: "Just not being stressed about it",
        feature: 'Memory Bridge + Calendar',
        benefit: 'Know everything is captured and planned'
      },
      {
        value: 'parent-happy',
        label: 'Making parents/teachers proud',
        feature: 'Daily Actions',
        benefit: 'Share wins with your support team'
      }
    ]
  }
];

// EXECUTIVE QUESTIONS - ROI-focused, performance-oriented
export const EXECUTIVE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'biggest-time-leak',
    question: "What's your biggest productivity drain?",
    category: 'functional',
    options: [
      {
        value: 'meeting-followup',
        label: 'Meetings without clear outcomes or follow-up',
        feature: 'Memory Bridge',
        benefit: 'Auto-extract actions from every meeting'
      },
      {
        value: 'context-switching',
        label: 'Context switching between projects',
        feature: 'Calendar + Daily Actions',
        benefit: 'Batch similar work, protect deep work time'
      },
      {
        value: 'email-overload',
        label: 'Email and message overload',
        feature: 'Daily Actions',
        benefit: 'Prioritize by impact, not inbox order'
      },
      {
        value: 'decision-fatigue',
        label: 'Too many decisions, not enough time to think',
        feature: 'Memory Bridge + Calendar',
        benefit: 'Capture thoughts, schedule decision time'
      }
    ]
  },
  {
    id: 'productive-day-measure',
    question: "How do you measure a productive day?",
    category: 'functional',
    options: [
      {
        value: 'tasks-completed',
        label: 'Number of tasks completed',
        feature: 'Daily Actions',
        benefit: 'Track completion velocity and patterns'
      },
      {
        value: 'strategic-progress',
        label: 'Progress on strategic priorities',
        feature: 'Daily Actions + Calendar',
        benefit: 'Link daily actions to quarterly goals'
      },
      {
        value: 'stakeholder-alignment',
        label: 'Stakeholder alignment and decisions made',
        feature: 'Memory Bridge',
        benefit: 'Capture and track all commitments'
      },
      {
        value: 'impact-created',
        label: 'Impact created for team or customers',
        feature: 'Memory Bridge + Daily Actions',
        benefit: 'Connect actions to business outcomes'
      }
    ]
  },
  {
    id: 'commitment-tracking',
    question: "How do you currently track commitments made in meetings?",
    category: 'cognitive',
    options: [
      {
        value: 'notes-manual',
        label: 'Manual notes - often incomplete',
        feature: 'Memory Bridge',
        benefit: 'Record everything, we extract the actions'
      },
      {
        value: 'memory',
        label: 'Trust my memory - sometimes things slip',
        feature: 'Memory Bridge + Daily Actions',
        benefit: '100% capture rate, zero mental load'
      },
      {
        value: 'delegate',
        label: 'Delegate to EA or team member',
        feature: 'Memory Bridge',
        benefit: 'Share extracted actions automatically'
      },
      {
        value: 'todo-app',
        label: 'Todo app - but disconnected from calendar',
        feature: 'Calendar + Daily Actions',
        benefit: 'Unified view of tasks and time'
      }
    ]
  },
  {
    id: 'peak-performance',
    question: "When are you at peak mental performance?",
    category: 'functional',
    options: [
      {
        value: 'early-morning',
        label: 'Early morning (5-9am)',
        feature: 'Calendar',
        benefit: 'Protect morning hours for high-value work'
      },
      {
        value: 'late-morning',
        label: 'Late morning (9am-12pm)',
        feature: 'Calendar',
        benefit: 'Schedule strategic meetings mid-morning'
      },
      {
        value: 'afternoon',
        label: 'Afternoon (1-5pm)',
        feature: 'Calendar',
        benefit: 'Batch meetings, protect afternoon focus'
      },
      {
        value: 'varies-unpredictable',
        label: 'Varies based on travel/workload',
        feature: 'Daily Actions',
        benefit: 'Adaptive scheduling based on context'
      }
    ]
  }
];

// POST-RECOVERY QUESTIONS - Maintenance and optimization focused
export const POST_RECOVERY_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'current-strategies',
    question: "Which cognitive tools do you rely on most?",
    category: 'cognitive',
    options: [
      {
        value: 'calendar-reminders',
        label: 'Calendar and reminders',
        feature: 'Calendar + Daily Actions',
        benefit: 'Enhanced scheduling with smart reminders'
      },
      {
        value: 'notes-voice',
        label: 'Notes and voice memos',
        feature: 'Memory Bridge',
        benefit: 'Upgrade notes to structured actions'
      },
      {
        value: 'support-people',
        label: 'Support from family/friends',
        feature: 'Support Network',
        benefit: 'Coordinate support more effectively'
      },
      {
        value: 'routines',
        label: 'Established routines',
        feature: 'Daily Actions + Calendar',
        benefit: 'Strengthen and optimize your routines'
      }
    ]
  },
  {
    id: 'energy-patterns',
    question: "When do you feel most mentally sharp?",
    category: 'functional',
    options: [
      {
        value: 'morning-best',
        label: 'Mornings are my best time',
        feature: 'Calendar',
        benefit: 'Front-load important tasks'
      },
      {
        value: 'afternoon-best',
        label: 'I hit my stride after lunch',
        feature: 'Calendar',
        benefit: 'Schedule complex work afternoon'
      },
      {
        value: 'consistent',
        label: 'Pretty consistent throughout the day',
        feature: 'Daily Actions',
        benefit: 'Flexible scheduling options'
      },
      {
        value: 'unpredictable',
        label: 'It varies - I have good and bad days',
        feature: 'Daily Actions + Calendar',
        benefit: 'Adaptive approach with backup plans'
      }
    ]
  },
  {
    id: 'maintenance-goal',
    question: "What's your main focus now?",
    category: 'emotional',
    options: [
      {
        value: 'maintain-gains',
        label: 'Maintaining the progress I\'ve made',
        feature: 'Daily Actions',
        benefit: 'Track consistency and catch early slips'
      },
      {
        value: 'push-further',
        label: 'Pushing further - I want to keep improving',
        feature: 'Memory Bridge + Calendar',
        benefit: 'Advanced tools for continued growth'
      },
      {
        value: 'simplify',
        label: 'Simplifying - less effort, same results',
        feature: 'Memory Bridge',
        benefit: 'Automate what you do manually now'
      },
      {
        value: 'independence',
        label: 'More independence, less reliance on others',
        feature: 'Daily Actions + Calendar',
        benefit: 'Self-management tools that work'
      }
    ]
  },
  {
    id: 'warning-signs',
    question: "What early warning signs tell you something's slipping?",
    category: 'emotional',
    options: [
      {
        value: 'forgetting-more',
        label: 'Forgetting more things than usual',
        feature: 'Memory Bridge',
        benefit: 'Capture everything automatically'
      },
      {
        value: 'fatigue',
        label: 'More mental fatigue, less stamina',
        feature: 'Daily Actions',
        benefit: 'Energy tracking and pacing'
      },
      {
        value: 'overwhelm',
        label: 'Feeling overwhelmed by normal tasks',
        feature: 'Calendar + Daily Actions',
        benefit: 'Automatic task breakdown'
      },
      {
        value: 'social-withdrawal',
        label: 'Withdrawing from activities or people',
        feature: 'Support Network',
        benefit: 'Gentle connection prompts'
      }
    ]
  }
];

// BRAIN INJURY QUESTIONS - Enhanced with more specificity
export const BRAIN_INJURY_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'biggest-challenge',
    question: "What affects your daily life most right now?",
    category: 'cognitive',
    options: [
      {
        value: 'memory-recall',
        label: 'Memory - forgetting conversations and commitments',
        feature: 'Memory Bridge',
        benefit: 'Never lose another conversation'
      },
      {
        value: 'organization',
        label: 'Organization - keeping track of everything',
        feature: 'Calendar + Daily Actions',
        benefit: 'External brain for all your tasks'
      },
      {
        value: 'fatigue',
        label: 'Cognitive fatigue - running out of mental energy',
        feature: 'Daily Actions',
        benefit: 'Pace your day to protect your energy'
      },
      {
        value: 'communication',
        label: 'Communication - explaining needs to others',
        feature: 'Support Network + Memory Bridge',
        benefit: 'Bridge the gap with your support circle'
      }
    ]
  },
  {
    id: 'support-system',
    question: "Who's part of your support team?",
    category: 'social',
    options: [
      {
        value: 'family-primary',
        label: 'Family member(s) - spouse, parent, sibling',
        feature: 'Support Network',
        benefit: 'Coordinate care and share updates'
      },
      {
        value: 'healthcare',
        label: 'Healthcare providers - therapists, doctors',
        feature: 'Memory Bridge + Support Network',
        benefit: 'Track progress for appointments'
      },
      {
        value: 'friends-colleagues',
        label: 'Friends or colleagues',
        feature: 'Support Network',
        benefit: 'Keep connections strong'
      },
      {
        value: 'mostly-independent',
        label: "Mostly myself - building independence",
        feature: 'Daily Actions + Calendar',
        benefit: 'Self-management tools that work'
      }
    ]
  },
  {
    id: 'recovery-stage',
    question: "Where are you in your journey?",
    category: 'emotional',
    options: [
      {
        value: 'early-stage',
        label: 'Early stage - still figuring things out',
        feature: 'Memory Bridge + Support Network',
        benefit: 'Maximum support and structure'
      },
      {
        value: 'mid-recovery',
        label: 'Mid-recovery - making progress but need help',
        feature: 'Daily Actions + Calendar',
        benefit: 'Building routines and independence'
      },
      {
        value: 'late-recovery',
        label: 'Later stage - maintaining and optimizing',
        feature: 'Calendar + Daily Actions',
        benefit: 'Fine-tune your systems'
      },
      {
        value: 'long-term',
        label: 'Long-term - this is my new normal',
        feature: 'Memory Bridge',
        benefit: 'Sustainable daily support'
      }
    ]
  },
  {
    id: 'daily-goal',
    question: "What would make tomorrow better?",
    category: 'functional',
    options: [
      {
        value: 'less-forgotten',
        label: 'Forgetting fewer things',
        feature: 'Memory Bridge',
        benefit: 'Capture everything automatically'
      },
      {
        value: 'more-energy',
        label: 'Having more mental energy',
        feature: 'Daily Actions',
        benefit: 'Pace tasks to protect energy'
      },
      {
        value: 'feel-capable',
        label: 'Feeling more capable and confident',
        feature: 'Daily Actions + Calendar',
        benefit: 'Small wins build confidence'
      },
      {
        value: 'less-stress',
        label: 'Less stress and overwhelm',
        feature: 'Calendar + Memory Bridge',
        benefit: 'Know everything is handled'
      }
    ]
  }
];

// CAREGIVER QUESTIONS - Support-focused
export const CAREGIVER_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'care-role',
    question: "What best describes your caregiving role?",
    category: 'social',
    options: [
      {
        value: 'primary',
        label: 'Primary caregiver - main support person',
        feature: 'Support Network + Memory Bridge',
        benefit: 'Coordinate all care activities'
      },
      {
        value: 'shared',
        label: 'Shared caregiving with others',
        feature: 'Support Network',
        benefit: 'Easy handoffs and communication'
      },
      {
        value: 'remote',
        label: 'Remote support - not always physically present',
        feature: 'Support Network + Calendar',
        benefit: 'Stay connected and coordinated'
      },
      {
        value: 'professional',
        label: 'Professional caregiver',
        feature: 'Memory Bridge + Daily Actions',
        benefit: 'Document care efficiently'
      }
    ]
  },
  {
    id: 'biggest-challenge-caregiver',
    question: "What's most challenging about your role?",
    category: 'functional',
    options: [
      {
        value: 'coordination',
        label: 'Coordinating appointments and medications',
        feature: 'Calendar + Memory Bridge',
        benefit: 'Never miss an appointment or dose'
      },
      {
        value: 'communication',
        label: 'Communicating with the person I support',
        feature: 'Memory Bridge',
        benefit: 'Record and review conversations'
      },
      {
        value: 'self-care',
        label: 'Taking care of myself while caregiving',
        feature: 'Daily Actions + Calendar',
        benefit: 'Schedule self-care without guilt'
      },
      {
        value: 'updates',
        label: 'Keeping others updated on care',
        feature: 'Support Network',
        benefit: 'Automatic updates to care team'
      }
    ]
  },
  {
    id: 'support-needed',
    question: "What would help you most?",
    category: 'functional',
    options: [
      {
        value: 'tracking',
        label: 'Better tracking of care activities',
        feature: 'Memory Bridge + Daily Actions',
        benefit: 'Automatic care documentation'
      },
      {
        value: 'reminders',
        label: 'Reliable reminders for everything',
        feature: 'Calendar',
        benefit: 'Smart reminders that work'
      },
      {
        value: 'team-coordination',
        label: 'Better coordination with care team',
        feature: 'Support Network',
        benefit: 'Shared care calendar and tasks'
      },
      {
        value: 'stress-reduction',
        label: 'Less mental load and stress',
        feature: 'Memory Bridge + Calendar',
        benefit: 'Offload to your digital assistant'
      }
    ]
  }
];

// Function to get questions by persona type
export function getQuestionsForPersona(personaType: string): AssessmentQuestion[] {
  switch (personaType) {
    case 'student':
      return STUDENT_QUESTIONS;
    case 'executive':
      return EXECUTIVE_QUESTIONS;
    case 'post-recovery':
      return POST_RECOVERY_QUESTIONS;
    case 'brain-injury':
    case 'memory-challenges':
      return BRAIN_INJURY_QUESTIONS;
    case 'caregiver':
      return CAREGIVER_QUESTIONS;
    default:
      return BRAIN_INJURY_QUESTIONS; // Default fallback
  }
}
