import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import { loadActs, saveActs, PrototypeAct, SUGGESTED_CONTACTS, smartReminderDefaults, autoScheduleActs, isLowEnergyDay } from '@/prototype/prototypeStore';
import { loadAssessmentProfile, windowLabel, personaLabel } from '@/prototype/prototypeAssessment';
import { Calendar, Clock, UserPlus, ArrowRight, X, BellRing, ChevronDown, Check, Loader2, Wand2, Target, Sunrise } from 'lucide-react';

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
  const profile = loadAssessmentProfile();

  const lowEnergy = isLowEnergyDay();
  const deferredCount = lowEnergy ? acts.filter(a => a.priority !== 'high').length : 0;

  return (
    <PrototypeLayout
      title="Your MyRhythm calendar"
      subtitle="Each action placed in the window your brain shows up best — vision, week, day, action."
    >
      {/* Vision cascade strip — same model as the launch calendar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
          Vision → week → today
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
              <Target className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Vision</div>
              <div className="text-[13px] text-slate-900 leading-snug">Live with more ease, and follow through on what matters.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
              <Calendar className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">This week</div>
              <div className="text-[13px] text-slate-900 leading-snug">Protect energy. Complete the essentials. Stay connected.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
              <Sunrise className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Today</div>
              <div className="text-[13px] text-slate-900 leading-snug">
                {highCount} high-priority action{highCount === 1 ? '' : 's'} placed in your best-focus window.
              </div>
            </div>
          </div>
        </div>
      </div>

      {lowEnergy && deferredCount > 0 && (
        <div className="mb-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700 leading-relaxed">
          Today's a lower-energy day. I've kept the urgent {acts.length - deferredCount === 1 ? 'one' : `${acts.length - deferredCount}`} and moved the other {deferredCount} to tomorrow morning when you tend to focus best — continuity preserved.
        </div>
      )}
      {/* Smart Schedule — calm hero */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-4">
        <h3 className="font-semibold text-slate-900 text-base">Smart Schedule</h3>
        <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
          Place all {acts.length} actions in your best-fit windows — energy pattern, urgency, and free time considered.
        </p>

        <button
          onClick={handleAutoSchedule}
          disabled={placing}
          className="w-full min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {placing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Placing actions…</>
          ) : autoPlaced ? (
            <><Check className="w-4 h-4" /> Re-run auto-schedule</>
          ) : (
            <><Wand2 className="w-4 h-4" /> Auto-schedule all {acts.length}</>
          )}
        </button>

        <button
          onClick={() => setShowWhy(!showWhy)}
          className="mt-3 text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1"
        >
          How this was decided <ChevronDown className={`w-3.5 h-3.5 transition ${showWhy ? 'rotate-180' : ''}`} />
        </button>
        {showWhy && (
          <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-1 leading-relaxed">
            {profile ? (
              <>
                <li>• You ({personaLabel(profile.persona)}): best window <strong>{windowLabel(profile.bestFocusWindow)}</strong>, protect <strong>{windowLabel(profile.lowEnergyWindow)}</strong></li>
                <li>• Heavy/high-priority actions land in your best window; light actions go later</li>
                <li>• Your low-energy window is kept clear — no heavy lifts there</li>
                <li>• Buffers: at least 30 min between actions, max 2 per day</li>
              </>
            ) : (
              <>
                <li>• No rhythm check yet — using a generic peak (09:00–11:00). <a href="/prototype/assessment" className="underline">Take it now</a></li>
                <li>• Urgency: {highCount} high-priority placed first in the default peak window</li>
                <li>• Buffers: at least 30 min between actions, max 2 per day</li>
              </>
            )}
          </ul>
        )}

        {autoPlaced && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Check className="w-3.5 h-3.5" /> All {acts.length} actions placed. Tweak any below or set reminders.
          </div>
        )}
      </div>

      {/* Manual editor — secondary */}
      <button
        onClick={() => setManualOpen(!manualOpen)}
        className="w-full text-left text-sm text-slate-700 hover:text-slate-900 font-medium flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 mb-3 transition-colors"
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
          className="w-full min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <BellRing className="w-4 h-4" />
          Set smart reminders ({acts.length})
          <ArrowRight className="w-4 h-4" />
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-2 mb-3">
        {highlight && <Check className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />}
        <div className="font-medium text-slate-900">{act.text}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="date"
            value={act.proposedDate || ''}
            onChange={(e) => onChange({ proposedDate: e.target.value })}
            className="bg-transparent text-sm font-medium text-slate-900 w-full outline-none"
          />
        </label>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200">
          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
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
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Invite</div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(act.attendees || []).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-medium"
            >
              {name}
              <button
                onClick={() => onRemoveAttendee(name)}
                className="w-4 h-4 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
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
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs text-slate-700 font-medium transition"
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
