
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, TimerReset } from "lucide-react";

interface PomodoroControlsPanelProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function PomodoroControlsPanel({
  isRunning,
  onPlayPause,
  onReset,
  onSkip
}: PomodoroControlsPanelProps) {
  return (
    <div className="flex gap-2 justify-center">
      <Button 
        variant="outline" 
        size="icon"
        onClick={onPlayPause}
        className="h-10 w-10"
      >
        {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onReset}
        className="h-10 w-10"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onSkip}
        className="h-10 w-10"
      >
        <TimerReset className="h-4 w-4" />
      </Button>
    </div>
  );
}
