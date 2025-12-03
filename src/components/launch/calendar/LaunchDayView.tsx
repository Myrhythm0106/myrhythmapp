import React, { useState } from 'react';
import { Clock, MoreVertical, Check, X, ArrowRight, Calendar } from 'lucide-react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchCommitmentBanner } from './LaunchCommitmentBanner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Event {
  id?: string;
  time: string;
  title: string;
  type: string;
  status?: 'pending' | 'done' | 'cancelled' | 'carried';
  carriedFrom?: Date;
}

interface LaunchDayViewProps {
  date: Date;
  events: Event[];
  className?: string;
  inheritedVision?: string;
  inheritedMonthFocus?: string;
  inheritedWeekFocus?: string;
  onEventStatusChange?: (eventIndex: number, status: Event['status']) => void;
  onEventCarryOver?: (eventIndex: number) => void;
  onEventReschedule?: (eventIndex: number) => void;
}

export function LaunchDayView({ 
  date, 
  events, 
  className = '',
  inheritedVision,
  inheritedMonthFocus,
  inheritedWeekFocus,
  onEventStatusChange,
  onEventCarryOver,
  onEventReschedule
}: LaunchDayViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.time.localeCompare(b.time));

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      routine: 'bg-brand-emerald-400',
      appointment: 'bg-blue-400',
      medical: 'bg-red-400',
      activity: 'bg-purple-400',
      social: 'bg-amber-400',
      rest: 'bg-brand-teal-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getStatusStyles = (status?: Event['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200 opacity-60';
      case 'carried':
        return 'bg-amber-50 border-amber-200 opacity-70';
      default:
        return '';
    }
  };

  const handleMarkDone = (index: number) => {
    onEventStatusChange?.(index, 'done');
    toast.success('Great job! Task completed! 🎉');
  };

  const handleCancel = (index: number) => {
    onEventStatusChange?.(index, 'cancelled');
    toast('Task cancelled', { description: 'No worries, priorities shift!' });
  };

  const handleCarryOver = (index: number) => {
    onEventCarryOver?.(index);
    toast.success('Moved to tomorrow', { 
      description: 'Same time tomorrow. Tap to reschedule if needed.',
      action: {
        label: 'Reschedule',
        onClick: () => onEventReschedule?.(index)
      }
    });
  };

  const handleReschedule = (index: number) => {
    onEventReschedule?.(index);
    toast('Opening scheduler...', { description: 'Choose a new date and time' });
  };

  // Build breadcrumb trail
  const breadcrumbParts = [];
  if (inheritedVision) breadcrumbParts.push(`🌟 ${inheritedVision}`);
  if (inheritedMonthFocus) breadcrumbParts.push(inheritedMonthFocus);
  if (inheritedWeekFocus) breadcrumbParts.push(inheritedWeekFocus);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Vision Cascade Breadcrumb */}
      {breadcrumbParts.length > 0 && (
        <div className="text-sm text-brand-teal-600 flex items-center gap-2 flex-wrap px-1">
          {breadcrumbParts.map((part, i) => (
            <React.Fragment key={i}>
              <span className={i === breadcrumbParts.length - 1 ? 'font-medium' : ''}>
                {part}
              </span>
              {i < breadcrumbParts.length - 1 && (
                <span className="text-brand-teal-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <LaunchCommitmentBanner 
        scope="day" 
        date={date} 
        inheritedVision={inheritedVision}
        inheritedFocus={inheritedWeekFocus || inheritedMonthFocus}
      />

      {sortedEvents.length === 0 ? (
        <LaunchCard className="p-8 text-center">
          <p className="text-gray-500">No events scheduled for today</p>
          <p className="text-sm text-brand-teal-600 mt-2">Tap "+ Add" to create one</p>
        </LaunchCard>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((event, i) => (
            <LaunchCard 
              key={i} 
              variant="glass" 
              className={cn("p-4", getStatusStyles(event.status))}
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[50px]">
                  <p className={cn(
                    "text-sm font-bold",
                    event.status === 'done' ? 'text-green-600' : 
                    event.status === 'cancelled' ? 'text-gray-400 line-through' : 
                    'text-gray-900'
                  )}>
                    {event.time}
                  </p>
                </div>
                <div className={cn("w-1 h-12 rounded-full", getTypeColor(event.type))} />
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    event.status === 'done' ? 'text-green-700 line-through' : 
                    event.status === 'cancelled' ? 'text-gray-400 line-through' : 
                    'text-gray-900'
                  )}>
                    {event.status === 'done' && <Check className="inline h-4 w-4 mr-1 text-green-500" />}
                    {event.status === 'cancelled' && <X className="inline h-4 w-4 mr-1 text-gray-400" />}
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 capitalize">{event.type}</p>
                    {event.carriedFrom && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Carried from yesterday
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Menu */}
                {event.status !== 'done' && event.status !== 'cancelled' && event.status !== 'carried' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleMarkDone(i)} className="text-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        Done
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCancel(i)} className="text-gray-600">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCarryOver(i)} className="text-amber-600">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Carry to Tomorrow
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReschedule(i)} className="text-blue-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Reschedule...
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Status indicator for completed/cancelled */}
                {(event.status === 'done' || event.status === 'cancelled' || event.status === 'carried') && (
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    event.status === 'done' && 'bg-green-100 text-green-700',
                    event.status === 'cancelled' && 'bg-gray-100 text-gray-500',
                    event.status === 'carried' && 'bg-amber-100 text-amber-700'
                  )}>
                    {event.status === 'done' && '✓ Done'}
                    {event.status === 'cancelled' && 'Cancelled'}
                    {event.status === 'carried' && '→ Moved'}
                  </div>
                )}
              </div>
            </LaunchCard>
          ))}
        </div>
      )}
    </div>
  );
}
