import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TBIEvent } from '../types/calendarTypes';
import { format, startOfYear, addMonths } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';

interface YearViewTBIProps {
  currentDate: Date;
  events: TBIEvent[];
  onDayClick: (date: Date) => void;
  p1Priority: string;
  setP1Priority: (value: string) => void;
  p2Priority: string;
  setP2Priority: (value: string) => void;
  p3Priority: string;
  setP3Priority: (value: string) => void;
}

export function YearViewTBI({ currentDate, events, onDayClick, p1Priority, setP1Priority, p2Priority, setP2Priority, p3Priority, setP3Priority }: YearViewTBIProps) {
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

      {/* Empowerment Banner - P1, P2, P3 Priorities */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Today, I choose... I AM Empowered
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* P1 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P1 - Most Important</label>
              <Input
                value={p1Priority}
                onChange={(e) => setP1Priority(e.target.value)}
                placeholder="Your top priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P2 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P2 - Important</label>
              <Input
                value={p2Priority}
                onChange={(e) => setP2Priority(e.target.value)}
                placeholder="Second priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P3 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P3 - Nice to Have</label>
              <Input
                value={p3Priority}
                onChange={(e) => setP3Priority(e.target.value)}
                placeholder="Third priority..."
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