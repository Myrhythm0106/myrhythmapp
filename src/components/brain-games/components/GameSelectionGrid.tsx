
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Grid3X3, Zap, Star } from "lucide-react";

interface GameSelectionGridProps {
  userProgress: any;
  onStartGame: (gameType: 'sequence' | 'matching' | 'spatial', level?: number) => void;
}

export function GameSelectionGrid({ userProgress, onStartGame }: GameSelectionGridProps) {
  const gameTypes = [
    {
      type: 'sequence' as const,
      title: "Sequence Recall",
      description: "Observe and repeat sequences of visual or auditory cues",
      icon: <Target className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      maxLevels: 20
    },
    {
      type: 'matching' as const,
      title: "Matching Pairs",
      description: "Find matching pairs in this classic concentration game",
      icon: <Grid3X3 className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      maxLevels: 15
    },
    {
      type: 'spatial' as const,
      title: "Spatial Memory",
      description: "Remember locations of objects and navigate paths on grids",
      icon: <Zap className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      maxLevels: 15
    }
  ];

  const getProgressForGame = (gameType: string) => {
    const progress = userProgress[gameType];
    if (!progress) return { currentLevel: 1, completedLevels: 0, bestScore: 0 };
    
    return {
      currentLevel: progress.currentLevel || 1,
      completedLevels: progress.completedLevels || 0,
      bestScore: progress.bestScore || 0
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Challenge</h3>
        <p className="text-muted-foreground">
          Select a game type and difficulty level to start training your memory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gameTypes.map((game) => {
          const progress = getProgressForGame(game.type);
          const progressPercentage = (progress.completedLevels / game.maxLevels) * 100;

          return (
            <Card key={game.type} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center text-white mb-3`}>
                  {game.icon}
                </div>
                <CardTitle className="text-lg">{game.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {game.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.completedLevels}/{game.maxLevels} levels</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Level</p>
                    <p className="font-medium">{progress.currentLevel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Best Score</p>
                    <p className="font-medium">{progress.bestScore}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => onStartGame(game.type, progress.currentLevel)}
                  >
                    Continue Level {progress.currentLevel}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onStartGame(game.type, 1)}
                  >
                    Start from Level 1
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
