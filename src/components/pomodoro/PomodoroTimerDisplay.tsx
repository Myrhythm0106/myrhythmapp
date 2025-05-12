
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, TimerReset } from "lucide-react";
import { PomodoroSettings } from "./types";

interface PomodoroTimerDisplayProps {
  mode: "work" | "shortBreak" | "longBreak";
  secondsLeft: number;
  progress: number;
  formatTime: (seconds: number) => string;
  pomodoroCount: number;
  settings: PomodoroSettings;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
}

export function PomodoroTimerDisplay({
  mode,
  secondsLeft,
  progress,
  formatTime,
  pomodoroCount,
  settings,
  isRunning,
  toggleTimer,
  resetTimer,
  skipToNext
}: PomodoroTimerDisplayProps) {
  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      <Badge variant={mode === "work" ? "default" : "secondary"} className="px-3 py-1">
        {mode === "work" ? "Work Session" : mode === "shortBreak" ? "Short Break" : "Long Break"}
      </Badge>
      
      <div className="text-4xl font-bold text-center">
        {formatTime(secondsLeft)}
      </div>
      
      <Progress value={progress} className="h-2 w-full" />
      
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">
          Pomodoros: {pomodoroCount}
        </span>
        {mode === "longBreak" && (
          <Badge variant="outline" className="text-xs">
            Long Break #{Math.floor(pomodoroCount / settings.longBreakInterval)}
          </Badge>
        )}
      </div>
      
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
    </div>
  );
}
