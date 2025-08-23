import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmpowermentNugget } from '@/components/empowerment/EmpowermentNugget';
import { Calendar, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommandCenterHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  currentView: 'day' | 'week' | 'month' | 'year';
  onViewChange: (view: 'day' | 'week' | 'month' | 'year') => void;
  onActionClick: () => void;
}

export function CommandCenterHeader({
  selectedDate,
  onDateChange,
  currentView,
  onViewChange,
  onActionClick
}: CommandCenterHeaderProps) {
  const views = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' }
  ] as const;

  const navigateDate = (direction: 'prev' | 'next') => {
    const amount = currentView === 'day' ? 1 : currentView === 'week' ? 7 : currentView === 'month' ? 30 : 365;
    const newDate = direction === 'prev' ? subDays(selectedDate, amount) : addDays(selectedDate, amount);
    onDateChange(newDate);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          
          {/* Top Row: Title, Empowerment, Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-brain-health-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                  Command Center
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {format(selectedDate, 'EEEE, MMMM d')}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <EmpowermentNugget variant="compact" />
              </div>
              <Button
                onClick={onActionClick}
                className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white font-medium shadow-sm transition-all duration-300"
              >
                <Zap className="h-4 w-4 mr-2" />
                Action
              </Button>
            </div>
          </div>

          {/* Bottom Row: Date Navigation & View Toggle */}
          <div className="flex items-center justify-between">
            
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm" 
                onClick={() => navigateDate('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm font-medium text-foreground/80 min-w-[120px] text-center">
                {format(selectedDate, currentView === 'day' ? 'MMM d, yyyy' : 
                        currentView === 'week' ? "'Week of' MMM d" :
                        currentView === 'month' ? 'MMMM yyyy' : 'yyyy')}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')} 
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-muted/50 rounded-lg p-1">
              {views.map((view) => (
                <Button
                  key={view.key}
                  variant={currentView === view.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(view.key)}
                  className={cn(
                    "h-7 px-3 text-xs font-medium transition-all",
                    currentView === view.key 
                      ? "bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile Empowerment Nugget */}
          <div className="lg:hidden">
            <EmpowermentNugget variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}