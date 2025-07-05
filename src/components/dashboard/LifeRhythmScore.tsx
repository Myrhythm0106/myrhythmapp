
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Music2, Heart, Brain } from "lucide-react";

interface LifeRhythmScoreProps {
  moodScore: number;
  activitiesCompleted: number;
  streakDays: number;
  goalsProgress: number;
}

export function LifeRhythmScore({ 
  moodScore, 
  activitiesCompleted, 
  streakDays, 
  goalsProgress 
}: LifeRhythmScoreProps) {
  
  // Calculate overall rhythm score
  const calculateRhythmScore = () => {
    const moodWeight = (moodScore / 10) * 25;
    const activityWeight = Math.min(activitiesCompleted * 8, 25);
    const streakWeight = Math.min(streakDays * 3, 25);
    const goalWeight = (goalsProgress / 100) * 25;
    
    return Math.round(moodWeight + activityWeight + streakWeight + goalWeight);
  };

  const rhythmScore = calculateRhythmScore();
  
  const getRhythmLabel = (score: number) => {
    if (score >= 85) return { label: "Perfect Harmony", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (score >= 70) return { label: "Strong Rhythm", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 55) return { label: "Finding Beat", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Building Tempo", color: "text-purple-600", bg: "bg-purple-50" };
  };

  const rhythmStatus = getRhythmLabel(rhythmScore);

  return (
    <Card className="border-l-4 border-l-purple-400 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-full">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          Life Rhythm Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {rhythmScore}%
          </div>
          <div className={`inline-flex px-3 py-1 rounded-full ${rhythmStatus.bg}`}>
            <span className={`text-sm font-medium ${rhythmStatus.color}`}>
              {rhythmStatus.label}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Mood Harmony</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all"
                  style={{ width: `${(moodScore / 10) * 100}%` }}
                />
              </div>
              <span className="font-medium">{moodScore}/10</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>Activity Beat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${Math.min((activitiesCompleted / 5) * 100, 100)}%` }}
                />
              </div>
              <span className="font-medium">{activitiesCompleted}/5</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Consistency Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${Math.min((streakDays / 30) * 100, 100)}%` }}
                />
              </div>
              <span className="font-medium">{streakDays} days</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-center text-gray-600">
            Your rhythm grows stronger each day 🎵
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
