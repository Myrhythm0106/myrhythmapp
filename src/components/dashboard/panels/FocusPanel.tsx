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
  const [sessionsCompleted, setSessionsCompleted] = useState(2);

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
    if (hour >= 6 && hour <= 10) return { 
      level: 'Peak Performance', 
      color: 'memory-emerald', 
      icon: Brain, 
      emoji: '🚀',
      message: 'Prime time for deep work'
    };
    if (hour >= 11 && hour <= 14) return { 
      level: 'High Focus', 
      color: 'brain-health', 
      icon: Brain, 
      emoji: '🧠',
      message: 'Optimal cognitive state'
    };
    if (hour >= 15 && hour <= 18) return { 
      level: 'Steady Flow', 
      color: 'clarity-teal', 
      icon: Timer, 
      emoji: '⚡',
      message: 'Good for structured tasks'
    };
    return { 
      level: 'Gentle Mode', 
      color: 'sunrise-amber', 
      icon: Coffee, 
      emoji: '🌅',
      message: 'Perfect for reflection'
    };
  };

  const energy = getEnergyLevel();

  return (
    <div className="h-full space-y-5 relative overflow-hidden">
      {/* Energy & Focus Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center neural-pulse",
            `bg-gradient-to-br from-${energy.color}-500/20 to-brain-health-500/20`
          )}>
            <energy.icon className={`h-5 w-5 text-${energy.color}-600`} />
          </div>
          <div>
            <h4 className="font-semibold text-sm therapeutic-accent">Energy State</h4>
            <p className="text-xs text-muted-foreground/80">{energy.message}</p>
          </div>
        </div>
        
        <div className={cn(
          "relative p-3 rounded-xl border neural-pathway-effect",
          `bg-gradient-to-br from-${energy.color}-50/80 to-brain-health-50/40`,
          `border-${energy.color}-200/60`
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="energy">
                {energy.emoji}
              </span>
              <span className={cn("font-semibold text-sm", `text-${energy.color}-700`)}>
                {energy.level}
              </span>
            </div>
            <Badge 
              variant="secondary"
              className={cn("text-xs border", `bg-${energy.color}-100/80 text-${energy.color}-700 border-${energy.color}-200`)}
            >
              Now Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-brain-health-400 to-clarity-teal-400" />
          <h4 className="font-semibold text-sm therapeutic-accent">
            {isBreak ? 'Restoration Mode' : 'Deep Focus Session'}
          </h4>
        </div>
        
        <div className={cn(
          "relative p-6 rounded-xl border neural-pathway-effect hover-scale transition-all duration-300 text-center",
          isBreak 
            ? "bg-gradient-to-br from-clarity-teal-50/80 to-brain-health-50/40 border-clarity-teal-200/60"
            : "bg-gradient-to-br from-brain-health-50/80 to-memory-emerald-50/40 border-brain-health-200/60"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
          <div className="relative space-y-4">
            {/* Timer Display */}
            <div className={cn(
              "text-4xl font-mono font-bold therapeutic-accent neural-pulse",
              isRunning && "animate-pulse"
            )}>
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-brain-health-100"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className={cn(
                    "transition-all duration-1000",
                    isBreak ? "text-clarity-teal-500" : "text-brain-health-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl" role="img">
                  {isBreak ? '☕' : '🧠'}
                </span>
              </div>
            </div>
            
            <p className={cn(
              "text-sm font-medium",
              isBreak ? "text-clarity-teal-600" : "text-brain-health-600"
            )}>
              {isBreak ? 'Recharge & Restore' : 'Channel Your Focus'}
            </p>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  size="sm"
                  onClick={handleStart}
                  className={cn(
                    "therapeutic-button px-6",
                    isBreak && "bg-clarity-teal-500 hover:bg-clarity-teal-600"
                  )}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isBreak ? 'Begin Rest' : 'Start Focus'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePause}
                  className="px-6 border-2 hover:bg-white/80"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStop}
                className="px-4 hover:bg-white/60"
              >
                <Square className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Achievement */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-memory-emerald-400 to-sunrise-amber-400" />
          <h4 className="font-semibold text-sm therapeutic-accent">Today's Victories</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-memory-emerald-50/80 to-brain-health-50/40 border border-memory-emerald-200/60 text-center neural-pathway-effect hover-scale transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative">
              <div className="text-2xl font-bold text-memory-emerald-700 neural-pulse">
                {sessionsCompleted}
              </div>
              <div className="text-xs font-medium text-memory-emerald-600">
                Focus Sessions
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                🍅 Pomodoros
              </div>
            </div>
          </div>
          
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-brain-health-50/80 to-clarity-teal-50/40 border border-brain-health-200/60 text-center neural-pathway-effect hover-scale transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative">
              <div className="text-2xl font-bold text-brain-health-700 neural-pulse">
                {Math.round(sessionsCompleted * 0.42)}h
              </div>
              <div className="text-xs font-medium text-brain-health-600">
                Deep Work
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                ⏱️ Total Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating motivation element */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <div className="text-3xl animate-pulse">🎯</div>
      </div>
    </div>
  );
}