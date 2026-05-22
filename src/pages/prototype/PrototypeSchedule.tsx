import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, saveActs, PrototypeAct, SUGGESTED_CONTACTS, smartReminderDefaults, autoScheduleActs, isLowEnergyDay } from '@/prototype/prototypeStore';
import { Calendar, Clock, UserPlus, ArrowRight, X, BellRing, Sparkles, ChevronDown, Check, Loader2 } from 'lucide-react';

function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function PrototypeSchedule() {
  const navigate = useNavigate();
  const [acts, setActs] = useState<PrototypeAct[]>([]);
  const [showWhy, setShowWhy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [autoPlaced, setAutoPlaced] = useState(false);

  useEffect(() => {
    const loaded = loadActs().filter(a => a.status === 'confirmed' || a.status === 'scheduled');
    if (loaded.length === 0) {
      navigate('/prototype/review', { replace: true });
      return;
    }
    setActs(loaded);
  }, [navigate]);

  const persist = (next: PrototypeAct[]) => {
    setActs(next);
    const all = loadActs();
    const merged = all.map(a => next.find(n => n.id === a.id) || a);
    saveActs(merged);
  };

  const updateAct = (id: string, patch: Partial<PrototypeAct>) =>
    persist(acts.map(a => a.id === id ? { ...a, ...patch } : a));

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

  const handleAutoSchedule = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 650));
    const next = autoScheduleActs(acts);
    persist(next);
    setPlacing(false);
    setAutoPlaced(true);
    setManualOpen(true); // reveal results
  };

  const scheduleAll = () => {
    const next = acts.map(a => ({
      ...a,
      status: 'scheduled' as const,
      reminders: smartReminderDefaults(a),
    }));
    persist(next);
    navigate('/prototype/reminders');
  };

  const highCount = acts.filter(a => a.priority === 'high').length;

  const lowEnergy = isLowEnergyDay();
  const deferredCount = lowEnergy ? acts.filter(a => a.priority !== 'high').length : 0;

  return (
    <PrototypeLayout
      title="Proposed diary slots"
      subtitle="Let your assistant place every action in your best-fit window — or review them yourself."
    >
      {lowEnergy && deferredCount > 0 && (
        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          Today's a lower-energy day. I've kept the urgent {acts.length - deferredCount === 1 ? 'one' : `${acts.length - deferredCount}`} and moved the other {deferredCount} to tomorrow morning when you tend to focus best.
        </div>
      )}
      {/* SMART hero */}
      <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-slate-900">Smart Schedule</h3>
          <span className="text-[10px] uppercase tracking-wide font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Recommended</span>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          We'll place all {acts.length} actions in your best-fit windows based on your energy pattern, urgency, and free time in your calendar.
        </p>

        <button
          onClick={handleAutoSchedule}
          disabled={placing}
          className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
        >
          {placing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Placing actions…</>
          ) : autoPlaced ? (
            <><Check className="w-5 h-5" /> Re-run auto-schedule</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Auto-schedule all {acts.length} actions <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <button
          onClick={() => setShowWhy(!showWhy)}
          className="mt-3 text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
        >
          See how this was decided <ChevronDown className={`w-3.5 h-3.5 transition ${showWhy ? 'rotate-180' : ''}`} />
        </button>
        {showWhy && (
          <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-1">
            <li>• Energy pattern: peak 09:00–11:00, dip 14:00–15:30 (from your assessment)</li>
            <li>• Calendar: working hours Mon–Fri, lunch and low-energy windows skipped</li>
            <li>• Urgency: {highCount} high-priority placed first in your peak window</li>
            <li>• Buffers: at least 30 min between actions, max 2 per day</li>
          </ul>
        )}

        {autoPlaced && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <Check className="w-4 h-4" /> All {acts.length} actions placed. Tweak any below or set reminders.
          </div>
        )}
      </div>

      {/* Manual editor — secondary */}
      <button
        onClick={() => setManualOpen(!manualOpen)}
        className="w-full text-left text-sm text-slate-700 hover:text-slate-900 font-medium flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 mb-3"
      >
        <span>{autoPlaced ? 'Review or tweak each slot' : 'Prefer to place them yourself? Review slots manually'}</span>
        <ChevronDown className={`w-4 h-4 transition ${manualOpen ? 'rotate-180' : ''}`} />
      </button>

      {manualOpen && (
        <div className="space-y-4">
          {acts.map((a) => (
            <ActCard
              key={a.id}
              act={a}
              highlight={autoPlaced}
              onChange={(patch) => updateAct(a.id, patch)}
              onAddAttendee={(name) => addAttendee(a.id, name)}
              onRemoveAttendee={(name) => removeAttendee(a.id, name)}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={scheduleAll}
          className="w-full min-h-[56px] rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <BellRing className="w-5 h-5" />
          Set smart reminders ({acts.length})
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </PrototypeLayout>
  );
}

interface ActCardProps {
  act: PrototypeAct;
  highlight?: boolean;
  onChange: (patch: Partial<PrototypeAct>) => void;
  onAddAttendee: (name: string) => void;
  onRemoveAttendee: (name: string) => void;
}

function ActCard({ act, highlight, onChange, onAddAttendee, onRemoveAttendee }: ActCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const suggestions = SUGGESTED_CONTACTS.filter(c => !(act.attendees || []).includes(c));

  return (
    <div className={`rounded-2xl border bg-white p-4 transition ${highlight ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'}`}>
      <div className="flex items-start gap-2 mb-3">
        {highlight && <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
        <div className="font-medium text-slate-900">{act.text}</div>
      </div>

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
