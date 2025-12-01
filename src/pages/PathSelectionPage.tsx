import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathSelectionFlow } from '@/components/mvp/PathSelectionFlow';
import { EmpoweringJourneyProgress } from '@/components/onboarding/EmpoweringJourneyProgress';
import { useJourneyProgress } from '@/hooks/useJourneyProgress';

export default function PathSelectionPage() {
  const navigate = useNavigate();
  const { markStepComplete, setChosenPath } = useJourneyProgress();

  // Mark launch and discover steps as complete when reaching this page
  useEffect(() => {
    markStepComplete('launch');
    markStepComplete('discover');
  }, [markStepComplete]);

  const handlePathSelected = (path: 'guided' | 'explorer') => {
    // Mark path step as complete and store chosen path
    markStepComplete('path');
    setChosenPath(path);
    
    if (path === 'guided') {
      // For guided path, take assessment first then go to guided journey
      navigate('/mvp/assessment-flow?path=guided&next=guided-journey');
    } else {
      // For explorer path, go directly to explorer dashboard
      navigate('/explorer');
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 via-white to-neural-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Journey Progress */}
        <EmpoweringJourneyProgress variant="compact" className="mb-6" />
        
        {/* Path Selection */}
        <PathSelectionFlow 
          onPathSelected={handlePathSelected}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}