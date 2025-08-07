
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';

export type SortOption = 'meeting_date' | 'priority' | 'due_date' | 'action_type' | 'status';
export type SortOrder = 'asc' | 'desc';
export type FilterStatus = 'all' | 'pending' | 'completed' | 'overdue';
export type FilterType = 'all' | 'commitment' | 'promise' | 'task' | 'reminder' | 'follow_up';
export type FilterPriority = 'all' | 'high' | 'medium' | 'low';

interface PACTSortingControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  filterStatus: FilterStatus;
  filterType: FilterType;
  filterPriority: FilterPriority;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
  onFilterStatusChange: (status: FilterStatus) => void;
  onFilterTypeChange: (type: FilterType) => void;
  onFilterPriorityChange: (priority: FilterPriority) => void;
  totalPacts: number;
  filteredCount: number;
}

export function PACTSortingControls({
  sortBy,
  sortOrder,
  filterStatus,
  filterType,
  filterPriority,
  onSortChange,
  onFilterStatusChange,
  onFilterTypeChange,
  onFilterPriorityChange,
  totalPacts,
  filteredCount
}: PACTSortingControlsProps) {
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending for most relevant first
      const defaultOrder = newSortBy === 'priority' ? 'desc' : 
                          newSortBy === 'due_date' ? 'asc' : 'desc';
      onSortChange(newSortBy, defaultOrder);
    }
  };

  const getSortLabel = (option: SortOption) => {
    const labels = {
      meeting_date: 'Meeting Date',
      priority: 'Priority',
      due_date: 'Due Date',
      action_type: 'Action Type',
      status: 'Status'
    };
    return labels[option];
  };

  const getFilterStatusLabel = (status: FilterStatus) => {
    const labels = {
      all: 'All Status',
      pending: 'Pending',
      completed: 'Completed',
      overdue: 'Overdue'
    };
    return labels[status];
  };

  const getFilterTypeLabel = (type: FilterType) => {
    const labels = {
      all: 'All Types',
      commitment: 'Commitments',
      promise: 'Promises',
      task: 'Tasks',
      reminder: 'Reminders',
      follow_up: 'Follow-ups'
    };
    return labels[type];
  };

  const getFilterPriorityLabel = (priority: FilterPriority) => {
    const labels = {
      all: 'All Priorities',
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    };
    return labels[priority];
  };

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Sort by:</span>
        </div>
        
        <div className="flex gap-2">
          {(['meeting_date', 'priority', 'due_date', 'action_type'] as SortOption[]).map((option) => (
            <Button
              key={option}
              variant={sortBy === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange(option)}
              className="flex items-center gap-1"
            >
              {getSortLabel(option)}
              {sortBy === option && (
                sortOrder === 'asc' ? 
                <ArrowUp className="h-3 w-3" /> : 
                <ArrowDown className="h-3 w-3" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['all', 'pending', 'completed', 'overdue'] as FilterStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {getFilterStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['all', 'commitment', 'promise', 'task', 'reminder', 'follow_up'] as FilterType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {getFilterTypeLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {getFilterPriorityLabel(priority)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {filteredCount === totalPacts ? 
            `${totalPacts} PACTs` : 
            `${filteredCount} of ${totalPacts} PACTs`
          }
        </Badge>
        {filteredCount !== totalPacts && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              onFilterStatusChange('all');
              onFilterTypeChange('all');
              onFilterPriorityChange('all');
            }}
            className="text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
