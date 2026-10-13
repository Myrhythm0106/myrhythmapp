import React, { useEffect, useMemo, useState } from 'react';
import { Save, Volume2, Check, Sparkles, Undo2, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { fivePrompts } from '@/data/fivePrompts';
import { speechService } from '@/utils/speechSynthesis';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

export type VisionLevel = 'year' | 'three' | 'long';
export type Anchor = 'who' | 'what' | 'where' | 'when' | 'why' | 'how';
export type AnchorSummary = Record<Anchor, string>;

export const LEVELS: { id: VisionLevel; label: string }[] = [
  { id: 'year', label: 'This year' },
  { id: 'three', label: '3 years' },
  { id: 'long', label: 'Long term (5+ years)' },
];

const ANCHORS: { id: Anchor; label: string; ask: string }[] = [
  { id: 'who', label: 'Who', ask: 'Who will be with you on this?' },
  { id: 'what', label: 'What', ask: 'What do you most want to have or do?' },
  { id: 'where', label: 'Where', ask: 'Where will this happen — home, work, community?' },
  { id: 'when', label: 'When', ask: 'By when would you love this to be true?' },
  { id: 'why', label: 'Why', ask: 'Why does this matter to you?' },
  { id: 'how', label: 'How', ask: 'What is one first step you could take?' },
];

interface Props {
  answers: Record<string, string>;
  futureLabel: string;
  level: VisionLevel;
  onLevelChange: (l: VisionLevel) => void;
  statement: string;
  summary: AnchorSummary | null;
  onStatementChange: (v: string) => void;
  onSummaryChange: (s: AnchorSummary | null) => void;
  onSave: () => void;
  lastSaved?: string | null;
}

function stitch(answers: Record<string, string>, futureLabel: string): string {
  return fivePrompts
    .filter((p) => answers[p.id]?.trim())
    .map((p) => {
      if (p.id === 'future' && futureLabel && futureLabel !== 'Future') {
        const a = answers[p.id].trim().replace(/\.$/, '');
        return `For my sense of ${futureLabel.toLowerCase()}, ${a}.`;
      }
      return p.stitch(answers[p.id]);
    })
    .join(' ');
}

export function VisionStatementComposer({
  answers, futureLabel, level, onLevelChange, statement, summary,
  onStatementChange, onSummaryChange, onSave, lastSaved,
}: Props) {
  const suggested = useMemo(() => stitch(answers, futureLabel), [answers, futureLabel]);
  const [justSaved, setJustSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<(AnchorSummary & { paragraph: string }) | null>(null);
  const [undo, setUndo] = useState<{ statement: string; summary: AnchorSummary | null } | null>(null);
  const [extra, setExtra] = useState<Partial<Record<Anchor, string>>>({});
  const [showExtra, setShowExtra] = useState(false);

  const filled = fivePrompts.filter((p) => answers[p.id]?.trim());
  const canCompose = filled.length >= 2;

  useEffect(() => {
    if (!statement.trim() && suggested && level === 'year') onStatementChange(suggested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested]);

  useEffect(() => { setDraft(null); setError(null); }, [level]);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const compose = async () => {
    setBusy(true); setError(null);
    const sections = filled.map((p) => ({
      label: p.id === 'future' ? futureLabel : p.label,
      text: answers[p.id].trim(),
    }));
    const { data, error: err } = await supabase.functions.invoke('compose-vision', {
      body: { level, sections, anchors: extra },
    });
    setBusy(false);
    if (err || !data?.paragraph) {
      let msg = 'Could not write a draft just now. Your text is safe.';
      try { const b = await (err as any)?.context?.json?.(); if (b?.error) msg = b.error; } catch {}
      if (data?.error) msg = data.error;
      setError(msg);
      return;
    }
    setDraft(data);
  };

  const useDraft = () => {
    if (!draft) return;
    setUndo({ statement, summary });
    const { paragraph, ...rest } = draft;
    onStatementChange(paragraph);
    onSummaryChange(rest as AnchorSummary);
    setDraft(null);
  };

  const empty = !statement.trim();

  return (
    <div className="rounded-2xl border border-brain-health-100 bg-white p-5 md:p-6 space-y-5">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brain-health-500">
          My vision, in one paragraph
        </p>
        <p className="mt-1 text-sm text-brain-health-600">
          Edit freely. This is mine — change a word, a sentence, or the whole thing.
        </p>
      </div>

      <div role="radiogroup" aria-label="Timeframe" className="grid grid-cols-3 gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={level === l.id}
            onClick={() => onLevelChange(l.id)}
            className={cn(
              'min-h-[56px] rounded-xl border px-2 text-sm font-medium transition-colors',
              level === l.id
                ? 'border-brand-teal-600 bg-brand-teal-600/10 text-brand-teal-700'
                : 'border-brain-health-200 text-brain-health-600 hover:border-brand-teal-600/50',
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-brand-teal-600/20 bg-brand-teal-600/5 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={compose}
            disabled={!canCompose || busy}
            className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white min-h-[56px] px-5"
          >
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {busy ? 'Writing…' : 'Write my vision for me'}
          </Button>
          <button
            type="button"
            onClick={() => setShowExtra((s) => !s)}
            className="text-sm text-brand-teal-700 underline underline-offset-4 min-h-[44px]"
          >
            {showExtra ? 'Hide extra details' : 'Add a little more (optional)'}
          </button>
        </div>
        <p className="text-xs text-brain-health-600">
          {canCompose
            ? `Uses what you wrote in: ${filled.map((p) => (p.id === 'future' ? futureLabel : p.label)).join(', ')}. Shaped by Who, What, Where, When, Why and How. Free.`
            : 'Fill in at least two sections above and I can weave them into one clear paragraph.'}
        </p>
        {showExtra && (
          <div className="grid gap-2 sm:grid-cols-2">
            {ANCHORS.map((a) => (
              <label key={a.id} className="block">
                <span className="text-xs font-semibold text-brain-health-600">{a.label} — {a.ask}</span>
                <Input
                  value={extra[a.id] ?? ''}
                  maxLength={300}
                  onChange={(e) => setExtra((x) => ({ ...x, [a.id]: e.target.value }))}
                  className="mt-1 min-h-[48px]"
                />
              </label>
            ))}
          </div>
        )}
        {error && <p role="alert" className="text-sm text-brand-orange-600">{error}</p>}
      </div>

      {draft && (
        <div className="rounded-xl border border-brand-teal-600/40 p-4 space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brand-teal-700">Suggested draft</p>
          <p className="text-base leading-relaxed text-brain-health-800">{draft.paragraph}</p>
          <SummaryGrid summary={draft} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={useDraft} className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white min-h-[48px]">
              <Check className="h-4 w-4 mr-2" /> Use this
            </Button>
            <Button variant="outline" onClick={compose} disabled={busy} className="min-h-[48px]">
              <RefreshCw className="h-4 w-4 mr-2" /> Try another version
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)} className="min-h-[48px]">Keep mine</Button>
          </div>
        </div>
      )}

      <Textarea
        value={statement}
        onChange={(e) => onStatementChange(e.target.value)}
        placeholder="Fill in a prompt or two above, or tap Write my vision for me."
        rows={6}
        className="resize-none text-base leading-relaxed border-brain-health-200 focus-visible:ring-brand-teal-600/30 focus-visible:border-brand-teal-600"
      />

      {summary && <SummaryGrid summary={summary} />}

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleSave} disabled={empty} className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white min-h-[44px]">
          {justSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {justSaved ? 'Saved' : 'Save vision'}
        </Button>
        <Button variant="outline" onClick={() => statement && speechService.speak(statement)} disabled={empty} className="min-h-[44px]">
          <Volume2 className="h-4 w-4 mr-2" /> Read aloud
        </Button>
        {undo && (
          <Button
            variant="ghost"
            onClick={() => { onStatementChange(undo.statement); onSummaryChange(undo.summary); setUndo(null); }}
            className="min-h-[44px]"
          >
            <Undo2 className="h-4 w-4 mr-2" /> Undo
          </Button>
        )}
        {lastSaved && <span className="text-xs text-brain-health-500 ml-auto">Last saved {lastSaved}</span>}
      </div>
    </div>
  );
}

function SummaryGrid({ summary }: { summary: AnchorSummary }) {
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {ANCHORS.map((a) => (
        <div key={a.id} className="rounded-lg bg-brain-health-50 px-3 py-2">
          <dt className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brain-health-500">{a.label}</dt>
          <dd className="text-sm text-brain-health-800">{summary[a.id]}</dd>
        </div>
      ))}
    </dl>
  );
}
