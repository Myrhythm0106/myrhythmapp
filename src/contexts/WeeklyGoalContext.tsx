import React, { createContext, useContext, useState } from 'react';

interface WeeklyGoal {
  id: string;
  title: string;
  theme: string;
  category: 'memory' | 'rhythm' | 'health' | 'connections';
  targetDate: Date;
  progress: number;
}

interface WeeklyGoalContextType {
  currentGoal: WeeklyGoal | null;
  setCurrentGoal: (goal: WeeklyGoal | null) => void;
  goalProgress: number;
  updateProgress: (progress: number) => void;
}

const WeeklyGoalContext = createContext<WeeklyGoalContextType | undefined>(undefined);

const DEFAULT_GOALS: WeeklyGoal[] = [
  {
    id: '1',
    title: 'Strengthen Daily Memory',
    theme: 'Memory Enhancement',
    category: 'memory',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 35
  },
  {
    id: '2',
    title: 'Build My Rhythm',
    theme: 'Consistent Routines',
    category: 'rhythm',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 60
  },
  {
    id: '3',
    title: 'Focus on Brain Health',
    theme: 'Cognitive Wellness',
    category: 'health',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 40
  },
  {
    id: '4',
    title: 'Strengthen Support Circle',
    theme: 'Meaningful Connections',
    category: 'connections',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 25
  }
];

export function WeeklyGoalProvider({ children }: { children: React.ReactNode }) {
  const [currentGoal, setCurrentGoal] = useState<WeeklyGoal | null>(DEFAULT_GOALS[0]);
  const [goalProgress, setGoalProgress] = useState(currentGoal?.progress || 0);

  const updateProgress = (progress: number) => {
    setGoalProgress(progress);
    if (currentGoal) {
      setCurrentGoal({ ...currentGoal, progress });
    }
  };

  return (
    <WeeklyGoalContext.Provider
      value={{
        currentGoal,
        setCurrentGoal,
        goalProgress,
        updateProgress
      }}
    >
      {children}
    </WeeklyGoalContext.Provider>
  );
}

export function useWeeklyGoal() {
  const context = useContext(WeeklyGoalContext);
  if (context === undefined) {
    throw new Error('useWeeklyGoal must be used within a WeeklyGoalProvider');
  }
  return context;
}

export { DEFAULT_GOALS };