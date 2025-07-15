import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { UserType } from "@/types/user";

export function useOnboardingHandlers() {
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
          user_type: userType,
          first_name: firstName,
          last_name: lastName,
          age: age,
          location: location,
          updated_at: new Date()
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
      const { error } = await supabase
        .from('rhythm_assessments')
        .insert({
          user_id: userId,
          assessment_data: assessmentResult,
          created_at: new Date()
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
      // Save support circle data
      const { error: supportError } = await supabase
        .from('support_circles')
        .insert({
          user_id: userId,
          support_data: supportData,
          created_at: new Date()
        });

      if (supportError) {
        throw supportError;
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
      // Save planning data
      const { error: planningError } = await supabase
        .from('planning_preferences')
        .insert({
          user_id: userId,
          planning_data: planningData,
          created_at: new Date()
        });

      if (planningError) {
        throw planningError;
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
          onboarding_complete: true,
          updated_at: new Date()
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

  return {
    isLoading,
    handleProfileSubmit,
    handleAssessmentSubmit,
    handleSupportIntegrationSubmit,
    handlePlanningIntegrationSubmit,
    handleOnboardingComplete
  };
}
