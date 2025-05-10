
import React from "react";
import { Eye, Book, Lightbulb, Puzzle } from "lucide-react";
import { GameType, RecentGame } from "../types/gameTypes";

// Sample game types data - in a real app, this would be more extensive
export const gameTypes: GameType[] = [
  {
    id: "visual-memory",
    name: "Pattern Recall",
    description: "Remember and reproduce visual patterns that briefly appear on screen.",
    cognitiveDomain: "Visual Memory/Recall",
    icon: <Eye className="h-5 w-5 text-blue-500" />,
    difficultyLevels: [
      {
        level: "Low",
        description: "Simple patterns with 3-4 elements and longer display times",
        parameters: { elements: 3, displayTimeMs: 2000, recallTimeMs: 10000 }
      },
      {
        level: "Medium",
        description: "Moderate patterns with 5-6 elements and standard display times",
        parameters: { elements: 5, displayTimeMs: 1500, recallTimeMs: 8000 }
      },
      {
        level: "High",
        description: "Complex patterns with 7+ elements and brief display times",
        parameters: { elements: 7, displayTimeMs: 1000, recallTimeMs: 7000 }
      }
    ],
    watchers: ["Dr. Wilson", "Support Group"]
  },
  {
    id: "auditory-memory",
    name: "Sound Sequence",
    description: "Listen to and reproduce sequences of sounds in the correct order.",
    cognitiveDomain: "Auditory Memory/Sequence",
    icon: <Book className="h-5 w-5 text-purple-500" />,
    difficultyLevels: [
      {
        level: "Low",
        description: "Short sequences of 2-3 distinct sounds with clear pauses",
        parameters: { sequenceLength: 3, pauseMs: 800, replayAvailable: true }
      },
      {
        level: "Medium",
        description: "Moderate sequences of 4-5 sounds with standard pauses",
        parameters: { sequenceLength: 4, pauseMs: 600, replayAvailable: true }
      },
      {
        level: "High",
        description: "Longer sequences of 6+ sounds with minimal pauses",
        parameters: { sequenceLength: 6, pauseMs: 400, replayAvailable: false }
      }
    ],
    watchers: ["Therapist Jane"]
  },
  {
    id: "focus-challenge",
    name: "Focus Challenge",
    description: "Maintain attention on a specific target while ignoring distractions.",
    cognitiveDomain: "Sustained Attention/Focus",
    icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
    difficultyLevels: [
      {
        level: "Low",
        description: "Few distractors, slow pace, high target visibility",
        parameters: { distractorCount: 3, targetFrequency: 0.4, sessionLengthMin: 3 }
      },
      {
        level: "Medium",
        description: "Moderate distractors with standard pace",
        parameters: { distractorCount: 6, targetFrequency: 0.3, sessionLengthMin: 5 }
      },
      {
        level: "High",
        description: "Many distractors, faster pace, subtle targets",
        parameters: { distractorCount: 10, targetFrequency: 0.2, sessionLengthMin: 7 }
      }
    ]
  },
  {
    id: "task-switcher",
    name: "Task Switcher",
    description: "Switch between different tasks based on changing rules or cues.",
    cognitiveDomain: "Task Switching/Divided Attention",
    icon: <Puzzle className="h-5 w-5 text-green-500" />,
    difficultyLevels: [
      {
        level: "Low",
        description: "Clear visual cues with extended transition time between tasks",
        parameters: { taskTypes: 2, transitionTimeMs: 2000, rulesChangeFrequency: "low" }
      },
      {
        level: "Medium",
        description: "Standard cues with moderate transition time",
        parameters: { taskTypes: 3, transitionTimeMs: 1500, rulesChangeFrequency: "medium" }
      },
      {
        level: "High",
        description: "Subtle cues with minimal transition time between tasks",
        parameters: { taskTypes: 4, transitionTimeMs: 800, rulesChangeFrequency: "high" }
      }
    ],
    watchers: ["Mom", "Cognitive Specialist"]
  }
];

// User's recent games and progress
export const recentGames: RecentGame[] = [
  { id: "visual-memory", name: "Pattern Recall", lastPlayed: "Today", progressPercent: 65 },
  { id: "auditory-memory", name: "Sound Sequence", lastPlayed: "Yesterday", progressPercent: 42 },
  { id: "focus-challenge", name: "Focus Challenge", lastPlayed: "3 days ago", progressPercent: 78 }
];
