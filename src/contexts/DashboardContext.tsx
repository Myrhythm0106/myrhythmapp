import React, { createContext, useContext, useState, useCallback } from 'react';

export type TimeFrame = 'day' | 'week' | 'month' | 'year';

export interface DashboardFilters {
  selectedDate: Date;
  timeFrame: TimeFrame;
  goalFilter?: string;
  priorityFilter?: 'all' | 'high' | 'medium' | 'low';
  statusFilter?: 'all' | 'pending' | 'completed' | 'in-progress';
}

export interface PanelState {
  id: string;
  title: string;
  isCollapsed: boolean;
  isVisible: boolean;
  order: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface DashboardContextType {
  filters: DashboardFilters;
  updateFilters: (newFilters: Partial<DashboardFilters>) => void;
  panels: PanelState[];
  updatePanel: (id: string, updates: Partial<PanelState>) => void;
  reorderPanels: (panelIds: string[]) => void;
  syncDate: (date: Date) => void;
  syncTimeFrame: (timeFrame: TimeFrame) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultPanels: PanelState[] = [
  { id: 'calendar', title: 'Calendar & Timeline', isCollapsed: false, isVisible: true, order: 0, size: 'lg' },
  { id: 'goals', title: 'Goals & Priorities', isCollapsed: false, isVisible: true, order: 1, size: 'md' },
  { id: 'actions', title: 'Actions & Tasks', isCollapsed: false, isVisible: true, order: 2, size: 'md' },
  { id: 'reminders', title: 'Reminders & Notifications', isCollapsed: true, isVisible: true, order: 3, size: 'sm' },
  { id: 'focus', title: 'Focus & Energy', isCollapsed: false, isVisible: true, order: 4, size: 'sm' },
  { id: 'insights', title: 'Progress & Insights', isCollapsed: true, isVisible: true, order: 5, size: 'sm' }
];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>({
    selectedDate: new Date(),
    timeFrame: 'month',
    goalFilter: undefined,
    priorityFilter: 'all',
    statusFilter: 'all'
  });

  const [panels, setPanels] = useState<PanelState[]>(defaultPanels);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updatePanel = useCallback((id: string, updates: Partial<PanelState>) => {
    setPanels(prev => prev.map(panel => 
      panel.id === id ? { ...panel, ...updates } : panel
    ));
  }, []);

  const reorderPanels = useCallback((panelIds: string[]) => {
    setPanels(prev => {
      const newPanels = [...prev];
      panelIds.forEach((id, index) => {
        const panel = newPanels.find(p => p.id === id);
        if (panel) {
          panel.order = index;
        }
      });
      return newPanels.sort((a, b) => a.order - b.order);
    });
  }, []);

  const syncDate = useCallback((date: Date) => {
    updateFilters({ selectedDate: date });
  }, [updateFilters]);

  const syncTimeFrame = useCallback((timeFrame: TimeFrame) => {
    updateFilters({ timeFrame });
  }, [updateFilters]);

  const value = {
    filters,
    updateFilters,
    panels,
    updatePanel,
    reorderPanels,
    syncDate,
    syncTimeFrame
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}