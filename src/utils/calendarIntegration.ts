import { supabase } from '@/integrations/supabase/client';
import { ExtractedAction } from '@/types/memoryBridge';
import { toast } from 'sonner';

export interface CalendarEventFromAction {
  title: string;
  description: string;
  date: string;
  time: string;
  duration_minutes: number;
  category: string;
  action_id: string;
  type: 'action_item';
}

export async function convertActionToCalendarEvent(
  action: ExtractedAction, 
  userId: string,
  selectedDate?: string,
  selectedTime?: string
): Promise<string | null> {
  try {
    // Parse due context for scheduling hints
    const dueContext = action.due_context || '';
    const isUrgent = action.priority_level >= 4;
    
    // Default scheduling
    const eventDate = selectedDate || new Date().toISOString().split('T')[0];
    const eventTime = selectedTime || (isUrgent ? '09:00' : '14:00');
    
    // Estimate duration based on action type
    const durationEstimate = estimateActionDuration(action);
    
    // Create calendar event
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        user_id: userId,
        title: `Memory Bridge: ${action.action_text}`,
        description: `${action.action_text}\n\nContext: ${action.relationship_impact || ''}\n\nEmotional Stakes: ${action.emotional_stakes || ''}\n\nIntent: ${action.intent_behind || ''}`,
        date: eventDate,
        time: eventTime,
        type: 'action_item',
        category: 'memory_bridge',
        requires_acceptance: false,
        is_system_generated: true
      })
      .select()
      .single();

    if (error) throw error;

    // Link action to daily actions for tracking
    await createDailyActionFromExtracted(action, userId, eventDate, eventTime, durationEstimate);

    return data.id;
  } catch (error) {
    console.error('Failed to convert action to calendar event:', error);
    throw error;
  }
}

async function createDailyActionFromExtracted(
  action: ExtractedAction,
  userId: string,
  date: string,
  time: string,
  duration: number
) {
  try {
    const { error } = await supabase
      .from('daily_actions')
      .insert({
        user_id: userId,
        title: action.action_text,
        description: `From Memory Bridge: ${action.relationship_impact || ''}`,
        date,
        start_time: time,
        duration_minutes: duration,
        action_type: 'memory_bridge',
        status: 'pending',
        difficulty_level: Math.min(action.priority_level, 5),
        focus_area: determineActionFocusArea(action)
      });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create daily action:', error);
  }
}

function estimateActionDuration(action: ExtractedAction): number {
  const text = action.action_text.toLowerCase();
  
  // Quick tasks (15-30 minutes)
  if (text.includes('call') || text.includes('text') || text.includes('email')) {
    return 15;
  }
  
  // Medium tasks (30-60 minutes)
  if (text.includes('meet') || text.includes('visit') || text.includes('discuss')) {
    return 45;
  }
  
  // Long tasks (60+ minutes)
  if (text.includes('prepare') || text.includes('plan') || text.includes('research')) {
    return 90;
  }
  
  // Default based on priority
  return action.priority_level >= 4 ? 30 : 60;
}

function determineActionFocusArea(action: ExtractedAction): string {
  const text = action.action_text.toLowerCase();
  const relationship = action.relationship_impact?.toLowerCase() || '';
  
  if (text.includes('health') || text.includes('doctor') || text.includes('medical')) {
    return 'health';
  }
  
  if (text.includes('family') || relationship.includes('family')) {
    return 'relationships';
  }
  
  if (text.includes('work') || text.includes('job') || text.includes('career')) {
    return 'work';
  }
  
  if (text.includes('exercise') || text.includes('walk') || text.includes('gym')) {
    return 'fitness';
  }
  
  return 'personal';
}

export async function scheduleConfirmedActions(userId: string): Promise<number> {
  try {
    // Get all confirmed actions not yet scheduled
    const { data: actions, error } = await supabase
      .from('extracted_actions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .is('calendar_event_id', null);

    if (error) throw error;
    if (!actions || actions.length === 0) return 0;

    let scheduled = 0;
    
    for (const action of actions) {
      try {
        const eventId = await convertActionToCalendarEvent(action as ExtractedAction, userId);
        
        if (eventId) {
          // Update action with calendar event reference
          await supabase
            .from('extracted_actions')
            .update({ status: 'scheduled' })
            .eq('id', action.id);
          
          scheduled++;
        }
      } catch (error) {
        console.error(`Failed to schedule action ${action.id}:`, error);
      }
    }

    if (scheduled > 0) {
      toast.success(`Scheduled ${scheduled} actions to your calendar!`);
    }

    return scheduled;
  } catch (error) {
    console.error('Failed to schedule actions:', error);
    toast.error('Failed to schedule actions');
    return 0;
  }
}