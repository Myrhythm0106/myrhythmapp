
import { addDays, addWeeks, addMonths, addYears, format, isAfter, isBefore } from "date-fns";

export interface RecurringEventData {
  title: string;
  date: string;
  time: string;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrenceInterval: number;
  recurrenceEndDate?: string;
  recurrenceCount?: number;
  recurrenceDaysOfWeek?: string[];
  [key: string]: any;
}

export interface GeneratedEvent {
  date: string;
  time: string;
  title: string;
  isRecurringInstance: boolean;
  parentEventId?: string;
  [key: string]: any;
}

export function generateRecurringEvents(
  parentEvent: RecurringEventData,
  parentEventId: string,
  maxInstances: number = 100
): GeneratedEvent[] {
  const events: GeneratedEvent[] = [];
  let currentDate = new Date(parentEvent.date);
  const endDate = parentEvent.recurrenceEndDate ? new Date(parentEvent.recurrenceEndDate) : null;
  const maxCount = parentEvent.recurrenceCount || maxInstances;

  for (let i = 0; i < maxCount; i++) {
    // Calculate next occurrence based on pattern
    switch (parentEvent.recurrencePattern) {
      case 'daily':
        currentDate = addDays(currentDate, parentEvent.recurrenceInterval);
        break;
      case 'weekly':
        if (parentEvent.recurrenceDaysOfWeek?.length) {
          // Handle specific days of week
          currentDate = getNextWeekdayOccurrence(currentDate, parentEvent.recurrenceDaysOfWeek, parentEvent.recurrenceInterval);
        } else {
          currentDate = addWeeks(currentDate, parentEvent.recurrenceInterval);
        }
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, parentEvent.recurrenceInterval);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, parentEvent.recurrenceInterval);
        break;
      default:
        return events;
    }

    // Check if we've exceeded the end date
    if (endDate && isAfter(currentDate, endDate)) {
      break;
    }

    // Generate the recurring event instance
    const recurringEvent: GeneratedEvent = {
      ...parentEvent,
      date: format(currentDate, 'yyyy-MM-dd'),
      time: parentEvent.time,
      isRecurringInstance: true,
      parentEventId: parentEventId,
      title: parentEvent.title,
    };

    events.push(recurringEvent);
  }

  return events;
}

function getNextWeekdayOccurrence(
  currentDate: Date, 
  daysOfWeek: string[], 
  intervalWeeks: number
): Date {
  const dayMap = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6
  };

  const targetDays = daysOfWeek.map(day => dayMap[day as keyof typeof dayMap]).sort();
  const currentDay = currentDate.getDay();
  
  // Find next occurrence within the current week
  for (const targetDay of targetDays) {
    if (targetDay > currentDay) {
      return addDays(currentDate, targetDay - currentDay);
    }
  }
  
  // If no more days this week, go to next interval and start with first target day
  const daysToNextWeek = (7 - currentDay) + (intervalWeeks - 1) * 7 + targetDays[0];
  return addDays(currentDate, daysToNextWeek);
}

export function getRecurringEventSummary(eventData: RecurringEventData): string {
  const { recurrencePattern, recurrenceInterval, recurrenceDaysOfWeek, recurrenceEndDate } = eventData;
  
  let summary = "";
  
  switch (recurrencePattern) {
    case 'daily':
      summary = recurrenceInterval === 1 ? "Daily" : `Every ${recurrenceInterval} days`;
      break;
    case 'weekly':
      if (recurrenceDaysOfWeek?.length) {
        const dayNames = recurrenceDaysOfWeek.map(day => 
          day.charAt(0).toUpperCase() + day.slice(1, 3)
        );
        summary = `Weekly on ${dayNames.join(', ')}`;
      } else {
        summary = recurrenceInterval === 1 ? "Weekly" : `Every ${recurrenceInterval} weeks`;
      }
      break;
    case 'monthly':
      summary = recurrenceInterval === 1 ? "Monthly" : `Every ${recurrenceInterval} months`;
      break;
    case 'yearly':
      summary = recurrenceInterval === 1 ? "Yearly" : `Every ${recurrenceInterval} years`;
      break;
    default:
      return "";
  }
  
  if (recurrenceEndDate) {
    summary += ` until ${format(new Date(recurrenceEndDate), 'MMM d, yyyy')}`;
  }
  
  return summary;
}

export function isRecurringEvent(event: any): boolean {
  return event.recurrencePattern && event.recurrencePattern !== 'none';
}

export function isRecurringInstance(event: any): boolean {
  return Boolean(event.isRecurringInstance || event.parentEventId);
}
