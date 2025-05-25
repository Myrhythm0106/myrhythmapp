import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, Zap, Calendar } from "lucide-react";

interface DailyMemoryWorkoutProps {
  onStartGame: (gameType: 'sequence' | 'matching' | 'spatial', level?: number) => void;
}

export function DailyMemoryWorkout({ onStartGame }: DailyMemoryWorkoutProps) {
  const dailyGames = [
    {
      type: 'sequence' as const,
      title: "Sequence Recall",
      description: "Remember and repeat a sequence of visual cues",
      difficulty: "Medium",
      estimatedTime: "3-5 min",
      icon: <Target className="h-5 w-5" />,
      level: 5
    },
    {
      type: 'matching' as const,
      title: "Memory Pairs",
      description: "Find matching pairs in this concentration game",
      difficulty: "Easy",
      estimatedTime: "5-7 min",
      icon: <Brain className="h-5 w-5" />,
      level: 3
    },
    {
      type: 'spatial' as const,
      title: "Spatial Memory",
      description: "Remember the locations of objects on a grid",
      difficulty: "Hard",
      estimatedTime: "4-6 min",
      icon: <Zap className="h-5 w-5" />,
      level: 7
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Memory Workout
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete these 3 games to maintain your cognitive fitness routine
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dailyGames.map((game, index) => (
          <Card key={game.type} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {game.icon}
                  <span className="font-medium">{game.title}</span>
                </div>
                <Badge className={getDifficultyColor(game.difficulty)}>
                  {game.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {game.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {game.estimatedTime}
              </div>
              <Button 
                className="w-full"
                onClick={() => onStartGame(game.type, game.level)}
              >
                Start Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
