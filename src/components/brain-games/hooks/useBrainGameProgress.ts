
import { useState, useEffect } from "react";

interface GameProgress {
  currentLevel: number;
  completedLevels: number;
  bestScore: number;
  totalGamesPlayed: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  lastPlayed: Date | null;
}

interface UserProgress {
  sequence: GameProgress;
  matching: GameProgress;
  spatial: GameProgress;
}

interface TodayStats {
  gamesCompleted: number;
  averageScore: number;
  timeSpent: number;
}

const defaultGameProgress: GameProgress = {
  currentLevel: 1,
  completedLevels: 0,
  bestScore: 0,
  totalGamesPlayed: 0,
  averageAccuracy: 0,
  totalTimeSpent: 0,
  lastPlayed: null
};

export function useBrainGameProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    sequence: { ...defaultGameProgress },
    matching: { ...defaultGameProgress },
    spatial: { ...defaultGameProgress }
  });

  const [todayStats, setTodayStats] = useState<TodayStats>({
    gamesCompleted: 0,
    averageScore: 0,
    timeSpent: 0
  });

  const [streak, setStreak] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brainGameProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        Object.keys(parsed).forEach(gameType => {
          if (parsed[gameType].lastPlayed) {
            parsed[gameType].lastPlayed = new Date(parsed[gameType].lastPlayed);
          }
        });
        setUserProgress(parsed);
      }

      const savedTodayStats = localStorage.getItem('brainGameTodayStats');
      if (savedTodayStats) {
        setTodayStats(JSON.parse(savedTodayStats));
      }

      const savedStreak = localStorage.getItem('brainGameStreak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak));
      }
    } catch (error) {
      console.error('Failed to load brain game progress:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('brainGameProgress', JSON.stringify(userProgress));
    } catch (error) {
      console.error('Failed to save brain game progress:', error);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('brainGameTodayStats', JSON.stringify(todayStats));
    } catch (error) {
      console.error('Failed to save today stats:', error);
    }
  }, [todayStats]);

  useEffect(() => {
    try {
      localStorage.setItem('brainGameStreak', streak.toString());
    } catch (error) {
      console.error('Failed to save streak:', error);
    }
  }, [streak]);

  const updateProgress = (gameType: keyof UserProgress, level: number, score: number, accuracy: number, timeSpent: number) => {
    setUserProgress(prev => {
      const gameProgress = prev[gameType];
      const isNewBestScore = score > gameProgress.bestScore;
      const shouldAdvanceLevel = accuracy >= 80 && level === gameProgress.currentLevel;

      return {
        ...prev,
        [gameType]: {
          ...gameProgress,
          currentLevel: shouldAdvanceLevel ? Math.min(level + 1, 50) : gameProgress.currentLevel,
          completedLevels: shouldAdvanceLevel ? Math.max(gameProgress.completedLevels, level) : gameProgress.completedLevels,
          bestScore: isNewBestScore ? score : gameProgress.bestScore,
          totalGamesPlayed: gameProgress.totalGamesPlayed + 1,
          averageAccuracy: Math.round(
            (gameProgress.averageAccuracy * gameProgress.totalGamesPlayed + accuracy) / 
            (gameProgress.totalGamesPlayed + 1)
          ),
          totalTimeSpent: gameProgress.totalTimeSpent + timeSpent,
          lastPlayed: new Date()
        }
      };
    });

    // Update today's stats
    setTodayStats(prev => ({
      gamesCompleted: prev.gamesCompleted + 1,
      averageScore: Math.round(
        (prev.averageScore * prev.gamesCompleted + score) / (prev.gamesCompleted + 1)
      ),
      timeSpent: prev.timeSpent + timeSpent
    }));

    // Update streak (simplified logic - in real app you'd check dates properly)
    if (todayStats.gamesCompleted === 0) {
      setStreak(prev => prev + 1);
    }
  };

  const resetProgress = () => {
    setUserProgress({
      sequence: { ...defaultGameProgress },
      matching: { ...defaultGameProgress },
      spatial: { ...defaultGameProgress }
    });
    setTodayStats({
      gamesCompleted: 0,
      averageScore: 0,
      timeSpent: 0
    });
    setStreak(0);
  };

  return {
    userProgress,
    todayStats,
    streak,
    updateProgress,
    resetProgress
  };
}
