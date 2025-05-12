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
import { getTimeForMode } from "./utils";
import { PomodoroTimerDisplay } from "./PomodoroTimerDisplay";
import { PomodoroControlsPanel } from "./PomodoroControlsPanel";
import { PomodoroSettingsPanel } from "./PomodoroSettingsPanel";

export interface PomodoroTimerProps {
  taskTitle?: string;
  onClose?: () => void;
  initialSettings?: Partial<PomodoroSettings>;
}

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
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // Calculate time based on current mode
  const getTimeForCurrentMode = useCallback((mode: "work" | "shortBreak" | "longBreak") => {
    if (mode === "work") return settings.workMinutes * 60;
    if (mode === "shortBreak") return settings.shortBreakMinutes * 60;
    return settings.longBreakMinutes * 60;
  }, [settings]);
  
  // Reset timer with new mode
  const switchMode = useCallback((newMode: "work" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setSecondsLeft(getTimeForCurrentMode(newMode));
  }, [getTimeForCurrentMode]);
  
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
  const totalSeconds = getTimeForCurrentMode(mode);
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
    let nextMode: "work" | "shortBreak" | "longBreak";
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
          <PomodoroSettingsPanel settings={settings} setSettings={setSettings} />
        ) : (
          <PomodoroTimerDisplay 
            mode={mode} 
            secondsLeft={secondsLeft}
            progress={progress}
            formatTime={formatTime}
            pomodoroCount={pomodoroCount}
            settings={settings}
            isRunning={isRunning}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            skipToNext={skipToNext}
          />
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

// Keep the DEFAULT_SETTINGS export to avoid breaking changes
export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  notificationSound: true,
  notificationVisual: true,
};
