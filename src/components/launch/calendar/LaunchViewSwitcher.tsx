import React from 'react';
import { cn } from '@/lib/utils';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

interface LaunchViewSwitcherProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  className?: string;
}

const views: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function LaunchViewSwitcher({ 
  currentView, 
  onViewChange,
  className = '' 
}: LaunchViewSwitcherProps) {
  return (
    <div className={cn("flex gap-1 bg-muted rounded-xl p-1", className)}>
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={cn(
            "flex-1 px-2 text-base font-medium rounded-lg transition-all duration-200 min-h-14",
            currentView === view.key
              ? "bg-background text-launch-teal shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
