import React, { useEffect, useState } from 'react';
import { announceDiaryChange } from '@/launch/reminders/diarySync';
import { FRESH_REMINDERS } from '@/launch/reminders/reminderStages';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import type { LaunchCalendarEvent } from '@/hooks/useLaunchCalendarEvents';
import { cn } from '@/lib/utils';

type EventForm = { title: string; date: string; time: string; description: string; is_private: boolean };
type ActionForm = { action_text: string; assigned_to: string; end_date: string };
type Source = { reference_code: string | null; transcript_excerpt: string | null };

const field = 'min-h-[52px] w-full rounded-xl border border-launch-gold/35 bg-launch-cream-light px-3 text-base text-launch-ink-deep focus:outline-none focus:ring-2 focus:ring-launch-teal';
const label = 'text-xs font-semibold uppercase tracking-[0.16em] text-launch-moss';

/** The item in its original form. Edit, save, undo — Home refreshes straight away. */
export function PriorityDetailSheet({ event, onClose, onSaved }: { event: LaunchCalendarEvent | null; onClose: () => void; onSaved: () => void }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState<EventForm | null>(null);
  const [action, setAction] = useState<ActionForm | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [more, setMore] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMore(false); setAction(null); setSource(null);
    if (!event) { setForm(null); return; }
    setForm({ title: event.title, date: format(event.date, 'yyyy-MM-dd'), time: (event.time || '09:00').slice(0, 5), description: event.description ?? '', is_private: !!event.isPrivate });
    if (event.extractedActionId) {
      supabase.from('extracted_actions').select('action_text, assigned_to, end_date, reference_code, transcript_excerpt').eq('id', event.extractedActionId).maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          setAction({ action_text: data.action_text ?? '', assigned_to: data.assigned_to ?? '', end_date: data.end_date ?? '' });
          setSource({ reference_code: data.reference_code, transcript_excerpt: data.transcript_excerpt });
        });
    }
  }, [event]);

  const save = async () => {
    if (!event || !form || !form.title.trim()) return;
    setSaving(true);
    const before = { title: event.title, date: format(event.date, 'yyyy-MM-dd'), time: event.time, description: event.description ?? null, is_private: !!event.isPrivate };
    const moved = form.date !== before.date || form.time.slice(0, 5) !== (before.time ?? '').slice(0, 5);
    const { error } = await supabase.from('calendar_events').update({
      title: form.title.trim(), date: form.date, time: form.time, description: form.description || null, is_private: form.is_private,
      ...(moved ? FRESH_REMINDERS : {}),
    }).eq('id', event.id);
    let actionBefore: ActionForm | null = null;
    if (!error && action && event.extractedActionId) {
      const { data: prev } = await supabase.from('extracted_actions').select('action_text, assigned_to, end_date').eq('id', event.extractedActionId).maybeSingle();
      actionBefore = prev ? { action_text: prev.action_text ?? '', assigned_to: prev.assigned_to ?? '', end_date: prev.end_date ?? '' } : null;
      await supabase.from('extracted_actions').update({
        action_text: action.action_text.trim() || form.title.trim(), assigned_to: action.assigned_to || null,
        end_date: action.end_date || null, scheduled_date: form.date, scheduled_time: form.time,
      }).eq('id', event.extractedActionId);
    }
    setSaving(false);
    if (error) { toast.error("I couldn't save that just now", { description: 'Nothing was changed. Please try again.' }); return; }
    announceDiaryChange('priority-sheet');
    onSaved(); onClose();
    toast('Saved', {
      action: {
        label: 'Undo', onClick: async () => {
          await supabase.from('calendar_events').update(moved ? { ...before, ...FRESH_REMINDERS } : before).eq('id', event.id);
          if (actionBefore && event.extractedActionId) {
            await supabase.from('extracted_actions').update({ ...actionBefore, assigned_to: actionBefore.assigned_to || null, end_date: actionBefore.end_date || null }).eq('id', event.extractedActionId);
          }
          announceDiaryChange('priority-sheet');
          onSaved();
        },
      },
    });
  };

  return (
    <Sheet open={!!event} onOpenChange={o => { if (!o) onClose(); }}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className={cn('launch-theme overflow-y-auto bg-launch-ivory', isMobile ? 'max-h-[88svh] rounded-t-3xl' : 'w-full sm:max-w-md')}>
        <SheetHeader className="text-left">
          <SheetTitle className="font-instrument text-2xl font-normal text-launch-ink">{event?.extractedActionId ? 'Step from a conversation' : 'Diary item'}</SheetTitle>
          <SheetDescription className="text-sm text-launch-ink/60">Change anything, then save. It updates my diary straight away.</SheetDescription>
        </SheetHeader>
        {form && (
          <form className="mt-5 space-y-4" onSubmit={e => { e.preventDefault(); void save(); }}>
            <label className="block space-y-1"><span className={label}>What</span>
              <input className={field} value={form.title} maxLength={140} onChange={e => setForm({ ...form, title: e.target.value })} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1"><span className={label}>Date</span>
                <input type="date" className={field} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </label>
              <label className="block space-y-1"><span className={label}>Time</span>
                <input type="time" className={field} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </label>
            </div>
            {action && (
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1"><span className={label}>Who owns it</span>
                  <input className={field} value={action.assigned_to} maxLength={80} placeholder="Me" onChange={e => setAction({ ...action, assigned_to: e.target.value })} />
                </label>
                <label className="block space-y-1"><span className={label}>Due by</span>
                  <input type="date" className={field} value={action.end_date} onChange={e => setAction({ ...action, end_date: e.target.value })} />
                </label>
              </div>
            )}

            <button type="button" aria-expanded={more} onClick={() => setMore(!more)} className="flex min-h-[48px] w-full items-center justify-between text-sm font-semibold text-launch-ink">
              More details <ChevronDown className={cn('h-4 w-4 transition-transform', more && 'rotate-180')} />
            </button>
            {more && (
              <div className="space-y-4">
                <label className="block space-y-1"><span className={label}>Notes</span>
                  <textarea className={cn(field, 'min-h-[96px] py-2')} value={form.description} maxLength={1000} onChange={e => setForm({ ...form, description: e.target.value })} />
                </label>
                {action && (
                  <label className="block space-y-1"><span className={label}>The step in my words</span>
                    <textarea className={cn(field, 'min-h-[80px] py-2')} value={action.action_text} maxLength={500} onChange={e => setAction({ ...action, action_text: e.target.value })} />
                  </label>
                )}
                <div className="flex min-h-[52px] items-center justify-between">
                  <span className="text-base text-launch-ink">Keep private <span className="block text-xs text-launch-ink/55">My Support Circle sees only "Busy"</span></span>
                  <Switch checked={form.is_private} onCheckedChange={v => setForm({ ...form, is_private: v })} />
                </div>
                {source && (source.reference_code || source.transcript_excerpt) && (
                  <div className="rounded-xl border border-launch-gold/25 bg-launch-cream-light p-3">
                    <p className={label}>Where this came from</p>
                    {source.transcript_excerpt && <p className="mt-1 text-sm italic text-launch-ink/75">“{source.transcript_excerpt}”</p>}
                    {source.reference_code && <p className="mt-1 text-xs text-launch-ink/55">Reference {source.reference_code}</p>}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving || !form.title.trim()} className="min-h-[56px] flex-1 rounded-2xl bg-brand-orange-500 font-semibold text-primary-foreground disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={onClose} className="min-h-[56px] rounded-2xl border border-launch-gold/40 px-5 font-semibold text-launch-ink">Cancel</button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
