
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Book, Heart, Footprints, Utensils, Home, Calendar, Clock } from "lucide-react";
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

interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly" | "long-term";
  description?: string;
  progress: number;
  icon: string;
  dueDate?: string;
  createdAt: string;
  status: "to-do" | "doing" | "done";
  smallSteps: any[];
}

interface OrganizedGoalCardProps {
  goal: Goal;
  onClick: (goalId: string) => void;
}

export function OrganizedGoalCard({ goal, onClick }: OrganizedGoalCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[goal.icon as keyof typeof iconMap] || Target;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "to-do": return "bg-gray-100 text-gray-800 border-gray-200";
      case "doing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "done": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30 relative",
        getStatusColor(goal.status).split(' ')[2]
      )}
      onClick={() => onClick(goal.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 text-gray-800">
                {goal.title}
              </CardTitle>
              <Badge className={cn("mt-1 text-xs border", getStatusColor(goal.status))}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {goal.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
          )}
          
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Progress</span>
              <span className="text-sm font-bold text-primary">{goal.progress}%</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-2"
              indicatorClassName={cn(getProgressColor(goal.progress))}
            />
          </div>

          {/* Type badge */}
          <Badge variant="outline" className="text-xs">
            {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal
          </Badge>
        </div>
      </CardContent>

      {/* Hover overlay with dates */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center text-white p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Started: {new Date(goal.createdAt).toLocaleDateString()}</span>
            </div>
            {goal.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            <p className="text-xs opacity-80 mt-2">Click to view details</p>
          </div>
        </div>
      )}
    </Card>
  );
}
