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
    <div className={cn("flex bg-gray-100 rounded-xl p-1", className)}>
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={cn(
            "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px]",
            currentView === view.key
              ? "bg-white text-brand-emerald-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
