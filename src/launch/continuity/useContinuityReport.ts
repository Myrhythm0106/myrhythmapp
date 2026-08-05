import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { useContinuityThread } from './useContinuityThread';
import { buildContinuityReport, type ContinuityReport, type ReportMode, type WindowDays } from './buildContinuityReport';

export interface UseContinuityReportOptions {
  windowDays: WindowDays;
  startDate?: string; // yyyy-mm-dd; defaults to account creation or today minus window
  mode?: ReportMode;
  memberNote?: string;
  includeDob?: boolean;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function inferStartDate(windowDays: WindowDays): string {
  // Default anchor: today minus windowDays, but not before 3 June 2026 per project timeline
  const anchor = new Date('2026-06-03');
  const fromToday = new Date();
  fromToday.setDate(fromToday.getDate() - windowDays);
  const start = fromToday < anchor ? anchor : fromToday;
  return start.toISOString().slice(0, 10);
}

export function useContinuityReport(options: UseContinuityReportOptions) {
  const { user } = useAuth();
  const { actions, goals } = useDailyActions();
  const { members } = useSupportCircle();
  const { history } = useContinuityThread();

  const [extractedActions, setExtractedActions] = useState<any[]>([]);
  const [supportNotes, setSupportNotes] = useState<any[]>([]);
  const [documentImports, setDocumentImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const startDate = options.startDate ?? inferStartDate(options.windowDays);
  const endDate = useMemo(() => addDays(startDate, options.windowDays - 1), [startDate, options.windowDays]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function load() {
      const [extracted, notes, imports] = await Promise.all([
        supabase
          .from('extracted_actions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', `${startDate}T00:00:00.000Z`)
          .lte('created_at', `${endDate}T23:59:59.999Z`)
          .order('created_at', { ascending: false }),
        supabase
          .from('support_member_action_notes')
          .select('*')
          .in(
            'action_id',
            (await supabase
              .from('extracted_actions')
              .select('id')
              .eq('user_id', user.id)
              .gte('created_at', `${startDate}T00:00:00.000Z`)
              .lte('created_at', `${endDate}T23:59:59.999Z`)
            )?.data?.map(r => r.id) ?? []
          )
          .order('created_at', { ascending: false }),
        supabase
          .from('document_import_audit')
          .select('*')
          .eq('user_id', user.id)
          .gte('approved_at', `${startDate}T00:00:00.000Z`)
          .lte('approved_at', `${endDate}T23:59:59.999Z`)
          .order('approved_at', { ascending: false }),
      ]);

      if (cancelled) return;

      setExtractedActions(extracted.data ?? []);
      setSupportNotes(notes.data ?? []);
      setDocumentImports(imports.data ?? []);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user, startDate, endDate]);

  const report: ContinuityReport | null = useMemo(() => {
    if (!user) return null;
    return buildContinuityReport({
      userName: user.email?.split('@')[0] ?? 'MyRhythm User',
      mode: options.mode ?? 'personal',
      windowDays: options.windowDays,
      startDate,
      endDate,
      dailyActions: actions,
      goals,
      extractedActions: extractedActions,
      supportMembers: members,
      supportNotes,
      documentImports,
      continuityHistory: history,
      memberNote: options.memberNote,
      includeDob: options.includeDob,
    });
  }, [user, actions, goals, extractedActions, members, supportNotes, documentImports, history, startDate, endDate, options.mode, options.memberNote, options.includeDob, options.windowDays]);

  const isEmptyWindow = useMemo(() => {
    if (loading) return false;
    const today = new Date().toISOString().slice(0, 10);
    return endDate > today;
  }, [loading, endDate]);

  return { report, loading, startDate, endDate, isEmptyWindow };
}
