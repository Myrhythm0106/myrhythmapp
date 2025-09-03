import React from 'react';
import { useNavigate } from 'react-router-dom';
import { YourJourneyAwaits } from '@/components/onboarding/YourJourneyAwaits';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { toast } from 'sonner';

export function YourJourneyAwaitsPage() {
  const navigate = useNavigate();
  
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
    toast.success("Starting your guided journey! Let's begin with your assessment.");
    // Navigate to guided assessment
    navigate('/onboarding/assessment?type=guided');
  };

  const handleExploreDashboard = () => {
    toast.success("Welcome to your full MyRhythm dashboard!");
    // Navigate to full dashboard
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
              selectedPackage={selectedPackage}
              onBeginJourney={handleBeginJourney}
              onExploreDashboard={handleExploreDashboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}