import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LaunchCard } from '@/components/launch/LaunchCard';
import {
  DATA_ROOM_SECTIONS,
  KEY_ASSUMPTIONS,
  TOP_COMPARABLES,
  GTM_DIFFERENCES,
  KNOWN_GAPS,
  READING_ORDER,
  ALL_ARTEFACTS,
  CONFIDENTIALITY_NOTE,
  type Artefact,
  type ArtefactStatus,
  type Confidence,
} from '@/founder/dataRoom';
import {
  FileText, FileSpreadsheet, Image as ImageIcon, MonitorSmartphone,
  ExternalLink, Link2, ShieldAlert, Compass, Scale,
} from 'lucide-react';

const STORAGE_KEY = 'myrhythm.dataroom.links.v1';

const STATUS_LABEL: Record<ArtefactStatus, string> = {
  final: 'Final',
  draft: 'Draft',
  'human-action': 'Needs your action',
};

const STATUS_CLASS: Record<ArtefactStatus, string> = {
  final: 'bg-launch-gold/15 text-launch-ink border-launch-gold/40',
  draft: 'bg-muted text-muted-foreground border-border',
  'human-action': 'bg-destructive/10 text-destructive border-destructive/30',
};

const CONFIDENCE_CLASS: Record<Confidence, string> = {
  High: 'bg-launch-gold/20 text-launch-ink border-launch-gold/50',
  Medium: 'bg-muted text-muted-foreground border-border',
  Low: 'bg-destructive/10 text-destructive border-destructive/30',
};

function FormatIcon({ format }: { format: Artefact['format'] }) {
  const cls = 'h-4 w-4 text-launch-ink/60 shrink-0';
  if (format === 'Excel') return <FileSpreadsheet className={cls} />;
  if (format === 'PNG') return <ImageIcon className={cls} />;
  if (format === 'In-app') return <MonitorSmartphone className={cls} />;
  return <FileText className={cls} />;
}

