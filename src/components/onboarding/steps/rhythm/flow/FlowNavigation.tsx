
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FlowNavigationProps {
  currentStep: string;
  onResultsNext: () => void;
  hasPaidPremium?: boolean;
}

export function FlowNavigation({ currentStep, onResultsNext, hasPaidPremium }: FlowNavigationProps) {
  if (currentStep === "results" && !hasPaidPremium) {
    return (
      <div className="flex justify-center pt-6">
        <Button onClick={onResultsNext} size="lg">
          Continue Your Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
}
