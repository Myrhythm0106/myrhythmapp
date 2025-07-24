
import React from "react";
import { MemoryEffectsContainer } from "@/components/ui/memory-effects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Heart, Calendar, Plus, Zap } from "lucide-react";

interface BrainHealthCalendarHeaderProps {
  onQuickAction: () => void;
  onNewGoal: () => void;
  onPlanDreams: () => void;
}

export function BrainHealthCalendarHeader({ 
  onQuickAction, 
  onNewGoal, 
  onPlanDreams 
}: BrainHealthCalendarHeaderProps) {
  return (
    <MemoryEffectsContainer nodeCount={6} className="relative">
      <div className="bg-gradient-to-br from-memory-emerald-50 via-white to-clarity-teal-50 rounded-xl p-6 border border-memory-emerald-100">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center animate-memory-pulse">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
              Your Memory-Friendly Calendar
            </h1>
          </div>
          <p className="text-brain-base text-gray-600 max-w-2xl mx-auto">
            What will you accomplish today? Plan your future actions and goals to support your brain health journey.
          </p>
          <Badge variant="outline" className="bg-brain-health-50 text-brain-health-700 border-brain-health-200">
            Brain-Friendly Planning • Memory1st Approach
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button 
            onClick={onNewGoal}
            className="bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 text-white font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <Target className="mr-2 h-4 w-4" />
            Create Future Goal
          </Button>
          
          <Button 
            onClick={onPlanDreams}
            className="bg-gradient-to-r from-brain-health-500 to-brain-health-600 text-white font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <Heart className="mr-2 h-4 w-4" />
            Plan Future Dreams
          </Button>
        </div>
      </div>
    </MemoryEffectsContainer>
  );
}
