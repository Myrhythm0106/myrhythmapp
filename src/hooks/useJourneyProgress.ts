import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface JourneyProgress {
  completedSteps: string[];
  currentStep: string;
  chosenPath: 'guided' | 'explorer' | null;
  celebratedMilestones: string[];
  startedAt: string | null;
}

const JOURNEY_STEPS = ['launch', 'discover', 'path', 'profile', 'foundation', 'voice', 'victory'];

const DEFAULT_PROGRESS: JourneyProgress = {
  completedSteps: [],
  currentStep: 'launch',
  chosenPath: null,
  celebratedMilestones: [],
  startedAt: null
};

export function useJourneyProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<JourneyProgress>(() => {
    const saved = localStorage.getItem('journey_progress');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('journey_progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading journey progress:', error);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('journey_progress', JSON.stringify(progress));
  }, [progress]);

  // Sync to database when user is authenticated
  useEffect(() => {
    if (user?.id && progress.completedSteps.length > 0) {
      const syncToDatabase = async () => {
        try {
          await supabase
            .from('profiles')
            .update({
              onboarding_data: progress as any,
              onboarding_step: progress.currentStep
            })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error syncing journey progress:', error);
        }
      };
      syncToDatabase();
    }
  }, [progress, user?.id]);

  const markStepComplete = useCallback((stepId: string) => {
    setProgress(prev => {
      const newCompletedSteps = [...new Set([...prev.completedSteps, stepId])];
      const currentIndex = JOURNEY_STEPS.indexOf(stepId);
      const nextStep = JOURNEY_STEPS[currentIndex + 1] || 'victory';
      
      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: newCompletedSteps.includes(nextStep) ? prev.currentStep : nextStep,
        startedAt: prev.startedAt || new Date().toISOString()
      };
    });
  }, []);

  const markMilestoneCelebrated = useCallback((stepId: string) => {
    setProgress(prev => ({
      ...prev,
      celebratedMilestones: [...new Set([...prev.celebratedMilestones, stepId])]
    }));
  }, []);

  const setChosenPath = useCallback((path: 'guided' | 'explorer') => {
    setProgress(prev => ({
      ...prev,
      chosenPath: path
    }));
  }, []);

  const getCurrentStepIndex = useCallback(() => {
    return JOURNEY_STEPS.indexOf(progress.currentStep);
  }, [progress.currentStep]);

  const getCompletionPercentage = useCallback(() => {
    return Math.round((progress.completedSteps.length / JOURNEY_STEPS.length) * 100);
  }, [progress.completedSteps]);

  const isStepCompleted = useCallback((stepId: string) => {
    return progress.completedSteps.includes(stepId);
  }, [progress.completedSteps]);

  const isStepCurrent = useCallback((stepId: string) => {
    return progress.currentStep === stepId;
  }, [progress.currentStep]);

  const shouldCelebrate = useCallback((stepId: string) => {
    return progress.completedSteps.includes(stepId) && 
           !progress.celebratedMilestones.includes(stepId);
  }, [progress.completedSteps, progress.celebratedMilestones]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem('journey_progress');
  }, []);

  return {
    progress,
    isLoading,
    markStepComplete,
    markMilestoneCelebrated,
    setChosenPath,
    getCurrentStepIndex,
    getCompletionPercentage,
    isStepCompleted,
    isStepCurrent,
    shouldCelebrate,
    resetProgress,
    journeySteps: JOURNEY_STEPS
  };
}
