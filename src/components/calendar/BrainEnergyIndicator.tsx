import React from "react";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, Brain } from "lucide-react";

export type BrainEnergyLevel = "high" | "medium" | "low";

interface BrainEnergyIndicatorProps {
  level: BrainEnergyLevel;
  onLevelChange: (level: BrainEnergyLevel) => void;
  className?: string;
}

export function BrainEnergyIndicator({ level, onLevelChange, className }: BrainEnergyIndicatorProps) {
  const getEnergyData = (energy: BrainEnergyLevel) => {
    switch (energy) {
      case "high":
        return {
          icon: <Zap className="h-4 w-4" />,
          label: "Peak Cognitive Performance",
          description: "Perfect time for complex planning and decision-making",
          className: "brain-energy-high text-memory-emerald-700 hover:bg-memory-emerald-200/50",
          bgClass: "bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500"
        };
      case "medium":
        return {
          icon: <Brain className="h-4 w-4" />,
          label: "Steady Mental Energy",
          description: "Good for routine planning and organization",
          className: "brain-energy-medium text-brain-health-700 hover:bg-brain-health-200/50",
          bgClass: "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500"
        };
      case "low":
        return {
          icon: <Battery className="h-4 w-4" />,
          label: "Gentle Cognitive Mode",
          description: "Best for simple tasks and self-care planning",
          className: "brain-energy-low text-clarity-teal-700 hover:bg-clarity-teal-200/50",
          bgClass: "bg-gradient-to-r from-clarity-teal-500 to-brain-health-500"
        };
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-brain-health-700 mb-3">
        Your Current Brain Energy
      </div>
      
      <div className="flex gap-2">
        {(["high", "medium", "low"] as BrainEnergyLevel[]).map((energyLevel) => {
          const data = getEnergyData(energyLevel);
          const isActive = level === energyLevel;
          
          return (
            <button
              key={energyLevel}
              onClick={() => onLevelChange(energyLevel)}
              className={`
                flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105
                ${isActive 
                  ? `${data.className} border-current shadow-md` 
                  : 'border-gray-200 hover:border-gray-300 bg-white/50'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all
                ${isActive ? data.bgClass + " text-white shadow-lg animate-neural-pulse" : "bg-gray-100 text-gray-500"}
              `}>
                {data.icon}
              </div>
              
              <div className="text-xs font-medium text-center">
                {data.label}
              </div>
              
              {isActive && (
                <div className="text-xs text-center mt-1 opacity-80 max-w-[120px]">
                  {data.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Cognitive Flow Animation Background */}
      <div className="h-1 rounded-full animate-cognitive-flow opacity-60 mt-4" />
    </div>
  );
}