
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, ChartBar, HelpCircle } from "lucide-react";
import { RecentGame } from "../types/gameTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { gameTypes } from "../data/gamesData";

interface RecentGameCardProps {
  game: RecentGame;
  icon: React.ReactNode;
  onViewStats: (gameId: string) => void;
  onContinue: (gameId: string) => void;
}

export function RecentGameCard({ game, icon, onViewStats, onContinue }: RecentGameCardProps) {
  const gameDetails = gameTypes.find(g => g.id === game.id);
  
  return (
    <TooltipProvider>
      <Card key={game.id} className="overflow-hidden hover:shadow-md transition-all border-muted/80">
        <CardHeader className="pb-2 flex flex-row items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="flex-grow flex items-start">
            <div className="flex-grow">
              <CardTitle className="text-base font-medium">{game.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-muted/40 text-xs">
                  {game.lastPlayed}
                </Badge>
                {game.streakDays > 0 && (
                  <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
                    {game.streakDays} day streak
                  </Badge>
                )}
              </div>
            </div>
            {gameDetails && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2 flex-shrink-0 cursor-help" onClick={(e) => e.stopPropagation()}>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">{game.name}</p>
                    <p>{gameDetails.purpose || gameDetails.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cognitive domain: <span className="font-medium">{gameDetails.cognitiveDomain}</span>
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center justify-between text-sm mb-1.5 mt-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{game.progressPercent}%</span>
          </div>
          <Progress value={game.progressPercent} className="h-2" 
            indicatorClassName={
              game.progressPercent < 30 ? "bg-muted" : 
              game.progressPercent < 70 ? "bg-amber-500" : "bg-green-500"
            }
          />
        </CardContent>
        <CardFooter className="bg-muted/10 py-2.5 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => onViewStats(game.id)}
          >
            <ChartBar className="h-3.5 w-3.5" />
            View Stats
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90"
            onClick={() => onContinue(game.id)}
          >
            <Play className="h-3.5 w-3.5" />
            Continue
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
