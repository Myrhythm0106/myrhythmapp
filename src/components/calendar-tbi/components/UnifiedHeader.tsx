import React from 'react';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';

interface UnifiedHeaderProps {
  viewTitle: string;
  dateInfo?: string;
  viewType?: 'day' | 'week' | 'month' | 'year';
  currentDate?: Date;
}

export function UnifiedHeader({ viewTitle, dateInfo, viewType = 'day', currentDate = new Date() }: UnifiedHeaderProps) {
  const { getCurrentTheme } = useThemeHierarchy();
  const currentTheme = getCurrentTheme(currentDate);

  // Helper function to generate empowering completions based on themes
  const getEmpoweringCompletion = (theme: string): string => {
    const themeCompletions: Record<string, string> = {
      'growth': 'evolving into my strongest self',
      'resilience': 'bouncing back with unwavering strength',
      'clarity': 'seeing my path with crystal-clear vision',
      'connection': 'building meaningful relationships that enrich my life',
      'courage': 'facing challenges with bold determination',
      'wisdom': 'learning and growing from every experience',
      'balance': 'finding harmony in all aspects of my life',
      'purpose': 'living with intentional meaning and direction',
      'gratitude': 'appreciating the abundance that surrounds me',
      'energy': 'radiating vitality and positive influence',
      'focus': 'channeling my attention toward what truly matters',
      'creativity': 'expressing my unique gifts and talents',
      'peace': 'cultivating inner calm and external harmony',
      'strength': 'tapping into my infinite inner power',
      'joy': 'embracing happiness and sharing it with others',
      'hope': 'believing in endless possibilities ahead',
      'love': 'opening my heart to give and receive deeply',
      'freedom': 'living authentically and without limitation',
      'abundance': 'recognizing the wealth of opportunities around me',
      'adventure': 'embracing new experiences with excitement',
      'compassion': 'extending kindness to myself and others',
      'mindfulness': 'present and aware in each precious moment',
      'transformation': 'embracing positive change as my natural state',
      'empowerment': 'stepping fully into my personal power',
      'healing': 'nurturing my body, mind, and spirit back to wholeness'
    };
    
    return themeCompletions[theme.toLowerCase()] || 'becoming the person I\'m meant to be';
  };

  // Generate contextual empowering statement
  const getContextualStatement = (): string => {
    let relevantTheme = '';
    switch (viewType) {
      case 'day':
        relevantTheme = currentTheme.daily;
        break;
      case 'week':
        relevantTheme = currentTheme.weekly;
        break;
      case 'month':
        relevantTheme = currentTheme.monthly;
        break;
      case 'year':
        relevantTheme = currentTheme.yearly;
        break;
      default:
        relevantTheme = currentTheme.current;
    }
    
    const completion = getEmpoweringCompletion(relevantTheme);
    
    const timeContext = {
      day: 'Today',
      week: 'This week',
      month: 'This month', 
      year: 'This year'
    }[viewType] || 'Today';
    
    return `${timeContext}, I choose to be ${completion}.`;
  };

  // Generate appropriate date info based on view type
  const getDateInfo = (): string => {
    if (dateInfo) return dateInfo;
    
    switch (viewType) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-purple-700 italic">
            {getContextualStatement()}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{viewTitle}</h1>
          <p className="text-lg text-gray-600">{getDateInfo()}</p>
        </div>
        
        {/* Simple Theme Display */}
        <div className="mt-4 pt-4 border-t border-purple-200/50 flex justify-center">
          <p className="text-sm text-purple-600">
            Current Theme: {currentTheme.current}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}