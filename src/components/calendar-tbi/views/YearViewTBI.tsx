import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TBIEvent } from '../types/calendarTypes';
import { format, startOfYear, addMonths } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';
import { NavigationHeader } from '../components/NavigationHeader';

interface YearViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
  priorities: { p1: string; p2: string; p3: string };
  updatePriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  scopeLabel: string;
  scopeGradient: string;
  onDateChange: (date: Date) => void;
}

export function YearViewTBI({ currentDate, events, onDayClick, priorities, updatePriorities, scopeLabel, scopeGradient, onDateChange }: YearViewTBIProps) {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Annual Compass"
        viewType="year"
        currentDate={currentDate}
      />
      
      <NavigationHeader
        currentDate={currentDate}
        viewType="year"
        onDateChange={onDateChange}
      />

      {/* Empowerment Banner - P1, P2, P3 Priorities */}
      <Card className={`bg-gradient-to-r ${scopeGradient} text-white`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {scopeLabel} Focus - I AM Empowered
            </h2>
            <div className="text-sm opacity-90 font-medium">
              {scopeLabel} • Your Annual Vision
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* P1 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P1 - Most Important</label>
              <Input
                value={priorities.p1}
                onChange={(e) => updatePriorities('p1', e.target.value)}
                placeholder="Your top yearly goal..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P2 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P2 - Important</label>
              <Input
                value={priorities.p2}
                onChange={(e) => updatePriorities('p2', e.target.value)}
                placeholder="Second yearly goal..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P3 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P3 - Nice to Have</label>
              <Input
                value={priorities.p3}
                onChange={(e) => updatePriorities('p3', e.target.value)}
                placeholder="Third yearly goal..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>
      </Card>

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