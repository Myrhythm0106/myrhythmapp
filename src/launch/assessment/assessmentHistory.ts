import { supabase } from '@/integrations/supabase/client';
import type { BrainHealthScore } from '@/data/launchAssessmentBanks';

export interface StoredAssessmentRun {
  id: string;
  createdAt: string;
  completedAt: string | null;
  total: number;
  scores: BrainHealthScore | null;
  results: Record<string, unknown>;
}

/**
 * Persist a completed assessment run so it can be re-taken and compared later.
 * Silently no-ops when there's no signed-in user (tester / bypass mode) — the
 * local snapshot in localStorage is always written by the caller regardless.
 */
export async function saveAssessmentRun(params: {
  persona: string | null;
  answers: Record<string, unknown>;
  freeform: Record<string, string>;
  eventRecency: string | null;
  results: Record<string, unknown>;
  brainHealthScore: BrainHealthScore;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return { ok: false, error: 'not-signed-in' };

    const { error } = await supabase.from('assessment_results').insert({
      user_id: userId,
      assessment_type: 'myrhythm-brief',
      responses: params.answers as never,
      scores: params.brainHealthScore as never,
      recommendations: {} as never,
      raw_assessment_data: params.results as never,
      freeform_notes: params.freeform as never,
      event_recency: params.eventRecency,
      completion_status: 'completed',
      completed_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'unknown' };
  }
}

/** Past completed runs, newest first. */
export async function listAssessmentRuns(limit = 10): Promise<StoredAssessmentRun[]> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;
  if (!userId) return [];

  const { data, error } = await supabase
    .from('assessment_results')
    .select('id, created_at, completed_at, scores, raw_assessment_data')
    .eq('user_id', userId)
    .eq('completion_status', 'completed')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const scores = (row.scores ?? null) as BrainHealthScore | null;
    return {
      id: row.id as string,
      createdAt: row.created_at as string,
      completedAt: (row.completed_at as string | null) ?? null,
      total: typeof scores?.total === 'number' ? scores.total : 0,
      scores,
      results: (row.raw_assessment_data ?? {}) as Record<string, unknown>,
    };
  });
}
