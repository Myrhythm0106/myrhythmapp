import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrototypeLayout } from '@/prototype/PrototypeLayout';
import {
  loadActs, saveActs, PrototypeAct,
  loadContextId, saveContextId, applyContextDefaults,
} from '@/prototype/prototypeStore';
import { CONTEXTS, CONTEXT_OPTIONS, type ContextId, type ActType } from '@/prototype/prototypeContexts';
import { Check, X, Pencil, ArrowRight, Stethoscope, ChevronDown } from 'lucide-react';

const priorityStyles: Record<string, string> = {
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
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
        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
          <span>Looks like a {ctxCfg.label}</span>
          <button
            onClick={() => setShowContextPicker(v => !v)}
            className="font-medium text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
          >
            not right? change <ChevronDown className={`w-3 h-3 transition ${showContextPicker ? 'rotate-180' : ''}`} />
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
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
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
            className={`rounded-2xl border bg-white p-4 transition-all ${
              a.status === 'confirmed' ? 'border-teal-300 bg-teal-50/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${priorityStyles[a.priority]}`}>
                    {a.priority}
                  </span>
                  <span className="text-xs text-slate-500">due {a.dueContext}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{Math.round(a.confidence * 100)}% confidence</span>
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
                      className="px-3 rounded-lg bg-teal-600 text-white text-sm font-medium"
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
              </div>
            </div>

            {editingId !== a.id && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => confirm(a.id)}
                  className={`min-h-[44px] flex-1 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium transition ${
                    a.status === 'confirmed'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700'
                  }`}
                >
                  <Check className="w-4 h-4" /> {a.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                </button>
                <button
                  onClick={() => startEdit(a)}
                  className="min-h-[44px] px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => reject(a.id)}
                  className="min-h-[44px] px-4 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 flex items-center justify-center"
                  aria-label="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={() => navigate('/prototype/schedule')}
          disabled={confirmedCount === 0}
          className="w-full min-h-[56px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
        >
          Schedule {confirmedCount} action{confirmedCount === 1 ? '' : 's'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </PrototypeLayout>
  );
}
