import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, Check, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { supabase } from '@/integrations/supabase/client';
import { clearActionReminders } from '@/utils/reminderLadder';
import { LaunchActionReminder, reminderOffsetLabel } from '@/hooks/useLaunchActionReminders';

interface Props {
  reminder: LaunchActionReminder | null;
  onClose: () => void;
  onChanged?: () => void;
}

export function LaunchReminderSheet({ reminder, onClose, onChanged }: Props) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!reminder) return null;

  const markDone = async () => {
    setBusy(true);
    const { error } = await supabase
      .from('extracted_actions')
      .update({ status: 'completed', completion_status: 'completed' })
      .eq('id', reminder.actionId);
    if (error) {
      console.error(error);
      toast.error('Could not mark that done');
      setBusy(false);
      return;
    }
    await clearActionReminders(reminder.actionId);
    toast.success('Done — nudges cleared');
    setBusy(false);
    onChanged?.();
    onClose();
  };

  const muteNudges = async () => {
    setBusy(true);
    await clearActionReminders(reminder.actionId);
    toast('Nudges turned off for this step');
    setBusy(false);
    onChanged?.();
    onClose();
  };

  return (
    <Dialog open={!!reminder} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-left">
            <Bell className="h-4 w-4 text-launch-ember" />
            Reminder
          </DialogTitle>
          <DialogDescription className="text-left">
            {reminderOffsetLabel(reminder.offsetDays)} ·{' '}
            {format(reminder.dueAt, 'EEE d MMM, HH:mm')}
          </DialogDescription>
        </DialogHeader>

        <p className="text-base font-medium text-launch-ink">{reminder.actionText}</p>

        <div className="grid gap-2 pt-2">
          <LaunchButton onClick={markDone} disabled={busy} className="w-full justify-center">
            <Check className="h-4 w-4 mr-2" />
            I've done this
          </LaunchButton>
          <LaunchButton
            variant="secondary"
            onClick={muteNudges}
            disabled={busy}
            className="w-full justify-center"
          >
            <BellOff className="h-4 w-4 mr-2" />
            Turn off nudges for this step
          </LaunchButton>
          <LaunchButton
            variant="secondary"
            onClick={() => {
              onClose();
              navigate('/launch/memory');
            }}
            className="w-full justify-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Memory Bridge
          </LaunchButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
