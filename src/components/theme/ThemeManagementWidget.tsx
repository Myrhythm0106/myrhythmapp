import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Settings, Calendar, Target } from 'lucide-react';
import { YearlyThemeCustomizer } from './YearlyThemeCustomizer';
import { EnhancedMonthlyThemeCustomizer } from './EnhancedMonthlyThemeCustomizer';
import { ThemeHierarchyDisplay } from './ThemeHierarchyDisplay';

interface ThemeManagementWidgetProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export function ThemeManagementWidget({ variant = 'compact', className = '' }: ThemeManagementWidgetProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  if (variant === 'compact') {
    return (
      <Card className={`bg-gradient-to-br from-brand-teal-50 to-brand-emerald-50 border-brand-teal-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <ThemeHierarchyDisplay variant="breadcrumb" className="flex-1" />
            <div className="flex gap-1 ml-2">
              <YearlyThemeCustomizer currentYear={currentYear} />
              <EnhancedMonthlyThemeCustomizer 
                currentMonth={currentMonth} 
                currentYear={currentYear} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          My Theme Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Theme Display */}
        <div className="bg-gradient-to-br from-brand-teal-50 to-brand-emerald-50 p-4 rounded-lg border border-brand-teal-200">
          <ThemeHierarchyDisplay variant="full" />
        </div>

        {/* Management Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentYear} Theme</span>
            </div>
            <YearlyThemeCustomizer currentYear={currentYear} />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Monthly Focus</span>
            </div>
            <EnhancedMonthlyThemeCustomizer 
              currentMonth={currentMonth} 
              currentYear={currentYear} 
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border border-brain-health-200 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="h-4 w-4 text-brain-health-600 mt-0.5" />
            <div>
              <p className="text-xs text-brain-health-700 font-medium">
                Smart Theme System
              </p>
              <p className="text-xs text-brain-health-600">
                Your themes create a powerful hierarchy: Year → Month → Week/Day, giving every moment deeper meaning and connection to your bigger purpose.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}