import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Loader2, X, RefreshCw, HelpCircle, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Scope = 'day' | 'week' | 'month' | 'year';
type Feeling = 'low' | 'steady' | 'strong';

interface Draft {
  core: string;
  key: string;
  stretch: string;
  rationale: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scope: Scope;
  periodStart: Date;
  onAccept: (draft: Draft) => void;
}

const scopeLabel: Record<Scope, string> = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
};

export function LaunchAiPlanAssist({ isOpen, onClose, scope, periodStart, onAccept }: Props) {
  const [step, setStep] = useState<'feeling' | 'aspiration' | 'commitments' | 'draft'>('feeling');
  const [feeling, setFeeling] = useState<Feeling | undefined>();
  const [aspiration, setAspiration] = useState('');
  const [commitments, setCommitments] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setStep('feeling');
    setFeeling(undefined);
    setAspiration('');
    setCommitments('');
    setDraft(null);
    setError(null);
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('plan-assist', {
        body: {
          scope,
          period_start: format(periodStart, 'yyyy-MM-dd'),
          feeling,
          aspiration: aspiration || undefined,
          existing_commitments: commitments || undefined,
        },
      });
      if (fnErr) throw fnErr;
      if (data?.error) throw new Error(data.error);
      setDraft(data as Draft);
      setStep('draft');
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes('429')) setError("Let's try again in a moment — the assistant is busy.");
      else if (msg.includes('402')) setError('AI credits are needed to continue. Add credits from Settings.');
      else setError("Couldn't generate a plan just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const accept = () => {
    if (!draft) return;
    onAccept(draft);
    reset();
    onClose();
  };

  return createPortal(
    <div role="dialog" aria-modal="true" className="launch-theme fixed inset-0 z-[100] bg-[hsl(var(--launch-ink)/0.45)] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-launch-ivory w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-launch-gold/40 max-h-[90svh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-launch-ivory border-launch-gold/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-launch-teal" />
            <h3 className="font-bold text-launch-ink">Help me plan {scopeLabel[scope]}</h3>
          </div>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="p-2 hover:bg-white/60 rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-4">
          {step === 'feeling' && (
            <div className="space-y-3">
              <p className="text-gray-700">How are you feeling about {scopeLabel[scope]}?</p>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'steady', 'strong'] as Feeling[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFeeling(f);
                      setStep('aspiration');
                    }}
                    className={cn(
                      'min-h-[56px] rounded-2xl border-2 font-medium capitalize transition-colors',
                      feeling === f
                        ? 'border-launch-teal bg-launch-teal/10 text-launch-teal'
                        : 'border-gray-200 hover:border-launch-teal/50 text-gray-700',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowHints((v) => !v)}
                aria-expanded={showHints}
                className="min-h-[44px] flex items-center gap-1.5 text-sm text-launch-teal hover:text-launch-ink underline-offset-2 hover:underline"
              >
                <HelpCircle className="h-4 w-4" />
                {showHints ? 'Hide' : 'What do these mean?'}
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', showHints && 'rotate-180')}
                />
              </button>
              {showHints && (
                <div className="rounded-xl bg-launch-teal/10/60 border border-launch-gold/30 p-3 text-sm text-gray-700 space-y-1.5">
                  <p><span className="font-semibold text-launch-ink">Low</span> — Tired, foggy, or stretched. Plan stays tiny and kind.</p>
                  <p><span className="font-semibold text-launch-ink">Steady</span> — Okay-ish. A realistic, normal plan.</p>
                  <p><span className="font-semibold text-launch-ink">Strong</span> — Clear and energised. Ready to lean in.</p>
                </div>
              )}
              <button
                onClick={() => setStep('aspiration')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Skip this
              </button>
            </div>
          )}

          {step === 'aspiration' && (
            <div className="space-y-3">
              <p className="text-gray-700">
                One thing you'd love to be true by the end of {scopeLabel[scope]}?
              </p>
              <textarea
                value={aspiration}
                onChange={(e) => setAspiration(e.target.value)}
                placeholder="e.g. I want to feel calmer, or finish that email…"
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-launch-teal focus:ring-1 focus:ring-launch-teal outline-none text-base"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('feeling')}
                  className="flex-1 min-h-[56px] rounded-2xl border-2 border-gray-200 text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('commitments')}
                  className="flex-1 min-h-[56px] rounded-2xl bg-launch-teal text-white font-medium hover:opacity-90"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 'commitments' && (
            <div className="space-y-3">
              <p className="text-gray-700">
                Anything you're already committed to? <span className="text-gray-400">(optional)</span>
              </p>
              <textarea
                value={commitments}
                onChange={(e) => setCommitments(e.target.value)}
                placeholder="e.g. school run, physio Tuesday…"
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-launch-teal focus:ring-1 focus:ring-launch-teal outline-none text-base"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('aspiration')}
                  className="flex-1 min-h-[56px] rounded-2xl border-2 border-gray-200 text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex-1 min-h-[56px] rounded-2xl bg-launch-teal text-white font-medium hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Draft my plan
                </button>
              </div>
            </div>
          )}

          {step === 'draft' && draft && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Suggested — edit anything.
              </p>
              {(['core', 'key', 'stretch'] as const).map((k) => (
                <div key={k} className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 capitalize">{k}</label>
                  <input
                    value={draft[k]}
                    onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-launch-teal focus:ring-1 focus:ring-launch-teal outline-none text-base"
                  />
                </div>
              ))}
              <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 italic">
                {draft.rationale}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="flex-1 min-h-[56px] rounded-2xl border-2 border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Try again
                </button>
                <button
                  onClick={accept}
                  className="flex-1 min-h-[56px] rounded-2xl bg-launch-teal text-white font-medium hover:opacity-90"
                >
                  Use this plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
