
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TimerBadgeProps {
  mode: "work" | "shortBreak" | "longBreak";
}

export function TimerBadge({ mode }: TimerBadgeProps) {
  return (
    <Badge variant={mode === "work" ? "default" : "secondary"} className="px-3 py-1">
      {mode === "work" ? "Work Session" : mode === "shortBreak" ? "Short Break" : "Long Break"}
    </Badge>
  );
}
