import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  REMINDER_PRESETS,
  REMINDER_RUNGS,
  ReminderPreset,
  loadActionReminders,
  matchPreset,
  presetForPriority,
  presetLabel,
  saveActionReminders
} from '@/utils/reminderLadder';

interface ReminderLadderPickerProps {
  actionId: string;
  dueDate?: string | null;
  priorityLevel?: number;
  onSaved?: (offsets: number[]) => void;
  onClose?: () => void;
}

const PRESET_ORDER: ReminderPreset[] = ['off', 'gentle', 'steady', 'strong'];

const sameOffsets = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort((x, y) => x - y).every((v, i) => v === [...b].sort((x, y) => x - y)[i]);

export function ReminderLadderPicker({ actionId, dueDate, priorityLevel, onSaved, onClose }: ReminderLadderPickerProps) {
  const { user } = useAuth();
  const [offsets, setOffsets] = useState<number[]>([]);
  const [initialOffsets, setInitialOffsets] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const existing = await loadActionReminders(actionId);
      if (cancelled) return;
      const start = existing.length ? existing : REMINDER_PRESETS[presetForPriority(priorityLevel)];
      setOffsets(start);
      setInitialOffsets(existing);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [actionId, priorityLevel]);

  const isDirty = !sameOffsets(offsets, initialOffsets);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const next = [...offsets].sort((a, b) => a - b);
    const ok = await saveActionReminders(actionId, user.id, next, dueDate);
    setIsSaving(false);
    if (!ok) {
      toast.error("Those reminders didn't save — please try again");
      return;
    }
    setInitialOffsets(next);
    onSaved?.(next);
    toast.success(next.length ? `${next.length} reminder${next.length > 1 ? 's' : ''} set` : 'Reminders off');
    onClose?.();
  };

  const activePreset = matchPreset(offsets);

  if (isLoading) {
    return (
      <div className="py-6 text-center">
        <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }


  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold">Remind me</p>
        <p className="text-xs text-muted-foreground">
          {dueDate ? 'Counted from the finish date.' : 'Set a finish date and these will start.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-1">
        {PRESET_ORDER.map(preset => (
          <button
            key={preset}
            type="button"
            onClick={() => persist(REMINDER_PRESETS[preset])}
            className={cn(
              'text-xs rounded-full border px-3 py-2 transition-colors min-h-[36px]',
              activePreset === preset
                ? 'border-brand-orange-500 bg-brand-orange-500 text-white'
                : 'border-border bg-muted/40 hover:bg-muted'
            )}
          >
            {presetLabel[preset]}
          </button>
        ))}
      </div>

      <ul className="space-y-1">
        {REMINDER_RUNGS.map(rung => {
          const checked = offsets.includes(rung.offset);
          return (
            <li key={rung.offset} className="flex items-center gap-3 min-h-[40px]">
              <Checkbox
                id={`rung-${actionId}-${rung.offset}`}
                checked={checked}
                onCheckedChange={value => {
                  const next = value
                    ? [...offsets, rung.offset]
                    : offsets.filter(o => o !== rung.offset);
                  persist(next.sort((a, b) => a - b));
                }}
              />
              <label
                htmlFor={`rung-${actionId}-${rung.offset}`}
                className={cn(
                  'text-sm cursor-pointer',
                  rung.when === 'after' && 'text-amber-700',
                  rung.when === 'due' && 'font-medium'
                )}
              >
                {rung.label}
              </label>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-muted-foreground">
        Reminders stop as soon as this is done or closed.
      </p>
      {isSaving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
    </div>
  );
}
