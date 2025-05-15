
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper for formatting time to HH:MM format
export function formatTime(time: string) {
  return time;
}

// Calculate event position within a day's timeline
export function calculateEventPosition(startTime: string, endTime?: string) {
  const startHour = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1]) || 0;
  
  const startPercentage = (startHour - 7) * 60 + startMinute; // 7AM is 0%
  
  if (!endTime) return { top: `${startPercentage}px`, height: '60px' };
  
  const endHour = parseInt(endTime.split(':')[0]);
  const endMinute = parseInt(endTime.split(':')[1]) || 0;
  const endPercentage = (endHour - 7) * 60 + endMinute;
  
  return { 
    top: `${startPercentage}px`,
    height: `${Math.max(endPercentage - startPercentage, 30)}px` // Min height of 30px
  };
}

// Get today's date in ISO format
export function getTodayISO() {
  return format(new Date(), 'yyyy-MM-dd');
}

