
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface PACTDueDateBadgeProps {
  dueDate?: string;
  className?: string;
}

export function PACTDueDateBadge({ dueDate, className }: PACTDueDateBadgeProps) {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const threeDaysFromNow = addDays(now, 3);
  
  const isOverdue = isBefore(due, now);
  const isDueSoon = isAfter(due, now) && isBefore(due, threeDaysFromNow);
  const timeText = formatDistanceToNow(due, { addSuffix: !isOverdue });

  const getBadgeConfig = () => {
    if (isOverdue) {
      return {
        variant: 'destructive' as const,
        icon: AlertTriangle,
        label: `Overdue ${formatDistanceToNow(due)}`,
        className: 'text-red-700 bg-red-50 border-red-200'
      };
    } else if (isDueSoon) {
      return {
        variant: 'secondary' as const,
        icon: Clock,
        label: `Due ${timeText}`,
        className: 'text-orange-700 bg-orange-50 border-orange-200'
      };
    } else {
      return {
        variant: 'outline' as const,
        icon: Calendar,
        label: `Due ${timeText}`,
        className: 'text-green-700 bg-green-50 border-green-200'
      };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        "text-xs font-medium",
        config.className,
        className
      )}
    >
      <IconComponent className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
