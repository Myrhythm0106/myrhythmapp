
import { GratitudeEntry } from "@/components/gratitude/GratitudePrompt";
import { subDays } from "date-fns";

export function calculateAverageMoodScore(entries: GratitudeEntry[]): number {
  if (entries.length === 0) return 0;
  return entries.reduce((total, entry) => total + entry.moodScore, 0) / entries.length;
}

export function findMostFrequentTime(entries: GratitudeEntry[]): string {
  if (entries.length === 0) return "N/A";
  
  const times = {
    Morning: 0,
    Afternoon: 0,
    Evening: 0
  };
  
  entries.forEach(entry => {
    const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
    const hour = entryDate.getHours();
    if (hour >= 5 && hour < 12) {
      times.Morning++;
    } else if (hour >= 12 && hour < 18) {
      times.Afternoon++;
    } else {
      times.Evening++;
    }
  });
  
  return Object.entries(times).reduce(
    (max, [time, count]) => count > max.count ? { time, count } : max, 
    { time: "N/A", count: 0 }
  ).time;
}

export function countEntriesLastWeek(entries: GratitudeEntry[]): number {
  return entries.filter(entry => {
    const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
    return entryDate >= subDays(new Date(), 7);
  }).length;
}
