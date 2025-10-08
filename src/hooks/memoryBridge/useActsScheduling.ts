import { useState, useCallback } from 'react';
import { ExtractedAction } from '@/types/memoryBridge';
import { smartScheduler, SmartScheduleSuggestion } from '@/utils/smartScheduler';
import { useAuth } from '@/hooks/useAuth';
import { useTierEnhancedScheduling } from '@/hooks/useTierEnhancedScheduling';
import { supabase } from '@/integrations/supabase/client';

export function useActsScheduling() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Record<string, SmartScheduleSuggestion[]>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, { date: string; time: string }>>({});
  
  const { generateTierEnhancedSuggestions } = useTierEnhancedScheduling();

  // Fetch user's assessment data for energy-aware scheduling
  const fetchAssessmentData = useCallback(async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('assessment_results')
      .select('scores, responses, raw_assessment_data')
      .eq('user_id', user.id)
      .eq('completion_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching assessment data:', error);
      return null;
    }
    
    return data;
  }, [user]);

  // Map action types to optimal times based on ASSESSMENT RESPONSES (energy_peak, optimal_work_time)
  const getOptimalTimeFromAssessment = useCallback((action: ExtractedAction, assessmentData: any) => {
    if (!assessmentData) return null;
    
    const responses = assessmentData.responses || {};
    
    // Map action verb categories to energy requirements
    const actionEnergyMap: Record<string, 'high' | 'medium' | 'low'> = {
      'problem-solving': 'high',
      'creative': 'high',
      'communication': 'medium',
      'routine': 'low',
      'physical': 'medium'
    };
    
    const requiredEnergy = actionEnergyMap[action.verb_category || 'routine'] || 'medium';
    
    // PRIORITY 1: Use user's stated optimal_work_time preference
    const optimalWorkTime = responses.optimal_work_time;
    if (optimalWorkTime) {
      const workTimeMap: Record<string, string> = {
        'early_morning_focus': requiredEnergy === 'high' ? '07:00' : '08:00',
        'mid_morning_focus': requiredEnergy === 'high' ? '09:00' : '10:00',
        'afternoon_focus': requiredEnergy === 'high' ? '14:00' : '15:00',
        'evening_focus': requiredEnergy === 'high' ? '17:00' : '18:00'
      };
      
      if (workTimeMap[optimalWorkTime]) {
        return workTimeMap[optimalWorkTime];
      }
    }
    
    // FALLBACK: Use energy_peak if optimal_work_time not available
    const energyPeak = responses.energy_peak;
    if (energyPeak) {
      const energyPeakMap: Record<string, string> = {
        'early_morning': requiredEnergy === 'high' ? '07:30' : '08:30',
        'mid_morning': requiredEnergy === 'high' ? '09:30' : '10:30',
        'afternoon': requiredEnergy === 'high' ? '14:30' : '15:30',
        'evening': requiredEnergy === 'high' ? '17:30' : '18:30',
        'varies_daily': '10:00' // Default to mid-morning
      };
      
      if (energyPeakMap[energyPeak]) {
        return energyPeakMap[energyPeak];
      }
    }
    
    // DEFAULT: Mid-morning
    return '10:00';
  }, []);

  // Adjust scheduling based on cognitive challenge profile
  const adjustForCognitiveProfile = useCallback((suggestion: any, assessmentData: any) => {
    if (!assessmentData) return suggestion;
    
    const responses = assessmentData.responses || {};
    const mindsetChallenge = responses.mindset_challenge;
    
    // Add personalized reasons based on user's stated challenges
    const challengeInsights: Record<string, string> = {
      'attention_drift': 'Scheduled during your focus window to minimize distractions',
      'memory_gaps': 'Timed for optimal recall and retention',
      'mental_fatigue': 'Aligned with your peak energy to avoid brain fog',
      'task_switching': 'Positioned to reduce cognitive load from multitasking',
      'professional_performance': 'Optimized for peak professional effectiveness',
      'strategic_thinking': 'Scheduled for your best analytical clarity'
    };
    
    if (mindsetChallenge && challengeInsights[mindsetChallenge]) {
      return {
        ...suggestion,
        reason: `${suggestion.reason} - ${challengeInsights[mindsetChallenge]}`,
        assessmentAligned: true
      };
    }
    
    return { ...suggestion, assessmentAligned: false };
  }, []);

  // Determine duration based on confidence score
  const getConfidenceBasedDuration = useCallback((action: ExtractedAction) => {
    const confidence = action.confidence_score || 0.5;
    
    if (confidence >= 0.8) {
      return 15; // High confidence = 15 min
    } else if (confidence >= 0.6) {
      return 30; // Medium confidence = 30 min
    } else {
      return 45; // Low confidence = 45 min with buffer
    }
  }, []);

  // Generate scheduling suggestions for a single action (enhanced with assessment data)
  const generateSuggestionsForAction = useCallback(async (action: ExtractedAction) => {
    if (!user?.id || !action.id) return;

    setIsLoading(prev => ({ ...prev, [action.id!]: true }));

    try {
      // Fetch assessment data
      const assessmentData = await fetchAssessmentData();
      
      // Get base suggestions from tier-enhanced scheduling
      const baseSuggestions = await generateTierEnhancedSuggestions(
        action,
        [] // watchers - could be passed from context if needed
      );

      // Enhance suggestions with DEEP assessment-based intelligence
      if (assessmentData) {
        const optimalTime = getOptimalTimeFromAssessment(action, assessmentData);
        const duration = getConfidenceBasedDuration(action);
        const responses = assessmentData.responses || {};
        
        // Build personalized reason referencing user's assessment
        // Safely access energy_peak property
        const energyPeakValue = (responses && typeof responses === 'object' && !Array.isArray(responses)) 
          ? (responses as Record<string, any>).energy_peak 
          : '';
        const energyPeak = typeof energyPeakValue === 'string' ? energyPeakValue : '';
        const energyPeakLabel = energyPeak === 'early_morning' ? 'early morning' :
                                energyPeak === 'mid_morning' ? 'mid-morning' :
                                energyPeak === 'afternoon' ? 'afternoon' :
                                energyPeak === 'evening' ? 'evening' : 'your optimal';
        
        const enhancedSuggestions = baseSuggestions.map(sug => {
          let enhanced: SmartScheduleSuggestion = { ...sug, duration };
          
          // Boost confidence for times matching user's stated preferences
          if (optimalTime && sug.time === optimalTime) {
            enhanced = {
              ...enhanced,
              confidence: Math.min((sug.confidence || 0.5) + 0.3, 1.0),
              reason: `Matches your ${energyPeakLabel} energy peak! ${sug.reason || ''}`,
              assessmentAligned: true
            };
          }
          
          // Apply cognitive profile adjustments
          return adjustForCognitiveProfile(enhanced, assessmentData);
        });
        
        setSuggestions(prev => ({
          ...prev,
          [action.id!]: enhancedSuggestions
        }));
      } else {
        setSuggestions(prev => ({
          ...prev,
          [action.id!]: baseSuggestions
        }));
      }
    } catch (error) {
      console.error('Error generating schedule suggestions:', error);
      setSuggestions(prev => ({
        ...prev,
        [action.id!]: []
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [action.id!]: false }));
    }
  }, [user?.id, fetchAssessmentData, generateTierEnhancedSuggestions, getOptimalTimeFromAssessment, getConfidenceBasedDuration]);

  const generateSuggestionsForMultipleActions = useCallback(async (actions: ExtractedAction[]) => {
    if (!user?.id) return;

    const promises = actions.map(action => generateSuggestionsForAction(action));
    await Promise.all(promises);
  }, [user?.id, generateSuggestionsForAction]);

  const selectTimeForAction = useCallback((actionId: string, date: string, time: string) => {
    setSelectedTimes(prev => ({
      ...prev,
      [actionId]: { date, time }
    }));
  }, []);

  const getSelectedTime = useCallback((actionId: string) => {
    return selectedTimes[actionId];
  }, [selectedTimes]);

  const clearSuggestions = useCallback(() => {
    setSuggestions({});
    setIsLoading({});
    setSelectedTimes({});
  }, []);

  const getBestSuggestionForAction = useCallback((actionId: string): SmartScheduleSuggestion | null => {
    const actionSuggestions = suggestions[actionId];
    if (!actionSuggestions || actionSuggestions.length === 0) return null;
    
    // Return the highest confidence suggestion
    return actionSuggestions.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }, [suggestions]);

  const getConflictLevel = useCallback((actionId: string): 'none' | 'low' | 'high' => {
    const bestSuggestion = getBestSuggestionForAction(actionId);
    return bestSuggestion?.conflictLevel || 'none';
  }, [getBestSuggestionForAction]);

  return {
    suggestions,
    isLoading,
    selectedTimes,
    generateSuggestionsForAction,
    generateSuggestionsForMultipleActions,
    selectTimeForAction,
    getSelectedTime,
    clearSuggestions,
    getBestSuggestionForAction,
    getConflictLevel
  };
}
