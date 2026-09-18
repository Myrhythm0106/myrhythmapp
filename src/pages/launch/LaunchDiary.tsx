import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Search, Mic, ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import { useDiaryEntries, type DiaryEntry, type DiaryKind } from '@/launch/diary/useDiaryEntries';

type Filter = 'all' | 'conversation' | 'brain-health';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'conversation', label: 'Conversations' },
  { key: 'brain-health', label: 'Brain health' },
];

const ICON: Record<DiaryKind, React.ComponentType<{ className?: string }>> = {
  conversation: Mic,
  'brain-health': ClipboardList,
  step: CheckCircle2,
};

function longDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export default function LaunchDiary() {
  const navigate = useNavigate();
  const { entries, loading, error } = useDiaryEntries();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (filter === 'conversation' && e.kind !== 'conversation') return false;
      if (filter === 'brain-health' && e.kind !== 'brain-health') return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.searchText.includes(q) ||
        (e.reference ?? '').toLowerCase().includes(q)
      );
    });
  }, [entries, query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, DiaryEntry[]>();
    for (const e of filtered) {
      const k = dayKey(e.at);
      const list = map.get(k) ?? [];
      list.push(e);
      map.set(k, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <LaunchLayout>
      <LaunchHeroBand
        eyebrow="My Diary"
        title="Nothing gets lost"
        subtitle="Every conversation I captured, every snapshot I took, every step I finished — kept in date order and searchable."
      />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-launch-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search my diary — a word, a name, or a reference like MB-260903-A1"
            aria-label="Search my diary"
            className="w-full min-h-[56px] pl-11 pr-4 rounded-2xl bg-launch-ivory border border-launch-gold/30 text-base text-launch-ink placeholder:text-launch-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launch-ember"
          />
        </div>

        {/* Filters — three, no more */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`min-h-[44px] px-4 rounded-full text-sm font-medium border transition-colors ${
                filter === f.key
                  ? 'bg-launch-teal text-white border-launch-teal'
                  : 'bg-launch-ivory text-launch-ink/70 border-launch-gold/30 hover:bg-launch-cream'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-launch-ink/60 py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Gathering my diary…
          </div>
        )}

        {error && (
          <LaunchCard className="bg-launch-ivory border-launch-gold/30">
            <p className="text-sm text-launch-ink/70">
              I couldn't open my diary just now. {error}
            </p>
          </LaunchCard>
        )}

        {!loading && !error && filtered.length === 0 && (
          <LaunchCard className="bg-launch-ivory border-launch-gold/30">
            <h3 className="font-semibold text-launch-ink mb-1">
              {entries.length === 0 ? 'My diary starts today' : 'Nothing matches that'}
            </h3>
            <p className="text-sm text-launch-ink/65">
              {entries.length === 0
                ? 'Every conversation I capture, every brain health snapshot I take, and every next step I finish will appear here — in date order, with a reference I can trace back to where it came from.'
                : 'Try a different word, or clear the search to see everything.'}
            </p>
          </LaunchCard>
        )}

        {/* Timeline */}
        {grouped.map(([day, items]) => (
          <section key={day} className="space-y-2">
            <h2 className="font-hind text-[11px] font-semibold uppercase tracking-[0.28em] text-launch-ink/55 pt-2">
              {longDate(items[0].at)}
            </h2>
            <ul className="space-y-2">
              {items.map((e) => {
                const Icon = ICON[e.kind];
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => navigate(e.href)}
                      className="w-full text-left min-h-[56px] flex items-start gap-3 p-4 rounded-2xl bg-launch-ivory border border-launch-gold/30 hover:bg-launch-cream transition-colors"
                    >
                      <span className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-launch-cream border border-launch-gold/30 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-launch-ember" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-launch-ink truncate">
                          {e.title}
                        </span>
                        <span className="block text-xs text-launch-ink/60 mt-0.5">
                          {e.detail}
                          {e.reference ? ` · ${e.reference}` : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </LaunchLayout>
  );
}
