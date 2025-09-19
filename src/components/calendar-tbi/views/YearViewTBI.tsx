import React from 'react';
import { Card } from '@/components/ui/card';
import { TBIEvent } from '../types/calendarTypes';
import { format, startOfYear, addMonths } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';

interface YearViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
}

export function YearViewTBI({ currentDate, events, onDayClick }: YearViewTBIProps) {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Annual Compass"
        dateInfo={format(currentDate, 'yyyy')}
        viewType="year"
        currentDate={currentDate}
      />

      {/* Monthly Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => (
          <Card
            key={month.toISOString()}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onDayClick(month)}
          >
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">
                {format(month, 'MMM')}
              </h3>
              <div className="text-sm text-gray-600">
                {format(month, 'yyyy')}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}