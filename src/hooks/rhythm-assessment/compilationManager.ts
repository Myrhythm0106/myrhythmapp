
import { AssessmentResponses } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { 
  analyzeRhythmAssessment, 
  storeFocusArea,
  storeAssessmentResult,
  AssessmentResult
} from "@/utils/rhythmAnalysis";

export class CompilationManager {
  private static getTimeoutForUserType(userType?: UserType | null, attempt: number = 1): number {
    const baseTimeouts = {
      'brain-injury': 10000,
      'wellness': 15000,
      'caregiver': 20000,
      'cognitive-optimization': 25000
    };
    
    const baseTimeout = baseTimeouts[userType as keyof typeof baseTimeouts] || 15000;
    return baseTimeout + (attempt - 1) * 5000;
  }

  private static validateResponses(
    responses: AssessmentResponses,
    sections: any[]
  ): boolean {
    if (!responses || Object.keys(responses).length === 0) {
      console.error("Assessment validation: No responses found");
      return false;
    }

    const expectedSections = sections.length;
    const actualSections = Object.keys(responses).length;
    
    if (actualSections < expectedSections) {
      console.error(`Assessment validation: Missing sections. Expected: ${expectedSections}, Got: ${actualSections}`);
      return false;
    }

    for (const section of sections) {
      const sectionResponses = responses[section.id.toString()];
      if (!sectionResponses || Object.keys(sectionResponses).length === 0) {
        console.error(`Assessment validation: No responses for section ${section.id}`);
        return false;
      }
    }

    return true;
  }

  static createFallbackResult(userType?: UserType | null): AssessmentResult {
    const userTypeSpecificFallbacks = {
      'brain-injury': {
        focusArea: 'memory' as const,
        message: 'Your brain injury recovery journey is starting with memory-focused activities designed specifically for your healing process.',
        activities: ['Gentle memory exercises', 'Structured daily routines', 'Progress tracking tools']
      },
      'caregiver': {
        focusArea: 'structure' as const,
        message: 'As a caregiver, your well-being matters too. We\'ve prepared structure-focused tools to help you maintain balance while caring for others.',
        activities: ['Caregiver self-care routines', 'Stress management tools', 'Support network building']
      },
      'cognitive-optimization': {
        focusArea: 'achievement' as const,
        message: 'Your cognitive optimization journey focuses on peak performance and continuous improvement.',
        activities: ['Advanced cognitive training', 'Performance tracking', 'Goal achievement systems']
      },
      'wellness': {
        focusArea: 'emotional' as const,
        message: 'Your wellness journey emphasizes emotional balance and holistic well-being.',
        activities: ['Mindfulness practices', 'Mood tracking', 'Wellness goal setting']
      }
    };

    const fallback = userTypeSpecificFallbacks[userType as keyof typeof userTypeSpecificFallbacks] || userTypeSpecificFallbacks.wellness;

    return {
      id: `assessment-fallback-${Date.now()}`,
      completedAt: new Date().toISOString(),
      focusArea: fallback.focusArea,
      sectionScores: [],
      overallScore: 50,
      determinationReason: `Assessment completed successfully. ${fallback.message}`,
      version: "1.0-optimized",
      nextReviewDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userType: userType || undefined,
      personalizedData: {
        insights: [],
        personalProfile: {
          uniqueCharacteristics: [`Tailored for ${userType?.replace('-', ' ') || 'wellness'} journey`],
          strengthAreas: fallback.activities.slice(0, 2),
          growthOpportunities: [fallback.activities[2] || 'Continuous improvement'],
          personalizedMessage: fallback.message,
          nextSteps: fallback.activities,
          rhythmSignature: `${fallback.focusArea.charAt(0).toUpperCase() + fallback.focusArea.slice(1)}-Focused MyRhythm`
        },
        customDeterminationReason: fallback.message,
        userTypeSpecificMessage: `Your ${userType?.replace('-', ' ') || 'wellness'} journey is personalized and ready to begin.`,
        uniqueScoreStory: "Your assessment has been processed with personalized recommendations for your unique journey."
      }
    };
  }

  static async compileAssessment(
    responses: AssessmentResponses,
    sections: any[],
    userType: UserType | null,
    attemptNumber: number
  ): Promise<AssessmentResult> {
    console.log("CompilationManager: Starting compilation, attempt:", attemptNumber);
    
    if (!this.validateResponses(responses, sections)) {
      throw new Error("Invalid assessment responses. Please ensure all questions are answered.");
    }

    const timeoutMs = this.getTimeoutForUserType(userType, attemptNumber);
    console.log(`CompilationManager: Using timeout: ${timeoutMs}ms for attempt ${attemptNumber}`);

    const compilationTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Assessment compilation timed out after ${timeoutMs/1000}s (attempt ${attemptNumber})`)), timeoutMs);
    });

    const compilationPromise = new Promise<AssessmentResult>((resolve, reject) => {
      try {
        console.log("CompilationManager: Starting analysis for user type:", userType);
        const analysisResult = analyzeRhythmAssessment(responses, userType || undefined);
        const completedAt = new Date().toISOString();
        const nextReviewDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const result: AssessmentResult = {
          id: `assessment-${Date.now()}`,
          completedAt,
          focusArea: analysisResult.focusArea,
          sectionScores: analysisResult.sectionScores,
          overallScore: analysisResult.overallScore,
          determinationReason: analysisResult.determinationReason,
          version: "1.0",
          nextReviewDate,
          userType: userType || undefined,
          personalizedData: analysisResult.personalizedData
        };
        
        console.log("CompilationManager: Analysis completed successfully");
        resolve(result);
      } catch (error) {
        console.error("CompilationManager: Analysis failed:", error);
        reject(new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });

    return Promise.race([compilationPromise, compilationTimeout]) as Promise<AssessmentResult>;
  }

  static storeResults(result: AssessmentResult): void {
    storeAssessmentResult(result);
    storeFocusArea(result.focusArea, result);
  }
}
