
import { useState, useEffect } from 'react';

export interface UserProgressMetrics {
  sessionsCount: number;
  totalTimeSpent: number; // in minutes
  featuresUsed: string[];
  completedActions: number;
  lastActiveDate: string;
  engagementLevel: 'beginner' | 'intermediate' | 'advanced';
  readinessScore: number; // 0-100
}

export interface UnlockCriteria {
  id: string;
  requiredScore: number;
  requiredActions?: number;
  requiredFeatures?: string[];
  description: string;
}

const UNLOCK_CRITERIA: UnlockCriteria[] = [
  {
    id: 'goals',
    requiredScore: 25,
    requiredActions: 2,
    description: 'Complete 2 daily actions to unlock Goals'
  },
  {
    id: 'brain-games',
    requiredScore: 40,
    requiredFeatures: ['goals'],
    description: 'Use Goals feature to unlock Brain Games'
  },
  {
    id: 'mood-tracking',
    requiredScore: 35,
    requiredActions: 3,
    description: 'Complete 3 actions to unlock Mood Tracking'
  },
  {
    id: 'community',
    requiredScore: 60,
    requiredFeatures: ['goals', 'mood-tracking'],
    description: 'Master basic features to unlock Community'
  },
  {
    id: 'analytics',
    requiredScore: 75,
    requiredActions: 10,
    description: 'Complete 10+ actions to unlock Analytics'
  }
];

export function useUserProgress() {
  const [metrics, setMetrics] = useState<UserProgressMetrics>(() => {
    const saved = localStorage.getItem('myrhythm_user_progress');
    return saved ? JSON.parse(saved) : {
      sessionsCount: 1,
      totalTimeSpent: 0,
      featuresUsed: ['dashboard'],
      completedActions: 0,
      lastActiveDate: new Date().toISOString(),
      engagementLevel: 'beginner',
      readinessScore: 0
    };
  });

  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>(() => {
    const saved = localStorage.getItem('myrhythm_unlocked_features');
    return saved ? JSON.parse(saved) : ['dashboard', 'calendar', 'accountability'];
  });

  // Calculate readiness score based on multiple factors
  const calculateReadinessScore = (currentMetrics: UserProgressMetrics): number => {
    let score = 0;
    
    // Session frequency (0-30 points)
    score += Math.min(currentMetrics.sessionsCount * 3, 30);
    
    // Time engagement (0-25 points)  
    score += Math.min(currentMetrics.totalTimeSpent * 0.5, 25);
    
    // Feature exploration (0-25 points)
    score += Math.min(currentMetrics.featuresUsed.length * 5, 25);
    
    // Action completion (0-20 points)
    score += Math.min(currentMetrics.completedActions * 2, 20);
    
    return Math.min(Math.round(score), 100);
  };

  // Determine engagement level
  const getEngagementLevel = (score: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (score >= 70) return 'advanced';
    if (score >= 35) return 'intermediate';
    return 'beginner';
  };

  // Check which features should be unlocked
  const checkUnlocks = (currentMetrics: UserProgressMetrics, currentUnlocked: string[]) => {
    const newUnlocks: string[] = [];
    
    UNLOCK_CRITERIA.forEach(criteria => {
      if (currentUnlocked.includes(criteria.id)) return;
      
      let shouldUnlock = currentMetrics.readinessScore >= criteria.requiredScore;
      
      if (criteria.requiredActions && currentMetrics.completedActions < criteria.requiredActions) {
        shouldUnlock = false;
      }
      
      if (criteria.requiredFeatures) {
        const hasRequiredFeatures = criteria.requiredFeatures.every(feature => 
          currentUnlocked.includes(feature)
        );
        if (!hasRequiredFeatures) shouldUnlock = false;
      }
      
      if (shouldUnlock) {
        newUnlocks.push(criteria.id);
      }
    });
    
    return newUnlocks;
  };

  // Track feature usage
  const trackFeatureUse = (feature: string) => {
    setMetrics(prev => {
      const updatedMetrics = {
        ...prev,
        featuresUsed: prev.featuresUsed.includes(feature) 
          ? prev.featuresUsed 
          : [...prev.featuresUsed, feature],
        lastActiveDate: new Date().toISOString()
      };
      
      const newScore = calculateReadinessScore(updatedMetrics);
      const finalMetrics = {
        ...updatedMetrics,
        readinessScore: newScore,
        engagementLevel: getEngagementLevel(newScore)
      };
      
      localStorage.setItem('myrhythm_user_progress', JSON.stringify(finalMetrics));
      return finalMetrics;
    });
  };

  // Track completed action
  const trackActionCompletion = () => {
    setMetrics(prev => {
      const updatedMetrics = {
        ...prev,
        completedActions: prev.completedActions + 1,
        lastActiveDate: new Date().toISOString()
      };
      
      const newScore = calculateReadinessScore(updatedMetrics);
      const finalMetrics = {
        ...updatedMetrics,
        readinessScore: newScore,
        engagementLevel: getEngagementLevel(newScore)
      };
      
      localStorage.setItem('myrhythm_user_progress', JSON.stringify(finalMetrics));
      return finalMetrics;
    });
  };

  // Track session time
  const trackTimeSpent = (minutes: number) => {
    setMetrics(prev => {
      const updatedMetrics = {
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + minutes,
        lastActiveDate: new Date().toISOString()
      };
      
      const newScore = calculateReadinessScore(updatedMetrics);
      const finalMetrics = {
        ...updatedMetrics,
        readinessScore: newScore,
        engagementLevel: getEngagementLevel(newScore)
      };
      
      localStorage.setItem('myrhythm_user_progress', JSON.stringify(finalMetrics));
      return finalMetrics;
    });
  };

  // Get next available unlock
  const getNextUnlock = (): UnlockCriteria | null => {
    const availableUnlocks = UNLOCK_CRITERIA.filter(criteria => 
      !unlockedFeatures.includes(criteria.id)
    );
    
    return availableUnlocks.length > 0 ? availableUnlocks[0] : null;
  };

  // Check for new unlocks on metrics change
  useEffect(() => {
    const newUnlocks = checkUnlocks(metrics, unlockedFeatures);
    if (newUnlocks.length > 0) {
      const updatedUnlocked = [...unlockedFeatures, ...newUnlocks];
      setUnlockedFeatures(updatedUnlocked);
      localStorage.setItem('myrhythm_unlocked_features', JSON.stringify(updatedUnlocked));
    }
  }, [metrics.readinessScore, metrics.completedActions]);

  return {
    metrics,
    unlockedFeatures,
    trackFeatureUse,
    trackActionCompletion,
    trackTimeSpent,
    getNextUnlock,
    checkUnlocks: () => checkUnlocks(metrics, unlockedFeatures)
  };
}
