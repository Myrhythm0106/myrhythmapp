import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Priorities {
  p1: string;
  p2: string;
  p3: string;
}

export interface PriorityProgress {
  completed: number;
  total: number;
  percentage: number;
}

export type TimeScope = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PriorityContextType {
  // Priority states for each scope
  dailyPriorities: Priorities;
  weeklyPriorities: Priorities;
  monthlyPriorities: Priorities;
  yearlyPriorities: Priorities;
  
  // Update functions
  updateDailyPriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  updateWeeklyPriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  updateMonthlyPriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  updateYearlyPriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  
  // Progress tracking
  getDailyProgress: () => PriorityProgress;
  getWeeklyProgress: () => PriorityProgress;
  getMonthlyProgress: () => PriorityProgress;
  getYearlyProgress: () => PriorityProgress;
  
  // Helper functions
  getPrioritiesByScope: (scope: TimeScope) => Priorities;
  getParentPriorities: (scope: 'daily' | 'weekly' | 'monthly') => Priorities;
  hasAnyPriorities: (priorities: Priorities) => boolean;
}

const PriorityContext = createContext<PriorityContextType | undefined>(undefined);

export function PriorityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [dailyPriorities, setDailyPriorities] = useState<Priorities>({ p1: '', p2: '', p3: '' });
  const [weeklyPriorities, setWeeklyPriorities] = useState<Priorities>({ p1: '', p2: '', p3: '' });
  const [monthlyPriorities, setMonthlyPriorities] = useState<Priorities>({ p1: '', p2: '', p3: '' });
  const [yearlyPriorities, setYearlyPriorities] = useState<Priorities>({ p1: '', p2: '', p3: '' });

  // Load priorities from localStorage on mount
  useEffect(() => {
    if (user) {
      const storageKey = `priorities_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDailyPriorities(parsed.daily || { p1: '', p2: '', p3: '' });
          setWeeklyPriorities(parsed.weekly || { p1: '', p2: '', p3: '' });
          setMonthlyPriorities(parsed.monthly || { p1: '', p2: '', p3: '' });
          setYearlyPriorities(parsed.yearly || { p1: '', p2: '', p3: '' });
        } catch (error) {
          console.error('Error loading priorities:', error);
        }
      }
    }
  }, [user]);

  // Save priorities to localStorage whenever they change
  useEffect(() => {
    if (user) {
      const storageKey = `priorities_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        daily: dailyPriorities,
        weekly: weeklyPriorities,
        monthly: monthlyPriorities,
        yearly: yearlyPriorities,
        lastUpdated: Date.now()
      }));
    }
  }, [user, dailyPriorities, weeklyPriorities, monthlyPriorities, yearlyPriorities]);

  const updateDailyPriorities = (field: 'p1' | 'p2' | 'p3', value: string) => {
    setDailyPriorities(prev => ({ ...prev, [field]: value }));
  };

  const updateWeeklyPriorities = (field: 'p1' | 'p2' | 'p3', value: string) => {
    setWeeklyPriorities(prev => ({ ...prev, [field]: value }));
  };

  const updateMonthlyPriorities = (field: 'p1' | 'p2' | 'p3', value: string) => {
    setMonthlyPriorities(prev => ({ ...prev, [field]: value }));
  };

  const updateYearlyPriorities = (field: 'p1' | 'p2' | 'p3', value: string) => {
    setYearlyPriorities(prev => ({ ...prev, [field]: value }));
  };

  const hasAnyPriorities = (priorities: Priorities): boolean => {
    return !!(priorities.p1 || priorities.p2 || priorities.p3);
  };

  const getParentPriorities = (scope: 'daily' | 'weekly' | 'monthly'): Priorities => {
    if (scope === 'daily' && hasAnyPriorities(weeklyPriorities)) return weeklyPriorities;
    if (scope === 'weekly' && hasAnyPriorities(monthlyPriorities)) return monthlyPriorities;
    if (scope === 'monthly' && hasAnyPriorities(yearlyPriorities)) return yearlyPriorities;
    return { p1: '', p2: '', p3: '' };
  };

  const getPrioritiesByScope = (scope: TimeScope): Priorities => {
    switch (scope) {
      case 'daily': return dailyPriorities;
      case 'weekly': return weeklyPriorities;
      case 'monthly': return monthlyPriorities;
      case 'yearly': return yearlyPriorities;
      default: return { p1: '', p2: '', p3: '' };
    }
  };

  // Mock progress calculation (in production, would be based on completed actions)
  const calculateProgress = (priorities: Priorities): PriorityProgress => {
    const total = [priorities.p1, priorities.p2, priorities.p3].filter(p => p.trim()).length;
    const completed = Math.floor(total * Math.random() * 0.7); // Mock completion
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const getDailyProgress = () => calculateProgress(dailyPriorities);
  const getWeeklyProgress = () => calculateProgress(weeklyPriorities);
  const getMonthlyProgress = () => calculateProgress(monthlyPriorities);
  const getYearlyProgress = () => calculateProgress(yearlyPriorities);

  const value: PriorityContextType = {
    dailyPriorities,
    weeklyPriorities,
    monthlyPriorities,
    yearlyPriorities,
    updateDailyPriorities,
    updateWeeklyPriorities,
    updateMonthlyPriorities,
    updateYearlyPriorities,
    getDailyProgress,
    getWeeklyProgress,
    getMonthlyProgress,
    getYearlyProgress,
    getPrioritiesByScope,
    getParentPriorities,
    hasAnyPriorities
  };

  return (
    <PriorityContext.Provider value={value}>
      {children}
    </PriorityContext.Provider>
  );
}

export function usePriorities() {
  const context = useContext(PriorityContext);
  if (context === undefined) {
    throw new Error('usePriorities must be used within a PriorityProvider');
  }
  return context;
}
