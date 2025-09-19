import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DayData, EnergyLevel, TBIEvent, EventType } from '../types/calendarTypes';
import { format } from 'date-fns';
import { UnifiedHeader } from '../components/UnifiedHeader';
import { Plus, X, Clock } from 'lucide-react';

interface DayViewTBIProps {
  dayData: DayData;
  userRole: 'individual' | 'caregiver';
  onEventComplete?: (eventId: string) => void;
  onEnergyLevelChange?: (level: EnergyLevel) => void;
  onOpenSettings?: () => void;
  onOpenCaregiver?: () => void;
}

interface TimeSlotEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  time: string;
}

export function DayViewTBI({ dayData, userRole, onEventComplete, onEnergyLevelChange, onOpenSettings, onOpenCaregiver }: DayViewTBIProps) {
  const [p1Priority, setP1Priority] = useState('');
  const [p2Priority, setP2Priority] = useState('');
  const [p3Priority, setP3Priority] = useState('');
  const [carryOver, setCarryOver] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlotEvents, setTimeSlotEvents] = useState<Record<string, TimeSlotEvent>>({});
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('personal');

  // Generate time slots from 05:00 to 23:00
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = i + 5;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const addEvent = (timeSlot: string) => {
    if (!eventTitle.trim()) return;
    
    const newEvent: TimeSlotEvent = {
      id: `${timeSlot}-${Date.now()}`,
      title: eventTitle.trim(),
      description: eventDescription.trim() || undefined,
      type: eventType,
      time: timeSlot
    };
    
    setTimeSlotEvents(prev => ({
      ...prev,
      [timeSlot]: newEvent
    }));
    
    // Reset form
    setEventTitle('');
    setEventDescription('');
    setEventType('personal');
    setEditingSlot(null);
  };

  const removeEvent = (timeSlot: string) => {
    setTimeSlotEvents(prev => {
      const updated = { ...prev };
      delete updated[timeSlot];
      return updated;
    });
  };

  const getEventTypeColor = (type: EventType) => {
    const colors = {
      appointment: 'bg-brand-blue-100 text-brand-blue-700 border-brand-blue-200',
      therapy: 'bg-brand-teal-100 text-brand-teal-700 border-brand-teal-200',
      medication: 'bg-brand-orange-100 text-brand-orange-700 border-brand-orange-200',
      rest: 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200',
      personal: 'bg-beacon-100 text-beacon-700 border-beacon-200',
      emergency: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader 
        viewTitle="My Daily Schedule"
        dateInfo={format(dayData.date, 'EEEE, MMMM d, yyyy')}
        viewType="day"
        currentDate={dayData.date}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Schedule Grid */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Time Grid with Scroll */}
            <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
              {timeSlots.map((time) => (
                <div key={time} className="flex min-h-[80px] hover:bg-muted/50 transition-colors">
                  {/* Time Column */}
                  <div className="w-16 md:w-20 flex-shrink-0 p-2 md:p-3 bg-muted/30 border-r border-border flex items-start justify-center">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {time}
                    </div>
                  </div>
                  
                  {/* Event Column */}
                  <div className="flex-1 p-2 md:p-3">
                    {timeSlotEvents[time] ? (
                      /* Existing Event */
                      <div className={`p-3 rounded-lg border ${getEventTypeColor(timeSlotEvents[time].type)} group relative`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm md:text-base truncate">
                              {timeSlotEvents[time].title}
                            </h4>
                            {timeSlotEvents[time].description && (
                              <p className="text-xs md:text-sm opacity-80 mt-1 line-clamp-2">
                                {timeSlotEvents[time].description}
                              </p>
                            )}
                            <span className="text-xs uppercase font-medium tracking-wide opacity-70 mt-1 block">
                              {timeSlotEvents[time].type}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvent(time)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : editingSlot === time ? (
                      /* Add Event Form */
                      <div className="space-y-3 p-3 bg-muted/20 rounded-lg border-2 border-dashed border-primary/30">
                        <Input
                          placeholder="Event title..."
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          className="text-sm"
                          autoFocus
                        />
                        <Textarea
                          placeholder="Description (optional)..."
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          className="text-sm min-h-[60px] resize-none"
                        />
                        <div className="flex flex-wrap gap-2">
                          {(['personal', 'appointment', 'therapy', 'medication', 'rest'] as EventType[]).map((type) => (
                            <button
                              key={type}
                              onClick={() => setEventType(type)}
                              className={`px-2 py-1 text-xs rounded-md border transition-colors capitalize ${
                                eventType === type 
                                  ? getEventTypeColor(type)
                                  : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => addEvent(time)}
                            disabled={!eventTitle.trim()}
                            className="flex-1 h-8 text-xs"
                          >
                            Add Event
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSlot(null);
                              setEventTitle('');
                              setEventDescription('');
                              setEventType('personal');
                            }}
                            className="h-8 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Add Event Button */
                      <button
                        onClick={() => setEditingSlot(time)}
                        className="w-full h-full min-h-[40px] flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg border-2 border-dashed border-transparent hover:border-muted transition-all group"
                      >
                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Add event</span>
                      </button>
                    )}
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