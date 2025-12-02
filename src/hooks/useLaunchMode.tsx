import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AssessmentResults {
  userType: 'recovery' | 'goal-achiever' | 'caregiver' | null;
  rhythmPreference: 'morning' | 'afternoon' | 'evening' | null;
  keyStruggles: string[];
  goals: string[];
  hasSupport: boolean;
}

interface LaunchModeState {
  isLaunchMode: boolean;
  assessmentCompleted: boolean;
  assessmentResults: AssessmentResults;
  lastViewedWhatsNew: string | null;
  purchasedFeatures: string[];
}

interface LaunchModeContextType extends LaunchModeState {
  setAssessmentResults: (results: Partial<AssessmentResults>) => void;
  completeAssessment: () => void;
  isRecoveryUser: boolean;
  isGoalAchiever: boolean;
  markWhatsNewViewed: (version: string) => void;
  addPurchasedFeature: (featureId: string) => void;
  hasFeature: (featureId: string) => boolean;
}

const LaunchModeContext = createContext<LaunchModeContextType | undefined>(undefined);

const defaultAssessment: AssessmentResults = {
  userType: null,
  rhythmPreference: null,
  keyStruggles: [],
  goals: [],
  hasSupport: false,
};

export function LaunchModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LaunchModeState>(() => {
    const saved = localStorage.getItem('myrhythm_launch_mode');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      isLaunchMode: true,
      assessmentCompleted: false,
      assessmentResults: defaultAssessment,
      lastViewedWhatsNew: null,
      purchasedFeatures: [],
    };
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('myrhythm_launch_mode', JSON.stringify(state));
  }, [state]);

  const setAssessmentResults = (results: Partial<AssessmentResults>) => {
    setState(prev => ({
      ...prev,
      assessmentResults: { ...prev.assessmentResults, ...results },
    }));
  };

  const completeAssessment = () => {
    setState(prev => ({ ...prev, assessmentCompleted: true }));
  };

  const markWhatsNewViewed = (version: string) => {
    setState(prev => ({ ...prev, lastViewedWhatsNew: version }));
  };

  const addPurchasedFeature = (featureId: string) => {
    setState(prev => ({
      ...prev,
      purchasedFeatures: [...prev.purchasedFeatures, featureId],
    }));
  };

  const hasFeature = (featureId: string) => {
    return state.purchasedFeatures.includes(featureId);
  };

  const value: LaunchModeContextType = {
    ...state,
    setAssessmentResults,
    completeAssessment,
    isRecoveryUser: state.assessmentResults.userType === 'recovery',
    isGoalAchiever: state.assessmentResults.userType === 'goal-achiever',
    markWhatsNewViewed,
    addPurchasedFeature,
    hasFeature,
  };

  return (
    <LaunchModeContext.Provider value={value}>
      {children}
    </LaunchModeContext.Provider>
  );
}

export function useLaunchMode() {
  const context = useContext(LaunchModeContext);
  if (context === undefined) {
    throw new Error('useLaunchMode must be used within a LaunchModeProvider');
  }
  return context;
}

// Helper to get days remaining in year
export function getDaysRemainingInYear(): number {
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const diffTime = endOfYear.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
