import React from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export function InsightsPanel() {
  const { filters } = useDashboard();
  const { actions } = useDailyActions();

  // Enhanced insights calculation with mock data for demo
  const getWeeklyInsights = () => {
    // Mock enhanced data for demonstration
    const mockInsights = {
      totalActions: 24,
      completed: 18,
      completionRate: 75,
      currentStreak: 5,
      topFocusArea: 'cognitive',
      topFocusCount: 8,
      improvements: [
        { area: 'Focus Time', value: 15, trend: 'up' },
        { area: 'Energy Level', value: 8, trend: 'up' },
        { area: 'Task Complexity', value: 12, trend: 'steady' }
      ],
      patterns: {
        bestHour: '10 AM',
        longestStreak: 12,
        favoriteCategory: 'Brain Training'
      }
    };
    
    return mockInsights;
  };

  const insights = getWeeklyInsights();

  const getFocusAreaColor = (focusArea: string) => {
    switch (focusArea) {
      case 'health': return 'memory-emerald';
      case 'cognitive': return 'brain-health';
      case 'emotional': return 'clarity-teal';
      case 'social': return 'sunrise-amber';
      default: return 'brain-health';
    }
  };

  const getFocusAreaEmoji = (focusArea: string) => {
    switch (focusArea) {
      case 'health': return '💪';
      case 'cognitive': return '🧠';
      case 'emotional': return '❤️';
      case 'social': return '👥';
      default: return '⭐';
    }
  };

  const getCompletionMessage = (rate: number) => {
    if (rate >= 80) return { 
      message: 'Extraordinary Excellence!', 
      emoji: '🏆', 
      color: 'beacon-600',
      subtitle: 'You are absolutely crushing your goals' 
    };
    if (rate >= 60) return { 
      message: 'Powerful Momentum!', 
      emoji: '🚀', 
      color: 'memory-emerald-600',
      subtitle: 'Keep riding this wave of success' 
    };
    if (rate >= 40) return { 
      message: 'Building Strength!', 
      emoji: '🌱', 
      color: 'brain-health-600',
      subtitle: 'Every step forward is progress' 
    };
    return { 
      message: 'Your Journey Begins!', 
      emoji: '✨', 
      color: 'clarity-teal-600',
      subtitle: 'Believe in your incredible potential' 
    };
  };

  const completion = getCompletionMessage(insights.completionRate);

  return (
    <div className="h-full space-y-5 relative overflow-hidden">
      {/* Hero Achievement Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-beacon-500/20 to-memory-emerald-500/20 flex items-center justify-center neural-pulse">
            <TrendingUp className="h-5 w-5 text-beacon-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm therapeutic-accent">Your Growth Story</h4>
            <p className="text-xs text-muted-foreground/80">This week's breakthroughs</p>
          </div>
        </div>
        
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-beacon-50/80 via-memory-emerald-50/60 to-brain-health-50/40 border border-beacon-200/40 neural-pathway-effect hover-scale transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
          <div className="relative text-center space-y-3">
            <span className="text-4xl" role="img" aria-label="achievement">
              {completion.emoji}
            </span>
            
            <div>
              <h3 className={cn("font-bold text-lg", `text-${completion.color}`)}>{completion.message}</h3>
              <p className="text-sm text-muted-foreground mt-1">{completion.subtitle}</p>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold therapeutic-accent">{insights.completionRate}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="text-center">
                <div className="text-2xl font-bold text-memory-emerald-600">{insights.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-brain-health-400 to-clarity-teal-400" />
          <h4 className="font-semibold text-sm therapeutic-accent">Performance Insights</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Top Focus Area */}
          <div className={cn(
            "relative p-4 rounded-xl border neural-pathway-effect hover-scale transition-all duration-300",
            `bg-gradient-to-br from-${getFocusAreaColor(insights.topFocusArea)}-50/80 to-brain-health-50/40`,
            `border-${getFocusAreaColor(insights.topFocusArea)}-200/60`
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img">
                  {getFocusAreaEmoji(insights.topFocusArea)}
                </span>
                <div>
                  <h5 className="font-semibold text-sm therapeutic-accent">Dominant Focus</h5>
                  <p className="text-xs text-muted-foreground capitalize">{insights.topFocusArea} mastery</p>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-xl font-bold", `text-${getFocusAreaColor(insights.topFocusArea)}-700`)}>
                  {insights.topFocusCount}
                </div>
                <div className="text-xs text-muted-foreground">actions</div>
              </div>
            </div>
          </div>

          {/* Performance Patterns */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-clarity-teal-50/80 to-brain-health-50/40 border border-clarity-teal-200/60 neural-pathway-effect hover-scale transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg" role="img">📈</span>
                <h5 className="font-semibold text-sm therapeutic-accent">Peak Performance</h5>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-sm font-bold text-clarity-teal-700">{insights.patterns.bestHour}</div>
                  <div className="text-xs text-muted-foreground">Best Hour</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-brain-health-700">{insights.patterns.longestStreak}</div>
                  <div className="text-xs text-muted-foreground">Record Streak</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-memory-emerald-700">85%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Trends */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-sunrise-amber-50/80 to-memory-emerald-50/40 border border-sunrise-amber-200/60 neural-pathway-effect hover-scale transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg" role="img">📊</span>
                <h5 className="font-semibold text-sm therapeutic-accent">Growth Trends</h5>
              </div>
              
              <div className="space-y-2">
                {insights.improvements.slice(0, 2).map((improvement, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{improvement.area}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-sunrise-amber-700">+{improvement.value}%</span>
                      <TrendingUp className="h-3 w-3 text-memory-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspirational Summary */}
      <div className="pt-4 border-t border-border/20">
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-beacon-50/60 to-memory-emerald-50/40 border border-beacon-200/40">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-beacon-400 to-memory-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold therapeutic-accent">Today's Potential</span>
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-beacon-400 to-memory-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">
              You're {insights.currentStreak > 3 ? 'unstoppable' : 'building momentum'}! 
              Your {insights.topFocusArea} focus is creating real transformation.
            </p>
          </div>
        </div>
      </div>

      {/* Floating motivation element */}
      <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
        <div className="text-3xl animate-pulse">📊</div>
      </div>
    </div>
  );
}