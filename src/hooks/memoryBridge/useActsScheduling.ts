import { useState, useCallback } from 'react';
import { ExtractedAction } from '@/types/memoryBridge';
import { smartScheduler, SmartScheduleSuggestion } from '@/utils/smartScheduler';
import { useAuth } from '@/contexts/AuthContext';
import { useTierEnhancedScheduling } from '@/hooks/useTierEnhancedScheduling';

export function useActsScheduling() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Record<string, SmartScheduleSuggestion[]>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, { date: string; time: string }>>({});
  
  const { generateTierEnhancedSuggestions } = useTierEnhancedScheduling();

  const generateSuggestionsForAction = useCallback(async (action: ExtractedAction) => {
    if (!user?.id || !action.id) return;

    setIsLoading(prev => ({ ...prev, [action.id!]: true }));

    try {
      const actionSuggestions = await generateTierEnhancedSuggestions(
        action,
        user.id,
        [] // watchers - could be passed from context if needed
      );

      setSuggestions(prev => ({
        ...prev,
        [action.id!]: actionSuggestions
      }));
    } catch (error) {
      console.error('Error generating schedule suggestions:', error);
      setSuggestions(prev => ({
        ...prev,
        [action.id!]: []
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [action.id!]: false }));
    }
  }, [user?.id]);

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