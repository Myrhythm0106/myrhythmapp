import React from "react";
import { cn } from "@/lib/utils";
import { MetricCard } from "./MetricCard";
import { DashboardMetric } from "@/hooks/useDashboardInsights";

interface MetricColumnProps {
  title: string;
  metrics: DashboardMetric[];
  className?: string;
}

export function MetricColumn({ title, metrics, className }: MetricColumnProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold gradient-text-brand">{title}</h3>
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={`${metric.title}-${index}`} 
            metric={metric} 
            size="md"
          />
        ))}
      </div>
    </div>
  );
}