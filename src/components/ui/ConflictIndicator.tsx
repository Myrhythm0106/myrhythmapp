import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ConflictLevel = 'none' | 'low' | 'high';

interface ConflictIndicatorProps {
  level: ConflictLevel;
  conflictDetails?: string[];
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConflictIndicator({ 
  level, 
  conflictDetails = [], 
  className,
  showLabel = true,
  size = 'md' 
}: ConflictIndicatorProps) {
  const getConfig = (level: ConflictLevel) => {
    switch (level) {
      case 'none':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          label: 'Clear',
          description: 'No conflicts detected'
        };
      case 'low':
        return {
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'Minor',
          description: 'Low-priority conflicts'
        };
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Conflict',
          description: 'Important overlaps detected'
        };
      default:
        return {
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-muted',
          label: 'Unknown',
          description: 'Unable to check conflicts'
        };
    }
  };

  const config = getConfig(level);
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const badgeSizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-sm px-4 py-2'
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "rounded-full flex items-center justify-center",
          config.bgColor,
          size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'
        )}
      >
        <IconComponent className={cn(sizeClasses[size], config.color)} />
      </motion.div>
      
      {showLabel && (
        <Badge 
          variant="outline" 
          className={cn(
            "border font-medium",
            config.borderColor,
            config.bgColor,
            config.color,
            badgeSizeClasses[size]
          )}
        >
          {config.label}
        </Badge>
      )}
      
      {conflictDetails.length > 0 && (
        <div className="hidden group-hover:block absolute z-10 bg-popover border rounded-md shadow-md p-3 min-w-48 top-full left-0 mt-1">
          <div className="text-sm font-medium mb-2">{config.description}</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {conflictDetails.map((detail, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="block w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}