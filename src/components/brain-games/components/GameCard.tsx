
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { cn } from "@/lib/utils";
import { GameType } from "../types/gameTypes";
import { Play, Trophy, HelpCircle, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBrainGamesAccess } from "@/hooks/useBrainGamesAccess";

interface GameCardProps {
  game: GameType;
  isSelected: boolean;
  onSelect: (gameId: string) => void;
  onPlay: (gameId: string, difficultyLevel: "Low" | "Medium" | "High") => void;
}

export function GameCard({ game, isSelected, onSelect, onPlay }: GameCardProps) {
  const { canPlayGame, canUseDifficulty, getRequiredTierForDifficulty } = useBrainGamesAccess();
  const isGameLocked = !canPlayGame(game.id);
  return (
    <TooltipProvider>
      <Card 
        key={game.id} 
        className={cn(
          "transition-all hover:shadow-md h-full flex flex-col relative overflow-hidden group",
          isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
        )}
        onClick={() => onSelect(game.id)}
      >
        {/* Badge positioned at top-right */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className="bg-muted/40 backdrop-blur-sm"
          >
            {game.cognitiveDomain}
          </Badge>
        </div>
        
        {/* Progress indicator if applicable */}
        {game.progressLevel && (
          <div className="absolute top-2 left-2 flex items-center">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium ml-1 text-amber-700">Level {game.progressLevel}</span>
          </div>
        )}
        
        <CardHeader className="pb-2 pt-8">
          <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0 relative">
          {game.icon}
          {isGameLocked && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Lock className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
            <div className="flex items-start">
              <div className="flex-grow">
                <CardTitle className="text-lg font-medium flex items-center">
                  {game.name}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 cursor-help" onClick={(e) => e.stopPropagation()}>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{game.name}</p>
                        <p>{game.purpose || game.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cognitive domain: <span className="font-medium">{game.cognitiveDomain}</span>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2">
                  {game.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow pb-2">
          <div className="text-sm text-muted-foreground mb-3">Difficulty Levels:</div>
          <div className="flex flex-wrap gap-2">
            {game.difficultyLevels.map((level) => {
              const isDifficultyLocked = !canUseDifficulty(level.level);
              const requiredTier = getRequiredTierForDifficulty(level.level);
              
              return (
                <Badge 
                  key={level.level} 
                  variant="secondary"
                  className={cn(
                    "cursor-pointer transition-all",
                    isDifficultyLocked 
                      ? "bg-muted/30 text-muted-foreground cursor-not-allowed" 
                      : "bg-muted/50 hover:bg-muted",
                    level.level === "Low" && !isDifficultyLocked && "border-green-400", 
                    level.level === "Medium" && !isDifficultyLocked && "border-amber-400",
                    level.level === "High" && !isDifficultyLocked && "border-red-400"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDifficultyLocked && !isGameLocked) {
                      onPlay(game.id, level.level);
                    }
                  }}
                >
                  {isDifficultyLocked && <Lock className="h-3 w-3 mr-1" />}
                  {level.level}
                </Badge>
              );
            })}
          </div>
          
          {game.watchers && (
            <div className="mt-4 pt-3 border-t">
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
            variant={isGameLocked ? "outline" : "default"}
            className="w-full flex items-center gap-2 bg-primary/90 hover:bg-primary group-hover:shadow-md transition-all"
            onClick={(e) => {
              e.stopPropagation();
              if (!isGameLocked) {
                onPlay(game.id, "Low");
              }
            }}
            disabled={isGameLocked}
          >
            {isGameLocked ? (
              <>
                <Lock className="h-4 w-4" />
                Upgrade Required
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play Game
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
