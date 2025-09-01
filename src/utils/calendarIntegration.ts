import { supabase } from '@/integrations/supabase/client';
import { ExtractedAction } from '@/types/memoryBridge';
import { smartScheduler } from './smartScheduler';
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
  watcherNames?: string[],
  selectedDate?: string,
  selectedTime?: string
): Promise<string | null> {
  try {
    let eventDate = selectedDate;
    let eventTime = selectedTime;
    
    // Use smart scheduling if no manual date/time provided
    if (!eventDate || !eventTime) {
      const suggestions = await smartScheduler.generateSmartSuggestions(action, userId, watcherNames);
      if (suggestions.length > 0) {
        eventDate = eventDate || suggestions[0].date;
        eventTime = eventTime || suggestions[0].time;
        
        toast.success("SMART scheduling applied! 🧠", {
          description: suggestions[0].reason
        });
      }
    }
    
    // Fallback to basic scheduling
    const finalDate = eventDate || new Date().toISOString().split('T')[0];
    const finalTime = eventTime || (action.priority_level >= 4 ? '09:00' : '14:00');
    
    // Estimate duration based on action type
    const durationEstimate = estimateActionDuration(action);
    
    // Create empowering description with Support Circle integration
    let description = `🎯 SMART Action: ${action.action_text}`;
    
    if (action.relationship_impact) {
      description += `\n\n💜 Relationship Impact: ${action.relationship_impact}`;
    }
    
    if (action.emotional_stakes) {
      description += `\n\n❤️ Why This Matters: ${action.emotional_stakes}`;
    }
    
    if (action.intent_behind) {
      description += `\n\n🚀 Intent & Growth: ${action.intent_behind}`;
    }
    
    if (watcherNames && watcherNames.length > 0) {
      description += `\n\n💜 Support Circle: ${watcherNames.join(', ')}\nYour circle celebrates every step forward with you! No one walks alone.`;
    }
    
    description += '\n\n✨ Remember: Progress over perfection. You are capable, worthy, and supported on this journey.';

    // Create calendar event
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        user_id: userId,
        title: `🌟 Life Priority: ${action.action_text}`,
        description,
        date: finalDate,
        time: finalTime,
        type: 'action_item',
        category: 'memory_bridge',
        requires_acceptance: false,
        is_system_generated: true,
        watchers: action.assigned_watchers || []
      })
      .select()
      .single();

    if (error) throw error;

    // Link action to daily actions for tracking with watchers
    await createDailyActionFromExtracted(action, userId, finalDate, finalTime, durationEstimate);

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
        title: `🎯 ${action.action_text}`,
        description: `Life-empowering action from Memory Bridge: ${action.relationship_impact || action.emotional_stakes || 'Building stronger connections through intentional action'}`,
        date,
        start_time: time,
        duration_minutes: duration,
        action_type: 'memory_bridge',
        status: 'pending',
        difficulty_level: Math.min(action.priority_level, 5),
        focus_area: determineActionFocusArea(action),
        watchers: action.assigned_watchers || []
      });

    if (error) throw error;
    
    // Send empowering notification for high-priority actions
    if (action.priority_level >= 4) {
      toast.success("High-impact action locked in! 💪", {
        description: "This priority aligns with your growth journey"
      });
    }
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
        const eventId = await convertActionToCalendarEvent(action as ExtractedAction, userId, [], action.proposed_date, action.proposed_time);
        
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