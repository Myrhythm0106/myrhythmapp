
import { useState, useEffect } from "react";

interface MemoryProgressData {
  daysActive: number;
  tasksCompleted: number;
  improvementScore: number;
  currentStreak: number;
  memoryMilestones: MemoryMilestone[];
  weeklyProgress: WeeklyMemoryData[];
}

interface MemoryMilestone {
  id: string;
  title: string;
  description: string;
  achievedAt: string | null;
  targetValue: number;
  currentValue: number;
  category: "logging" | "exercises" | "recall" | "consistency";
}

interface WeeklyMemoryData {
  week: string;
  memoryTasks: number;
  accuracyScore: number;
  recallTime: number;
}

export function useMemoryProgress(): MemoryProgressData {
  const [progressData, setProgressData] = useState<MemoryProgressData>({
    daysActive: 0,
    tasksCompleted: 0,
    improvementScore: 0,
    currentStreak: 0,
    memoryMilestones: [],
    weeklyProgress: []
  });

  useEffect(() => {
    // Load memory progress from localStorage
    const loadMemoryProgress = () => {
      const storedProgress = localStorage.getItem("memory_progress_data");
      
      if (storedProgress) {
        try {
          const parsed = JSON.parse(storedProgress);
          setProgressData(parsed);
        } catch (error) {
          console.error("Error parsing memory progress data:", error);
          initializeDefaultProgress();
        }
      } else {
        initializeDefaultProgress();
      }
    };

    const initializeDefaultProgress = () => {
      const defaultData: MemoryProgressData = {
        daysActive: 7,
        tasksCompleted: 24,
        improvementScore: 18,
        currentStreak: 3,
        memoryMilestones: [
          {
            id: "1",
            title: "Memory Logger",
            description: "Log important moments for 7 consecutive days",
            achievedAt: new Date().toISOString(),
            targetValue: 7,
            currentValue: 7,
            category: "logging"
          },
          {
            id: "2",
            title: "Decision Tracker",
            description: "Record 20 important decisions and actions",
            achievedAt: null,
            targetValue: 20,
            currentValue: 14,
            category: "logging"
          },
          {
            id: "3",
            title: "Memory Athlete",
            description: "Complete 50 memory exercises",
            achievedAt: null,
            targetValue: 50,
            currentValue: 28,
            category: "exercises"
          },
          {
            id: "4",
            title: "Recall Master",
            description: "Achieve 90% accuracy on memory recall tasks",
            achievedAt: null,
            targetValue: 90,
            currentValue: 76,
            category: "recall"
          }
        ],
        weeklyProgress: [
          { week: "Week 1", memoryTasks: 8, accuracyScore: 65, recallTime: 3.2 },
          { week: "Week 2", memoryTasks: 12, accuracyScore: 72, recallTime: 2.8 },
          { week: "Week 3", memoryTasks: 15, accuracyScore: 78, recallTime: 2.5 },
          { week: "Current", memoryTasks: 11, accuracyScore: 82, recallTime: 2.1 }
        ]
      };
      
      setProgressData(defaultData);
      localStorage.setItem("memory_progress_data", JSON.stringify(defaultData));
    };

    loadMemoryProgress();
  }, []);

  return progressData;
}
