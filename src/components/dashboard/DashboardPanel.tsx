import React from 'react';
import { cn } from '@/lib/utils';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { usePanelSummaries } from '@/hooks/usePanelSummaries';
import { PanelSummary } from '@/components/dashboard/summaries/PanelSummary';
import { EmpoweringHeader } from '@/components/dashboard/summaries/EmpoweringHeader';

interface DashboardPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  collapsedHeight?: string;
  headerActions?: React.ReactNode;
}

export function DashboardPanel({ 
  id, 
  children, 
  className, 
  collapsedHeight = "80px",
  headerActions 
}: DashboardPanelProps) {
  const { panels, updatePanel } = useDashboard();
  const summaries = usePanelSummaries();
  const panel = panels.find(p => p.id === id);

  if (!panel || !panel.isVisible) return null;

  const toggleCollapsed = () => {
    updatePanel(id, { isCollapsed: !panel.isCollapsed });
  };

  const toggleVisibility = () => {
    updatePanel(id, { isVisible: !panel.isVisible });
  };

  const sizeClasses = {
    sm: 'min-h-[200px] max-h-[300px]',
    md: 'min-h-[300px] max-h-[500px]',
    lg: 'min-h-[400px] max-h-[700px]',
    xl: 'min-h-[500px] max-h-[900px]'
  };

  return (
    <SurfaceCard
      variant="elevated"
      padding="none"
      className={cn(
        "group transition-all duration-300 overflow-hidden flex flex-col",
        panel.isCollapsed && `h-[${collapsedHeight}]`,
        !panel.isCollapsed && sizeClasses[panel.size || 'md'],
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-brain-health-50/60 via-clarity-teal-50/40 to-memory-emerald-50/20 neural-pathway-effect relative overflow-hidden shrink-0">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brain-health-100/20 via-clarity-teal-100/20 to-memory-emerald-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex items-center gap-3 flex-1 min-w-0 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="h-7 w-7 p-0 hover:bg-brain-health-100 neural-pulse rounded-full shrink-0 transition-all hover:scale-105"
          >
            {panel.isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <EmpoweringHeader 
            title={panel.title} 
            isCollapsed={panel.isCollapsed}
            className="flex-1 min-w-0"
          />
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {headerActions}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVisibility}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-brain-health-100 transition-all hover:scale-105"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Panel Content with ScrollArea */}
      <div className={cn(
        "flex-1 transition-all duration-300 overflow-hidden flex flex-col",
        panel.isCollapsed ? "h-0" : "flex-1"
      )}>
        {!panel.isCollapsed && (
          <ScrollArea className="flex-1 h-full">
            <div className="p-4 min-h-0">
              {children}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Collapsed Preview - Glanceable Summary */}
      {panel.isCollapsed && (
        <div className="px-4 pb-3 animate-fade-in shrink-0">
          <PanelSummary 
            summaries={summaries[id as keyof typeof summaries] || []}
            layout="horizontal"
            className="justify-center"
          />
        </div>
      )}
    </SurfaceCard>
  );
}