import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CaptureBriefModel, SectionKey } from './model/types';

interface Props {
  model: CaptureBriefModel;
  sections: Record<SectionKey, boolean>;
}

export function CaptureBriefPreview({ model, sections }: Props) {
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
                          className={
                            a.priorityLabel === 'High'
                              ? 'bg-brand-orange-600 text-white'
                              : ''
                          }
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
