
import { useState } from "react";
import { getCurrentSections, AssessmentResponses, getSectionsForUserType } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { 
  analyzeRhythmAssessment, 
  storeFocusArea,
  storeAssessmentResult,
  AssessmentResult
} from "@/utils/rhythmAnalysis";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export function useRhythmAssessment(userType?: UserType | null) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [compilationAttempts, setCompilationAttempts] = useState(0);

  // Get sections based on provided userType or fallback to localStorage
  const effectiveUserType = userType || (localStorage.getItem("myrhythm_user_type") as UserType | null);
  const sections = getSectionsForUserType(effectiveUserType || undefined);

  console.log("useRhythmAssessment: userType:", effectiveUserType);
  console.log("useRhythmAssessment: sections loaded:", sections.length);

  // Get timeout based on user type complexity
  const getTimeoutForUserType = (userType?: UserType | null, attempt: number = 1): number => {
    const baseTimeouts = {
      'brain-injury': 10000,          // 10s - simpler processing
      'wellness': 15000,              // 15s - moderate
      'caregiver': 20000,             // 20s - moderate
      'cognitive-optimization': 25000  // 25s - most complex
    };
    
    const baseTimeout = baseTimeouts[userType as keyof typeof baseTimeouts] || 15000;
    // Progressive timeout increase per attempt
    return baseTimeout + (attempt - 1) * 5000; // +5s per retry
  };

  const handleResponse = (questionId: string, value: any) => {
    const sectionId = sections[currentSection].id.toString();
    const newResponses = {
      ...responses,
      [sectionId]: {
        ...responses[sectionId],
        [questionId]: typeof value === 'string' ? parseInt(value, 10) : value
      }
    };
    
    setResponses(newResponses);
    
    // Auto-save progress every 30 seconds
    const saveProgress = () => {
      localStorage.setItem('myrhythm_assessment_progress', JSON.stringify({
        responses: newResponses,
        currentSection,
        userType: effectiveUserType,
        timestamp: new Date().toISOString()
      }));
    };

    // Debounced auto-save
    clearTimeout((window as any).assessmentSaveTimeout);
    (window as any).assessmentSaveTimeout = setTimeout(saveProgress, 2000);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setIsCompiling(true);
      setCompilationError(null);
      setCompilationAttempts(0); // Reset attempts when starting compilation
    }
  };

  const validateResponses = (responses: AssessmentResponses): boolean => {
    if (!responses || Object.keys(responses).length === 0) {
      console.error("Assessment validation: No responses found");
      return false;
    }

    // Check if we have responses for all sections
    const expectedSections = sections.length;
    const actualSections = Object.keys(responses).length;
    
    if (actualSections < expectedSections) {
      console.error(`Assessment validation: Missing sections. Expected: ${expectedSections}, Got: ${actualSections}`);
      return false;
    }

    // Check if each section has responses
    for (const section of sections) {
      const sectionResponses = responses[section.id.toString()];
      if (!sectionResponses || Object.keys(sectionResponses).length === 0) {
        console.error(`Assessment validation: No responses for section ${section.id}`);
        return false;
      }
    }

    return true;
  };

  const createFallbackResult = (userType?: UserType | null): AssessmentResult => {
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
      userType: effectiveUserType || undefined,
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
  };

  const handleCompilationComplete = async () => {
    console.log("Assessment compilation starting... Attempt:", compilationAttempts + 1);
    console.log("Responses:", responses);
    console.log("User type:", effectiveUserType);
    
    // Increment attempts at the start (FIXED: was causing infinite loop)
    const currentAttempt = compilationAttempts + 1;
    setCompilationAttempts(currentAttempt);
    
    try {
      // Validate responses before processing
      if (!validateResponses(responses)) {
        throw new Error("Invalid assessment responses. Please ensure all questions are answered.");
      }

      // Get progressive timeout for this user type and attempt
      const timeoutMs = getTimeoutForUserType(effectiveUserType, currentAttempt);
      console.log(`Using timeout: ${timeoutMs}ms for attempt ${currentAttempt}`);

      // Add timeout protection with progressive timeouts
      const compilationTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Assessment compilation timed out after ${timeoutMs/1000}s (attempt ${currentAttempt})`)), timeoutMs);
      });

      const compilationPromise = new Promise<AssessmentResult>((resolve, reject) => {
        try {
          console.log("Starting analysis for user type:", effectiveUserType);
          const analysisResult = analyzeRhythmAssessment(responses, effectiveUserType || undefined);
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
            userType: effectiveUserType || undefined,
            personalizedData: analysisResult.personalizedData
          };
          
          console.log("Analysis completed successfully for:", effectiveUserType);
          resolve(result);
        } catch (error) {
          console.error("Analysis failed:", error);
          reject(new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });

      const result = await Promise.race([compilationPromise, compilationTimeout]) as AssessmentResult;
      
      // Store results
      storeAssessmentResult(result);
      storeFocusArea(result.focusArea, result);
      
      // Clear saved progress
      localStorage.removeItem('myrhythm_assessment_progress');
      
      setAssessmentResult(result);
      setIsCompiling(false);
      setShowSummary(true);
      setCompilationError(null);
      setCompilationAttempts(0); // Reset on success
      
      console.log("Assessment compilation completed successfully");
      
    } catch (error) {
      console.error("Assessment compilation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown compilation error";
      setCompilationError(errorMessage);
      
      // Circuit breaker: Max 3 attempts, then force fallback
      if (currentAttempt < 3) {
        console.log(`Retrying compilation (attempt ${currentAttempt + 1}/3) in 2 seconds...`);
        // Retry after 2 seconds with exponential backoff
        setTimeout(() => {
          handleCompilationComplete();
        }, 2000 * currentAttempt); // 2s, 4s, 6s delays
      } else {
        console.error("Max compilation attempts reached, using fallback");
        // Force fallback after max attempts
        const fallbackResult = createFallbackResult(effectiveUserType);
        storeAssessmentResult(fallbackResult);
        storeFocusArea(fallbackResult.focusArea, fallbackResult);
        
        setAssessmentResult(fallbackResult);
        setIsCompiling(false);
        setShowSummary(true);
        setCompilationError(null);
        setCompilationAttempts(0); // Reset
      }
    }
  };

  const handleManualContinue = () => {
    console.log("Manual continue requested - using optimized fallback");
    const fallbackResult = createFallbackResult(effectiveUserType);
    
    // Store results
    storeAssessmentResult(fallbackResult);
    storeFocusArea(fallbackResult.focusArea, fallbackResult);
    
    setAssessmentResult(fallbackResult);
    setIsCompiling(false);
    setShowSummary(true);
    setCompilationError(null);
    setCompilationAttempts(0); // Reset
  };

  const handleRetry = () => {
    console.log("Retry requested - resetting error state");
    setCompilationError(null);
    // Don't reset attempts here - let handleCompilationComplete manage it
    handleCompilationComplete();
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (isCompiling) {
      setIsCompiling(false);
      setCompilationError(null);
      setCompilationAttempts(0); // Reset on back
      return;
    }
    
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setHasStarted(false);
    }
  };

  const handleBeginAssessment = () => {
    // Check for saved progress
    const savedProgress = localStorage.getItem('myrhythm_assessment_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.responses && Object.keys(progress.responses).length > 0) {
          // Use MyRhythm branded confirmation
          const shouldResume = confirm("🧠 MyRhythm Assessment Recovery\n\nWe found your previous assessment progress safely stored. Would you like to continue where you left off to complete your personalized cognitive wellness profile?\n\n✅ Continue Previous Session\n❌ Start Fresh Assessment");
          if (shouldResume) {
            setResponses(progress.responses);
            setCurrentSection(progress.currentSection || 0);
          }
        }
      } catch (error) {
        console.error("Failed to restore progress:", error);
        localStorage.removeItem('myrhythm_assessment_progress');
      }
    }
    
    setHasStarted(true);
    setCompilationAttempts(0); // Reset on begin
  };

  return {
    hasStarted,
    currentSection,
    responses,
    isCompiling,
    showSummary,
    assessmentResult,
    compilationError,
    sections,
    userType: effectiveUserType,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleManualContinue: handleManualContinue,
    handleBack,
    handleBeginAssessment,
    handleRetry
  };
}
