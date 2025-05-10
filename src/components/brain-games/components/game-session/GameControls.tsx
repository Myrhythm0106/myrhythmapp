
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GameControlsProps {
  gameStarted: boolean;
  gameComplete: boolean;
  onClose: () => void;
  onStart: () => void;
  onEnd: () => void;
}

export function GameControls({
  gameStarted,
  gameComplete,
  onClose,
  onStart,
  onEnd
}: GameControlsProps) {
  return (
    <div className="justify-between flex">
      <Button variant="outline" size="sm" onClick={onClose}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Library
      </Button>
      
      {!gameStarted ? (
        <Button 
          variant="default" 
          size="sm"
          onClick={onStart}
        >
          {gameComplete ? "Play Again" : "Start Game"}
        </Button>
      ) : (
        <Button 
          variant="default"
          size="sm" 
          onClick={onEnd}
        >
          End Game
        </Button>
      )}
    </div>
  );
}
