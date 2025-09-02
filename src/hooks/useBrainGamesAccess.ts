import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState, useEffect } from 'react';

export interface BrainGameAccessLevel {
  gameIds: string[];
  name: string;
  description: string;
}

export interface BrainGamesAccessConfig {
  canPlayGame: (gameId: string) => boolean;
  canUseDifficulty: (difficulty: 'Low' | 'Medium' | 'High') => boolean;
  getDailyGamesRemaining: () => number;
  getAccessLevel: () => 'none' | 'basic' | 'intermediate' | 'full';
  getAvailableGames: () => BrainGameAccessLevel[];
  hasAdvancedAnalytics: () => boolean;
  hasPersonalizedTraining: () => boolean;
  getRequiredTierForGame: (gameId: string) => 'starter' | 'smart_pro' | 'family_smart' | null;
  getRequiredTierForDifficulty: (difficulty: 'Low' | 'Medium' | 'High') => 'starter' | 'smart_pro' | null;
}

// Track daily game usage (in real app, this would be in backend/database)
let dailyGameCount = 0;
let lastResetDate = new Date().toDateString();

export function useBrainGamesAccess(): BrainGamesAccessConfig {
  const { features, tier } = useSubscription();
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);

  // Reset daily counter if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      dailyGameCount = 0;
      lastResetDate = today;
      setGamesPlayedToday(0);
    } else {
      setGamesPlayedToday(dailyGameCount);
    }
  }, []);

  const accessLevels: BrainGameAccessLevel[] = [
    {
      gameIds: ['sequence'],
      name: 'Foundation',
      description: 'Basic memory and attention games'
    },
    {
      gameIds: ['sequence', 'matching'],
      name: 'Builder', 
      description: 'Enhanced cognitive training with matching games'
    },
    {
      gameIds: ['sequence', 'matching', 'spatial'],
      name: 'Challenger',
      description: 'Complete cognitive workout including spatial memory'
    }
  ];

  const getAccessLevel = (): 'none' | 'basic' | 'intermediate' | 'full' => {
    return features.brainGamesAccess;
  };

  const canPlayGame = (gameId: string): boolean => {
    const accessLevel = getAccessLevel();
    
    if (accessLevel === 'none') return false;
    
    // Basic access: sequence games only
    if (accessLevel === 'basic') {
      return gameId === 'sequence';
    }
    
    // Intermediate access: sequence + matching
    if (accessLevel === 'intermediate') {
      return ['sequence', 'matching'].includes(gameId);
    }
    
    // Full access: all games
    return true;
  };

  const canUseDifficulty = (difficulty: 'Low' | 'Medium' | 'High'): boolean => {
    return features.gameDifficultyLevels.includes(difficulty);
  };

  const getDailyGamesRemaining = (): number => {
    if (features.maxDailyGames === -1) return -1; // Unlimited
    return Math.max(0, features.maxDailyGames - gamesPlayedToday);
  };

  const getAvailableGames = (): BrainGameAccessLevel[] => {
    const accessLevel = getAccessLevel();
    
    if (accessLevel === 'basic') return [accessLevels[0]];
    if (accessLevel === 'intermediate') return accessLevels.slice(0, 2);
    return accessLevels;
  };

  const hasAdvancedAnalytics = (): boolean => {
    return features.advancedGameAnalytics;
  };

  const hasPersonalizedTraining = (): boolean => {
    return features.personalizedTraining;
  };

  const getRequiredTierForGame = (gameId: string): 'starter' | 'smart_pro' | 'family_smart' | null => {
    if (gameId === 'sequence') return null; // Available in free tier
    if (gameId === 'matching') return 'starter';
    if (gameId === 'spatial') return 'smart_pro';
    return 'smart_pro'; // Default for unknown games
  };

  const getRequiredTierForDifficulty = (difficulty: 'Low' | 'Medium' | 'High'): 'starter' | 'smart_pro' | null => {
    if (difficulty === 'Low') return null; // Available in free tier
    if (difficulty === 'Medium') return 'starter';
    if (difficulty === 'High') return 'smart_pro';
    return null;
  };

  // Function to increment daily game count (would be called when starting a game)
  const incrementDailyGameCount = () => {
    dailyGameCount++;
    setGamesPlayedToday(dailyGameCount);
  };

  return {
    canPlayGame,
    canUseDifficulty,
    getDailyGamesRemaining,
    getAccessLevel,
    getAvailableGames,
    hasAdvancedAnalytics,
    hasPersonalizedTraining,
    getRequiredTierForGame,
    getRequiredTierForDifficulty
  };
}