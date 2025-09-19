import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DayData, EnergyLevel } from '../types/calendarTypes';
import { format } from 'date-fns';

interface DayViewTBIProps {
  dayData: DayData;
  userRole: 'individual' | 'caregiver';
  onEventComplete?: (eventId: string) => void;
  onEnergyLevelChange?: (level: EnergyLevel) => void;
  onOpenSettings?: () => void;
  onOpenCaregiver?: () => void;
}

export function DayViewTBI({ dayData, userRole, onEventComplete, onEnergyLevelChange, onOpenSettings, onOpenCaregiver }: DayViewTBIProps) {
  const [p1Priority, setP1Priority] = useState('');
  const [p2Priority, setP2Priority] = useState('');
  const [p3Priority, setP3Priority] = useState('');
  const [carryOver, setCarryOver] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-gray-600">{format(dayData.date, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Schedule Grid */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Time Grid */}
            <div className="divide-y divide-gray-200">
              {timeSlots.map((time) => (
                <div key={time} className="flex min-h-[80px]">
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0 p-3 bg-gray-50 border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-700">{time}</div>
                  </div>
                  
                  {/* Event Column */}
                  <div className="flex-1 p-3">
                    {/* Events for this time slot would go here */}
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Carry-Overs */}
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Carry-Overs</h3>
            <Textarea
              placeholder="Items from yesterday..."
              value={carryOver}
              onChange={(e) => setCarryOver(e.target.value)}
              className="min-h-[100px] text-sm"
            />
          </Card>
        </div>
      </div>

      {/* Empowerment Banner */}
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

      {/* Notes Section */}
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
        <Textarea
          placeholder="Add your thoughts, reflections, or important reminders..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px]"
        />
        <div className="flex justify-end mt-3">
          <Button size="sm">Save Notes</Button>
        </div>
      </Card>
    </div>
  );
}