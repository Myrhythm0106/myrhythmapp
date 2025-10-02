import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlanStep } from '@/components/onboarding/steps/PlanStep';

export default function PlanSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;

  const handlePlanComplete = (planData: any) => {
    // Store plan selection
    localStorage.setItem('selected_plan', JSON.stringify(planData));
    
    // Navigate to welcome congrats page
    navigate('/mvp/welcome-congrats');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Choose Your Cognitive Empowerment Plan
          </h1>
          <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
            {userData?.fullName && `Welcome ${userData.fullName.split(' ')[0]}! `}
            Start your journey with a 7-day free trial. No charges until your trial ends.
          </p>
        </div>

        <PlanStep 
          onComplete={handlePlanComplete}
          selectedPlan={null}
        />
      </div>
    </div>
  );
}
