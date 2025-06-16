
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DaySelector } from './DaySelector';

interface ReminderSchedulingProps {
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  reminderTime: string;
  startDate: string;
  endDate: string;
  reminderDays: number[];
  onFrequencyChange: (value: 'daily' | 'weekly' | 'monthly' | 'once') => void;
  onTimeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onDayToggle: (day: number, checked: boolean) => void;
}

export function ReminderScheduling({
  frequency,
  reminderTime,
  startDate,
  endDate,
  reminderDays,
  onFrequencyChange,
  onTimeChange,
  onStartDateChange,
  onEndDateChange,
  onDayToggle
}: ReminderSchedulingProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="frequency">How often?</Label>
          <Select value={frequency} onValueChange={onFrequencyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Just Once</SelectItem>
              <SelectItem value="daily">Every Day</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="time">What time works best? *</Label>
          <Input
            id="time"
            type="time"
            value={reminderTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="start-date">When should we start?</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
      </div>

      {frequency === 'weekly' && (
        <DaySelector 
          selectedDays={reminderDays}
          onDayToggle={onDayToggle}
        />
      )}

      <div>
        <Label htmlFor="end-date">End date (if you want one)</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </>
  );
}
