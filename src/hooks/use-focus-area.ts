
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
import { UserType } from "@/types/user";

export function useFocusArea() {
  const [currentFocusArea, setCurrentFocusArea] = useState<FocusArea | null>(null);
  const [focusAreaInfo, setFocusAreaInfo] = useState<FocusAreaInfo | null>(null);
  const [evolutionHistory, setEvolutionHistory] = useState<FocusAreaInfo | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    // Get user type from storage or default
    const storedUserData = localStorage.getItem('myrhythm_user_data');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    const userType = userData?.type as UserType;
    
    const focusArea = getCurrentFocusArea(userType);
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      const focusConfig = focusAreas[focusArea];
      const evolution = getFocusAreaEvolution(focusArea);
      setEvolutionHistory(evolution);
    }
    
    setCurrentAssessment(getCurrentAssessmentResult());
    setAssessmentHistory(getAssessmentHistory());
  }, []);

  const refreshFocusArea = () => {
    const storedUserData = localStorage.getItem('myrhythm_user_data');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    const userType = userData?.type as UserType;
    
    const focusArea = getCurrentFocusArea(userType);
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      const focusConfig = focusAreas[focusArea];
      const evolution = getFocusAreaEvolution(focusArea);
      setEvolutionHistory(evolution);
    }
    
    setCurrentAssessment(getCurrentAssessmentResult());
    setAssessmentHistory(getAssessmentHistory());
  };

  return {
    currentFocusArea,
    focusAreaInfo: evolutionHistory,
    evolutionHistory,
    currentAssessment,
    assessmentHistory,
    refreshFocusArea,
    hasFocusArea: currentFocusArea !== null,
    hasAssessmentHistory: assessmentHistory.length > 0
  };
}
