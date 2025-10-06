import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { useEmpowerment } from '@/contexts/EmpowermentContext';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';
import { useUserData } from '@/hooks/use-user-data';

export function DailyEmpowermentStatement() {
  const { 
    dailyStatement, 
    refreshStatement, 
    toggleFavorite,
    isLoading 
  } = useEmpowerment();
  
  const { getCurrentTheme } = useThemeHierarchy();
  const { yearly, monthly, weekly, current } = getCurrentTheme();
  const userData = useUserData();

  if (isLoading) {
    return (
      <Card className="p-10 bg-gradient-to-br from-sunrise-amber-50/40 via-white to-memory-emerald-50/30 border-2 border-sunrise-amber-200/50 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-16 bg-slate-200 rounded w-full mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
      </Card>
    );
  }

  if (!dailyStatement) {
    return null;
  }

  // Calculate streak days (mock for now - you can integrate with real streak data)
  const streakDays = 1;

  return (
    <Card className="p-10 bg-gradient-to-br from-sunrise-amber-50/40 via-white to-memory-emerald-50/30 border-2 border-sunrise-amber-200/50 hover:shadow-2xl hover:border-memory-emerald-300 transition-all duration-300">
      {/* Monthly/Weekly Theme Badge */}
      <div className="flex items-center gap-3 mb-6">
        <Badge className="bg-brain-health-50 text-brain-health-700 border border-brain-health-300 text-lg px-4 py-2">
          📅 {monthly}
        </Badge>
        <Badge className="bg-clarity-teal-50 text-clarity-teal-700 border border-clarity-teal-300 text-lg px-4 py-2">
          🎯 Week: {weekly}
        </Badge>
      </div>
      
      {/* Empowerment Statement */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-sunrise-amber-600 flex-shrink-0 mt-1" />
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            {dailyStatement.text}
          </h2>
        </div>
        
        {dailyStatement.subcategory && (
          <p className="text-xl text-slate-700 leading-relaxed ml-11">
            {dailyStatement.subcategory}
          </p>
        )}
      </div>
      
      {/* Context & Actions */}
      <div className="flex flex-wrap items-center gap-4 ml-11">
        <span className="text-xl text-slate-600">
          Day {streakDays} of your journey with <span className="font-semibold text-brain-health-700">#{current}</span>
        </span>
        
        <div className="flex gap-3 ml-auto">
          <Button 
            size="lg"
            variant="outline"
            onClick={() => refreshStatement()}
            className="h-14 border-2 border-slate-300 hover:border-memory-emerald-400 hover:bg-memory-emerald-50"
            aria-label="Get new statement"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          
          <Button 
            size="lg"
            onClick={() => toggleFavorite(dailyStatement.id)}
            className="h-14 bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Heart className="h-5 w-5 mr-2" />
            Save This
          </Button>
        </div>
      </div>
    </Card>
  );
}
