
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PomodoroContextType {
  isRunning: boolean;
  timeLeft: number;
  currentSession: 'work' | 'break';
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setCurrentSession('work');
  };

  return (
    <PomodoroContext.Provider value={{
      isRunning,
      timeLeft,
      currentSession,
      startTimer,
      pauseTimer,
      resetTimer
    }}>
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
