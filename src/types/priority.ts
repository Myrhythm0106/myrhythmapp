export type Priority = 'high' | 'medium' | 'low';

export interface PriorityConfig {
  label: string;
  value: Priority;
  color: string;
  description: string;
  numericValue: number; // For backward compatibility and sorting
}

export const priorityLevels: Record<Priority, PriorityConfig> = {
  high: {
    label: 'High Priority',
    value: 'high',
    color: 'text-destructive',
    description: 'Life-changing moment - unstoppable! 🔥',
    numericValue: 5
  },
  medium: {
    label: 'Medium Priority',
    value: 'medium', 
    color: 'text-warning',
    description: 'Meaningful progress awaits! ⚡',
    numericValue: 3
  },
  low: {
    label: 'Low Priority', 
    value: 'low',
    color: 'text-muted-foreground',
    description: 'When time allows - no pressure! 😌',
    numericValue: 1
  }
};

// Helper functions for conversion
export const numericToPriority = (numeric: number): Priority => {
  if (numeric >= 4) return 'high';
  if (numeric >= 2) return 'medium';
  return 'low';
};

export const priorityToNumeric = (priority: Priority): number => {
  return priorityLevels[priority].numericValue;
};