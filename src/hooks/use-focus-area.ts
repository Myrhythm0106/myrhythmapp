
import { useState, useEffect } from "react";
import { getCurrentFocusArea, focusAreas, FocusArea, FocusAreaInfo, getFocusAreaEvolution } from "@/utils/rhythmAnalysis";

export function useFocusArea() {
  const [currentFocusArea, setCurrentFocusArea] = useState<FocusArea | null>(null);
  const [focusAreaInfo, setFocusAreaInfo] = useState<FocusAreaInfo | null>(null);
  const [evolutionHistory, setEvolutionHistory] = useState<any[]>([]);

  useEffect(() => {
    const focusArea = getCurrentFocusArea();
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      setFocusAreaInfo(focusAreas[focusArea]);
    }
    
    setEvolutionHistory(getFocusAreaEvolution());
  }, []);

  const refreshFocusArea = () => {
    const focusArea = getCurrentFocusArea();
    setCurrentFocusArea(focusArea);
    
    if (focusArea) {
      setFocusAreaInfo(focusAreas[focusArea]);
    }
    
    setEvolutionHistory(getFocusAreaEvolution());
  };

  return {
    currentFocusArea,
    focusAreaInfo,
    evolutionHistory,
    refreshFocusArea,
    hasFocusArea: currentFocusArea !== null
  };
}
