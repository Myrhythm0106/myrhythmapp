import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useBrainHealthyPrefs } from '@/hooks/useBrainHealthyPrefs';
import { getPomodoroPreset, POMODORO_PRESETS, PomodoroPresetConfig } from '@/launch/scheduling/defaults';

interface PomodoroContextType {
  isRunning: boolean;
  timeLeft: number;
  currentSession: 'work' | 'break';
  preset: PomodoroPresetConfig;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const FALLBACK = POMODORO_PRESETS[0]; // Pomodoro Classic

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { prefs } = useBrainHealthyPrefs();
  const preset = useMemo(
    () => getPomodoroPreset(prefs.pomodoro_preset) ?? FALLBACK,
    [prefs.pomodoro_preset],
  );

  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(preset.workMinutes * 60);

  // Reset the timer whenever the preset changes and the timer isn't running.
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(
        currentSession === 'work'
          ? preset.workMinutes * 60
          : preset.shortBreakMinutes * 60,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset.value]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setCurrentSession('work');
    setTimeLeft(preset.workMinutes * 60);
  };

  return (
    <PomodoroContext.Provider
      value={{ isRunning, timeLeft, currentSession, preset, startTimer, pauseTimer, resetTimer }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}
