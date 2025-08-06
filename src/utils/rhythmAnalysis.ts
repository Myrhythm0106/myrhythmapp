
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

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface FocusAreaInfo {
  current: FocusArea;
  evolution: Array<{
    phase: string;
    focus: string;
    description: string;
  }>;
  recommendations: string[];
}

export const focusAreas: FocusArea[] = [
  {
    id: 'cognitive-function',
    title: 'Cognitive Enhancement',
    description: 'Optimize memory, focus, and mental clarity',
    color: 'blue',
    icon: 'Brain'
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Balance',
    description: 'Manage stress and emotional well-being',
    color: 'green',
    icon: 'Heart'
  },
  {
    id: 'energy-management',
    title: 'Energy Optimization',
    description: 'Sustain physical and mental energy',
    color: 'orange',
    icon: 'Zap'
  },
  {
    id: 'social-connection',
    title: 'Social Integration',
    description: 'Build meaningful relationships and support',
    color: 'purple',
    icon: 'Users'
  }
];

// Helper function to create a preview result
export function createPreviewResult(baseResult: Partial<AssessmentResult>): AssessmentResult {
  return {
    userType: baseResult.userType || 'cognitive-optimization',
    focusArea: baseResult.focusArea || 'cognitive-function',
    overallScore: baseResult.overallScore || 2.1,
    primaryRhythm: baseResult.primaryRhythm || 'Balanced Performer',
    keyInsights: baseResult.keyInsights || ['Strong analytical thinking', 'Good problem-solving skills'],
    primaryFocus: baseResult.primaryFocus || 'Cognitive Enhancement',
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
      primaryFocus: 'Cognitive Enhancement',
      focusArea: 'cognitive-function'
    },
    'empowerment': {
      overallScore: 82,
      primaryRhythm: 'Empowered Leader',
      keyInsights: [
        'Natural leadership qualities emerge under pressure',
        'High emotional intelligence in group settings',
        'Thrives with autonomy and clear goals'
      ],
      primaryFocus: 'Personal Empowerment',
      focusArea: 'social-connection'
    },
    'brain-health': {
      overallScore: 75,
      primaryRhythm: 'Wellness Optimizer',
      keyInsights: [
        'Strong mind-body connection awareness',
        'Responds well to holistic approaches',
        'Benefits from routine and consistency'
      ],
      primaryFocus: 'Brain Health Optimization',
      focusArea: 'energy-management'
    }
  };

  return createPremiumResult({
    userType,
    ...baseResults[userType]
  });
}

// Get current focus area for user
export function getCurrentFocusArea(userType: UserType): FocusArea {
  const focusMap = {
    'cognitive-optimization': 'cognitive-function',
    'empowerment': 'social-connection',
    'brain-health': 'energy-management'
  };
  
  return focusAreas.find(f => f.id === focusMap[userType]) || focusAreas[0];
}

// Get current assessment result (mock for now)
export function getCurrentAssessmentResult(): AssessmentResult | null {
  // In a real app, this would fetch from local storage or API
  return null;
}

// Get assessment history (mock for now)
export function getAssessmentHistory(): AssessmentResult[] {
  // In a real app, this would fetch from API
  return [];
}

// Get focus area evolution
export function getFocusAreaEvolution(focusAreaId: string): FocusAreaInfo | null {
  const focusArea = focusAreas.find(f => f.id === focusAreaId);
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
