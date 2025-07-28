import { UserType } from "@/types/user";

// Basic assessment result for free users (no personalized insights)
export interface BasicAssessmentResult {
  id: string;
  userType: UserType;
  assessmentType: 'brief' | 'comprehensive';
  completedAt: string;
  responses: Record<string, any>;
  
  // Basic metrics available to all users
  overallScore: number;
  primaryRhythm: string;
  keyInsights: string[]; // General insights, not personalized
  primaryFocus: string;
  
  // Basic profile data (not personalized)
  myrhythmProfile?: {
    primaryChallenge: string;
    energyPeak: string;
    supportStyle: string;
    quickRecommendations: string[];
  };
}

// Premium assessment result for paid users (includes personalized insights)
export interface PremiumAssessmentResult extends BasicAssessmentResult {
  // Personalized data only available for paid users
  personalizedData: {
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
  
  // Enhanced metrics for paid users
  sectionScores?: Array<{
    id: number;
    title: string;
    average: number;
    responses: Record<string, number>;
    phase: string;
  }>;
  focusArea?: string;
  determinationReason?: string;
  secondaryInsights?: Array<{
    questionId: string;
    secondary: string[];
    context: string;
  }>;
}