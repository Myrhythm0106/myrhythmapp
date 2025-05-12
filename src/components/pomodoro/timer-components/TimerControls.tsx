
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, TimerReset } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
}

export function TimerControls({
  isRunning,
  toggleTimer,
  resetTimer,
  skipToNext
}: TimerControlsProps) {
  return (
    <div className="flex gap-2 justify-center">
      <Button 
        variant="outline" 
        size="icon"
        onClick={toggleTimer}
        className="h-10 w-10"
      >
        {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={resetTimer}
        className="h-10 w-10"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={skipToNext}
        className="h-10 w-10"
      >
        <TimerReset className="h-4 w-4" />
      </Button>
    </div>
  );
}
