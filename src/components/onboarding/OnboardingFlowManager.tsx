import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RegistrationForm } from './RegistrationForm';
import { Step1WelcomeSeeMe } from './warm/Step1WelcomeSeeMe';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type OnboardingStep = 
  | 'authentication'
  | 'user-profile'
  | 'plan-selection'
  | 'assessment'
  | 'complete';

interface OnboardingFlowManagerProps {
  initialStep?: OnboardingStep;
}

export const OnboardingFlowManager = ({ initialStep = 'authentication' }: OnboardingFlowManagerProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [userData, setUserData] = useState<any>({});
  const { user, signUp, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, skip authentication step
    if (user && currentStep === 'authentication') {
      const onboardingComplete = localStorage.getItem('myrhythm_onboarding_complete');
      if (onboardingComplete === 'true') {
        navigate('/memory-bridge');
      } else {
        setCurrentStep('user-profile');
      }
    }
  }, [user, currentStep, navigate]);

  const handleRegistrationComplete = async (data: { name: string; email: string; password: string }) => {
    console.log('OnboardingFlowManager: Registration data received', { email: data.email, name: data.name });
    
    try {
      const { error } = await signUp(data.email, data.password, data.name);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message || 'Failed to create account');
        }
        return;
      }

      // Store user data for later use
      setUserData({
        name: data.name,
        email: data.email
      });

      // Track progress in localStorage
      localStorage.setItem('onboarding_step', 'user-profile');
      localStorage.setItem('onboarding_user_data', JSON.stringify({ name: data.name, email: data.email }));

      toast.success('Account created successfully!');
      setCurrentStep('user-profile');
    } catch (error) {
      console.error('OnboardingFlowManager: Registration error', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleUserProfileComplete = (profileData: any) => {
    console.log('OnboardingFlowManager: User profile complete', profileData);
    
    // Merge profile data with existing user data
    const combinedData = {
      ...userData,
      ...profileData
    };
    setUserData(combinedData);

    // Store in localStorage for persistence
    localStorage.setItem('onboarding_step', 'plan-selection');
    localStorage.setItem('onboarding_user_data', JSON.stringify(combinedData));

    // Navigate to plan selection
    navigate('/subscribe');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neural-purple-50 to-neural-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-neural-purple-600" />
          <p className="text-neural-indigo-700">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 via-brain-health-50/40 to-clarity-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {currentStep === 'authentication' && !user && (
          <RegistrationForm onComplete={handleRegistrationComplete} />
        )}

        {currentStep === 'user-profile' && user && (
          <Step1WelcomeSeeMe onComplete={handleUserProfileComplete} variant="mvp" />
        )}
      </div>
    </div>
  );
};
