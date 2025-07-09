
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface EmpowermentHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function EmpowermentHeader({ currentStep, totalSteps }: EmpowermentHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-semibold text-slate-700">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-3 bg-slate-200" />
    </div>
  );
}
