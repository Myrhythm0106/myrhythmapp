import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Users, BellRing, Undo2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MeetingScheduleSummary } from './capture-brief/model/scheduleFromMeeting';

interface Props {
  summary: MeetingScheduleSummary | null;
  onClose: () => void;
}

function slotLabel(date: string, time: string): string {
  try {
    const d = new Date(`${date}T00:00:00`);
    return `${d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}, ${time.slice(0, 5)}`;
  } catch {
    return `${date} ${time}`;
  }
}

/**
 * The single confirmation shown after committing next steps — same view
 * whether one action or all of them were scheduled.
 */
export function CommitSummarySheet({ summary, onClose }: Props) {
  const [undoing, setUndoing] = useState(false);
  const [undone, setUndone] = useState(false);

  if (!summary) return null;

  const handleUndo = async () => {
    setUndoing(true);
    try {
      const eventIds = summary.entries.map(e => e.eventId).filter(Boolean);
      const actionIds = summary.entries.map(e => e.actionId);
      if (eventIds.length) await supabase.from('calendar_events').delete().in('id', eventIds);
      if (actionIds.length) {
        await supabase
          .from('extracted_actions')
          .update({
            scheduled_date: null,
            scheduled_time: null,
            calendar_event_id: null,
            status: 'pending',
          })
          .in('id', actionIds);
      }
      setUndone(true);
      toast.success('Removed from my diary');
    } catch (e) {
      toast.error('Could not undo — please check my calendar');
    } finally {
      setUndoing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CalendarCheck className="h-5 w-5 text-launch-moss" />
            {undone ? 'Removed from my diary' : "Here's what's now in my diary"}
          </DialogTitle>
        </DialogHeader>

        {!undone && (
          <div className="space-y-4">
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {summary.entries.map(e => (
                <li key={e.actionId} className="rounded-lg border border-border/60 p-3">
                  <p className="text-sm font-medium leading-snug">{e.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{slotLabel(e.date, e.time)}</p>
                </li>
              ))}
            </ul>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Reminders are set before each one.
              </p>
              {summary.people.length > 0 && (
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {summary.people.join(', ')} {summary.people.length === 1 ? 'was' : 'were'} told.
                </p>
              )}
              {summary.notifyFailures.length > 0 && (
                <p className="text-destructive">
                  Couldn't reach: {summary.notifyFailures.join(', ')}
                </p>
              )}
              {summary.failed > 0 && (
                <p className="text-destructive">
                  {summary.failed} couldn't be scheduled — try those again.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!undone && (
            <Button variant="outline" onClick={handleUndo} disabled={undoing} className="flex-1">
              {undoing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4 mr-1" />}
              Undo
            </Button>
          )}
          <Button onClick={onClose} className="flex-1">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
