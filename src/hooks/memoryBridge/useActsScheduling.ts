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

  // Map action types to optimal times based on assessment
  const getOptimalTimeFromAssessment = useCallback((action: ExtractedAction, assessmentData: any) => {
    if (!assessmentData) return null;
    
    const scores = assessmentData.scores || {};
    const energyLevel = scores.energy_level || 5;
    
    // Map action verb categories to energy requirements
    const actionEnergyMap: Record<string, 'high' | 'medium' | 'low'> = {
      'problem-solving': 'high',
      'creative': 'high',
      'communication': 'medium',
      'routine': 'low',
      'physical': 'medium'
    };
    
    const requiredEnergy = actionEnergyMap[action.verb_category || 'routine'] || 'medium';
    
    // Suggest times based on energy levels
    if (energyLevel >= 7) {
      // High energy users - morning tasks
      if (requiredEnergy === 'high') return '09:00';
      if (requiredEnergy === 'medium') return '10:30';
      return '14:00';
    } else if (energyLevel >= 4) {
      // Medium energy users - spread throughout day
      if (requiredEnergy === 'high') return '10:00';
      if (requiredEnergy === 'medium') return '14:00';
      return '11:00';
    } else {
      // Low energy users - lighter tasks early, avoid demanding tasks
      if (requiredEnergy === 'high') return '11:00'; // Later morning
      if (requiredEnergy === 'medium') return '10:00';
      return '09:00';
    }
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

      // Enhance suggestions with assessment-based intelligence
      if (assessmentData) {
        const optimalTime = getOptimalTimeFromAssessment(action, assessmentData);
        const duration = getConfidenceBasedDuration(action);
        
        // If we have optimal time, boost that suggestion's confidence
        const enhancedSuggestions = baseSuggestions.map(sug => {
          if (optimalTime && sug.time === optimalTime) {
            return {
              ...sug,
              confidence: Math.min((sug.confidence || 0.5) + 0.2, 1.0),
              reason: `${sug.reason || ''} (Optimal for your energy level)`,
              duration
            };
          }
          return { ...sug, duration };
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
