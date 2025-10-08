import { ExtractedAction } from '@/types/memoryBridge';
import { supabase } from '@/integrations/supabase/client';

export interface SmartScheduleSuggestion {
  date: string;
  time: string;
  confidence: number;
  reason: string;
  energyMatch?: string;
  conflictLevel: 'none' | 'low' | 'high';
  duration?: number;
  assessmentAligned?: boolean;
}

export interface UserSchedulePreference {
  mostProductiveHours: string[];
  leastProductiveHours: string[];
  preferredMeetingTimes: string[];
  energyPeaks: 'morning' | 'afternoon' | 'evening';
  doNotDisturb: string[];
}

// Smart scheduling engine with empowering growth mindset
export class SmartScheduler {
  private defaultPreferences: UserSchedulePreference = {
    mostProductiveHours: ['09:00', '10:00', '14:00', '15:00'],
    leastProductiveHours: ['12:00', '13:00', '17:00', '18:00'],
    preferredMeetingTimes: ['10:00', '11:00', '14:00', '15:00'],
    energyPeaks: 'morning',
    doNotDisturb: ['20:00', '21:00', '22:00', '07:00', '08:00']
  };

  async getUserPreferences(userId: string): Promise<UserSchedulePreference> {
    try {
      const { data, error } = await supabase
        .from('user_schedule_preferences')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error || !data || data.length === 0) {
        return this.defaultPreferences;
      }

      // Convert database format to our preferences
      const prefs = data[0];
      return {
        mostProductiveHours: (prefs.time_slots as any)?.productive || this.defaultPreferences.mostProductiveHours,
        leastProductiveHours: (prefs.time_slots as any)?.unproductive || this.defaultPreferences.leastProductiveHours,
        preferredMeetingTimes: (prefs.time_slots as any)?.meetings || this.defaultPreferences.preferredMeetingTimes,
        energyPeaks: (prefs.time_slots as any)?.energy_peak || this.defaultPreferences.energyPeaks,
        doNotDisturb: (prefs.time_slots as any)?.do_not_disturb || this.defaultPreferences.doNotDisturb
      };
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return this.defaultPreferences;
    }
  }

  async getExistingEvents(userId: string, startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('date, time')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      return error ? [] : data || [];
    } catch (error) {
      console.error('Error loading existing events:', error);
      return [];
    }
  }

  async generateSmartSuggestions(
    action: ExtractedAction, 
    userId: string, 
    watcherNames: string[] = [],
    tier?: string
  ): Promise<SmartScheduleSuggestion[]> {
    const preferences = await this.getUserPreferences(userId);
    const suggestions: SmartScheduleSuggestion[] = [];
    
    // Get next 7 days for suggestions
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);
    
    const existingEvents = await this.getExistingEvents(
      userId, 
      today.toISOString().split('T')[0], 
      endDate.toISOString().split('T')[0]
    );

    // Generate suggestions based on action priority and user preferences
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + dayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      // Skip weekends for work-related actions unless high priority
      const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
      if (isWeekend && action.priority_level < 4 && this.isWorkRelated(action)) {
        continue;
      }

      // Suggest optimal times based on action type and priority
      const timeSlots = this.getOptimalTimeSlots(action, preferences);
      
      for (const time of timeSlots) {
        const conflictLevel = this.checkConflicts(dateStr, time, existingEvents);
        const confidence = this.calculateConfidence(action, dayOffset, time, preferences, conflictLevel);
        
        if (confidence > 0.3) { // Only suggest if confidence > 30%
          suggestions.push({
            date: dateStr,
            time,
            confidence,
            reason: this.generateEmpoweringReason(action, time, preferences, dayOffset, watcherNames),
            energyMatch: this.getEnergyMatch(time, preferences),
            conflictLevel
          });
        }
      }
    }

    // Sort by confidence (highest first) and return top 3
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  private getOptimalTimeSlots(action: ExtractedAction, preferences: UserSchedulePreference): string[] {
    // High priority actions get prime time slots
    if (action.priority_level >= 4) {
      return preferences.mostProductiveHours.slice(0, 3);
    }

    // Meeting-related actions get meeting-friendly times
    if (this.isMeetingRelated(action)) {
      return preferences.preferredMeetingTimes.slice(0, 2);
    }

    // Personal actions can be more flexible
    return [...preferences.mostProductiveHours.slice(0, 2), ...preferences.preferredMeetingTimes.slice(0, 1)];
  }

  private checkConflicts(date: string, time: string, existingEvents: any[]): 'none' | 'low' | 'high' {
    const conflicts = existingEvents.filter(event => 
      event.date === date && Math.abs(this.timeToMinutes(event.time) - this.timeToMinutes(time)) < 120
    );

    if (conflicts.length === 0) return 'none';
    if (conflicts.length === 1) return 'low';
    return 'high';
  }

  private calculateConfidence(
    action: ExtractedAction, 
    dayOffset: number, 
    time: string, 
    preferences: UserSchedulePreference,
    conflictLevel: 'none' | 'low' | 'high'
  ): number {
    let confidence = 0.5; // Base confidence

    // Priority boost
    confidence += (action.priority_level / 5) * 0.3;

    // Time preference boost
    if (preferences.mostProductiveHours.includes(time)) {
      confidence += 0.2;
    }

    // Conflict penalty
    if (conflictLevel === 'low') confidence -= 0.1;
    if (conflictLevel === 'high') confidence -= 0.3;

    // Urgency boost (sooner is better for high priority)
    if (action.priority_level >= 4) {
      confidence += (7 - dayOffset) * 0.05; // Prefer earlier dates
    }

    // Do not disturb penalty
    if (preferences.doNotDisturb.includes(time)) {
      confidence -= 0.4;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  private generateEmpoweringReason(
    action: ExtractedAction, 
    time: string, 
    preferences: UserSchedulePreference,
    dayOffset: number,
    watcherNames: string[]
  ): string {
    const reasons = [];
    
    if (dayOffset === 0) {
      reasons.push("Strike while the iron is hot! 🔥");
    } else if (dayOffset === 1) {
      reasons.push("Tomorrow's a fresh start for this priority! 🌅");
    } else if (dayOffset <= 3) {
      reasons.push("Perfect timing for sustained progress! 📈");
    }

    if (preferences.mostProductiveHours.includes(time)) {
      reasons.push("Your peak performance window! ⚡");
    }

    if (action.priority_level >= 4) {
      reasons.push("High-impact action deserves prime time! 🎯");
    }

    if (watcherNames.length > 0) {
      reasons.push(`${watcherNames.length > 1 ? 'Your circle' : watcherNames[0]} will celebrate this with you! 💜`);
    }

    const energyMatch = this.getEnergyMatch(time, preferences);
    if (energyMatch) {
      reasons.push(energyMatch);
    }

    return reasons[0] || "A great time to make meaningful progress! 🚀";
  }

  private getEnergyMatch(time: string, preferences: UserSchedulePreference): string | undefined {
    const hour = parseInt(time.split(':')[0]);
    
    if (preferences.energyPeaks === 'morning' && hour >= 8 && hour <= 11) {
      return "Matches your morning energy peak! ☀️";
    }
    if (preferences.energyPeaks === 'afternoon' && hour >= 13 && hour <= 16) {
      return "Aligns with your afternoon focus! 🎯";
    }
    if (preferences.energyPeaks === 'evening' && hour >= 17 && hour <= 20) {
      return "Perfect for your evening momentum! 🌙";
    }
    
    return undefined;
  }

  private isWorkRelated(action: ExtractedAction): boolean {
    const text = action.action_text.toLowerCase();
    return text.includes('work') || text.includes('office') || text.includes('meeting') || 
           text.includes('call') || text.includes('email') || text.includes('project');
  }

  private isMeetingRelated(action: ExtractedAction): boolean {
    const text = action.action_text.toLowerCase();
    return text.includes('meet') || text.includes('call') || text.includes('discuss') || 
           text.includes('visit') || text.includes('appointment');
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

export const smartScheduler = new SmartScheduler();