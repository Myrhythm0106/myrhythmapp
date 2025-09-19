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

  // Map themes to empowering sentence completions
  const getEmpoweringCompletion = (theme: string) => {
    const themeMap: Record<string, string> = {
      'persistent': 'persistent in achieving my goals',
      'persistence': 'persistent in achieving my goals',
      'focused': 'focused on what matters most',
      'focus': 'focused on what matters most',
      'growth': 'committed to my personal growth',
      'growing': 'committed to my personal growth',
      'strong': 'strong in mind and body',
      'strength': 'strong in mind and body',
      'calm': 'calm and centered in all I do',
      'peaceful': 'peaceful and present in this moment',
      'confident': 'confident in my abilities',
      'confidence': 'confident in my abilities',
      'resilient': 'resilient through every challenge',
      'resilience': 'resilient through every challenge',
      'mindful': 'mindful and aware in each moment',
      'mindfulness': 'mindful and aware in each moment',
      'empowered': 'empowered to create positive change',
      'empowerment': 'empowered to create positive change',
      'balanced': 'balanced in all aspects of my life',
      'balance': 'balanced in all aspects of my life'
    };
    
    const lowerTheme = theme.toLowerCase();
    return themeMap[lowerTheme] || `committed to being ${theme}`;
  };

  // Generate contextual "I choose" statement based on view
  const getContextualStatement = () => {
    const completion = getEmpoweringCompletion(hierarchy.current);
    
    switch (viewType) {
      case 'day':
        return `Today, I choose to be ${completion}`;
      case 'week':
        return `This week, I choose to be ${completion}`;
      case 'month':
        return `This month, I choose to be ${getEmpoweringCompletion(hierarchy.monthly)}`;
      case 'year':
        const yearlyTheme = hierarchy.yearly.split(': ')[1] || hierarchy.yearly;
        return `This year, I choose to embrace ${yearlyTheme.toLowerCase()}`;
      default:
        return `Today, I choose to be ${completion}`;
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