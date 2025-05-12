
import React from "react";
import { Badge } from "@/components/ui/badge";
import { PomodoroSettings } from "../types";

interface SessionCounterProps {
  pomodoroCount: number;
  mode: "work" | "shortBreak" | "longBreak";
  settings: PomodoroSettings;
}

export function SessionCounter({ pomodoroCount, mode, settings }: SessionCounterProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">
        Pomodoros: {pomodoroCount}
      </span>
      {mode === "longBreak" && (
        <Badge variant="outline" className="text-xs">
          Long Break #{Math.floor(pomodoroCount / settings.longBreakInterval)}
        </Badge>
      )}
    </div>
  );
}
