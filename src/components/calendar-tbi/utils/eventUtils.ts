
import { TBIEvent, EventStatus, EventType } from '../types/calendarTypes';
import { format, isToday, isPast, isFuture, isWithinInterval, addMinutes } from 'date-fns';

export const getEventTypeColor = (type: EventType): string => {
  const colors = {
    appointment: '#FFD700', // Gold
    therapy: '#90EE90',     // Light Green
    medication: '#FFB6C1',  // Light Pink
    rest: '#ADD8E6',        // Light Blue
    personal: '#DDA0DD',    // Plum
    emergency: '#FF6B6B'    // Red
  };
  return colors[type];
};

export const getEventTypeIcon = (type: EventType): string => {
  const icons = {
    appointment: '👩‍⚕️',
    therapy: '🧠',
    medication: '💊',
    rest: '😴',
    personal: '👤',
    emergency: '🚨'
  };
  return icons[type];
};

export const getCurrentEvent = (events: TBIEvent[]): TBIEvent | null => {
  const now = new Date();
  return events.find(event => 
    isWithinInterval(now, { start: event.startTime, end: event.endTime }) &&
    event.status !== 'completed'
  ) || null;
};

export const getNextEvent = (events: TBIEvent[]): TBIEvent | null => {
  const now = new Date();
  const upcomingEvents = events
    .filter(event => isFuture(event.startTime) && event.status === 'upcoming')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  return upcomingEvents[0] || null;
};

export const getCompletedEventsToday = (events: TBIEvent[]): TBIEvent[] => {
  return events.filter(event => 
    isToday(event.startTime) && 
    event.status === 'completed'
  );
};

export const formatEventTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatEventDuration = (startTime: Date, endTime: Date): string => {
  const start = format(startTime, 'h:mm a');
  const end = format(endTime, 'h:mm a');
  return `${start} - ${end}`;
};

export const getTimeUntilEvent = (eventTime: Date): string => {
  const now = new Date();
  const diffMinutes = Math.floor((eventTime.getTime() - now.getTime()) / (1000 * 60));
  
  if (diffMinutes < 0) return 'Started';
  if (diffMinutes === 0) return 'Starting now';
  if (diffMinutes < 60) return `in ${diffMinutes} min`;
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (minutes === 0) return `in ${hours}h`;
  return `in ${hours}h ${minutes}m`;
};

export const shouldShowReminder = (event: TBIEvent): boolean => {
  if (!event.reminderMinutes) return false;
  
  const now = new Date();
  const reminderTime = addMinutes(event.startTime, -event.reminderMinutes);
  
  return now >= reminderTime && now < event.startTime;
};
