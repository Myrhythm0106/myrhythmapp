import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MVPPaymentFlow } from './MVPPaymentFlow';
import { MVPPrivacyConsent } from './MVPPrivacyConsent';
import { AppStoryIntroduction } from './AppStoryIntroduction';
import { PathSelectionFlow } from './PathSelectionFlow';
import { AssessmentPreview } from './AssessmentPreview';
import { MVPAssessmentFlow } from './MVPAssessmentFlow';
import { FourCoreFeaturesTour } from './FourCoreFeaturesTour';

export type MVPFlowStep = 'payment' | 'privacy' | 'app-story' | 'path-selection' | 'assessment-preview' | 'assessment' | 'features';

interface MVPMainFlowProps {
  initialStep?: MVPFlowStep;
}

export function MVPMainFlow({ initialStep = 'payment' }: MVPMainFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<MVPFlowStep>(initialStep);
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const handlePaymentComplete = () => {
    // Payment completed, trial started
    localStorage.setItem('mvp_trial_started', 'true');
    localStorage.setItem('mvp_trial_start_date', new Date().toISOString());
    setCurrentStep('privacy');
  };

  const handlePrivacyComplete = () => {
    setCurrentStep('app-story');
  };

  const handleAppStoryComplete = () => {
    setCurrentStep('path-selection');
  };

  const handlePathSelected = (path: 'guided' | 'explorer') => {
    setSelectedPath(path);
    if (path === 'guided') {
      setCurrentStep('assessment-preview');
    } else {
      // For explorer mode, show assessment preview with skip option
      setCurrentStep('assessment-preview');
    }
  };

  const handleAssessmentPreviewComplete = () => {
    setCurrentStep('assessment');
  };

  const handleAssessmentComplete = (result: any) => {
    setAssessmentResult(result);
    setCurrentStep('features');
  };

  const handleFeatureSelect = (featureId: string) => {
    // Store the user's first selected feature
    localStorage.setItem('mvp_first_feature', featureId);
    // Could navigate to that feature or continue to dashboard
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'privacy':
        setCurrentStep('payment');
        break;
      case 'app-story':
        setCurrentStep('privacy');
        break;
      case 'path-selection':
        setCurrentStep('app-story');
        break;
      case 'assessment-preview':
        setCurrentStep('path-selection');
        break;
      case 'assessment':
        setCurrentStep('assessment-preview');
        break;
      case 'features':
        setCurrentStep('assessment');
        break;
      default:
        break;
    }
  };

  switch (currentStep) {
    case 'payment':
      return (
        <MVPPaymentFlow 
          onPaymentComplete={handlePaymentComplete}
        />
      );
    
    case 'privacy':
      return (
        <MVPPrivacyConsent 
          onConsentComplete={handlePrivacyComplete}
          onBack={handleBack}
        />
      );

    case 'app-story':
      return (
        <AppStoryIntroduction 
          onComplete={handleAppStoryComplete}
          onBack={handleBack}
        />
      );

    case 'path-selection':
      return (
        <PathSelectionFlow 
          onPathSelected={handlePathSelected}
          onBack={handleBack}
        />
      );

    case 'assessment-preview':
      return (
        <AssessmentPreview 
          onStartAssessment={handleAssessmentPreviewComplete}
          onBack={handleBack}
          selectedPath={selectedPath || 'guided'}
        />
      );
    
    case 'assessment':
      return (
        <MVPAssessmentFlow 
          onComplete={handleAssessmentComplete}
          onBack={handleBack}
        />
      );
    
    case 'features':
      return (
        <div className="space-y-4">
          <FourCoreFeaturesTour 
            onFeatureSelect={handleFeatureSelect}
            assessmentResult={assessmentResult}
          />
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/guided-journey')}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              Continue to Guided Setup
            </Button>
          </div>
        </div>
      );
    
    default:
      return (
        <MVPPaymentFlow 
          onPaymentComplete={handlePaymentComplete}
        />
      );
  }
}