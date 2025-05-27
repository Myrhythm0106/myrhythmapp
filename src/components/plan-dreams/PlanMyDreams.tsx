
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { ReviewStep } from "./steps/ReviewStep";

export interface DreamPlan {
  bigDream: string;
  smallerParts: string[];
  dailyDos: {
    smallerPartIndex: number;
    action: string;
    measurement: string;
    timing: string;
  }[];
}

interface PlanMyDreamsProps {
  onClose?: () => void;
  onSave?: (dreamPlan: DreamPlan) => void;
}

export function PlanMyDreams({ onClose, onSave }: PlanMyDreamsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dreamPlan, setDreamPlan] = useState<DreamPlan>({
    bigDream: "",
    smallerParts: [],
    dailyDos: []
  });

  const handleStepOneComplete = (bigDream: string) => {
    setDreamPlan(prev => ({ ...prev, bigDream }));
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (smallerParts: string[]) => {
    setDreamPlan(prev => ({ ...prev, smallerParts }));
    setCurrentStep(3);
  };

  const handleStepThreeComplete = (dailyDos: DreamPlan['dailyDos']) => {
    setDreamPlan(prev => ({ ...prev, dailyDos }));
    setCurrentStep(4);
  };

  const handleSaveDreamPlan = () => {
    if (onSave) {
      onSave(dreamPlan);
    }
    
    toast.success("Your Dream Plan is ready! 🎉", {
      description: "You're amazing for taking this step!",
      duration: 4000
    });
    
    if (onClose) {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "What's My Goal?";
      case 2: return "Step by Step Actions";
      case 3: return "Plan Your Daily Do";
      case 4: return "Review My Dream Plan";
      default: return "Plan My Dreams";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              {currentStep > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6" />
                  {getStepTitle()}
                </CardTitle>
                <p className="text-white/90 mt-1">Step {currentStep} of 4</p>
              </div>
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {currentStep === 1 && (
              <StepOne onComplete={handleStepOneComplete} initialValue={dreamPlan.bigDream} />
            )}
            
            {currentStep === 2 && (
              <StepTwo 
                bigDream={dreamPlan.bigDream}
                onComplete={handleStepTwoComplete}
                initialParts={dreamPlan.smallerParts}
              />
            )}
            
            {currentStep === 3 && (
              <StepThree
                bigDream={dreamPlan.bigDream}
                smallerParts={dreamPlan.smallerParts}
                onComplete={handleStepThreeComplete}
                initialDailyDos={dreamPlan.dailyDos}
              />
            )}
            
            {currentStep === 4 && (
              <ReviewStep
                dreamPlan={dreamPlan}
                onSave={handleSaveDreamPlan}
                onEdit={(step) => setCurrentStep(step)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
