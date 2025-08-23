import React from 'react';
import { PanelSummary as PanelSummaryType } from '@/hooks/usePanelSummaries';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PanelSummaryProps {
  summaries: PanelSummaryType[];
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function PanelSummary({ summaries, layout = 'horizontal', className }: PanelSummaryProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'steady') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-memory-emerald-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-sunrise-amber-500" />;
      case 'steady':
        return <Minus className="h-3 w-3 text-brain-health-400" />;
      default:
        return null;
    }
  };

  const getColorClasses = (color?: string) => {
    const colorMap = {
      'brain-health': 'text-brain-health-600 bg-brain-health-50 border-brain-health-200',
      'clarity-teal': 'text-clarity-teal-600 bg-clarity-teal-50 border-clarity-teal-200',
      'memory-emerald': 'text-memory-emerald-600 bg-memory-emerald-50 border-memory-emerald-200',
      'sunrise-amber': 'text-sunrise-amber-600 bg-sunrise-amber-50 border-sunrise-amber-200',
      'beacon': 'text-beacon-600 bg-beacon-50 border-beacon-200',
    };
    return colorMap[color as keyof typeof colorMap] || 'text-foreground bg-background border-border';
  };

  return (
    <div className={cn(
      'flex gap-3',
      layout === 'vertical' && 'flex-col',
      className
    )}>
      {summaries.map((summary, index) => (
        <div
          key={index}
          className={cn(
            'group flex items-center gap-2 rounded-lg border px-3 py-2 transition-all hover:scale-105',
            getColorClasses(summary.color),
            layout === 'vertical' && 'w-full'
          )}
        >
          {summary.icon && (
            <span className="text-lg" role="img" aria-label={summary.title}>
              {summary.icon}
            </span>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium opacity-75">
                {summary.title}
              </span>
              {getTrendIcon(summary.trend)}
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold">
                {summary.value}
              </span>
              {summary.subtext && (
                <span className="text-xs opacity-60 truncate">
                  {summary.subtext}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}