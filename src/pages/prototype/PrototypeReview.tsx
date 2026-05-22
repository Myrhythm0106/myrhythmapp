import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  loadActs, saveActs, PrototypeAct,
  loadContextId, saveContextId, applyContextDefaults,
} from '@/prototype/prototypeStore';
import { CONTEXTS, CONTEXT_OPTIONS, type ContextId, type ActType } from '@/prototype/prototypeContexts';
import { Check, X, Pencil, ArrowRight, Stethoscope, ChevronDown, UserPlus } from 'lucide-react';
import { loadCircle, suggestForAct, initials } from '@/prototype/prototypeSupportCircle';

const priorityDot: Record<string, string> = {
  high: 'bg-slate-900',
  medium: 'bg-slate-500',
  low: 'bg-slate-300',
};

const ACT_TYPE_LABELS: Record<ActType, string> = {
  medication: 'Medication',
  follow_up: 'Follow-up',
  test: 'Test',
  referral: 'Referral',
  lifestyle: 'Lifestyle',
  question: 'Question',
  homework: 'Homework',
  reflection: 'Reflection',
  general: 'General',
};

export default function PrototypeReview() {
  const navigate = useNavigate();
  const [acts, setActs] = useState<PrototypeAct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [contextId, setContextId] = useState<ContextId>('general');
  const [showContextPicker, setShowContextPicker] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const circle = loadCircle();

  useEffect(() => {
    const loaded = loadActs();
    if (loaded.length === 0) {
      navigate('/prototype/capture', { replace: true });
      return;
    }
    setActs(loaded);
    setContextId(loadContextId() ?? loaded[0]?.contextId ?? 'general');
  }, [navigate]);

  const update = (next: PrototypeAct[]) => {
    setActs(next);
    saveActs(next);
  };

  const changeContext = (next: ContextId) => {
    setContextId(next);
    saveContextId(next);
    const reshaped = acts.map(a => applyContextDefaults(a, next));
    update(reshaped);
    setShowContextPicker(false);
  };

  const confirm = (id: string) =>
    update(acts.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
  const reject = (id: string) =>
    update(acts.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  const startEdit = (a: PrototypeAct) => { setEditingId(a.id); setEditText(a.text); };
  const saveEdit = (id: string) => {
    update(acts.map(a => a.id === id ? { ...a, text: editText, status: 'confirmed' } : a));
    setEditingId(null);
  };

  const toggleAttendee = (id: string, name: string) => {
    const act = acts.find(a => a.id === id);
    if (!act) return;
    const cur = new Set(act.attendees || []);
    if (cur.has(name)) cur.delete(name); else cur.add(name);
    update(acts.map(a => a.id === id ? { ...a, attendees: Array.from(cur) } : a));
  };

  const visible = acts.filter(a => a.status !== 'rejected');
  const confirmedCount = acts.filter(a => a.status === 'confirmed').length;
  const ctxCfg = CONTEXTS[contextId];

  return (
    <PrototypeLayout
      title="Your assistant found these actions"
      subtitle="Tap ✓ to confirm, ✎ to edit, ✗ to drop. We'll propose times next."
    >
      {/* Inferred-context pill — silent unless not 'general' */}
      {contextId !== 'general' && (
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
          <span>looks like a {ctxCfg.label.toLowerCase()}</span>
          <button
            onClick={() => setShowContextPicker(v => !v)}
            className="font-medium text-slate-900 hover:text-slate-700 flex items-center gap-0.5"
          >
            change <ChevronDown className={`w-3 h-3 transition ${showContextPicker ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
      {showContextPicker && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CONTEXT_OPTIONS.map(id => (
            <button
              key={id}
              onClick={() => changeContext(id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                id === contextId
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {CONTEXTS[id].label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {visible.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[a.priority]}`} />
                    {a.priority}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>due {a.dueContext}</span>
                  <span className="text-slate-300">·</span>
                  <span>{Math.round(a.confidence * 100)}% confidence</span>
                </div>
                {editingId === a.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                    <button
                      onClick={() => saveEdit(a.id)}
                      className="px-3 rounded-lg bg-slate-900 text-white text-sm font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-900 font-medium">{a.text}</div>
                )}
                {a.attendees && a.attendees.length > 0 && (
                  <div className="text-xs text-slate-500 mt-1">
                    with {a.attendees.join(', ')}
                  </div>
                )}
                {/* Context-shaped extras — only render when populated */}
                {(a.actType || a.clinician || (a.shareWith && a.shareWith.length > 0)) && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    {a.actType && a.actType !== 'general' && (
                      <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 lowercase">
                        {ACT_TYPE_LABELS[a.actType as ActType] || a.actType}
                      </span>
                    )}
                    {a.clinician && (
                      <span>· {a.clinician}</span>
                    )}
                    {a.shareWith && a.shareWith.length > 0 && (
                      <span>· share with {a.shareWith.join(', ')}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {editingId !== a.id && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => confirm(a.id)}
                  className={`min-h-[44px] flex-1 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition border ${
                    a.status === 'confirmed'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Check className="w-4 h-4" /> {a.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                </button>
                <button
                  onClick={() => startEdit(a)}
                  className="min-h-[44px] px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 flex items-center justify-center"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => reject(a.id)}
                  className="min-h-[44px] px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 flex items-center justify-center"
                  aria-label="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {editingId !== a.id && circle.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    Loop in {(a.attendees?.length || 0) > 0 && (
                      <span className="text-slate-700">· {a.attendees!.length} invited</span>
                    )}
                  </div>
                  <button
                    onClick={() => setInvitingId(invitingId === a.id ? null : a.id)}
                    className="text-[11px] text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" /> {invitingId === a.id ? 'Close' : 'Invite'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(a.attendees || []).map(name => (
                    <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-medium">
                      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px]">{initials(name)}</span>
                      {name}
                    </span>
                  ))}
                </div>
                {invitingId === a.id && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {circle.map(m => {
                      const picked = (a.attendees || []).includes(m.name);
                      const suggested = suggestForAct(a).some(s => s.id === m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleAttendee(a.id, m.name)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                            picked
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : suggested
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {picked ? '✓ ' : '+ '}{m.name}
                          {suggested && !picked && <span className="ml-1 text-amber-600">suggested</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={() => navigate('/prototype/schedule')}
          disabled={confirmedCount === 0}
          className="w-full min-h-[56px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          Schedule {confirmedCount} action{confirmedCount === 1 ? '' : 's'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </PrototypeLayout>
  );
}
