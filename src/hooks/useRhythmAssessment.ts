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

  const handleCompilationComplete = async () => {
    console.log("Assessment compilation starting...");
    console.log("Responses:", responses);
    console.log("User type:", effectiveUserType);
    
    try {
      setCompilationAttempts(prev => prev + 1);
      
      // Validate responses before processing
      if (!validateResponses(responses)) {
        throw new Error("Invalid assessment responses. Please ensure all questions are answered.");
      }

      // Add timeout protection
      const compilationTimeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Assessment compilation timed out")), 10000);
      });

      const compilationPromise = new Promise<AssessmentResult>((resolve) => {
        try {
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
          
          resolve(result);
        } catch (error) {
          throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      
      console.log("Assessment compilation completed successfully");
      
    } catch (error) {
      console.error("Assessment compilation failed:", error);
      setCompilationError(error instanceof Error ? error.message : "Unknown compilation error");
      
      // Allow retry up to 3 times
      if (compilationAttempts < 3) {
        console.log(`Retrying compilation (attempt ${compilationAttempts + 1}/3)`);
        setTimeout(() => handleCompilationComplete(), 2000);
      } else {
        setIsCompiling(false);
        console.error("Max compilation attempts reached");
      }
    }
  };

  const handleManualContinue = () => {
    // Fallback when auto-compilation fails
    const fallbackResult: AssessmentResult = {
      id: `assessment-fallback-${Date.now()}`,
      completedAt: new Date().toISOString(),
      focusArea: "memory",
      sectionScores: [],
      overallScore: 50,
      determinationReason: "Assessment completed with fallback analysis",
      version: "1.0-fallback",
      nextReviewDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userType: effectiveUserType || undefined,
      personalizedData: {
        insights: [],
        personalProfile: {
          uniqueCharacteristics: [],
          strengthAreas: [],
          growthOpportunities: [],
          personalizedMessage: "Your assessment has been processed with standard recommendations.",
          nextSteps: ["Begin with memory activities that feel natural and comfortable"],
          rhythmSignature: "Memory-Focused Standard Rhythm"
        },
        customDeterminationReason: "Basic assessment analysis provided",
        userTypeSpecificMessage: "Your assessment has been processed with standard recommendations.",
        uniqueScoreStory: "Your cognitive wellness journey is unique and valuable."
      }
    };
    
    setAssessmentResult(fallbackResult);
    setIsCompiling(false);
    setShowSummary(true);
    setCompilationError(null);
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (isCompiling) {
      setIsCompiling(false);
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
          const shouldResume = confirm("We found saved progress from a previous session. Would you like to resume where you left off?");
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
    handleManualContinue,
    handleBack,
    handleBeginAssessment
  };
}
