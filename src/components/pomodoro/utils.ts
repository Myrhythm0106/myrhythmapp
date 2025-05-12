
import { toast } from "sonner";
import { PomodoroSettings } from "./types";

export const getTimeForMode = (
  mode: "work" | "shortBreak" | "longBreak", 
  settings: PomodoroSettings
): number => {
  if (mode === "work") return settings.workMinutes * 60;
  if (mode === "shortBreak") return settings.shortBreakMinutes * 60;
  return settings.longBreakMinutes * 60;
};

export const playNotificationSound = (): void => {
  const audio = new Audio("/notification-sound.mp3");
  audio.play().catch(err => console.error("Error playing sound:", err));
};

export const showWorkCompleteNotification = (
  settings: PomodoroSettings,
  isLongBreak: boolean
): void => {
  if (settings.notificationVisual) {
    toast.success("Work session completed! Time for a break.", {
      description: isLongBreak 
        ? `Take a longer break (${settings.longBreakMinutes} min)` 
        : `Take a short break (${settings.shortBreakMinutes} min)`,
    });
  }
};

export const showBreakCompleteNotification = (
  settings: PomodoroSettings
): void => {
  if (settings.notificationVisual) {
    toast.info("Break time over! Ready to focus again?", {
      description: `Starting a ${settings.workMinutes} minute work session`,
    });
  }
};
