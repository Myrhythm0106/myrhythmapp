
import { UserType } from "@/types/user";

export interface AssessmentResult {
  id?: string;
  userType: UserType;
  focusArea: string;
  overallScore: number;
  primaryRhythm: string;
  keyInsights: string[];
  primaryFocus: string;
  
  // Basic results available to all users
  primaryStrength: string;
  basicInsight: string;
  quickWin: string;
  planType?: 'preview' | 'premium' | 'full';
  
  // Premium features
  detailedInsights?: Array<{
    title: string;
    description: string;
    actionItem: string;
  }>;
  
  actionPlan?: Array<{
    focus: string;
    tasks: string[];
  }>;
  
  // Additional properties for compatibility
  completedAt?: string;
  version?: string;
  personalizedData?: {
    insights: Array<{
      type: 'strength' | 'challenge' | 'opportunity' | 'recommendation';
      title: string;
      description: string;
      actionable: boolean;
    }>;
    personalProfile: {
      uniqueCharacteristics: string[];
      strengths: string[];
      growthOpportunities: string[];
      personalizedMessage: string;
      nextSteps: string[];
      rhythmSignature: string;
    };
  };
  
  // Section scores for detailed analysis
  sectionScores?: Array<{
    id: number;
    title: string;
    average: number;
    responses: Record<string, number>;
    phase: string;
  }>;
  
  determinationReason?: string;
  secondaryInsights?: Array<{
    questionId: string;
    secondary: string[];
    context: string;
  }>;
}

export interface SectionScore {
  id: number;
  title: string;
  average: number;
  responses: Record<string, number>;
  phase: string;
}

export type FocusArea = 'memory' | 'structure' | 'emotional' | 'achievement' | 'community' | 'growth';

export interface FocusAreaConfig {
  id: FocusArea;
  title: string;
  description: string;
  color: string;
  icon: string;
  gradient: string;
  phase: string;
  keyFeatures: string[];
  primaryActions: string[];
}

export interface FocusAreaInfo {
  current: FocusAreaConfig;
  evolution: Array<{
    phase: string;
    focus: string;
    description: string;
  }>;
  recommendations: string[];
}

export const focusAreas: Record<FocusArea, FocusAreaConfig> = {
  memory: {
    id: 'memory',
    title: 'Memory Enhancement',
    description: 'Strengthen memory patterns and cognitive recall through targeted exercises and daily practices.',
    color: 'from-blue-500 to-indigo-600',
    icon: 'Brain',
    gradient: 'from-blue-500 to-indigo-600',
    phase: 'Foundation Building',
    keyFeatures: ['Daily memory logging', 'Cognitive exercises', 'Pattern recognition', 'Memory support tools'],
    primaryActions: ['Log 3 important moments daily', 'Complete memory exercises', 'Review weekly patterns']
  },
  structure: {
    id: 'structure',
    title: 'Structure & Routine',
    description: 'Build consistent daily routines and organizational systems for stability and growth.',
    color: 'from-green-500 to-emerald-600',
    icon: 'Calendar',
    gradient: 'from-green-500 to-emerald-600',
    phase: 'Routine Building',
    keyFeatures: ['Morning routines', 'Medication tracking', 'Appointment management', 'Daily structure'],
    primaryActions: ['Follow morning routine', 'Take medications on time', 'Check daily schedule']
  },
  emotional: {
    id: 'emotional',
    title: 'Emotional Wellbeing',
    description: 'Develop emotional resilience and healthy coping strategies for mental wellness.',
    color: 'from-purple-500 to-pink-600',
    icon: 'Heart',
    gradient: 'from-purple-500 to-pink-600',
    phase: 'Emotional Regulation',
    keyFeatures: ['Mood tracking', 'Gratitude practice', 'Stress management', 'Emotional awareness'],
    primaryActions: ['Check in with mood', 'Practice gratitude', 'Use stress management techniques']
  },
  achievement: {
    id: 'achievement',
    title: 'Achievement & Growth',
    description: 'Build confidence through meaningful accomplishments and skill development.',
    color: 'from-orange-500 to-red-600',
    icon: 'Target',
    gradient: 'from-orange-500 to-red-600',
    phase: 'Skill Building',
    keyFeatures: ['Independence goals', 'Skill rebuilding', 'Confidence building', 'Progress tracking'],
    primaryActions: ['Work on independence tasks', 'Practice daily skills', 'Celebrate small wins']
  },
  community: {
    id: 'community',
    title: 'Community Connection',
    description: 'Build meaningful relationships and support networks for social wellness.',
    color: 'from-teal-500 to-cyan-600',
    icon: 'Users',
    gradient: 'from-teal-500 to-cyan-600',
    phase: 'Connection Building',
    keyFeatures: ['Support networks', 'Family connections', 'Community involvement', 'Social skills'],
    primaryActions: ['Connect with support group', 'Reach out to family', 'Engage in community']
  },
  growth: {
    id: 'growth',
    title: 'Personal Growth',
    description: 'Continuous learning and self-improvement through new challenges and experiences.',
    color: 'from-indigo-500 to-purple-600',
    icon: 'TrendingUp',
    gradient: 'from-indigo-500 to-purple-600',
    phase: 'Growth & Development',
    keyFeatures: ['Cognitive training', 'New skills', 'Self-reflection', 'Continuous learning'],
    primaryActions: ['Complete brain training', 'Practice new skills', 'Reflect on progress']
  }
};

