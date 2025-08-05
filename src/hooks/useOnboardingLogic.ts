
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

interface PersonalInfoFormValues {
  name: string;
  email: string;
  password: string;
}

export function useOnboardingLogic(totalSteps: number = 7) {
  const navigate = useNavigate();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    step: 1,
    userType: null,
    assessmentResult: null,
    supportData: null,
    dashboardLayout: null,
  });

  // Additional state for the complex onboarding flow
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormValues | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>('premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [assessmentType, setAssessmentType] = useState<'brief' | 'comprehensive' | null>(null);
  const [isUserTypeSelected, setIsUserTypeSelected] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(true); // Location is optional
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [isDirectNavigation, setIsDirectNavigation] = useState(false);

  const nextStep = () => {
    setOnboardingState(prevState => ({
      ...prevState,
      step: Math.min(prevState.step + 1, totalSteps),
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
    setIsUserTypeSelected(true);
    nextStep();
  };

  const setAssessmentResult = (assessmentResult: any) => {
    setOnboardingState(prevState => ({
      ...prevState,
      assessmentResult,
    }));
    // Don't auto-advance to next step here, let the parent handle it
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

    // Support data is optional for now

    setDashboardLayout(dashboardLayout);

    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        // Save onboarding data to Supabase using profiles table
        const { error } = await supabase
          .from('profiles')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('id', user.data.user.id);

        if (error) {
          throw new Error(error.message);
        }

        // Save additional data as notes
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

      // Redirect to the dashboard
      navigate('/dashboard');
      toast.success('Onboarding complete! Redirecting to your dashboard.');

    } catch (err: any) {
      console.error('Onboarding failed:', err);
      toast.error('Onboarding failed. Please try again.');
    }
  };

  const setPlanSelection = (plan: any, billing?: 'monthly' | 'annual') => {
    setSelectedPlan(plan);
    if (billing) setBillingPeriod(billing);
    setIsPlanSelected(true);
  };

  return {
    onboardingState,
    currentStep: onboardingState.step,
    userType: onboardingState.userType,
    assessmentResult: onboardingState.assessmentResult,
    location,
    personalInfo,
    selectedPlan,
    billingPeriod,
    assessmentType,
    isUserTypeSelected,
    isPersonalInfoValid,
    isLocationValid,
    isPlanSelected,
    isDirectNavigation,
    setPersonalInfo,
    setAssessmentType,
    setIsUserTypeSelected,
    setIsLocationValid,
    setIsPlanSelected,
    setPlanSelection,
    nextStep,
    prevStep,
    setUserType,
    setAssessmentResult,
    setSupportData,
    completeOnboarding,
  };
}
