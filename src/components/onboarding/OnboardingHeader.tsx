
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OnboardingHeaderProps {
  step: number;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ step }) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>
            {step === 1 && "Complete your profile"}
            {step === 2 && "Select your plan"}
            {step === 3 && "Complete your payment"}
            {step === 4 && "Personalised Support to O.R.D.E.R your life daily"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Just a few more details to personalize your experience"}
            {step === 2 && "Choose a plan that works for you"}
            {step === 3 && "Secure payment information"}
            {step === 4 && "Select the option that best describes your situation"}
          </CardDescription>
        </div>
        <div className="text-sm font-medium">
          Step {step} of 4
        </div>
      </div>
    </CardHeader>
  );
};
