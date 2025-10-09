import React, { useState } from 'react';
import { EnhancedQuickStartAssessment } from '@/components/onboarding/steps/rhythm/EnhancedQuickStartAssessment';
import { AssessmentPaymentGate } from '@/components/onboarding/steps/rhythm/AssessmentPaymentGate';
import { UserType } from '@/types/user';
import { BasicAssessmentResult } from '@/types/assessmentTypes';

interface Step3AssessmentPlanPackagesProps {
  persona: string;
  intents: string[];
  onComplete: (assessmentResult: BasicAssessmentResult, selectedPackage: 'starter' | 'plus' | 'pro', paymentChoice: 'premium' | 'free') => void;
  variant?: 'default' | 'mvp';
}

export function Step3AssessmentPlanPackages({ persona, intents, onComplete, variant = 'default' }: Step3AssessmentPlanPackagesProps) {
  const [assessmentResult, setAssessmentResult] = useState<BasicAssessmentResult | null>(null);
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<'premium' | 'free' | null>(null);

  // Map persona to UserType
  const getUserType = (): UserType => {
    if (persona === 'loved-one') return 'caregiver';
    if (persona === 'professional') return 'medical-professional';
    return 'brain-injury'; // Default for 'me'
  };

  const handleAssessmentComplete = (result: BasicAssessmentResult) => {
    setAssessmentResult(result);
    setShowPaymentGate(true);
  };

  const handlePaymentSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip') => {
    if (!assessmentResult) return;
    
    if (option === 'skip') {
      setPaymentChoice('free');
      onComplete(assessmentResult, 'starter', 'free');
    } else {
      // For now, treat all paid options as premium with starter package
      // In future, map to different packages
      setPaymentChoice('premium');
      onComplete(assessmentResult, 'starter', 'premium');
    }
  };

  const handleContinueWithFree = () => {
    if (!assessmentResult) return;
    setPaymentChoice('free');
    onComplete(assessmentResult, 'starter', 'free');
  };

  // Show assessment first
  if (!assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <EnhancedQuickStartAssessment 
          userType={getUserType()}
          onComplete={handleAssessmentComplete}
        />
      </div>
    );
  }

  // Show payment gate after assessment
  if (showPaymentGate) {
    return (
      <AssessmentPaymentGate
        assessmentResult={assessmentResult}
        onPaymentSelect={handlePaymentSelect}
        onContinueWithFree={handleContinueWithFree}
        userType={getUserType()}
        daysLeft={7} // Default trial period
      />
    );
  }

  return null;
}
