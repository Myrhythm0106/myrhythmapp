
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PACTPriorityIndicatorProps {
  priority: number;
  className?: string;
  showText?: boolean;
}

export function PACTPriorityIndicator({ priority, className, showText = true }: PACTPriorityIndicatorProps) {
  const getPriorityConfig = (priority: number) => {
    if (priority >= 8) {
      return {
        level: 'high',
        label: 'High',
        color: 'destructive',
        icon: AlertCircle,
        stars: 3
      };
    } else if (priority >= 5) {
      return {
        level: 'medium',
        label: 'Medium',
        color: 'secondary',
        icon: Star,
        stars: 2
      };
    } else {
      return {
        level: 'low',
        label: 'Low',
        color: 'outline',
        icon: Circle,
        stars: 1
      };
    }
  };

  const config = getPriorityConfig(priority);
  const IconComponent = config.icon;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Star indicators */}
      <div className="flex items-center">
        {Array.from({ length: 3 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < config.stars 
                ? config.level === 'high' 
                  ? "text-red-500 fill-red-500"
                  : config.level === 'medium'
                  ? "text-orange-500 fill-orange-500"
                  : "text-green-500 fill-green-500"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
      
      {showText && (
        <Badge variant={config.color as any} className="text-xs">
          <IconComponent className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      )}
    </div>
  );
}
