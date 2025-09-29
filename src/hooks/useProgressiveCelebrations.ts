import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface CelebrationState {
  completedMilestones: string[];
  pendingCelebration?: {
    milestone: string;
    timestamp: number;
  };
}

type MilestoneType = 'first_recording' | 'first_action' | 'first_schedule' | 'week_complete' | 'month_complete';

export function useProgressiveCelebrations() {
  const { user } = useAuth();
  const [celebrationState, setCelebrationState] = useState<CelebrationState>({
    completedMilestones: []
  });
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneType | null>(null);

  // Load celebration state from localStorage
  useEffect(() => {
    if (user) {
      const savedState = localStorage.getItem(`celebrations_${user.id}`);
      if (savedState) {
        try {
          setCelebrationState(JSON.parse(savedState));
        } catch (error) {
          console.error('Error loading celebration state:', error);
        }
      }
    }
  }, [user]);

  // Save celebration state to localStorage
  const saveCelebrationState = useCallback((state: CelebrationState) => {
    if (user) {
      localStorage.setItem(`celebrations_${user.id}`, JSON.stringify(state));
      setCelebrationState(state);
    }
  }, [user]);

  // Check if milestone should be celebrated
  const checkMilestone = useCallback((milestone: MilestoneType): boolean => {
    if (!user || celebrationState.completedMilestones.includes(milestone)) {
      return false;
    }

    // Trigger celebration
    setCurrentMilestone(milestone);
    setShowCelebration(true);
    
    // Mark as completed
    const updatedState = {
      ...celebrationState,
      completedMilestones: [...celebrationState.completedMilestones, milestone],
      pendingCelebration: {
        milestone,
        timestamp: Date.now()
      }
    };
    
    saveCelebrationState(updatedState);
    return true;
  }, [user, celebrationState, saveCelebrationState]);

  // Mark celebration as viewed
  const completeCelebration = useCallback(() => {
    setShowCelebration(false);
    setCurrentMilestone(null);
    
    const updatedState = {
      ...celebrationState,
      pendingCelebration: undefined
    };
    
    saveCelebrationState(updatedState);
  }, [celebrationState, saveCelebrationState]);

  // Specific milestone triggers
  const celebrateFirstRecording = useCallback(() => {
    checkMilestone('first_recording');
  }, [checkMilestone]);

  const celebrateFirstAction = useCallback(() => {
    checkMilestone('first_action');
  }, [checkMilestone]);

  const celebrateFirstSchedule = useCallback(() => {
    checkMilestone('first_schedule');
  }, [checkMilestone]);

  const celebrateWeekComplete = useCallback(() => {
    // Check if user has been active for a week
    const firstMilestone = celebrationState.completedMilestones[0];
    if (firstMilestone) {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      // This would need more sophisticated tracking in a real app
      checkMilestone('week_complete');
    }
  }, [checkMilestone, celebrationState]);

  const celebrateMonthComplete = useCallback(() => {
    // Check if user has been active for a month
    const firstMilestone = celebrationState.completedMilestones[0];
    if (firstMilestone) {
      const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      // This would need more sophisticated tracking in a real app
      checkMilestone('month_complete');
    }
  }, [checkMilestone, celebrationState]);

  // Get celebration progress
  const getProgress = useCallback(() => {
    const totalMilestones = 5; // Total number of milestone types
    const completed = celebrationState.completedMilestones.length;
    return {
      completed,
      total: totalMilestones,
      percentage: Math.round((completed / totalMilestones) * 100)
    };
  }, [celebrationState.completedMilestones]);

  return {
    showCelebration,
    currentMilestone,
    completeCelebration,
    celebrateFirstRecording,
    celebrateFirstAction,
    celebrateFirstSchedule,
    celebrateWeekComplete,
    celebrateMonthComplete,
    getProgress,
    completedMilestones: celebrationState.completedMilestones
  };
}