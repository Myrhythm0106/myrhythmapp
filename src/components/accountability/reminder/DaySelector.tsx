
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface DaySelectorProps {
  selectedDays: number[];
  onDayToggle: (day: number, checked: boolean) => void;
}

export function DaySelector({ selectedDays, onDayToggle }: DaySelectorProps) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-3">
      <Label>Days of the Week</Label>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${index}`}
              checked={selectedDays.includes(index)}
              onCheckedChange={(checked) => onDayToggle(index, checked as boolean)}
            />
            <Label htmlFor={`day-${index}`} className="text-xs">
              {day.substring(0, 3)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
