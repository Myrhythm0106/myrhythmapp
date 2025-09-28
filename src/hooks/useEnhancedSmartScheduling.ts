import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConflictLevel } from '@/components/ui/ConflictIndicator';

export interface EnhancedSmartSuggestion {
  id: string;
  date: string;
  time: string;
  confidence: number;
  reason: string;
  conflictLevel: ConflictLevel;
  conflictDetails?: string[];
  bufferTime?: number;
  energyMatch?: string;
  calendarProvider?: string;
  estimatedDuration?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  provider: string;
  status: string;
}

export function useEnhancedSmartScheduling() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const loadCalendarEvents = useCallback(async (startDate: string, endDate: string) => {
    if (!user) return [];

    try {
      // Load events from multiple sources
      const [internalEvents, externalEvents] = await Promise.all([
        supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate),
        supabase
          .from('external_calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)
      ]);

      const allEvents: CalendarEvent[] = [
        ...(internalEvents.data || []).map(event => ({
          id: event.id,
          title: event.title,
          start: `${event.date}T${event.time}`,
          end: `${event.date}T${event.time}`, // TODO: Calculate end time
          provider: 'internal',
          status: 'confirmed'
        })),
        ...(externalEvents.data || []).map(event => ({
          id: event.id,
          title: event.title,
          start: `${event.date}T${event.time}`,
          end: `${event.date}T${event.end_time || event.time}`,
          provider: event.source,
          status: event.status || 'confirmed'
        }))
      ];

      setCalendarEvents(allEvents);
      return allEvents;
    } catch (error) {
      console.error('Error loading calendar events:', error);
      return [];
    }
  }, [user]);

  const checkConflicts = useCallback((
    proposedDate: string, 
    proposedTime: string, 
    duration: number = 60
  ): { level: ConflictLevel; details: string[] } => {
    const proposedStart = new Date(`${proposedDate}T${proposedTime}`);
    const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);

    const conflicts: string[] = [];
    let highPriorityConflicts = 0;
    let lowPriorityConflicts = 0;

    calendarEvents.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      // Check for overlap
      if (proposedStart < eventEnd && proposedEnd > eventStart) {
        const isHighPriority = event.title.toLowerCase().includes('meeting') || 
                              event.title.toLowerCase().includes('call') ||
                              event.title.toLowerCase().includes('appointment');
        
        if (isHighPriority) {
          highPriorityConflicts++;
          conflicts.push(`Overlaps with ${event.title} (${event.provider})`);
        } else {
          lowPriorityConflicts++;
          conflicts.push(`Minor overlap with ${event.title}`);
        }
      }

      // Check for tight scheduling (less than 15 minutes between events)
      const timeBefore = (eventStart.getTime() - proposedEnd.getTime()) / 60000;
      const timeAfter = (proposedStart.getTime() - eventEnd.getTime()) / 60000;
      
      if (timeBefore > 0 && timeBefore < 15) {
        conflicts.push(`Only ${Math.round(timeBefore)} minutes before ${event.title}`);
        lowPriorityConflicts++;
      }
      if (timeAfter > 0 && timeAfter < 15) {
        conflicts.push(`Only ${Math.round(timeAfter)} minutes after ${event.title}`);
        lowPriorityConflicts++;
      }
    });

    let level: ConflictLevel = 'none';
    if (highPriorityConflicts > 0) {
      level = 'high';
    } else if (lowPriorityConflicts > 0) {
      level = 'low';
    }

    return { level, details: conflicts };
  }, [calendarEvents]);

  const generateSmartSuggestions = useCallback(async (
    actionText: string,
    dueDate?: string,
    priority: number = 3,
    estimatedDuration: number = 60
  ): Promise<EnhancedSmartSuggestion[]> => {
    if (!user) return [];

    setIsGenerating(true);
    
    try {
      // Load calendar events for the next 2 weeks
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await loadCalendarEvents(startDate, endDate);

      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_schedule_preferences')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      const userPrefs = preferences?.[0];
      
      // Generate time slots based on preferences and action type
      const suggestions: EnhancedSmartSuggestion[] = [];
      const today = new Date();
      
      // Determine optimal times based on action type
      const isWorkRelated = actionText.toLowerCase().includes('work') || 
                           actionText.toLowerCase().includes('meeting') ||
                           actionText.toLowerCase().includes('call');
      
      const isFocusTask = actionText.toLowerCase().includes('focus') ||
                         actionText.toLowerCase().includes('write') ||
                         actionText.toLowerCase().includes('plan');

      const getOptimalTimes = () => {
        if (isWorkRelated) {
          return ['09:00', '10:00', '14:00', '15:00'];
        } else if (isFocusTask) {
          return ['08:00', '09:00', '10:00', '19:00', '20:00']; 
        } else {
          return ['11:00', '13:00', '16:00', '17:00'];
        }
      };

      const optimalTimes = getOptimalTimes();
      
      // Generate suggestions for the next 7 days
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + dayOffset);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        // Skip weekends for work-related tasks
        const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
        if (isWorkRelated && isWeekend) continue;

        for (const time of optimalTimes) {
          const conflicts = checkConflicts(dateStr, time, estimatedDuration);
          
          // Calculate confidence based on multiple factors
          let confidence = 70; // Base confidence
          
          // Priority bonus
          if (priority <= 2) confidence += 15;
          else if (priority >= 4) confidence -= 10;
          
          // Timing bonus
          if (dayOffset === 0) confidence += 10; // Today
          else if (dayOffset === 1) confidence += 5; // Tomorrow
          else if (dayOffset > 5) confidence -= 10; // Too far out
          
          // Conflict penalty
          if (conflicts.level === 'high') confidence -= 40;
          else if (conflicts.level === 'low') confidence -= 15;
          else confidence += 10; // No conflicts bonus
          
          // Energy match bonus
          const energyMatch = isFocusTask ? 'High focus time' : 
                             isWorkRelated ? 'Peak productivity' : 
                             'Good energy level';
          
          if ((isFocusTask && ['08:00', '09:00', '19:00', '20:00'].includes(time)) ||
              (isWorkRelated && ['09:00', '10:00', '14:00', '15:00'].includes(time))) {
            confidence += 10;
          }
          
          // Weekend preference adjustment
          if (!isWeekend && !isWorkRelated) confidence -= 5;
          
          confidence = Math.max(0, Math.min(100, confidence));
          
          const reason = generateEmpoweringReason(
            actionText,
            dateStr,
            time,
            conflicts.level,
            energyMatch,
            dayOffset
          );

          suggestions.push({
            id: `${dateStr}-${time}`,
            date: dateStr,
            time,
            confidence,
            reason,
            conflictLevel: conflicts.level,
            conflictDetails: conflicts.details,
            bufferTime: estimatedDuration > 60 ? 15 : 10,
            energyMatch,
            estimatedDuration
          });
        }
      }

      // Sort by confidence and return top suggestions
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8);
        
    } catch (error) {
      console.error('Error generating smart suggestions:', error);
      toast.error('Failed to generate scheduling suggestions');
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [user, checkConflicts, loadCalendarEvents]);

  const scheduleAction = useCallback(async (
    suggestion: EnhancedSmartSuggestion,
    actionId: string,
    actionTitle: string
  ): Promise<boolean> => {
    if (!user) return false;

    setIsScheduling(true);
    
    try {
      // Create calendar event
      const { data: calendarEvent, error: calendarError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: actionTitle,
          description: `Scheduled with AI assistance - ${suggestion.reason}`,
          date: suggestion.date,
          time: suggestion.time,
          type: 'action',
          is_system_generated: true
        })
        .select()
        .single();

      if (calendarError) throw calendarError;

      // Update the action with scheduling info
      const { error: actionError } = await supabase
        .from('extracted_actions')
        .update({
          scheduled_date: suggestion.date,
          scheduled_time: suggestion.time,
          calendar_event_id: calendarEvent.id,
          status: 'scheduled'
        })
        .eq('id', actionId)
        .eq('user_id', user.id);

      if (actionError) throw actionError;

      toast.success(
        `Action scheduled for ${formatDate(suggestion.date)} at ${formatTime(suggestion.time)}`,
        {
          description: suggestion.reason
        }
      );

      return true;
    } catch (error) {
      console.error('Error scheduling action:', error);
      toast.error('Failed to schedule action');
      return false;
    } finally {
      setIsScheduling(false);
    }
  }, [user]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return {
    generateSmartSuggestions,
    scheduleAction,
    checkConflicts,
    loadCalendarEvents,
    isGenerating,
    isScheduling,
    calendarEvents
  };
}

