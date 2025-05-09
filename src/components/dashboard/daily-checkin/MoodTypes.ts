
export interface MoodOption {
  value: string;
  label: string;
  color: string;
  description: string;
  numericValue: number;
}

export interface MoodHistoryEntry {
  day: string;
  value: number;
  mood: string;
}

export const moodOptions: MoodOption[] = [
  {
    value: "great",
    label: "Great",
    color: "bg-green-500",
    description: "I'm feeling positive and energetic",
    numericValue: 3
  },
  {
    value: "okay",
    label: "Okay",
    color: "bg-blue-500",
    description: "I'm feeling balanced and stable",
    numericValue: 2
  },
  {
    value: "struggling",
    label: "Struggling",
    color: "bg-red-500",
    description: "I'm having a difficult time today",
    numericValue: 1
  }
];
