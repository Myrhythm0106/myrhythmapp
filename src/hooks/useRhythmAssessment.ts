
import { useState } from "react";
import { getCurrentSections, AssessmentResponses } from "@/components/onboarding/steps/rhythm/rhythmAssessmentData";
import { 
  analyzeRhythmAssessment, 
  storeFocusArea,
  storeAssessmentResult,
  AssessmentResult
} from "@/utils/rhythmAnalysis";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

export function useRhythmAssessment() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const sections = getCurrentSections();

  const handleResponse = (questionId: string, value: string) => {
    const sectionId = sections[currentSection].id.toString();
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: parseInt(value, 10)
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
    const userType = localStorage.getItem("myrhythm_user_type") as UserType | null;
    
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
    handleResponse,
    handleNext,
    handleCompilationComplete,
    handleBack,
    handleBeginAssessment
  };
}
