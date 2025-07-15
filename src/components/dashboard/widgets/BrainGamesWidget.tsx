
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BrainGamesWidget() {
  const navigate = useNavigate();
  
  // Mock data - in real app this would come from user progress
  const dailyChallenge = {
    name: "Memory Sequence",
    difficulty: "Medium",
    estimatedTime: "3-5 min"
  };

  const recentScore = 85;
  const streak = 3;

  return (
    <Card className="h-full border-emerald-200/40 bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <Brain className="h-3 w-3 text-white" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Brain Games</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-emerald-50/60 via-blue-50/50 to-purple-50/40 p-3 rounded-lg border border-emerald-200/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-emerald-700">Today's Challenge</span>
            <Badge variant="healing" className="text-xs">
              {dailyChallenge.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-2 font-medium">
            {dailyChallenge.name}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>⏱️ {dailyChallenge.estimatedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gradient-to-br from-purple-50/60 to-emerald-50/40 rounded-lg border border-purple-200/30">
            <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">{recentScore}</div>
            <div className="text-xs text-gray-600">Recent Score</div>
          </div>
          <div className="text-center p-2 bg-gradient-to-br from-emerald-50/60 to-orange-50/40 rounded-lg border border-emerald-200/30">
            <div className="text-lg font-semibold text-orange-500">{streak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="healing"
            className="flex-1"
            onClick={() => navigate("/brain-games")}
          >
            <Zap className="h-4 w-4 mr-1" />
            Quick Start
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-emerald-300/60 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-blue-50/30"
            onClick={() => navigate("/brain-games")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
