
import React, { useState } from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BackButtonWarning } from "@/components/navigation/BackButtonWarning";
import { MiniProgressIndicator } from "@/components/navigation/MiniProgressIndicator";
import { ProgressMap } from "@/components/navigation/ProgressMap";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  title: string;
  description: string;
  hasUnsavedData?: boolean;
  onSaveProgress?: () => void;
  dataDescription?: string;
}

// Define the onboarding steps for progress tracking
const getOnboardingSteps = (totalSteps: number, currentStepNumber: number) => [
  {
    id: '1',
    title: 'User Type',
    description: 'Tell us about yourself',
    status: 'completed' as const,
    estimatedTime: '1 min'
  },
  {
    id: '2', 
    title: 'Personal Info',
    description: 'Basic account information',
    status: 'completed' as const,
    estimatedTime: '2 min'
  },
  {
    id: '3',
    title: 'Location',
    description: 'Where are you located?',
    status: 'current' as const,
    estimatedTime: '1 min'
  },
  {
    id: '4',
    title: 'Plan Selection',
    description: 'Choose your MyRhythm plan',
    status: 'upcoming' as const,
    estimatedTime: '2 min'
  },
  {
    id: '5',
    title: 'Payment Setup',
    description: 'Start your free trial',
    status: 'upcoming' as const,
    estimatedTime: '3 min'
  },
  {
    id: '6',
    title: 'Pre-Assessment',
    description: 'Preparing your assessment',
    status: 'upcoming' as const,
    estimatedTime: '1 min'
  },
  {
    id: '7',
    title: 'Rhythm Assessment',
    description: 'Discover your unique patterns',
    status: 'upcoming' as const,
    estimatedTime: '10 min'
  }
].slice(0, totalSteps).map((step, index) => ({
  ...step,
  id: String(index + 1),
  status: index + 1 < currentStepNumber ? 'completed' as const : 
          index + 1 === currentStepNumber ? 'current' as const : 'upcoming' as const
}));

export const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps, 
  onBack,
  title,
  description,
  hasUnsavedData = false,
  onSaveProgress,
  dataDescription = "your progress"
}: OnboardingLayoutProps) => {
  console.log("OnboardingLayout: Rendering with step", currentStep, "of", totalSteps);
  
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [showProgressMap, setShowProgressMap] = useState(false);

  const steps = getOnboardingSteps(totalSteps, currentStep);
  const completedSteps = steps.filter(step => step.status === 'completed').length;

  const handleBackClick = () => {
    if (hasUnsavedData) {
      setShowBackWarning(true);
    } else {
      onBack();
    }
  };

  const handleConfirmBack = () => {
    setShowBackWarning(false);
    onBack();
  };

  const handleSaveAndBack = () => {
    if (onSaveProgress) {
      onSaveProgress();
    }
    setShowBackWarning(false);
    onBack();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
          
          {/* Simple space for balance instead of search */}
          <div className="w-10"></div>
        </div>

        {/* Mini progress indicator */}
        <div className="flex justify-center mb-4">
          <MiniProgressIndicator
            currentStep={title}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            onToggleMap={() => setShowProgressMap(true)}
          />
        </div>
        
        <Card className="border-2 overflow-hidden">
          {/* Progress bar */}
          <div className="relative h-1 bg-muted">
            <div 
              className="absolute h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
              </div>
              <div className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            
            {children}
          </div>
        </Card>
      </div>

      {/* Back button warning dialog */}
      <BackButtonWarning
        open={showBackWarning}
        onClose={() => setShowBackWarning(false)}
        onConfirm={handleConfirmBack}
        onSaveAndContinue={onSaveProgress ? handleSaveAndBack : undefined}
        destination="Previous step"
        hasUnsavedData={hasUnsavedData}
        dataDescription={dataDescription}
      />

      {/* Progress map */}
      <ProgressMap
        steps={steps}
        currentStepId={String(currentStep)}
        isOpen={showProgressMap}
        onClose={() => setShowProgressMap(false)}
        showEstimatedTime={true}
      />
    </div>
  );
};
