
import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PlanHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Plan</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-blue-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">You can change your plan anytime after signing up. All plans include core recovery features.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Select the subscription that best supports your recovery journey
      </p>
    </div>
  );
}
