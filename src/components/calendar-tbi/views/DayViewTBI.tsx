import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DayData, EnergyLevel, TBIEvent, EventType } from '../types/calendarTypes';
import { format, isSameDay } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';
import { NavigationHeader } from '../components/NavigationHeader';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useAssessmentToScheduling } from '@/hooks/useAssessmentToScheduling';
import { Plus, X, Clock, CheckCircle2, Lightbulb } from 'lucide-react';

interface DayViewTBIProps {
  dayData: DayData;
  userRole: 'individual' | 'caregiver';
  onEventComplete?: (eventId: string) => void;
  onEnergyLevelChange?: (level: EnergyLevel) => void;
  onOpenSettings?: () => void;
  onOpenCaregiver?: () => void;
  priorities: { p1: string; p2: string; p3: string };
  updatePriorities: (field: 'p1' | 'p2' | 'p3', value: string) => void;
  scopeLabel: string;
  scopeGradient: string;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

interface TimeSlotEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  time: string;
}

export function DayViewTBI({ 
  dayData, 
  userRole, 
  onEventComplete, 
  onEnergyLevelChange, 
  onOpenSettings, 
  onOpenCaregiver,
  priorities,
  updatePriorities,
  scopeLabel,
  scopeGradient,
  currentDate,
  onDateChange,
  onTimeSlotClick
}: DayViewTBIProps) {
  const { actions, completeAction } = useDailyActions();
  const { getScheduleReasoning, scheduleMapping } = useAssessmentToScheduling();
  const [carryOver, setCarryOver] = useState('');
  const [notes, setNotes] = useState('');

  // Generate time slots from 05:00 to 23:00
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = i + 5;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get actions for the current day
  const dayActions = actions.filter(action => 
    action.date && isSameDay(new Date(action.date), currentDate)
  );

  const handleCompleteAction = async (actionId: string) => {
    try {
      await completeAction(actionId);
    } catch (error) {
      console.error('Error completing action:', error);
    }
  };

  const getActionTypeColor = (focus_area: string, status: string) => {
    const baseColors = {
      'physical': 'bg-orange-100 text-orange-700 border-orange-200', 
      'cognitive': 'bg-purple-100 text-purple-700 border-purple-200',
      'social': 'bg-blue-100 text-blue-700 border-blue-200',
      'emotional': 'bg-green-100 text-green-700 border-green-200',
      'sleep': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    
    const color = baseColors[focus_area as keyof typeof baseColors] || baseColors['cognitive'];
    
    if (status === 'completed') {
      return color.replace('100', '200').replace('700', '800') + ' opacity-75';
    }
    
    return color;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Daily Schedule"
        viewType="day"
        currentDate={currentDate}
      />
      
      <NavigationHeader
        currentDate={currentDate}
        viewType="day"
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
              {scopeLabel} • Year → Month → Week → Day
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* P1 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P1 - Your Top Priority</label>
              <Input
                value={priorities.p1}
                onChange={(e) => updatePriorities('p1', e.target.value)}
                placeholder="What matters most today..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P2 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P2 - Important</label>
              <Input
                value={priorities.p2}
                onChange={(e) => updatePriorities('p2', e.target.value)}
                placeholder="Second priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>

            {/* P3 Priority */}
            <div>
              <label className="block text-sm font-medium mb-2">P3 - When Time Allows</label>
              <Input
                value={priorities.p3}
                onChange={(e) => updatePriorities('p3', e.target.value)}
                placeholder="Third priority..."
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
            </div>
          </div>

          {/* Schedule reasoning - show WHY */}
          {scheduleMapping.displayReason && (
            <div className="mt-4 flex items-center gap-2 text-sm opacity-90 bg-white/10 rounded-lg px-3 py-2">
              <Lightbulb className="h-4 w-4 flex-shrink-0" />
              <span>{scheduleMapping.displayReason}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Schedule Grid */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Time Grid with Scroll */}
            <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
              {timeSlots.map((time) => (
                <div 
                  key={time} 
                  className="flex min-h-[80px] hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => onTimeSlotClick?.(currentDate, time)}
                >
                  {/* Time Column */}
                  <div className="w-16 md:w-20 flex-shrink-0 p-2 md:p-3 bg-muted/30 border-r border-border flex items-start justify-center">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {time}
                      <Plus className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity ml-1" />
                    </div>
                  </div>
                  
                  {/* Activity Column */}
                  <div className="flex-1 p-2 md:p-3 group-hover:bg-muted/20 transition-colors">
                    {/* Show activities for this time slot */}
                    {dayActions
                      .filter(action => {
                        if (!action.start_time) return false;
                        const actionHour = action.start_time.split(':')[0];
                        const slotHour = time.split(':')[0];
                        return actionHour === slotHour;
                      })
                      .map((action) => (
                        <div
                          key={action.id}
                          className={`p-3 rounded-lg border mb-2 group relative ${getActionTypeColor(action.focus_area || 'cognitive', action.status)}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-medium text-sm md:text-base truncate ${action.status === 'completed' ? 'line-through' : ''}`}>
                                  {action.title}
                                </h4>
                                {action.status === 'completed' && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                              {action.description && (
                                <p className="text-xs md:text-sm opacity-80 mt-1 line-clamp-2">
                                  {action.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs uppercase font-medium tracking-wide opacity-70">
                                  {action.focus_area || 'cognitive'}
                                </span>
                                {action.duration_minutes && (
                                  <span className="text-xs opacity-70">
                                    • {action.duration_minutes}min
                                  </span>
                                )}
                              </div>
                              {/* Schedule reasoning for this time slot */}
                              {scheduleMapping.peakHours.includes(time) && (
                                <p className="text-xs mt-1 opacity-60 flex items-center gap-1">
                                  <Lightbulb className="h-3 w-3" />
                                  Your peak energy time
                                </p>
                              )}
                            </div>
                            {action.status !== 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteAction(action.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-green-200 hover:text-green-700"
                                title="Mark as complete"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    
                    {/* Show activities without specific time */}
                    {time === '05:00' && dayActions
                      .filter(action => !action.start_time)
                      .map((action) => (
                        <div
                          key={action.id}
                          className={`p-3 rounded-lg border mb-2 group relative ${getActionTypeColor(action.focus_area || 'cognitive', action.status)}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-medium text-sm md:text-base truncate ${action.status === 'completed' ? 'line-through' : ''}`}>
                                  {action.title}
                                </h4>
                                {action.status === 'completed' && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                              {action.description && (
                                <p className="text-xs md:text-sm opacity-80 mt-1 line-clamp-2">
                                  {action.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs uppercase font-medium tracking-wide opacity-70">
                                  {action.focus_area || 'cognitive'} • No specific time
                                </span>
                                {action.duration_minutes && (
                                  <span className="text-xs opacity-70">
                                    • {action.duration_minutes}min
                                  </span>
                                )}
                              </div>
                            </div>
                            {action.status !== 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompleteAction(action.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-green-200 hover:text-green-700"
                                title="Mark as complete"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
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