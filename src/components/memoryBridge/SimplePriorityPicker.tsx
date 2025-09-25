import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Flame, Zap, Clock } from 'lucide-react';
import { Priority, priorityLevels } from '@/types/priority';

interface SimplePriorityPickerProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

const priorityIcons = {
  high: Flame,
  medium: Zap,
  low: Clock
};

export function SimplePriorityPicker({ 
  value, 
  onChange, 
  disabled = false, 
  showLabel = true 
}: SimplePriorityPickerProps) {
  const currentPriority = priorityLevels[value];
  const Icon = priorityIcons[value];

  return (
    <div className="space-y-2">
      {showLabel && (
        <label className="text-sm font-medium">
          Priority Level
        </label>
      )}
      
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${currentPriority.color}`} />
              <span className="font-medium">{currentPriority.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {Object.entries(priorityLevels).map(([key, config]) => {
            const PriorityIcon = priorityIcons[key as Priority];
            return (
              <SelectItem key={key} value={key} className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <PriorityIcon className={`h-4 w-4 ${config.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{config.label}</div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {config.description}
                    </p>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}