// Helper function to create a preview result
export function createPreviewResult(baseResult: Partial<AssessmentResult>): AssessmentResult {
  return {
    userType: baseResult.userType || 'cognitive-optimization',
    focusArea: baseResult.focusArea || 'memory',
    overallScore: baseResult.overallScore || 2.1,
    primaryRhythm: baseResult.primaryRhythm || 'Balanced Performer',
    keyInsights: baseResult.keyInsights || ['Strong analytical thinking', 'Good problem-solving skills'],
    primaryFocus: baseResult.primaryFocus || 'Memory Enhancement',
    primaryStrength: baseResult.primaryStrength || 'Analytical Thinking',
    basicInsight: baseResult.basicInsight || 'Your analytical mind is your greatest asset. You excel at breaking down complex problems into manageable steps.',
    quickWin: baseResult.quickWin || 'Focus on one small task at a time and celebrate each completion.',
    planType: 'preview',
    completedAt: new Date().toISOString(),
    version: '2.0',
    ...baseResult
  };
}

// Helper function to create full premium result
export function createPremiumResult(baseResult: Partial<AssessmentResult>): AssessmentResult {
  const preview = createPreviewResult(baseResult);
  
  return {
    ...preview,
    planType: 'premium',
    detailedInsights: baseResult.detailedInsights || [
      {
        title: 'Cognitive Strengths',
        description: 'Your assessment reveals strong analytical and processing capabilities.',
        actionItem: 'Build on these strengths with advanced cognitive challenges.'
      },
      {
        title: 'Growth Opportunities',
        description: 'Areas identified for enhancement include working memory and attention span.',
        actionItem: 'Practice focused attention exercises for 10 minutes daily.'
      },
      {
        title: 'Personalized Strategy',
        description: 'Your unique cognitive profile suggests a structured, goal-oriented approach.',
        actionItem: 'Use the Pomodoro technique with 25-minute focused sessions.'
      }
    ],
    actionPlan: baseResult.actionPlan || [
      {
        focus: 'Foundation Building',
        tasks: ['Complete daily cognitive warm-up', 'Establish morning routine', 'Track progress metrics']
      },
      {
        focus: 'Skill Development',
        tasks: ['Advanced memory exercises', 'Attention training games', 'Problem-solving challenges']
      },
      {
        focus: 'Integration',
        tasks: ['Apply skills to daily tasks', 'Teach techniques to others', 'Mentor newcomers']
      },
      {
        focus: 'Mastery',
        tasks: ['Create personal protocols', 'Optimize based on results', 'Share success stories']
      }
    ],
    personalizedData: {
      insights: [
        {
          type: 'strength',
          title: 'Natural Problem Solver',
          description: 'You excel at breaking down complex challenges into manageable steps.',
          actionable: true
        },
        {
          type: 'opportunity',
          title: 'Enhanced Focus Training',
          description: 'Regular attention exercises could significantly boost your cognitive performance.',
          actionable: true
        }
      ],
      personalProfile: {
        uniqueCharacteristics: ['Analytical mindset', 'Strategic thinking', 'Detail-oriented'],
        strengths: ['Problem-solving', 'Logical reasoning', 'Pattern recognition'],
        growthOpportunities: ['Sustained attention', 'Working memory', 'Processing speed'],
        personalizedMessage: 'Your cognitive profile shows exceptional analytical capabilities with room for enhanced focus training.',
        nextSteps: ['Begin daily focus exercises', 'Track cognitive metrics', 'Apply techniques to real-world challenges'],
        rhythmSignature: 'The Analytical Optimizer'
      }
    }
  };
}

