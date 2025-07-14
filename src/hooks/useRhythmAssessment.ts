
import { useState, useEffect } from "react";
import { getSectionsForUserType } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { UseRhythmAssessmentReturn } from "./rhythm-assessment/types";
import { ProgressManager } from "./rhythm-assessment/progressManager";
import { CompilationManager } from "./rhythm-assessment/compilationManager";
import { ResponseManager } from "./rhythm-assessment/responseManager";

export function useRhythmAssessment(userType?: UserType | null): UseRhythmAssessmentReturn {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<any>({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const [isRestoringFromSave, setIsRestoringFromSave] = useState(false);

  const effectiveUserType = userType || (localStorage.getItem("myrhythm_user_type") as UserType | null);
  const sections = getSectionsForUserType(effectiveUserType || undefined);

  console.log("useRhythmAssessment: userType:", effectiveUserType);
  console.log("useRhythmAssessment: sections loaded:", sections.length);

  // Force re-render and validation after state restoration
  useEffect(() => {
    if (isRestoringFromSave && Object.keys(responses).length > 0) {
      console.log("useRhythmAssessment: State restoration complete, forcing validation update");
      console.log("useRhythmAssessment: Restored responses:", responses);
      console.log("useRhythmAssessment: Current section after restore:", currentSection);
      
      setTimeout(() => {
        setIsRestoringFromSave(false);
        console.log("useRhythmAssessment: Restoration flag cleared, validation should now work");
      }, 100);
    }
  }, [responses, currentSection, isRestoringFromSave]);

  const handleResponse = (questionId: string, value: any) => {
    ResponseManager.handleResponse(
      questionId,
      value,
      responses,
      currentSection,
      sections,
      effectiveUserType,
      setResponses
    );
  };

  const handleNext = () => {
    console.log("useRhythmAssessment: handleNext called, currentSection:", currentSection, "totalSections:", sections.length);
    
    if (currentSection < sections.length - 1) {
      const nextSection = currentSection + 1;
      console.log("useRhythmAssessment: Moving to section", nextSection);
      setCurrentSection(nextSection);
    } else {
      console.log("useRhythmAssessment: Assessment complete, starting compilation");
      setIsCompiling(true);
      setCompilationError(null);
      setCompilationAttempts(0);
    }
  };

  const handleCompilationComplete = async () => {
    console.log("Assessment compilation starting... Attempt:", compilationAttempts + 1);
    
    const currentAttempt = compilationAttempts + 1;
    setCompilationAttempts(currentAttempt);
    
    try {
      const result = await CompilationManager.compileAssessment(
        responses,
        sections,
        effectiveUserType,
        currentAttempt
      );
      
      CompilationManager.storeResults(result);
      ProgressManager.clearProgress();
      
      setAssessmentResult(result);
      setIsCompiling(false);
      setShowSummary(true);
      setCompilationError(null);
      setCompilationAttempts(0);
      
      console.log("Assessment compilation completed successfully");
      
    } catch (error) {
      console.error("Assessment compilation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown compilation error";
      setCompilationError(errorMessage);
      
      if (currentAttempt < 3) {
        console.log(`Retrying compilation (attempt ${currentAttempt + 1}/3) in 2 seconds...`);
        setTimeout(() => {
          handleCompilationComplete();
        }, 2000 * currentAttempt);
      } else {
        console.error("Max compilation attempts reached, using fallback");
        const fallbackResult = CompilationManager.createFallbackResult(effectiveUserType);
        CompilationManager.storeResults(fallbackResult);
        
        setAssessmentResult(fallbackResult);
        setIsCompiling(false);
        setShowSummary(true);
        setCompilationError(null);
        setCompilationAttempts(0);
      }
    }
  };

  const handleManualContinue = () => {
    console.log("Manual continue requested - using optimized fallback");
    const fallbackResult = CompilationManager.createFallbackResult(effectiveUserType);
    
    CompilationManager.storeResults(fallbackResult);
    
    setAssessmentResult(fallbackResult);
    setIsCompiling(false);
    setShowSummary(true);
    setCompilationError(null);
    setCompilationAttempts(0);
  };

  const handleRetry = () => {
    console.log("Retry requested - resetting error state");
    setCompilationError(null);
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
      setCompilationAttempts(0);
      return;
    }
    
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setHasStarted(false);
    }
  };

  const handleBeginAssessment = () => {
    const savedProgress = ProgressManager.loadProgress();
    
    if (savedProgress && Object.keys(savedProgress.responses).length > 0) {
      const shouldResume = confirm("🧠 MyRhythm Assessment Recovery\n\nWe found your previous assessment progress safely stored. Would you like to continue where you left off to complete your personalized cognitive wellness profile?\n\n✅ Continue Previous Session\n❌ Start Fresh Assessment");
      
      if (shouldResume) {
        console.log("useRhythmAssessment: User chose to resume, restoring state...");
        setIsRestoringFromSave(true);
        setResponses(savedProgress.responses);
        setCurrentSection(savedProgress.currentSection || 0);
        console.log("useRhythmAssessment: State restoration initiated");
      } else {
        console.log("useRhythmAssessment: User chose fresh start, clearing saved data");
        ProgressManager.clearProgress();
      }
    }
    
    setHasStarted(true);
    setCompilationAttempts(0);
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
    isRestoringFromSave,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleManualContinue,
    handleBack,
    handleBeginAssessment,
    handleRetry
  };
}
