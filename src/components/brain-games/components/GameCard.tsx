
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WatchersDisplay } from "@/components/shared/WatchersDisplay";
import { cn } from "@/lib/utils";
import { GameType } from "../types/gameTypes";

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
        "transition-all hover:shadow-md h-full flex flex-col",
        isSelected ? "ring-2 ring-primary" : ""
      )}
      onClick={() => onSelect(game.id)}
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
                onPlay(game.id, level.level);
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
            onPlay(game.id, "Low");
          }}
        >
          Play Game
        </Button>
      </CardFooter>
    </Card>
  );
}
