import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Flame, Zap, Target, Clock, Star } from 'lucide-react';

interface PriorityPickerProps {
  value: number;
  onChange: (priority: number) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

const priorityConfig = {
  1: {
    label: 'Low Priority',
    icon: Clock,
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'When time allows - no pressure! 😌',
    gradient: 'from-gray-200 to-gray-300'
  },
  2: {
    label: 'Medium Priority',
    icon: Target,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Important for your growth journey! 📈',
    gradient: 'from-blue-200 to-blue-400'
  },
  3: {
    label: 'High Priority',
    icon: Zap,
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    description: 'Meaningful progress awaits! ⚡',
    gradient: 'from-amber-300 to-orange-400'
  },
  4: {
    label: 'Urgent Priority',
    icon: Star,
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'High-impact action - you\'ve got this! 🎯',
    gradient: 'from-orange-400 to-red-400'
  },
  5: {
    label: 'Critical Priority',
    icon: Flame,
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Life-changing moment - unstoppable! 🔥',
    gradient: 'from-red-400 to-red-600'
  }
} as const;

export function PriorityPicker({ value, onChange, disabled = false, showLabel = true }: PriorityPickerProps) {
  const currentPriority = priorityConfig[value as keyof typeof priorityConfig] || priorityConfig[3];
  const Icon = currentPriority.icon;

  return (
    <div className="space-y-2">
      {showLabel && (
        <label className="text-sm font-medium text-memory-emerald-700">
          Life Impact Priority
        </label>
      )}
      
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full border-2 border-memory-emerald-200 focus:border-memory-emerald-500">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full bg-gradient-to-r ${currentPriority.gradient}`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium">{currentPriority.label}</span>
              <Badge variant="outline" className={currentPriority.color}>
                Level {value}
              </Badge>
            </div>
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {Object.entries(priorityConfig).map(([level, config]) => {
            const LevelIcon = config.icon;
            return (
              <SelectItem key={level} value={level} className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-1.5 rounded-full bg-gradient-to-r ${config.gradient}`}>
                    <LevelIcon className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{config.label}</span>
                      <Badge variant="outline" className={`${config.color} text-xs`}>
                        {level}
                      </Badge>
                    </div>
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
      
      <p className="text-xs text-memory-emerald-600 italic">
        💪 Your priorities, your power - every step matters on this journey!
      </p>
    </div>
  );
}