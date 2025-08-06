
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
    ]
  };
}
