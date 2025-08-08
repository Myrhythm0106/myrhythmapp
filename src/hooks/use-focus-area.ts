
import { useState, useEffect } from "react";
import { 
  getCurrentFocusArea, 
  focusAreas, 
  FocusArea, 
  FocusAreaInfo, 
  getFocusAreaEvolution,
  getCurrentAssessmentResult,
  getAssessmentHistory,
  AssessmentResult
} from "@/utils/rhythmAnalysis";

export function useFocusArea() {
  const [currentFocusArea, setCurrentFocusArea] = useState<FocusArea | null>(null);
  const [focusAreaInfo, setFocusAreaInfo] = useState<FocusAreaInfo | null>(null);
  const [evolutionHistory, setEvolutionHistory] = useState<any[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    const focusArea = getCurrentFocusArea();
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      setFocusAreaInfo(focusAreas[focusArea]);
    }
    
    setEvolutionHistory(getFocusAreaEvolution());
    setCurrentAssessment(getCurrentAssessmentResult());
    setAssessmentHistory(getAssessmentHistory());
  }, []);

  const refreshFocusArea = () => {
    const focusArea = getCurrentFocusArea();
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      setFocusAreaInfo(focusAreas[focusArea]);
    }
    
    setEvolutionHistory(getFocusAreaEvolution());
    setCurrentAssessment(getCurrentAssessmentResult());
    setAssessmentHistory(getAssessmentHistory());
  };

  return {
    currentFocusArea,
    focusAreaInfo,
    evolutionHistory,
    currentAssessment,
    assessmentHistory,
    refreshFocusArea,
    hasFocusArea: currentFocusArea !== null,
    hasAssessmentHistory: assessmentHistory.length > 0
  };
}
