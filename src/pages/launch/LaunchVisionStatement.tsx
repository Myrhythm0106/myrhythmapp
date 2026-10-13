import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { CapabilityHero } from '@/components/launch/chrome/CapabilityHero';
import { FivePromptCard } from '@/components/launch/vision/FivePromptCard';
import { VisionStatementComposer, type VisionLevel, type AnchorSummary } from '@/components/launch/vision/VisionStatementComposer';
import { fivePrompts } from '@/data/fivePrompts';

const STORAGE_KEY = 'myrhythm.visionStatement.v1';

interface Persisted {
  answers: Record<string, string>;
  futureLabel: string;
  statement: string;
  savedAt: string | null;
  level: VisionLevel;
  levels: Partial<Record<VisionLevel, { statement: string; summary: AnchorSummary | null }>>;
}

const initial: Persisted = {
  answers: { family: '', friends: '', fitness: '', finances: '', future: '' },
  futureLabel: 'Future',
  statement: '',
  savedAt: null,
  level: 'year',
  levels: {},
};

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const p = { ...initial, ...JSON.parse(raw) } as Persisted;
    if (!p.levels?.year && p.statement) p.levels = { ...p.levels, year: { statement: p.statement, summary: null } };
    return p;
  } catch {
    return initial;
  }
}

export default function LaunchVisionStatement() {
  const [state, setState] = useState<Persisted>(initial);

  useEffect(() => {
    setState(load());
  }, []);

  const update = (patch: Partial<Persisted>) => setState((s) => ({ ...s, ...patch }));

  const setAnswer = (id: string, v: string) =>
    update({ answers: { ...state.answers, [id]: v } });

  const current = state.levels[state.level] ?? { statement: '', summary: null };
  const setLevelData = (patch: Partial<{ statement: string; summary: AnchorSummary | null }>) =>
    setState((s) => {
      const cur = s.levels[s.level] ?? { statement: '', summary: null };
      const next = { ...cur, ...patch };
      return { ...s, levels: { ...s.levels, [s.level]: next }, ...(s.level === 'year' ? { statement: next.statement } : {}) };
    });

  const handleSave = () => {
    const savedAt = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
    const next = { ...state, savedAt };
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <LaunchLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <CapabilityHero
          eyebrow="Vision"
          title="Your ultimate vision, in your own words."
          lede="One short paragraph. Five gentle prompts. No right answer — just the one that feels true today."
          icon={Compass}
          tone="teal"
          meta={[
            { label: 'Private', tone: 'neutral' },
            { label: 'Editable any time', tone: 'info' },
          ]}
        />

        <section aria-label="Five life prompts" className="space-y-3">
          {fivePrompts.map((p) => (
            <FivePromptCard
              key={p.id}
              prompt={p}
              value={state.answers[p.id] ?? ''}
              onChange={(v) => setAnswer(p.id, v)}
              label={p.id === 'future' ? state.futureLabel : undefined}
              onLabelChange={p.id === 'future' ? (l) => update({ futureLabel: l }) : undefined}
            />
          ))}
        </section>

        <VisionStatementComposer
          answers={state.answers}
          futureLabel={state.futureLabel}
          level={state.level}
          onLevelChange={(l) => update({ level: l })}
          statement={current.statement}
          summary={current.summary}
          onStatementChange={(v) => setLevelData({ statement: v })}
          onSummaryChange={(sm) => setLevelData({ summary: sm })}
          onSave={handleSave}
          lastSaved={state.savedAt}
        />

        <p className="text-center text-xs text-brain-health-500 pt-2 pb-6">
          This is yours. Nothing here is shared, scored, or judged.
        </p>
      </div>
    </LaunchLayout>
  );
}
