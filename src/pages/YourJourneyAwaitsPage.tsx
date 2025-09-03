import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YourJourneyAwaits } from '@/components/onboarding/YourJourneyAwaits';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { useSetupProgress } from '@/contexts/SetupProgressContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';

export function YourJourneyAwaitsPage() {
  const navigate = useNavigate();
  const { setCompleted, setCurrentStep } = useSetupProgress();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Mark payment and welcome steps as completed
    setCompleted('payment');
    setCompleted('plan');
    setCurrentStep('welcome');
    
    // Track journey awaits page view
    trackEvent({
      eventType: 'journey_awaits_viewed',
      eventData: {
        timestamp: new Date().toISOString(),
        paymentComplete: localStorage.getItem('payment_success') === 'true'
      }
    });
  }, [setCompleted, setCurrentStep, trackEvent]);
  
  // Mock data - in real app this would come from context/props
  const selectedPackage = 'plus'; // This would come from payment context
  
  const progressSteps = [
    { id: 1, title: "Plan Selection", description: "Choose your MyRhythm plan", completed: true, current: false },
    { id: 2, title: "Payment", description: "Secure payment processing", completed: true, current: false },
    { id: 3, title: "Welcome", description: "Choose your journey style", completed: false, current: true, estimated_time: "1 min" },
    { id: 4, title: "Assessment", description: "Complete your cognitive profile", completed: false, current: false, estimated_time: "2-10 min" },
    { id: 5, title: "Dashboard Setup", description: "Personalize your experience", completed: false, current: false, estimated_time: "2 min" },
  ];

  const handleBeginJourney = () => {
    // Track guided journey selection
    trackEvent({
      eventType: 'journey_mode_selected',
      eventData: { mode: 'guided' }
    });
    
    toast.success("Starting your personalized assessment - we'll guide you through every step!");
    
    // Set next progress step and navigate
    setCurrentStep('assessment');
    navigate('/mvp/assessment-flow?type=guided&flow=post-payment');
  };

  const handleExploreDashboard = () => {
    // Track explorer mode selection
    trackEvent({
      eventType: 'journey_mode_selected', 
      eventData: { mode: 'explorer' }
    });
    
    toast.success("Welcome to your MyRhythm dashboard!");
    
    // Mark onboarding as complete for explorer path
    setCompleted('assessment');
    setCompleted('setup');
    setCompleted('ready');
    localStorage.setItem('myrhythm_onboarding_complete', 'true');
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-memory-emerald-50 to-clarity-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <OnboardingProgress 
              currentStep={3}
              totalSteps={5}
              steps={progressSteps}
              showTimeEstimate={true}
              className="sticky top-8"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <YourJourneyAwaits 
              onBeginJourney={handleBeginJourney}
              onExploreDashboard={handleExploreDashboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}