import React, { useState } from 'react';
import { MVPPaymentFlow } from './MVPPaymentFlow';
import { MVPPrivacyConsent } from './MVPPrivacyConsent';
import { MVPAssessmentFlow } from './MVPAssessmentFlow';
import { FourCoreFeaturesTour } from './FourCoreFeaturesTour';

export type MVPFlowStep = 'payment' | 'privacy' | 'assessment' | 'features';

interface MVPMainFlowProps {
  initialStep?: MVPFlowStep;
}

export function MVPMainFlow({ initialStep = 'payment' }: MVPMainFlowProps) {
  const [currentStep, setCurrentStep] = useState<MVPFlowStep>(initialStep);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  const handlePaymentComplete = () => {
    // Payment completed, trial started
    localStorage.setItem('mvp_trial_started', 'true');
    localStorage.setItem('mvp_trial_start_date', new Date().toISOString());
    setCurrentStep('privacy');
  };

  const handlePrivacyComplete = () => {
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
      case 'assessment':
        setCurrentStep('privacy');
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
    
    case 'assessment':
      return (
        <MVPAssessmentFlow 
          onComplete={handleAssessmentComplete}
          onBack={handleBack}
        />
      );
    
    case 'features':
      return (
        <FourCoreFeaturesTour 
          onFeatureSelect={handleFeatureSelect}
          assessmentResult={assessmentResult}
        />
      );
    
    default:
      return (
        <MVPPaymentFlow 
          onPaymentComplete={handlePaymentComplete}
        />
      );
  }
}