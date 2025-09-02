import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardMetric } from "@/hooks/useDashboardInsights";

interface MetricCardProps {
  metric: DashboardMetric;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const colorMap = {
  "memory-emerald": {
    bg: "from-memory-emerald-50 to-memory-emerald-100",
    border: "border-memory-emerald-200",
    text: "text-memory-emerald-700",
    accent: "text-memory-emerald-600",
    badge: "bg-memory-emerald-500"
  },
  "brain-health": {
    bg: "from-brain-health-50 to-brain-health-100",
    border: "border-brain-health-200",
    text: "text-brain-health-700",
    accent: "text-brain-health-600",
    badge: "bg-brain-health-500"
  },
  "clarity-teal": {
    bg: "from-clarity-teal-50 to-clarity-teal-100",
    border: "border-clarity-teal-200",
    text: "text-clarity-teal-700",
    accent: "text-clarity-teal-600",
    badge: "bg-clarity-teal-500"
  },
  "sunrise-amber": {
    bg: "from-sunrise-amber-50 to-sunrise-amber-100",
    border: "border-sunrise-amber-200",
    text: "text-sunrise-amber-700",
    accent: "text-sunrise-amber-600",
    badge: "bg-sunrise-amber-500"
  },
  "beacon": {
    bg: "from-beacon-50 to-beacon-100",
    border: "border-beacon-200",
    text: "text-beacon-700",
    accent: "text-beacon-600",
    badge: "bg-beacon-500"
  }
};

export function MetricCard({ metric, size = 'md', showDescription = true }: MetricCardProps) {
  const colors = colorMap[metric.color as keyof typeof colorMap] || colorMap["brain-health"];
  
  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const cardHeight = {
    sm: 'h-20',
    md: 'h-24',
    lg: 'h-32'
  };

  return (
    <Card className={cn(
      "premium-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in",
      `bg-gradient-to-br ${colors.bg}`,
      colors.border,
      cardHeight[size]
    )}>
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className={cn("text-xs font-medium", colors.text)}>
            {metric.title}
          </CardTitle>
          {showDescription && metric.description && (
            <div className="group relative">
              <Info className="h-3 w-3 text-gray-400 opacity-60 hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-5 hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                {metric.description}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3 px-4">
        <div className="space-y-2">
          {/* Main Value */}
          <div className="flex items-baseline gap-2">
            <span className={cn("text-2xl font-bold", colors.text)}>
              {metric.value}
            </span>
            {metric.unit && (
              <span className={cn("text-sm", colors.accent)}>
                {metric.unit}
              </span>
            )}
          </div>
          
          {/* Trend Indicator */}
          {metric.change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn("text-xs font-medium", getTrendColor())}>
                {metric.change > 0 ? '+' : ''}{metric.change}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}