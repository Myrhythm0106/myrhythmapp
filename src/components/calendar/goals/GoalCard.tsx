
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Book, Heart, Footprints, Utensils, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    type: "daily" | "weekly" | "monthly" | "long-term";
    progress: number;
    icon?: string;
    smallSteps: any[];
  };
  onClick: (goalId: string) => void;
}

const iconMap = {
  "walking": Footprints,
  "book": Book,
  "heart": Heart,
  "target": Target,
  "cooking": Utensils,
  "home": Home
};

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target;
  
  const getMotivationalMessage = (progress: number) => {
    if (progress >= 80) return "Almost there! You're amazing!";
    if (progress >= 60) return "Making great strides!";
    if (progress >= 40) return "Keep up the amazing work!";
    if (progress >= 20) return "You're building momentum!";
    return "Every step counts!";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30"
      onClick={() => onClick(goal.id)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with Icon and Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {goal.title}
              </h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
              </Badge>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-lg font-bold text-primary">{goal.progress}% Complete</span>
            </div>
            
            <Progress 
              value={goal.progress} 
              className="h-3"
              indicatorClassName={cn(getProgressColor(goal.progress))}
            />
            
            {/* Motivational Message */}
            <p className="text-sm text-primary font-medium text-center bg-primary/5 px-3 py-2 rounded-md">
              {getMotivationalMessage(goal.progress)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
            <span>{goal.smallSteps.length} smaller parts</span>
            <span>Tap to view plan</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
