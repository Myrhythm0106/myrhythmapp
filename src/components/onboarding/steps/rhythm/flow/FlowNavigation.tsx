
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FlowNavigationProps {
  currentStep: string;
  onResultsNext: () => void;
}

export function FlowNavigation({ currentStep, onResultsNext }: FlowNavigationProps) {
  if (currentStep !== "results") return null;

  return (
    <div className="flex justify-center pt-6 border-t">
      <Button onClick={onResultsNext} className="bg-gradient-to-r from-primary to-primary/80">
        Continue to Next Steps
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
