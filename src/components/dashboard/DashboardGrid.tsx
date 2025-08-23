import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';
import { DashboardPanel } from './DashboardPanel';
import { CalendarPanel } from './panels/CalendarPanel';
import { GoalsPanel } from './panels/GoalsPanel';
import { ActionsPanel } from './panels/ActionsPanel';
import { RemindersPanel } from './panels/RemindersPanel';
import { FocusPanel } from './panels/FocusPanel';
import { InsightsPanel } from './panels/InsightsPanel';

interface DashboardGridProps {
  className?: string;
}

export function DashboardGrid({ className }: DashboardGridProps) {
  const { panels } = useDashboard();

  const renderPanel = (panelId: string) => {
    switch (panelId) {
      case 'calendar':
        return (
          <DashboardPanel id="calendar" collapsedHeight="120px">
            <CalendarPanel />
          </DashboardPanel>
        );
      case 'goals':
        return (
          <DashboardPanel id="goals" collapsedHeight="100px">
            <GoalsPanel />
          </DashboardPanel>
        );
      case 'actions':
        return (
          <DashboardPanel id="actions" collapsedHeight="100px">
            <ActionsPanel />
          </DashboardPanel>
        );
      case 'reminders':
        return (
          <DashboardPanel id="reminders" collapsedHeight="80px">
            <RemindersPanel />
          </DashboardPanel>
        );
      case 'focus':
        return (
          <DashboardPanel id="focus" collapsedHeight="90px">
            <FocusPanel />
          </DashboardPanel>
        );
      case 'insights':
        return (
          <DashboardPanel id="insights" collapsedHeight="80px">
            <InsightsPanel />
          </DashboardPanel>
        );
      default:
        return null;
    }
  };

  const visiblePanels = panels
    .filter(p => p.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={cn(
      "grid gap-6 auto-rows-min",
      "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
      "min-h-0", // Important for proper grid behavior
      className
    )}>
      {visiblePanels.map(panel => (
        <div
          key={panel.id}
          className={cn(
            "min-h-0", // Important for panel sizing
            // Responsive column spans based on panel size
            panel.size === 'xl' && "lg:col-span-2 xl:col-span-3",
            panel.size === 'lg' && "lg:col-span-2 xl:col-span-2",
            panel.size === 'md' && "lg:col-span-1 xl:col-span-1",
            panel.size === 'sm' && "lg:col-span-1 xl:col-span-1"
          )}
        >
          {renderPanel(panel.id)}
        </div>
      ))}
    </div>
  );
}