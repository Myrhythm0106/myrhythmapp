
import React from "react";
import { Eye, Book, Lightbulb, Puzzle, Zap, Target, Brain, Grid3X3 } from "lucide-react";
import { GameType, RecentGame } from "../types/gameTypes";

// Sample game types data - in a real app, this would be more extensive
export const gameTypes: GameType[] = [
  {
    id: "visual-memory",
    name: "Pattern Recall",
    description: "Remember and reproduce visual patterns that briefly appear on screen.",
    purpose: "This game helps improve visual memory and pattern recognition, which are crucial skills for daily tasks like remembering where objects are placed or recognizing familiar faces and environments.",
    cognitiveDomain: "Visual Memory",
    icon: React.createElement(Eye, { className: "h-5 w-5 text-blue-500" }),
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
    watchers: ["Dr. Wilson", "Support Group"],
    progressLevel: 4
  },
  {
    id: "auditory-memory",
    name: "Sound Sequence",
    description: "Listen to and reproduce sequences of sounds in the correct order.",
    purpose: "This game strengthens auditory memory and sequential processing, which help with following verbal instructions, participating in conversations, and remembering spoken information.",
    cognitiveDomain: "Auditory Memory",
    icon: React.createElement(Book, { className: "h-5 w-5 text-purple-500" }),
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
    watchers: ["Therapist Jane"],
    progressLevel: 2
  },
  {
    id: "focus-challenge",
    name: "Focus Challenge",
    description: "Maintain attention on a specific target while ignoring distractions.",
    purpose: "This game enhances sustained attention and filtering abilities, helping you maintain focus on important tasks while ignoring distractions in everyday environments.",
    cognitiveDomain: "Sustained Attention",
    icon: React.createElement(Lightbulb, { className: "h-5 w-5 text-amber-500" }),
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
    ],
    progressLevel: 3
  },
  {
    id: "task-switcher",
    name: "Task Switcher",
    description: "Switch between different tasks based on changing rules or cues.",
    purpose: "This game improves cognitive flexibility and task switching, essential skills for multitasking, adapting to new situations, and smoothly transitioning between different activities throughout your day.",
    cognitiveDomain: "Task Switching",
    icon: React.createElement(Puzzle, { className: "h-5 w-5 text-green-500" }),
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
  },
  {
    id: "speed-processing",
    name: "Speed Processor",
    description: "Quickly identify and respond to specific visual or auditory stimuli.",
    purpose: "This game targets processing speed and rapid decision making, helping you respond more quickly to information and make faster decisions in time-sensitive situations.",
    cognitiveDomain: "Processing Speed",
    icon: React.createElement(Zap, { className: "h-5 w-5 text-orange-500" }),
    difficultyLevels: [
      {
        level: "Low",
        description: "Simple stimuli with generous response times",
        parameters: { stimuliComplexity: "low", responseTimeMs: 3000 }
      },
      {
        level: "Medium",
        description: "Moderate stimuli complexity with standard response times",
        parameters: { stimuliComplexity: "medium", responseTimeMs: 2000 }
      },
      {
        level: "High",
        description: "Complex stimuli requiring quick responses",
        parameters: { stimuliComplexity: "high", responseTimeMs: 1000 }
      }
    ],
    progressLevel: 1
  },
  {
    id: "word-finder",
    name: "Word Finder",
    description: "Find specific words hidden within a grid of letters.",
    purpose: "This game enhances visual scanning, verbal processing, and pattern recognition skills, which are important for reading comprehension, vocabulary development, and efficient visual search.",
    cognitiveDomain: "Verbal Processing",
    icon: React.createElement(Grid3X3, { className: "h-5 w-5 text-teal-500" }),
    difficultyLevels: [
      {
        level: "Low",
        description: "Small grid with fewer, more common words",
        parameters: { gridSize: "5x5", wordCount: 5, wordDifficulty: "common" }
      },
      {
        level: "Medium",
        description: "Medium grid with standard word selection",
        parameters: { gridSize: "8x8", wordCount: 8, wordDifficulty: "moderate" }
      },
      {
        level: "High",
        description: "Larger grid with more and less common words",
        parameters: { gridSize: "10x10", wordCount: 12, wordDifficulty: "advanced" }
      }
    ]
  }
];

// User's recent games and progress
export const recentGames: RecentGame[] = [
  { 
    id: "visual-memory", 
    name: "Pattern Recall", 
    lastPlayed: "Today", 
    progressPercent: 65,
    streakDays: 3
  },
  { 
    id: "auditory-memory", 
    name: "Sound Sequence", 
    lastPlayed: "Yesterday", 
    progressPercent: 42,
    streakDays: 0
  },
  { 
    id: "focus-challenge", 
    name: "Focus Challenge", 
    lastPlayed: "3 days ago", 
    progressPercent: 78,
    streakDays: 0
  }
];