function generateEmpoweringReason(
  actionText: string,
  date: string,
  time: string,
  conflictLevel: ConflictLevel,
  energyMatch: string,
  dayOffset: number
): string {
  const timeOfDay = parseInt(time.split(':')[0]) < 12 ? 'morning' : 
                   parseInt(time.split(':')[0]) < 17 ? 'afternoon' : 'evening';
  
  const dayContext = dayOffset === 0 ? 'today' : 
                    dayOffset === 1 ? 'tomorrow' : 
                    `in ${dayOffset} days`;

  const empoweringPhrases = [
    "Perfect timing to make progress on",
    "Ideal window to tackle",
    "Great opportunity to advance",
    "Optimal moment to focus on",
    "Prime time to achieve"
  ];

  const baseReason = empoweringPhrases[Math.floor(Math.random() * empoweringPhrases.length)];
  
  let reason = `${baseReason} this goal ${dayContext} ${timeOfDay}. `;
  
  if (conflictLevel === 'none') {
    reason += "Your calendar is completely clear, giving you uninterrupted focus time.";
  } else if (conflictLevel === 'low') {
    reason += "Minor scheduling considerations but still a productive time slot.";
  } else {
    reason += "Alternative time to work around your existing commitments.";
  }
  
  reason += ` ${energyMatch} makes this an empowering choice for your success.`;
  
  return reason;
}