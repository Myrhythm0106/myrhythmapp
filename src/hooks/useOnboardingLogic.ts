
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from "@/types/user";

interface OnboardingState {
  step: number;
  userType: UserType | null;
  assessmentResult: any | null;
  supportData: any | null;
  dashboardLayout: 'brain-health' | 'empowerment' | null;
}

export function useOnboardingLogic() {
  const navigate = useNavigate();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    step: 1,
    userType: null,
    assessmentResult: null,
    supportData: null,
    dashboardLayout: null,
  });

  const nextStep = () => {
    setOnboardingState(prevState => ({
      ...prevState,
      step: prevState.step + 1,
    }));
  };

  const prevStep = () => {
    setOnboardingState(prevState => ({
      ...prevState,
      step: Math.max(1, prevState.step - 1),
    }));
  };

  const setUserType = (userType: UserType) => {
    setOnboardingState(prevState => ({
      ...prevState,
      userType,
    }));
    nextStep();
  };

  const setAssessmentResult = (assessmentResult: any) => {
    setOnboardingState(prevState => ({
      ...prevState,
      assessmentResult,
    }));
    nextStep();
  };

  const setSupportData = (supportData: any) => {
    setOnboardingState(prevState => ({
      ...prevState,
      supportData,
    }));
    nextStep();
  };

  const setDashboardLayout = (dashboardLayout: 'brain-health' | 'empowerment') => {
    setOnboardingState(prevState => ({
      ...prevState,
      dashboardLayout,
    }));
  };

  const completeOnboarding = async (dashboardLayout: 'brain-health' | 'empowerment') => {
    if (!onboardingState.userType) {
      toast.error('User type must be selected.');
      return;
    }

    if (!onboardingState.assessmentResult) {
      toast.error('Assessment must be completed.');
      return;
    }

    if (!onboardingState.supportData) {
      toast.error('Support information must be provided.');
      return;
    }

    setDashboardLayout(dashboardLayout);

    try {
      // Save onboarding data to Supabase using profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', supabase.auth.getUser().then(u => u.data.user?.id));

      if (error) {
        throw new Error(error.message);
      }

      // Save additional data as notes
      if (supabase.auth.getUser()) {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          await supabase.from('notes').insert([
            {
              user_id: user.data.user.id,
              title: 'Onboarding Data',
              content: JSON.stringify({
                userType: onboardingState.userType,
                assessmentResult: onboardingState.assessmentResult,
                supportData: onboardingState.supportData,
                dashboardLayout
              })
            }
          ]);
        }
      }

      // Redirect to the dashboard
      navigate('/dashboard');
      toast.success('Onboarding complete! Redirecting to your dashboard.');

    } catch (err: any) {
      console.error('Onboarding failed:', err);
      toast.error('Onboarding failed. Please try again.');
    }
  };

  return {
    onboardingState,
    nextStep,
    prevStep,
    setUserType,
    setAssessmentResult,
    setSupportData,
    completeOnboarding,
  };
}
