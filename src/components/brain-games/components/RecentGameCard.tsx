
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RecentGame } from "../types/gameTypes";

interface RecentGameCardProps {
  game: RecentGame;
  icon: React.ReactNode;
  onViewStats: (gameId: string) => void;
  onContinue: (gameId: string) => void;
}

export function RecentGameCard({ game, icon, onViewStats, onContinue }: RecentGameCardProps) {
  return (
    <Card key={game.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewStats(game.id)}
        >
          View Stats
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onContinue(game.id)}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
