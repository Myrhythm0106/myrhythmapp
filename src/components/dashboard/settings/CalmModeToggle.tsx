import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, Sparkles } from "lucide-react";
import { useCalmMode } from "@/contexts/CalmModeContext";

export function CalmModeToggle() {
  const { isCalmMode, toggleCalmMode } = useCalmMode();

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg border border-brain-health-200/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white">
          {isCalmMode ? <Brain className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </div>
        <div>
          <Label htmlFor="calm-mode" className="text-sm font-medium text-brain-health-700">
            Calm Mode
          </Label>
          <p className="text-xs text-brain-health-600">
            {isCalmMode ? "Gentle, minimal design" : "Rich, colorful experience"}
          </p>
        </div>
      </div>
      
      <Switch
        id="calm-mode"
        checked={isCalmMode}
        onCheckedChange={toggleCalmMode}
        className="data-[state=checked]:bg-brain-health-500"
      />
    </div>
  );
}