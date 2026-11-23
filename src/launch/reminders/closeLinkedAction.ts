import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearActionReminders } from '@/utils/reminderLadder';

/**
 * Closing the loop: when a diary item made from a conversation is finished
 * (or let go), the conversation step closes too, the Support Circle people
 * already attached are told, and the person sees one calm message with Undo.
 */
export type CloseKind = 'done' | 'let_go';

type Db = typeof supabase;

export async function closeLinkedAction(eventId: string, kind: CloseKind, db: Db = supabase, notify = true) {
  const { data: ev } = await db.from('calendar_events').select('extracted_action_id').eq('id', eventId).maybeSingle();
  const actionId = (ev as { extracted_action_id?: string | null } | null)?.extracted_action_id;
  if (!actionId) return null;

  const { data: before } = await db.from('extracted_actions').select('status, completion_date, archived_at').eq('id', actionId).maybeSingle();
  const prev = before as { status: string; completion_date: string | null; archived_at: string | null } | null;
  const today = new Date();
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const { error } = await db.from('extracted_actions').update(
    kind === 'done'
      ? { status: 'done', completion_date: ymd, archived_at: today.toISOString() }
      : { status: 'cancelled', archived_at: today.toISOString() }
  ).eq('id', actionId);
  if (error) return null;
  try { await clearActionReminders(actionId); } catch { /* reminders are secondary */ }

  let told = 0;
  if (kind === 'done') {
    try {
      const { data } = await db.rpc('notify_circle_of_step_completion', { p_action_id: actionId });
      told = (data as { notified?: number } | null)?.notified ?? 0;
    } catch { /* a missed notice never blocks closing */ }
  }

  const undo = async () => {
    await db.from('extracted_actions').update({
      status: prev?.status && !['done', 'cancelled'].includes(prev.status) ? prev.status : 'pending',
      completion_date: prev?.completion_date ?? null,
      archived_at: prev?.archived_at ?? null,
    }).eq('id', actionId);
    if (kind === 'done') await db.rpc('withdraw_step_completion_notice', { p_action_id: actionId });
  };

  const message = kind === 'let_go'
    ? 'Your conversation step is closed too.'
    : told > 0
      ? 'Done — your conversation step is closed and your Support Circle has been told.'
      : 'Done — your conversation step is closed.';
  if (notify) toast.success(message, { action: { label: 'Undo', onClick: () => { void undo().then(() => toast('Step reopened')); } } });
  return { actionId, told, undo, message };
}
