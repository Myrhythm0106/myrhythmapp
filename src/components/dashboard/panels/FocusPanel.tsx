import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Coffee, Brain, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FocusPanel() {
  const { filters } = useDashboard();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const currentSessionTime = isBreak ? breakTime : focusTime;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            if (isBreak) {
              setIsBreak(false);
              setTimeLeft(focusTime);
            } else {
              setSessionsCompleted(prev => prev + 1);
              setIsBreak(true);
              setTimeLeft(breakTime);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentSessionTime - timeLeft) / currentSessionTime) * 100;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(focusTime);
    setIsBreak(false);
  };

  const getEnergyLevel = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 10) return { level: 'High', color: 'memory-emerald', icon: Brain };
    if (hour >= 11 && hour <= 14) return { level: 'Peak', color: 'brain-health', icon: Brain };
    if (hour >= 15 && hour <= 18) return { level: 'Good', color: 'clarity-teal', icon: Timer };
    return { level: 'Low', color: 'sunrise-amber', icon: Coffee };
  };

  const energy = getEnergyLevel();

  return (
    <div className="h-full space-y-4">
      {/* Energy Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <energy.icon className={`h-4 w-4 text-${energy.color}-500`} />
          <h4 className="font-medium text-sm">Focus & Energy</h4>
        </div>
        <Badge 
          variant="secondary"
          className={cn("text-xs", `bg-${energy.color}-100 text-${energy.color}-700`)}
        >
          {energy.level}
        </Badge>
      </div>

      {/* Pomodoro Timer */}
      <div className="space-y-3">
        <div className="text-center">
          <div className={cn(
            "text-2xl font-mono font-bold mb-2",
            isBreak ? "text-clarity-teal-600" : "text-brain-health-600"
          )}>
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className={cn(
              "h-2 mb-2",
              isBreak ? "[&>div]:bg-clarity-teal-500" : "[&>div]:bg-brain-health-500"
            )}
          />
          
          <p className="text-sm text-muted-foreground">
            {isBreak ? '☕ Break Time' : '🧠 Focus Session'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <Button
              size="sm"
              onClick={handleStart}
              className={cn(
                "text-xs",
                isBreak ? "bg-clarity-teal-500 hover:bg-clarity-teal-600" : "bg-brain-health-500 hover:bg-brain-health-600"
              )}
            >
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              className="text-xs"
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
            className="text-xs"
          >
            <Square className="h-3 w-3 mr-1" />
            Stop
          </Button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="pt-3 border-t border-border/30">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 rounded-md bg-memory-emerald-50 border border-memory-emerald-200/60">
            <div className="text-lg font-semibold text-memory-emerald-700">
              {sessionsCompleted}
            </div>
            <div className="text-xs text-memory-emerald-600">Sessions</div>
          </div>
          <div className="p-2 rounded-md bg-brain-health-50 border border-brain-health-200/60">
            <div className="text-lg font-semibold text-brain-health-700">
              {Math.round(sessionsCompleted * 0.42)}h
            </div>
            <div className="text-xs text-brain-health-600">Focus Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}