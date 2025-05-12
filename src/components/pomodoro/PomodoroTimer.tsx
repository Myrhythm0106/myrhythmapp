import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Bell, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PomodoroSettings } from "./types";
import { getTimeForMode, showWorkCompleteNotification, showBreakCompleteNotification } from "./utils";

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  notificationSound: boolean;
  notificationVisual: boolean;
}

export interface PomodoroTimerProps {
  taskTitle?: string;
  onClose?: () => void;
  initialSettings?: Partial<PomodoroSettings>;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  notificationSound: true,
  notificationVisual: true,
};

type TimerMode = "work" | "shortBreak" | "longBreak";

export function PomodoroTimer({ 
  taskTitle, 
  onClose,
  initialSettings = {}
}: PomodoroTimerProps) {
  // Combine default settings with any provided settings
  const [settings, setSettings] = useState<PomodoroSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // Calculate time based on current mode
  const getTimeForMode = useCallback((mode: TimerMode) => {
    if (mode === "work") return settings.workMinutes * 60;
    if (mode === "shortBreak") return settings.shortBreakMinutes * 60;
    return settings.longBreakMinutes * 60;
  }, [settings]);
  
  // Reset timer with new mode
  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setSecondsLeft(getTimeForMode(newMode));
  }, [getTimeForMode]);
  
  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setSecondsLeft(seconds => {
        if (seconds <= 1) {
          clearInterval(interval);
          
          // Handle timer completion based on mode
          if (mode === "work") {
            const newPomodoroCount = pomodoroCount + 1;
            setPomodoroCount(newPomodoroCount);
            
            // Determine if it's time for a long break or short break
            const isLongBreakDue = newPomodoroCount % settings.longBreakInterval === 0;
            const nextMode = isLongBreakDue ? "longBreak" : "shortBreak";
            
            // Show notification
            if (settings.notificationSound) {
              const audio = new Audio("/notification-sound.mp3");
              audio.play().catch(err => console.error("Error playing sound:", err));
            }
            
            if (settings.notificationVisual) {
              toast.success("Work session completed! Time for a break.", {
                description: isLongBreakDue 
                  ? `Take a longer break (${settings.longBreakMinutes} min)` 
                  : `Take a short break (${settings.shortBreakMinutes} min)`,
              });
            }
            
            switchMode(nextMode);
          } else {
            // Break is over, back to work
            if (settings.notificationVisual) {
              toast.info("Break time over! Ready to focus again?", {
                description: `Starting a ${settings.workMinutes} minute work session`,
              });
            }
            switchMode("work");
          }
          
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, mode, pomodoroCount, settings, switchMode]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const totalSeconds = getTimeForMode(mode);
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  
  // Handle play/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  // Handle reset
  const resetTimer = () => {
    setIsRunning(false);
    switchMode(mode); // Reset current mode's time
  };
  
  // Skip to next mode
  const skipToNext = () => {
    let nextMode: TimerMode;
    if (mode === "work") {
      const isLongBreakDue = (pomodoroCount + 1) % settings.longBreakInterval === 0;
      nextMode = isLongBreakDue ? "longBreak" : "shortBreak";
      setPomodoroCount(pomodoroCount + 1);
    } else {
      nextMode = "work";
    }
    switchMode(nextMode);
    setIsRunning(false);
  };
  
  return (
    <Card className="w-full max-w-md shadow-lg border-2 border-primary/20 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Pomodoro Timer
          </div>
          <div>
            <Button
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs"
            >
              {showSettings ? "Close Settings" : "Settings"}
            </Button>
          </div>
        </CardTitle>
        {taskTitle && (
          <p className="text-sm text-muted-foreground">
            Task: {taskTitle}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showSettings ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">Work Duration: {settings.workMinutes} minutes</Label>
              <Slider
                defaultValue={[settings.workMinutes]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, workMinutes: value[0] }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Short Break: {settings.shortBreakMinutes} minutes</Label>
              <Slider
                defaultValue={[settings.shortBreakMinutes]}
                min={1}
                max={15}
                step={1}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, shortBreakMinutes: value[0] }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Long Break: {settings.longBreakMinutes} minutes</Label>
              <Slider
                defaultValue={[settings.longBreakMinutes]}
                min={10}
                max={30}
                step={5}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, longBreakMinutes: value[0] }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Long Break after: {settings.longBreakInterval} sessions</Label>
              <Slider
                defaultValue={[settings.longBreakInterval]}
                min={2}
                max={6}
                step={1}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, longBreakInterval: value[0] }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="notification-sound" className="text-sm">Sound Notification</Label>
              <Switch
                id="notification-sound"
                checked={settings.notificationSound}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notificationSound: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-visual" className="text-sm">Visual Notification</Label>
              <Switch
                id="notification-visual"
                checked={settings.notificationVisual}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notificationVisual: checked }))
                }
              />
            </div>
          </div>
        ) : (
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
        )}
      </CardContent>
      
      <CardFooter className="pt-1">
        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full text-sm"
          >
            Minimize Timer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
