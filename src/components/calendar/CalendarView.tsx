import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Target,
  Heart,
  CheckCircle,
  AlertCircle,
  Users,
  Brain,
  Zap,
  Crown
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  type: 'event' | 'task' | 'appointment' | 'reminder';
  category?: string;
  user_id: string;
  requires_acceptance?: boolean;
}

interface DailyAction {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  status: 'pending' | 'completed' | 'missed';
  action_type: string;
  is_daily_win: boolean;
  user_id: string;
}

export function CalendarView() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dailyActions, setDailyActions] = useState<DailyAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'event' as const,
    category: ''
  });

  // Fetch calendar data
  useEffect(() => {
    if (user) {
      fetchCalendarData();
    }
  }, [user, currentDate]);

  const fetchCalendarData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      // Fetch calendar events
      const { data: eventsData, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch daily actions
      const { data: actionsData, error: actionsError } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (actionsError) throw actionsError;

      setEvents((eventsData || []).map(event => ({
        ...event,
        type: event.type as 'event' | 'task' | 'appointment' | 'reminder'
      })));
      setDailyActions((actionsData || []).map(action => ({
        ...action,
        status: action.status as 'pending' | 'completed' | 'missed'
      })));
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!user || !selectedDate || !newEvent.title.trim()) return;

    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: newEvent.time,
          type: newEvent.type,
          category: newEvent.category
        });

      if (error) throw error;

      toast.success('Event added successfully!');
      setShowAddEvent(false);
      setNewEvent({ title: '', description: '', time: '', type: 'event', category: '' });
      fetchCalendarData();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('daily_actions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;

      toast.success('Action completed!');
      fetchCalendarData();
    } catch (error) {
      console.error('Error completing action:', error);
      toast.error('Failed to complete action');
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = events.filter(event => event.date === dateStr);
    const dayActions = dailyActions.filter(action => action.date === dateStr);
    return { events: dayEvents, actions: dayActions };
  };

  const renderCalendarDay = (date: Date) => {
    const { events: dayEvents, actions: dayActions } = getEventsForDate(date);
    const totalItems = dayEvents.length + dayActions.length;
    const completedActions = dayActions.filter(a => a.status === 'completed').length;
    const hasDailyWin = dayActions.some(a => a.is_daily_win);

    return (
      <div
        className={cn(
          "h-20 p-1 border border-border/20 cursor-pointer hover:bg-muted/30 transition-colors relative",
          isToday(date) && "bg-memory-emerald/10 border-memory-emerald/40",
          selectedDate && isSameDay(date, selectedDate) && "bg-brain-health/20 border-brain-health"
        )}
        onClick={() => setSelectedDate(date)}
      >
        <div className="text-sm font-medium mb-1">
          {format(date, 'd')}
        </div>
        
        {/* Progress indicator */}
        {totalItems > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              {hasDailyWin && <Crown className="w-3 h-3 text-yellow-500" />}
              <div className="text-xs text-muted-foreground">
                {completedActions}/{dayActions.length}
              </div>
            </div>
            
            {/* Event dots */}
            <div className="flex gap-1 flex-wrap">
              {dayEvents.slice(0, 2).map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    event.type === 'task' ? 'bg-brain-health' :
                    event.type === 'appointment' ? 'bg-emerald-500' :
                    event.type === 'reminder' ? 'bg-orange-500' : 'bg-blue-500'
                  )}
                />
              ))}
              {dayActions.slice(0, 2).map((action, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    action.status === 'completed' ? 'bg-emerald-500' :
                    action.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                  )}
                />
              ))}
              {totalItems > 4 && (
                <div className="text-xs text-muted-foreground">
                  +{totalItems - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : { events: [], actions: [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-memory-emerald/30 shadow-glow bg-gradient-trust">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CalendarIcon className="w-8 h-8 text-memory-emerald" />
              <span className="bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
                Memory Calendar
              </span>
            </CardTitle>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold min-w-[180px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-memory-emerald to-brain-health text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Event title..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Event description..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="task">Task</SelectItem>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddEvent} disabled={!newEvent.title.trim()}>
                        Add Event
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(date => renderCalendarDay(date))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-brain-health" />
              {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDate && (
              <>
                {/* Events */}
                {selectedDateEvents.events.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-memory-emerald">Events</h4>
                    {selectedDateEvents.events.map(event => (
                      <div key={event.id} className="p-3 rounded-lg border border-memory-emerald/20 bg-memory-emerald/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{event.title}</div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground">{event.description}</div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{event.time}</span>
                            </div>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {selectedDateEvents.actions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-brain-health">Actions & Tasks</h4>
                    {selectedDateEvents.actions.map(action => (
                      <div key={action.id} className="p-3 rounded-lg border border-brain-health/20 bg-brain-health/5">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{action.title}</div>
                              {action.is_daily_win && <Crown className="w-4 h-4 text-yellow-500" />}
                            </div>
                            {action.description && (
                              <div className="text-sm text-muted-foreground">{action.description}</div>
                            )}
                            {action.start_time && (
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{action.start_time}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={action.status === 'completed' ? 'default' : 'secondary'}
                              className={action.status === 'completed' ? 'bg-emerald-500' : ''}
                            >
                              {action.status}
                            </Badge>
                            {action.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCompleteAction(action.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDateEvents.events.length === 0 && selectedDateEvents.actions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No events or tasks for this date</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setShowAddEvent(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}