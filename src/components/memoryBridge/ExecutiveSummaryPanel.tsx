import React from 'react';
import { CalendarPlus, Users, FileText, CheckCircle2, Clock, Target, Lightbulb, HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface MeetingSummaryModel {
  title: string;
  date: string;
  participants: string[];
  context?: string;
  summary: string;
  themes: string[];
  decisions: string[];
  openQuestions: string[];
  counts: {
    total: number;
    withProposedDate: number;
    scheduled: number;
    complete: number;
  };
}

interface ExecutiveSummaryPanelProps {
  model: MeetingSummaryModel;
  onScheduleAll?: () => void;
  isSchedulingAll?: boolean;
  /**
   * Progressive disclosure: open with the narrative and counts only, and keep
   * themes / decisions / open questions behind one quiet expander.
   */
  collapsibleDetails?: boolean;
  /**
   * Render collapsed to a single strip (title, date, counts, "Show summary")
   * so the actions exhibit keeps the dominant space. One tap expands it.
   */
  defaultCollapsedStrip?: boolean;
}

const CHIP =
  'inline-flex items-center gap-1 h-[22px] rounded-[6px] px-2 font-sora text-[11px] font-semibold leading-none whitespace-nowrap';

function CountPill({ value, label, icon: Icon, tone }: { value: number; label: string; icon: React.ElementType; tone: 'ink' | 'moss' | 'amber' | 'soft' }) {
  const tones = {
    ink: 'bg-exhibit-ink text-white',
    moss: 'bg-exhibit-moss/10 text-exhibit-moss ring-1 ring-inset ring-exhibit-moss/30',
    amber: 'bg-exhibit-amber/10 text-exhibit-amber ring-1 ring-inset ring-exhibit-amber/40',
    soft: 'bg-exhibit-surface text-exhibit-soft ring-1 ring-inset ring-exhibit-rule',
  };
  return (
    <div className={cn('flex items-center gap-2 rounded-[6px] px-2.5 py-1.5', tones[tone])}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-sora text-xs font-semibold tabular-nums">{value}</span>
      <span className="font-manrope text-[11px] text-current/80">{label}</span>
    </div>
  );
}

export function ExecutiveSummaryPanel({ model, onScheduleAll, isSchedulingAll, collapsibleDetails, defaultCollapsedStrip }: ExecutiveSummaryPanelProps) {
  const hasExtras = model.themes.length > 0 || model.decisions.length > 0 || model.openQuestions.length > 0;
  const [stripOpen, setStripOpen] = React.useState(!defaultCollapsedStrip);
  const [detailsOpen, setDetailsOpen] = React.useState(!collapsibleDetails);
  const [narrativeOpen, setNarrativeOpen] = React.useState(false);
  const [themesOpen, setThemesOpen] = React.useState(false);
  const showDetails = collapsibleDetails ? detailsOpen : true;
  const detailCount = model.decisions.length + model.openQuestions.length;
  const narrativeIsLong = model.summary.length > 180;
  const visibleThemes = themesOpen ? model.themes : model.themes.slice(0, 3);
  const hasDecisionExtras = model.decisions.length > 0 || model.openQuestions.length > 0;

  // Compact strip: the summary's orientation (title, date, counts) in one line,
  // so the actions exhibit keeps the dominant space. One tap expands.
  if (defaultCollapsedStrip && !stripOpen) {
    return (
      <article
        className="overflow-hidden rounded-lg border-2 border-exhibit-ink bg-exhibit-paper shadow-lg"
        data-testid="executive-summary"
      >
        <button
          type="button"
          onClick={() => setStripOpen(true)}
          aria-expanded={false}
          className="flex min-h-[56px] w-full flex-wrap items-center gap-x-4 gap-y-1.5 bg-exhibit-ink px-5 py-3 text-left text-exhibit-paper transition-colors hover:bg-exhibit-ink/95"
        >
          <FileText className="h-4 w-4 shrink-0 text-exhibit-accent" />
          <div className="min-w-0 flex-1">
            <span className="block font-sora text-[10px] font-bold uppercase tracking-[0.18em] text-exhibit-paper/70">
              Executive summary
            </span>
            <span className="block truncate font-sora text-sm font-semibold leading-snug">
              {model.title} <span className="font-manrope font-normal text-exhibit-paper/70">· {model.date}</span>
            </span>
          </div>
          <span className="hidden items-center gap-3 font-sora text-[11px] font-semibold tabular-nums text-exhibit-paper/85 sm:flex">
            <span>{model.counts.total} actions</span>
            <span>{model.counts.withProposedDate} proposed</span>
            <span>{model.counts.scheduled} scheduled</span>
            <span>{model.counts.complete} done</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-exhibit-paper/30 px-2.5 py-1.5 font-sora text-[11px] font-semibold">
            Show summary <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
      </article>
    );
  }

  return (
    <article
      className="overflow-hidden rounded-lg border-2 border-exhibit-ink bg-exhibit-paper shadow-lg"
      data-testid="executive-summary"
    >
      <div className="bg-exhibit-ink px-5 py-4 text-exhibit-paper">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <FileText className="h-5 w-5 text-exhibit-accent" />
              <span className="font-sora text-xs font-bold uppercase tracking-[0.18em] text-exhibit-paper">
                Professional executive summary
              </span>
              {defaultCollapsedStrip && (
                <button
                  type="button"
                  onClick={() => setStripOpen(false)}
                  aria-expanded={true}
                  className="ml-1 inline-flex min-h-[36px] items-center gap-1 rounded-[6px] border border-exhibit-paper/30 px-2.5 font-sora text-[11px] font-semibold text-exhibit-paper/90 transition-colors hover:bg-exhibit-paper/10"
                >
                  Hide summary <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                </button>
              )}
            </div>
            <h2 className="mt-2 font-sora text-xl font-semibold leading-tight text-exhibit-paper">
              {model.title}
            </h2>
            <p className="mt-1 font-manrope text-[13px] text-exhibit-paper/80">
              {model.date}
              {model.participants.length > 0 && ` · ${model.participants.join(', ')}`}
              {model.context && ` · ${model.context}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onScheduleAll && (
              <Button
                onClick={onScheduleAll}
                disabled={isSchedulingAll || model.counts.total === 0}
                size="sm"
                className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-md"
              >
                {isSchedulingAll ? (
                  <>
                <span className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Scheduling…
              </>
                ) : (
                  <>
                    <CalendarPlus className="h-4 w-4 mr-1" /> Schedule all proposed dates
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-exhibit-rule bg-exhibit-surface px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <CountPill value={model.counts.total} label="actions" icon={Target} tone="ink" />
          <CountPill value={model.counts.withProposedDate} label="proposed" icon={Clock} tone="moss" />
          <CountPill value={model.counts.scheduled} label="scheduled" icon={Users} tone="moss" />
          <CountPill value={model.counts.complete} label="done" icon={CheckCircle2} tone="soft" />
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        <section className="border-l-4 border-exhibit-accent pl-4">
          <p className="mb-1.5 font-sora text-[10.5px] font-bold uppercase tracking-[0.14em] text-exhibit-moss">
            Meeting overview
          </p>
          <p className={cn('font-manrope text-[15px] leading-7 text-exhibit-ink', !narrativeOpen && 'line-clamp-2')}>
            {model.summary}
          </p>
          {narrativeIsLong && (
            <button
              type="button"
              onClick={() => setNarrativeOpen(open => !open)}
              aria-expanded={narrativeOpen}
              className="mt-1.5 inline-flex min-h-[36px] items-center gap-1 font-sora text-[12px] font-semibold text-exhibit-moss underline-offset-2 hover:underline"
            >
              {narrativeOpen ? 'Show less' : 'Read more'}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', narrativeOpen && 'rotate-180')} />
            </button>
          )}
        </section>

        {model.themes.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-exhibit-moss" />
              <span className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.14em] text-exhibit-moss">
                Key themes
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {visibleThemes.map(theme => (
                <span key={theme} className={cn(CHIP, 'bg-exhibit-surface text-exhibit-ink ring-1 ring-inset ring-exhibit-rule')}>
                  {theme}
                </span>
              ))}
              {model.themes.length > 3 && (
                <button
                  type="button"
                  onClick={() => setThemesOpen(open => !open)}
                  aria-expanded={themesOpen}
                  className={cn(CHIP, 'min-h-[36px] text-exhibit-moss ring-1 ring-inset ring-exhibit-moss/40 transition-colors hover:bg-exhibit-moss/10')}
                >
                  {themesOpen ? 'Show fewer' : `+${model.themes.length - 3} more`}
                </button>
              )}
            </div>
          </section>
        )}

        {collapsibleDetails && hasDecisionExtras && !detailsOpen && (
          <div className="space-y-1.5 rounded-[6px] border border-exhibit-rule bg-exhibit-surface/60 px-3 py-2.5">
            {model.decisions[0] && (
              <p className="flex gap-2 font-manrope text-[13px] leading-snug text-exhibit-ink">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-exhibit-moss" />
                <span className="line-clamp-1">
                  <span className="font-semibold">{model.decisions.length} decision{model.decisions.length === 1 ? '' : 's'} captured</span>
                  <span className="text-exhibit-soft"> — {model.decisions[0]}</span>
                </span>
              </p>
            )}
            {model.openQuestions[0] && (
              <p className="flex gap-2 font-manrope text-[13px] leading-snug text-exhibit-ink">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-exhibit-amber" />
                <span className="line-clamp-1">
                  <span className="font-semibold">{model.openQuestions.length} open question{model.openQuestions.length === 1 ? '' : 's'}</span>
                  <span className="text-exhibit-soft"> — {model.openQuestions[0]}</span>
                </span>
              </p>
            )}
          </div>
        )}

        {collapsibleDetails && hasDecisionExtras && (
          <button
            type="button"
            onClick={() => setDetailsOpen(open => !open)}
            aria-expanded={detailsOpen}
            className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-[6px] border border-exhibit-rule bg-exhibit-surface/60 px-3 py-2.5 text-left transition-colors hover:bg-exhibit-surface"
          >
            <span className="font-sora text-[11.5px] font-semibold uppercase tracking-[0.14em] text-exhibit-moss">
              {detailsOpen ? 'Hide detail' : `Show detail · ${detailCount} item${detailCount === 1 ? '' : 's'}`}
            </span>
            <ChevronDown className={cn('h-4 w-4 text-exhibit-moss transition-transform', detailsOpen && 'rotate-180')} />
          </button>
        )}

        {showDetails && hasDecisionExtras && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {model.decisions.length > 0 && (
                <div className="rounded-lg bg-exhibit-surface/50 border border-exhibit-rule/60 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-exhibit-moss" />
                    <span className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.14em] text-exhibit-moss">
                      Decisions captured
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {model.decisions.slice(0, 5).map((d, i) => (
                      <li key={i} className="font-manrope text-[13px] leading-snug text-exhibit-ink flex gap-2">
                        <span className="text-exhibit-moss">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {model.openQuestions.length > 0 && (
                <div className="rounded-lg bg-exhibit-surface/50 border border-exhibit-rule/60 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <HelpCircle className="h-3.5 w-3.5 text-exhibit-amber" />
                    <span className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.14em] text-exhibit-amber">
                      Open questions
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {model.openQuestions.slice(0, 5).map((q, i) => (
                      <li key={i} className="font-manrope text-[13px] leading-snug text-exhibit-ink flex gap-2">
                        <span className="text-exhibit-amber">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        {!hasExtras && (
          <p className="border-t border-exhibit-rule pt-4 font-manrope text-[12.5px] italic text-exhibit-soft">
            No additional themes, decisions or open questions were extracted from this conversation.
          </p>
        )}
      </div>
    </article>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-exhibit-rule bg-exhibit-paper overflow-hidden shadow-sm">
      <div className="bg-exhibit-surface border-b border-exhibit-rule px-5 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-exhibit-moss" />
          <span className="font-sora text-[10.5px] font-semibold uppercase tracking-[0.18em] text-exhibit-moss">
            Executive summary
          </span>
        </div>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function ExecutiveSummarySkeleton() {
  return (
    <Shell>
      <div className="space-y-2.5 animate-pulse">
        <div className="h-4 w-2/3 rounded bg-exhibit-surface" />
        <div className="h-3 w-full rounded bg-exhibit-surface" />
        <div className="h-3 w-11/12 rounded bg-exhibit-surface" />
        <div className="h-3 w-3/5 rounded bg-exhibit-surface" />
      </div>
    </Shell>
  );
}

export function ExecutiveSummaryError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-manrope text-[13.5px] text-exhibit-ink">
          Summary is still being prepared. Your next steps below are unaffected.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="border-exhibit-rule text-exhibit-ink">
            Retry
          </Button>
        )}
      </div>
    </Shell>
  );
}

