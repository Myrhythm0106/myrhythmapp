import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: string;
  step_data: any;
  assessment_id?: string;
  created_at: string;
  updated_at: string;
}

export function useOnboardingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save or update onboarding progress
  const saveProgress = async (
    currentStep: string,
    stepData: Record<string, any>,
    assessmentId?: string
  ): Promise<OnboardingProgress | null> => {
    if (!user) {
      console.log('No user logged in, cannot save progress');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const progressData = {
        user_id: user.id,
        current_step: currentStep,
        step_data: stepData,
        assessment_id: assessmentId
      };

      // Use upsert to either insert or update
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .upsert(progressData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error saving onboarding progress:', error);
        setError(error.message);
        return null;
      }

      setProgress(data);
      return data;
    } catch (error: any) {
      console.error('Exception saving onboarding progress:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load onboarding progress
  const loadProgress = async (): Promise<OnboardingProgress | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading onboarding progress:', error);
        setError(error.message);
        return null;
      }

      setProgress(data || null);
      return data || null;
    } catch (error: any) {
      console.error('Exception loading onboarding progress:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update specific step data
  const updateStepData = async (
    stepKey: string,
    stepValue: any
  ): Promise<OnboardingProgress | null> => {
    if (!progress) {
      // If no progress exists, create new progress
      return saveProgress('assessment', { [stepKey]: stepValue });
    }

    const updatedStepData = {
      ...progress.step_data,
      [stepKey]: stepValue
    };

    return saveProgress(progress.current_step, updatedStepData, progress.assessment_id);
  };

  // Advance to next step
  const advanceToStep = async (
    nextStep: string,
    stepData?: Record<string, any>
  ): Promise<OnboardingProgress | null> => {
    const newStepData = stepData || progress?.step_data || {};
    return saveProgress(nextStep, newStepData, progress?.assessment_id);
  };

  // Clear progress (for new user flow)
  const clearProgress = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_onboarding_progress')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing onboarding progress:', error);
        setError(error.message);
        return false;
      }

      setProgress(null);
      return true;
    } catch (error: any) {
      console.error('Exception clearing onboarding progress:', error);
      setError(error.message);
      return false;
    }
  };

  // Check if user can resume onboarding
  const canResumeOnboarding = (): boolean => {
    return progress !== null && progress.current_step !== 'completed';
  };

  // Get current step
  const getCurrentStep = (): string => {
    return progress?.current_step || 'assessment';
  };

  // Get step data
  const getStepData = (key?: string): any => {
    if (!progress?.step_data) return null;
    if (key) return progress.step_data[key];
    return progress.step_data;
  };

  // Load progress on user change
  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setProgress(null);
    }
  }, [user]);

  return {
    progress,
    isLoading,
    error,
    saveProgress,
    loadProgress,
    updateStepData,
    advanceToStep,
    clearProgress,
    canResumeOnboarding,
    getCurrentStep,
    getStepData
  };
}