import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from './useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { smartScheduler, SmartScheduleSuggestion } from '@/utils/smartScheduler';
import { ExtractedAction } from '@/types/memoryBridge';

interface LEAPInsights {
  cognitivePatterns: {
    peakFocusHours: string[];
    decisionFatiguePattern: 'morning' | 'afternoon' | 'evening';
    complexTaskPreference: 'start_of_day' | 'mid_day' | 'end_of_day';
  };
  emotionalPatterns: {
    motivationPeaks: string[];
    stressPatterns: 'morning_low' | 'afternoon_peak' | 'evening_wind_down';
  };
  historicalData: {
    averageCompletionTime: { [actionType: string]: number };
    successfulTimeSlots: string[];
    patternRecognition: any[];
  };
}

export function useTierEnhancedScheduling() {
  const { tier, hasFeature } = useSubscription();
  const { user } = useAuth();
  const [leapInsights, setLeapInsights] = useState<LEAPInsights | null>(null);
  const [familyCalendar, setFamilyCalendar] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load LEAP assessment insights for MyStretch tier
  useEffect(() => {
    if (tier === 'stretch' && user) {
      loadLEAPInsights();
    }
  }, [tier, user]);

  // Load family calendar for MyLeap tier
  useEffect(() => {
    if (tier === 'leap' && user) {
      loadFamilyCalendar();
    }
  }, [tier, user]);

  const loadLEAPInsights = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get assessment results
      const { data: assessmentData } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get historical action completion data
      const { data: actionsData } = await supabase
        .from('daily_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (assessmentData && actionsData) {
        // Generate LEAP insights from assessment and historical data
        const insights: LEAPInsights = {
          cognitivePatterns: {
            peakFocusHours: generatePeakHours(assessmentData, actionsData),
            decisionFatiguePattern: analyzeFatiguePattern(assessmentData),
            complexTaskPreference: analyzeComplexTaskTiming(actionsData)
          },
          emotionalPatterns: {
            motivationPeaks: analyzeMotivationPatterns(assessmentData, actionsData),
            stressPatterns: analyzeStressPatterns(assessmentData)
          },
          historicalData: {
            averageCompletionTime: calculateAverageCompletionTimes(actionsData),
            successfulTimeSlots: findSuccessfulTimeSlots(actionsData),
            patternRecognition: recognizePatterns(actionsData)
          }
        };
        
        setLeapInsights(insights);
      }
    } catch (error) {
      console.error('Error loading LEAP insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFamilyCalendar = async () => {
    if (!user) return;
    
    try {
      // Load family member calendars and shared events
      const { data: familyEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .or(`user_id.eq.${user.id},watchers.cs.{${user.id}}`);

      setFamilyCalendar(familyEvents || []);
    } catch (error) {
      console.error('Error loading family calendar:', error);
    }
  };

  const generateTierEnhancedSuggestions = useCallback(async (
    action: ExtractedAction, 
    watcherNames: string[] = []
  ): Promise<SmartScheduleSuggestion[]> => {
    if (!user) return [];

    try {
      // Get base suggestions from smart scheduler
      let suggestions = await smartScheduler.generateSmartSuggestions(action, user.id, watcherNames);

      // Enhance based on subscription tier
      switch (tier) {
        case 'starter':
          // Keep basic scheduling - already good
          break;
          
        case 'stretch':
          if (leapInsights) {
            suggestions = enhanceWithLEAPInsights(suggestions, action, leapInsights);
          }
          break;
          
        case 'leap':
          if (leapInsights) {
            suggestions = enhanceWithLEAPInsights(suggestions, action, leapInsights);
          }
          if (familyCalendar.length > 0) {
            suggestions = enhanceWithFamilyCalendar(suggestions, action, familyCalendar);
          }
          break;
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating tier-enhanced suggestions:', error);
      return [];
    }
  }, [tier, user, leapInsights, familyCalendar]);

  return {
    generateTierEnhancedSuggestions,
    leapInsights,
    familyCalendar,
    isLoading,
    tier,
    hasFeature
  };
}

// Helper functions for LEAP insights analysis
function generatePeakHours(assessmentData: any, actionsData: any[]): string[] {
  // Analyze when user completes tasks most successfully
  const hourCounts: { [hour: string]: number } = {};
  
  actionsData.forEach(action => {
    if (action.completed_at) {
      const hour = new Date(action.completed_at).getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    }
  });

  return Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => hour);
}

function analyzeFatiguePattern(assessmentData: any): 'morning' | 'afternoon' | 'evening' {
  const responses = assessmentData?.responses || {};
  // Analyze energy patterns from assessment
  if (responses.energy_time === 'morning') return 'afternoon';
  if (responses.energy_time === 'afternoon') return 'evening';
  return 'morning';
}

function analyzeComplexTaskTiming(actionsData: any[]): 'start_of_day' | 'mid_day' | 'end_of_day' {
  // Find when complex/high-priority tasks are completed most successfully
  const complexTasks = actionsData.filter(action => 
    action.action_type === 'goal_linked' || action.title.length > 50
  );
  
  const timingCounts = { start_of_day: 0, mid_day: 0, end_of_day: 0 };
  
  complexTasks.forEach(task => {
    if (task.completed_at) {
      const hour = new Date(task.completed_at).getHours();
      if (hour >= 6 && hour < 12) timingCounts.start_of_day++;
      else if (hour >= 12 && hour < 18) timingCounts.mid_day++;
      else timingCounts.end_of_day++;
    }
  });

  return Object.entries(timingCounts)
    .reduce((a, b) => timingCounts[a[0] as keyof typeof timingCounts] > timingCounts[b[0] as keyof typeof timingCounts] ? a : b)[0] as 'start_of_day' | 'mid_day' | 'end_of_day';
}

function analyzeMotivationPatterns(assessmentData: any, actionsData: any[]): string[] {
  // Find times when user shows highest completion rates
  return generatePeakHours(assessmentData, actionsData);
}

function analyzeStressPatterns(assessmentData: any): 'morning_low' | 'afternoon_peak' | 'evening_wind_down' {
  const responses = assessmentData?.responses || {};
  // Default pattern based on common cognitive load patterns
  return 'afternoon_peak';
}

function calculateAverageCompletionTimes(actionsData: any[]): { [actionType: string]: number } {
  const completionTimes: { [actionType: string]: number[] } = {};
  
  actionsData.forEach(action => {
    if (action.completed_at && action.created_at) {
      const completionTime = new Date(action.completed_at).getTime() - new Date(action.created_at).getTime();
      const type = action.action_type || 'regular';
      if (!completionTimes[type]) completionTimes[type] = [];
      completionTimes[type].push(completionTime / (1000 * 60 * 60)); // Convert to hours
    }
  });

  const averages: { [actionType: string]: number } = {};
  Object.entries(completionTimes).forEach(([type, times]) => {
    averages[type] = times.reduce((sum, time) => sum + time, 0) / times.length;
  });

  return averages;
}

function findSuccessfulTimeSlots(actionsData: any[]): string[] {
  return generatePeakHours({}, actionsData);
}

function recognizePatterns(actionsData: any[]): any[] {
  // Basic pattern recognition - can be enhanced
  return [];
}

function enhanceWithLEAPInsights(
  suggestions: SmartScheduleSuggestion[], 
  action: ExtractedAction, 
  insights: LEAPInsights
): SmartScheduleSuggestion[] {
  return suggestions.map(suggestion => {
    let enhancedConfidence = suggestion.confidence;
    let enhancedReason = suggestion.reason;

    // Boost confidence if time matches LEAP insights
    if (insights.cognitivePatterns.peakFocusHours.includes(suggestion.time)) {
      enhancedConfidence = Math.min(95, enhancedConfidence + 15);
      enhancedReason += " 🧠 Matches your cognitive peak from LEAP analysis!";
    }

    // Consider historical success patterns
    if (insights.historicalData.successfulTimeSlots.includes(suggestion.time)) {
      enhancedConfidence = Math.min(95, enhancedConfidence + 10);
      enhancedReason += " 📊 Historical data shows high success rate at this time!";
    }

    return {
      ...suggestion,
      confidence: enhancedConfidence,
      reason: enhancedReason
    };
  });
}

function enhanceWithFamilyCalendar(
  suggestions: SmartScheduleSuggestion[], 
  action: ExtractedAction, 
  familyCalendar: any[]
): SmartScheduleSuggestion[] {
  return suggestions.map(suggestion => {
    // Check for family calendar conflicts
    const conflicts = familyCalendar.filter(event => 
      event.date === suggestion.date && 
      Math.abs(new Date(`1970-01-01T${event.time}`).getTime() - new Date(`1970-01-01T${suggestion.time}`).getTime()) < 30 * 60 * 1000
    );

    if (conflicts.length === 0) {
      return {
        ...suggestion,
        confidence: Math.min(95, suggestion.confidence + 10),
        reason: suggestion.reason + " 👪 Family calendar is clear!"
      };
    } else {
      return {
        ...suggestion,
        confidence: Math.max(20, suggestion.confidence - 20),
        conflict: 'high' as const,
        reason: `⚠️ Family event conflict: ${conflicts[0].title}`
      };
    }
  });
}
