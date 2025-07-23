import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Brain, Zap, Clock } from "lucide-react";

interface FocusModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  className?: string;
}

export function FocusMode({ isActive, onToggle, className }: FocusModeProps) {
  const [focusLevel, setFocusLevel] = useState<"gentle" | "moderate" | "deep">("moderate");
  const [focusTimer, setFocusTimer] = useState<number>(25); // Pomodoro default

  const focusLevels = {
    gentle: {
      icon: <Eye className="h-4 w-4" />,
      label: "Gentle Focus",
      description: "Minimal distractions, soft colors",
      timerSuggestion: 15,
      className: "brain-energy-low"
    },
    moderate: {
      icon: <Brain className="h-4 w-4" />,
      label: "Balanced Focus",
      description: "Reduced complexity, clear priorities",
      timerSuggestion: 25,
      className: "brain-energy-medium"
    },
    deep: {
      icon: <EyeOff className="h-4 w-4" />,
      label: "Deep Focus",
      description: "Maximum simplicity, essential only",
      timerSuggestion: 45,
      className: "brain-energy-high"
    }
  };

  const handleFocusToggle = (checked: boolean) => {
    onToggle(checked);
    if (checked) {
      // Apply focus mode styles to document
      document.documentElement.classList.add('focus-mode');
      document.documentElement.style.setProperty('--focus-level', focusLevel);
    } else {
      document.documentElement.classList.remove('focus-mode');
      document.documentElement.style.removeProperty('--focus-level');
    }
  };

  const startFocusSession = () => {
    setFocusTimer(focusLevels[focusLevel].timerSuggestion);
    handleFocusToggle(true);
    
    // Optional: Start timer logic here
    console.log(`Starting ${focusLevel} focus session for ${focusLevels[focusLevel].timerSuggestion} minutes`);
  };

  return (
    <Card className={`calendar-command-center ${className}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brain-health-400 to-clarity-teal-400 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-brain-health-700">Cognitive Ease Mode</h3>
                <p className="text-xs text-brain-health-600">Reduce cognitive load for better planning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={handleFocusToggle}
              />
              <Badge variant={isActive ? "default" : "outline"} className="text-xs">
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Focus Level Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-brain-health-700">Choose Your Focus Level</h4>
            
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(focusLevels).map(([level, data]) => (
                <button
                  key={level}
                  onClick={() => setFocusLevel(level as typeof focusLevel)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 text-left
                    ${focusLevel === level 
                      ? `${data.className} border-current shadow-md` 
                      : 'border-gray-200 hover:border-gray-300 bg-white/50'
                    }
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${focusLevel === level 
                      ? "bg-gradient-to-br from-brain-health-400 to-clarity-teal-400 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-500"
                    }
                  `}>
                    {data.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium">{data.label}</div>
                    <div className="text-xs opacity-80">{data.description}</div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Clock className="h-3 w-3" />
                    {data.timerSuggestion}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Session Control */}
          <div className="space-y-3 pt-2 border-t border-brain-health-200/50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-brain-health-700">
                Focus Session Timer
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-clarity-teal-600" />
                <span className="text-sm font-medium">{focusTimer} min</span>
              </div>
            </div>
            
            {!isActive ? (
              <Button 
                onClick={startFocusSession}
                className="w-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white font-medium"
              >
                Start {focusLevels[focusLevel].label} Session
              </Button>
            ) : (
              <div className="text-center p-3 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-lg border border-memory-emerald-200">
                <div className="text-sm font-medium text-memory-emerald-700 mb-1">
                  🧘‍♀️ Focus Mode Active
                </div>
                <p className="text-xs text-memory-emerald-600">
                  Your interface is optimized for cognitive ease
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleFocusToggle(false)}
                  className="mt-2"
                >
                  Exit Focus Mode
                </Button>
              </div>
            )}
          </div>

          {/* Focus Mode Benefits */}
          {isActive && (
            <div className="text-center p-3 bg-gradient-to-br from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg border border-brain-health-200/50">
              <p className="text-xs text-brain-health-600">
                ✨ Reduced visual complexity • Enhanced clarity • Better focus
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}