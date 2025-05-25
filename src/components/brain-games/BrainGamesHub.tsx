
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Calendar, TrendingUp, Play } from "lucide-react";
import { DailyMemoryWorkout } from "./components/DailyMemoryWorkout";
import { GameSelectionGrid } from "./components/GameSelectionGrid";
import { UserProgressDashboard } from "./components/UserProgressDashboard";
import { ActiveGameSession } from "./components/ActiveGameSession";
import { useBrainGameProgress } from "./hooks/useBrainGameProgress";

export function BrainGamesHub() {
  const [activeTab, setActiveTab] = useState("daily");
  const [activeGame, setActiveGame] = useState<{
    type: 'sequence' | 'matching' | 'spatial';
    level: number;
  } | null>(null);
  
  const { 
    userProgress, 
    todayStats, 
    streak,
    updateProgress 
  } = useBrainGameProgress();

  const handleStartGame = (gameType: 'sequence' | 'matching' | 'spatial', level: number = 1) => {
    setActiveGame({ type: gameType, level });
  };

  const handleGameComplete = (score: number, accuracy: number, timeSpent: number) => {
    if (activeGame) {
      updateProgress(activeGame.type, activeGame.level, score, accuracy, timeSpent);
      setActiveGame(null);
    }
  };

  // If a game is active, show the game session
  if (activeGame) {
    return (
      <ActiveGameSession
        gameType={activeGame.type}
        level={activeGame.level}
        onComplete={handleGameComplete}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Brain Games
          </h2>
          <p className="text-muted-foreground mt-1">
            Strengthen your memory and cognitive abilities with targeted exercises
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold text-primary">{streak} days</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today's Games</p>
            <p className="text-2xl font-bold">{todayStats.gamesCompleted}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Daily Workout
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            All Games
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <DailyMemoryWorkout onStartGame={handleStartGame} />
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <GameSelectionGrid 
            userProgress={userProgress}
            onStartGame={handleStartGame}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <UserProgressDashboard 
            userProgress={userProgress}
            todayStats={todayStats}
            streak={streak}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
