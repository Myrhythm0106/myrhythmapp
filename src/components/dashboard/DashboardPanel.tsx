import React from 'react';
import { cn } from '@/lib/utils';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

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
        "group transition-all duration-300 overflow-hidden",
        panel.isCollapsed && `h-[${collapsedHeight}]`,
        !panel.isCollapsed && sizeClasses[panel.size || 'md'],
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-brain-health-50/40 to-clarity-teal-50/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="h-6 w-6 p-0 hover:bg-brain-health-100"
          >
            {panel.isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <h3 className="font-semibold text-foreground group-hover:text-brain-health-700 transition-colors">
            {panel.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {headerActions}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVisibility}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-brain-health-100 transition-all"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        panel.isCollapsed ? "h-0" : "h-full"
      )}>
        <div className="p-4 h-full">
          {children}
        </div>
      </div>

      {/* Collapsed Preview */}
      {panel.isCollapsed && (
        <div className="px-4 pb-2">
          <div className="text-sm text-muted-foreground line-clamp-2">
            {panel.title} - Click to expand and interact
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}