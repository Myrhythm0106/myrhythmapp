import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AssessmentPartialResults } from '@/components/onboarding/AssessmentPartialResults';
import { PlanSelectionPaywall } from '@/components/onboarding/PlanSelectionPaywall';

interface CheckInData {
  energy: number;
  stress: number;
  focus: number;
  memoryConfidence: number;
  sleepQuality: number;
}

interface Step3CheckinPlanPackagesProps {
  persona: string;
  intents: string[];
  onComplete: (checkIn: CheckInData, selectedPackage: 'starter' | 'plus' | 'pro') => void;
  variant?: 'default' | 'mvp';
}

export function Step3CheckinPlanPackages({ persona, intents, onComplete, variant = 'default' }: Step3CheckinPlanPackagesProps) {
  const [checkIn, setCheckIn] = useState<CheckInData>({
    energy: 5,
    stress: 5,
    focus: 5,
    memoryConfidence: 5,
    sleepQuality: 5
  });
  
  const [showResults, setShowResults] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<'premium' | 'free' | null>(null);

  const checkInItems = [
    { key: 'energy' as keyof CheckInData, label: 'Energy level', lowLabel: 'Exhausted', highLabel: 'Energized' },
    { key: 'stress' as keyof CheckInData, label: 'Stress level', lowLabel: 'Overwhelmed', highLabel: 'Calm' },
    { key: 'focus' as keyof CheckInData, label: 'Focus ability', lowLabel: 'Scattered', highLabel: 'Sharp' },
    { key: 'memoryConfidence' as keyof CheckInData, label: 'Memory confidence', lowLabel: 'Worried', highLabel: 'Confident' },
    { key: 'sleepQuality' as keyof CheckInData, label: 'Sleep quality', lowLabel: 'Poor', highLabel: 'Excellent' }
  ];

  const handleSliderChange = (key: keyof CheckInData, value: number[]) => {
    setCheckIn(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSubmitCheckIn = () => {
    setShowResults(true);
  };

  // Show check-in form
  if (!showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-display-md font-bold text-brain-health-900">
            60-Second Check-In
          </h1>
          <p className="text-body-lg text-brain-health-700 max-w-2xl mx-auto">
            Help us understand how you're feeling right now. This quick check-in will help us personalize your experience.
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-8 space-y-8">
            {checkInItems.map((item) => (
              <div key={item.key} className="space-y-3">
                <label className="text-body-lg font-semibold text-brain-health-900">
                  {item.label}
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[checkIn[item.key]]}
                    onValueChange={(value) => handleSliderChange(item.key, value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-caption text-brain-health-600">
                    <span>{item.lowLabel}</span>
                    <span className="font-medium text-brain-health-900">{checkIn[item.key]}/10</span>
                    <span>{item.highLabel}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmitCheckIn}
                size="lg"
                variant="premium"
              >
                See My Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show partial results first
  if (!showPaywall) {
    return (
      <AssessmentPartialResults 
        checkIn={checkIn}
        onUnlock={() => setShowPaywall(true)}
        onFreeTrial={() => {
          setPaymentChoice('free');
          onComplete(checkIn, 'starter');
        }}
      />
    );
  }

  // Then show paywall with plan selection
  return (
    <PlanSelectionPaywall 
      checkIn={checkIn}
      onComplete={(pkg) => {
        setPaymentChoice('premium');
        onComplete(checkIn, pkg);
      }}
      onBack={() => setShowPaywall(false)}
    />
  );
}