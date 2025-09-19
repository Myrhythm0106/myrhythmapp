import React from 'react';
import { ThemeHierarchyDisplay } from '@/components/theme/ThemeHierarchyDisplay';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';

interface UnifiedHeaderProps {
  viewTitle: string;
  dateInfo: string;
  viewType?: 'day' | 'week' | 'month' | 'year';
  currentDate?: Date;
}

export function UnifiedHeader({ viewTitle, dateInfo, viewType = 'day', currentDate = new Date() }: UnifiedHeaderProps) {
  const { getThemeHierarchy } = useThemeHierarchy();
  const hierarchy = getThemeHierarchy(currentDate);

  // Generate contextual "I choose" statement based on view
  const getContextualStatement = () => {
    switch (viewType) {
      case 'day':
        return `Today, I choose to be... ${hierarchy.current}`;
      case 'week':
        return `This week, I choose to be... ${hierarchy.current}`;
      case 'month':
        return `This month, I choose to be... ${hierarchy.monthly}`;
      case 'year':
        return `This year, I choose... ${hierarchy.yearly.split(': ')[1] || hierarchy.yearly}`;
      default:
        return `Today, I choose to be... ${hierarchy.current}`;
    }
  };

  return (
    <div className="text-center mb-6 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary mb-2">
          {getContextualStatement()}
        </h1>
        <h2 className="text-lg font-semibold text-muted-foreground">
          {viewTitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dateInfo}
        </p>
      </div>
      
      {/* Theme breadcrumb for context */}
      <div className="pt-2 border-t border-muted/30">
        <ThemeHierarchyDisplay 
          date={currentDate} 
          variant="breadcrumb" 
          className="justify-center"
        />
      </div>
    </div>
  );
}