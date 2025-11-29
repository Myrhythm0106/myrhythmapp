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
    estimatedDuration: number = 60,
    verbCategory?: string
  ): Promise<EnhancedSmartSuggestion[]> => {
    if (!user) return [];

    setIsGenerating(true);
    
    try {
      // Load calendar events for the next 2 weeks
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await loadCalendarEvents(startDate, endDate);

      // PHASE 2: Fetch assessment-based energy patterns
      const { data: assessmentData } = await supabase
        .from('assessment_results')
        .select('responses, scores, raw_assessment_data')
        .eq('user_id', user.id)
        .eq('completion_status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      const energyPatterns = assessmentData ? extractEnergyPatterns(assessmentData) : null;

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
      
      // PHASE 2: Map action type to energy requirements
      const energyRequirement = mapVerbCategoryToEnergy(verbCategory || '', actionText);
      
      // Determine optimal times based on action type AND assessment
      const isWorkRelated = actionText.toLowerCase().includes('work') || 
                           actionText.toLowerCase().includes('meeting') ||
                           actionText.toLowerCase().includes('call');
      
      const isFocusTask = actionText.toLowerCase().includes('focus') ||
                         actionText.toLowerCase().includes('write') ||
                         actionText.toLowerCase().includes('plan');

      const getOptimalTimes = () => {
        // PHASE 2: Use assessment data if available
        if (energyPatterns && energyRequirement) {
          return getAssessmentBasedTimes(energyPatterns, energyRequirement);
        }
        
        // Fallback to rule-based times
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
          
          // PHASE 2: Energy match bonus with assessment data
          let energyMatch = isFocusTask ? 'High focus time' : 
                           isWorkRelated ? 'Peak productivity' : 
                           'Good energy level';
          
          let energyBonus = 0;
          if (energyPatterns && energyRequirement) {
            const timeEnergy = getEnergyLevelForTime(energyPatterns, time);
            if (timeEnergy >= energyRequirement) {
              energyBonus = 15;
              energyMatch = `🧠 Your assessment shows ${timeEnergy}% ${getEnergyDescription(timeEnergy)} during this time`;
            }
          } else if ((isFocusTask && ['08:00', '09:00', '19:00', '20:00'].includes(time)) ||
              (isWorkRelated && ['09:00', '10:00', '14:00', '15:00'].includes(time))) {
            energyBonus = 10;
          }
          
          confidence += energyBonus;
          
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

      // Auto-create smart reminders for the scheduled action
      const defaultReminders = [
        { time: '15_minutes_before', methods: ['in_app', 'push'] },
        { time: 'morning_of', methods: ['email', 'in_app'] }
      ];

      for (const reminder of defaultReminders) {
        await supabase
          .from('event_reminders')
          .insert({
            event_id: calendarEvent.id,
            user_id: user.id,
            reminder_time: reminder.time,
            reminder_methods: reminder.methods,
            is_active: true
          });
      }

      toast.success(
        `Action scheduled for ${formatDate(suggestion.date)} at ${formatTime(suggestion.time)}`,
        {
          description: `${suggestion.reason} - Reminders set!`
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

// PHASE 2: Assessment-based energy functions
interface EnergyPattern {
  morningEnergy: number;
  afternoonEnergy: number;
  eveningEnergy: number;
  peakFocusTime: 'morning' | 'afternoon' | 'evening';
  lowEnergyPeriods: string[];
}

function extractEnergyPatterns(assessmentData: any): EnergyPattern | null {
  try {
    const responses = assessmentData.responses || {};
    const scores = assessmentData.scores || {};
    
    // Extract energy levels from assessment responses
    const morningEnergy = responses.energy_morning || scores.morning_focus || 70;
    const afternoonEnergy = responses.energy_afternoon || scores.afternoon_focus || 60;
    const eveningEnergy = responses.energy_evening || scores.evening_focus || 50;
    
    // Determine peak focus time
    let peakFocusTime: 'morning' | 'afternoon' | 'evening' = 'morning';
    if (afternoonEnergy > morningEnergy && afternoonEnergy > eveningEnergy) {
      peakFocusTime = 'afternoon';
    } else if (eveningEnergy > morningEnergy && eveningEnergy > afternoonEnergy) {
      peakFocusTime = 'evening';
    }
    
    // Identify low energy periods
    const lowEnergyPeriods: string[] = [];
    if (morningEnergy < 50) lowEnergyPeriods.push('morning');
    if (afternoonEnergy < 50) lowEnergyPeriods.push('afternoon');
    if (eveningEnergy < 50) lowEnergyPeriods.push('evening');
    
    return {
      morningEnergy,
      afternoonEnergy,
      eveningEnergy,
      peakFocusTime,
      lowEnergyPeriods
    };
  } catch (error) {
    console.error('Error extracting energy patterns:', error);
    return null;
  }
}

function mapVerbCategoryToEnergy(verbCategory: string, actionText: string): number {
  // Map verb categories to energy requirements (0-100)
  const categoryMap: Record<string, number> = {
    'MEDICAL': 90,      // Medical tasks need peak focus
    'PLANNING': 85,     // Planning requires high cognitive load
    'COMMUNICATION': 70, // Communication needs good energy
    'ADMIN': 60,        // Admin tasks need moderate energy
    'RESEARCH': 85,     // Research needs high focus
    'CREATIVE': 80,     // Creative work needs good energy
    'PHYSICAL': 75      // Physical tasks need good energy
  };
  
  // Check verb category first
  if (verbCategory && categoryMap[verbCategory.toUpperCase()]) {
    return categoryMap[verbCategory.toUpperCase()];
  }
  
  // Fallback to text analysis
  const text = actionText.toLowerCase();
  if (text.includes('doctor') || text.includes('medical') || text.includes('appointment')) return 90;
  if (text.includes('plan') || text.includes('strategy')) return 85;
  if (text.includes('call') || text.includes('meeting') || text.includes('discuss')) return 70;
  if (text.includes('email') || text.includes('schedule') || text.includes('book')) return 60;
  
  return 65; // Default moderate energy
}

function getAssessmentBasedTimes(patterns: EnergyPattern, requiredEnergy: number): string[] {
  const times: string[] = [];
  
  // Morning times (6 AM - 12 PM)
  if (patterns.morningEnergy >= requiredEnergy) {
    times.push('08:00', '09:00', '10:00', '11:00');
  }
  
  // Afternoon times (12 PM - 5 PM)
  if (patterns.afternoonEnergy >= requiredEnergy) {
    times.push('13:00', '14:00', '15:00', '16:00');
  }
  
  // Evening times (5 PM - 9 PM)
  if (patterns.eveningEnergy >= requiredEnergy) {
    times.push('17:00', '18:00', '19:00', '20:00');
  }
  
  // Always return at least some times
  if (times.length === 0) {
    // Use peak time even if energy is lower
    if (patterns.peakFocusTime === 'morning') {
      times.push('09:00', '10:00');
    } else if (patterns.peakFocusTime === 'afternoon') {
      times.push('14:00', '15:00');
    } else {
      times.push('19:00', '20:00');
    }
  }
  
  return times;
}

function getEnergyLevelForTime(patterns: EnergyPattern, time: string): number {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour >= 6 && hour < 12) {
    return patterns.morningEnergy;
  } else if (hour >= 12 && hour < 17) {
    return patterns.afternoonEnergy;
  } else {
    return patterns.eveningEnergy;
  }
}

function getEnergyDescription(energy: number): string {
  if (energy >= 90) return 'peak focus';
  if (energy >= 75) return 'high energy';
  if (energy >= 60) return 'good energy';
  if (energy >= 45) return 'moderate energy';
  return 'lower energy';
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
    reason += "Your calendar is completely clear 🎯";
  } else if (conflictLevel === 'low') {
    reason += "Minor scheduling considerations but still productive";
  } else {
    reason += "Alternative time that works around your commitments";
  }
  
  if (energyMatch.includes('🧠')) {
    reason += ` ${energyMatch}.`;
  } else {
    reason += ` ${energyMatch} makes this empowering.`;
  }
  
  return reason;
}