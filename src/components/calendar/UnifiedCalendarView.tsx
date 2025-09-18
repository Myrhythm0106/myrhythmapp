import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Target, 
  Users, 
  Plus,
  Filter,
  Settings
} from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ExternalCalendarSync } from './ExternalCalendarSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  endTime?: string;
  type: 'action' | 'goal' | 'event' | 'external';
  status?: 'pending' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
  source?: 'internal' | 'google' | 'outlook' | 'apple';
}

export function UnifiedCalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const { user } = useAuth();

  useEffect(() => {
    if (user && selectedDate) {
      loadEventsForDate(selectedDate);
    }
  }, [user, selectedDate]);

  const loadEventsForDate = async (date: Date) => {
    if (!user) return;

    setLoading(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Load scheduled A.C.T.S. actions (from daily_actions)
      const { data: dailyActions } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr);

      // Load calendar events
      const { data: calendarEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateStr)
        .lte('date', dateStr);

      // Load external calendar events (simulated - awaiting type regeneration)
      const externalEvents: any[] = [];
      // Real implementation will be enabled once Supabase types include new tables:
      // const { data: externalEvents } = await supabase
      //   .from('external_calendar_events')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .eq('date', dateStr);

      const allEvents: CalendarEvent[] = [
        // Daily actions (A.C.T.S.)
        ...(dailyActions || []).map(action => ({
          id: action.id,
          title: action.title,
          description: action.description,
          date: action.date,
          time: action.start_time,
          type: 'action' as const,
          status: (action.status as 'pending' | 'completed' | 'cancelled') || 'pending',
          priority: action.focus_area === 'high' ? 'high' as const : 
                   action.focus_area === 'medium' ? 'medium' as const : 'low' as const,
          source: 'internal' as const
        })),
        
        // Internal calendar events
        ...(calendarEvents || []).map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          endTime: undefined, // calendar_events table doesn't have end_time
          type: 'event' as const,
          source: 'internal' as const
        })),

        // External calendar events (empty for now)
        ...(externalEvents || []).map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          endTime: event.end_time,
          type: 'external' as const,
          source: event.source as 'google' | 'outlook' | 'apple'
        }))
      ];

      setEvents(allEvents.sort((a, b) => {
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0;
      }));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'action': return <Target className="h-4 w-4" />;
      case 'goal': return <Users className="h-4 w-4" />;
      case 'external': return <CalendarIcon className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string, status?: string, source?: string) => {
    if (status === 'completed') {
      return 'border-l-memory-emerald-500 bg-memory-emerald-50 text-memory-emerald-900';
    }
    
    switch (type) {
      case 'action': 
        return 'border-l-brain-health-500 bg-brain-health-50 text-brain-health-900';
      case 'goal': 
        return 'border-l-sunrise-amber-500 bg-sunrise-amber-50 text-sunrise-amber-900';
      case 'external':
        if (source === 'google') return 'border-l-blue-500 bg-blue-50 text-blue-900';
        if (source === 'outlook') return 'border-l-purple-500 bg-purple-50 text-purple-900';
        return 'border-l-gray-500 bg-gray-50 text-gray-900';
      default: 
        return 'border-l-clarity-teal-500 bg-clarity-teal-50 text-clarity-teal-900';
    }
  };

  const getDateDescription = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM do');
  };

  const eventsForSelectedDate = events.filter(event => {
    if (!selectedDate) return false;
    return event.date === format(selectedDate, 'yyyy-MM-dd');
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="sync">External Sync</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvents: (date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return events.some(event => event.date === dateStr);
                    }
                  }}
                  modifiersStyles={{
                    hasEvents: { 
                      backgroundColor: 'rgb(var(--primary) / 0.1)',
                      fontWeight: 'bold',
                      color: 'rgb(var(--primary))'
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Events for Selected Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {selectedDate ? getDateDescription(selectedDate) : 'Select a Date'}
                  </span>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse text-muted-foreground">
                      Loading events...
                    </div>
                  </div>
                ) : eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No events scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {eventsForSelectedDate.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type, event.status, event.source)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <Badge variant="secondary" className="text-xs">
                              {event.type === 'external' ? event.source : event.type}
                            </Badge>
                            {event.time && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {event.time}
                                {event.endTime && ` - ${event.endTime}`}
                              </div>
                            )}
                          </div>
                          
                          {event.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                        
                        {event.status && (
                          <Badge 
                            variant={event.status === 'completed' ? 'default' : 'secondary'}
                            className="mt-2 text-xs"
                          >
                            {event.status}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Today's A.C.T.S. Actions Quick View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brain-health-600" />
                Today's A.C.T.S. Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {events
                  .filter(event => 
                    event.type === 'action' && 
                    event.date === format(new Date(), 'yyyy-MM-dd')
                  )
                  .slice(0, 4)
                  .map(action => (
                    <div key={action.id} className="p-2 bg-muted/50 rounded text-sm">
                      <div className="font-medium truncate">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.time ? `${action.time}` : 'No time set'}
                      </div>
                    </div>
                  ))
                }
                {events.filter(event => 
                  event.type === 'action' && 
                  event.date === format(new Date(), 'yyyy-MM-dd')
                ).length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-4">
                    No A.C.T.S. actions scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <ExternalCalendarSync />
        </TabsContent>
      </Tabs>
    </div>
  );
}