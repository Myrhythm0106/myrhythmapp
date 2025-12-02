import React, { useState, useEffect } from 'react';
import { Brain, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const brainTips = [
  { tip: "Take a 2-min break every 25 minutes", detail: "Short breaks help consolidate memories and prevent mental fatigue." },
  { tip: "Write it down to remember it better", detail: "The act of writing engages multiple brain regions, strengthening memory." },
  { tip: "Sleep helps cement new memories", detail: "During sleep, your brain processes and stores the day's experiences." },
  { tip: "Exercise boosts brain plasticity", detail: "Physical activity increases blood flow and promotes new neural connections." },
  { tip: "Routine reduces cognitive load", detail: "Consistent patterns free up mental energy for important decisions." },
  { tip: "Celebrate small wins daily", detail: "Recognition releases dopamine, reinforcing positive behaviors." },
  { tip: "Connect tasks to existing habits", detail: "Linking new actions to established routines improves follow-through." },
  { tip: "Morning light improves focus", detail: "Natural light helps regulate your circadian rhythm and alertness." },
];

export function CompactBrainTip() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isExpanded) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentTip((prev) => (prev + 1) % brainTips.length);
          setIsVisible(true);
        }, 200);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isExpanded]);

  const tip = brainTips[currentTip];

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 rounded-2xl px-4 py-3 cursor-pointer",
        "border border-brain-health-200/50 transition-all duration-300",
        "hover:shadow-sm",
        isExpanded && "py-4"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brain-health-100 flex items-center justify-center flex-shrink-0">
          <Brain className="h-4 w-4 text-brain-health-600" />
        </div>
        
        <p className={cn(
          "text-sm text-brain-health-700 font-medium flex-1 transition-opacity duration-200",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          {tip.tip}
        </p>
        
        <ChevronRight className={cn(
          "h-4 w-4 text-brain-health-400 transition-transform duration-200",
          isExpanded && "rotate-90"
        )} />
      </div>
      
      {isExpanded && (
        <p className="text-xs text-brain-health-600/80 mt-2 ml-11 animate-in fade-in duration-200">
          {tip.detail}
        </p>
      )}
    </div>
  );
}
