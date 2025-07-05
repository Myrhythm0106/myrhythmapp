
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Heart, Brain } from "lucide-react";

export interface FamilyTimeActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "easy" | "medium" | "challenging";
  category: "conversation" | "activity" | "shared-task" | "celebration";
  benefits: string[];
}

interface ActivityCardProps {
  activity: FamilyTimeActivity;
  onSchedule: (activity: FamilyTimeActivity) => void;
}

export function ActivityCard({ activity, onSchedule }: ActivityCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "challenging": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-memory-emerald-50 to-heart-50 rounded-lg border border-memory-emerald-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-memory-emerald-800">{activity.title}</h3>
            <Badge className={`text-xs ${getDifficultyColor(activity.difficulty)}`}>
              {activity.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration} min
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {activity.category}
            </div>
          </div>
        </div>
        <Button
          onClick={() => onSchedule(activity)}
          className="bg-memory-emerald-500 hover:bg-memory-emerald-600"
        >
          Schedule
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {activity.benefits.map((benefit, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-white/70">
              {benefit}
            </Badge>
          ))}
        </div>
        
        {/* MYRHYTHM Integration */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground bg-white/50 p-2 rounded">
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-green-600" />
            <span>Memory1st: Brain-healthy connection</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-blue-600" />
            <span>MYRHYTHM: Family bonding ritual</span>
          </div>
        </div>
      </div>
    </div>
  );
}
