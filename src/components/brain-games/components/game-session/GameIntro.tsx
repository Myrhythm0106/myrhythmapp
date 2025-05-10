
import React from "react";
import { Brain } from "lucide-react";

interface GameIntroProps {
  gameName: string;
  difficultyLevel: "Low" | "Medium" | "High";
}

export function GameIntro({ gameName, difficultyLevel }: GameIntroProps) {
  return (
    <div className="text-center py-8 space-y-4">
      <Brain className="h-16 w-16 text-primary mx-auto" />
      <h3 className="text-xl font-medium">Ready to play {gameName}?</h3>
      <p className="text-muted-foreground">
        Test your cognitive skills with this brain training game.
        {difficultyLevel === "Low" && " This is a beginner-friendly level."}
        {difficultyLevel === "Medium" && " This is an intermediate challenge."}
        {difficultyLevel === "High" && " This is an advanced level challenge."}
      </p>
    </div>
  );
}
