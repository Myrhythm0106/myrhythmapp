
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, Book, Footprints, Heart, Utensils, Home, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping for goal icons
const iconMap = {
  "walking": Footprints,
  "book": Book,
  "heart": Heart,
  "target": Target,
  "cooking": Utensils,
  "home": Home
};

interface GoalPlanHeaderProps {
  goal: {
    title: string;
    icon: string;
    progress: number;
  };
  onBack: () => void;
  onFinish: () => void;
}

const getProgressColor = (progress: number) => {
  if (progress >= 70) return "bg-green-500";
  if (progress >= 40) return "bg-amber-500"; 
  return "bg-blue-500";
};

export function GoalPlanHeader({ goal, onBack, onFinish }: GoalPlanHeaderProps) {
  const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target;

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={onBack} className="p-2">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Goal Plan</h1>
            <p className="text-gray-600">{goal.title}</p>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-lg font-bold text-primary">{goal.progress}% Complete</span>
          </div>
          <Progress 
            value={goal.progress} 
            className="h-3"
            indicatorClassName={cn(getProgressColor(goal.progress))}
          />
        </div>
      </div>

      <Button 
        onClick={onFinish}
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Finish
      </Button>
    </div>
  );
}
