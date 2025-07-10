import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCcw, Settings, Trophy } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "sonner";

interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

interface PomodoroTimerProps {
  taskTitle?: string;
  onClose?: () => void;
  initialSettings?: Partial<PomodoroSettings>;
}

export function PomodoroTimer({ taskTitle: propTaskTitle, onClose, initialSettings }: PomodoroTimerProps = {}) {
  const userData = useUserData();
  const [settings, setSettings] = useState<PomodoroSettings>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
    ...initialSettings
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);
  const [taskTitle, setTaskTitle] = useState(propTaskTitle || "Focus Session");

  // Get user-type specific settings
  useEffect(() => {
    const userType = userData.userType || 'wellness';
    const defaultSettings = {
      'brain-injury': { workMinutes: 15, shortBreakMinutes: 10, longBreakMinutes: 20, cyclesBeforeLongBreak: 2 },
      'caregiver': { workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cyclesBeforeLongBreak: 3 },
      'cognitive-optimization': { workMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 20, cyclesBeforeLongBreak: 4 },
      'wellness': { workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, cyclesBeforeLongBreak: 4 }
    };
    
    const userSettings = { ...defaultSettings[userType], ...initialSettings };
    setSettings(userSettings);
    setTimeLeft(userSettings.workMinutes * 60);
  }, [userData.userType, initialSettings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            handleTimerComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (isWork) {
      // Work session completed
      const newCompletedCycles = completedCycles + 1;
      setCompletedCycles(newCompletedCycles);
      setTotalWorkTime(prev => prev + settings.workMinutes);
      
      // Determine break type
      const isLongBreak = newCompletedCycles % settings.cyclesBeforeLongBreak === 0;
      const breakMinutes = isLongBreak ? settings.longBreakMinutes : settings.shortBreakMinutes;
      
      setTimeLeft(breakMinutes * 60);
      setIsWork(false);
      
      toast.success(`🎉 Work session complete! Time for a ${isLongBreak ? 'long' : 'short'} break.`, {
        duration: 5000,
      });
    } else {
      // Break completed
      setTimeLeft(settings.workMinutes * 60);
      setIsWork(true);
      
      toast.success("Break time over! Ready for your next focused work session? 💪", {
        duration: 5000,
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isWork ? settings.workMinutes * 60 : settings.shortBreakMinutes * 60);
  };

  const skipSession = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isWork ? settings.workMinutes * 60 : 
                     (completedCycles % settings.cyclesBeforeLongBreak === 0 && completedCycles > 0) ? 
                     settings.longBreakMinutes * 60 : settings.shortBreakMinutes * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-focus-600" />
            {taskTitle}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Badge variant={isWork ? "default" : "secondary"}>
            {isWork ? 'Work' : 'Break'} Session
          </Badge>
          <Badge variant="outline">
            Cycle {Math.floor(completedCycles / settings.cyclesBeforeLongBreak) + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-focus-600 mb-2">
            {formatTime(timeLeft)}
          </div>
          <Progress value={getProgress()} className="w-full h-2" />
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleTimer}
            variant={isActive ? "destructive" : "default"}
            size="lg"
            className="flex-1"
          >
            {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button onClick={skipSession} variant="outline" size="lg">
            <Square className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-focus-50 rounded-lg">
            <div className="text-2xl font-bold text-focus-600">{completedCycles}</div>
            <div className="text-sm text-focus-700">Completed Cycles</div>
          </div>
          <div className="p-3 bg-focus-50 rounded-lg">
            <div className="text-2xl font-bold text-focus-600">{totalWorkTime}</div>
            <div className="text-sm text-focus-700">Minutes Focused</div>
          </div>
        </div>
        
        {/* Settings Preview */}
        <div className="text-center text-sm text-muted-foreground">
          Work: {settings.workMinutes}m • Short Break: {settings.shortBreakMinutes}m • Long Break: {settings.longBreakMinutes}m
        </div>
      </CardContent>
    </Card>
  );
}
