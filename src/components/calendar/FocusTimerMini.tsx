import React, { useState, useEffect } from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, Square, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusTimerMiniProps {
  onOpenFullTimer: () => void;
}

export function FocusTimerMini({ onOpenFullTimer }: FocusTimerMiniProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session complete
      setIsRunning(false);
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        setTimeLeft(25 * 60); // Back to 25 minute session
        setIsBreak(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <SurfaceCard variant="glass" padding="lg" className="h-full">
      <div className="flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isBreak ? (
              <Coffee className="h-5 w-5 text-sunrise-amber-600" />
            ) : (
              <Timer className="h-5 w-5 text-brain-health-600" />
            )}
            <h3 className="font-semibold text-foreground">
              {isBreak ? "Break Time" : "Focus Session"}
            </h3>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              isBreak 
                ? "bg-sunrise-amber-100 text-sunrise-amber-700"
                : "bg-brain-health-100 text-brain-health-700"
            )}
          >
            {completedSessions} completed
          </Badge>
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className={cn(
              "text-4xl font-mono font-bold",
              isBreak 
                ? "text-sunrise-amber-700" 
                : "text-brain-health-700"
            )}>
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Ring */}
            <div className="absolute -inset-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={cn(
                    "transition-all duration-1000",
                    isBreak 
                      ? "text-sunrise-amber-500" 
                      : "text-brain-health-500"
                  )}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground mb-4">
            {isBreak 
              ? "Take a moment to recharge your mind"
              : "Stay focused and let your brain work its magic"
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={isRunning ? handlePause : handleStart}
            className={cn(
              "flex-1",
              isRunning 
                ? "border-sunrise-amber-200 hover:bg-sunrise-amber-50"
                : "border-brain-health-200 hover:bg-brain-health-50"
            )}
          >
            {isRunning ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            className="px-3"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Full Timer Link */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenFullTimer}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Open full timer
        </Button>
      </div>
    </SurfaceCard>
  );
}