
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

  // Get sections based on provided userType or fallback to localStorage
  const effectiveUserType = userType || (localStorage.getItem("myrhythm_user_type") as UserType | null);
  const sections = getSectionsForUserType(effectiveUserType || undefined);

  console.log("useRhythmAssessment: userType:", effectiveUserType);
  console.log("useRhythmAssessment: sections loaded:", sections.length);

  const handleResponse = (questionId: string, value: any) => {
    const sectionId = sections[currentSection].id.toString();
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: typeof value === 'string' ? parseInt(value, 10) : value
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setIsCompiling(true);
    }
  };

  const handleCompilationComplete = () => {
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
    
    storeAssessmentResult(result);
    storeFocusArea(analysisResult.focusArea, result);
    
    setAssessmentResult(result);
    setIsCompiling(false);
    setShowSummary(true);
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (isCompiling) {
      return;
    }
    
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setHasStarted(false);
    }
  };

  const handleBeginAssessment = () => {
    setHasStarted(true);
  };

  return {
    hasStarted,
    currentSection,
    responses,
    isCompiling,
    showSummary,
    assessmentResult,
    sections,
    userType: effectiveUserType,
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleBack,
    handleBeginAssessment
  };
}
