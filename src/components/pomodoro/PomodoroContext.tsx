
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PomodoroSettings } from "./PomodoroTimer";
import { FloatingPomodoroTimer } from "./FloatingPomodoroTimer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PomodoroTimer } from "./PomodoroTimer";

export interface PomodoroState {
  isActive: boolean;
  isRunning: boolean;
  mode: "work" | "shortBreak" | "longBreak";
  secondsLeft: number;
  totalSeconds: number;
  taskTitle: string;
  pomodoroCount: number;
  settings: PomodoroSettings;
}

interface PomodoroContextType {
  state: PomodoroState;
  startTimer: (taskTitle: string, customSettings?: Partial<PomodoroSettings>) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  notificationSound: true,
  notificationVisual: true,
};

const defaultState: PomodoroState = {
  isActive: false,
  isRunning: false,
  mode: "work",
  secondsLeft: DEFAULT_SETTINGS.workMinutes * 60,
  totalSeconds: DEFAULT_SETTINGS.workMinutes * 60,
  taskTitle: "",
  pomodoroCount: 0,
  settings: DEFAULT_SETTINGS,
};

const PomodoroContext = createContext<PomodoroContextType | null>(null);

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider");
  }
  return context;
};

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PomodoroState>(defaultState);
  const [showFullTimer, setShowFullTimer] = useState(false);
  
  // Calculate time based on current mode
  const getTimeForMode = useCallback((mode: "work" | "shortBreak" | "longBreak", settings: PomodoroSettings) => {
    if (mode === "work") return settings.workMinutes * 60;
    if (mode === "shortBreak") return settings.shortBreakMinutes * 60;
    return settings.longBreakMinutes * 60;
  }, []);
  
  // Reset timer with new mode
  const switchMode = useCallback((newMode: "work" | "shortBreak" | "longBreak", settings: PomodoroSettings) => {
    const newTotalSeconds = getTimeForMode(newMode, settings);
    setState(prev => ({
      ...prev,
      mode: newMode,
      secondsLeft: newTotalSeconds,
      totalSeconds: newTotalSeconds,
    }));
  }, [getTimeForMode]);
  
  // Timer logic
  useEffect(() => {
    if (!state.isActive || !state.isRunning) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.secondsLeft <= 1) {
          clearInterval(interval);
          
          // Handle timer completion based on mode
          if (prev.mode === "work") {
            const newPomodoroCount = prev.pomodoroCount + 1;
            
            // Determine if it's time for a long break or short break
            const isLongBreakDue = newPomodoroCount % prev.settings.longBreakInterval === 0;
            const nextMode = isLongBreakDue ? "longBreak" : "shortBreak";
            
            // Show notification
            if (prev.settings.notificationSound) {
              const audio = new Audio("/notification-sound.mp3");
              audio.play().catch(err => console.error("Error playing sound:", err));
            }
            
            if (prev.settings.notificationVisual) {
              toast.success("Work session completed! Time for a break.", {
                description: isLongBreakDue 
                  ? `Take a longer break (${prev.settings.longBreakMinutes} min)` 
                  : `Take a short break (${prev.settings.shortBreakMinutes} min)`,
              });
            }
            
            const newTotalSeconds = getTimeForMode(
              nextMode, 
              prev.settings
            );
            
            return {
              ...prev,
              mode: nextMode,
              pomodoroCount: newPomodoroCount,
              secondsLeft: newTotalSeconds,
              totalSeconds: newTotalSeconds,
            };
          } else {
            // Break is over, back to work
            if (prev.settings.notificationVisual) {
              toast.info("Break time over! Ready to focus again?", {
                description: `Starting a ${prev.settings.workMinutes} minute work session`,
              });
            }
            
            const newTotalSeconds = getTimeForMode("work", prev.settings);
            
            return {
              ...prev,
              mode: "work",
              secondsLeft: newTotalSeconds,
              totalSeconds: newTotalSeconds,
            };
          }
        }
        
        return {
          ...prev,
          secondsLeft: prev.secondsLeft - 1
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.isActive, state.isRunning, getTimeForMode]);
  
  const startTimer = useCallback((taskTitle: string, customSettings?: Partial<PomodoroSettings>) => {
    const newSettings = { ...DEFAULT_SETTINGS, ...customSettings };
    const totalSeconds = newSettings.workMinutes * 60;
    
    setState({
      isActive: true,
      isRunning: true,
      mode: "work",
      secondsLeft: totalSeconds,
      totalSeconds,
      taskTitle,
      pomodoroCount: 0,
      settings: newSettings,
    });
    
    toast.success(`Pomodoro timer started for: ${taskTitle}`, {
      description: `Focus for ${newSettings.workMinutes} minutes`,
    });
  }, []);
  
  const stopTimer = useCallback(() => {
    setState(defaultState);
    toast.info("Pomodoro timer stopped");
  }, []);
  
  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);
  
  const resumeTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);
  
  const resetTimer = useCallback(() => {
    setState(prev => {
      const totalSeconds = getTimeForMode(prev.mode, prev.settings);
      return {
        ...prev,
        secondsLeft: totalSeconds,
        totalSeconds,
        isRunning: false,
      };
    });
  }, [getTimeForMode]);
  
  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);
  
  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);
  
  const value = {
    state,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    updateSettings,
  };
  
  return (
    <PomodoroContext.Provider value={value}>
      {children}
      
      {/* Floating timer */}
      {state.isActive && !showFullTimer && (
        <FloatingPomodoroTimer
          seconds={state.secondsLeft}
          totalSeconds={state.totalSeconds}
          mode={state.mode}
          isRunning={state.isRunning}
          taskTitle={state.taskTitle}
          onTogglePlay={togglePlay}
          onExpand={() => setShowFullTimer(true)}
        />
      )}
      
      {/* Full timer dialog */}
      <Dialog open={showFullTimer} onOpenChange={setShowFullTimer}>
        <DialogContent className="sm:max-w-md">
          <PomodoroTimer
            taskTitle={state.taskTitle}
            onClose={() => setShowFullTimer(false)}
            initialSettings={state.settings}
          />
        </DialogContent>
      </Dialog>
    </PomodoroContext.Provider>
  );
};
