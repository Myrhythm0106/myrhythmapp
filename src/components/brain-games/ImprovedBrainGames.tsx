import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, Zap, Trophy, Clock, BarChart3, Play, Star } from "lucide-react";

interface BrainGameProps {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  onStart: () => void;
}

export function ImprovedBrainGames() {
  const [userProgress, setUserProgress] = useState({
    memoryMatch: { level: 5, bestScore: 92, completed: 23 },
    attentionFocus: { level: 8, bestScore: 88, completed: 31 },
    processingSpeed: { level: 4, bestScore: 95, completed: 17 },
    workingMemory: { level: 6, bestScore: 90, completed: 25 }
  });

  const brainGames: BrainGameProps[] = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Enhance working memory and pattern recognition through strategic card matching",
      difficulty: "Progressive",
      duration: "5-10 min",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      benefits: [
        "Improves working memory capacity",
        "Enhances pattern recognition",
        "Strengthens attention to detail",
        "Builds cognitive flexibility"
      ],
      onStart: () => handleGameStart("memory-match")
    },
    {
      id: "attention-focus",
      title: "Attention Training",
      description: "Develop sustained attention and selective focus through dynamic visual exercises",
      difficulty: "Adaptive",
      duration: "8-12 min",
      icon: Target,
      color: "from-green-500 to-green-600",
      benefits: [
        "Increases sustained attention span",
        "Improves selective attention",
        "Reduces distractibility",
        "Enhances cognitive control"
      ],
      onStart: () => handleGameStart("attention-focus")
    },
    {
      id: "processing-speed",
      title: "Speed Training",
      description: "Accelerate cognitive processing speed with rapid decision-making challenges",
      difficulty: "Challenging",
      duration: "6-8 min",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      benefits: [
        "Faster information processing",
        "Quicker decision making",
        "Improved reaction time",
        "Enhanced mental agility"
      ],
      onStart: () => handleGameStart("processing-speed")
    },
    {
      id: "working-memory",
      title: "Working Memory",
      description: "Strengthen your mental workspace with complex sequence and spatial tasks",
      difficulty: "Advanced",
      duration: "10-15 min",
      icon: Trophy,
      color: "from-purple-500 to-purple-600",
      benefits: [
        "Expands working memory capacity",
        "Improves mental manipulation",
        "Enhances problem-solving",
        "Strengthens executive function"
      ],
      onStart: () => handleGameStart("working-memory")
    }
  ];

  const handleGameStart = (gameId: string) => {
    // Implement game start logic
    console.log(`Starting game: ${gameId}`);
  };

  const getProgressForGame = (gameId: string) => {
    const key = gameId.replace("-", "") as keyof typeof userProgress;
    return userProgress[key] || { level: 1, bestScore: 0, completed: 0 };
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Brain Training Games
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Scientifically designed cognitive exercises that adapt to your performance, 
          providing measurable improvements in memory, attention, and processing speed.
        </p>
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">96</div>
              <div className="text-sm text-muted-foreground">Games Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">5.8</div>
              <div className="text-sm text-muted-foreground">Avg Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {brainGames.map((game) => {
          const IconComponent = game.icon;
          const progress = getProgressForGame(game.id);
          
          return (
            <Card key={game.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{game.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          {game.difficulty}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {game.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Level {progress.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{game.description}</p>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">Best Score</div>
                    <div className="text-lg font-bold text-primary">{progress.bestScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Completed</div>
                    <div className="text-lg font-bold text-primary">{progress.completed}</div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level Progress</span>
                    <span>{Math.round((progress.level % 1) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((progress.level % 1) * 100)} className="w-full" />
                </div>
                
                {/* Benefits */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Cognitive Benefits:</div>
                  <div className="grid grid-cols-1 gap-1">
                    {game.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    onClick={game.onStart} 
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Challenge */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-purple-600" />
            Weekly Brain Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-purple-800">Memory Marathon</h3>
              <p className="text-purple-700 text-sm">
                Complete 5 memory games this week to unlock the "Memory Master" achievement
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-purple-600">Progress: 3/5 games</div>
                <Progress value={60} className="w-40" />
              </div>
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                View Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}