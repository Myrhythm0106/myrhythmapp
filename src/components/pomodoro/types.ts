
export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  notificationSound: boolean;
  notificationVisual: boolean;
}

export interface PomodoroState {
  isActive: boolean;
  isRunning: boolean;
  mode: "work" | "shortBreak" | "longBreak";
  secondsLeft: number;
  totalSeconds: number;
  taskTitle: string;
  pomodoroCount: number;
  settings: PomodoroSettings;
}

export interface PomodoroContextType {
  state: PomodoroState;
  startTimer: (taskTitle: string, customSettings?: Partial<PomodoroSettings>) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  notificationSound: true,
  notificationVisual: true,
};
