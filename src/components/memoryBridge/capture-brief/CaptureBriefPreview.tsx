import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Lightbulb, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { BriefAction, CaptureBriefModel, SectionKey } from './model/types';
import { SmartCommitSlot } from './SmartCommitSlot';
import { commitAllRecommended } from './model/commitActions';

interface Props {
  model: CaptureBriefModel;
  sections: Record<SectionKey, boolean>;
  includeSchedule?: boolean;
  onActionUpdate?: (id: string, updates: Partial<BriefAction>) => void;
}

export function CaptureBriefPreview({ model, sections, includeSchedule = true, onActionUpdate }: Props) {
  const [bulkRunning, setBulkRunning] = useState(false);
  const pendingRecommended = useMemo(
    () => model.actions.filter(a => !a.scheduled?.calendarEventId && (a.suggestions?.length || 0) > 0),
    [model.actions],
  );

  const handleAcceptAll = async () => {
    if (pendingRecommended.length === 0) return;
    setBulkRunning(true);
    const res = await commitAllRecommended(pendingRecommended, (id, calId) => {
      onActionUpdate?.(id, {
        scheduled: {
          startDate: pendingRecommended.find(a => a.id === id)?.suggestions?.[0]?.date || '',
          startTime: pendingRecommended.find(a => a.id === id)?.suggestions?.[0]?.time || '',
          dueDate: pendingRecommended.find(a => a.id === id)?.dueDate?.date,
          reminders: [],
          invitedMemberIds: [],
          watcherMemberIds: [],
          calendarEventId: calId,
        },
      });
    });
    setBulkRunning(false);
    toast.success(`Scheduled ${res.committed} · skipped ${res.skipped}${res.failed ? ` · failed ${res.failed}` : ''}`);
  };


  return (
    <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
      {/* Cover */}
      <div className="p-10 border-b border-border bg-gradient-to-br from-background to-muted/30">
        <div className="h-1 w-14 bg-brand-orange-500 mb-6 rounded-full" />
        <div className="text-xs tracking-[0.2em] font-semibold text-brand-orange-600 mb-3">
          MYRHYTHM · CAPTURE BRIEF
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {model.title}
        </h1>
        <p className="text-sm text-muted-foreground">{model.date}</p>
        {model.participants.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">Participants · </span>
            {model.participants.join(', ')}
          </p>
        )}
        {model.context && (
          <p className="text-sm text-muted-foreground mt-2 italic">{model.context}</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-8">
          <Stat label="Actions" value={model.actions.length} />
          <Stat label="Decisions" value={model.decisions.length} />
          <Stat label="Open questions" value={model.openQuestions.length} />
        </div>
      </div>

      {/* So what? lead card */}
      <SoWhatCard model={model} />

      <div className="p-10 space-y-10">
        {sections.summary && (
          <Section title="Executive summary">
            <p className="text-foreground leading-relaxed">{model.summary}</p>
            {model.themes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider">
                Themes · {model.themes.join(' · ')}
              </p>
            )}
          </Section>
        )}

        {sections.actions && model.actions.length > 0 && (
          <Section title="Action register">
            {includeSchedule && pendingRecommended.length > 0 && (
              <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-xl bg-brand-orange-50 border border-brand-orange-200">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-brand-orange-600" />
                  <span className="text-brand-orange-700 font-semibold">
                    {pendingRecommended.length} actions ready · smart reminders included
                  </span>
                </div>
                <Button
                  onClick={handleAcceptAll}
                  disabled={bulkRunning}
                  className="min-h-[44px] bg-brand-orange-600 hover:bg-brand-orange-700 text-white"
                  size="sm"
                >
                  {bulkRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Accept all recommended
                </Button>
              </div>
            )}

            {includeSchedule ? (
              <div className="space-y-3">
                {model.actions.map((a, i) => (
                  <div key={a.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground tabular-nums">#{i + 1}</span>
                          <Badge
                            variant="secondary"
                            className={a.priorityLabel === 'High' ? 'bg-brand-orange-600 text-white' : ''}
                          >
                            {a.priorityLabel}
                          </Badge>
                          {a.dateMentionedInMeeting && (
                            <Badge variant="outline" className="text-brand-orange-700 border-brand-orange-300">
                              From meeting
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-foreground">{a.text}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Owner: {a.owner}{a.due ? ` · ${a.due}` : ''}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {Math.round(a.confidence * 100)}%
                      </div>
                    </div>
                    <SmartCommitSlot
                      action={a}
                      onUpdated={(updates) => onActionUpdate?.(a.id, updates)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-orange-600 text-white">
                      <th className="text-left px-3 py-2 font-semibold w-8">#</th>
                      <th className="text-left px-3 py-2 font-semibold">Action</th>
                      <th className="text-left px-3 py-2 font-semibold">Owner</th>
                      <th className="text-left px-3 py-2 font-semibold">Due</th>
                      <th className="text-left px-3 py-2 font-semibold">Priority</th>
                      <th className="text-right px-3 py-2 font-semibold">Conf.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.actions.map((a, i) => (
                      <tr key={a.id} className={i % 2 ? 'bg-muted/30' : ''}>
                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-2 text-foreground">{a.text}</td>
                        <td className="px-3 py-2 text-foreground">{a.owner}</td>
                        <td className="px-3 py-2 text-foreground">{a.due || '—'}</td>
                        <td className="px-3 py-2">
                          <Badge
                            variant={a.priorityLabel === 'High' ? 'default' : 'secondary'}
                            className={a.priorityLabel === 'High' ? 'bg-brand-orange-600 text-white' : ''}
                          >
                            {a.priorityLabel}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {Math.round(a.confidence * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        )}


        {sections.decisions && (
          <Section title="Decisions & themes">
            {model.decisions.length > 0 ? (
              <ul className="space-y-2">
                {model.decisions.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-orange-600 mt-2">●</span>
                    <span className="text-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No explicit decisions detected.</p>
            )}
          </Section>
        )}

        {sections.questions && (
          <Section title="Open questions">
            {model.openQuestions.length > 0 ? (
              <ul className="space-y-2">
                {model.openQuestions.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-orange-600 font-bold">?</span>
                    <span className="text-foreground">{q}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No unresolved questions detected.</p>
            )}
          </Section>
        )}

        {sections.transcript && model.transcript.length > 0 && (
          <Section title="Annotated transcript">
            <div className="space-y-4">
              {model.transcript.map((t, i) => (
                <div key={i}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-orange-600 mb-1">
                    {t.speaker}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="px-10 py-4 border-t border-border bg-muted/20 text-center">
        <p className="text-[10px] text-muted-foreground">
          MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 border-border">
      <div className="text-3xl font-bold text-brand-orange-600 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </Card>
  );
}

function SoWhatCard({ model }: { model: CaptureBriefModel }) {
  const topAction = useMemo(() => {
    if (!model.actions.length) return null;
    return [...model.actions].sort((a, b) => b.priority - a.priority || b.confidence - a.confidence)[0];
  }, [model.actions]);

  const remember = useMemo(() => {
    if (model.summary) {
      const sentences = model.summary.split(/(?<=[.!?])\s+/);
      return sentences[0]?.length > 20 ? sentences[0] : model.summary;
    }
    if (topAction) return `The key action is "${topAction.text}" — ${topAction.owner} is owning it.`;
    return 'No clear takeaway was captured. You can re-record or add a note.';
  }, [model.summary, topAction]);

  const watchOut = useMemo(() => {
    if (model.openQuestions.length) return model.openQuestions[0];
    const lowConf = model.actions.find(a => a.confidence < 0.5);
    if (lowConf) return `Low-confidence action: "${lowConf.text}" — worth double-checking.`;
    return 'No obvious watch-outs surfaced.';
  }, [model.openQuestions, model.actions]);

  const person = useMemo(() => {
    if (model.supportMembers?.length) return model.supportMembers[0].name;
    const mentioned = topAction?.people?.find(p => p.role !== 'none');
    if (mentioned) return mentioned.name;
    return null;
  }, [model.supportMembers, topAction]);

  return (
    <div className="px-10 py-6 border-b border-border bg-brand-orange-50/60">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-brand-orange-600" />
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange-700">So what?</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SoWhatItem icon={<Lightbulb className="h-4 w-4" />} label="The one thing to remember" text={remember} />
        <SoWhatItem
          icon={<Sparkles className="h-4 w-4" />}
          label="The one action to take"
          text={topAction ? `"${topAction.text}" — ${topAction.owner}${topAction.due ? ` · ${topAction.due}` : ''}` : 'No actions captured yet.'}
        />
        <SoWhatItem icon={<AlertTriangle className="h-4 w-4" />} label="One watch-out" text={watchOut} />
        <SoWhatItem
          icon={<Users className="h-4 w-4" />}
          label="One person to loop in"
          text={person || 'No one was mentioned. Add a Support Circle member if useful.'}
        />
      </div>
    </div>
  );
}

function SoWhatItem({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-brand-orange-100">
      <div className="mt-0.5 text-brand-orange-600">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-brand-orange-500/40 to-transparent" />
      </div>
      {children}
    </section>
  );
}
