
import { useCallback } from "react";
import { toast } from "sonner";
import { PomodoroSettings, PomodoroState } from "./types";
import { getTimeForMode } from "./utils";

export const usePomodoroTimer = (
  setState: React.Dispatch<React.SetStateAction<PomodoroState>>,
  defaultState: PomodoroState
) => {
  const startTimer = useCallback((taskTitle: string, customSettings?: Partial<PomodoroSettings>) => {
    const newSettings = { ...defaultState.settings, ...customSettings };
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
  }, [defaultState.settings, setState]);
  
  const stopTimer = useCallback(() => {
    setState(defaultState);
    toast.info("Pomodoro timer stopped");
  }, [defaultState, setState]);
  
  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, [setState]);
  
  const resumeTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, [setState]);
  
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
  }, [setState]);
  
  const updateSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, [setState]);

  return {
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    updateSettings
  };
};
