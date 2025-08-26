import { useMemo } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useMemoryBank } from '@/hooks/useMemoryBank';
import { useGratitude } from '@/hooks/use-gratitude';

interface ActionStats {
  badge: string;
  count: number;
}

export interface QuickActionStats {
  capture: ActionStats;
  memoryBank: ActionStats;
  calendar: ActionStats;
  goals: ActionStats;
  gratitude: ActionStats;
  brainGames: ActionStats;
  quickAdd: ActionStats;
}

export function useQuickActionStats(): QuickActionStats {
  const { filters } = useDashboard();
  const { actions, goals } = useDailyActions();
  const { extractedActions } = useMemoryBridge();
  const { memories } = useMemoryBank();
  const { entries } = useGratitude();

  return useMemo(() => {
    // Filter actions by timeframe
    const now = new Date();
    const selectedDate = filters.selectedDate;
    
    let startDate: Date;
    let endDate: Date = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    switch (filters.timeFrame) {
      case 'day':
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'month':
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(selectedDate.getFullYear(), 0, 1);
        endDate = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
    }

    // Calculate stats
    const filteredActions = actions.filter(action => {
      const actionDate = new Date(action.created_at);
      return actionDate >= startDate && actionDate <= endDate;
    });

    const pendingActions = filteredActions.filter(a => a.status === 'pending').length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const pendingExtracted = extractedActions.filter(a => a.status === 'pending').length;
    
    // Memory Bank: count memories in timeframe
    const memoriesInFrame = memories.filter(memory => {
      const memoryDate = new Date(memory.created_at);
      return memoryDate >= startDate && memoryDate <= endDate;
    }).length;

    // Gratitude: check today's entry
    const today = new Date();
    const todayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === today.toDateString();
    });

    return {
      capture: {
        badge: pendingExtracted > 0 ? `${pendingExtracted} to review` : 'Ready',
        count: pendingExtracted
      },
      memoryBank: {
        badge: memoriesInFrame > 0 ? `${memoriesInFrame} this ${filters.timeFrame}` : 'Add memory',
        count: memoriesInFrame
      },
      calendar: {
        badge: pendingActions > 0 ? `${pendingActions} pending` : 'All clear',
        count: pendingActions
      },
      goals: {
        badge: activeGoals > 0 ? `${activeGoals} active` : 'Create goal',
        count: activeGoals
      },
      gratitude: {
        badge: todayEntries.length > 0 ? 'Complete ✓' : 'Today\'s entry',
        count: todayEntries.length
      },
      brainGames: {
        badge: 'New session',
        count: 0
      },
      quickAdd: {
        badge: 'Fast',
        count: 0
      }
    };
  }, [actions, goals, extractedActions, memories, entries, filters.selectedDate, filters.timeFrame]);
}