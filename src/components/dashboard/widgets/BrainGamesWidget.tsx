
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Brain Games
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Today's Challenge</span>
            <Badge variant="secondary" className="text-xs">
              {dailyChallenge.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {dailyChallenge.name}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>⏱️ {dailyChallenge.estimatedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{recentScore}</div>
            <div className="text-xs text-muted-foreground">Recent Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-500">{streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => navigate("/brain-games")}
          >
            <Zap className="h-4 w-4 mr-1" />
            Quick Start
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/brain-games")}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
