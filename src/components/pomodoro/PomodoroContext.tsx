
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { PomodoroSettings, PomodoroState, PomodoroContextType, DEFAULT_SETTINGS } from "./types";
import { FloatingPomodoroTimer } from "./FloatingPomodoroTimer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PomodoroTimer } from "./PomodoroTimer";
import { usePomodoroTimer } from "./usePomodoroTimer";
import { getTimeForMode, playNotificationSound, showWorkCompleteNotification, showBreakCompleteNotification } from "./utils";

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
  
  const { startTimer, stopTimer, pauseTimer, resumeTimer, resetTimer, updateSettings } = 
    usePomodoroTimer(setState, defaultState);
  
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
              playNotificationSound();
            }
            
            showWorkCompleteNotification(prev.settings, isLongBreakDue);
            
            const newTotalSeconds = getTimeForMode(nextMode, prev.settings);
            
            return {
              ...prev,
              mode: nextMode,
              pomodoroCount: newPomodoroCount,
              secondsLeft: newTotalSeconds,
              totalSeconds: newTotalSeconds,
            };
          } else {
            // Break is over, back to work
            showBreakCompleteNotification(prev.settings);
            
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
  }, [state.isActive, state.isRunning]);
  
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
