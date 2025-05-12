
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Maximize2, Pause, Play } from "lucide-react";

interface FloatingPomodoroTimerProps {
  seconds: number;
  totalSeconds: number;
  mode: "work" | "shortBreak" | "longBreak";
  isRunning: boolean;
  taskTitle: string;
  onTogglePlay: () => void;
  onExpand: () => void;
}

export function FloatingPomodoroTimer({
  seconds,
  totalSeconds,
  mode,
  isRunning,
  taskTitle,
  onTogglePlay,
  onExpand
}: FloatingPomodoroTimerProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  
  const getModeColor = () => {
    if (mode === "work") return "bg-primary";
    if (mode === "shortBreak") return "bg-green-500";
    return "bg-blue-500";
  };
  
  return (
    <Card className="fixed bottom-4 right-4 p-2 shadow-lg border-2 border-primary/20 w-60 z-50">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Timer className="h-4 w-4 mr-1 text-primary" />
            <span className="text-sm font-medium truncate max-w-[120px]">{taskTitle}</span>
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onTogglePlay} className="h-6 w-6">
              {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onExpand} className="h-6 w-6">
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{formatTime(seconds)}</span>
          <span className="text-xs text-muted-foreground capitalize">{mode.replace(/([A-Z])/g, " $1")}</span>
        </div>
        
        <Progress value={progress} className={`h-1 w-full mt-1 ${getModeColor()}`} />
      </div>
    </Card>
  );
}
