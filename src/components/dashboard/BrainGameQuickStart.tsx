
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Star, Clock, PlayCircle, Award, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameRecommendation {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 1 | 2 | 3;
  cognitive: "memory" | "attention" | "processing" | "reasoning";
  image: string;
  highScore?: number;
}

export function BrainGameQuickStart() {
  const navigate = useNavigate();
  
  // Sample game recommendations - in a real app, these would be fetched from an API
  const recommendedGames: GameRecommendation[] = [
    {
      id: "memory-match",
      name: "Memory Match",
      description: "Test and improve your memory by matching pairs of cards",
      duration: "5 min",
      difficulty: 2,
      cognitive: "memory",
      image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1000",
      highScore: 820
    },
    {
      id: "number-sequence",
      name: "Number Sequence",
      description: "Enhance your logical reasoning by completing number patterns",
      duration: "10 min",
      difficulty: 3,
      cognitive: "reasoning",
      image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=1000",
      highScore: 650
    }
  ];
  
  const getDifficultyStars = (difficulty: number) => {
    return Array(3).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-3 w-3", 
          i < difficulty ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
        )} 
      />
    ));
  };
  
  const getCognitiveColor = (type: string) => {
    switch(type) {
      case "memory": return "text-blue-500";
      case "attention": return "text-purple-500";
      case "processing": return "text-green-500";
      case "reasoning": return "text-amber-500";
      default: return "text-primary";
    }
  };
  
  const handlePlayGame = (gameId: string) => {
    // In a real app, navigate to the game
    navigate(`/brain-games?game=${gameId}`);
  };
  
  const handleViewGames = () => {
    navigate("/brain-games");
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50/50 to-purple-100/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-purple-500" />
          Brain Game Quick Start
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-1">
        <div className="space-y-3">
          {recommendedGames.map(game => (
            <div key={game.id} className="rounded-lg border overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{game.name}</h4>
                  <div className="flex">{getDifficultyStars(game.difficulty)}</div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">{game.description}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{game.duration}</span>
                    </div>
                    
                    {game.highScore && (
                      <div className="flex items-center gap-1 text-xs">
                        <Award className="h-3 w-3 text-yellow-500" />
                        <span className="text-muted-foreground">{game.highScore}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handlePlayGame(game.id)}
                    className="h-8"
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewGames}
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          View All Brain Games
        </Button>
      </CardFooter>
    </Card>
  );
}
