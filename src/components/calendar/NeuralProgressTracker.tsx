import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Zap, Trophy } from "lucide-react";

interface NeuralProgressTrackerProps {
  completedActions: number;
  totalActions: number;
  streakDays: number;
  weeklyGoals: number;
  completedWeeklyGoals: number;
  className?: string;
}

export function NeuralProgressTracker({
  completedActions,
  totalActions,
  streakDays,
  weeklyGoals,
  completedWeeklyGoals,
  className
}: NeuralProgressTrackerProps) {
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;
  const weeklyProgress = weeklyGoals > 0 ? (completedWeeklyGoals / weeklyGoals) * 100 : 0;
  
  const getMotivationalMessage = (progress: number) => {
    if (progress >= 80) return "Your neural pathways are thriving! 🧠✨";
    if (progress >= 60) return "Building strong cognitive connections! 🌟";
    if (progress >= 40) return "Your brain is growing with each step! 🌱";
    if (progress >= 20) return "Every action strengthens your mind! 💪";
    return "Ready to start building those neural pathways? 🚀";
  };

  const getStreakMessage = (days: number) => {
    if (days >= 21) return `Amazing ${days}-day habit formation! 🔥`;
    if (days >= 7) return `Great ${days}-day momentum! 📈`;
    if (days >= 3) return `Building consistency - ${days} days! 💫`;
    if (days >= 1) return `Started your journey - Day ${days}! 🌟`;
    return "Ready to start your streak? 🎯";
  };

  return (
    <Card className={`calendar-command-center ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-brain-health-400 to-clarity-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-neural-pulse">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Neural Growth Dashboard
          </h3>
          <p className="text-sm text-brain-health-600 mt-1">
            {getMotivationalMessage(progressPercentage)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-brain-health-600" />
                <span className="text-sm font-medium">Today's Neural Building</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {completedActions}/{totalActions}
              </Badge>
            </div>
            
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-brain-health-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-400 via-brain-health-400 to-clarity-teal-400 rounded-full opacity-80" 
                   style={{ width: `${progressPercentage}%` }} />
            </div>
            
            {progressPercentage >= 100 && (
              <div className="text-center py-2 animate-achievement-celebration">
                <div className="cognitive-achievement rounded-lg px-4 py-2 text-sm font-medium">
                  🎉 Daily Goal Achieved! Neural pathways strengthened! 🎉
                </div>
              </div>
            )}
          </div>

          {/* Weekly Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-clarity-teal-600" />
                <span className="text-sm font-medium">Weekly Brain Goals</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {completedWeeklyGoals}/{weeklyGoals}
              </Badge>
            </div>
            
            <div className="relative">
              <Progress 
                value={weeklyProgress} 
                className="h-3 bg-clarity-teal-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-clarity-teal-400 via-brain-health-400 to-memory-emerald-400 rounded-full opacity-80" 
                   style={{ width: `${weeklyProgress}%` }} />
            </div>
          </div>

          {/* Momentum Streak */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-memory-emerald-600" />
                <span className="text-sm font-medium">Planning Streak</span>
              </div>
              <Badge className="cognitive-achievement text-xs">
                {streakDays} days
              </Badge>
            </div>
            
            <div className="text-center p-3 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-lg border border-memory-emerald-200">
              <p className="text-sm font-medium text-memory-emerald-700">
                {getStreakMessage(streakDays)}
              </p>
              <p className="text-xs text-memory-emerald-600 mt-1">
                Consistent planning builds lasting neural patterns
              </p>
            </div>
          </div>

          {/* Future Self Visualization */}
          <div className="text-center p-4 bg-gradient-to-br from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg border border-brain-health-200/50">
            <div className="text-sm font-medium text-brain-health-700 mb-2">
              🔮 Future Self Impact
            </div>
            <p className="text-xs text-brain-health-600">
              Today's planning choices are building tomorrow's cognitive strength and mental clarity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}