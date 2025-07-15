
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Target, Trophy, Clock, BarChart3 } from "lucide-react";

const BrainGames = () => {
  const games = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Enhance working memory with pattern matching",
      difficulty: "Beginner",
      duration: "5-10 min",
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      id: "attention-focus",
      title: "Attention Focus",
      description: "Improve sustained attention and concentration",
      difficulty: "Intermediate", 
      duration: "10-15 min",
      icon: Target,
      color: "bg-green-500"
    },
    {
      id: "processing-speed",
      title: "Processing Speed",
      description: "Boost cognitive processing speed",
      difficulty: "Advanced",
      duration: "8-12 min", 
      icon: Zap,
      color: "bg-yellow-500"
    },
    {
      id: "executive-function",
      title: "Executive Function",
      description: "Strengthen planning and decision-making",
      difficulty: "Expert",
      duration: "15-20 min",
      icon: Trophy,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Brain Games
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Scientifically designed cognitive exercises to enhance memory, attention, and processing speed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {games.map((game) => {
          const IconComponent = game.icon;
          return (
            <Card key={game.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${game.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{game.description}</p>
                <div className="flex space-x-2">
                  <Button className="flex-1">Start Game</Button>
                  <Button variant="outline">View Stats</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-muted-foreground">Games Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8.5</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainGames;
