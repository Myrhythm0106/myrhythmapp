
import React from "react";
import { Brain, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  title: string;
  description: string;
}

export const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps, 
  onBack,
  title,
  description
}: OnboardingLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-beacon-600" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
          
          <div className="w-[76px]"></div> {/* Empty div for balance */}
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
    </div>
  );
};
