import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Activity, Filter, MessageSquareQuote, Repeat, ScrollText,
  TrendingDown, ArrowLeft, Download, ShieldCheck,
} from 'lucide-react';

type FunnelRow = { step: string; step_order: number; users: number; events: number };
type UsageRow = { surface: string; users: number; uses: number };
type RetentionRow = { bucket: string; users: number };
type FeedbackRow = { id: string; created_at: string; [k: string]: any };
type DecisionRow = {
  id: string;
  feature: string;
  verdict: string;
  evidence: string | null;
  notes: string | null;
  decided_at: string;
};

const VERDICTS = ['Keep', 'Fix', 'Cut', 'Add', 'Park'] as const;

const VERDICT_CLASS: Record<string, string> = {
  Keep: 'bg-launch-gold/20 text-launch-ink border-launch-gold/50',
  Fix: 'bg-amber-100 text-amber-900 border-amber-300',
  Cut: 'bg-destructive/10 text-destructive border-destructive/30',
  Add: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Park: 'bg-muted text-muted-foreground border-border',
};

/** The rule that turns a number into a decision. Documented in docs/evidence-decision-system.md. */
function verdictFor(usersUsing: number, activeUsers: number): { verdict: string; why: string } {
  if (activeUsers === 0) return { verdict: 'Park', why: 'No active users yet in this window.' };
  const pct = Math.round((usersUsing / activeUsers) * 100);
  if (pct >= 40) return { verdict: 'Keep', why: `${pct}% of active people used it — above the 40% keep line.` };
  if (pct >= 15) return { verdict: 'Fix', why: `${pct}% used it — real but under-adopted. Fix the entry point before cutting.` };
  return { verdict: 'Cut', why: `${pct}% used it — below the 15% floor. Cut or fold into another surface.` };
}

