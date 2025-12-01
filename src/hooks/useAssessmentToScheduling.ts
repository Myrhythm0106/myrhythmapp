import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface AssessmentScheduleMapping {
  energyPeak: 'morning' | 'afternoon' | 'evening';
  peakHours: string[];
  displayReason: string;
  overwhelmStyle: 'gentle' | 'direct';
  supportStyle: 'reminders' | 'encouragement' | 'practical';
  maxDailyItems: number;
}

// Map assessment energy_peak values to scheduling preferences
const ENERGY_PEAK_TO_SCHEDULE: Record<string, Omit<AssessmentScheduleMapping, 'overwhelmStyle' | 'supportStyle' | 'maxDailyItems'>> = {
  'early_morning': {
    energyPeak: 'morning',
    peakHours: ['06:00', '07:00', '08:00', '09:00'],
    displayReason: "Your mornings are your superpower - when you said you feel most alert"
  },
  'mid_morning': {
    energyPeak: 'morning',
    peakHours: ['09:00', '10:00', '11:00', '12:00'],
    displayReason: "You hit your stride mid-morning - scheduled for when you're sharpest"
  },
  'late_morning': {
    energyPeak: 'morning',
    peakHours: ['10:00', '11:00', '12:00'],
    displayReason: "Late morning is your focus zone - right before lunch"
  },
  'afternoon': {
    energyPeak: 'afternoon',
    peakHours: ['13:00', '14:00', '15:00', '16:00'],
    displayReason: "Afternoons are your focus zone - when you told us you concentrate best"
  },
  'evening': {
    energyPeak: 'evening',
    peakHours: ['17:00', '18:00', '19:00', '20:00'],
    displayReason: "You're an evening thinker - scheduled for your peak time"
  },
  'morning': {
    energyPeak: 'morning',
    peakHours: ['08:00', '09:00', '10:00', '11:00'],
    displayReason: "Mornings are your prime time - when you feel most energized"
  },
  'midday': {
    energyPeak: 'afternoon',
    peakHours: ['11:00', '12:00', '13:00', '14:00'],
    displayReason: "Midday is when you shine - peak performance hours"
  },
  'flexible': {
    energyPeak: 'morning',
    peakHours: ['09:00', '10:00', '14:00', '15:00'],
    displayReason: "Scheduled for common productive hours - we'll help you find your rhythm"
  },
  'very_early': {
    energyPeak: 'morning',
    peakHours: ['06:00', '07:00', '08:00'],
    displayReason: "Early mornings are your focus time - before the day gets busy"
  }
};

const DEFAULT_SCHEDULE: AssessmentScheduleMapping = {
  energyPeak: 'morning',
  peakHours: ['09:00', '10:00', '14:00', '15:00'],
  displayReason: "Scheduled for when most people feel focused",
  overwhelmStyle: 'gentle',
  supportStyle: 'encouragement',
  maxDailyItems: 3
};

