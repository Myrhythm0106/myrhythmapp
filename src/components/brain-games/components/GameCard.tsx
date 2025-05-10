
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { cn } from "@/lib/utils";
import { GameType } from "../types/gameTypes";
import { Play, Trophy } from "lucide-react";

interface GameCardProps {
  game: GameType;
  isSelected: boolean;
  onSelect: (gameId: string) => void;
  onPlay: (gameId: string, difficultyLevel: "Low" | "Medium" | "High") => void;
}

export function GameCard({ game, isSelected, onSelect, onPlay }: GameCardProps) {
  return (
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
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
            {game.icon}
          </div>
          <div>
            <CardTitle className="text-lg font-medium">{game.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {game.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className="text-sm text-muted-foreground mb-3">Difficulty Levels:</div>
        <div className="flex flex-wrap gap-2">
          {game.difficultyLevels.map((level) => (
            <Badge 
              key={level.level} 
              variant="secondary"
              className={cn(
                "bg-muted/50 cursor-pointer transition-all hover:bg-muted",
                level.level === "Low" && "border-green-400", 
                level.level === "Medium" && "border-amber-400",
                level.level === "High" && "border-red-400"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onPlay(game.id, level.level);
              }}
            >
              {level.level}
            </Badge>
          ))}
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
          variant="default" 
          className="w-full flex items-center gap-2 bg-primary/90 hover:bg-primary group-hover:shadow-md transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game.id, "Low");
          }}
        >
          <Play className="h-4 w-4" />
          Play Game
        </Button>
      </CardFooter>
    </Card>
  );
}
