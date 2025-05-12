
import React from "react";
import { TimerBadge } from "./timer-components/TimerBadge";
import { TimeDisplay } from "./timer-components/TimeDisplay";
import { ProgressIndicator } from "./timer-components/ProgressIndicator";
import { SessionCounter } from "./timer-components/SessionCounter";
import { TimerControls } from "./timer-components/TimerControls";
import { PomodoroSettings } from "./types";

interface PomodoroTimerDisplayProps {
  mode: "work" | "shortBreak" | "longBreak";
  secondsLeft: number;
  progress: number;
  formatTime: (seconds: number) => string;
  pomodoroCount: number;
  settings: PomodoroSettings;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
}

export function PomodoroTimerDisplay({
  mode,
  secondsLeft,
  progress,
  formatTime,
  pomodoroCount,
  settings,
  isRunning,
  toggleTimer,
  resetTimer,
  skipToNext
}: PomodoroTimerDisplayProps) {
  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      <TimerBadge mode={mode} />
      
      <TimeDisplay formattedTime={formatTime(secondsLeft)} />
      
      <ProgressIndicator progress={progress} />
      
      <SessionCounter 
        pomodoroCount={pomodoroCount} 
        mode={mode} 
        settings={settings} 
      />
      
      <TimerControls
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
        skipToNext={skipToNext}
      />
    </div>
  );
}