export function useAssessmentToScheduling() {
  const { user } = useAuth();
  const [scheduleMapping, setScheduleMapping] = useState<AssessmentScheduleMapping>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);

  // Load assessment responses and convert to schedule preferences
  const loadAssessmentScheduling = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // First try to get from Supabase
      const { data: assessmentData } = await supabase
        .from('assessment_results')
        .select('responses, scores')
        .eq('user_id', user.id)
        .eq('completion_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      let responses: Record<string, string> = {};

      if (assessmentData && assessmentData.length > 0) {
        responses = (assessmentData[0].responses as Record<string, string>) || {};
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem('assessment_responses');
        if (stored) {
          responses = JSON.parse(stored);
        }
      }

      // Extract energy peak from various question formats
      const energyPeak = 
        responses['optimal_timing_1'] || 
        responses['optimal_timing_2'] || 
        responses['optimal_timing_3'] ||
        responses['energy_peak'] ||
        responses['rhythm_1'] ||
        'morning';

      // Get the schedule mapping for this energy peak
      const baseMapping = ENERGY_PEAK_TO_SCHEDULE[energyPeak] || ENERGY_PEAK_TO_SCHEDULE['morning'];

      // Determine overwhelm style from mood/fatigue responses
      const moodScore = responses['healing_1'] || responses['mood_1'];
      const overwhelmStyle: 'gentle' | 'direct' = 
        moodScore === 'constantly' || moodScore === 'often' ? 'gentle' : 'direct';

      // Determine support style from attention/planning responses
      const attentionScore = responses['attention_1'];
      const planningScore = responses['planning_1'];
      let supportStyle: 'reminders' | 'encouragement' | 'practical' = 'encouragement';
      
      if (attentionScore === 'impossible' || attentionScore === 'difficult') {
        supportStyle = 'reminders';
      } else if (planningScore === 'poor' || planningScore === 'very_poor') {
        supportStyle = 'practical';
      }

      // Determine max daily items based on rhythm/energy consistency
      const rhythmScore = responses['rhythm_1'];
      let maxDailyItems = 3;
      if (rhythmScore === 'exhausted' || rhythmScore === 'unpredictable') {
        maxDailyItems = 2;
      } else if (rhythmScore === 'very_consistent' || rhythmScore === 'mostly_consistent') {
        maxDailyItems = 5;
      }

      const mapping: AssessmentScheduleMapping = {
        ...baseMapping,
        overwhelmStyle,
        supportStyle,
        maxDailyItems
      };

      setScheduleMapping(mapping);

      // Save to localStorage for quick access
      localStorage.setItem(`schedule_mapping_${user.id}`, JSON.stringify(mapping));

    } catch (error) {
      console.error('Error loading assessment scheduling:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Try to load from localStorage first for faster initial render
    if (user) {
      const cached = localStorage.getItem(`schedule_mapping_${user.id}`);
      if (cached) {
        try {
          setScheduleMapping(JSON.parse(cached));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    loadAssessmentScheduling();
  }, [user, loadAssessmentScheduling]);

  // Get schedule reasoning for a specific time
  const getScheduleReasoning = useCallback((time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    
    if (scheduleMapping.peakHours.includes(time)) {
      return `💡 ${scheduleMapping.displayReason}`;
    }

    // Provide alternative reasoning
    if (hour >= 6 && hour < 12 && scheduleMapping.energyPeak === 'morning') {
      return '💡 Scheduled during your morning focus window';
    }
    if (hour >= 12 && hour < 17 && scheduleMapping.energyPeak === 'afternoon') {
      return '💡 Scheduled for your afternoon peak energy';
    }
    if (hour >= 17 && hour < 21 && scheduleMapping.energyPeak === 'evening') {
      return '💡 Scheduled for your evening concentration time';
    }

    return '💡 Scheduled based on your calendar availability';
  }, [scheduleMapping]);

  // Get time suggestions with reasoning
  const getTimeSuggestions = useCallback(() => {
    return scheduleMapping.peakHours.map((time, index) => ({
      time,
      label: index === 0 ? '⭐ Your peak energy time' : 'Good focus window',
      reason: scheduleMapping.displayReason
    }));
  }, [scheduleMapping]);

  // Sync assessment responses to schedule preferences (call after assessment completion)
  const syncAssessmentToScheduling = useCallback(async (responses: Record<string, string>) => {
    if (!user) return;

    // Save responses to localStorage
    localStorage.setItem('assessment_responses', JSON.stringify(responses));
    localStorage.setItem(`assessment_responses_${user.id}`, JSON.stringify(responses));

    // Reload the schedule mapping
    await loadAssessmentScheduling();
  }, [user, loadAssessmentScheduling]);

  return {
    scheduleMapping,
    isLoading,
    getScheduleReasoning,
    getTimeSuggestions,
    syncAssessmentToScheduling,
    refreshMapping: loadAssessmentScheduling
  };
}
