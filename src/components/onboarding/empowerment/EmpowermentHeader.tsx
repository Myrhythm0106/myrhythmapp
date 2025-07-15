
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface EmpowermentHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function EmpowermentHeader({ currentStep, totalSteps }: EmpowermentHeaderProps) {
  return (
    <div className="text-center space-y-4 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-teal-50/30 p-4 rounded-lg border-l border-emerald-300/20">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg border border-emerald-300/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-3 bg-slate-200" />
    </div>
  );
}
