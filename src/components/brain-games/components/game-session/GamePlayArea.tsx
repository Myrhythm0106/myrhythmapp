
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GamePlayAreaProps {
  gameId: string;
  round: number;
  score: number;
  timeLeft: number;
  gameItems: number[];
  selectedItems: number[];
  onItemClick: (item: number) => void;
}

export function GamePlayArea({
  gameId,
  round,
  score,
  timeLeft,
  gameItems,
  selectedItems,
  onItemClick
}: GamePlayAreaProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>Round: {round}</div>
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">
          {gameId === "visual-memory" ? "Remember the pattern" : 
           gameId === "focus-challenge" ? "Focus on the target" :
           "Complete the task"}
        </h4>
        
        <div className="grid grid-cols-3 gap-3 my-4">
          {gameItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 w-16 text-lg font-bold"
              onClick={() => onItemClick(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        
        <div className="mt-4">
          <Progress value={(selectedItems.length / gameItems.length) * 100} className="h-2" />
        </div>
      </div>
    </>
  );
}