export default function FounderDataRoomPage() {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLinks(JSON.parse(raw));
    } catch {
      /* ignore malformed cache */
    }
  }, []);

  const saveLink = (id: string, url: string) => {
    const next = { ...links, [id]: url };
    if (!url) delete next[id];
    setLinks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — links stay in memory for this session */
    }
  };

  const finalCount = ALL_ARTEFACTS.filter((a) => a.status === 'final').length;
  const actionCount = ALL_ARTEFACTS.filter((a) => a.status === 'human-action').length;

  return (
    <div className="launch-theme min-h-screen bg-[hsl(var(--launch-cream-light))]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <header className="space-y-3">
          <Badge variant="outline" className="border-launch-gold/50 text-launch-ink/70">
            Investor Data Room
          </Badge>
          <h1
            className="text-3xl md:text-4xl font-semibold text-launch-ink tracking-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            MyRhythm — Investor Data Room
          </h1>
          <p className="text-launch-ink/70 max-w-2xl">
            Every artefact an investor needs, in one place: the financial model, the five-year
            plan, the pitch narrative, and the assumptions everything rests on.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge className={STATUS_CLASS.final} variant="outline">{finalCount} final</Badge>
            <Badge className={STATUS_CLASS['human-action']} variant="outline">
              {actionCount} awaiting your action
            </Badge>
          </div>
        </header>

        {/* Reading order */}
        <LaunchCard variant="featured">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-launch-ink/70" />
            <h2 className="font-semibold text-launch-ink">How to use this room</h2>
          </div>
          <ol className="space-y-2 text-sm text-launch-ink/80">
            {READING_ORDER.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-launch-gold/20 text-launch-ink text-xs flex items-center justify-center shrink-0 font-medium">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </LaunchCard>

        {/* Artefact register */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-launch-ink" style={{ fontFamily: "'Sora', sans-serif" }}>
            Artefact register
          </h2>
          <p className="text-sm text-launch-ink/60">
            Documents live in your Lovable files under <code className="text-xs">/mnt/documents</code>.
            Add a Drive share link to any row once you have uploaded it.
          </p>

          <Accordion type="multiple" className="space-y-3">
            {DATA_ROOM_SECTIONS.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border border-launch-gold/30 rounded-2xl bg-launch-ivory px-5"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="text-left">
                    <div className="font-semibold text-launch-ink">{section.title}</div>
                    <div className="text-sm text-launch-ink/60 font-normal">{section.blurb}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-3">
                    {section.artefacts.map((a) => {
                      const isRoute = a.format === 'In-app';
                      return (
                        <div
                          key={a.id}
                          className="rounded-xl border border-launch-gold/25 bg-launch-cream-light/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-start gap-2 min-w-0">
                              <FormatIcon format={a.format} />
                              <div className="min-w-0">
                                <div className="font-medium text-launch-ink">
                                  <span className="text-launch-ink/40 text-xs mr-2">{a.id}</span>
                                  {a.title}
                                </div>
                                <div className="text-sm text-launch-ink/70 mt-0.5">{a.answers}</div>
                                <div className="text-xs text-launch-ink/45 mt-1 break-all">
                                  {a.location}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline" className={STATUS_CLASS[a.status]}>
                                {STATUS_LABEL[a.status]}
                              </Badge>
                              <span className="text-xs text-launch-ink/45">{a.updated}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-3 flex-wrap">
                            {isRoute && (
                              <Link
                                to={a.location}
                                className="inline-flex items-center gap-1.5 text-sm text-launch-ink underline underline-offset-4 hover:text-launch-ink/70 min-h-[44px]"
                              >
                                <ExternalLink className="h-4 w-4" /> Open in app
                              </Link>
                            )}

                            {!isRoute && links[a.id] && editing !== a.id && (
                              <a
                                href={links[a.id]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-launch-ink underline underline-offset-4 hover:text-launch-ink/70 min-h-[44px]"
                              >
                                <ExternalLink className="h-4 w-4" /> Open shared copy
                              </a>
                            )}

                            {!isRoute && editing === a.id ? (
                              <div className="flex items-center gap-2 w-full">
                                <Input
                                  autoFocus
                                  defaultValue={links[a.id] ?? ''}
                                  placeholder="https://drive.google.com/..."
                                  aria-label={`Share link for ${a.title}`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveLink(a.id, (e.target as HTMLInputElement).value.trim());
                                      setEditing(null);
                                    }
                                    if (e.key === 'Escape') setEditing(null);
                                  }}
                                  onBlur={(e) => {
                                    saveLink(a.id, e.target.value.trim());
                                    setEditing(null);
                                  }}
                                  className="h-11"
                                />
                              </div>
                            ) : (
                              !isRoute && (
                                <button
                                  onClick={() => setEditing(a.id)}
                                  className="inline-flex items-center gap-1.5 text-sm text-launch-ink/60 hover:text-launch-ink min-h-[44px]"
                                >
                                  <Link2 className="h-4 w-4" />
                                  {links[a.id] ? 'Edit link' : 'Add share link'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Key assumptions */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-launch-ink" style={{ fontFamily: "'Sora', sans-serif" }}>
            Key assumptions
          </h2>
          <p className="text-sm text-launch-ink/60">
            Everything in the financial model and the five-year plan rests on these. Confidence is
            stated honestly — Low means it is a working estimate, not a defended number.
          </p>
          <LaunchCard variant="elevated" className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-launch-cream-light/70 text-left text-launch-ink/70">
                    <th className="px-4 py-3 font-medium">Assumption</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {KEY_ASSUMPTIONS.map((a) => (
                    <tr key={a.key} className="border-t border-launch-gold/20 align-top">
                      <td className="px-4 py-3 text-launch-ink font-medium">{a.key}</td>
                      <td className="px-4 py-3 text-launch-ink/80">{a.value}</td>
                      <td className="px-4 py-3 text-launch-ink/60">{a.source}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={CONFIDENCE_CLASS[a.confidence]}>
                          {a.confidence}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaunchCard>
        </section>

        {/* Competitors summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-launch-ink" style={{ fontFamily: "'Sora', sans-serif" }}>
            Competitors, in short
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {TOP_COMPARABLES.map((c) => (
              <LaunchCard key={c.name} variant="default" className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-launch-ink">{c.name}</span>
                  <span className="text-xs text-launch-ink/50">{c.cluster}</span>
                </div>
                <p className="text-sm text-launch-ink/70 mt-1.5">{c.lesson}</p>
              </LaunchCard>
            ))}
          </div>

          <LaunchCard variant="featured">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-launch-ink/70" />
              <h3 className="font-semibold text-launch-ink">Why our go-to-market differs</h3>
            </div>
            <ul className="space-y-2 text-sm text-launch-ink/80">
              {GTM_DIFFERENCES.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-launch-gold mt-0.5">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-launch-ink/50 mt-4">
              Full analysis: B1 Competitor Benchmarking narrative and matrix, above.
            </p>
          </LaunchCard>
        </section>

        {/* Known gaps */}
        <section className="space-y-3">
          <LaunchCard variant="glass">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <h2 className="font-semibold text-launch-ink">Known gaps & human actions</h2>
            </div>
            <p className="text-sm text-launch-ink/60 mb-3">
              Stated openly. Investors test for this — hiding it costs more than showing it.
            </p>
            <ul className="space-y-2 text-sm text-launch-ink/80">
              {KNOWN_GAPS.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </LaunchCard>
        </section>

        <footer className="pt-4 space-y-2">
          <p className="text-xs text-launch-ink/50">
            Forward-looking statements: all projections are estimates and are not a forecast of
            actual results. Figures have not been reviewed by a CPA or legal counsel.
          </p>
          <p className="text-[8px] italic text-muted-foreground">{CONFIDENTIALITY_NOTE}</p>
        </footer>
      </div>
    </div>
  );
}
