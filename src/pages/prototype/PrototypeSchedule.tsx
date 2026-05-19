import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, saveActs, PrototypeAct, SUGGESTED_CONTACTS } from '@/prototype/prototypeStore';
import { Calendar, Clock, UserPlus, ArrowRight, X } from 'lucide-react';

function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function PrototypeSchedule() {
  const navigate = useNavigate();
  const [acts, setActs] = useState<PrototypeAct[]>([]);

  useEffect(() => {
    const loaded = loadActs().filter(a => a.status === 'confirmed' || a.status === 'scheduled');
    if (loaded.length === 0) {
      navigate('/prototype/review', { replace: true });
      return;
    }
    setActs(loaded);
  }, [navigate]);

  const update = (next: PrototypeAct[]) => {
    setActs(next);
    // merge with rejected ones from store
    const all = loadActs();
    const merged = all.map(a => next.find(n => n.id === a.id) || a);
    saveActs(merged);
  };

  const updateAct = (id: string, patch: Partial<PrototypeAct>) =>
    update(acts.map(a => a.id === id ? { ...a, ...patch } : a));

  const addAttendee = (id: string, name: string) => {
    const act = acts.find(a => a.id === id);
    if (!act) return;
    const set = new Set(act.attendees || []);
    set.add(name);
    updateAct(id, { attendees: Array.from(set) });
  };

  const removeAttendee = (id: string, name: string) => {
    const act = acts.find(a => a.id === id);
    if (!act) return;
    updateAct(id, { attendees: (act.attendees || []).filter(n => n !== name) });
  };

  const scheduleAll = () => {
    update(acts.map(a => ({ ...a, status: 'scheduled' as const })));
    navigate('/prototype/done');
  };

  return (
    <PrototypeLayout
      title="Proposed diary slots"
      subtitle="Your assistant chose times based on urgency. Adjust any slot or invite people, then schedule everything in one tap."
    >
      <div className="space-y-4">
        {acts.map((a) => (
          <ActCard
            key={a.id}
            act={a}
            onChange={(patch) => updateAct(a.id, patch)}
            onAddAttendee={(name) => addAttendee(a.id, name)}
            onRemoveAttendee={(name) => removeAttendee(a.id, name)}
          />
        ))}
      </div>

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={scheduleAll}
          className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
        >
          Add {acts.length} to my calendar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </PrototypeLayout>
  );
}

interface ActCardProps {
  act: PrototypeAct;
  onChange: (patch: Partial<PrototypeAct>) => void;
  onAddAttendee: (name: string) => void;
  onRemoveAttendee: (name: string) => void;
}

function ActCard({ act, onChange, onAddAttendee, onRemoveAttendee }: ActCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const suggestions = SUGGESTED_CONTACTS.filter(c => !(act.attendees || []).includes(c));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-medium text-slate-900 mb-3">{act.text}</div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <input
            type="date"
            value={act.proposedDate || ''}
            onChange={(e) => onChange({ proposedDate: e.target.value })}
            className="bg-transparent text-sm font-medium text-slate-900 w-full outline-none"
          />
        </label>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <input
            type="time"
            value={act.proposedTime || ''}
            onChange={(e) => onChange({ proposedTime: e.target.value })}
            className="bg-transparent text-sm font-medium text-slate-900 w-full outline-none"
          />
        </label>
      </div>

      <div className="text-xs text-slate-500 mb-1">
        Proposed: {formatDate(act.proposedDate)} at {act.proposedTime || '—'}
      </div>

      {/* Attendees */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Invite</div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(act.attendees || []).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-medium"
            >
              {name}
              <button
                onClick={() => onRemoveAttendee(name)}
                className="w-4 h-4 rounded-full hover:bg-teal-200 flex items-center justify-center"
                aria-label={`Remove ${name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {(act.attendees || []).length === 0 && !showAdd && (
            <span className="text-xs text-slate-400 italic">No one invited yet</span>
          )}
        </div>

        {showAdd && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => { onAddAttendee(name); }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-xs text-slate-700 font-medium transition"
              >
                + {name}
              </button>
            ))}
            {suggestions.length === 0 && (
              <span className="text-xs text-slate-400">Everyone is already invited.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