// Generate sample assessment result for demos
export function generateSampleAssessmentResult(userType: UserType): AssessmentResult {
  const baseResults = {
    'cognitive-optimization': {
      overallScore: 78,
      primaryRhythm: 'Analytical Optimizer',
      keyInsights: [
        'Peak cognitive performance in morning hours',
        'Strong pattern recognition abilities',
        'Benefits from structured problem-solving approaches'
      ],
      primaryFocus: 'Memory Enhancement',
      focusArea: 'memory'
    },
    'empowerment': {
      overallScore: 82,
      primaryRhythm: 'Empowered Leader',
      keyInsights: [
        'Natural leadership qualities emerge under pressure',
        'High emotional intelligence in group settings',
        'Thrives with autonomy and clear goals'
      ],
      primaryFocus: 'Community Connection',
      focusArea: 'community'
    },
    'brain-health': {
      overallScore: 75,
      primaryRhythm: 'Wellness Optimizer',
      keyInsights: [
        'Strong mind-body connection awareness',
        'Responds well to holistic approaches',
        'Benefits from routine and consistency'
      ],
      primaryFocus: 'Structure & Routine',
      focusArea: 'structure'
    }
  };

  return createPremiumResult({
    userType,
    ...baseResults[userType]
  });
}

// Get current focus area for user
export function getCurrentFocusArea(userType?: UserType): FocusArea | null {
  if (!userType) {
    const storedUserData = localStorage.getItem('myrhythm_user_data');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      userType = userData.type;
    }
  }
  
  if (!userType) return null;
  
  const focusMap: Record<UserType, FocusArea> = {
    'cognitive-optimization': 'memory',
    'empowerment': 'community',
    'brain-health': 'structure'
  };
  
  return focusMap[userType] || 'memory';
}

// Get current assessment result (mock for now)
export function getCurrentAssessmentResult(): AssessmentResult | null {
  // In a real app, this would fetch from local storage or API
  const storedResult = localStorage.getItem('myrhythm_assessment_result');
  return storedResult ? JSON.parse(storedResult) : null;
}

// Get assessment history (mock for now)
export function getAssessmentHistory(): AssessmentResult[] {
  // In a real app, this would fetch from API
  const storedHistory = localStorage.getItem('myrhythm_assessment_history');
  return storedHistory ? JSON.parse(storedHistory) : [];
}

// Get focus area evolution
export function getFocusAreaEvolution(focusAreaId?: string): FocusAreaInfo | null {
  if (!focusAreaId) return null;
  
  const focusArea = focusAreas[focusAreaId as FocusArea];
  if (!focusArea) return null;

  return {
    current: focusArea,
    evolution: [
      {
        phase: 'Foundation',
        focus: 'Building core habits',
        description: 'Establish baseline routines and awareness'
      },
      {
        phase: 'Development',
        focus: 'Skill enhancement',
        description: 'Targeted improvement in key areas'
      },
      {
        phase: 'Integration',
        focus: 'Lifestyle integration',
        description: 'Seamless application to daily life'
      },
      {
        phase: 'Mastery',
        focus: 'Optimization and teaching',
        description: 'Peak performance and helping others'
      }
    ],
    recommendations: [
      'Start with foundational practices',
      'Track progress consistently',
      'Gradually increase complexity',
      'Share knowledge with others'
    ]
  };
}
