
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PersonalInfoForm, { PersonalInfoFormValues } from "@/components/onboarding/PersonalInfoForm";
import PaymentInfoForm from "@/components/onboarding/PaymentInfoForm";
import PlanSelection from "@/components/onboarding/PlanSelection";
import { UserTypeSelector, UserType } from "@/components/onboarding/UserTypeSelector";

interface OnboardingStepsProps {
  step: number;
  personalInfo: PersonalInfoFormValues | null;
  selectedPlan: string;
  userType: UserType | null;
  customTypeValue: string;
  onPersonalInfoSubmit: (values: PersonalInfoFormValues) => void;
  onPlanSelect: (plan: string) => void;
  onPlanContinue: () => void;
  onPaymentSubmit: (values: any) => void;
  onUserTypeChange: (type: UserType) => void;
  onCustomTypeChange: (value: string) => void;
  onFinish: () => void;
  onBack: () => void;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  step,
  personalInfo,
  selectedPlan,
  userType,
  customTypeValue,
  onPersonalInfoSubmit,
  onPlanSelect,
  onPlanContinue,
  onPaymentSubmit,
  onUserTypeChange,
  onCustomTypeChange,
  onFinish,
  onBack
}) => {
  // Handler to ensure form submission is properly passed
  const handlePersonalInfoSubmit = (values: PersonalInfoFormValues) => {
    console.log("OnboardingSteps received form submission:", values);
    onPersonalInfoSubmit(values);
  };

  return (
    <CardContent>
      {step === 1 ? (
        <PersonalInfoForm 
          onSubmit={handlePersonalInfoSubmit}
          onBack={onBack}
          initialValues={personalInfo || undefined}
        />
      ) : step === 2 ? (
        <PlanSelection
          selectedPlan={selectedPlan}
          onSelectPlan={onPlanSelect}
          onContinue={onPlanContinue}
        />
      ) : step === 3 ? (
        <PaymentInfoForm 
          onSubmit={onPaymentSubmit}
          onBack={() => onBack()}
          selectedPlan={selectedPlan}
        />
      ) : (
        <div className="space-y-6">
          <UserTypeSelector 
            selectedType={userType} 
            onChange={onUserTypeChange} 
            customType={customTypeValue}
            onCustomTypeChange={onCustomTypeChange}
          />
          <div className="flex justify-end">
            <Button 
              onClick={onFinish} 
              className="gap-2"
              disabled={!userType || (userType === "custom" && !customTypeValue.trim())}
            >
              Finish <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  );
};
