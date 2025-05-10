
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface GameHeaderProps {
  gameIcon: React.ReactNode;
  gameName: string;
  difficultyLevel: "Low" | "Medium" | "High";
}

export function GameHeader({ gameIcon, gameName, difficultyLevel }: GameHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        {gameIcon}
        <CardTitle className="text-xl">{gameName}</CardTitle>
      </div>
      <Badge variant="outline">{difficultyLevel} Difficulty</Badge>
    </CardHeader>
  );
}
