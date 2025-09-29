import React from 'react';
import { format, startOfWeek, endOfWeek, addDays, startOfYear, endOfYear, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, Trophy } from 'lucide-react';
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
  const getEmpoweringCompletion = (theme: string | undefined): string => {
    // Defensive check - ensure theme is a valid string
    if (!theme || typeof theme !== 'string') {
      return 'becoming the person I\'m meant to be';
    }

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
    // Defensive check - ensure currentTheme exists and has properties
    let relevantTheme = 'growth'; // default fallback
    
    if (currentTheme) {
      switch (viewType) {
        case 'day':
          relevantTheme = currentTheme.daily || 'growth';
          break;
        case 'week':
          relevantTheme = currentTheme.weekly || 'focus';
          break;
        case 'month':
          relevantTheme = currentTheme.monthly || 'balance';
          break;
        case 'year':
          relevantTheme = currentTheme.yearly || 'transformation';
          break;
        default:
          relevantTheme = currentTheme.current || 'growth';
      }
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

  // Calculate days remaining for different periods
  const getRemainingDaysInfo = () => {
    const now = new Date();
    
    switch (viewType) {
      case 'day':
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        return {
          remaining: 1,
          total: 1,
          label: "Today",
          percentage: 100
        };
      case 'week':
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        weekEnd.setHours(23, 59, 59, 999);
        const weekRemaining = Math.max(0, differenceInDays(weekEnd, now)) + 1;
        return {
          remaining: weekRemaining,
          total: 7,
          label: "This Week",
          percentage: ((7 - weekRemaining + 1) / 7) * 100
        };
      case 'month':
        const monthEnd = endOfMonth(now);
        monthEnd.setHours(23, 59, 59, 999);
        const monthRemaining = Math.max(0, differenceInDays(monthEnd, now)) + 1;
        const monthTotal = differenceInDays(monthEnd, startOfMonth(now)) + 1;
        return {
          remaining: monthRemaining,
          total: monthTotal,
          label: "This Month",
          percentage: ((monthTotal - monthRemaining + 1) / monthTotal) * 100
        };
      case 'year':
        const yearEnd = endOfYear(now);
        yearEnd.setHours(23, 59, 59, 999);
        const yearRemaining = Math.max(0, differenceInDays(yearEnd, now)) + 1;
        const yearTotal = differenceInDays(yearEnd, startOfYear(now)) + 1;
        return {
          remaining: yearRemaining,
          total: yearTotal,
          label: "This Year",
          percentage: ((yearTotal - yearRemaining + 1) / yearTotal) * 100
        };
      default:
        return {
          remaining: 1,
          total: 1,
          label: "Today",
          percentage: 100
        };
    }
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

  const remainingInfo = getRemainingDaysInfo();

  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-purple-700 italic">
            {getContextualStatement()}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{viewTitle}</h1>
          <p className="text-lg text-gray-600">{getDateInfo()}</p>
          
          {/* Professional Days Remaining Counter */}
          <div className="bg-white/50 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{remainingInfo.label}</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {remainingInfo.remaining}/{remainingInfo.total} days
              </Badge>
            </div>
            <Progress 
              value={remainingInfo.percentage} 
              className="h-2 bg-purple-100"
            />
            <p className="text-xs text-purple-600 mt-1 text-center">
              {remainingInfo.remaining} days remaining • {Math.round(remainingInfo.percentage)}% complete
            </p>
          </div>
        </div>
        
        {/* Enhanced Theme Display with Current Focus */}
        <div className="mt-4 pt-4 border-t border-purple-200/50 flex justify-center">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-purple-600" />
              <span className="text-purple-600">Theme: {currentTheme?.current || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600">Making progress daily</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}