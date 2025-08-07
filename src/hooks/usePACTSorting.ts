
import { useState, useMemo, useEffect } from 'react';
import { ExtractedAction } from '@/types/memoryBridge';
import { SortOption, SortOrder, FilterStatus, FilterType, FilterPriority } from '@/components/memoryBridge/PACTSortingControls';
import { isAfter, isBefore, parseISO } from 'date-fns';

interface UsePACTSortingProps {
  actions: ExtractedAction[];
}

export function usePACTSorting({ actions }: UsePACTSortingProps) {
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('pact-sorting-preferences');
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        setSortBy(prefs.sortBy || 'priority');
        setSortOrder(prefs.sortOrder || 'desc');
        setFilterStatus(prefs.filterStatus || 'all');
        setFilterType(prefs.filterType || 'all');
        setFilterPriority(prefs.filterPriority || 'all');
      } catch (error) {
        console.error('Failed to load PACT sorting preferences:', error);
      }
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    const prefs = {
      sortBy,
      sortOrder,
      filterStatus,
      filterType,
      filterPriority
    };
    localStorage.setItem('pact-sorting-preferences', JSON.stringify(prefs));
  }, [sortBy, sortOrder, filterStatus, filterType, filterPriority]);

  const sortedAndFilteredActions = useMemo(() => {
    let filtered = [...actions];

    // Apply filters
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(action => 
          action.due_date && isBefore(parseISO(action.due_date), new Date())
        );
      } else {
        filtered = filtered.filter(action => action.status === filterStatus);
      }
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(action => action.action_type === filterType);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(action => {
        const priority = action.priority_level;
        if (filterPriority === 'high') return priority >= 8;
        if (filterPriority === 'medium') return priority >= 5 && priority < 8;
        if (filterPriority === 'low') return priority < 5;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'meeting_date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'priority':
          comparison = a.priority_level - b.priority_level;
          break;
        case 'due_date':
          if (!a.due_date && !b.due_date) comparison = 0;
          else if (!a.due_date) comparison = 1;
          else if (!b.due_date) comparison = -1;
          else comparison = parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime();
          break;
        case 'action_type':
          comparison = a.action_type.localeCompare(b.action_type);
          break;
        case 'status':
          const statusOrder = { pending: 0, confirmed: 1, completed: 2, rejected: 3, modified: 4 };
          comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [actions, sortBy, sortOrder, filterStatus, filterType, filterPriority]);

  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return {
    sortBy,
    sortOrder,
    filterStatus,
    filterType,
    filterPriority,
    sortedAndFilteredActions,
    handleSortChange,
    setFilterStatus,
    setFilterType,
    setFilterPriority,
    totalCount: actions.length,
    filteredCount: sortedAndFilteredActions.length
  };
}
