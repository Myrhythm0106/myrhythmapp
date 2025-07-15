
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserType } from "@/types/user";

interface UseOnboardingHandlersProps {
  currentStep: number;
  totalSteps: number;
  userType: UserType | null;
  selectedPlan: any;
  setIsUserTypeSelected: (selected: boolean) => void;
  setIsLocationValid: (valid: boolean) => void;
  setIsPlanSelected: (selected: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  setUserType: (userType: UserType) => void;
  completeOnboarding: (dashboardLayout: 'brain-health' | 'empowerment') => Promise<void>;
}

export function useOnboardingHandlers(props: UseOnboardingHandlersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileSubmit = async (
    userId: string,
    userType: UserType,
    firstName: string,
    lastName: string,
    age: number,
    location: string
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: `${firstName} ${lastName}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssessmentSubmit = async (
    userId: string,
    assessmentResult: any
  ) => {
    setIsLoading(true);
    try {
      // Store assessment data in notes table as a workaround
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          title: 'Rhythm Assessment Results',
          content: JSON.stringify(assessmentResult)
        });

      if (error) {
        throw error;
      }

      toast.success('Assessment saved successfully!');
      return true;
    } catch (error: any) {
      console.error('Error saving assessment:', error);
      toast.error(`Failed to save assessment: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportIntegrationSubmit = async (
    userId: string,
    supportData: any
  ) => {
    setIsLoading(true);
    try {
      // Store support data in notes table as a workaround
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          title: 'Support Integration Data',
          content: JSON.stringify(supportData)
        });

      if (error) {
        throw error;
      }

      toast.success('Support integration saved successfully!');
      return true;
    } catch (error: any) {
      console.error('Error saving support integration:', error);
      toast.error(`Failed to save support integration: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanningIntegrationSubmit = async (
    userId: string,
    planningData: any
  ) => {
    setIsLoading(true);
    try {
      // Store planning data in notes table as a workaround
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          title: 'Planning Integration Data',
          content: JSON.stringify(planningData)
        });

      if (error) {
        throw error;
      }

      toast.success('Planning integration saved successfully!');
      return true;
    } catch (error: any) {
      console.error('Error saving planning integration:', error);
      toast.error(`Failed to save planning integration: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async (userId: string) => {
    setIsLoading(true);
    try {
      // Mark onboarding as complete
      const { error: onboardingError } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (onboardingError) {
        throw onboardingError;
      }

      toast.success('Onboarding complete!');
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error(`Failed to complete onboarding: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (props.currentStep < props.totalSteps) {
      props.nextStep();
    }
  };

  const goToPreviousStep = () => {
    if (props.currentStep > 1) {
      props.prevStep();
    }
  };

  const goToStep = (stepNumber: number) => {
    // Simple implementation - could be enhanced with validation
    const diff = stepNumber - props.currentStep;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        props.nextStep();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        props.prevStep();
      }
    }
  };

  // Step completion handlers
  const handleUserTypeComplete = (data: { type: UserType }) => {
    props.setUserType(data.type);
    props.setIsUserTypeSelected(true);
  };

  const handlePersonalInfoComplete = (data: any) => {
    // Handle personal info completion
    props.nextStep();
  };

  const handleLocationComplete = (data: any) => {
    props.setIsLocationValid(true);
    props.nextStep();
  };

  const handlePlanSelected = (plan: any, billingPeriod?: 'monthly' | 'annual') => {
    props.setIsPlanSelected(true);
    props.nextStep();
  };

  const handlePreAssessmentComplete = () => {
    props.nextStep();
  };

  const handleRhythmAssessmentComplete = () => {
    props.completeOnboarding('brain-health');
  };

  // Step validation
  const getStepValidation = () => {
    const canGoNext = 
      (props.currentStep === 1 && props.userType !== null) ||
      (props.currentStep === 2) || // Location is optional
      (props.currentStep === 3 && props.selectedPlan) ||
      (props.currentStep === 4) ||
      (props.currentStep === 5);
    
    const canGoPrevious = props.currentStep > 1;

    return { canGoNext, canGoPrevious };
  };

  return {
    isLoading,
    handleProfileSubmit,
    handleAssessmentSubmit,
    handleSupportIntegrationSubmit,
    handlePlanningIntegrationSubmit,
    handleOnboardingComplete,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePreAssessmentComplete,
    handleRhythmAssessmentComplete,
    getStepValidation,
  };
}
