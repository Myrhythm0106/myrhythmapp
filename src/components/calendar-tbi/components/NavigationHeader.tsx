import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from 'date-fns';

interface NavigationHeaderProps {
  currentDate: Date;
  viewType: 'day' | 'week' | 'month' | 'year';
  onDateChange: (date: Date) => void;
}

export function NavigationHeader({ currentDate, viewType, onDateChange }: NavigationHeaderProps) {
  const handlePrevious = () => {
    switch (viewType) {
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
      case 'year':
        onDateChange(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case 'day':
        onDateChange(addDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(currentDate, 1));
        break;
      case 'year':
        onDateChange(addYears(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getTodayLabel = () => {
    switch (viewType) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'Today';
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button variant="outline" size="sm" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleToday}>
        {getTodayLabel()}
      </Button>
      <Button variant="outline" size="sm" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}