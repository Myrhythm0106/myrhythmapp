
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FlowNavigationProps {
  currentStep: string;
  onResultsNext: () => void;
  hasPaidPremium?: boolean;
}

export function FlowNavigation({ currentStep, onResultsNext, hasPaidPremium = false }: FlowNavigationProps) {
  // Premium users have different navigation
  if (hasPaidPremium) {
    return null; // Navigation is handled within the FullAssessmentResults component
  }

  // Show navigation for basic users
  if (currentStep === "results") {
    return (
      <div className="flex justify-center pt-6">
        <Button 
          onClick={onResultsNext}
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
        >
          Continue Your Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
}
