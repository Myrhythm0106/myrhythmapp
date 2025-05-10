
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Star, Clock, Trophy, Eye, Puzzle, Book, Lightbulb } from "lucide-react";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { cn } from "@/lib/utils";
import { GameSession } from "./GameSession";
import { toast } from "@/hooks/use-toast";

// Types for our brain games
interface GameType {
  id: string;
  name: string;
  description: string;
  cognitiveDomain: string;
  icon: React.ReactNode;
  difficultyLevels: GameDifficultyLevel[];
  watchers?: string[];
}

interface GameDifficultyLevel {
  level: "Low" | "Medium" | "High";
  description: string;
  parameters: Record<string, any>;
}

export function BrainGamesLibrary() {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("featured");
  const [activeGame, setActiveGame] = useState<{
    id: string;
    name: string;
    icon: React.ReactNode;
    difficulty: "Low" | "Medium" | "High";
  } | null>(null);
  
  // Sample game types data - in a real app, this would be more extensive
  const gameTypes: GameType[] = [
    {
      id: "visual-memory",
      name: "Pattern Recall",
      description: "Remember and reproduce visual patterns that briefly appear on screen.",
      cognitiveDomain: "Visual Memory/Recall",
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      difficultyLevels: [
        {
          level: "Low",
          description: "Simple patterns with 3-4 elements and longer display times",
          parameters: { elements: 3, displayTimeMs: 2000, recallTimeMs: 10000 }
        },
        {
          level: "Medium",
          description: "Moderate patterns with 5-6 elements and standard display times",
          parameters: { elements: 5, displayTimeMs: 1500, recallTimeMs: 8000 }
        },
        {
          level: "High",
          description: "Complex patterns with 7+ elements and brief display times",
          parameters: { elements: 7, displayTimeMs: 1000, recallTimeMs: 7000 }
        }
      ],
      watchers: ["Dr. Wilson", "Support Group"]
    },
    {
      id: "auditory-memory",
      name: "Sound Sequence",
      description: "Listen to and reproduce sequences of sounds in the correct order.",
      cognitiveDomain: "Auditory Memory/Sequence",
      icon: <Book className="h-5 w-5 text-purple-500" />,
      difficultyLevels: [
        {
          level: "Low",
          description: "Short sequences of 2-3 distinct sounds with clear pauses",
          parameters: { sequenceLength: 3, pauseMs: 800, replayAvailable: true }
        },
        {
          level: "Medium",
          description: "Moderate sequences of 4-5 sounds with standard pauses",
          parameters: { sequenceLength: 4, pauseMs: 600, replayAvailable: true }
        },
        {
          level: "High",
          description: "Longer sequences of 6+ sounds with minimal pauses",
          parameters: { sequenceLength: 6, pauseMs: 400, replayAvailable: false }
        }
      ],
      watchers: ["Therapist Jane"]
    },
    {
      id: "focus-challenge",
      name: "Focus Challenge",
      description: "Maintain attention on a specific target while ignoring distractions.",
      cognitiveDomain: "Sustained Attention/Focus",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      difficultyLevels: [
        {
          level: "Low",
          description: "Few distractors, slow pace, high target visibility",
          parameters: { distractorCount: 3, targetFrequency: 0.4, sessionLengthMin: 3 }
        },
        {
          level: "Medium",
          description: "Moderate distractors with standard pace",
          parameters: { distractorCount: 6, targetFrequency: 0.3, sessionLengthMin: 5 }
        },
        {
          level: "High",
          description: "Many distractors, faster pace, subtle targets",
          parameters: { distractorCount: 10, targetFrequency: 0.2, sessionLengthMin: 7 }
        }
      ]
    },
    {
      id: "task-switcher",
      name: "Task Switcher",
      description: "Switch between different tasks based on changing rules or cues.",
      cognitiveDomain: "Task Switching/Divided Attention",
      icon: <Puzzle className="h-5 w-5 text-green-500" />,
      difficultyLevels: [
        {
          level: "Low",
          description: "Clear visual cues with extended transition time between tasks",
          parameters: { taskTypes: 2, transitionTimeMs: 2000, rulesChangeFrequency: "low" }
        },
        {
          level: "Medium",
          description: "Standard cues with moderate transition time",
          parameters: { taskTypes: 3, transitionTimeMs: 1500, rulesChangeFrequency: "medium" }
        },
        {
          level: "High",
          description: "Subtle cues with minimal transition time between tasks",
          parameters: { taskTypes: 4, transitionTimeMs: 800, rulesChangeFrequency: "high" }
        }
      ],
      watchers: ["Mom", "Cognitive Specialist"]
    }
  ];
  
  // User's recent games and progress
  const recentGames = [
    { id: "visual-memory", name: "Pattern Recall", lastPlayed: "Today", progressPercent: 65 },
    { id: "auditory-memory", name: "Sound Sequence", lastPlayed: "Yesterday", progressPercent: 42 },
    { id: "focus-challenge", name: "Focus Challenge", lastPlayed: "3 days ago", progressPercent: 78 }
  ];
  
  const handlePlayGame = (gameId: string, difficultyLevel: "Low" | "Medium" | "High" = "Low") => {
    const gameToPlay = gameTypes.find(game => game.id === gameId);
    if (gameToPlay) {
      setActiveGame({
        id: gameId,
        name: gameToPlay.name,
        icon: gameToPlay.icon,
        difficulty: difficultyLevel
      });
      
      toast({
        title: "Starting Game",
        description: `Loading ${gameToPlay.name} (${difficultyLevel} difficulty)`,
      });
    }
  };
  
  const renderGameCard = (game: GameType) => {
    return (
      <Card 
        key={game.id} 
        className={cn(
          "transition-all hover:shadow-md h-full flex flex-col",
          selectedGameType === game.id ? "ring-2 ring-primary" : ""
        )}
        onClick={() => setSelectedGameType(game.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {game.icon}
              <CardTitle className="text-lg font-medium">{game.name}</CardTitle>
            </div>
            <Badge variant="outline" className="bg-muted/40">{game.cognitiveDomain}</Badge>
          </div>
          <CardDescription className="mt-2">
            {game.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <div className="text-sm text-muted-foreground mb-3">Difficulty Levels:</div>
          <div className="flex flex-wrap gap-2">
            {game.difficultyLevels.map((level) => (
              <Badge 
                key={level.level} 
                variant="secondary"
                className={cn(
                  "bg-muted/50 cursor-pointer",
                  level.level === "Low" && "border-green-400", 
                  level.level === "Medium" && "border-amber-400",
                  level.level === "High" && "border-red-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayGame(game.id, level.level);
                }}
              >
                {level.level}
              </Badge>
            ))}
          </div>
          {game.watchers && (
            <div className="mt-3 pt-2 border-t">
              <WatchersDisplay 
                watchers={game.watchers} 
                maxVisible={2} 
                compact 
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayGame(game.id, "Low");
            }}
          >
            Play Game
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // If a game is active, show the game session instead of the library
  if (activeGame) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Playing: {activeGame.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              {activeGame.difficulty} Difficulty Level
            </p>
          </div>
        </div>
        
        <GameSession
          gameId={activeGame.id}
          gameName={activeGame.name}
          gameIcon={activeGame.icon}
          difficultyLevel={activeGame.difficulty}
          onClose={() => setActiveGame(null)}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Brain Games Library
          </h2>
          <p className="text-muted-foreground mt-1">
            Engaging cognitive games designed to support brain health and rehabilitation
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            Favorites
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Daily Plan
          </Button>
          <Button size="sm" variant="default" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Progress
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="featured">Featured Games</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {gameTypes.slice(0, 3).map(renderGameCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="m-0">
          <div className="space-y-4">
            {recentGames.map((game) => {
              const gameDetails = gameTypes.find(g => g.id === game.id);
              return (
                <Card key={game.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {gameDetails?.icon}
                        <CardTitle className="text-base font-medium">{game.name}</CardTitle>
                      </div>
                      <Badge variant="outline">{game.lastPlayed}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{game.progressPercent}%</span>
                    </div>
                    <Progress value={game.progressPercent} className="h-2" />
                  </CardContent>
                  <CardFooter className="bg-muted/20 py-2 flex justify-between">
                    <Button variant="ghost" size="sm">View Stats</Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handlePlayGame(game.id)}
                    >
                      Continue
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {gameTypes.map(renderGameCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="recommended" className="m-0">
          <div className="bg-muted/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2">Personalized Recommendations</h3>
            <p className="text-muted-foreground mb-4">
              Complete a brief cognitive assessment to receive personalized game recommendations
              tailored to your rehabilitation goals.
            </p>
            <Button variant="default">Start Assessment</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/10 rounded-lg p-4 mt-6 border">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Daily Practice Recommendation</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          For optimal cognitive benefits, aim for 15 minutes of daily brain games practice. 
          Your personalized selection will automatically adapt to your performance level.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm">Set Reminder</Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handlePlayGame("visual-memory")}
          >
            Start Today's Session
          </Button>
        </div>
      </div>
    </div>
  );
}
