import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  loadActs, saveActs, PrototypeAct, PrototypeReminder, ReminderOffset,
  ReminderChannel, REMINDER_LABEL, smartReminderDefaults,
} from '@/prototype/prototypeStore';
import { BellRing, Plus, X, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

const ALL_OFFSETS: ReminderOffset[] = [
  '5_min_before', '15_min_before', '30_min_before',
  '1_hour_before', '1_day_before', 'morning_of',
];
const ALL_CHANNELS: { id: ReminderChannel; label: string }[] = [
  { id: 'in_app', label: 'In-app' },
  { id: 'push', label: 'Push' },
  { id: 'email', label: 'Email' },
];

export default function PrototypeReminders() {
  const navigate = useNavigate();
  const [acts, setActs] = useState<PrototypeAct[]>([]);

  useEffect(() => {
    const loaded = loadActs().filter(a => a.status === 'scheduled');
    if (loaded.length === 0) { navigate('/prototype/schedule', { replace: true }); return; }
    // Ensure every scheduled act has reminders.
    const seeded = loaded.map(a => a.reminders?.length ? a : { ...a, reminders: smartReminderDefaults(a) });
    setActs(seeded);
    const all = loadActs();
    saveActs(all.map(a => seeded.find(s => s.id === a.id) || a));
  }, [navigate]);

  const persist = (next: PrototypeAct[]) => {
    setActs(next);
    const all = loadActs();
    saveActs(all.map(a => next.find(n => n.id === a.id) || a));
  };

  const updateAct = (id: string, patch: Partial<PrototypeAct>) =>
    persist(acts.map(a => a.id === id ? { ...a, ...patch } : a));

  const addReminder = (actId: string, offset: ReminderOffset) => {
    const act = acts.find(a => a.id === actId); if (!act) return;
    if ((act.reminders || []).some(r => r.offset === offset)) return;
    updateAct(actId, {
      reminders: [...(act.reminders || []), { id: crypto.randomUUID(), offset, channels: ['in_app', 'push'] }],
    });
  };
  const removeReminder = (actId: string, rid: string) => {
    const act = acts.find(a => a.id === actId); if (!act) return;
    updateAct(actId, { reminders: (act.reminders || []).filter(r => r.id !== rid) });
  };
  const toggleChannel = (actId: string, rid: string, ch: ReminderChannel) => {
    const act = acts.find(a => a.id === actId); if (!act) return;
    updateAct(actId, {
      reminders: (act.reminders || []).map(r => r.id === rid
        ? { ...r, channels: r.channels.includes(ch) ? r.channels.filter(c => c !== ch) : [...r.channels, ch] }
        : r),
    });
  };
  const resetSmart = (actId: string) => {
    const act = acts.find(a => a.id === actId); if (!act) return;
    updateAct(actId, { reminders: smartReminderDefaults(act) });
  };

  const total = useMemo(() => acts.reduce((n, a) => n + (a.reminders?.length || 0), 0), [acts]);

  return (
    <PrototypeLayout
      title="Your assistant's reminder plan"
      subtitle="A real personal assistant nudges you at the right time, through the right channel. Tweak anything below — or trust the SMART defaults."
    >
      <div className="mb-5 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-purple-900">
          <strong>{total} reminders</strong> armed across {acts.length} commitments — chosen from priority, attendees, and the time of day.
        </div>
      </div>

      <div className="space-y-4">
        {acts.map(act => (
          <div key={act.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="font-medium text-slate-900">{act.text}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {act.proposedDate} at {act.proposedTime}
                  {act.attendees?.length ? ` · with ${act.attendees.join(', ')}` : ''}
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                    act.priority === 'high' ? 'bg-red-100 text-red-700' :
                    act.priority === 'low' ? 'bg-slate-100 text-slate-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{act.priority}</span>
                </div>
              </div>
              <button
                onClick={() => resetSmart(act.id)}
                title="Reset to SMART defaults"
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-full hover:bg-slate-100"
              >
                <RotateCcw className="w-3 h-3" /> Smart
              </button>
            </div>

            <div className="space-y-2">
              {(act.reminders || []).map(r => (
                <ReminderRow
                  key={r.id}
                  reminder={r}
                  onRemove={() => removeReminder(act.id, r.id)}
                  onToggleChannel={(ch) => toggleChannel(act.id, r.id, ch)}
                />
              ))}
              {(!act.reminders || act.reminders.length === 0) && (
                <div className="text-xs text-slate-400 italic">No reminders — you'll get no nudge.</div>
              )}
            </div>

            <AddReminderPicker
              existing={(act.reminders || []).map(r => r.offset)}
              onAdd={(offset) => addReminder(act.id, offset)}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={() => navigate('/prototype/done')}
          className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
        >
          Looks good — arm reminders
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </PrototypeLayout>
  );
}

function ReminderRow({ reminder, onRemove, onToggleChannel }: {
  reminder: PrototypeReminder;
  onRemove: () => void;
  onToggleChannel: (ch: ReminderChannel) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
      <BellRing className="w-4 h-4 text-teal-600 flex-shrink-0" />
      <div className="font-medium text-sm text-slate-800 w-28 flex-shrink-0">{REMINDER_LABEL[reminder.offset]}</div>
      <div className="flex gap-1 flex-1 flex-wrap">
        {ALL_CHANNELS.map(c => {
          const on = reminder.channels.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onToggleChannel(c.id)}
              className={`text-[11px] px-2 py-0.5 rounded-full border transition ${
                on ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
              }`}
            >{c.label}</button>
          );
        })}
      </div>
      <button onClick={onRemove} className="w-7 h-7 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center" aria-label="Remove">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddReminderPicker({ existing, onAdd }: { existing: ReminderOffset[]; onAdd: (o: ReminderOffset) => void }) {
  const [open, setOpen] = useState(false);
  const available = ALL_OFFSETS.filter(o => !existing.includes(o));
  if (available.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      {!open ? (
        <button onClick={() => setOpen(true)} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add another reminder
        </button>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {available.map(o => (
            <button
              key={o}
              onClick={() => { onAdd(o); setOpen(false); }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-xs text-slate-700 font-medium transition"
            >
              + {REMINDER_LABEL[o]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
