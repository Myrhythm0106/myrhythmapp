
import React, { useState } from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BackButtonWarning } from "@/components/navigation/BackButtonWarning";
import { InteractiveProgressBar } from "./InteractiveProgressBar";
import { NavigationControls } from "./NavigationControls";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onStepClick: (stepNumber: number) => void;
  title: string;
  description: string;
  hasUnsavedData?: boolean;
  onSaveProgress?: () => void;
  dataDescription?: string;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  isLoading?: boolean;
}

export const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps, 
  onBack,
  onStepClick,
  title,
  description,
  hasUnsavedData = false,
  onSaveProgress,
  dataDescription = "your progress",
  canGoNext = true,
  canGoPrevious = true,
  onNext,
  nextLabel,
  isLoading = false
}: OnboardingLayoutProps) => {
  console.log("OnboardingLayout: Rendering with step", currentStep, "of", totalSteps);
  
  const [showBackWarning, setShowBackWarning] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header with Brain Logo */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
              <p className="text-sm text-muted-foreground">Setup & Personalization</p>
            </div>
          </div>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Interactive Progress Bar - More Prominent */}
        <InteractiveProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
        />
        
        {/* Main Content Card */}
        <Card className="border-2 border-border/50 shadow-xl bg-background/95 backdrop-blur-sm">
          <div className="p-8">
            {/* Step Content - Removed redundant header since it's in progress bar */}
            <div className="min-h-[400px]">
              {children}
            </div>

            {/* Navigation Controls - Always show when onNext is provided */}
            {onNext && (
              <NavigationControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                onNext={onNext}
                onPrevious={handleBackClick}
                nextLabel={nextLabel}
                isLoading={isLoading}
              />
            )}
          </div>
        </Card>

        {/* Confidence Building Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>✨ You're in complete control of your brain health journey</p>
          <p>Your progress is automatically saved • Navigate freely between completed steps</p>
        </div>
      </div>

      {/* Back button warning dialog */}
      <BackButtonWarning
        open={showBackWarning}
        onClose={() => setShowBackWarning(false)}
        onConfirm={handleConfirmBack}
        onSaveAndContinue={onSaveProgress ? handleSaveAndBack : undefined}
        destination="Dashboard"
        hasUnsavedData={hasUnsavedData}
        dataDescription={dataDescription}
      />
    </div>
  );
};
