
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Star, Trophy, Search } from "lucide-react";
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

export function BrainGamesLibrary() {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("featured");
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
            Engaging cognitive games designed to support brain health and rehabilitation
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
          <TabsTrigger value="featured">Featured Games</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        
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
