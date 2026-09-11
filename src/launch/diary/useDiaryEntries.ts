import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { listAssessmentRuns } from '@/launch/assessment/assessmentHistory';

export type DiaryKind = 'conversation' | 'brain-health' | 'step';

export interface DiaryEntry {
  id: string;
  kind: DiaryKind;
  /** ISO timestamp used for ordering */
  at: string;
  title: string;
  /** One short line under the title */
  detail: string;
  /** Human reference code where one exists (MB-YYMMDD-XX) */
  reference?: string | null;
  /** Where tapping the row goes */
  href: string;
  /** Free text folded into search */
  searchText: string;
}

function safeDate(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) if (c) return c;
  return new Date(0).toISOString();
}

/**
 * One time-ordered trail of everything that has happened: conversations
 * captured, brain-health snapshots, and next steps finished. Reads what is
 * already stored — no new tables.
 */
export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const [recordingsRes, actionsRes, runs] = await Promise.all([
        supabase
          .from('meeting_recordings')
          .select(
            'id, meeting_title, meeting_context, reference_code, created_at, started_at, transcript, transcript_deleted_at, source_state, processing_status'
          )
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('extracted_actions')
          .select('id, action_text, reference_code, completion_date, updated_at, status, meeting_recording_id')
          .eq('user_id', userId)
          .not('completion_date', 'is', null)
          .order('completion_date', { ascending: false })
          .limit(200),
        listAssessmentRuns(50),
      ]);

      const out: DiaryEntry[] = [];

      for (const r of recordingsRes.data ?? []) {
        const hasWriteUp = !!r.transcript && !r.transcript_deleted_at;
        out.push({
          id: `rec-${r.id}`,
          kind: 'conversation',
          at: safeDate(r.started_at as string, r.created_at as string),
          title: (r.meeting_title as string) || 'A conversation I captured',
          detail: hasWriteUp
            ? 'Write-up saved'
            : r.processing_status === 'processing'
            ? 'Still being written up'
            : 'Summary kept — audio released',
          reference: (r.reference_code as string) ?? null,
          href: `/launch/memory/result/${r.id}`,
          searchText: [r.meeting_title, r.meeting_context, r.reference_code, r.transcript]
            .filter(Boolean)
            .join(' ')
            .toLowerCase(),
        });
      }

      for (const a of actionsRes.data ?? []) {
        out.push({
          id: `act-${a.id}`,
          kind: 'step',
          at: safeDate(a.completion_date as string, a.updated_at as string),
          title: (a.action_text as string) || 'A next step I finished',
          detail: 'Next step finished',
          reference: (a.reference_code as string) ?? null,
          href: a.meeting_recording_id
            ? `/launch/memory/result/${a.meeting_recording_id}`
            : '/launch/commit',
          searchText: [a.action_text, a.reference_code].filter(Boolean).join(' ').toLowerCase(),
        });
      }

      for (const run of runs) {
        out.push({
          id: `run-${run.id}`,
          kind: 'brain-health',
          at: safeDate(run.completedAt, run.createdAt),
          title: 'My brain health snapshot',
          detail: `Score ${run.total} out of 100`,
          href: '/launch/assessment/history',
          searchText: `brain health snapshot score ${run.total}`,
        });
      }

      out.sort((a, b) => (a.at < b.at ? 1 : -1));
      setEntries(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong loading my diary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { entries, loading, error, reload: load };
}
