
import React from "react";

export interface GameDifficultyLevel {
  level: "Low" | "Medium" | "High";
  description: string;
  parameters: Record<string, any>;
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  purpose?: string; // Added purpose field to explain the game's cognitive benefits
  cognitiveDomain: string;
  icon: React.ReactNode;
  difficultyLevels: GameDifficultyLevel[];
  watchers?: string[];
  progressLevel?: number;
}

export interface RecentGame {
  id: string;
  name: string;
  lastPlayed: string;
  progressPercent: number;
  streakDays: number;
}

export interface ActiveGameProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  difficulty: "Low" | "Medium" | "High";
}
