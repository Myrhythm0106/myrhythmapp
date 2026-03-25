import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarOff, RotateCcw, Save, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BlockedSlot {
  day: number; // 0=Mon, 1=Tue, ..., 6=Sun
  hour: number; // 7-21
}

interface AvailabilityBlockerProps {
  blockedSlots: BlockedSlot[];
  onSave: (slots: BlockedSlot[]) => Promise<void>;
  assessmentPeaks?: { start: number; end: number; days: number[] } | null;
  isLoading?: boolean;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7am - 9pm

export function AvailabilityBlocker({ blockedSlots, onSave, assessmentPeaks, isLoading }: AvailabilityBlockerProps) {
  const [localBlocked, setLocalBlocked] = useState<BlockedSlot[]>(blockedSlots);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'block' | 'unblock'>('block');
  const [hasChanges, setHasChanges] = useState(false);

  const isBlocked = useCallback((day: number, hour: number) => {
    return localBlocked.some(s => s.day === day && s.hour === hour);
  }, [localBlocked]);

  const isPeakHour = useCallback((day: number, hour: number) => {
    if (!assessmentPeaks) return false;
    return assessmentPeaks.days.includes(day) && hour >= assessmentPeaks.start && hour < assessmentPeaks.end;
  }, [assessmentPeaks]);

  const toggleSlot = useCallback((day: number, hour: number, forceMode?: 'block' | 'unblock') => {
    setLocalBlocked(prev => {
      const exists = prev.some(s => s.day === day && s.hour === hour);
      const mode = forceMode || (exists ? 'unblock' : 'block');
      if (mode === 'unblock') {
        return prev.filter(s => !(s.day === day && s.hour === hour));
      } else {
        if (exists) return prev;
        return [...prev, { day, hour }];
      }
    });
    setHasChanges(true);
  }, []);

  const handleMouseDown = (day: number, hour: number) => {
    const blocked = isBlocked(day, hour);
    setDragMode(blocked ? 'unblock' : 'block');
    setIsDragging(true);
    toggleSlot(day, hour, blocked ? 'unblock' : 'block');
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (isDragging) {
      toggleSlot(day, hour, dragMode);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleEntireDay = (day: number) => {
    const daySlots = HOURS.map(h => ({ day, hour: h }));
    const allBlocked = HOURS.every(h => isBlocked(day, h));
    
    setLocalBlocked(prev => {
      if (allBlocked) {
        return prev.filter(s => s.day !== day);
      } else {
        const withoutDay = prev.filter(s => s.day !== day);
        return [...withoutDay, ...daySlots];
      }
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onSave(localBlocked);
      setHasChanges(false);
      toast.success('Availability updated');
    } catch {
      toast.error('Failed to save availability');
    }
  };

  const handleReset = () => {
    setLocalBlocked(blockedSlots);
    setHasChanges(false);
  };

  const formatHour = (h: number) => {
    if (h === 0 || h === 12) return `12${h < 12 ? 'am' : 'pm'}`;
    return `${h > 12 ? h - 12 : h}${h < 12 ? 'am' : 'pm'}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarOff className="h-5 w-5 text-destructive" />
          Block Unavailable Times
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click or drag to block times. Your MYRHYTHM assessment peaks are highlighted in green.
        </p>
      </CardHeader>
      <CardContent>
        {/* Day toggles */}
        <div className="flex gap-2 mb-4">
          {DAYS.map((day, i) => {
            const allBlocked = HOURS.every(h => isBlocked(i, h));
            return (
              <div key={day} className="flex items-center gap-1.5">
                <Switch
                  checked={allBlocked}
                  onCheckedChange={() => toggleEntireDay(i)}
                  id={`day-${i}`}
                />
                <Label htmlFor={`day-${i}`} className="text-xs font-medium cursor-pointer">
                  {day}
                </Label>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div
          className="select-none overflow-x-auto"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="grid min-w-[600px]" style={{ gridTemplateColumns: '48px repeat(7, 1fr)' }}>
            {/* Header */}
            <div />
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
            ))}

            {/* Time rows */}
            {HOURS.map(hour => (
              <React.Fragment key={hour}>
                <div className="text-xs text-muted-foreground pr-2 flex items-center justify-end">
                  {formatHour(hour)}
                </div>
                {DAYS.map((_, day) => {
                  const blocked = isBlocked(day, hour);
                  const peak = isPeakHour(day, hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={cn(
                        'h-7 border border-border/40 cursor-pointer transition-colors duration-75 m-[1px] rounded-sm',
                        blocked
                          ? 'bg-destructive/20 border-destructive/30'
                          : peak
                            ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
                            : 'bg-background hover:bg-accent/50'
                      )}
                      onMouseDown={() => handleMouseDown(day, hour)}
                      onMouseEnter={() => handleMouseEnter(day, hour)}
                      title={
                        blocked
                          ? `Blocked: ${DAYS[day]} ${formatHour(hour)}`
                          : peak
                            ? `Peak energy: ${DAYS[day]} ${formatHour(hour)}`
                            : `Available: ${DAYS[day]} ${formatHour(hour)}`
                      }
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/30" />
            Blocked
          </div>
          {assessmentPeaks && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-300" />
              <Zap className="h-3 w-3 text-green-600" />
              Peak Energy (from MYRHYTHM)
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-background border border-border" />
            Available
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} disabled={!hasChanges || isLoading} size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save Availability
          </Button>
          <Button onClick={handleReset} disabled={!hasChanges} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          {localBlocked.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {localBlocked.length} slots blocked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
