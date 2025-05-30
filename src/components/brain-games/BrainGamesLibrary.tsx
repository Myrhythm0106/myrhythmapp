
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Star, Trophy, Search, Target, Zap, Heart, Focus, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GameSession } from "./components/GameSession";

// Import the refactored components
import { FeaturedTab } from "./components/FeaturedTab";
import { RecentTab } from "./components/RecentTab";
import { AllGamesTab } from "./components/AllGamesTab";
import { RecommendedTab } from "./components/RecommendedTab";
import { DailyRecommendation } from "./components/DailyRecommendation";
import { gameTypes } from "./data/gamesData";
import { ActiveGameProps } from "./types/gameTypes";

// Dr. Amen's Brain Health Categories
const brainCategories = {
  prefrontalCortex: {
    name: "Prefrontal Cortex (Executive Function)",
    icon: Brain,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Focus, attention, judgment, impulse control, organization, planning",
    games: ["attention-focus", "pattern-recognition", "working-memory"]
  },
  temporalLobes: {
    name: "Temporal Lobes (Memory & Learning)",
    icon: Heart,
    color: "text-green-600", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Memory formation, language, auditory processing, emotional stability",
    games: ["memory-match", "word-association", "sequence-memory"]
  },
  parietalLobes: {
    name: "Parietal Lobes (Sensory Processing)",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50", 
    borderColor: "border-purple-200",
    description: "Spatial processing, direction sense, body awareness",
    games: ["spatial-reasoning", "visual-processing", "coordination"]
  },
  occipitalLobes: {
    name: "Occipital Lobes (Visual Processing)",
    icon: Focus,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200", 
    description: "Visual processing, pattern recognition, visual memory",
    games: ["visual-patterns", "color-matching", "shape-recognition"]
  },
  cerebellum: {
    name: "Cerebellum (Coordination & Balance)",
    icon: Zap,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Physical coordination, thought coordination, processing speed",
    games: ["reaction-time", "coordination-games", "speed-processing"]
  },
  limbicSystem: {
    name: "Limbic System (Emotional Processing)",
    icon: Shield,
    color: "text-teal-600", 
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    description: "Emotional processing, bonding, motivation, memory formation",
    games: ["emotional-regulation", "stress-relief", "mindfulness"]
  }
};

export function BrainGamesLibrary() {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [activeGame, setActiveGame] = useState<ActiveGameProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const handleViewStats = (gameId: string) => {
    // In a real implementation, this would navigate to a stats page
    toast({
      title: "View Stats",
      description: `Viewing statistics for game ID: ${gameId}`,
    });
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Brain Games Library
          </h2>
          <p className="text-muted-foreground mt-1">
            Games organized by Dr. Amen's brain health categories for targeted cognitive training
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search games..." 
              className="pl-9 h-9 w-full md:w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
      
      <DailyRecommendation onStartSession={handlePlayGame} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="categories">Brain Categories</TabsTrigger>
          <TabsTrigger value="featured">Featured Games</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="m-0">
          <div className="grid gap-6">
            {Object.entries(brainCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <Card key={key} className={`${category.bgColor} ${category.borderColor} border-l-4`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-3 ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                      {category.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {category.games.map((gameId, index) => (
                        <Card key={gameId} className="bg-white/80 hover:bg-white transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">{gameId.replace('-', ' ')}</h4>
                              <Badge variant="secondary" className="text-xs">
                                Level {index + 1}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Targets {category.name.split('(')[1]?.replace(')', '') || 'cognitive function'}
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handlePlayGame(gameId, "Low")}
                              >
                                Play Easy
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePlayGame(gameId, "Medium")}
                              >
                                Medium
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePlayGame(gameId, "High")}
                              >
                                Hard
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="featured" className="m-0">
          <FeaturedTab 
            selectedGameType={selectedGameType}
            setSelectedGameType={setSelectedGameType}
            handlePlayGame={handlePlayGame}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="recent" className="m-0">
          <RecentTab 
            handleViewStats={handleViewStats}
            handlePlayGame={handlePlayGame}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="all" className="m-0">
          <AllGamesTab 
            selectedGameType={selectedGameType}
            setSelectedGameType={setSelectedGameType}
            handlePlayGame={handlePlayGame}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="recommended" className="m-0">
          <RecommendedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
