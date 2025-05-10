
import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameCompleteProps {
  score: number;
  timeElapsed: number;
  round: number;
}

export function GameComplete({ score, timeElapsed, round }: GameCompleteProps) {
  return (
    <div className="text-center py-8 space-y-4">
      <Star className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
      <h3 className="text-xl font-medium">Game Complete!</h3>
      <p className="text-muted-foreground">
        You scored {score} points in {timeElapsed} seconds.
      </p>
      <Badge className="mx-auto">Round {round} Completed</Badge>
    </div>
  );
}