function Metric({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-launch-gold/30 bg-launch-ivory p-4">
      <p className="text-xs uppercase tracking-wide text-launch-ink/60">{label}</p>
      <p className="text-2xl font-semibold text-launch-ink mt-1">{value}</p>
      {sub && <p className="text-xs text-launch-ink/60 mt-1">{sub}</p>}
    </div>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 rounded-full bg-launch-gold/15 overflow-hidden">
      <div className="h-full rounded-full bg-launch-gold" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function FounderEvidencePage() {
  const [days, setDays] = useState('30');
  const [loading, setLoading] = useState(true);
  const [funnel, setFunnel] = useState<FunnelRow[]>([]);
  const [usage, setUsage] = useState<UsageRow[]>([]);
  const [retention, setRetention] = useState<RetentionRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [decisions, setDecisions] = useState<DecisionRow[]>([]);
  const [consentCount, setConsentCount] = useState(0);

  // New decision form
  const [feature, setFeature] = useState('');
  const [verdict, setVerdict] = useState<string>('Keep');
  const [evidence, setEvidence] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const windowDays = parseInt(days, 10);

  const load = async () => {
    setLoading(true);
    try {
      const [f, u, r, fb, d, rc] = await Promise.all([
        supabase.rpc('founder_funnel', { _days: windowDays }),
        supabase.rpc('founder_feature_usage', { _days: windowDays }),
        supabase.rpc('founder_retention', { _days: 90 }),
        supabase.from('founding_feedback').select('*').order('created_at', { ascending: false }).limit(30),
        supabase.from('product_decisions').select('*').order('decided_at', { ascending: false }).limit(50),
        supabase.from('research_consent').select('user_id', { count: 'exact', head: true }).eq('granted', true),
      ]);
      if (f.error) throw f.error;
      setFunnel((f.data as FunnelRow[]) ?? []);
      setUsage((u.data as UsageRow[]) ?? []);
      setRetention((r.data as RetentionRow[]) ?? []);
      setFeedback((fb.data as FeedbackRow[]) ?? []);
      setDecisions((d.data as DecisionRow[]) ?? []);
      setConsentCount(rc.count ?? 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Could not load the evidence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const activeUsers = useMemo(
    () => usage.reduce((max, row) => Math.max(max, row.users), 0),
    [usage]
  );
  const maxUses = useMemo(() => usage.reduce((m, r) => Math.max(m, r.uses), 0), [usage]);
  const funnelTop = funnel.length ? Math.max(...funnel.map((r) => r.users)) : 0;

  const saveDecision = async () => {
    if (!feature.trim()) {
      toast.error('Name the feature first.');
      return;
    }
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from('product_decisions').insert({
        feature: feature.trim(),
        verdict,
        evidence: evidence.trim() || null,
        notes: notes.trim() || null,
        decided_by: auth?.user?.id ?? null,
      });
      if (error) throw error;
      toast.success('Decision logged against the numbers.');
      setFeature('');
      setEvidence('');
      setNotes('');
      load();
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not save that decision.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      ['section', 'label', 'users', 'uses'],
      ...funnel.map((r) => ['funnel', r.step, String(r.users), String(r.events)]),
      ...usage.map((r) => ['usage', r.surface, String(r.users), String(r.uses)]),
      ...retention.map((r) => ['return', r.bucket, String(r.users), '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `myrhythm-evidence-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-launch-parchment">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              to="/founder/data-room"
              className="inline-flex items-center gap-1.5 text-sm text-launch-ink/60 hover:text-launch-ink mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Data room
            </Link>
            <h1 className="text-2xl font-semibold text-launch-ink">Evidence</h1>
            <p className="text-sm text-launch-ink/70 mt-1 max-w-2xl">
              See what people actually do, then decide with it. Every panel below ends in a Keep, Fix or Cut
              call you can log — so the roadmap has a paper trail.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-1.5 opacity-60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1.5" /> CSV
            </Button>
          </div>
        </div>

        {/* Headline numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Active people" value={activeUsers} sub={`in the last ${days} days`} />
          <Metric label="Surfaces used" value={usage.length} sub="distinct actions recorded" />
          <Metric
            label="Research contributors"
            value={consentCount}
            sub={consentCount >= 20 ? 'above the k=20 floor' : 'below k=20 — no aggregates yet'}
          />
          <Metric label="Decisions logged" value={decisions.length} sub="with evidence attached" />
        </div>

        {/* Funnel */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-launch-gold" />
              <h2 className="text-lg font-semibold text-launch-ink">Where people fall away</h2>
            </div>
            {loading && <p className="text-sm text-launch-ink/60">Loading…</p>}
            {!loading && funnel.length === 0 && (
              <p className="text-sm text-launch-ink/60">No events in this window yet.</p>
            )}
            <div className="space-y-3">
              {funnel.map((row, i) => {
                const prev = funnel[i - 1];
                const drop = prev && prev.users > 0 ? Math.round(((prev.users - row.users) / prev.users) * 100) : 0;
                return (
                  <div key={row.step} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-launch-ink">{row.step}</span>
                      <span className="text-launch-ink/70">
                        {row.users} {row.users === 1 ? 'person' : 'people'}
                        {i > 0 && drop > 0 && (
                          <span className="text-destructive ml-2">−{drop}%</span>
                        )}
                      </span>
                    </div>
                    <Bar value={row.users} max={funnelTop} />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-launch-ink/60 border-t border-launch-gold/20 pt-3">
              Read this as one question: at which step does someone stop believing this will help?
              The biggest single drop is the only thing worth fixing this week.
            </p>
          </div>
        </LaunchCard>

        {/* Feature usage with automatic verdicts */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-launch-gold" />
              <h2 className="text-lg font-semibold text-launch-ink">Keep, Fix or Cut</h2>
            </div>
            <p className="text-sm text-launch-ink/70">
              40% or more of active people used it → Keep. 15–39% → Fix the entry point. Under 15% → Cut or fold in.
            </p>
            {!loading && usage.length === 0 && (
              <p className="text-sm text-launch-ink/60">No surface events recorded yet.</p>
            )}
            <div className="space-y-3">
              {usage.slice(0, 20).map((row) => {
                const v = verdictFor(row.users, activeUsers);
                return (
                  <div key={row.surface} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-launch-ink truncate">{row.surface}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-launch-ink/60">
                          {row.users} people · {row.uses} uses
                        </span>
                        <Badge variant="outline" className={VERDICT_CLASS[v.verdict]}>
                          {v.verdict}
                        </Badge>
                      </div>
                    </div>
                    <Bar value={row.uses} max={maxUses} />
                    <p className="text-xs text-launch-ink/55">{v.why}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </LaunchCard>

        {/* Return behaviour */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-launch-gold" />
              <h2 className="text-lg font-semibold text-launch-ink">Do they come back?</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {retention.map((r) => (
                <Metric key={r.bucket} label={r.bucket} value={r.users} sub="returned" />
              ))}
            </div>
            <p className="text-xs text-launch-ink/60 border-t border-launch-gold/20 pt-3">
              Return on day 7 and day 30 is the honest measure of a continuity layer. A feature that
              lifts day-30 return is worth more than one that lifts first-session delight.
            </p>
          </div>
        </LaunchCard>

        {/* Voice of the cohort */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5 text-launch-gold" />
              <h2 className="text-lg font-semibold text-launch-ink">Voice of the cohort</h2>
            </div>
            {feedback.length === 0 && (
              <p className="text-sm text-launch-ink/60">No feedback submitted yet.</p>
            )}
            <Accordion type="single" collapsible className="w-full">
              {feedback.map((f) => {
                const text =
                  f.message ?? f.feedback ?? f.content ?? f.body ?? JSON.stringify(f);
                return (
                  <AccordionItem key={f.id} value={f.id}>
                    <AccordionTrigger className="text-sm text-left">
                      {new Date(f.created_at).toLocaleDateString('en-GB')} —{' '}
                      {String(text).slice(0, 60)}
                      {String(text).length > 60 ? '…' : ''}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-launch-ink/80 whitespace-pre-wrap">
                      {String(text)}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </LaunchCard>

        {/* Decision log */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-launch-gold" />
              <h2 className="text-lg font-semibold text-launch-ink">Decision log</h2>
            </div>
            <p className="text-sm text-launch-ink/70">
              Log the call and the number that triggered it. This is the evidence trail investors and
              clinicians ask for.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Feature or surface"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              />
              <Select value={verdict} onValueChange={setVerdict}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERDICTS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Evidence — e.g. 'used by 9% of active people over 30 days'"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
            />
            <Textarea
              placeholder="What changes as a result?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <Button onClick={saveDecision} disabled={saving} className="min-h-[48px]">
              {saving ? 'Saving…' : 'Log this decision'}
            </Button>

            <div className="space-y-2 border-t border-launch-gold/20 pt-4">
              {decisions.length === 0 && (
                <p className="text-sm text-launch-ink/60">No decisions logged yet.</p>
              )}
              {decisions.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-launch-gold/25 p-3 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-launch-ink">{d.feature}</span>
                    <Badge variant="outline" className={VERDICT_CLASS[d.verdict] ?? ''}>
                      {d.verdict}
                    </Badge>
                  </div>
                  {d.evidence && <p className="text-launch-ink/70">{d.evidence}</p>}
                  {d.notes && <p className="text-launch-ink/60">{d.notes}</p>}
                  <p className="text-xs text-launch-ink/50">
                    {new Date(d.decided_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </LaunchCard>

        {/* Guardrails */}
        <LaunchCard className="bg-launch-ivory border-launch-gold/30">
          <div className="p-5 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-launch-gold mt-0.5 shrink-0" />
            <p className="text-sm text-launch-ink/75">
              Everything on this page describes behaviour, confidence and quality of life — not clinical
              outcome. Nothing here may be used to claim MyRhythm improves cognitive function or medical
              results. Research aggregates are suppressed below 20 contributors. See the research data
              charter and claims policy in the repository docs.
            </p>
          </div>
        </LaunchCard>
      </div>
    </div>
  );
}
