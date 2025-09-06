import { useMemo } from 'react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export type TimeFrame = 'day' | 'week' | 'month' | 'year';

export function useDateRanges(timeFrame: TimeFrame = 'day') {
  return useMemo(() => {
    const now = new Date();
    
    switch (timeFrame) {
      case 'day':
        return {
          start: startOfDay(now),
          end: endOfDay(now),
          label: 'Today'
        };
      
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }), // Monday start
          end: endOfWeek(now, { weekStartsOn: 1 }),
          label: 'This Week'
        };
      
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: 'This Month'
        };
      
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now),
          label: 'This Year'
        };
      
      default:
        return {
          start: startOfDay(now),
          end: endOfDay(now),
          label: 'Today'
        };
    }
  }, [timeFrame]);
}